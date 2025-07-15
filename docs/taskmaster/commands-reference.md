# Claude Code Command Dictionary

A comprehensive reference guide for all available slash commands in Claude Code, including built-in commands and custom TaskMaster integration commands.

## Table of Contents
- [Built-in Commands](#built-in-commands)
  - [General Commands](#general-commands)
  - [Project Management](#project-management)
  - [Configuration](#configuration)
  - [Terminal & Environment](#terminal--environment)
- [Custom TaskMaster Commands](#custom-taskmaster-commands)
  - [Task Creation & Planning](#task-creation--planning)
  - [Task Management](#task-management)
  - [Task Execution](#task-execution)
  - [Task Analysis](#task-analysis)
- [Command Usage Examples](#command-usage-examples)

---

## Built-in Commands

### General Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/help` | Display help information about Claude Code | `/help` |
| `/status` | Show current setup and configuration status | `/status` |
| `/exit` | Exit Claude Code session | `/exit` |
| `/clear` | Clear the current conversation | `/clear` |
| `/undo` | Undo the last action | `/undo` |

### Project Management

| Command | Description | Example |
|---------|-------------|---------|
| `/project` | Show current project information | `/project` |
| `/permissions` | View and manage file permissions | `/permissions` |
| `/refresh` | Refresh project context | `/refresh` |

### Configuration

| Command | Description | Example |
|---------|-------------|---------|
| `/settings` | View and modify Claude Code settings | `/settings` |
| `/terminal-setup` | Enable Shift+Enter for new lines in terminal | `/terminal-setup` |
| `/model` | View or change the AI model being used | `/model` |

### Terminal & Environment

| Command | Description | Example |
|---------|-------------|---------|
| `/terminal` | Open an interactive terminal session | `/terminal` |
| `/env` | Display environment variables | `/env` |
| `/pwd` | Show current working directory | `/pwd` |

---

## Custom TaskMaster Commands

### Task Creation & Planning

| Command | Description | Example | Key Features |
|---------|-------------|---------|--------------|
| `/task:new <feature>` | Start a new feature with automatic PRD generation | `/task:new oauth-authentication` | • Creates PRD automatically<br>• Generates tasks<br>• Analyzes complexity<br>• Starts implementation workflow |
| `/task:prd <feature>` | Generate a Product Requirements Document | `/task:prd user-dashboard` | • Creates structured PRD<br>• Prepares for task generation<br>• Includes all requirements sections |
| `/task:workflow <feature>` | Complete TaskMaster workflow for a feature | `/task:workflow dark-mode` | • Full workflow guidance<br>• Step-by-step process<br>• PRD → Tasks → Implementation |

### Task Management

| Command | Description | Example | Key Features |
|---------|-------------|---------|--------------|
| `/task:list [status]` | List tasks with optional status filter | `/task:list pending`<br>`/task:list all` | • Filter by status<br>• Shows task statistics<br>• Displays dependencies |
| `/task:show <id>` | Display detailed information about a task | `/task:show 42` | • Full task details<br>• Subtasks<br>• Implementation notes |
| `/task:status` | Show project overview and progress | `/task:status` | • Overall progress<br>• Current task<br>• Recent completions<br>• Blocked tasks |
| `/task:progress` | Display detailed project statistics | `/task:progress` | • Task distribution<br>• Completion metrics<br>• Time estimates |

### Task Execution

| Command | Description | Example | Key Features |
|---------|-------------|---------|--------------|
| `/task:next` | Get next task and start implementation | `/task:next` | • Shows next available task<br>• Marks as in-progress<br>• Begins implementation |
| `/task:implement <id>` | Implement a specific task by ID | `/task:implement 15` | • Shows task details<br>• Updates status<br>• Guides implementation |
| `/task:done <id>` | Mark a task as completed | `/task:done 15` | • Updates task status<br>• Shows next task<br>• Updates progress |

### Task Analysis

| Command | Description | Example | Key Features |
|---------|-------------|---------|--------------|
| `/task:expand <id>` | Break down a complex task into subtasks | `/task:expand 8` | • Analyzes complexity<br>• Creates 4-6 subtasks<br>• Maintains task hierarchy |
| `/task:research <topic>` | Research best practices for a topic | `/task:research "Next.js 15 patterns"` | • AI-powered research<br>• Best practices<br>• Implementation examples |

---

## Command Usage Examples

### Starting a New Feature
```bash
# Method 1: Complete workflow
/task:workflow user-authentication

# Method 2: Step by step
/task:prd user-authentication
# (After PRD is created)
/task:list pending
/task:next
```

### Daily Development Flow
```bash
# Morning: Check status
/task:status

# Get your next task
/task:next

# Working on specific task
/task:implement 23

# After completion
/task:done 23

# Check progress
/task:progress
```

### Managing Complex Tasks
```bash
# View task details
/task:show 15

# If too complex, break it down
/task:expand 15

# Research unfamiliar topics
/task:research "FastAPI WebSocket implementation"
```

### Project Overview
```bash
# See all tasks
/task:list all

# See only pending work
/task:list pending

# Check completed tasks
/task:list done

# Overall project status
/task:status
```

---

## Command Tips & Best Practices

### 1. **Workflow Order**
```
/task:new → Automatic PRD → Tasks → Implementation
```

### 2. **Task Status Flow**
```
pending → in-progress → done
```

### 3. **When to Use Each Command**

- **`/task:new`** - Starting fresh features
- **`/task:workflow`** - When you want guided step-by-step
- **`/task:next`** - Daily development (what to work on)
- **`/task:status`** - Project health checks
- **`/task:expand`** - When tasks seem too complex
- **`/task:research`** - Learning new technologies

### 4. **Tag Management**
While not exposed as slash commands, TaskMaster supports tags:
```bash
# In terminal (not slash command)
taskmaster use-tag feature-x
taskmaster list --tag feature-x
```

---

## Quick Reference Card

### Most Used Commands
```bash
/task:status          # Where are we?
/task:next            # What's next?
/task:done <id>       # Mark complete
/task:new <feature>   # Start new feature
```

### Development Cycle
```bash
1. /task:new oauth              # Start
2. /task:next                   # Work
3. /task:done 1                 # Complete
4. /task:next                   # Repeat
```

### Getting Help
```bash
/help                 # Claude Code help
/task:list all        # See all tasks
/task:show <id>       # Task details
```

---

## Notes

- All `/task:*` commands integrate with TaskMaster AI
- Commands automatically handle task dependencies
- Task IDs persist across sessions
- Use `/clear` if conversation gets too long
- TaskMaster data is stored in `.taskmaster/` directory

---

*Last updated: 2025-07-14*