# Claude Code SDK Options

The Claude Code SDK enables programmatic integration into applications, supporting command line, TypeScript, and Python.

## Authentication Methods

### Anthropic API Key
```typescript
const options = {
  apiKey: process.env.ANTHROPIC_API_KEY
};
```

### Third-party Providers

#### Amazon Bedrock
```typescript
const options = {
  provider: 'bedrock',
  region: 'us-east-1',
  profile: 'default'
};
```

#### Google Vertex AI
```typescript
const options = {
  provider: 'vertex',
  project: 'your-project-id',
  location: 'us-central1'
};
```

## TypeScript SDK Usage

### Basic Query
```typescript
import { query } from '@anthropic-ai/claude-code';

const response = await query('explain this function', {
  model: 'claude-3-opus-20240229',
  maxTurns: 10
});
```

### Multi-turn Conversations
```typescript
const conversation = await createConversation(options);

const response1 = await conversation.send('first message');
const response2 = await conversation.send('follow up');
```

### Custom System Prompts
```typescript
const options = {
  systemPrompt: 'You are a helpful coding assistant specializing in React.'
};
```

## Python SDK Usage

### Basic Query
```python
from claude_code import ClaudeCodeOptions, query

options = ClaudeCodeOptions(
    api_key="your-api-key",
    model="claude-3-opus-20240229"
)

response = await query("explain this code", options)
```

### Async Support
```python
import asyncio
from claude_code import query_async

async def main():
    response = await query_async("refactor this function", options)
    print(response)

asyncio.run(main())
```

## Command Line SDK Usage

### Basic Query
```bash
# Simple query
echo "explain this code" | claude -p

# With specific model
claude -p "analyze performance" --model claude-3-opus-20240229

# JSON output
claude -p "list all functions" --output-format json
```

### Piping Input
```bash
# Pipe file content
cat main.py | claude -p "add type hints"

# Pipe command output
git diff | claude -p "explain these changes"
```

## Advanced Options

### Model Context Protocol (MCP)
```typescript
const options = {
  mcpServers: [
    {
      name: 'filesystem',
      command: 'npx',
      args: ['@modelcontextprotocol/server-filesystem']
    }
  ]
};
```

### Permission Handling
```typescript
const options = {
  autoApprove: ['read', 'write'],
  denyTools: ['bash'],
  requireConfirmation: ['edit']
};
```

### Session Management
```typescript
const options = {
  sessionId: 'unique-session-id',
  saveSession: true,
  sessionPath: './sessions'
};
```

## Configuration Options

### Core Options
- `apiKey`: Authentication key
- `model`: Model to use
- `maxTurns`: Maximum agentic turns
- `temperature`: Response randomness (0-1)
- `contextWindow`: Maximum context size

### Tool Options
- `enabledTools`: Array of allowed tools
- `toolTimeout`: Timeout for tool execution
- `autoApprove`: Tools to auto-approve
- `denyTools`: Tools to always deny

### Output Options
- `outputFormat`: 'text' | 'json' | 'stream-json'
- `verbose`: Enable detailed logging
- `quiet`: Suppress non-essential output

### MCP Options
- `mcpServers`: Array of MCP server configurations
- `mcpTimeout`: MCP connection timeout
- `mcpRetries`: Number of retry attempts

## Error Handling

```typescript
try {
  const response = await query('task', options);
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // Handle rate limiting
  } else if (error.code === 'INVALID_API_KEY') {
    // Handle auth errors
  }
}
```

## Best Practices

1. **API Key Security**: Never hardcode API keys
2. **Error Handling**: Always wrap queries in try-catch
3. **Rate Limiting**: Implement exponential backoff
4. **Context Management**: Monitor context window usage
5. **Tool Safety**: Carefully configure tool permissions

## Environment Variables

- `ANTHROPIC_API_KEY`: Default API key
- `CLAUDE_CODE_MODEL`: Default model
- `CLAUDE_CODE_MAX_TURNS`: Default max turns
- `CLAUDE_CODE_OUTPUT_FORMAT`: Default output format