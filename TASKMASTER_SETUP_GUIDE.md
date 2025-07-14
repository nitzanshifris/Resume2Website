# TaskMaster Proper Setup Guide for CV2WEB V4

## Current Status
- TaskMaster files are in the backup branch (`backup/pre-cleanup-20250713-172843`)
- Main branch has incomplete TaskMaster setup

## Recommended Setup Steps

### 1. Install TaskMaster Globally
```bash
npm install -g task-master-ai
```

### 2. Initialize TaskMaster in Project
```bash
task-master init
```

### 3. Configure Models
```bash
task-master models --setup
```

### 4. Set Up Environment Variables
Create `.env` file with:
```
ANTHROPIC_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
```

### 5. Create Project PRD
Create `.taskmaster/docs/cv2web-prd.txt` with project requirements

### 6. Parse PRD to Generate Tasks
```bash
task-master parse-prd .taskmaster/docs/cv2web-prd.txt
```

### 7. Generate Task Files
```bash
task-master generate
```

## Recommended Workflow for CV2WEB

### For Feature Development:
1. Create PRD: `create a PRD for [feature] at .taskmaster/docs/[feature]-prd.txt`
2. Parse PRD: `task-master parse-prd .taskmaster/docs/[feature]-prd.txt`
3. Get next task: `task-master next`
4. Show tasks: `task-master list --with-subtasks`
5. Implement task: Work on the task with AI assistance
6. Update status: `task-master set-status --id=X --status=done`

### For Research:
```bash
task-master research "best practices for FastAPI authentication in 2025"
task-master research "Gemini 2.5 Flash API optimization techniques" --save-to=.taskmaster/research/gemini-optimization.md
```

### For Complex Tasks:
```bash
task-master expand --id=5 --research
task-master analyze-complexity --research
```

## Integration with MCP (Recommended)
1. Add to `.claude/mcp.json`:
```json
{
  "mcpServers": {
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_KEY",
        "PERPLEXITY_API_KEY": "YOUR_KEY",
        "OPENAI_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

2. Use Claude commands:
- "What's the next task I should work on?"
- "Show me task 5 with all its subtasks"
- "I've completed task 3, mark it as done"

## Migration from Old Setup
If you have tasks in the backup branch:
```bash
# 1. Checkout backup branch files
git checkout backup/pre-cleanup-20250713-172843 -- .taskmaster/

# 2. Run migration
task-master migrate --backup

# 3. Verify
task-master list
```

## Best Practices for CV2WEB
1. **Break down large features**: Use `task-master expand` for complex tasks
2. **Research before implementing**: Use `--research` flag for best practices
3. **Track dependencies**: Set task dependencies properly
4. **Use priorities**: High for critical path, medium for features, low for nice-to-have
5. **Regular updates**: Run `task-master update --research` weekly