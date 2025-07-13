# MCP (Model Context Protocol) Integration

MCP is an open protocol that enables language models to access external tools and data sources, extending Claude Code's capabilities beyond built-in tools.

## Overview

Key features of MCP:
- **Extensible Architecture**: Add custom tools and data sources
- **Multiple Transports**: Support for stdio, SSE, and HTTP
- **Authentication**: OAuth 2.0 support for secure connections
- **Resource Access**: Reference external resources directly
- **Slash Commands**: Expose server functionality as commands

## Server Configuration

### Adding MCP Servers

MCP servers can be configured at different scope levels:

1. **User scope** (global):
   ```bash
   claude mcp add <name> <command>
   ```

2. **Project scope**:
   ```bash
   claude mcp add <name> <command> --project
   ```

3. **Local scope** (current directory):
   ```bash
   claude mcp add <name> <command> --local
   ```

### Configuration Structure

MCP servers are configured in settings files:

```json
{
  "mcpServers": {
    "filesystem": {
      "transport": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": {
        "ROOT_PATH": "/path/to/project"
      }
    },
    "database": {
      "transport": "http",
      "url": "https://api.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${DB_API_KEY}"
      }
    },
    "analytics": {
      "transport": "sse",
      "url": "https://analytics.example.com/sse"
    }
  }
}
```

## Transport Types

### 1. Stdio Transport

Most common for local servers:

```json
{
  "transport": "stdio",
  "command": "python",
  "args": ["mcp_server.py"],
  "env": {
    "CONFIG_PATH": "./config.json"
  }
}
```

### 2. SSE (Server-Sent Events) Transport

For streaming connections:

```json
{
  "transport": "sse",
  "url": "https://example.com/mcp/sse",
  "headers": {
    "API-Key": "${API_KEY}"
  }
}
```

### 3. HTTP Transport

For request-response patterns:

```json
{
  "transport": "http",
  "url": "https://api.example.com/mcp",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

## Authentication

### OAuth 2.0 Setup

1. **Configure OAuth provider**:
   ```json
   {
     "oauth": {
       "clientId": "your-client-id",
       "authorizationUrl": "https://provider.com/oauth/authorize",
       "tokenUrl": "https://provider.com/oauth/token",
       "scopes": ["read", "write"]
     }
   }
   ```

2. **Authenticate using /mcp command**:
   ```
   /mcp auth <server-name>
   ```

### Environment Variables

Reference environment variables in configuration:

```json
{
  "headers": {
    "Authorization": "Bearer ${MCP_API_TOKEN}"
  }
}
```

## Resource Referencing

### Basic Syntax

Reference external resources using:
```
@server:protocol://resource/path
```

### Examples

1. **File system resource**:
   ```
   Show me @filesystem:file:///home/user/data.csv
   ```

2. **Database resource**:
   ```
   Analyze @database:table://users/recent
   ```

3. **API resource**:
   ```
   Get @api:endpoint://weather/current?city=NYC
   ```

### Multiple Resources

Reference multiple resources in one prompt:
```
Compare @filesystem:file://report1.pdf with @database:query://sales/q4
```

## Slash Commands from MCP

MCP servers can expose prompts as slash commands.

### Format
```
/mcp__servername__promptname
```

### Examples

1. **Database query command**:
   ```
   /mcp__database__query "SELECT * FROM users"
   ```

2. **Deployment command**:
   ```
   /mcp__deploy__production --version 2.0
   ```

3. **Analytics command**:
   ```
   /mcp__analytics__report --period "last-week"
   ```

## Example MCP Servers

### 1. Filesystem Server

```bash
# Install
npm install -g @modelcontextprotocol/server-filesystem

# Add to Claude Code
claude mcp add fs npx @modelcontextprotocol/server-filesystem
```

Configuration:
```json
{
  "filesystem": {
    "transport": "stdio",
    "command": "npx",
    "args": ["@modelcontextprotocol/server-filesystem"],
    "env": {
      "ALLOWED_PATHS": "/home/user/projects,/tmp"
    }
  }
}
```

### 2. Custom Python Server

```python
# mcp_custom_server.py
import asyncio
from mcp import Server, Tool

server = Server("custom-tools")

@server.tool()
async def deploy(environment: str, version: str):
    """Deploy application to specified environment"""
    # Implementation
    return {"status": "deployed", "url": f"https://{environment}.example.com"}

if __name__ == "__main__":
    asyncio.run(server.run())
```

Add to Claude Code:
```bash
claude mcp add custom python /path/to/mcp_custom_server.py
```

### 3. REST API Bridge

```javascript
// mcp-api-bridge.js
const { Server } = require('@modelcontextprotocol/sdk');

const server = new Server({
  name: 'api-bridge',
  tools: {
    fetchData: {
      description: 'Fetch data from REST API',
      parameters: {
        endpoint: { type: 'string', required: true }
      },
      handler: async ({ endpoint }) => {
        const response = await fetch(`https://api.example.com/${endpoint}`);
        return await response.json();
      }
    }
  }
});

server.start();
```

## Security Considerations

  **WARNING**: "Use third party MCP servers at your own risk. Make sure you trust the MCP servers."

### Best Practices

1. **Verify Server Source**:
   - Only use servers from trusted sources
   - Review server code before installation
   - Check for security updates

2. **Limit Permissions**:
   ```json
   {
     "permissions": {
       "allowedOperations": ["read"],
       "deniedPaths": ["/etc", "/sys"]
     }
   }
   ```

3. **Use Environment Variables**:
   - Never hardcode sensitive data
   - Use `${VAR_NAME}` syntax
   - Set variables securely

4. **Network Security**:
   - Use HTTPS for remote servers
   - Verify SSL certificates
   - Implement request timeouts

## Debugging MCP

### Enable Debug Logging

```bash
# Start Claude Code with MCP debugging
export CLAUDE_MCP_DEBUG=true
claude --verbose
```

### Check Server Status

```
/mcp status
```

Shows:
- Connected servers
- Server capabilities
- Recent errors

### Test Server Connection

```bash
# Test stdio server
echo '{"method": "initialize"}' | your-mcp-server

# Test HTTP server
curl -X POST https://example.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "list_tools"}'
```

## Common Issues

### 1. Server Won't Start

- Check command exists in PATH
- Verify file permissions
- Check error logs

### 2. Authentication Failures

- Verify OAuth configuration
- Check token expiration
- Ensure correct scopes

### 3. Resource Not Found

- Verify server is running
- Check resource path syntax
- Ensure proper permissions

### 4. Timeout Errors

- Increase timeout in config
- Check network connectivity
- Verify server performance

## Advanced Configuration

### Custom Environment

```json
{
  "mcpServers": {
    "custom": {
      "transport": "stdio",
      "command": "docker",
      "args": ["run", "--rm", "-i", "mcp-server:latest"],
      "env": {
        "MCP_CONFIG": "${HOME}/.mcp/config.json"
      },
      "cwd": "/workspace"
    }
  }
}
```

### Load Balancing

```json
{
  "mcpServers": {
    "api": {
      "transport": "http",
      "urls": [
        "https://api1.example.com/mcp",
        "https://api2.example.com/mcp"
      ],
      "loadBalancing": "round-robin"
    }
  }
}
```

### Retry Configuration

```json
{
  "mcpServers": {
    "flaky-service": {
      "transport": "http",
      "url": "https://api.example.com/mcp",
      "retry": {
        "maxAttempts": 3,
        "backoff": "exponential",
        "timeout": 5000
      }
    }
  }
}
```

## Creating Your Own MCP Server

### Basic Template (Node.js)

```javascript
const { Server } = require('@modelcontextprotocol/sdk');

const server = new Server({
  name: 'my-server',
  version: '1.0.0',
  capabilities: {
    tools: true,
    resources: true,
    prompts: true
  }
});

// Add tools
server.addTool({
  name: 'myTool',
  description: 'Does something useful',
  parameters: {
    input: { type: 'string', required: true }
  },
  handler: async ({ input }) => {
    // Tool implementation
    return { result: `Processed: ${input}` };
  }
});

// Add resources
server.addResource({
  uri: 'data://my-resource',
  handler: async () => {
    return { content: 'Resource data' };
  }
});

// Start server
server.start();
```

### Testing Your Server

1. **Unit tests**:
   ```javascript
   describe('MCP Server', () => {
     it('should handle tool calls', async () => {
       const result = await server.callTool('myTool', { input: 'test' });
       expect(result).toEqual({ result: 'Processed: test' });
     });
   });
   ```

2. **Integration test with Claude Code**:
   ```bash
   # Add server locally
   claude mcp add test ./my-server.js --local
   
   # Test in Claude Code
   claude "use @test:data://my-resource"
   ```

## Resources

- [MCP Documentation](https://modelcontextprotocol.org)
- [Official MCP Servers](https://github.com/modelcontextprotocol)
- [Community Servers](https://github.com/awesome-mcp)
- [SDK Documentation](https://modelcontextprotocol.org/sdk)