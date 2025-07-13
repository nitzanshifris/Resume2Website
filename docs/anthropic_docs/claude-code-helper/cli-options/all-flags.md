# Claude Code CLI Flags and Commands

## Basic Commands

- `claude`: Start interactive REPL
- `claude "query"`: Start REPL with initial prompt
- `claude -p "query"`: Query via SDK and exit (non-interactive)
- `claude -c` or `claude --continue`: Continue most recent conversation
- `claude --resume`: Show conversation picker
- `claude update`: Update to latest version
- `claude doctor`: Check setup and configuration

## Common Flags

### Mode Control
- `--print`, `-p`: Print response without interactive mode
- `--continue`, `-c`: Load and continue most recent conversation
- `--resume`: Show conversation picker for older sessions

### Output Control
- `--output-format <format>`: Specify output format
  - `text`: Plain text (default)
  - `json`: JSON format (useful for scripting)
  - `stream-json`: Streaming JSON output

### Model and Session
- `--model <model>`: Set specific model for session
- `--max-turns <number>`: Limit agentic turns in non-interactive mode
- `--context-window <size>`: Set context window size

### Debugging and Logging
- `--verbose`: Enable detailed logging
- `--debug`: Enable debug mode
- `--log-level <level>`: Set logging level

### Authentication
- `--api-key <key>`: Provide API key
- `--provider <provider>`: Specify provider (anthropic, bedrock, vertex)

### Tool Control
- `--no-tools`: Disable all tools
- `--allowed-tools <tools>`: Specify allowed tools (comma-separated)

## Environment Variables

- `CLAUDE_API_KEY`: Set default API key
- `CLAUDE_MODEL`: Set default model
- `CLAUDE_OUTPUT_FORMAT`: Set default output format
- `CLAUDE_DISABLE_AUTO_UPDATE`: Disable automatic updates

## Configuration Files

Configuration hierarchy (highest to lowest priority):
1. Command line flags
2. Environment variables
3. Project-level `.claude/settings.json`
4. User-level `~/.config/claude/settings.json`
5. System defaults

## Special Flags for Automation

- `--no-interactive`: Force non-interactive mode
- `--yes`, `-y`: Auto-confirm all prompts
- `--quiet`, `-q`: Suppress non-essential output
- `--timeout <ms>`: Set global timeout for operations

## Examples

```bash
# Quick query and exit
claude -p "explain this code"

# Continue with specific model
claude -c --model claude-3-opus-20240229

# JSON output for scripting
claude -p "list all functions" --output-format json

# Debug mode with verbose logging
claude --debug --verbose

# Non-interactive with limited turns
claude -p "refactor this function" --max-turns 5 --no-interactive
```

## Notes

- JSON output format is particularly useful for scripting and automation
- Use `--continue` to maintain context across sessions
- Combine flags for complex workflows
- Check `claude --help` for complete list of options