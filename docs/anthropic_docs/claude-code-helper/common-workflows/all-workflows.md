# Common Workflows in Claude Code

## Extended Thinking

Use extended thinking for complex tasks requiring deeper analysis.

### Triggering Extended Thinking
- Basic: Use "think" in your prompt
- Intensified: Use "think harder" or "think longer"

### Best Use Cases
- Architectural changes
- Debugging intricate issues
- Creating implementation plans
- Understanding complex codebases

### Tips
- Experiment with different thinking depths
- Use descriptive prompts
- Leverage context from previous interactions

## Image Interaction

Claude Code can analyze and work with images.

### Adding Images
- Drag and drop into terminal
- Paste with Ctrl+V (Cmd+V on Mac)
- Provide image file path

### Example Queries
- "What does this image show?"
- "Describe the UI elements"
- "Are there any problematic elements?"
- "Implement this design"

### Supported Formats
- PNG, JPG, JPEG, GIF, BMP, WebP
- Screenshots and mockups
- UI designs and wireframes

## Resume Functionality

Continue previous conversations seamlessly.

### Commands
- `claude --continue` or `claude -c`: Resume most recent conversation
- `claude --resume`: Show conversation picker for older sessions

### Options
- Interactive mode (default)
- Non-interactive with `--print` flag
- Preserves full message history, tool state, and context

### Use Cases
- Returning to unfinished work
- Building on previous implementations
- Maintaining context across sessions

## Git Workflows

### Committing Changes
1. Claude runs `git status` and `git diff` to understand changes
2. Analyzes changes and drafts appropriate commit message
3. Stages relevant files
4. Creates commit with proper attribution

### Creating Pull Requests
1. Analyzes all commits on current branch
2. Creates comprehensive PR description
3. Includes test plan and summary
4. Uses GitHub CLI (`gh`) for creation

## Test-Driven Development

1. Write tests first
2. Confirm tests fail initially
3. Implement code to pass tests
4. Commit tests and implementation separately

## Visual Iteration Workflow

1. Provide screenshot or design mock
2. Have Claude implement initial version
3. Claude takes screenshot of result
4. Iterate until design matches expectation

## Multiple Instance Workflow

For complex tasks, run multiple Claude instances:
- One for research and planning
- One for implementation
- One for testing and validation

## Best Practices

### Be Specific
- Clear, detailed instructions yield better results
- Break complex tasks into steps
- Provide examples when possible

### Course Correct Early
- Review initial approach before deep implementation
- Adjust instructions if needed
- Use `/clear` to reset context when switching tasks

### Use Checklists
- For complex multi-step workflows
- To ensure all requirements met
- To track progress across sessions