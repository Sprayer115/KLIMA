import json
import glob
import os
from datetime import datetime
from pathlib import Path

def parse_timestamp(ts_str):
    """Parse ISO timestamp string to datetime object"""
    return datetime.fromisoformat(ts_str)

def update_cups_data(file_path):
    """Updates a CUPS analysis JSON file to include timePassed"""
    try:
        # Read the existing file
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        timestamps = data.get('timestamps', [])
        last_save = data.get('last_save')
        
        # Update each entry
        for i, entry in enumerate(timestamps):
            if i == len(timestamps) - 1:
                # For the last entry, calculate duration until last_save
                if last_save:
                    # Convert both timestamps to datetime objects
                    state_time = parse_timestamp(entry['timestamp'])
                    save_time = parse_timestamp(last_save)
                    # Calculate difference in seconds
                    time_diff = (save_time - state_time).total_seconds()
                    entry['timePassed'] = round(time_diff, 2)
                else:
                    # If no last_save timestamp available, mark as incomplete
                    entry['timePassed'] = None
            else:
                # For all other entries, calculate duration until next state
                current_time = entry['time']
                next_time = timestamps[i + 1]['time']
                entry['timePassed'] = round(next_time - current_time, 2)
        
        # Create backup of original file
        backup_path = file_path.replace('.json', '_backup.json')
        with open(backup_path, 'w') as f:
            json.dump(data, f, indent=2)
            
        # Save updated data
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
            
        print(f"Successfully updated {file_path}")
        print(f"Backup saved as {backup_path}")
        
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")

def update_all_files(directory):
    """Updates all CUPS analysis JSON files in a directory"""
    # Find all JSON files in directory
    json_files = glob.glob(os.path.join(directory, "cups_analysis_*.json"))
    
    if not json_files:
        print(f"No CUPS analysis files found in {directory}")
        return
        
    print(f"Found {len(json_files)} files to update")
    
    for file_path in json_files:
        update_cups_data(file_path)
        
    print("\nUpdate complete!")

# Example usage
if __name__ == "__main__":
    # Specify the directory containing your CUPS analysis files
    directory = "C:/Users/iLux1/Nextcloud/Bachelorarbeit/KLIMA/Tasks/Analyse"  # Current directory - modify as needed
    update_all_files(directory)