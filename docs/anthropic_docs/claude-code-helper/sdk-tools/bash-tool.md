# Bash Tool Documentation

Executes bash commands in a persistent shell session with optional timeout.

## Pre-execution Steps
1. **Directory Verification**:
   - If creating new directories/files, first use LS tool to verify parent directory exists
   - Example: Before `mkdir foo/bar`, check that "foo" exists

2. **Command Execution**:
   - Always quote file paths containing spaces with double quotes
   - Correct: `cd "/Users/name/My Documents"`
   - Incorrect: `cd /Users/name/My Documents` (will fail)

## Parameters
- **command**: The command to execute (required)
- **timeout**: Optional timeout in milliseconds (max 600000ms/10 minutes, default 120000ms/2 minutes)
- **description**: Clear, concise description in 5-10 words

## Usage Notes
- Output truncated if exceeds 30000 characters
- MUST avoid search commands like `find` and `grep` - use Grep, Glob, or Task tools instead
- MUST avoid read tools like `cat`, `head`, `tail`, `ls` - use Read and LS tools
- If you need grep, use ripgrep at `rg` (pre-installed)
- For multiple commands, use `;` or `&&` operators, NOT newlines
- Maintain working directory using absolute paths, avoid `cd` unless user requests

## Git Commit Workflow
When creating commits:
1. Run in parallel: `git status`, `git diff`, `git log`
2. Analyze changes and draft message
3. Add untracked files and create commit with message ending with:
   ```
   > Generated with [Claude Code](https://claude.ai/code)
   
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
4. Use HEREDOC for commit messages to ensure formatting
5. Never use interactive flags (-i)
6. Retry once if pre-commit hooks fail

## Pull Request Workflow
1. Run in parallel: `git status`, `git diff`, check remote branch status, `git log`
2. Analyze ALL commits (not just latest)
3. Create PR using `gh pr create` with HEREDOC for body
4. Include summary, test plan, and attribution

## Important
- Never update git config
- Don't push unless explicitly asked
- Return PR URL when done
- Use `gh` command for all GitHub tasks