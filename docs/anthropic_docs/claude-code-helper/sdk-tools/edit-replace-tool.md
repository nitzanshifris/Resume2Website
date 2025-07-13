# Edit & Replace Tools Documentation

## Edit Tool

Performs exact string replacements in files.

### Usage Requirements
- Must use Read tool at least once before editing
- Tool will error if attempting edit without reading file first
- Preserve exact indentation (tabs/spaces) from Read output
- Line number prefix format: spaces + line number + tab

### Parameters
- **file_path**: Absolute path to file to modify (required)
- **old_string**: Text to replace (required)
- **new_string**: Replacement text (required, must differ from old_string)
- **replace_all**: Replace all occurrences (optional, default false)

### Best Practices
- ALWAYS prefer editing existing files
- NEVER write new files unless explicitly required
- Only use emojis if user requests it
- Edit will FAIL if old_string is not unique - provide more context or use replace_all
- Use replace_all for renaming variables across file

## MultiEdit Tool

Makes multiple edits to a single file in one operation.

### Usage
- All edits applied sequentially in order provided
- Each edit operates on result of previous edit
- All edits must be valid - if any fails, none applied
- Ideal for several changes to different parts of same file

### Parameters
- **file_path**: Absolute path to file (required)
- **edits**: Array of edit operations, each containing:
  - **old_string**: Text to replace
  - **new_string**: Replacement text
  - **replace_all**: Replace all occurrences (optional)

### Critical Requirements
- Edits are atomic - all succeed or none applied
- Plan carefully to avoid conflicts between sequential operations
- Ensure earlier edits don't affect text later edits need to find
- All edits must result in idiomatic, correct code

### Creating New Files with MultiEdit
- Use new file path
- First edit: empty old_string, new file contents as new_string
- Subsequent edits: normal operations on created content