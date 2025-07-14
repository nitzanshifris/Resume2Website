# TaskMaster Automatic Workflow Template

## For Claude Code: Copy this entire workflow when user requests a new feature

### Step 1: Understand Requirements
```
I'll help you [implement/add/create] [feature]. Let me use TaskMaster to ensure high-quality implementation.

First, let me understand your requirements:
1. [Ask 2-3 clarifying questions specific to the feature]
```

### Step 2: Create PRD
```bash
# Generate PRD content
I'm creating a comprehensive Product Requirements Document for [feature].

# Save PRD
Write to .taskmaster/docs/[feature-name]-prd.txt
```

### Step 3: Generate Tasks
```bash
taskmaster parse-prd .taskmaster/docs/[feature-name]-prd.txt
```

### Step 4: Analyze Complexity
```bash
taskmaster analyze-complexity
```

### Step 5: Expand Complex Tasks
```bash
# For any task with complexity > 7
taskmaster expand --id=[id] --subtasks=4 --prompt="[specific breakdown]"
```

### Step 6: Start Implementation
```bash
# Get first task
taskmaster next

# Show details
taskmaster show --id=[id]

# Implement task
[Implementation code]

# Mark complete
taskmaster set-status --id=[id] --status=done
```

## Example for "Add Dark Mode"

```
User: Add dark mode to the app

Claude: I'll help you add dark mode to CV2WEB. Let me use TaskMaster to ensure high-quality implementation.

First, let me understand your requirements:
1. Should dark mode toggle affect just the portfolio output or the entire app?
2. Do you want to persist the user's preference?
3. Any specific color scheme preferences?

[After user responds]

Creating a comprehensive Product Requirements Document for dark mode...

[Creates PRD with all details]

Now generating tasks from the PRD...
taskmaster parse-prd .taskmaster/docs/dark-mode-prd.txt

Analyzing task complexity...
taskmaster analyze-complexity

[Reviews complexity report]

Breaking down complex tasks...
taskmaster expand --id=3 --subtasks=4 --prompt="break into: theme context setup, component styling, toggle UI, persistence"

Starting implementation with task 1...
taskmaster show --id=1

[Implements each task systematically]
```

## Quick Reference Commands

```bash
# Start new feature
taskmaster parse-prd .taskmaster/docs/[feature]-prd.txt
taskmaster analyze-complexity

# During development
taskmaster next                    # Get next task
taskmaster show --id=X            # Show task details
taskmaster set-status --id=X --status=in-progress
taskmaster set-status --id=X --status=done

# When stuck
taskmaster research "[topic]"

# Progress check
taskmaster list --status=pending
taskmaster list --status=in-progress
```