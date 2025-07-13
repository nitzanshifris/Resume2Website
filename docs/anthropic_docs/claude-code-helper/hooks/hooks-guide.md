# Claude Code Hooks Guide

Hooks are user-defined shell commands that execute at specific points in Claude Code's lifecycle. They allow you to customize tool behavior, automate workflows, and enforce policies.

## Purpose

Hooks enable you to:
- **Customize tool behavior** - Modify how tools work
- **Automate notifications** - Send alerts on specific events  
- **Implement formatting** - Auto-format code after edits
- **Log commands** - Track all tool usage
- **Enforce permissions** - Add custom security rules

## Hook Events

### PreToolUse
Runs before any tool is called. Can block tool execution.

### PostToolUse  
Runs after a tool completes successfully.

### Notification
Triggered for permission requests or when Claude is idle.

### Stop
Runs when the main agent finishes its task.

### SubagentStop
Runs when a subagent completes its work.

### PreCompact
Runs before context compaction to manage conversation size.

## Configuration Structure

Hooks are configured in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'About to modify files'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command", 
            "command": "./scripts/log-tool-use.sh"
          }
        ]
      }
    ]
  }
}
```

## Hook Output Methods

### 1. Exit Codes

- **0**: Success - Continue normally
- **2**: Blocking error - Stop execution
- **Other**: Non-blocking error - Log and continue

### 2. JSON Output

Return JSON to control flow:

```json
{
  "continue": false,
  "message": "Blocked: Cannot edit production files",
  "result": "Custom result to return"
}
```

## Examples

### Example 1: Block Production Edits

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "if [[ $CLAUDE_PARAM_file_path == *'/production/'* ]]; then exit 2; fi"
          }
        ]
      }
    ]
  }
}
```

### Example 2: Auto-format After Edits

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write $CLAUDE_PARAM_file_path || true"
          }
        ]
      }
    ]
  }
}
```

### Example 3: Notify on Long Tasks

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"$CLAUDE_MESSAGE\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

### Example 4: Log All Tool Usage

```bash
#!/bin/bash
# log-tool-use.sh
echo "$(date): $CLAUDE_TOOL_NAME called with params: $CLAUDE_PARAMS" >> ~/.claude/tool-usage.log
```

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "./log-tool-use.sh"
          }
        ]
      }
    ]
  }
}
```

### Example 5: Enforce Git Commit Standards

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if [[ $CLAUDE_PARAM_command =~ ^git\\ commit ]]; then ./check-commit-message.sh; fi"
          }
        ]
      }
    ]
  }
}
```

## Environment Variables

Hooks receive these environment variables:

| Variable | Description |
|----------|-------------|
| `CLAUDE_TOOL_NAME` | Name of the tool being called |
| `CLAUDE_PARAMS` | JSON string of all parameters |
| `CLAUDE_PARAM_*` | Individual parameters (e.g., `CLAUDE_PARAM_file_path`) |
| `CLAUDE_EVENT` | Hook event type |
| `CLAUDE_MESSAGE` | Notification message (for Notification event) |
| `CLAUDE_SESSION_ID` | Current session identifier |

## Advanced Patterns

### Conditional Execution

```bash
#!/bin/bash
# Only run on specific files
if [[ $CLAUDE_PARAM_file_path =~ \\.js$ ]]; then
  eslint $CLAUDE_PARAM_file_path
fi
```

### JSON Response

```bash
#!/bin/bash
# Return structured response
cat << EOF
{
  "continue": true,
  "message": "Validated successfully",
  "metadata": {
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "user": "$USER"
  }
}
EOF
```

### Async Processing

```bash
#!/bin/bash
# Non-blocking background task
{
  sleep 5
  curl -X POST https://api.example.com/webhook \
    -d "{\"tool\": \"$CLAUDE_TOOL_NAME\", \"time\": \"$(date)\"}"
} &
exit 0
```

## Security Considerations

  **WARNING**: Hooks execute shell commands with your full user permissions without confirmation.

### Best Practices

1. **Validate Input**: Always sanitize parameters
   ```bash
   # Good
   if [[ $CLAUDE_PARAM_file_path =~ ^[a-zA-Z0-9/_.-]+$ ]]; then
     # Process file
   fi
   ```

2. **Use Absolute Paths**: Avoid PATH manipulation
   ```bash
   # Good
   /usr/bin/prettier --write "$file"
   # Bad  
   prettier --write "$file"
   ```

3. **Limit Permissions**: Run with minimal required permissions
   ```bash
   # Drop privileges if possible
   sudo -u nobody your-script.sh
   ```

4. **Log Actions**: Keep audit trail
   ```bash
   echo "$(date): Hook executed by $USER" >> /var/log/claude-hooks.log
   ```

5. **Fail Safely**: Handle errors gracefully
   ```bash
   set -euo pipefail
   trap 'echo "Hook failed: $?"' ERR
   ```

## Debugging Hooks

### Enable Verbose Logging

```bash
export CLAUDE_DEBUG=true
claude --verbose
```

### Test Hooks Manually

```bash
# Set environment variables
export CLAUDE_TOOL_NAME="Edit"
export CLAUDE_PARAM_file_path="/test/file.js"

# Run hook script
./your-hook-script.sh
echo "Exit code: $?"
```

### Common Issues

1. **Permission Denied**
   - Make scripts executable: `chmod +x script.sh`
   - Check file ownership

2. **Command Not Found**
   - Use absolute paths
   - Check PATH environment

3. **Silent Failures**
   - Add error logging
   - Check exit codes

4. **Performance Impact**
   - Keep hooks lightweight
   - Use background processing for heavy tasks

## Hook Libraries

### Notification Systems

```bash
# macOS
osascript -e 'display notification "Message" with title "Title"'

# Linux (notify-send)
notify-send "Title" "Message"

# Slack
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Message"}' \
  YOUR_WEBHOOK_URL
```

### File Validators

```bash
# JavaScript/TypeScript
eslint "$CLAUDE_PARAM_file_path"
tsc --noEmit "$CLAUDE_PARAM_file_path"

# Python
pylint "$CLAUDE_PARAM_file_path"
mypy "$CLAUDE_PARAM_file_path"

# General
file "$CLAUDE_PARAM_file_path" | grep -q "text"
```

### Git Integration

```bash
# Check branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [[ $current_branch == "main" ]]; then
  echo "Cannot edit main branch directly"
  exit 2
fi
```

## Best Practices Summary

1. **Start Simple**: Begin with echo statements, add complexity gradually
2. **Test Thoroughly**: Verify hooks before relying on them
3. **Document Hooks**: Comment your hook scripts
4. **Version Control**: Keep hooks in your repository
5. **Team Coordination**: Share hook configurations with your team
6. **Monitor Performance**: Ensure hooks don't slow down Claude Code
7. **Security First**: Never trust user input in hooks
8. **Fail Gracefully**: Don't break Claude Code with hook errors