---
allowed-tools: [Bash]
description: List all tasks with optional status filter or 'all'
---

## TaskMaster Task List

!taskmaster list --status=${ARGUMENTS:-all}

### Quick Stats:
!taskmaster list --status=all | grep -E "Done:|In Progress:|Pending:" | head -3