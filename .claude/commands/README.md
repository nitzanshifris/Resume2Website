# TaskMaster Slash Commands for RESUME2WEBSITE

Custom slash commands to streamline TaskMaster workflows in Claude Code.

## Available Commands

### Feature Development
- `/task:new <feature>` - Start a new feature with PRD generation
- `/task:prd <feature-name>` - Create PRD and generate tasks

### Task Management
- `/task:list <status>` - List tasks (pending/done/in-progress/all)
- `/task:show <id>` - Show task details with subtasks
- `/task:next` - Get next task and start implementation
- `/task:implement <id>` - Implement specific task
- `/task:done <id>` - Mark task as completed

### Task Operations
- `/task:expand <id>` - Break complex task into subtasks
- `/task:research <topic>` - Research best practices
- `/task:progress` - Show project progress and statistics

## Usage Examples

### Start New Feature
```
/task:new oauth authentication
```

### Work on Tasks
```
/task:next                  # Get next task
/task:show 3               # Show task 3 details
/task:implement 3          # Start implementing task 3
/task:done 3               # Mark task 3 as complete
```

### Check Progress
```
/task:progress             # Overall project status
/task:list pending         # Show pending tasks
/task:list in-progress     # Show current work
```

### Complex Tasks
```
/task:show 5               # Check complexity
/task:expand 5             # Break into subtasks
/task:research "Next.js 15 server components"
```

## Workflow Example

1. Start new feature:
   ```
   /task:new user profile system
   ```

2. Work through tasks:
   ```
   /task:next
   /task:implement 1
   /task:done 1
   /task:next
   ```

3. Handle complex tasks:
   ```
   /task:show 3
   /task:expand 3
   /task:implement 3.1
   ```

## Benefits

- **Structured Development**: Automatic PRD → Tasks → Implementation
- **Higher Accuracy**: Breaking complex work into manageable pieces
- **Progress Tracking**: Always know what's next and what's done
- **Consistent Workflow**: Same process for every feature

## Tips

1. Use `/task:new` for any feature requiring multiple files/components
2. Check `/task:progress` regularly to stay on track
3. Use `/task:expand` for tasks with complexity > 7
4. Research unfamiliar topics with `/task:research`