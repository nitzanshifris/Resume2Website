# Code Review Agent Task History

This directory contains all outputs and analyses from the code-reviewer agent.

## Directory Structure

```
.claude/agents/data/code-review-tasks/
├── README.md                    # This file
├── YYYY-MM-DD_HH-MM-SS_*.md    # Individual task outputs
└── index.md                    # Index of all completed reviews
```

## File Naming Convention

Each agent task output is saved as:
`YYYY-MM-DD_HH-MM-SS_task-description.md`

Examples:
- `2025-01-08_14-30-15_sse-security-review.md`
- `2025-01-08_15-45-22_authentication-audit.md`
- `2025-01-08_16-20-10_template-compliance-check.md`

## Usage

When you use the code-reviewer agent, the full output including:
- Complete analysis
- TASK.md findings
- Security recommendations
- Code fixes

Will be automatically saved here for future reference.

## Agent Configuration

To enable automatic saving, the code-reviewer agent should be configured to output results to this directory instead of the root TASK.md file.