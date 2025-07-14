---
allowed-tools: [Bash]
description: Show current TaskMaster project status and progress
---

# TaskMaster Project Status

## Overall Progress
!taskmaster list --status=all | head -20

## Current Task
!taskmaster next

## Recently Completed
!taskmaster list --status=done | tail -5

## Blocked/Deferred Tasks
!taskmaster list --status=deferred