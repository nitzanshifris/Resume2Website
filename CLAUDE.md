# CV2WEB V4 - Claude Code Development Guide

## Project Overview

CV2WEB is an AI-powered CV to portfolio website converter that transforms resumes into stunning portfolio websites using FastAPI (Python) backend and Next.js (TypeScript) frontend in a pnpm monorepo.

### What CV2WEB Does
- **Extracts** CV data using Claude 4 Opus for maximum determinism (temperature 0.0)
- **Supports** multiple file uploads including PNG/JPEG images processed together
- **Generates** beautiful portfolio websites with 100+ animated components in isolated sandbox environments
- **Provides** AI-powered portfolio expert guidance using Claude 4 for personalized recommendations
- **Offers** full CV editing capabilities with CRUD operations and original file preservation
- **Manages** multiple portfolio instances with real-time health monitoring and server management
- **Authenticates** users with both email/password and Google OAuth
- **Deploys** to Vercel with one click
- **Supports** multiple file formats (PDF, DOCX, images, etc.)

## Language Configuration 

### Language Communication Guidelines
- Always answer in English! even if the user uses Hebrew, answer in English
- Maintain clear and professional communication
- Prioritize technical accuracy and detailed explanations

### Tech Stack at a Glance
- **Backend**: FastAPI + Python 3.11+ with SQLite database
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS v4
- **Authentication**: Google OAuth 2.0 + Email/Password with bcrypt
- **AI Services**: Claude 4 Opus ONLY (deterministic CV extraction at temperature 0.0)
- **UI Libraries**: Aceternity UI, Magic UI (100+ animated components)
- **Infrastructure**: Vercel deployment, Railway, local development
- **Database**: SQLite with session-based authentication
- **Package Manager**: pnpm for main project, npm for sandboxes only

## 🚀 Quick Start

### Prerequisites
```bash
# Required tools
node >= 18.0.0          # For frontend
python >= 3.11          # For backend  
pnpm >= 8.0.0          # Package manager for main project (NOT npm/yarn)
                       # Note: Sandboxes use npm for compatibility
git                    # Version control
```

### One-Command Setup
```bash
# Clone and setup everything
git clone <repo-url> && cd CV2WEB-V4
./quickstart.sh

# This script will:
# 1. Install all dependencies
# 2. Setup Python virtual environment
# 3. Configure environment variables
# 4. Initialize database
# 5. Start development servers
```

## 📋 Development Workflow

### Daily Development Commands
```bash
# Frontend development
pnpm run dev            # Start Next.js dev server (http://localhost:3000)
pnpm run typecheck      # ⚠️ MUST run before committing
pnpm run build          # Build for production

# Backend development
source venv/bin/activate                     # Activate Python environment
uvicorn main:app --reload --port 2000       # Start FastAPI (http://localhost:2000)
python3 main.py                              # Alternative start method
```

### Git Workflow - MANDATORY BRANCH-BASED DEVELOPMENT

⚠️ **CRITICAL**: Claude Code MUST follow these Git rules:
1. **NEVER** work directly on `main` branch
2. **ALWAYS** create a feature branch before making changes
3. **ALWAYS** ask for explicit approval before `git push`
4. **ALWAYS** ask for explicit approval before `git commit`

```bash
# 1. MANDATORY: Check current branch first
git branch --show-current  # Must NOT be 'main'
# Note: Currently on 'main' branch (as of 2025-08-05)

# 2. Create feature branch (REQUIRED)
git checkout -b feature/description
# Branch naming: feature/*, fix/*, docs/*, refactor/*

# 3. Make changes and verify
pnpm run typecheck      # No TypeScript errors
pytest                  # Backend tests pass

# 4. Stage changes (ask user first)
git add .               # ⚠️ Requires user approval

# 5. Commit (ask user first)
git commit -m "feat: add new portfolio template"  # ⚠️ Requires user approval
# Commit types: feat|fix|docs|style|refactor|test|chore

# 6. Push (ask user first)
git push origin feature/description  # ⚠️ Requires user approval

# 7. Create PR
gh pr create --title "feat: description" --body "Closes #123"
```

#### Git Safety Checklist for Claude Code
- [ ] Currently on feature branch (not main)
- [ ] All tests passing
- [ ] TypeScript checks passing
- [ ] User approved staging changes
- [ ] User approved commit message
- [ ] User approved push to remote

## 🏗️ Architecture

### Project Structure
```
CV2WEB-V4/
├── src/                    # Backend (FastAPI)
│   ├── api/               # API routes and endpoints
│   │   └── routes/        # Individual route modules
│   │       ├── portfolio_generator.py # Main portfolio creation & management
│   │       ├── cv.py                  # CV CRUD operations
│   │       ├── auth.py                # Authentication endpoints
│   │       ├── archived/              # Deprecated/unused routes
│   │       └── future_use/            # Ready but not yet active
│   │           └── portfolio_expert.py # AI portfolio guidance (not mounted)
│   ├── core/              # Business logic
│   │   ├── cv_extraction/ # AI-powered CV parsing (Claude 4)
│   │   ├── generators/    # Portfolio generation system
│   │   └── schemas/       # Data models
│   ├── services/          # Business services
│   │   └── claude_portfolio_expert.py # AI expert service
│   └── templates/         # Portfolio templates with data adapters
│       ├── v0_template_v1.5/ # Modern portfolio template v1.5
│       └── v0_template_v2.1/ # Modern portfolio template v2.1
│           └── lib/       # Data transformation adapters
├── user_web_example/      # Main frontend (Next.js)
│   ├── app/              # App router pages
│   └── components/       # React components
├── packages/              
│   └── new-renderer/      # Legacy frontend (not actively used)
│       └── components/    # React components
├── components/            # Shared UI components
│   ├── aceternity/        # Premium animations
│   └── magicui/          # Magic UI library
├── data/                  # File storage and examples
│   ├── uploads/          # User uploaded files (preserved)
│   └── generated_portfolios/ # Generated portfolio outputs
├── sandboxes/            # Isolated portfolio generation environments
├── tests/                # Test suites
├── docs/                 # Technical documentation
└── .taskmaster/         # AI task management
```

### Data Flow
```
User Upload → File Validation → AI Extraction → CV Editor → Portfolio Expert → Generation → Preview → Deploy
     ↓              ↓                ↓             ↓            ↓                ↓           ↓        ↓
   (FastAPI)    (Security)      (Claude 4)   (CRUD Ops)   (AI Guidance)    (Sandbox)   (Next.js) (Vercel)
```

### New Portfolio Generation Pipeline
```
1. CV Upload & Processing
   ├── File preservation in data/uploads/
   ├── Claude 4 Opus extraction (temperature 0.0)
   ├── Advanced section classification
   └── File hash caching for deduplication

2. CV Editor (CRUD Operations)
   ├── Edit extracted sections (Hero, Contact, Experience, Education, Skills)
   ├── Add/remove/reorder items in lists
   ├── Real-time data validation
   └── Save changes to SQLite database

3. Portfolio Expert (AI Guidance)
   ├── CV analysis for completeness and industry insights
   ├── Personalized recommendations based on experience level
   ├── Content strategy and technical guidance
   └── Style preferences and template suggestions

4. Portfolio Generation (Isolated Sandboxes)
   ├── Create isolated Next.js environment
   ├── Inject CV data via adapter system
   ├── Install dependencies and configure environment
   ├── Start development server on unique port
   └── Real-time health monitoring

5. Portfolio Management
   ├── Multiple portfolio instances per user
   ├── Server start/stop/restart operations
   ├── Health checks and status monitoring
   └── Direct preview links to running portfolios
```

## ⚙️ Configuration

### Environment Setup
```bash
# Backend configuration (config.py)
BACKEND_PORT = 2000             # ⚠️ Not 8000!
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]

# AI Models
PRIMARY_MODEL = "claude-opus-4-20250514"  # Claude 4 Opus for deterministic extraction
FALLBACK_MODEL = "claude-opus-4-20250514"
EXTRACTION_TEMPERATURE = 0.0  # Maximum determinism
```

### Credential Management
```bash
# ⚠️ NEVER commit API keys! Use keychain manager:
python3 src/utils/setup_keychain.py

# This securely stores:
# - Google Cloud credentials
# - Anthropic API keys  
# - OpenAI API keys
# - AWS credentials
```

## 🤖 TaskMaster Integration

TaskMaster AI helps break down complex features into manageable tasks.

### Automatic Workflow Triggers
When you say any of these, TaskMaster activates automatically:
- "add [feature]" / "implement [feature]" / "create [feature]"
- "build [component/system]" / "develop [functionality]"
- "I want to [do something]" / "help me [build/create/add]"
- "let's work on [feature]" / "start working on [task]"
- Any request involving multiple steps or complex implementation

DO NOT use TaskMaster for:
- Simple bug fixes
- Quick questions
- Code explanations
- Single file edits

### TaskMaster Commands
```bash
# View available tasks
taskmaster list --status=pending

# Get next task
taskmaster next

# Complete a task
taskmaster set-status --id=<task-id> --status=done

# Break down complex tasks
taskmaster expand --id=<task-id>

# Research best practices
taskmaster research "Next.js 15 patterns"
```

### Custom Slash Commands
Use these in Claude Code chat:
- `/task:new <feature>` - Start new feature with PRD
- `/task:next` - Get next task to work on
- `/task:status` - View project progress
- `/task:implement <id>` - Start implementing specific task
- `/task:workflow <feature>` - Complete feature workflow
- `/task:list [status]` - List tasks by status
- `/task:expand <id>` - Break down complex task
- `/task:done <id>` - Mark task as complete

### Example TaskMaster Workflow
```
User: "Add dark mode to the app"
Claude: [Automatically creates PRD → generates tasks → analyzes → starts implementation]
```

### CV2WEB Specific TaskMaster Usage
- **CV Extraction**: `create tasks for improving CV extraction with Claude 4 Opus`
- **UI Components**: `break down portfolio templates focusing on Aceternity components`
- **API Features**: `create tasks for new FastAPI endpoint with authentication`
- **Research**: `research latest Next.js 15 patterns and update our frontend tasks`

## 🎨 UI Development with Magic MCP

### What is Magic MCP?
Magic Component Platform (MCP) is an AI-powered tool that generates beautiful UI components through natural language descriptions. It integrates with Cursor IDE and creates production-ready React/TypeScript components.

### Setup for CV2WEB Development
1. **Install in Cursor**:
   ```bash
   # Get API key from https://21st.dev
   npx @21st-dev/cli@latest install cursor --api-key YOUR_API_KEY
   ```

2. **Using Magic MCP**:
   In Cursor's AI chat, type `/ui` followed by your component description:
   ```
   /ui create a modern portfolio hero section with animated gradient background
   /ui create an interactive skills showcase with progress bars
   /ui create a timeline component for work experience
   ```

### Benefits for CV2WEB
- **Rapid Prototyping**: Generate portfolio components instantly
- **Modern Design**: Access to 21st.dev's component library
- **TypeScript Ready**: All components are fully typed
- **Customizable**: Generated components can be modified to match CV2WEB's design system

### Example Use Cases
```bash
# Portfolio Components
/ui create a project gallery with filter buttons and hover effects
/ui create a testimonials carousel with smooth transitions
/ui create a contact form with validation and animated feedback

# CV Display Components  
/ui create a skills matrix with categorized progress bars
/ui create an education timeline with institution logos
/ui create a certifications grid with hover details
```

### Integration Workflow
1. Use `/ui` in Cursor to generate component
2. Review and customize the generated code
3. Move component to appropriate directory (`components/` or `src/templates/`)
4. Integrate with CV2WEB's data structures
5. Apply consistent styling with Tailwind CSS

## 🛠️ Common Development Tasks

### Adding a New Portfolio Template
```typescript
// 1. Create template directory structure
// src/templates/new-template/
├── app/                     # Next.js app directory
│   ├── page.tsx            # Main portfolio page
│   ├── globals.css         # Template-specific styles
│   └── layout.tsx          # Layout component
├── lib/                    # Template utilities
│   ├── cv-data-adapter.tsx # Data transformation adapter
│   └── data.tsx           # Data types and demo data
├── components/             # Template-specific components
├── package.json           # Template dependencies
└── tailwind.config.js     # Tailwind configuration

// 2. Implement CV data adapter
// src/templates/new-template/lib/cv-data-adapter.tsx
export const adaptCVData = (cvData: CVData): TemplateData => {
  return {
    hero: {
      name: cvData.hero?.name || "Your Name",
      title: cvData.hero?.title || "Professional Title",
      // ... other mappings
    }
  }
}

// 3. Register template in portfolio generator
// src/api/routes/portfolio_generator.py
AVAILABLE_TEMPLATES = {
    "v0_template_v1.5": "src/templates/v0_template_v1.5",
    "v0_template_v2.1": "src/templates/v0_template_v2.1"
}
DEFAULT_TEMPLATE = "v0_template_v1.5"
```

### Adding a New API Endpoint
```python
# 1. Create route file
# src/api/routes/analytics.py
from fastapi import APIRouter, Depends
from src.api.dependencies import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/usage")
async def get_usage_stats(user=Depends(get_current_user)):
    return {"total_cvs": 1234, "user_id": user.id}

# 2. Register in main.py
from src.api.routes import analytics
app.include_router(analytics.router, prefix="/api/v1")

# 3. Test the endpoint
# http://localhost:2000/docs
```

### Working with Portfolio Expert System (Currently in future_use - not mounted)
```python
# NOTE: Portfolio Expert is implemented but not currently mounted in main.py
# To enable: import and mount portfolio_expert.py from src/api/routes/future_use/
# Using the Portfolio Expert API
# src/api/routes/future_use/portfolio_expert.py

# 1. Start expert session
POST /api/v1/portfolio-expert/start-session
{
    "cv_data": {...},  # Optional: Include CV data for analysis
    "user_preferences": {...}  # Optional: Style preferences
}

# 2. Chat with expert
POST /api/v1/portfolio-expert/chat
{
    "session_id": "session_123",
    "message": "What template would work best for a software engineer?"
}

# 3. Generate portfolio from expert recommendations
POST /api/v1/portfolio-expert/generate
{
    "session_id": "session_123",
    "template_id": "v0_template_v1.5",
    "customizations": {...}
}
```

### Managing Portfolio Instances
```python
# Portfolio Generation and Management (PRIMARY GENERATION SCRIPT)
# src/api/routes/portfolio_generator.py
# Mounted at: /api/v1/portfolio/* (not /api/v1/portfolios/*)

# 1. Create new portfolio (anonymous access allowed)
POST /api/v1/portfolio/generate-anonymous/{job_id}
{
    "template": "v0_template_v1.5",  # or "v0_template_v2.1"
    "config": {...}
}

# 1b. Create new portfolio (authenticated)
POST /api/v1/portfolio/generate/{job_id}
{
    "template": "v0_template_v1.5",
    "config": {...}
}

# 2. List user's portfolios
GET /api/v1/portfolio/list

# 3. Get portfolio status
GET /api/v1/portfolio/{portfolio_id}/status

# 4. Restart portfolio server
POST /api/v1/portfolio/{portfolio_id}/restart

# 5. Stop portfolio server
POST /api/v1/portfolio/{portfolio_id}/stop
```

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `pnpm install` in project root |
| TypeScript errors | Run `pnpm run typecheck` to see all errors |
| "Port 2000 already in use" | Kill existing process: `lsof -ti:2000 \| xargs kill` |
| Portfolio server won't start | Check ports 4000+ range availability |
| Import errors | Ensure using `src/` prefix for absolute imports |
| CV extraction fails | Check Claude API quota and credentials |
| Large file warning | Use Git LFS for files >50MB |
| SSE connection error | Normal for MVP - using simulated progress instead |
| PDF not displaying | Check file exists in `data/uploads/` with job_id |
| Portfolio Expert timeout | Check Claude API rate limits and retry |
| Sandbox generation fails | Verify Node.js and npm available in PATH |
| CV data not loading in template | Check cv-data-adapter.tsx implementation |
| Multiple portfolio conflicts | Each portfolio uses unique port (4000+) |
| File preservation issues | Ensure proper session authentication |
| **CSS not loading / Broken HTML display** | Ensure `postcss.config.mjs` includes both `tailwindcss` AND `autoprefixer`. Clear `.next` cache and restart dev server |
| **Hydration errors** | Add `suppressHydrationWarning` to elements with dynamic content. Use `dynamic` imports with `ssr: false` for browser-only components |
| **Next.js binary not found** | npm install issues in sandboxes - switch to npm from pnpm |
| **Multiple lockfile conflicts** | Clean all lockfiles before installation |
| **Watchfiles overload (thousands of changes)** | Add .watchmanconfig and uvicorn reload_excludes |

### Debug Commands
```bash
# Check service status
curl http://localhost:2000/health    # Backend health
curl http://localhost:3000/api/health # Frontend health

# Validate PostCSS configurations
python3 src/utils/validate_postcss_config.py  # Check all PostCSS configs
echo "y" | python3 src/utils/validate_postcss_config.py  # Auto-fix issues

# Portfolio management
curl http://localhost:2000/api/v1/portfolio/list     # List user portfolios
curl http://localhost:2000/api/v1/portfolio/status   # Check all portfolio status

# Portfolio Expert debugging
curl -X POST http://localhost:2000/api/v1/portfolio-expert/start-session \
  -H "Content-Type: application/json" \
  -d '{"cv_data": null}'

# View logs
docker logs cv2web-backend -f        # Backend logs
pnpm run dev --verbose               # Frontend verbose logs

# Database issues
python3 src/utils/init_db.py          # Reinitialize database

# Portfolio sandbox debugging
ps aux | grep node                   # Check running portfolio servers
lsof -i :4000-4010                  # Check portfolio port usage

# Check for dependency issues
pnpm why [package]                   # Check why package installed
pnpm ls                              # List all workspace packages
```

### Debugging Tips
- **Backend logs**: Check terminal running uvicorn
- **Frontend errors**: Open browser DevTools Console (F12)
- **Python errors**: Check venv is activated (`which python` should show venv path)
- **TypeScript errors**: Run `pnpm run typecheck`
- **API issues**: Visit http://localhost:2000/docs for FastAPI interactive docs

## 📚 Code Style Guide

### TypeScript/React
```typescript
// ✅ CORRECT
import { useEffect } from 'react'
export const ProfileCard: React.FC<Props> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false)
  // Component logic
}

// ❌ INCORRECT  
const profileCard = require('./ProfileCard')  // No CommonJS
export default function ProfileCard({user}) {  // Must use arrow functions
  const [is_loading, set_is_loading] = useState() // Use camelCase
}
```

### Python/FastAPI
```python
# ✅ CORRECT
from typing import Optional
from src.core.schemas import CVData

async def extract_cv_data(file_path: str) -> Optional[CVData]:
    """Extract CV data with type hints."""
    # Implementation
    
# ❌ INCORRECT
def extract_cv_data(file_path):  # Missing type hints
    # Missing docstring
    from core.schemas import *   # No wildcard imports
```

### Important Conventions
- **MUST** use ES modules: `import { foo } from 'bar'` (NOT require)
- **MUST** run typecheck before committing
- Prefer functional React components with hooks
- Use Tailwind CSS classes for styling
- Use type hints for all Python functions
- Use absolute imports: `from src.api.routes import cv`
- Follow PEP 8 conventions

## 🎨 CSS Configuration Requirements

### PostCSS Configuration (CRITICAL)
The `postcss.config.mjs` file MUST include both plugins:
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},  // ⚠️ REQUIRED - Without this, CSS won't load!
  },
};

export default config;
```

### Troubleshooting CSS Issues
If you encounter broken HTML display (no styling):
1. Check `postcss.config.mjs` has BOTH `tailwindcss` and `autoprefixer`
2. Clear build cache: `rm -rf .next`
3. Restart dev server: `pnpm run dev`
4. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## 🚀 Quick Fix Reference

### Portfolio Generation Issues
```bash
# Issue: Next.js binary not found
# Fix: Already switched to npm in sandboxes

# Issue: Multiple lockfile conflicts  
# Fix: We now clean all lockfiles before install

# Issue: Watchfiles detecting thousands of changes
# Fix: Added .watchmanconfig + uvicorn excludes

# Issue: Path duplication in Next.js check
# Fix: Use binary directly: [str(next_bin_path), "--version"]

# Issue: Portfolio stuck at 55% progress
# Fix: Check API response format, use fallback logic
```

### Performance Tips
1. **Restart backend with optimizations**: `python main.py` (includes reload excludes)
2. **Check portfolio health**: `curl http://localhost:2000/api/v1/portfolio/list`
3. **Monitor sandbox creation**: Look for npm (not pnpm) in logs
4. **Verify watchfiles**: Should see minimal change detections

## 🚢 Deployment

### Local Testing
```bash
# Build and test production build
pnpm run build
pnpm run start

# Test with production environment
NODE_ENV=production pnpm run start
```

### Deploy to Vercel
```bash
# Automatic deployment on push to main
git push origin main

# Manual deployment
vercel --prod

# Preview deployment
vercel
```

### GitHub Integration
- **PR Reviews**: Mention `@claude` in PR comments for AI review
- **CI/CD**: Automated workflows in `.github/workflows/`
- **Actions**: Claude Code GitHub Action configured

## 📖 Additional Resources

### Important Files
- `CLAUDE.md` - This file, for Claude Code context
- `config.py` - Backend configuration
- `package.json` - Frontend dependencies and scripts
- `.taskmaster/` - Task management and PRDs
- `requirements.txt` - Python dependencies


### AI Services & Configuration
- **Claude 4 Opus** - CV extraction ONLY (deterministic with temperature 0.0)
- **Note**: Other AI services (Gemini, Claude 3.5 Sonnet) are disabled/unused
- **AWS Textract** - Alternative OCR
- **OpenAI API** - Optional enhancement
- **Vercel** - Deployment platform
- **Pinecone** - Optional vector search

### External Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Aceternity UI](https://ui.aceternity.com/)
- [Magic UI](https://magicui.design/)
- [pnpm Docs](https://pnpm.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Utility Scripts
```bash
# Development utilities
python3 src/utils/setup_keychain.py      # Setup credentials

# Note: Portfolio generation scripts have been moved to legacy/
# New template-based portfolio system is being implemented
```

## ⚠️ Critical Reminders

1. **ALWAYS** run `pnpm run typecheck` before committing
2. **NEVER** use npm or yarn in main project - only pnpm (sandboxes use npm)
3. **NEVER** commit API keys - use keychain manager
4. **ALWAYS** check existing components before creating new ones
5. Backend runs on port **2000**, not 8000
6. Maximum file upload size is **10MB**
7. Use **Read/Grep** tools to research before coding
8. **NEVER** use code from `/legacy/` directory
9. **Note**: config.py and main.py at root are still actively used
10. **ALWAYS** ask for explicit approval before running `git push` - never push without permission
11. **ALWAYS** work on feature branches - NEVER on main branch
12. **ALWAYS** ask for approval before `git add`, `git commit`, or `git push`
13. **ALWAYS** use isolated sandbox environments for code generation
14. **ALWAYS** implement live readable logging for transparency
15. **ALWAYS** use CV examples from `data/cv_examples/` directory for testing - NEVER use made-up CV data
16. **ALWAYS** use existing actual code from the codebase - NEVER create or run demos, tests, or proof-of-concept files
17. **ALWAYS** ensure `postcss.config.mjs` includes BOTH `tailwindcss` AND `autoprefixer` - without autoprefixer, CSS won't load!

## Auto-use Context7
When asked about any of these, **ALWAYS** use Context7 MCP tools:
- FastAPI implementation patterns
- React/Next.js best practices
- Anthropic Claude 4 Opus API integration ONLY
- Tailwind CSS v4 patterns
- TypeScript patterns
- Any library documentation
- Code examples from external libraries

## 🔒 Isolated Environment & Sandbox Development

### Portfolio Generation Sandboxing
To ensure security and prevent direct code pollution, ALL portfolio generation MUST use isolated environments:

```bash
# Sandbox directory structure
CV2WEB-V4/
├── sandboxes/              # Isolated environment for code generation
│   ├── .gitignore          # Ignore all sandbox contents
│   └── portfolios/         # Generated portfolio sandboxes
│       └── {job-id}/       # Individual portfolio sandbox
│           ├── src/        # Generated code
│           ├── package.json
│           └── preview.url # Preview link
```

### Sandbox Workflow
1. **Create isolated environment** for each portfolio generation
2. **Generate code** in sandbox, not main codebase
3. **Preview in isolation** before user approval
4. **Export approved code** to final destination
5. **Clean up sandbox** after completion

### Sandbox-Specific Configuration
```python
# portfolio_generator.py - Key differences for sandboxes:

# 1. Use npm instead of pnpm
install_cmd = ["npm", "install", "--legacy-peer-deps"]

# 2. Clean ALL lockfiles before installation
for lockfile in [pnpm_lock_path, npm_lock_path, yarn_lock_path]:
    if lockfile.exists():
        lockfile.unlink(missing_ok=True)

# 3. Create .watchmanconfig in each sandbox
watchman_config = {
    "ignore_dirs": ["node_modules", ".next", ".git", "dist", "build"]
}

# 4. Start server with npm (not pnpm)
start_commands = [
    (["npm", "run", "dev"], "npm run dev"),
    (["npx", "next", "dev", "-p", str(port)], "npx next dev"),
    (["node", "node_modules/.bin/next", "dev", "--port", str(port)], "direct node")
]
```

### Claude SDK Best Practices
- Use persistent memory via Markdown files in `.claude/memory/`
- Implement retry logic with exponential backoff
- Cache API responses to reduce redundant calls
- Stream responses for real-time feedback
- Use structured prompts for consistent output

## 📊 Live Readable Logging

### Logging Standards
```python
# src/utils/live_logger.py
import logging
from datetime import datetime
from typing import Any, Dict

class LiveLogger:
    """Structured logging with live readable output."""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Console handler with readable format
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s | %(name)-12s | %(levelname)-8s | %(message)s',
            datefmt='%H:%M:%S'
        )
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
    
    def step(self, step_name: str, details: Dict[str, Any] = None):
        """Log a major step in the process."""
        self.logger.info(f"🚀 STEP: {step_name}")
        if details:
            for key, value in details.items():
                self.logger.info(f"   └─ {key}: {value}")
    
    def progress(self, task: str, current: int, total: int):
        """Log progress for long-running tasks."""
        percentage = (current / total) * 100
        bar = '█' * int(percentage / 5) + '░' * (20 - int(percentage / 5))
        self.logger.info(f"⏳ {task}: [{bar}] {percentage:.1f}%")
    
    def success(self, message: str):
        """Log successful completion."""
        self.logger.info(f"✅ SUCCESS: {message}")
    
    def warning(self, message: str):
        """Log warnings."""
        self.logger.warning(f"⚠️  WARNING: {message}")
    
    def error(self, message: str, error: Exception = None):
        """Log errors with details."""
        self.logger.error(f"❌ ERROR: {message}")
        if error:
            self.logger.error(f"   └─ Details: {str(error)}")
```

### Logging Best Practices
1. **Use structured prefixes**: 🚀 (start), ⏳ (progress), ✅ (success), ⚠️ (warning), ❌ (error)
2. **Log at decision points**: Show AI reasoning process
3. **Include timing**: Track performance of each step
4. **Be concise but informative**: One line per action
5. **Group related logs**: Use indentation for sub-tasks

## 📄 CV Processing & Display

### Upload and Processing Flow
```
1. User uploads CV → Backend extracts text → AI analyzes structure → Data saved to SQLite
2. Processing shows simulated progress (SSE ready but not required for MVP)
3. Original files are preserved for display
4. Users can edit extracted data before generating portfolio
```

### CV Editor Workflow
After CV upload, users are directed to the CV Editor where they can:
- Edit all extracted sections (Hero, Contact, Experience, Education, Skills)
- Add/remove/reorder items in lists
- Save changes to database
- Generate portfolio with edited data

### File Display Implementation
```typescript
// My Resume page now shows actual uploaded PDF
// Files are served via /api/v1/download/{job_id} endpoint
// Authentication handled via X-Session-ID header
```

### Authentication API Endpoints
```python
# Login with email/password
POST /api/v1/auth/login
{
    "email": str,
    "password": str
}

# Register new user
POST /api/v1/auth/register
{
    "email": str,
    "password": str,
    "full_name": str
}

# Logout
POST /api/v1/auth/logout

# Get current user
GET /api/v1/auth/me
Headers: X-Session-ID: <session_id>
```

### API Endpoints for CV Management
```python
# Get all user's CVs (requires auth)
GET /api/v1/my-cvs
Headers: X-Session-ID: <session_id>

# Get specific CV data
GET /api/v1/cv/{job_id}

# Update CV data
PUT /api/v1/cv/{job_id}

# Download original file
GET /api/v1/download/{job_id}
Headers: X-Session-ID: <session_id>
```

### Portfolio Expert API Endpoints (Currently in future_use - not active)
```python
# NOTE: These endpoints are implemented but not currently mounted
# Start new expert session
POST /api/v1/portfolio-expert/start-session
{
    "cv_data": Optional[CVData],
    "user_preferences": Optional[Dict]
}

# Chat with portfolio expert
POST /api/v1/portfolio-expert/chat
{
    "session_id": str,
    "message": str
}

# Generate portfolio with expert guidance
POST /api/v1/portfolio-expert/generate
{
    "session_id": str,
    "template_id": str,
    "customizations": Optional[Dict]
}

# Get expert session history
GET /api/v1/portfolio-expert/session/{session_id}
```

### Portfolio Generation & Management API (PRIMARY - portfolio_generator.py)
```python
# Generate new portfolio
POST /api/v1/portfolio/generate/{job_id}
# Request body: template selection and config

# List user's portfolios
GET /api/v1/portfolio/list

# Get portfolio CV data
GET /api/v1/portfolio/{portfolio_id}/cv-data

# Update portfolio CV data
PUT /api/v1/portfolio/{portfolio_id}/cv-data

# Restart portfolio server
POST /api/v1/portfolio/{portfolio_id}/restart

# Note: Additional endpoints like start/stop/delete may be available
# Check http://localhost:2000/docs for complete API documentation
```

### Payment System & Pricing API (TODO - Backend Implementation)
```python
# Process payment for selected plan
POST /api/v1/payments/process
{
    "planId": str,  # "go-live", "get-hired", or "turn-heads"
    "jobId": Optional[str],
    "paymentMethod": Dict  # Stripe/PayPal payment details
}

# Get user's subscription status
GET /api/v1/payments/subscription

# Process refund (Get Hired plan only)
POST /api/v1/payments/refund
{
    "orderId": str,
    "reason": str
}
```

### Pricing Tiers & Features
| Plan | Price | Features | Limitations |
|------|-------|----------|-------------|
| **Go Live** | $14.90 | • Professional portfolio<br>• Mobile responsive<br>• SEO optimized<br>• Direct deploy<br>• 1 generation | • CV2WEB branding included<br>• Limited customization |
| **Get Hired** | $19.90 | • Premium portfolio<br>• No watermarks<br>• Full customization<br>• 3 generations<br>• Multiple templates<br>• 1 month free hosting | • Then $7.90/month hosting<br>• Refund if unsatisfied |
| **Turn Heads** | $89.90 | • Custom design by experts<br>• Recruiter optimization<br>• Unlimited revisions<br>• Priority support<br>• 1 year free hosting | • Then $7.90/year hosting |

### SSE Infrastructure (Ready for Future Use)
- Full SSE service implemented (`src/services/sse_service.py`)
- SSE routes available (`src/api/routes/sse.py`)
- Frontend SSE connection ready (`lib/api.ts`)
- Currently using simulated progress for better UX

## 🔧 Performance Optimizations

### Watchfiles Configuration
To prevent watchfiles from detecting thousands of changes in sandboxes:

1. **Project-wide .watchmanconfig**:
```json
{
  "ignore_dirs": [
    "sandboxes",
    "data/generated_portfolios",
    "data/uploads",
    "**/node_modules",
    "**/.next",
    "**/dist",
    "**/build",
    "**/.git",
    "venv",
    "__pycache__",
    "**/*.pyc",
    ".pytest_cache",
    "**/.DS_Store"
  ]
}
```

2. **Uvicorn reload exclusions** (main.py):
```python
# Reads from .watchmanconfig for consistency
def get_reload_excludes():
    try:
        import json
        with open('.watchmanconfig', 'r') as f:
            config = json.load(f)
            return config.get('ignore_dirs', [])
    except:
        return ["sandboxes/*", "data/*", "**/node_modules/*"]

reload_excludes = get_reload_excludes()
uvicorn.run(app, reload_excludes=reload_excludes)
```

### npm vs pnpm in Sandboxes
- **Main project**: Still uses pnpm
- **Sandboxes**: Uses npm for better compatibility
- **Reason**: pnpm workspace conflicts in isolated environments

## Recent Updates

### Git Branch Consolidation & CV Extraction Fix (2025-08-05)
- **🌿 Branch Consolidation**: Successfully merged all work from nitzan-development-2 into main branch
- **🏷️ Backup Tags Created**: Created backup tags for safety: backup-main-2025-08-05, backup-nitzan-development-2-2025-08-05
- **🧹 Branch Cleanup**: Deleted local branches (nitzan, Nitzan-development, nitzan-development-2) after merging
- **🐛 Fixed Double CV Extraction**: Fixed issue where CV was extracted twice for anonymous users - now properly checks database cache
- **⚡ Performance Improvement**: Eliminated redundant Claude API calls, significantly reducing processing time and costs
- **📝 Enhanced Database Access**: Anonymous users now properly retrieve existing CV data from SQLite database

### Portfolio Resource Management & Monitoring (2025-08-05)
- **📊 Portfolio Metrics System**: Added comprehensive metrics tracking for portfolio creation, failures, and performance
- **🚫 Resource Limits**: Each portfolio limited to 512MB memory via NODE_OPTIONS to prevent server overload
- **🧹 Automatic Cleanup**: Old portfolios (>24h) automatically cleaned up every 5 minutes
- **⚡ Capacity Management**: Maximum 20 active portfolios with server capacity protection (503 response when full)
- **📈 Metrics Endpoint**: New `/api/v1/portfolio/portfolios/metrics` endpoint for monitoring portfolio statistics
- **⏱️ Performance Tracking**: Tracks average portfolio startup time and success/failure rates
- **🔄 Background Tasks**: Async cleanup task runs continuously to manage portfolio lifecycle
- **🛡️ Error Recovery**: Improved failure tracking with metrics recording on all error paths

### Critical CSS Fix & PostCSS Validation (2025-08-02)
- **🐛 Fixed CSS Not Loading Issue**: Discovered missing `autoprefixer` in PostCSS configs causing broken HTML display
- **🔧 Created Validation Script**: Added `src/utils/validate_postcss_config.py` to detect and fix PostCSS issues
- **✅ Fixed 38 PostCSS Configs**: Automatically fixed all template and generated portfolio configs
- **📝 Enhanced Documentation**: Added CSS troubleshooting section and debug commands
- **🛡️ Prevention Measures**: All new templates MUST include both `tailwindcss` AND `autoprefixer` in PostCSS config

### API Route Reorganization (2025-01-22)
- **🏗️ Restructured API Routes**: Organized routes into active, archived, and future_use directories
- **📁 Archived Routes**: Moved unused `cv_processing.py` and deprecated `portfolio.py` to archived folder
- **🔮 Future Use Routes**: Moved `portfolio_expert.py`, `portfolio_generator_v2.py`, and `demo_preview.py` to future_use
- **✅ Clarified Primary Scripts**: Documented `portfolio_generator.py` as the main portfolio generation script
- **📝 Updated Documentation**: Added API_ROUTES_ANALYSIS.md with comprehensive route analysis
- **🔧 Fixed API Paths**: Corrected portfolio endpoints from `/api/v1/portfolios/*` to `/api/v1/portfolio/*`

### Critical Fixes & Enhancements (2025-01-18)
- **🐛 Fixed CV Extraction Error**: Resolved issue with `johnathan_Resume.pdf` causing extraction failures due to None education items in date validator
- **🔄 CV Editor Auto-Refresh**: Added event listener for `cvUploadComplete` to automatically refresh CV editor data when new CV is uploaded
- **🔃 Manual Refresh Button**: Added refresh button in CV editor header for manual data refresh
- **✅ Date Validator Improvements**: Added comprehensive None checks and defensive programming to prevent `'NoneType' object has no attribute 'get'` errors
- **🎯 Section Content State Fix**: Fixed `setSectionContent is not defined` error in My Website page by adding missing state declaration
- **📝 Enhanced Error Logging**: Added full traceback logging for CV extraction errors to aid debugging

### Payment System & Pricing Tiers Implementation (2025-01-17)
- **💳 Three-Tier Pricing System**: Implemented complete payment component with Go Live ($14.90), Get Hired ($19.90), and Turn Heads ($89.90) plans
- **🎨 Modern Pricing UI**: Built with Tabler icons and gradient designs, featuring Most Popular badges and clear feature differentiation
- **🚀 "Take Control" Integration**: Added prominent purple-to-pink gradient button in My Website page that opens pricing modal
- **📱 Responsive Pricing Modal**: Full-screen modal with dark mode support and smooth animations
- **🔄 Plan-Specific Routing**: Different user flows for each tier - branded template for Go Live, template selection for Get Hired, premium onboarding for Turn Heads
- **💰 Payment Processing Ready**: Pre-configured for Stripe/PayPal integration with simulated payment flow
- **🏷️ Resume2Web Branded Template**: Created special branded template variant for affordable Go Live tier
- **📋 Future Task Tracking**: Added 6 payment-related tasks to TaskMaster for Vercel hosting, domain connection, refund system, and monthly billing

### Major Release: Portfolio Expert & Advanced Generation System (2025-01-16)
- **🤖 Portfolio Expert System**: Implemented AI-powered portfolio guidance using Claude 4 for personalized recommendations, CV analysis, and content strategy
- **🏭 Advanced Portfolio Generation**: Complete portfolio generation pipeline with isolated sandbox environments, real-time health monitoring, and server management
- **🔄 CV Data Adapter System**: Sophisticated data transformation layer for converting CV extraction format to template-specific data structures
- **📋 Portfolio Management**: Multiple portfolio instances per user with start/stop/restart operations and unique port allocation (4000+ range)
- **🛡️ Enhanced File Preservation**: Permanent file storage with session-based authentication for secure file serving
- **📊 Template Progress Display**: Real-time progress indicators for CV processing, template selection, generation, and preview stages
- **🎯 Expert Session Management**: Persistent chat sessions with CV analysis, industry insights, and personalized guidance
- **⚙️ Sandbox Infrastructure**: Isolated Next.js environments with dependency management and health monitoring
- **🔗 API Expansion**: New endpoints for portfolio expert, generation management, and enhanced CV operations
- **📖 Documentation Enhancement**: Added CV Editor implementation guide and comprehensive API documentation

### Portfolio Generation Stability Improvements (2025-08-04)
- **🔧 Fixed portfolio_dir Undefined Bug**: Changed from undefined `portfolio_dir` to correct `sandbox_path` in server manager
- **📦 Switched to npm for Sandboxes**: Better compatibility than pnpm in isolated environments, fixes "Next.js binary not found" errors
- **🧹 Enhanced Lockfile Cleanup**: Remove ALL lockfiles (pnpm-lock.yaml, package-lock.json, yarn.lock) before installation
- **🐛 Fixed Path Duplication Bug**: Next.js version check now uses binary directly instead of through node
- **🛡️ Added Watchfiles Protection**: Created .watchmanconfig to exclude heavy directories from file watching
- **⚡ Uvicorn Performance**: Dynamic reload_excludes from .watchmanconfig prevents thousands of change detections
- **📝 Improved Logging**: Next.js version checks now use debug level to reduce noise

### Critical CSP Iframe Fix & Full Pipeline Integration (2025-08-04)
- **🔗 Connected Full Pipeline**: Integrated CV upload → extraction → portfolio generation with MacBook preview at 60% progress
- **🐛 Fixed Next.js Module Error**: Resolved "Cannot find module '../server/require-hook'" by implementing clean installation with multiple startup methods
- **🛡️ Fixed CSP Iframe Blocking**: Discovered middleware.ts was overriding next.config.mjs headers with restrictive `frame-ancestors 'none'`
- **✅ Three-Layer CSP Fix**: Updated middleware.ts, next.config.mjs, and csp-config.ts to allow `frame-ancestors *` for iframe embedding
- **🎯 Smart Cross-Origin Handling**: Added intelligent fallback UI for production→localhost scenarios with "Open in New Tab" option
- **📊 Progress Animation Fix**: Fixed progress bar stuck at 55% by adding fallback logic for different API response formats
- **🚀 Complete Flow Working**: CV upload → extraction → generation → MacBook display with proper error handling

### Previous Updates
- **2025-01-15**: Fixed critical cross-section contamination with advanced classifier
- **2025-01-15**: Implemented Claude 4 Opus deterministic extraction (temperature 0.0)
- **2025-01-15**: Added comprehensive deduplication for skills/certifications/languages
- **2025-01-15**: Enhanced section classification with priority matrix system
- **2025-01-15**: Implemented CV Editor with full CRUD operations for extracted data
- **2025-01-15**: Added original file preservation and display in My Resume page
- **2025-01-15**: Created download endpoint for serving uploaded files
- **2025-01-15**: Removed resume builder modal - direct flow to CV editor
- **2025-01-15**: Fixed SSE connection errors with graceful fallback
- **2025-01-14**: Added isolated environment requirements and live logging standards
- **2025-01-14**: Enhanced Git workflow with mandatory branch-based development
- **2025-01-14**: Added Claude SDK best practices from video learnings
- **2025-01-14**: Added Magic MCP documentation for UI component generation in Cursor
- **2025-01-14**: Complete CLAUDE.md restructure with improved organization
- **2025-01-13**: Removed all .DS_Store files and .next directories
- **2025-01-13**: Deleted unnecessary GitHub branches
- **2025-01-13**: Removed package-lock.json files (use pnpm)
- **2025-01-13**: Moved test files from scripts to /tests/

---
*Last updated: 2025-08-05 | Version: 5.0*