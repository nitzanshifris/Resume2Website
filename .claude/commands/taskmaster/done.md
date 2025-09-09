---
allowed-tools: [Bash]
description: Mark a task as completed
---

Marking task $ARGUMENTS as complete:

!taskmaster set-status --id=$ARGUMENTS --status=done

Task completed! Let me check for the next pending task:

!taskmaster next