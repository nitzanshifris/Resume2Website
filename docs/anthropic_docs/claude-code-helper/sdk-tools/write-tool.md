# Write Tool Documentation

The Write tool writes files to the local filesystem.

## Usage
- Overwrites existing files at the provided path
- Must use Read tool first if modifying existing files
- Tool will fail if you didn't read existing file first

## Parameters
- **file_path**: The absolute path to write (required, must be absolute)
- **content**: The content to write to the file (required)

## Best Practices
- ALWAYS prefer editing existing files over writing new ones
- NEVER write new files unless explicitly required
- NEVER proactively create documentation files (*.md) or README files
- Only create documentation if explicitly requested by user
- Only use emojis if user explicitly requests it

## Important Notes
- This tool completely replaces file contents
- Use Edit or MultiEdit tools for modifying specific parts of files
- Always verify directory exists before writing new files