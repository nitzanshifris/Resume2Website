# Search Tools Documentation

## Glob Tool

Fast file pattern matching tool for any codebase size.

### Features
- Supports glob patterns like `**/*.js` or `src/**/*.ts`
- Returns matching file paths sorted by modification time
- Use when finding files by name patterns

### Parameters
- **pattern**: The glob pattern to match files against (required)
- **path**: Directory to search in (optional, defaults to current directory)

### Best Practices
- For open-ended searches requiring multiple rounds, use Agent tool instead
- Can call multiple tools in single response for batch searches

## Grep Tool

Powerful search tool built on ripgrep.

### Usage
- ALWAYS use Grep for search tasks
- NEVER invoke `grep` or `rg` as Bash command
- Supports full regex syntax
- Uses ripgrep (not grep) - literal braces need escaping

### Parameters
- **pattern**: Regular expression pattern to search (required)
- **path**: File or directory to search (optional, defaults to current directory)
- **output_mode**: 
  - "files_with_matches": Shows file paths (default)
  - "content": Shows matching lines
  - "count": Shows match counts
- **glob**: Filter files with glob pattern (e.g., "*.js")
- **type**: File type to search (e.g., "js", "py", "rust")
- **-A/-B/-C**: Lines after/before/around matches (requires output_mode: "content")
- **-n**: Show line numbers (requires output_mode: "content")
- **-i**: Case insensitive search
- **multiline**: Enable patterns spanning lines (default: false)
- **head_limit**: Limit output lines/entries

### Pattern Syntax
- Uses ripgrep syntax
- For literal braces use `interface\\{\\}` to find `interface{}`
- For multiline patterns like `struct \\{[\\s\\S]*?field`, use `multiline: true`

## Task Tool

Launch agent for complex searches.

### When to Use
- Searching for keywords when not confident about matches
- Questions like "which file does X?"
- Open-ended searches requiring multiple rounds

### When NOT to Use
- Reading specific file paths (use Read/Glob)
- Searching for specific class definitions (use Glob)
- Searching within specific files (use Read)
- Writing code or running commands

### Usage Notes
- Launch multiple agents concurrently for performance
- Each invocation is stateless
- Agent's final report not visible to user - summarize results
- Clearly specify if expecting code writing or just research