---
allowed-tools: [Bash, Read, Edit, MultiEdit, Write, TodoWrite, Grep, Task]
description: Implement a specific task by ID
---

## Implementing Task #$ARGUMENTS

!taskmaster show --id=$ARGUMENTS

Now marking as in-progress:
!taskmaster set-status --id=$ARGUMENTS --status=in-progress

Based on the task details above, I'll implement this step by step.

Let me analyze what needs to be done and start the implementation...