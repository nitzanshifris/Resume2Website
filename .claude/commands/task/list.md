---
allowed-tools: [Bash]
description: List all tasks with optional status filter
---

Listing tasks with status filter: $ARGUMENTS

!taskmaster list --status=$ARGUMENTS

Task Summary:
!echo "Checking task distribution..."
!taskmaster list --status=all | grep -E "pending|in-progress|done" | wc -l