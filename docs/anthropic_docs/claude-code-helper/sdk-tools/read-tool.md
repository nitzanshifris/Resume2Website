# Read Tool Documentation

The Read tool allows Claude Code to read files from the local filesystem.

## Usage
- Access any file directly by providing the file path
- Reads all files on the machine when given valid paths
- Returns error if file doesn't exist

## Parameters
- **file_path**: The absolute path to the file to read (required)
- **limit**: Number of lines to read (optional, defaults to 2000)
- **offset**: Line number to start reading from (optional)

## Features
- By default reads up to 2000 lines from beginning
- Lines longer than 2000 characters are truncated
- Results use cat -n format with line numbers starting at 1
- Supports reading images (PNG, JPG, etc.) - contents presented visually
- For Jupyter notebooks (.ipynb), use NotebookRead instead

## Best Practices
- Always use absolute paths, not relative paths
- Read whole files when possible (don't provide offset/limit unless necessary)
- Can batch read multiple potentially useful files in single response
- Works with temporary file paths like screenshots

## Notes
- If file exists but has empty contents, you'll receive a system reminder warning
- Tool allows reading before making edits to understand context