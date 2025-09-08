---
allowed-tools: [Bash]
description: Show overall project progress and task statistics
---

## TaskMaster Project Progress

!taskmaster list --status=all | head -20

### Task Statistics:
!echo "=== Task Status Summary ==="
!taskmaster list --status=all | grep -E "pending|in-progress|done|review" | sort | uniq -c

### Current Focus:
!echo "=== Tasks In Progress ==="
!taskmaster list --status=in-progress

### Next Tasks:
!echo "=== Next 5 Pending Tasks ==="
!taskmaster list --status=pending | head -15