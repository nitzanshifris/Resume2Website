#!/usr/bin/env python3
"""
Quickly add all cleanup tasks to TaskMaster AI by directly updating tasks.json
"""

import json
from datetime import datetime

def main():
    # Load cleanup tasks
    with open('create_cleanup_tasks.json', 'r') as f:
        cleanup_data = json.load(f)
    
    # Load existing TaskMaster tasks
    with open('.taskmaster/tasks/tasks.json', 'r') as f:
        taskmaster_data = json.load(f)
    
    # Get existing tasks
    existing_tasks = taskmaster_data['master']['tasks']
    next_id = max([t['id'] for t in existing_tasks], default=0) + 1
    
    # Convert cleanup tasks to TaskMaster format
    new_tasks = []
    for i, task in enumerate(cleanup_data['cleanup_tasks'], start=next_id):
        new_task = {
            "id": i,
            "title": task['title'],
            "description": task['description'],
            "details": "",
            "testStrategy": "",
            "status": "pending",
            "dependencies": [],
            "priority": task['priority'],
            "subtasks": []
        }
        new_tasks.append(new_task)
    
    # Add all new tasks
    taskmaster_data['master']['tasks'].extend(new_tasks)
    taskmaster_data['master']['metadata']['totalTasks'] = len(taskmaster_data['master']['tasks'])
    taskmaster_data['master']['metadata']['updated'] = datetime.now().isoformat() + 'Z'
    
    # Save updated tasks
    with open('.taskmaster/tasks/tasks.json', 'w') as f:
        json.dump(taskmaster_data, f, indent=2)
    
    print(f"✅ Successfully added {len(new_tasks)} cleanup tasks!")
    print(f"Total tasks: {len(taskmaster_data['master']['tasks'])}")
    print("\nNext steps:")
    print("1. Run 'task-master list' to see all tasks")
    print("2. Run 'task-master generate' to create task files")
    print("3. Run 'task-master analyze-complexity --research'")
    print("4. Run 'task-master expand --all --research'")

if __name__ == "__main__":
    main()