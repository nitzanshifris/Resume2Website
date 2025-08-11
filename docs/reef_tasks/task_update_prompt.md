# Task Update Prompt for Claude Code

## Your Mission

When you receive a task to validate and update, follow these steps:

### 1. Read and Understand the Task
- Read the complete task description including all subtasks
- Note the task ID, title, and main objective
- Identify all file paths mentioned in the task

### 2. Validate Each Subtask
For EACH subtask, you must:

**a) Check File Existence**
- Use the Read tool to verify if the mentioned file path exists
- If the file doesn't exist, search for the correct file using Grep or Glob
- Update the path to the correct location

**b) Verify Current State**
- Read the relevant sections of code mentioned in the subtask
- Check line numbers and confirm they contain what the task claims
- Document the ACTUAL current state (not what the task says it should be)

**c) Assess Relevance**
- Confirm the subtask is related to the RESUME2WEBSITE project
- Ensure it's not referencing unrelated functionality
- Mark any subtasks that seem unrelated or incorrect

### 3. Create Clean Documentation
Create a markdown file with this structure:

```markdown
# Task #[ID] - [Title]

## 📋 Task Overview
[Table with task metadata]

## 🎯 Current State
[Document what currently exists in the code]

## 🔧 Implementation Subtasks

### [Number] [Subtask Name]
**📁 Path:** [Verified file path]
**✅ Current State:** [What actually exists]
**📝 Implementation:** [What needs to be done]
```

### 4. Important Rules
- **ONLY use information from the actual codebase** - don't invent features or files
- **Keep all placeholders** that were in the original task (marked with 🔴{PLACEHOLDER: ...})
- **Don't add new content** that wasn't in the original task description
- **Update file paths and line numbers** to match the actual code
- **Remove or correct** any implementation details that reference non-existent code

### 5. Save the Result
Save the cleaned task as `reef_task_[number].md` in the `reef_tasks` folder.

## Example Process

```
1. Task says: "Update hero-section.tsx component"
2. You check: hero-section.tsx doesn't exist
3. You search: Find the hero section is actually in page.tsx lines 482-1179
4. You update: Change the task to reference the correct file and lines
5. You verify: Read those lines to confirm the implementation details
6. You document: Create clean markdown with verified information
```

Remember: Your job is to make each task accurate and actionable based on the REAL codebase, not what someone thinks might exist.