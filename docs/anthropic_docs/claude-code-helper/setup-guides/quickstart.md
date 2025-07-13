# Claude Code Quickstart Guide

Claude Code is your AI pair programmer that helps you achieve coding tasks through conversational interactions.

## Prerequisites

- **Node.js 18** or newer
- **Terminal/command prompt**
- **A code project** to work with

## Installation

```bash
npm install -g @anthropic-ai/claude-code
```

## Getting Started

### 1. Start a Session

Navigate to your project directory and run:
```bash
claude
```

This starts an interactive session where you can chat with Claude about your code.

### 2. Explore Your Project

Start by understanding your codebase:
- "What does this project do?"
- "What technologies are used here?"
- "Show me the project structure"
- "What are the main components?"

Claude will read through your files and provide insights.

### 3. Make Code Changes

Request specific modifications:
- "Add error handling to the API endpoints"
- "Refactor this function to use async/await"
- "Create a new React component for user profiles"
- "Fix the TypeScript errors in this file"

Claude will:
1. Analyze your request
2. Propose changes
3. Ask for your approval
4. Make the modifications

### 4. Git Integration

Work with version control:
- "Create a commit with these changes"
- "Show me what changed"
- "Create a new branch for this feature"
- "Help me resolve this merge conflict"

## Essential Commands

### Interactive Mode Commands
- `/help` - Show available commands
- `/clear` - Clear conversation context
- `/undo` - Undo last assistant action
- `/permissions` - Manage tool permissions
- `/exit` or `Ctrl+D` - Exit Claude Code

### CLI Commands
```bash
# Start interactive mode
claude

# Run a one-time task
claude "add tests for the auth module"

# Continue previous conversation
claude --continue

# Create a git commit
claude commit

# Update Claude Code
claude update
```

## Pro Tips

### 1. Be Specific
Instead of: "Fix the bug"
Try: "Fix the null pointer exception in the login function when email is empty"

### 2. Break Down Complex Tasks
Instead of: "Refactor the entire application"
Try: 
- "List all the API endpoints that need error handling"
- "Add error handling to the user authentication endpoints"
- "Add error handling to the data processing endpoints"

### 3. Use Context Effectively
- Start fresh sessions for new features
- Use `/clear` when switching between unrelated tasks
- Reference specific files: "In src/api/users.js, add validation"

### 4. Leverage Screenshots
- Drag and drop UI mockups
- Paste screenshots with Ctrl+V (Cmd+V on Mac)
- Say "implement this design" or "make it look like this"

### 5. Review Before Committing
- Always review Claude's changes
- Test the code before committing
- Use "show me what changed" to see modifications

## Common Workflows

### Adding a New Feature
```
You: Add a search feature to the user list
Claude: I'll help you add a search feature. Let me first examine the current user list implementation...
[Claude reads files and implements the feature]
You: Run the tests
Claude: [Runs tests and fixes any issues]
You: Create a commit
Claude: [Creates a descriptive commit]
```

### Debugging
```
You: I'm getting this error: [paste error]
Claude: Let me analyze this error. First, I'll look at the relevant code...
[Claude investigates and provides fix]
```

### Code Review
```
You: Review the code in src/api/ for security issues
Claude: I'll review the API code for security concerns...
[Claude provides detailed analysis]
```

## Best Practices

1. **Create a CLAUDE.md file** in your project root with:
   - Project-specific commands
   - Coding conventions
   - Testing instructions

2. **Use descriptive prompts**:
   - Include error messages
   - Specify file locations
   - Provide example inputs/outputs

3. **Iterate on complex changes**:
   - Start with a plan: "How would you approach X?"
   - Implement incrementally
   - Test each step

## Keyboard Shortcuts

- `Ctrl+C` - Cancel current operation
- `Ctrl+D` - Exit Claude Code
- `Ctrl+L` - Clear terminal screen
- `‘/“` - Navigate command history
- `Tab` - Auto-complete file paths

## What's Next?

1. **Explore advanced features**:
   - Multi-file edits
   - Custom slash commands
   - MCP integrations

2. **Read the documentation**:
   - [Common Workflows](https://docs.anthropic.com/claude-code/common-workflows)
   - [Best Practices](https://docs.anthropic.com/claude-code/best-practices)
   - [CLI Reference](https://docs.anthropic.com/claude-code/cli-reference)

3. **Join the community**:
   - Report issues with `/bug`
   - Share feedback on GitHub
   - Contribute to awesome-claude-code

Remember: Claude Code is designed to adapt to your workflow. Experiment, iterate, and find what works best for you!