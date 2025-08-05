# TaskMaster AI - Complete Guide for CV2WEB

## Table of Contents
1. [Overview](#overview)
2. [Setup Guide](#setup-guide)
3. [Workflow Steps](#workflow-steps)
4. [Automatic Workflow](#automatic-workflow)
5. [Commands Reference](#commands-reference)
6. [Best Practices](#best-practices)

## Overview

TaskMaster helps break complex CV2WEB development into manageable tasks for higher AI accuracy. It automatically activates when you request features, manages task complexity, and ensures systematic implementation.

### When TaskMaster Activates

TaskMaster automatically activates when you say:
- "add [feature]" / "implement [feature]" / "create [feature]"
- "build [component/system]" / "develop [functionality]"
- "I want to [do something]" / "help me [build/create/add]"
- "let's work on [feature]" / "start working on [task]"
- Any request involving multiple steps or complex implementation

### When NOT to Use TaskMaster
- Simple bug fixes
- Quick questions
- Code explanations
- Single file edits

## Setup Guide

### Initial Configuration
```bash
# TaskMaster is integrated into CV2WEB and requires no additional setup
# Configuration is stored in .taskmaster/config.json
```

### Directory Structure
```
.taskmaster/
├── config.json          # TaskMaster configuration
├── docs/               # PRDs and documentation
├── tasks/              # Task files
├── reports/            # Analysis reports
└── templates/          # Task templates
```

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
# Add new requirements
taskmaster update --id=3 --add-requirement="Support refresh tokens"

# Update priority
taskmaster set-priority --id=3 --priority=critical
```

## Automatic Workflow

### Template for Claude Code
When a user requests a new feature, follow this automatic workflow:

```
User: Add [feature] to the app

Claude: I'll help you [implement/add/create] [feature]. Let me use TaskMaster to ensure high-quality implementation.

First, let me understand your requirements:
1. [Ask 2-3 clarifying questions specific to the feature]

[After user responds]

Creating a comprehensive Product Requirements Document for [feature]...

[Creates PRD with all details]

Now generating tasks from the PRD...
taskmaster parse-prd .taskmaster/docs/[feature]-prd.txt

Analyzing task complexity...
taskmaster analyze-complexity

[Reviews complexity report]

Breaking down complex tasks...
taskmaster expand --id=X --subtasks=4 --prompt="[specific breakdown]"

Starting implementation with task 1...
taskmaster show --id=1

[Implements each task systematically]
```

### Example: Dark Mode Implementation

```
User: Add dark mode to the app

Claude: I'll help you add dark mode to CV2WEB. Let me use TaskMaster to ensure high-quality implementation.

First, let me understand your requirements:
1. Should dark mode toggle affect just the portfolio output or the entire app?
2. Do you want to persist the user's preference?
3. Any specific color scheme preferences?

[After user responds]

Creating a comprehensive Product Requirements Document for dark mode...

[PRD Content]
Title: Dark Mode Implementation for CV2WEB
Version: 1.0
Date: [Current Date]

Requirements:
- Toggle between light/dark themes
- Persist preference in localStorage
- Apply to both app UI and portfolio output
- Smooth transitions between themes
- Accessible contrast ratios

[Saves to .taskmaster/docs/dark-mode-prd.txt]

Now generating tasks from the PRD...
taskmaster parse-prd .taskmaster/docs/dark-mode-prd.txt

Generated 5 tasks:
1. Create theme context and provider (complexity: 5)
2. Implement theme toggle component (complexity: 3)
3. Update all components with theme support (complexity: 8)
4. Add theme persistence logic (complexity: 4)
5. Test and optimize transitions (complexity: 6)

Analyzing task complexity...
taskmaster analyze-complexity

Task 3 has high complexity (8). Breaking it down...
taskmaster expand --id=3 --subtasks=4 --prompt="break into: base components, portfolio templates, utility styles, third-party component theming"

Starting implementation with task 1...
taskmaster show --id=1

[Implementation proceeds systematically]
```

## Commands Reference

### Task Management
```bash
# List tasks
taskmaster list --status=pending
taskmaster list --status=in-progress
taskmaster list --status=completed

# Get next task
taskmaster next

# Show task details
taskmaster show --id=X
taskmaster show --id=X --with-subtasks

# Update task status
taskmaster set-status --id=X --status=in-progress
taskmaster set-status --id=X --status=done
taskmaster set-status --id=X --status=blocked
```

### Task Creation and Modification
```bash
# Parse PRD to create tasks
taskmaster parse-prd <file-path>

# Create individual task
taskmaster create --title="Task title" --description="Description"

# Expand complex task
taskmaster expand --id=X --subtasks=N --prompt="breakdown instructions"

# Update task
taskmaster update --id=X --add-requirement="new requirement"
taskmaster set-priority --id=X --priority=high|medium|low|critical
```

### Analysis and Research
```bash
# Analyze complexity
taskmaster analyze-complexity
taskmaster analyze-complexity --task-id=X

# Research topics
taskmaster research "Next.js 15 patterns"
taskmaster research "FastAPI best practices"
```

### Progress Tracking
```bash
# View progress
taskmaster progress
taskmaster progress --detailed

# Generate reports
taskmaster report --type=weekly
taskmaster report --type=completion --task-id=X
```

## Best Practices

### 1. PRD Creation
- Be specific about requirements
- Include technical constraints
- Define success criteria
- Consider edge cases

### 2. Task Breakdown
- Keep tasks under complexity level 7
- Each task should be completable in 1-2 hours
- Include clear acceptance criteria
- Define dependencies explicitly

### 3. Implementation Flow
- Always start with `taskmaster next`
- Complete subtasks before parent task
- Update status immediately after completion
- Document any blockers or changes

### 4. CV2WEB Specific Usage

#### CV Extraction Tasks
```bash
claude> Create tasks for improving CV extraction with Claude 4 Opus. Focus on:
- Better section detection
- Improved date parsing
- Multi-language support
```

#### UI Component Tasks
```bash
claude> Break down portfolio templates focusing on Aceternity components. Include:
- Component selection logic
- Data mapping
- Animation integration
```

#### API Feature Tasks
```bash
claude> Create tasks for new FastAPI endpoint with authentication. Consider:
- JWT validation
- Rate limiting
- Error handling
```

## Integration with CV2WEB Development

### Quick Reference for Common Features

1. **Portfolio Templates**
   - PRD should include: design requirements, component list, data mapping
   - Tasks typically include: template creation, component integration, preview generation

2. **API Endpoints**
   - PRD should include: request/response schemas, authentication, error cases
   - Tasks typically include: route creation, business logic, testing, documentation

3. **UI Components**
   - PRD should include: design specs, interactions, responsive behavior
   - Tasks typically include: component creation, styling, integration, testing

4. **Performance Features**
   - PRD should include: metrics, targets, monitoring approach
   - Tasks typically include: profiling, optimization, measurement, validation

---

Last updated: 2025-01-15 | Version: 1.0 (Consolidated from multiple TaskMaster docs)