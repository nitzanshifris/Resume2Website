# Interactive Mode: Shortcuts and Commands

## Keyboard Shortcuts

### General Controls
- **Ctrl+C**: Cancel current input or generation
- **Ctrl+D**: Exit Claude Code session  
- **Ctrl+L**: Clear terminal screen
- **Up/Down arrows**: Navigate through command history
- **Tab**: Auto-complete file paths and commands
- **Esc + Esc**: Edit your previous message

### Multiline Input Methods

Claude Code supports multiple ways to enter multiline text:

1. **Backslash Method** (works everywhere):
   ```
   This is line one \
   This is line two \
   This is line three
   ```

2. **Option+Enter** (macOS default):
   - Hold Option and press Enter for new line

3. **Shift+Enter** (after terminal setup):
   - Run `/terminal-setup` first
   - Then use Shift+Enter for new lines

### Quick Input Shortcuts

- **`#` at start**: Memory shortcut - adds the rest of the line to CLAUDE.md
  ```
  # Remember to use npm test before commits
  ```

- **`/` at start**: Invoke a slash command
  ```
  /help
  /clear
  /permissions
  ```

## Vim Mode Navigation

Claude Code includes Vim keybindings for efficient text navigation.

### Entering Vim Mode
- Press `Esc` while in input mode

### NORMAL Mode Commands

#### Movement
- **h/j/k/l**: Move left/down/up/right
- **w**: Jump to next word
- **e**: Jump to end of word  
- **b**: Jump to previous word
- **0**: Jump to beginning of line
- **$**: Jump to end of line
- **gg**: Jump to first line
- **G**: Jump to last line

#### Editing (from NORMAL mode)
- **i**: Enter INSERT mode at cursor
- **a**: Enter INSERT mode after cursor
- **o**: Open new line below and enter INSERT mode
- **O**: Open new line above and enter INSERT mode
- **x**: Delete character under cursor
- **dd**: Delete current line
- **u**: Undo last change

### INSERT Mode
- Type normally to insert text
- Press `Esc` to return to NORMAL mode

## Slash Commands

### Core Commands

#### `/help`
Display all available commands and shortcuts

#### `/clear`
Clear conversation context while preserving settings

#### `/undo`
Undo the last assistant action

#### `/redo`
Redo the previously undone action

#### `/exit` or `/quit`
Exit Claude Code (same as Ctrl+D)

### Configuration Commands

#### `/permissions`
Manage tool permissions interactively
- View current permissions
- Enable/disable specific tools
- Set auto-approval rules

#### `/settings`
View and modify Claude Code settings
- Change model
- Adjust verbosity
- Configure output format

#### `/terminal-setup`
Configure terminal for better multiline support
- Enables Shift+Enter for new lines
- Improves paste handling

### Conversation Management

#### `/save`
Save current conversation with a name
```
/save my-feature-implementation
```

#### `/load`
Load a previously saved conversation
```
/load my-feature-implementation
```

#### `/history`
View conversation history
- Shows recent messages
- Allows jumping to specific points

#### `/export`
Export conversation to file
```
/export conversation.md
```

### Tool-Specific Commands

#### `/tools`
List all available tools and their status

#### `/enable <tool>`
Enable a specific tool
```
/enable bash
```

#### `/disable <tool>`
Disable a specific tool
```
/disable write
```

### MCP Commands

#### `/mcp`
Manage Model Context Protocol servers
- List connected servers
- Add new servers
- Remove servers
- Check server status

#### `/mcp auth`
Handle MCP server authentication

### Development Commands

#### `/debug`
Toggle debug mode for verbose output

#### `/timing`
Show timing information for operations

#### `/memory`
Display memory usage and context statistics

### Custom Commands

#### `/slash`
Create custom slash commands
```
/slash create test "Run project tests"
```

#### `/alias`
Create command aliases
```
/alias t /tools
```

## Command Line Arguments

When starting Claude Code, you can use various arguments:

### Quick Actions
```bash
# Start with initial prompt
claude "implement user authentication"

# Continue last conversation
claude --continue
claude -c

# Non-interactive mode
claude -p "analyze this codebase"
```

### Output Control
```bash
# JSON output
claude -p "list functions" --output-format json

# Quiet mode
claude -q

# Verbose mode
claude --verbose
```

## Tips and Tricks

### Efficient Navigation

1. **Quick File References**:
   - Type partial paths and use Tab completion
   - Drag and drop files into terminal

2. **History Search**:
   - Use Ctrl+R to search command history
   - Type to filter previous commands

3. **Smart Pasting**:
   - Large pastes automatically detected
   - Use Ctrl+V or right-click paste

### Productivity Shortcuts

1. **Batch Operations**:
   ```
   # Run multiple commands
   /clear && /settings
   ```

2. **Quick Edits**:
   - Esc+Esc to edit last message
   - Up arrow to recall commands

3. **Context Reset**:
   ```
   /clear
   # Start fresh with new task
   ```

### Advanced Usage

1. **Pipe Support**:
   ```bash
   echo "code to analyze" | claude -p "review this"
   ```

2. **Script Integration**:
   ```bash
   claude -p "$(cat requirements.txt)" --output-format json
   ```

3. **Conditional Commands**:
   ```bash
   claude -p "check syntax" && npm test
   ```

## Terminal Compatibility

### Recommended Terminals

1. **macOS**:
   - iTerm2 (best support)
   - Terminal.app
   - Warp

2. **Linux**:
   - GNOME Terminal
   - Konsole
   - Alacritty

3. **Windows (WSL)**:
   - Windows Terminal
   - ConEmu

### Terminal Setup Tips

1. **Enable True Color**:
   ```bash
   export COLORTERM=truecolor
   ```

2. **UTF-8 Support**:
   ```bash
   export LANG=en_US.UTF-8
   ```

3. **Better Key Handling**:
   ```bash
   # Add to .bashrc or .zshrc
   set -o vi  # For vi mode in shell
   ```

## Troubleshooting

### Common Issues

1. **Shortcuts Not Working**:
   - Check terminal emulator settings
   - Run `/terminal-setup`
   - Verify key bindings aren't overridden

2. **Multiline Input Problems**:
   - Use backslash method as fallback
   - Check terminal compatibility
   - Update terminal emulator

3. **History Not Saved**:
   - Check permissions on ~/.claude/
   - Verify disk space
   - Check CLAUDE_HISTORY_FILE env var

### Debug Mode

Enable debug mode for troubleshooting:
```
/debug
# Or start with
claude --debug
```

This shows:
- Key codes received
- Command parsing
- Tool execution details
- Timing information