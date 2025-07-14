---
allowed-tools: [Write, Bash]
description: Generate a PRD and create tasks from it
---

Creating a comprehensive Product Requirements Document for $ARGUMENTS.

!echo "Generating PRD for: $ARGUMENTS"

The PRD will include:
- Core features and functionality
- User experience requirements
- Technical architecture
- Success criteria
- Implementation constraints

After creating the PRD, I'll automatically:
!taskmaster parse-prd .taskmaster/docs/$ARGUMENTS-prd.txt
!taskmaster analyze-complexity