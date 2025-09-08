#!/bin/bash
# RESUME2WEBSITE Git Workflow - MANDATORY BRANCH-BASED DEVELOPMENT
# ⚠️ CRITICAL: Follows CLAUDE.md git safety requirements

claude -p prime.md -- \
"⚠️ MANDATORY RESUME2WEBSITE GIT WORKFLOW:

1. SAFETY CHECK: Ensure we are NOT on main branch (git branch --show-current)
2. TYPECHECK: Run 'pnpm run typecheck' and ensure no TypeScript errors
3. STAGE: Add modified and new files (ask user if unsure about files to include)
4. COMMIT: Create semantic commit with format: type(scope): description
   - Types: feat|fix|docs|style|refactor|test|chore
   - Include: 🤖 Generated with [Claude Code](https://claude.ai/code)
5. ASK PERMISSION: Explicitly ask user before pushing to remote

Git Safety Requirements:
- NEVER work directly on main branch
- ALWAYS ask for explicit approval before git push
- ALWAYS run typecheck before committing
- Follow semantic commit conventions

The user is EXPLICITLY requesting git operations with safety checks."

