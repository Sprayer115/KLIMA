import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import numpy as np
from pathlib import Path

def load_cups_data(file_path):
    """Load and preprocess CUPS analysis data"""
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Convert timestamps list to DataFrame
    df = pd.DataFrame(data['timestamps'])
    
    # Convert timestamp strings to datetime
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    
    # Ensure timePassed is present
    if 'timePassed' not in df.columns:
        print("Warning: timePassed not found in data. Please run the update script first.")
        return None
        
    return df

def analyze_cups_data(df):
    """Create various visualizations of CUPS data"""
    # Set figure style
    plt.style.use('default')
    sns.set_theme(style="whitegrid")
    
    # Create figure with multiple subplots
    fig = plt.figure(figsize=(20, 15))
    
    # 1. Total Time per State
    ax1 = plt.subplot(2, 2, 1)
    state_durations = df.groupby('state')['timePassed'].sum()
    state_durations.plot(kind='bar', ax=ax1)
    ax1.set_title('Total Time Spent per State', pad=20)
    ax1.set_xlabel('State')
    ax1.set_ylabel('Time (seconds)')
    plt.xticks(rotation=45, ha='right')
    
    # Calculate percentages for annotation
    total_time = state_durations.sum()
    percentages = (state_durations / total_time * 100).round(1)
    
    # Add percentage labels using iloc for positional indexing
    for i in range(len(state_durations)):
        ax1.text(i, state_durations.iloc[i], f'\n{percentages.iloc[i]}%', ha='center')
    
    # 2. State Transitions Visualization
    ax2 = plt.subplot(2, 2, 2)

    # Create transitions series to see actual transitions that occurred
    transitions_list = []
    for i in range(len(df)-1):
        from_state = df.iloc[i]['state']
        to_state = df.iloc[i+1]['state']
        transitions_list.append(f"{from_state} → {to_state}")

    transitions = pd.Series(transitions_list).value_counts()

    # Plot the top transitions as a horizontal bar chart
    transitions.head(10).plot(kind='barh', ax=ax2)
    ax2.set_title('Most Common State Transitions', pad=20)
    ax2.set_xlabel('Number of Transitions')
    ax2.set_ylabel('State Transition')

    # Adjust labels to be more readable
    plt.xticks(rotation=0)
    plt.yticks(rotation=0)

    # Add value annotations to the bars
    for i, v in enumerate(transitions.head(10)):
        ax2.text(v, i, f" {v}", va='center')
    
    # 3. State Timeline
    ax3 = plt.subplot(2, 2, 3)
    
    # Create a categorical color map for states
    unique_states = df['state'].unique()
    color_map = dict(zip(unique_states, plt.cm.Set3(np.linspace(0, 1, len(unique_states)))))
    
    # Plot segments for each state
    current_time = 0
    for _, row in df.iterrows():
        if pd.notna(row['timePassed']):  # Check if timePassed is not NaN
            ax3.barh(y=0, 
                    width=row['timePassed'],
                    left=current_time,
                    color=color_map[row['state']],
                    label=row['state'])
            current_time += row['timePassed']
    
    # Remove duplicate labels
    handles, labels = ax3.get_legend_handles_labels()
    by_label = dict(zip(labels, handles))
    ax3.legend(by_label.values(), by_label.keys(), 
              bbox_to_anchor=(1.05, 1), loc='upper left')
    
    ax3.set_title('State Timeline', pad=20)
    ax3.set_xlabel('Time (seconds)')
    ax3.set_yticks([])  # Remove y-axis ticks
    
    # 4. Average Duration per State
    ax4 = plt.subplot(2, 2, 4)
    avg_duration = df.groupby('state')['timePassed'].mean()
    avg_duration.plot(kind='bar', ax=ax4)
    ax4.set_title('Average Duration per State', pad=20)
    ax4.set_xlabel('State')
    ax4.set_ylabel('Average Time (seconds)')
    plt.xticks(rotation=45, ha='right')
    
    # Add average time labels using iloc for positional indexing
    for i in range(len(avg_duration)):
        ax4.text(i, avg_duration.iloc[i], f'\n{avg_duration.iloc[i]:.1f}s', ha='center')
    
    # Adjust layout
    plt.tight_layout()
    
    # Generate summary statistics
    summary = {
        'total_duration': total_time,
        'most_frequent_state': df['state'].mode().iloc[0],
        'longest_state': state_durations.idxmax(),
        'average_state_duration': df['timePassed'].mean(),
        'number_of_transitions': len(df) - 1,
        'state_distribution': {
            state: f"{percentage:.1f}%" 
            for state, percentage in percentages.items()
        }
    }
    
    return fig, summary

def save_analysis(file_path):
    """Load data, create visualizations, and save results"""
    # Load data
    df = load_cups_data(file_path)
    if df is None:
        return
    
    # Create analysis
    fig, summary = analyze_cups_data(df)
    
    # Create output directory
    output_dir = Path(file_path).parent / 'analysis'
    output_dir.mkdir(exist_ok=True)
    
    # Save plot
    plot_path = output_dir / f'cups_analysis_{datetime.now().strftime("%Y%m%d_%H%M%S")}.png'
    fig.savefig(plot_path, bbox_inches='tight', dpi=300)
    plt.close(fig)
    
    # Save summary
    summary_path = output_dir / f'cups_summary_{datetime.now().strftime("%Y%m%d_%H%M%S")}.txt'
    with open(summary_path, 'w') as f:
        f.write("CUPS Analysis Summary\n")
        f.write("===================\n\n")
        f.write(f"Total Duration: {summary['total_duration']:.1f} seconds\n")
        f.write(f"Most Frequent State: {summary['most_frequent_state']}\n")
        f.write(f"Longest Total Duration State: {summary['longest_state']}\n")
        f.write(f"Average State Duration: {summary['average_state_duration']:.1f} seconds\n")
        f.write(f"Number of State Transitions: {summary['number_of_transitions']}\n\n")
        f.write("State Distribution:\n")
        for state, percentage in summary['state_distribution'].items():
            f.write(f"  {state}: {percentage}\n")
    
    print(f"Analysis saved to:\n{plot_path}\n{summary_path}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        # Use the most recent cups_analysis file in current directory
        json_files = list(Path('autosave').glob('cups_analysis_*.json'))
        if not json_files:
            print("No CUPS analysis files found!")
            sys.exit(1)
        file_path = max(json_files, key=lambda p: p.stat().st_mtime)
    
    save_analysis(file_path)