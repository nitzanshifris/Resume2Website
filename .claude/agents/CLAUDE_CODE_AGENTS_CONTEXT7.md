# Claude Code Agents with Context7: Advanced Development Guide

## Overview

Claude Code agents combined with Context7 MCP (Model Context Protocol) provide powerful capabilities for autonomous code analysis, library documentation lookup, and multi-step development tasks. This guide covers how to leverage these tools effectively in your development workflow.

## What is Context7?

Context7 is an MCP (Model Context Protocol) server that provides Claude Code with enhanced capabilities for:
- **Library Resolution**: Identify and resolve library imports from code snippets
- **Documentation Access**: Fetch comprehensive documentation for any npm package, Python library, or other supported ecosystems
- **Intelligent Context**: Provide relevant documentation context based on your codebase needs

## Available Context7 Tools

### 1. `mcp__context7__resolve-library-id`
Resolves library identifiers from import statements or code snippets.

**Use Cases:**
- Identifying which package an import comes from
- Resolving ambiguous library names
- Finding the correct package name for documentation lookup

### 2. `mcp__context7__get-library-docs`
Fetches comprehensive documentation for a specific library.

**Use Cases:**
- Getting API documentation for unfamiliar libraries
- Understanding library capabilities before implementation
- Finding usage examples and best practices

## Claude Code Agent Types

### 1. General-Purpose Agent
**Tools Available:** All tools including Context7
**Best For:**
- Complex multi-step research tasks
- Exploring unfamiliar codebases
- Finding and understanding library usage patterns
- Comprehensive code analysis

### 2. Statusline-Setup Agent
**Tools Available:** Read, Edit
**Best For:**
- Configuring Claude Code status line settings
- UI customization tasks

### 3. Output-Style-Setup Agent
**Tools Available:** Read, Write, Edit, Glob, Grep
**Best For:**
- Creating custom output styles
- Formatting configuration

## Practical Examples

### Example 1: Research Unknown Library Usage

```markdown
Task: "Help me understand how this codebase uses Framer Motion for animations"

Agent Approach:
1. Use general-purpose agent with Context7
2. Agent searches for Framer Motion imports
3. Resolves library ID using mcp__context7__resolve-library-id
4. Fetches documentation with mcp__context7__get-library-docs
5. Analyzes codebase usage patterns
6. Returns comprehensive report with examples
```

### Example 2: Implement New Feature with Unfamiliar Library

```markdown
Task: "Add data visualization using D3.js to our dashboard"

Agent Approach:
1. Launch general-purpose agent
2. Research existing visualization patterns in codebase
3. Use Context7 to fetch D3.js documentation
4. Identify best practices and examples
5. Implement feature following codebase conventions
6. Test and verify implementation
```

### Example 3: Migrate from One Library to Another

```markdown
Task: "Replace moment.js with date-fns throughout the codebase"

Agent Approach:
1. Use general-purpose agent to find all moment.js usage
2. Fetch documentation for both libraries via Context7
3. Create migration mapping between APIs
4. Systematically replace each usage
5. Update dependencies and imports
6. Run tests to verify migration
```

## Best Practices

### 1. When to Use Agents with Context7

**DO Use Agents When:**
- Researching unfamiliar libraries or frameworks
- Needing comprehensive documentation during implementation
- Performing complex searches across multiple files
- Migrating between libraries
- Understanding existing patterns before modifications

**DON'T Use Agents When:**
- You know exactly which file to read (use Read tool directly)
- Searching for a specific class/function name (use Glob/Grep)
- Simple, single-file edits
- Tasks with clear, straightforward steps

### 2. Effective Agent Prompting

```markdown
❌ Poor Prompt:
"Fix the authentication"

✅ Good Prompt:
"Research how authentication is currently implemented using NextAuth, 
fetch documentation for NextAuth v5, and update the authentication 
to support OAuth providers while maintaining existing session handling"
```

### 3. Combining Agent Types

For complex workflows, you might use multiple agents:

```markdown
1. General-purpose agent: Research and understand the task
2. Output-style-setup agent: Configure any needed formatting
3. General-purpose agent: Implement the solution
```

## Advanced Patterns

### Pattern 1: Documentation-Driven Development

```markdown
Workflow:
1. Agent fetches library documentation first
2. Reviews best practices and recommendations
3. Implements following documented patterns
4. Validates against documentation examples
```

### Pattern 2: Exploratory Research

```markdown
Workflow:
1. Agent searches for technology usage patterns
2. Resolves all library dependencies
3. Fetches documentation for each
4. Creates comprehensive technology report
5. Recommends implementation approach
```

### Pattern 3: Automated Refactoring

```markdown
Workflow:
1. Agent identifies refactoring opportunities
2. Fetches documentation for modern alternatives
3. Creates refactoring plan with examples
4. Implements changes systematically
5. Validates with tests
```

## Integration with Resume2Website V4

In the context of the Resume2Website V4 project, agents with Context7 are particularly useful for:

### 1. Template Development
```markdown
Task: "Add animation library to portfolio template"
- Agent researches available animation libraries
- Fetches documentation for Framer Motion, GSAP, etc.
- Analyzes current template structure
- Implements animations following template patterns
```

### 2. Library Migration
```markdown
Task: "Update from Radix UI v1 to v2"
- Agent fetches migration guide via Context7
- Identifies all Radix UI usage in templates
- Updates imports and API changes
- Tests all components
```

### 3. Feature Implementation
```markdown
Task: "Add PDF export capability to portfolios"
- Agent researches PDF generation libraries
- Fetches documentation for react-pdf, jsPDF, etc.
- Evaluates best fit for project needs
- Implements with proper error handling
```

## Performance Considerations

### 1. Agent Invocation
- Agents are stateless - each invocation starts fresh
- Provide comprehensive context in initial prompt
- Batch related tasks in single agent call when possible

### 2. Context7 Usage
- Documentation fetching may take time for large libraries
- Cache commonly used documentation locally when possible
- Be specific about which parts of documentation needed

### 3. Tool Selection
- Direct tools (Read, Grep) are faster for specific tasks
- Agents excel at exploration and research
- Context7 adds value when dealing with external libraries

## Troubleshooting

### Common Issues and Solutions

**Issue: Agent doesn't find expected documentation**
- Solution: Ensure library name is exact (e.g., "react" not "React")

**Issue: Agent takes too long for simple tasks**
- Solution: Use direct tools instead of agents for straightforward operations

**Issue: Context7 returns incomplete documentation**
- Solution: Be specific about documentation sections needed

**Issue: Agent results are too verbose**
- Solution: Specify exactly what information to return in prompt

## Example Agent Invocation

```python
# Example of how Claude Code might invoke an agent with Context7

agent_prompt = """
Research the codebase's use of Tailwind CSS and shadcn/ui components.
Use Context7 to:
1. Fetch latest Tailwind CSS v4 documentation
2. Get shadcn/ui component documentation
3. Analyze how current templates use these libraries
4. Identify any deprecated patterns or outdated usage
5. Return a concise report with:
   - Current usage patterns
   - Recommended improvements
   - Code examples for upgrades
"""

# Agent would then:
# - Search for Tailwind/shadcn imports
# - Resolve library IDs via mcp__context7__resolve-library-id
# - Fetch docs via mcp__context7__get-library-docs
# - Analyze and report findings
```

## Conclusion

Claude Code agents with Context7 provide a powerful combination for:
- Intelligent code exploration
- Documentation-aware development
- Automated refactoring and migration
- Learning new libraries efficiently

By understanding when and how to use these tools together, you can significantly accelerate development workflows and improve code quality through documentation-driven practices.

## Quick Reference

### Agent Selection Cheat Sheet

| Task Type | Recommended Approach |
|-----------|---------------------|
| Find specific file | Direct Read/Glob |
| Research library usage | General-purpose agent + Context7 |
| Simple edit | Direct Edit tool |
| Complex refactoring | General-purpose agent |
| Learn new library | Context7 documentation fetch |
| Multi-file search | General-purpose agent |
| Configure settings | Specialized setup agents |

### Context7 Command Examples

```bash
# These are conceptual - actual usage is through Claude Code
mcp__context7__resolve-library-id "import { motion } from 'framer-motion'"
mcp__context7__get-library-docs "framer-motion"
```

---

*This documentation is part of the Resume2Website V4 project development resources.*