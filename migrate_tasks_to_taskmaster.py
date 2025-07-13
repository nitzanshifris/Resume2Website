#!/usr/bin/env python3
"""
Migrate tasks from local Python TaskMaster to official TaskMaster AI
"""

import json
import subprocess
import time
import sys

def load_local_tasks():
    """Load tasks from local TaskMaster"""
    with open('.taskmaster/tasks/active-tasks.json', 'r') as f:
        data = json.load(f)
    return data['tasks']

def get_priority_mapping(priority):
    """Map local priority to TaskMaster AI priority"""
    mapping = {
        'critical': 'high',
        'high': 'high',
        'medium': 'medium',
        'low': 'low'
    }
    return mapping.get(priority, 'medium')

def migrate_tasks():
    """Migrate all tasks to TaskMaster AI"""
    # Load local tasks
    local_tasks = load_local_tasks()
    print(f"Found {len(local_tasks)} tasks to migrate\n")
    
    # Sort by ID to maintain order
    local_tasks.sort(key=lambda x: x['id'])
    
    success_count = 0
    failed_tasks = []
    
    for i, task in enumerate(local_tasks, 1):
        print(f"[{i}/{len(local_tasks)}] Migrating: {task['title']}")
        
        # Prepare the command
        priority = get_priority_mapping(task['priority'])
        prompt = f"{task['title']}. {task['description']}"
        
        # Limit prompt length to avoid issues
        if len(prompt) > 500:
            prompt = prompt[:497] + "..."
        
        cmd = [
            'task-master', 'add-task',
            '--prompt', prompt,
            '--priority', priority
        ]
        
        try:
            # Execute the command
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"   ✓ Successfully migrated task #{task['id']}")
                success_count += 1
            else:
                print(f"   ✗ Failed to migrate task #{task['id']}")
                print(f"     Error: {result.stderr}")
                failed_tasks.append(task)
            
            # Add a small delay to avoid overwhelming the API
            time.sleep(2)
            
        except subprocess.TimeoutExpired:
            print(f"   ✗ Timeout while migrating task #{task['id']}")
            failed_tasks.append(task)
        except Exception as e:
            print(f"   ✗ Error migrating task #{task['id']}: {str(e)}")
            failed_tasks.append(task)
    
    # Summary
    print("\n" + "="*50)
    print(f"Migration Complete!")
    print(f"Successfully migrated: {success_count}/{len(local_tasks)} tasks")
    
    if failed_tasks:
        print(f"\nFailed to migrate {len(failed_tasks)} tasks:")
        for task in failed_tasks:
            print(f"  - Task #{task['id']}: {task['title']}")
        
        # Save failed tasks for manual review
        with open('failed_task_migration.json', 'w') as f:
            json.dump(failed_tasks, f, indent=2)
        print("\nFailed tasks saved to 'failed_task_migration.json' for manual review")
    
    print("\nNext steps:")
    print("1. Run 'task-master list' to see all migrated tasks")
    print("2. Run 'task-master analyze-complexity --research' to analyze task complexity")
    print("3. Run 'task-master expand --all --research' to expand tasks into subtasks")

def main():
    """Main migration function"""
    print("TaskMaster Migration Tool")
    print("========================\n")
    
    # Check if local tasks file exists
    try:
        with open('.taskmaster/tasks/active-tasks.json', 'r') as f:
            data = json.load(f)
            task_count = len(data['tasks'])
    except FileNotFoundError:
        print("Error: Local TaskMaster tasks file not found at .taskmaster/tasks/active-tasks.json")
        sys.exit(1)
    except json.JSONDecodeError:
        print("Error: Invalid JSON in local tasks file")
        sys.exit(1)
    
    print(f"This will migrate {task_count} tasks from your local TaskMaster to TaskMaster AI.")
    print("Each task will be added using the 'task-master add-task' command.")
    print(f"Estimated time: ~{task_count * 3} seconds\n")
    
    response = input("Do you want to proceed? (y/N): ")
    if response.lower() != 'y':
        print("Migration cancelled.")
        sys.exit(0)
    
    print("\nStarting migration...\n")
    migrate_tasks()

if __name__ == "__main__":
    main()