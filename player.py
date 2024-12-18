import tkinter as tk
from tkinter import filedialog, messagebox
import cv2
from PIL import Image, ImageTk
import json
from datetime import datetime, timedelta
import os
import atexit
from pathlib import Path

class VideoAnalyzer:
    
    def __init__(self, root):
        self.root = root
        self.root.title("CUPS Video Analyzer")
        
        # Configure root window to expand
        self.root.grid_rowconfigure(1, weight=1)
        self.root.grid_columnconfigure(0, weight=1)
        self.fast_play_mod = 1
        
        # Video variables
        self.cap = None
        self.current_frame = None
        self.playing = False
        self.current_time = 0
        self.video_path = None
        self.target_width = 1280  # Increased default size
        self.target_height = 720
        
        # Add last state tracking
        self.last_state = None
        
        # Data storage [gleich wie vorher]
        self.timestamps = []
        self.cups_states = {
            'Thinking/Verifying Suggestion': 'A',
            'Deferring thought for later': 'D', 
            'Thinking about New Code': 'F',
            'Prompt crafting': 'V',
            'Looking up Documentation': 'N',
            'Not Thinking': 'S',
            'Waiting For Suggestion': 'G',
            'Writing New Functionality': 'Z',
            'Editing Last Suggestion': 'X',
            'Editing Written Code': 'C',
            'Writing Documentation': 'B',
            'Debugging/Testing Code': 'H'
        }
        
        # Autosave setup [gleich wie vorher]
        self.autosave_dir = Path("autosave")
        self.autosave_dir.mkdir(exist_ok=True)
        self.autosave_interval = 30000  # 30 seconds
        
        # Register cleanup function
        atexit.register(self.cleanup)

        
        # Bind resize event
        #self.setup_styles()  # Neue Zeile
        self.setup_ui()
        self.setup_keybinds()  # Neue Zeile
        self.load_autosave()
        self.schedule_autosave()
        self.root.bind('<Configure>', self.on_window_resize)

    def record_state(self, state):
        """Record a CUPS state with current timestamp"""
        timestamp = {
            'time': self.current_time,
            'state': state,
            'state_code': self.cups_states[state],
            'timestamp': datetime.now().isoformat(),
            'video_path': self.video_path
        }
        self.timestamps.append(timestamp)
        # Update last state display
        self.last_state = state
        self.update_last_state_display()
        print(f"Recorded state: {state} at {self.current_time:.2f}s")
        self.perform_autosave()

    def update_last_state_display(self):
        """Update the last state display label"""
        if hasattr(self, 'last_state_label'):
            state_text = f"Last State: {self.last_state}" if self.last_state else "No state recorded"
            self.last_state_label.config(text=state_text)
        
    def cleanup(self):
        """Cleanup function called when program exits"""
        if self.cap is not None:
            self.cap.release()
        self.perform_autosave()
        #
    def load_video(self):
        """Lädt ein Video über den Datei-Dialog"""
        video_path = filedialog.askopenfilename(filetypes=[("Video files", "*.mp4;*.avi")])
        if video_path:
            self.video_path = video_path
            if self.cap is not None:
                self.cap.release()
            self.cap = cv2.VideoCapture(video_path)
            self.path_label.config(text=f"Current video: {video_path}")
            self.update_frame()
            self.perform_autosave()
            
    def update_time_display(self):
        """Aktualisiert die Zeitanzeige im Interface"""
        time_str = str(timedelta(seconds=int(self.current_time)))
        self.time_label.config(text=time_str)
    
    
    def save_data(self):
        """Speichert die erfassten Daten in eine JSON-Datei"""
        if not self.timestamps:
            messagebox.showwarning("No Data", "No timestamps to save!")
            return
                
        file_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            initialfile=f"cups_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )
        if file_path:
            try:
                with open(file_path, 'w') as f:
                    json.dump({
                        'timestamps': self.timestamps,
                        'video_path': self.video_path,
                        'export_time': datetime.now().isoformat()
                    }, f, indent=2)
                messagebox.showinfo("Success", f"Data saved to {file_path}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save data: {str(e)}")

    def perform_autosave(self):
        """Führt die automatische Sicherung durch"""
        try:
            autosave_data = {
                'timestamps': self.timestamps,
                'video_path': self.video_path,
                'last_save': datetime.now().isoformat()
            }
            
            with open(self.get_autosave_path(), 'w') as f:
                json.dump(autosave_data, f, indent=2)
            print(f"Autosaved at {datetime.now().strftime('%H:%M:%S')}")
        except Exception as e:
            print(f"Autosave failed: {str(e)}")

    def get_autosave_path(self):
        """Gibt den Pfad für die Autosave-Datei zurück"""
        return self.autosave_dir / "cups_analysis_autosave.json"

    def schedule_autosave(self):
        """Plant den nächsten Autosave"""
        self.perform_autosave()
        self.root.after(self.autosave_interval, self.schedule_autosave)

    def load_autosave(self):
        """Lädt Daten aus dem Autosave wenn vorhanden"""
        try:
            autosave_path = self.get_autosave_path()
            if autosave_path.exists():
                with open(autosave_path, 'r') as f:
                    data = json.load(f)
                    self.timestamps = data.get('timestamps', [])
                    saved_video = data.get('video_path')
                    if saved_video:
                        self.video_path = saved_video
                        self.path_label.config(text=f"Current video: {saved_video}")
                    
                    last_save = data.get('last_save', '')
                    if last_save:
                        messagebox.showinfo(
                            "Autosave Loaded", 
                            f"Restored {len(self.timestamps)} timestamps from autosave\nLast save: {last_save}"
                        )
        except Exception as e:
            print(f"Failed to load autosave: {str(e)}")

    def toggle_play(self):
        """Wechselt zwischen Play und Pause"""
        self.playing = not self.playing
        if self.playing:
            self.update_frame()
            
    def seek(self, seconds):
        """Generic seek function for both forward and backward"""
        if self.cap is not None:
            current_pos = self.cap.get(cv2.CAP_PROP_POS_FRAMES)
            fps = self.cap.get(cv2.CAP_PROP_FPS)
            new_pos = max(0, current_pos + (seconds * fps))
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, new_pos)
            self.update_frame(force_resize=True)
            
    def setup_ui(self):
        # Main container
        self.main_container = tk.Frame(self.root)
        self.main_container.grid(row=0, column=0, sticky='nsew')
        self.main_container.grid_rowconfigure(1, weight=8)
        self.main_container.grid_rowconfigure(2, weight=2)
        self.main_container.grid_columnconfigure(0, weight=1)
        
        # Top control frame - store as instance variable
        self.control_frame = tk.Frame(self.main_container)
        self.control_frame.grid(row=0, column=0, pady=5, sticky='ew')
        
        # Apply styles to control buttons
        control_button_style = {
            'font': ('Arial', 10, 'bold'),
            'bg': '#2196F3',
            'fg': 'white',
            'activebackground': '#1976D2',
            'activeforeground': 'white',
            'relief': 'raised',
            'width': 10,
            'padx': 10,
            'pady': 5
        }
        
        # Navigation button style (different color)
        nav_button_style = {
            **control_button_style,
            'bg': '#4CAF50',
            'activebackground': '#388E3C',
            'width': 8
        }
        
        # Create a frame for video controls
        video_controls = tk.Frame(self.control_frame)
        video_controls.pack(side=tk.LEFT, padx=5)
        
        # Main control buttons
        tk.Button(video_controls, text="Load Video", command=self.load_video, **control_button_style).pack(side=tk.LEFT, padx=2)
        tk.Button(video_controls, text="Play/Pause", command=self.toggle_play, **control_button_style).pack(side=tk.LEFT, padx=2)
        
        # Navigation buttons
        nav_frame = tk.Frame(video_controls)
        nav_frame.pack(side=tk.LEFT, padx=5)
        
        tk.Button(nav_frame, text="⏪ -30s", command=lambda: self.seek(-30), **nav_button_style).pack(side=tk.LEFT, padx=2)
        tk.Button(nav_frame, text="⏪ -5s", command=lambda: self.seek(-5), **nav_button_style).pack(side=tk.LEFT, padx=2)
        tk.Button(nav_frame, text="⏩ +5s", command=lambda: self.seek(5), **nav_button_style).pack(side=tk.LEFT, padx=2)
        tk.Button(nav_frame, text="⏩ +30s", command=lambda: self.seek(30), **nav_button_style).pack(side=tk.LEFT, padx=2)
        
        tk.Button(video_controls, text="Save Data", command=self.save_data, **control_button_style).pack(side=tk.LEFT, padx=5)
        
        # Last state display
        self.last_state_label = tk.Label(
            self.control_frame,
            text="No state recorded",
            font=('Arial', 11, 'bold'),
            bg='#E3F2FD',
            padx=10,
            pady=5
        )
        self.last_state_label.pack(side=tk.LEFT, padx=10)
        
        # Video path display with improved style
        self.path_label = tk.Label(self.control_frame, 
                                  text="No video loaded", 
                                  wraplength=600,
                                  font=('Arial', 10))
        self.path_label.pack(side=tk.LEFT, padx=5)
        
        # Time display with improved style
        self.time_label = tk.Label(self.control_frame, 
                                  text="00:00:00",
                                  font=('Arial', 12, 'bold'))
        self.time_label.pack(side=tk.RIGHT, padx=5)
        
        # Video container frame
        video_container = tk.Frame(self.main_container, bg='black')
        video_container.grid(row=1, column=0, sticky='nsew')
        video_container.grid_rowconfigure(0, weight=1)
        video_container.grid_columnconfigure(0, weight=1)
        
        # Video frame
        self.video_frame = tk.Label(video_container, bg='black')
        self.video_frame.grid(row=0, column=0, sticky='nsew')
        
        # Bottom frame for CUPS state buttons
        states_frame = tk.Frame(self.main_container, bg='#f0f0f0', padx=10, pady=10)
        states_frame.grid(row=2, column=0, sticky='nsew')
        
        # Button styling by category
        button_groups = {
            'Thinking': ['#E3F2FD', '#2196F3'],  # Light blue
            'Writing': ['#E8F5E9', '#4CAF50'],   # Light green
            'Editing': ['#FFF3E0', '#FF9800'],   # Light orange
            'Other': ['#F3E5F5', '#9C27B0']      # Light purple
        }
        
        # Map states to their groups
        state_groups = {
            'Thinking/Verifying Suggestion': 'Thinking',
            'Thinking about New Code': 'Thinking',
            'Deferring thought for later': 'Thinking',
            'Writing New Functionality': 'Writing',
            'Writing Documentation': 'Writing',
            'Prompt crafting': 'Writing',
            'Editing Last Suggestion': 'Editing',
            'Editing Written Code': 'Editing',
            'Debugging/Testing Code': 'Other',
            'Looking up Documentation': 'Other',
            'Waiting For Suggestion': 'Other',
            'Not Thinking': 'Other'
        }

        # Create buttons with styling
        button_width = 25
        button_height = 2
        
        for i, (state, code) in enumerate(self.cups_states.items()):
            row = i // 3
            col = i % 3
            
            group = state_groups[state]
            bg_color, fg_color = button_groups[group]
            
            btn = tk.Button(
                states_frame,
                text=f"{state}\n({code})",
                command=lambda s=state: self.record_state(s),
                bg=bg_color,
                fg='black',
                activebackground=fg_color,
                activeforeground='white',
                font=('Arial', 10, 'bold'),
                width=button_width,
                height=button_height,
                relief='raised',
                bd=2
            )
            
            # Add hover effect
            btn.bind('<Enter>', lambda e, b=btn, c=fg_color: self.on_button_hover(b, c))
            btn.bind('<Leave>', lambda e, b=btn, c=bg_color: self.on_button_leave(b, c))
            
            btn.grid(row=row, column=col, padx=5, pady=5, sticky='nsew')
            states_frame.grid_columnconfigure(col, weight=1)

    def on_window_resize(self, event):
        if (event.widget == self.root):
            # Update video frame size based on window size
            # Keep aspect ratio 16:9
            width = event.width - 40  # Padding
            height = int(width * 9/16)
            
            # Update target size for video resizing
            self.target_width = width
            self.target_height = height
            
            # If there's a current frame, update it
            if self.current_frame is not None:
                self.update_frame(force_resize=True)
                
    def setup_keybinds(self):
        """Konfiguriert Tastaturkürzel"""
        self.root.bind('<space>', lambda e: self.toggle_play())
        self.root.bind('<Right>', lambda e: self.seek(5))
        self.root.bind('<Left>', lambda e: self.seek(-5))
        self.root.bind('<Shift-Right>', lambda e: self.seek(30))
        self.root.bind('<Shift-Left>', lambda e: self.seek(-30))
        self.root.bind('<Shift-D>', lambda e: self.toggle_fast_play())
        self.root.bind('<Shift-F>', lambda e: self.toggle_fast_play(8))
        
        # Tastenkürzel für CUPS States
        for state, code in self.cups_states.items():
            self.root.bind(code.lower(), lambda e, s=state: self.record_state(s))
                
    def seek_forward(self):
        """Springt 5 Sekunden vorwärts"""
        if self.cap is not None:
            current_pos = self.cap.get(cv2.CAP_PROP_POS_FRAMES)
            fps = self.cap.get(cv2.CAP_PROP_FPS)
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, current_pos + (5 * fps))
            self.update_frame(force_resize=True)

    def seek_backward(self):
        """Springt 5 Sekunden zurück"""
        if self.cap is not None:
            current_pos = self.cap.get(cv2.CAP_PROP_POS_FRAMES)
            fps = self.cap.get(cv2.CAP_PROP_FPS)
            new_pos = max(0, current_pos - (5 * fps))
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, new_pos)
            self.update_frame(force_resize=True)

    def toggle_fast_play(self, factor=1):
        """Wechselt zwischen normaler und schneller Wiedergabe"""
        if not hasattr(self, 'fast_play'):
            self.fast_play = False
        self.fast_play = not self.fast_play
        self.fast_play_mod = factor
        # Update das Wiedergabeintervall
        if self.playing:
            self.root.after_cancel(self._after_id)
            self.update_frame()
            
    def update_frame(self, force_resize=False):
        if self.cap is not None and (self.playing or force_resize):
            if self.playing:
                ret, frame = self.cap.read()
                if hasattr(self, 'fast_play') and self.fast_play:
                    # Im schnellen Modus jeden zweiten Frame überspringen
                    for _ in range(self.fast_play_mod - 1):
                        self.cap.read()
            else:
                # If we're just resizing, reuse current frame
                frame = self.current_frame
                ret = frame is not None
                
            if ret:
                self.current_frame = frame
                # Update current time
                if self.playing:
                    self.current_time = self.cap.get(cv2.CAP_PROP_POS_MSEC) / 1000
                    self.update_time_display()
                
                # Convert frame for display
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Resize frame to fit window while maintaining aspect ratio
                frame_height, frame_width = frame.shape[:2]
                scaling = min(self.target_width/frame_width, self.target_height/frame_height)
                new_width = int(frame_width * scaling)
                new_height = int(frame_height * scaling)
                
                frame = cv2.resize(frame, (new_width, new_height))
                img = Image.fromarray(frame)
                imgtk = ImageTk.PhotoImage(image=img)
                self.video_frame.imgtk = imgtk
                self.video_frame.configure(image=imgtk)
                
                if self.playing:
                    interval = 15 if hasattr(self, 'fast_play') and self.fast_play else 30
                    self._after_id = self.root.after(interval, self.update_frame)

    def setup_styles(self):
        """Setup styles for the UI elements"""
        # Style for control buttons
        control_button_style = {
            'font': ('Arial', 10, 'bold'),
            'bg': '#2196F3',  # Material Blue
            'fg': 'white',
            'activebackground': '#1976D2',
            'activeforeground': 'white',
            'relief': 'raised',
            'width': 10,
            'padx': 10,
            'pady': 5
        }
        
        # Apply styles to control buttons
        for widget in self.control_frame.winfo_children():
            if isinstance(widget, tk.Button):
                widget.configure(**control_button_style)

    def on_button_hover(self, button, color):
        """Handle button hover effect"""
        button.configure(
            bg=color,
            fg='white'
        )

    def on_button_leave(self, button, color):
        """Handle button hover effect removal"""
        button.configure(
            bg=color,
            fg='black'
        )

    # [Rest der Klasse bleibt gleich...]

if __name__ == "__main__":
    root = tk.Tk()
    # Set minimum window size
    root.minsize(800, 600)
    # Start with a reasonable window size
    root.geometry("1400x1080")
    app = VideoAnalyzer(root)
    root.mainloop()