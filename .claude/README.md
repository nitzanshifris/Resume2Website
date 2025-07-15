# Claude Persistent Memory System

This directory contains persistent memory for Claude Code to maintain context across sessions.

## Structure

```
.claude/
├── memory/
│   ├── project_context.md    # Overall project information
│   ├── ai_decisions.md       # Log of AI decisions and reasoning
│   └── user_preferences.md   # User-specific preferences
├── cache/                    # API response cache
└── README.md                # This file
```

## Purpose

The persistent memory system helps Claude Code:
1. Remember project-specific context between sessions
2. Track decisions and their reasoning
3. Maintain user preferences
4. Cache API responses to reduce redundant calls

## Usage

Memory files are automatically updated by the Claude service during operations. They use Markdown format for human readability.

## Privacy

These files may contain project-specific information. Add `.claude/` to `.gitignore` if you don't want to track this directory.