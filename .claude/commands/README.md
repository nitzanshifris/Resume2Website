# Claude Commands for Resume2Website V4

Organized command scripts and prompts for Resume2Website V4 development with Claude Code.

## 📁 Directory Structure

```
.claude/commands/
├── maintenance/         # System maintenance & cleanup
│   └── cleanup.sh      # Remove build artifacts and cache
├── development/        # Development utilities
│   ├── prime.sh        # Prime Claude with project context
│   ├── cv-extract.sh   # CV extraction optimization
│   ├── commit-and-push.sh  # Git workflow automation
│   ├── coverage.sh     # Test coverage reports
│   └── fix.sh          # Quick fixes and patches
├── portfolio/          # Portfolio generation
│   ├── portfolio-generate.sh  # Portfolio system optimization
│   └── portfolio-expert.sh    # AI portfolio guidance
├── taskmaster/         # TaskMaster workflow system
│   ├── new.md          # Start new feature
│   ├── prd.md          # Create PRD
│   ├── list.md         # List tasks
│   ├── show.md         # Show task details
│   ├── next.md         # Get next task
│   ├── implement.md    # Implement task
│   ├── done.md         # Mark task complete
│   ├── expand.md       # Break down complex tasks
│   ├── research.md     # Research topics
│   ├── progress.md     # Show progress
│   ├── status.md       # Task status
│   └── workflow.md     # Workflow guide
├── deprecated/         # Outdated scripts (kept for reference)
│   ├── build-planning.sh  # Replaced by organized task management
│   └── code-review.sh     # Replaced by code-reviewer agent
└── README.md           # This file
```

## 🚀 Quick Start

### Essential Commands

#### 🧹 Maintenance
```bash
# Clean build artifacts and cache
./.claude/commands/maintenance/cleanup.sh
```

#### 🔧 Development
```bash
# Prime Claude with project context
./.claude/commands/development/prime.sh

# Optimize CV extraction
./.claude/commands/development/cv-extract.sh

# Check test coverage
./.claude/commands/development/coverage.sh
```

#### 🎨 Portfolio
```bash
# Optimize portfolio generation
./.claude/commands/portfolio/portfolio-generate.sh

# Get AI portfolio guidance
./.claude/commands/portfolio/portfolio-expert.sh
```

## 📋 TaskMaster System

TaskMaster provides structured workflow management for feature development.

### Commands
All TaskMaster commands follow the pattern: `/task:<command> [args]`

#### Feature Development
- `/task:new <feature>` - Start new feature with PRD
- `/task:prd <feature>` - Create Product Requirements Document

#### Task Management
- `/task:list <status>` - List tasks (pending/done/in-progress/all)
- `/task:show <id>` - Show task details
- `/task:next` - Get next task to work on
- `/task:implement <id>` - Start implementing task
- `/task:done <id>` - Mark task complete

#### Complex Tasks
- `/task:expand <id>` - Break task into subtasks
- `/task:research <topic>` - Research best practices
- `/task:progress` - Show overall progress

### Example Workflow
```bash
# 1. Start new feature
/task:new user authentication

# 2. Work through tasks
/task:next
/task:implement 1
/task:done 1

# 3. Handle complex tasks
/task:show 3
/task:expand 3
/task:implement 3.1
```

## 🤖 Using Claude Code Agents

Many commands have been replaced by specialized Claude Code agents:

### Code Review
Instead of `code-review.sh`, use:
```python
Task(subagent_type="code-reviewer", prompt="Review [specific code]")
```

### Task Management
Instead of `build-planning.sh`, use:
```python
TodoWrite(todos=[...])  # For task tracking
```

Results are saved to: `.claude/agents/data/[agent-name]/`

## 📊 Project Context

### Key Configuration
- **Backend**: FastAPI on port 2000
- **Frontend**: Next.js on port 3019
- **AI**: Claude 4 Opus ONLY (temperature 0.0)
- **CV Structure**: 15 sections
- **Template**: official_template_v1
- **Portfolio Ports**: 4000-5000 (preview)
- **Resource Limits**: 20 portfolios max, 512MB each

### Important Patterns
- **Package Manager**: pnpm (main), npm (sandboxes)
- **Git Workflow**: Feature branches only
- **Circuit Breaker**: 5 failures → exponential backoff
- **Confidence Threshold**: 0.75 for caching
- **Cleanup**: 24-hour automatic portfolio cleanup

## ⚠️ Deprecated Commands

These commands are kept for reference but should not be used:

- `deprecated/build-planning.sh` - Use organized task management in `.claude/agents/data/`
- `deprecated/code-review.sh` - Use code-reviewer agent

## 🔄 Migration Guide

### From Old Commands to New Workflow

| Old Command | New Approach |
|-------------|--------------|
| `code-review.sh` | Use code-reviewer agent |
| `build-planning.sh` | Use TodoWrite tool or `.claude/agents/data/` |
| Manual task tracking | Use TaskMaster system |

## 📝 Notes

1. **Always run from project root**: `/Users/nitzan_shifris/Desktop/CV2WEB-V4/`
2. **Check agent outputs**: `.claude/agents/data/[agent-name]/`
3. **Use agents for complex tasks**: More comprehensive than scripts
4. **Keep scripts updated**: Update template references when project changes

---

*Last Updated: 2025-01-08*
*For: Resume2Website V4*