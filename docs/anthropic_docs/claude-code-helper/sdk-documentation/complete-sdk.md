# Complete Claude Code SDK Documentation

The Claude Code SDK enables programmatic integration of Claude Code into applications, supporting command line usage, TypeScript, and Python.

## Overview

The SDK provides:
- **Non-interactive mode** for automation and scripting
- **Multi-turn conversations** with context preservation
- **Flexible authentication** supporting multiple providers
- **Extensibility** through Model Context Protocol (MCP)
- **Cross-platform support** for TypeScript and Python

## Authentication

### Anthropic API Key
```typescript
// TypeScript
import { ClaudeCodeOptions } from '@anthropic-ai/claude-code';

const options: ClaudeCodeOptions = {
  apiKey: process.env.ANTHROPIC_API_KEY
};
```

```python
# Python
from claude_code import ClaudeCodeOptions

options = ClaudeCodeOptions(
    api_key=os.environ['ANTHROPIC_API_KEY']
)
```

### Third-party Providers

#### Amazon Bedrock
```typescript
const options: ClaudeCodeOptions = {
  provider: 'bedrock',
  region: 'us-east-1',
  profile: 'default'
};
```

#### Google Vertex AI
```typescript
const options: ClaudeCodeOptions = {
  provider: 'vertex',
  project: 'your-project-id',
  location: 'us-central1'
};
```

## Basic Usage

### Command Line

```bash
# Simple query
claude -p "explain this function"

# With specific model
claude -p "analyze performance" --model claude-3-opus-20240229

# JSON output for parsing
claude -p "list all functions" --output-format json

# Pipe input
cat main.py | claude -p "add type hints"
git diff | claude -p "explain these changes"
```

### TypeScript

```typescript
import { query, createConversation } from '@anthropic-ai/claude-code';

// Simple query
async function simpleExample() {
  const response = await query('explain this function', {
    model: 'claude-3-opus-20240229',
    maxTurns: 10
  });
  console.log(response);
}

// Multi-turn conversation
async function conversationExample() {
  const conversation = await createConversation({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
  
  const response1 = await conversation.send('analyze this codebase');
  console.log(response1);
  
  const response2 = await conversation.send('what are the main issues?');
  console.log(response2);
}
```

### Python

```python
import asyncio
from claude_code import query, create_conversation, ClaudeCodeOptions

# Simple query
async def simple_example():
    options = ClaudeCodeOptions(api_key="your-key")
    response = await query("explain this code", options)
    print(response)

# Multi-turn conversation
async def conversation_example():
    conversation = await create_conversation(options)
    
    response1 = await conversation.send("analyze this codebase")
    print(response1)
    
    response2 = await conversation.send("what are the main issues?")
    print(response2)

# Run async function
asyncio.run(simple_example())
```

## Advanced Features

### Custom System Prompts

```typescript
const options: ClaudeCodeOptions = {
  systemPrompt: `You are a helpful coding assistant specializing in React.
                 Always use functional components and hooks.
                 Prefer TypeScript over JavaScript.`
};
```

### Model Context Protocol (MCP)

MCP allows extending Claude Code with custom tools and data sources.

```typescript
const options: ClaudeCodeOptions = {
  mcpServers: [
    {
      name: 'filesystem',
      command: 'npx',
      args: ['@modelcontextprotocol/server-filesystem'],
      config: {
        rootPath: '/path/to/project'
      }
    },
    {
      name: 'database',
      command: 'python',
      args: ['mcp_database_server.py'],
      env: {
        DATABASE_URL: process.env.DATABASE_URL
      }
    }
  ]
};
```

### Permission Management

```typescript
const options: ClaudeCodeOptions = {
  // Auto-approve certain tools
  autoApprove: ['read', 'write', 'list'],
  
  // Deny specific tools
  denyTools: ['bash', 'execute'],
  
  // Require confirmation for these
  requireConfirmation: ['edit', 'delete'],
  
  // Custom permission handler
  permissionHandler: async (tool, params) => {
    if (tool === 'write' && params.path.includes('test')) {
      return true; // Auto-approve test files
    }
    return null; // Use default behavior
  }
};
```

### Session Management

```typescript
// Save and restore sessions
const options: ClaudeCodeOptions = {
  sessionId: 'unique-session-id',
  saveSession: true,
  sessionPath: './sessions'
};

// Load previous session
const conversation = await createConversation({
  ...options,
  loadSession: 'unique-session-id'
});
```

## Configuration Options

### Core Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `apiKey` | string | Anthropic API key | - |
| `model` | string | Model to use | claude-3-opus-20240229 |
| `maxTurns` | number | Maximum agentic turns | 20 |
| `temperature` | number | Response randomness (0-1) | 0 |
| `contextWindow` | number | Maximum context size | Model default |
| `provider` | string | Auth provider | anthropic |

### Tool Options

| Option | Type | Description |
|--------|------|-------------|
| `enabledTools` | string[] | Allowed tool names |
| `toolTimeout` | number | Tool execution timeout (ms) |
| `autoApprove` | string[] | Auto-approved tools |
| `denyTools` | string[] | Always denied tools |
| `maxFileSize` | number | Max file size for read/write |

### Output Options

| Option | Type | Description |
|--------|------|-------------|
| `outputFormat` | 'text' \| 'json' \| 'stream-json' | Output format |
| `verbose` | boolean | Enable detailed logging |
| `quiet` | boolean | Suppress non-essential output |
| `colorOutput` | boolean | Enable colored output |

### MCP Options

| Option | Type | Description |
|--------|------|-------------|
| `mcpServers` | MCPServer[] | MCP server configurations |
| `mcpTimeout` | number | Connection timeout (ms) |
| `mcpRetries` | number | Retry attempts |
| `mcpDebug` | boolean | Enable MCP debugging |

## Error Handling

```typescript
import { ClaudeCodeError, ErrorCode } from '@anthropic-ai/claude-code';

try {
  const response = await query('task', options);
} catch (error) {
  if (error instanceof ClaudeCodeError) {
    switch (error.code) {
      case ErrorCode.RATE_LIMIT:
        console.log('Rate limited, retry in:', error.retryAfter);
        break;
      case ErrorCode.INVALID_API_KEY:
        console.log('Check your API key');
        break;
      case ErrorCode.CONTEXT_OVERFLOW:
        console.log('Context too large, start new conversation');
        break;
      case ErrorCode.TOOL_ERROR:
        console.log('Tool execution failed:', error.tool);
        break;
    }
  }
}
```

## Streaming Responses

```typescript
// TypeScript streaming
const stream = await queryStream('write a long story', options);

for await (const chunk of stream) {
  if (chunk.type === 'text') {
    process.stdout.write(chunk.content);
  } else if (chunk.type === 'tool_use') {
    console.log('Using tool:', chunk.tool);
  }
}
```

```python
# Python streaming
async for chunk in query_stream("write a long story", options):
    if chunk.type == 'text':
        print(chunk.content, end='')
    elif chunk.type == 'tool_use':
        print(f'Using tool: {chunk.tool}')
```

## Custom Tools

Extend Claude Code with custom tools:

```typescript
import { registerTool } from '@anthropic-ai/claude-code';

registerTool({
  name: 'deploy',
  description: 'Deploy application to production',
  parameters: {
    environment: { type: 'string', required: true },
    version: { type: 'string', required: false }
  },
  execute: async (params) => {
    // Implementation
    return { success: true, url: 'https://...' };
  }
});
```

## Best Practices

### 1. API Key Security
```typescript
// Never hardcode API keys
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error('API key not found');
}
```

### 2. Error Handling
```typescript
// Always wrap in try-catch
async function safeQuery(prompt: string) {
  try {
    return await query(prompt, options);
  } catch (error) {
    console.error('Query failed:', error.message);
    // Implement retry logic
  }
}
```

### 3. Rate Limiting
```typescript
// Implement exponential backoff
async function queryWithRetry(prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await query(prompt, options);
    } catch (error) {
      if (error.code === ErrorCode.RATE_LIMIT && i < retries - 1) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
      throw error;
    }
  }
}
```

### 4. Context Management
```typescript
// Monitor context usage
const conversation = await createConversation({
  ...options,
  onContextWarning: (usage) => {
    console.log(`Context ${usage.percentage}% full`);
    if (usage.percentage > 80) {
      // Start new conversation
    }
  }
});
```

### 5. Tool Safety
```typescript
// Validate tool usage
const options: ClaudeCodeOptions = {
  permissionHandler: async (tool, params) => {
    // Check against allowlist
    if (!ALLOWED_PATHS.some(p => params.path.startsWith(p))) {
      return false;
    }
    return true;
  }
};
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Default API key |
| `CLAUDE_CODE_MODEL` | Default model |
| `CLAUDE_CODE_MAX_TURNS` | Default max turns |
| `CLAUDE_CODE_OUTPUT_FORMAT` | Default output format |
| `CLAUDE_CODE_MCP_TIMEOUT` | MCP timeout |
| `CLAUDE_CODE_DEBUG` | Enable debug mode |

## Integration Examples

### GitHub Actions
```yaml
- name: Code Review
  run: |
    npx @anthropic-ai/claude-code -p "review this PR for security issues" \
      --output-format json > review.json
```

### Pre-commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit
changes=$(git diff --cached)
echo "$changes" | npx @anthropic-ai/claude-code -p \
  "check for security issues or bugs" \
  --output-format json
```

### VS Code Extension
```typescript
import * as vscode from 'vscode';
import { query } from '@anthropic-ai/claude-code';

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('claude.explain', async () => {
    const editor = vscode.window.activeTextEditor;
    const selection = editor.document.getText(editor.selection);
    
    const explanation = await query(`Explain this code: ${selection}`, {
      apiKey: vscode.workspace.getConfiguration('claude').get('apiKey')
    });
    
    vscode.window.showInformationMessage(explanation);
  });
  
  context.subscriptions.push(command);
}
```

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify API key is correct
   - Check provider configuration
   - Ensure network connectivity

2. **Tool Execution Errors**
   - Check file permissions
   - Verify paths are correct
   - Review tool timeout settings

3. **Context Overflow**
   - Start new conversation
   - Use `--max-turns` to limit
   - Clear unnecessary context

4. **MCP Connection Issues**
   - Check server command exists
   - Verify server configuration
   - Enable MCP debug logging

### Debug Mode

```bash
# Enable debug logging
export CLAUDE_CODE_DEBUG=true
claude -p "debug this issue" --verbose
```

## Additional Resources

- [API Reference](https://docs.anthropic.com/claude-code/api)
- [MCP Documentation](https://modelcontextprotocol.org)
- [Example Projects](https://github.com/anthropics/claude-code-examples)
- [Community Tools](https://github.com/awesome-claude-code)