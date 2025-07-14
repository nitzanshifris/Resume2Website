---
allowed-tools: [Bash]
description: Show specific task details with subtasks
---

Showing details for task $ARGUMENTS:

!taskmaster show --id=$ARGUMENTS

Let me know if you want to:
- Implement this task (/task:implement $ARGUMENTS)
- Break it down further (/task:expand $ARGUMENTS)
- Mark as complete (/task:done $ARGUMENTS)