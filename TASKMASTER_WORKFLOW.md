# TaskMaster AI Workflow for CV2WEB Development

## Overview
TaskMaster helps break complex development into manageable tasks for higher AI accuracy.

## Workflow Steps

### 1. Create a PRD for New Features
```bash
# Example: OAuth Authentication
claude> Create a PRD for OAuth authentication for CV2WEB. Include:
- Support for Google, GitHub OAuth
- JWT token management
- Protected API routes
- Frontend auth flow
Save it to .taskmaster/docs/oauth-prd.txt
```

### 2. Parse PRD to Generate Tasks
```bash
taskmaster parse-prd .taskmaster/docs/oauth-prd.txt
```

### 3. Analyze Task Complexity
```bash
taskmaster analyze-complexity
# Review report at .taskmaster/reports/task-complexity-report.json
```

### 4. Break Down Complex Tasks
```bash
# Example: Break task 3 into subtasks
taskmaster expand --id=3 --subtasks=4 --prompt="break into: schema design, API implementation, frontend integration, testing"
```

### 5. Execute Tasks with Claude Code
When working on tasks:
1. Show me the task details
2. I'll implement the task
3. Mark as complete when done

```bash
# Show task
taskmaster show --id=3 --with-subtasks

# After completion
taskmaster set-status --id=3 --status=completed
```

### 6. Update Tasks Based on Changes
```bash
# When requirements change
taskmaster update --id=5 --prompt="use NextAuth instead of custom JWT implementation"
```

## CV2WEB Specific Examples

### Example 1: Improve CV Extraction
```bash
# Create PRD
claude> Create a PRD for improving CV extraction accuracy:
- Better handling of multi-column layouts
- Extract skills with confidence scores
- Support for non-English CVs
- Image-based CV support
Save to .taskmaster/docs/cv-extraction-v2-prd.txt

# Generate tasks
taskmaster parse-prd .taskmaster/docs/cv-extraction-v2-prd.txt

# Analyze complexity
taskmaster analyze-complexity

# Work on tasks
taskmaster next
```

### Example 2: New Portfolio Template
```bash
# Create PRD
claude> Create a PRD for a new "Creative Agency" portfolio template:
- Hero section with video background
- Project showcase carousel
- Team member cards
- Contact form with animations
Use Aceternity UI components
Save to .taskmaster/docs/creative-agency-template-prd.txt

# Generate and execute tasks
taskmaster parse-prd .taskmaster/docs/creative-agency-template-prd.txt
taskmaster list
```

### Example 3: API Enhancement
```bash
# Create PRD
claude> Create a PRD for API rate limiting and caching:
- Redis integration
- Rate limiting per user/IP
- Response caching
- Cache invalidation strategy
Save to .taskmaster/docs/api-optimization-prd.txt

# Generate tasks with research
taskmaster parse-prd .taskmaster/docs/api-optimization-prd.txt
taskmaster analyze-complexity --research
```

## Best Practices

1. **Always Start with PRD**
   - Clear requirements = better task generation
   - Include technical constraints
   - Specify existing dependencies

2. **Break Down High Complexity Tasks**
   - Tasks with score > 7 should be expanded
   - Use specific expansion prompts
   - Aim for subtasks with complexity 3-5

3. **Execute Tasks Sequentially**
   - Complete dependencies first
   - Verify each task before moving on
   - Update task status immediately

4. **Use Research for Unknown Areas**
   ```bash
   taskmaster research "FastAPI Redis caching best practices 2025"
   ```

5. **Keep Tasks Updated**
   - Update when requirements change
   - Add new tasks as you discover needs
   - Remove obsolete tasks

## Task Execution with Claude Code

Since we don't have MCP integration, use this pattern:

```bash
# 1. Get next task
taskmaster next

# 2. Show task details
taskmaster show --id=<id> --with-subtasks

# 3. Ask Claude to implement
claude> Let's implement task <id>. Here are the details: [paste task details]

# 4. After completion
taskmaster set-status --id=<id> --status=completed

# 5. Move to next task
taskmaster next
```

## Current Project Status
- Total Tasks: 56
- Completed: 55 (98%)
- Pending: 1 (Task #56)

To see pending task:
```bash
taskmaster show --id=56
```