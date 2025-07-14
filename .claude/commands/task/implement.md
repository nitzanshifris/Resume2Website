---
allowed-tools: [Bash, Read, Edit, MultiEdit, Write, TodoWrite]
description: Implement a specific task by ID
---

Starting implementation of task $ARGUMENTS:

!taskmaster show --id=$ARGUMENTS
!taskmaster set-status --id=$ARGUMENTS --status=in-progress

I'll now implement this task step by step, following the requirements and subtasks.

@.taskmaster/tasks/tasks.json