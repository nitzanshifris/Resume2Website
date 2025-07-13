#!/usr/bin/env python3
"""
Batch migrate tasks from local Python TaskMaster to official TaskMaster AI
This version creates a direct tasks.json file for faster migration
"""

import json
import shutil
from datetime import datetime

def load_local_tasks():
    """Load tasks from local TaskMaster"""
    with open('.taskmaster/tasks/active-tasks.json', 'r') as f:
        data = json.load(f)
    return data['tasks']

def convert_priority(priority):
    """Map local priority to TaskMaster AI priority"""
    mapping = {
        'critical': 'high',
        'high': 'high',
        'medium': 'medium',
        'low': 'low'
    }
    return mapping.get(priority, 'medium')

def convert_status(status):
    """Map local status to TaskMaster AI status"""
    # TaskMaster AI uses: pending, in-progress, done, deferred, cancelled, blocked
    return status if status in ['pending', 'in-progress', 'done'] else 'pending'

def create_taskmaster_task(local_task, new_id):
    """Convert local task format to TaskMaster AI format"""
    return {
        "id": new_id,
        "title": local_task['title'],
        "description": local_task['description'],
        "details": local_task.get('details', ''),
        "testStrategy": local_task.get('testStrategy', ''),
        "status": convert_status(local_task['status']),
        "dependencies": [],  # Reset dependencies as IDs will change
        "priority": convert_priority(local_task['priority']),
        "subtasks": []
    }

def migrate_tasks_batch():
    """Migrate all tasks by creating a new tasks.json file"""
    # Backup existing TaskMaster AI tasks
    try:
        shutil.copy('.taskmaster/tasks/tasks.json', '.taskmaster/tasks/tasks.json.backup')
        print("✓ Backed up existing tasks.json to tasks.json.backup")
    except FileNotFoundError:
        print("No existing tasks.json to backup")
    
    # Load local tasks
    local_tasks = load_local_tasks()
    print(f"\nFound {len(local_tasks)} tasks to migrate")
    
    # Load existing TaskMaster AI structure
    try:
        with open('.taskmaster/tasks/tasks.json', 'r') as f:
            taskmaster_data = json.load(f)
    except:
        taskmaster_data = {}
    
    # Get existing tasks if any
    if 'master' in taskmaster_data and 'tasks' in taskmaster_data['master']:
        existing_tasks = taskmaster_data['master']['tasks']
        next_id = max([t['id'] for t in existing_tasks], default=0) + 1
    else:
        existing_tasks = []
        next_id = 1
        # Initialize structure
        taskmaster_data['master'] = {
            'tasks': [],
            'metadata': {
                'projectName': 'CV2WEB V4 Cleanup',
                'totalTasks': 0,
                'sourceFile': 'migrated-from-local',
                'generatedAt': datetime.now().strftime('%Y-%m-%d'),
                'created': datetime.now().isoformat() + 'Z',
                'description': 'Tasks migrated from local TaskMaster',
                'updated': datetime.now().isoformat() + 'Z'
            }
        }
    
    # Convert and add all tasks
    migrated_tasks = []
    id_mapping = {}  # Map old IDs to new IDs
    
    for local_task in local_tasks:
        new_task = create_taskmaster_task(local_task, next_id)
        migrated_tasks.append(new_task)
        id_mapping[local_task['id']] = next_id
        next_id += 1
    
    # Update dependencies with new IDs
    for task in migrated_tasks:
        # This would require the original dependency info from local tasks
        # For now, we'll keep dependencies empty
        pass
    
    # Combine with existing tasks
    all_tasks = existing_tasks + migrated_tasks
    taskmaster_data['master']['tasks'] = all_tasks
    taskmaster_data['master']['metadata']['totalTasks'] = len(all_tasks)
    taskmaster_data['master']['metadata']['updated'] = datetime.now().isoformat() + 'Z'
    
    # Write the new tasks.json
    with open('.taskmaster/tasks/tasks.json', 'w') as f:
        json.dump(taskmaster_data, f, indent=2)
    
    print(f"\n✓ Successfully migrated {len(migrated_tasks)} tasks!")
    print(f"✓ Total tasks in TaskMaster AI: {len(all_tasks)}")
    
    # Create a migration report
    report = {
        'migration_date': datetime.now().isoformat(),
        'tasks_migrated': len(migrated_tasks),
        'total_tasks': len(all_tasks),
        'id_mapping': id_mapping
    }
    
    with open('.taskmaster/migration_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print("\n✓ Migration report saved to .taskmaster/migration_report.json")
    print("\nNext steps:")
    print("1. Run 'task-master list' to see all tasks")
    print("2. Run 'task-master generate' to create individual task files")
    print("3. Run 'task-master analyze-complexity --research' to analyze tasks")
    print("4. Run 'task-master expand --all --research' to create subtasks")

def main():
    """Main migration function"""
    print("TaskMaster Batch Migration Tool")
    print("==============================\n")
    
    # Check if local tasks file exists
    try:
        with open('.taskmaster/tasks/active-tasks.json', 'r') as f:
            data = json.load(f)
            task_count = len(data['tasks'])
    except FileNotFoundError:
        print("Error: Local TaskMaster tasks file not found")
        return
    
    print(f"This will migrate {task_count} tasks directly to TaskMaster AI's tasks.json")
    print("This is much faster than adding tasks one by one.")
    print(f"Existing tasks will be preserved.\n")
    
    response = input("Do you want to proceed? (y/N): ")
    if response.lower() != 'y':
        print("Migration cancelled.")
        return
    
    migrate_tasks_batch()

if __name__ == "__main__":
    main()