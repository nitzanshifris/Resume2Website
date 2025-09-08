#!/bin/bash
# DEPRECATED: We now use organized task management in .claude/agents/data/
# Tasks are saved to: .claude/agents/data/code-review-tasks/
# This script is kept for reference but should not be used.

echo "⚠️  This command is deprecated!"
echo ""
echo "Task management has moved to:"
echo "  📁 .claude/agents/data/code-review-tasks/"
echo ""
echo "Use the code-reviewer agent instead:"
echo "  Task(subagent_type='code-reviewer', prompt='Review and create tasks')"
echo ""
echo "Or use TodoWrite tool for task tracking."