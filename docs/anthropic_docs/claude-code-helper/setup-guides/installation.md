# Claude Code Installation Guide

## System Requirements

### Operating Systems
- **macOS**: 10.15 (Catalina) or newer
- **Linux**: Ubuntu 20.04+, Debian 10+, or compatible distributions
- **Windows**: Via WSL (Windows Subsystem for Linux)

### Hardware Requirements
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 500MB free space
- **CPU**: Any x64 or ARM64 processor

### Software Requirements
- **Node.js**: Version 18 or newer
- **Network**: Active internet connection
- **Shell**: Works best with Bash, Zsh, or Fish

## Standard Installation

### 1. Install Node.js
If not already installed, download from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 8.0.0 or higher
```

### 2. Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

**Important**: Do NOT use `sudo npm install -g` as it can cause permission issues

### 3. Verify Installation
```bash
claude doctor
```

This command checks:
- Node.js version compatibility
- Network connectivity
- Authentication status
- Tool availability

### 4. Start Using Claude Code
Navigate to your project directory and run:
```bash
claude
```

## Authentication Options

### 1. Anthropic Console (Default)
- Sign up at [console.anthropic.com](https://console.anthropic.com)
- Claude Code will open browser for authentication
- One-time setup per machine

### 2. Claude App (Pro/Team Plans)
- Requires active Claude Pro or Team subscription
- Authenticate through Claude desktop app
- Seamless integration with app sessions

### 3. Enterprise Platforms

#### Amazon Bedrock
```bash
export CLAUDE_PROVIDER=bedrock
export AWS_REGION=us-east-1
export AWS_PROFILE=default
```

#### Google Vertex AI
```bash
export CLAUDE_PROVIDER=vertex
export GOOGLE_PROJECT_ID=your-project-id
export GOOGLE_LOCATION=us-central1
```

## Update Management

### Automatic Updates
- Enabled by default
- Checks for updates on startup
- Non-intrusive background downloads

### Manual Updates
```bash
claude update
```

### Disable Auto-Updates
```bash
# Via environment variable
export CLAUDE_DISABLE_AUTO_UPDATE=true

# Via configuration file
echo '{"autoUpdate": false}' > ~/.config/claude/settings.json
```

## Alternative Installation Methods

### Local Installation (Project-specific)
```bash
cd your-project
npm install @anthropic-ai/claude-code
npx claude
```

### Native Binary (Alpha)
Download platform-specific binary from GitHub releases:
- No Node.js dependency
- Faster startup time
- Experimental feature

## Troubleshooting Common Issues

### Permission Errors
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Network Issues
```bash
# Check connectivity
claude doctor --verbose

# Use proxy if needed
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

### Node.js Version Issues
```bash
# Use Node Version Manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

## Platform-Specific Notes

### macOS
- May need to allow terminal permissions in System Preferences
- Homebrew users can install Node.js via `brew install node`

### Linux
- Some distributions require additional build tools
- Install with: `sudo apt-get install build-essential` (Ubuntu/Debian)

### Windows (WSL)
1. Install WSL2: `wsl --install`
2. Install Ubuntu from Microsoft Store
3. Follow Linux installation steps within WSL

## Configuration Files

Claude Code uses configuration files in this order:
1. Project: `.claude/settings.json`
2. User: `~/.config/claude/settings.json`
3. System: `/etc/claude/settings.json`

Example configuration:
```json
{
  "model": "claude-3-opus-20240229",
  "autoUpdate": true,
  "theme": "dark",
  "editor": "vim"
}
```

## Next Steps

1. Run `claude` to start interactive session
2. Try `claude "explain this project"` in any codebase
3. Use `/help` to see available commands
4. Read the [Quickstart Guide](quickstart.md) for usage tips

## Getting Help

- Run `claude doctor` for diagnostics
- Check [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- Visit [documentation](https://docs.anthropic.com/claude-code)
- Use `/bug` command to report issues