from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, Depends, status, Request
from pydantic import BaseModel
import sqlite3
from typing import List
from passlib.hash import bcrypt
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pathlib import Path
import json
import time

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
STORAGE_PATH = "storage/gamedata"
class UserCreate(BaseModel):
    email: str
    password: str
    role: str

class User(BaseModel):
    id: int
    email: str
    role: str
    
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class GameData(BaseModel):
    data: dict
    timestamp: float = None

SECRET_KEY = "VerySecret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 43200

def create_access_token(data: dict):
    expires = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    to_encode.update({"exp": expires})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")


def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        )
    """)
    # Create admin user if not exists
    cursor.execute(
        "INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)",
        ('admin@test.com', bcrypt.hash('admin'), 'admin')
    )
    conn.commit()
    conn.close()

@app.on_event("startup")
async def startup_event():
    init_db()

@app.post("/api/login")
async def login(request: Request):
    data = await request.json()
    return loginRequest(data)
    
def loginRequest(data):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    result = cursor.execute(
        "SELECT * FROM users WHERE email = ?", 
        (data['email'],)
    ).fetchone()
    conn.close()
    if result and bcrypt.verify(data['password'], result[2]):
        token = create_access_token({"sub": result[1], "role": result[3]})
        return {"token": token, "user": {"email": result[1], "role": result[3]}}
    else:
        raise HTTPException(status_code=400, detail="Invalid credentials")

@app.post("/api/register")
async def register(request: Request):
    data = await request.json()
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)", 
            (data['email'], bcrypt.hash(data['password']), 'user')
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    conn.close()
    # Login user after registration
    return loginRequest(data)



async def get_current_admin(auth: str = Depends(oauth2_scheme)):
    try:
        token = auth.split("Bearer ")[1] if auth.startswith("Bearer ") else auth
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        if not role or role != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
    except (JWTError, IndexError):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return payload

@app.get("/api/users", response_model=List[User])
async def get_users(current_admin = Depends(get_current_admin)):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    users = cursor.execute("SELECT id, email, role FROM users").fetchall()
    conn.close()
    return [{"id": user[0], "email": user[1], "role": user[2]} for user in users]

@app.post("/api/users", response_model=User)
async def create_user(user: UserCreate, current_admin = Depends(get_current_admin)):
    if user.role not in ["user", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role specified"
        )
    
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            (user.email, bcrypt.hash(user.password), user.role)
        )
        user_id = cursor.lastrowid
        conn.commit()
        
        created_user = cursor.execute(
            "SELECT id, email, role FROM users WHERE id = ?",
            (user_id,)
        ).fetchone()
        
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    conn.close()
    return {"id": created_user[0], "email": created_user[1], "role": created_user[2]}

@app.delete("/api/users/{user_id}")
async def delete_user(user_id: int, current_admin = Depends(get_current_admin)):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Check if user exists
    user = cursor.execute("SELECT role FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Don't allow deleting the last admin
    if user[0] == "admin":
        admin_count = cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'admin'").fetchone()[0]
        if admin_count <= 1:
            conn.close()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete the last admin user"
            )
    
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    
    return {"message": "User deleted successfully"}

@app.delete("/api/users/bulk/non-admin")
async def delete_non_admin_users(current_admin = Depends(get_current_admin)):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE role != 'admin'")
    conn.commit()
    conn.close()
    return {"message": "All non-admin users deleted"}

@app.post("/api/change-password")
async def change_password(
    request: Request,
    password_data: dict,
    current_user: dict = Depends(get_current_user)):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Verify current password
    cursor.execute(
        "SELECT password FROM users WHERE email = ?",
        (current_user["email"],)
    )
    stored_password = cursor.fetchone()[0]
    
    if not bcrypt.verify(password_data["current_password"], stored_password):
        raise HTTPException(status_code=400, detail="Aktuelles Passwort ist falsch")
    
    # Update password
    hashed_password = bcrypt.hash(password_data["new_password"])
    cursor.execute(
        "UPDATE users SET password = ? WHERE email = ?",
        (hashed_password, current_user["email"])
    )
    
    conn.commit()
    conn.close()
    
    return {"message": "Passwort erfolgreich geändert"}

@app.post("/api/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: dict = Depends(get_current_user)):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Verify current password
    cursor.execute(
        "SELECT password FROM users WHERE email = ?",
        (current_user["email"],)
    )
    stored_password = cursor.fetchone()[0]
    
    if not bcrypt.verify(password_data.current_password, stored_password):
        raise HTTPException(status_code=400, detail="Aktuelles Passwort ist falsch")
    
    # Update password
    hashed_password = bcrypt.hash(password_data.new_password)
    cursor.execute(
        "UPDATE users SET password = ? WHERE email = ?",
        (hashed_password, current_user["email"])
    )
    
    conn.commit()
    conn.close()
    
    return {"message": "Passwort erfolgreich geändert"}

@app.post("/api/save")
async def save_game_data(game_data: GameData, current_user: dict = Depends(get_current_user)):
    user_file = Path(f"{STORAGE_PATH}/{current_user['email']}.json")
    user_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Create backup
    if user_file.exists():
        backup_file = Path(f"{STORAGE_PATH}/backups/{current_user['email']}-{int(time.time())}.json")
        backup_file.parent.mkdir(parents=True, exist_ok=True)
        backup_file.write_text(user_file.read_text())
    
    # Add server timestamp if none provided
    if not game_data.timestamp:
        game_data.timestamp = datetime.now().timestamp()
        
    user_file.write_text(json.dumps({
        "data": game_data.data,
        "timestamp": game_data.timestamp
    }))
    
    return {"status": "success", "timestamp": game_data.timestamp}

@app.get("/api/load")
async def load_game_data(current_user: dict = Depends(get_current_user)):
    print(f"Loading data for user: {current_user['email']}")
    user_file = Path(f"{STORAGE_PATH}/{current_user['email']}.json")
    print(f"Checking if file exists: {user_file} exists: {user_file.exists()}")
    if not user_file.exists():
        return {"data": {}, "timestamp": datetime.now().timestamp()}
        
    stored_data = json.loads(user_file.read_text())
    return {
        "data": stored_data.get("data", {}),
        "timestamp": stored_data.get("timestamp", datetime.now().timestamp())
    }
