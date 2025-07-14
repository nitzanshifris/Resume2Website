# CV2WEB V4 - Claude Code Development Guide

## Project Overview

CV2WEB is an AI-powered CV to portfolio website converter that transforms resumes into stunning portfolio websites using FastAPI (Python) backend and Next.js (TypeScript) frontend in a pnpm monorepo.

### What CV2WEB Does
- **Extracts** CV data using Google Gemini 2.5 Flash AI
- **Generates** beautiful portfolio websites with 100+ animated components
- **Deploys** to Vercel with one click
- **Supports** multiple file formats (PDF, DOCX, images, etc.)

### Tech Stack at a Glance
- **Backend**: FastAPI + Python 3.11+ with TypeORM
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS v4
- **AI Services**: Gemini, Claude, OpenAI, AWS Textract
- **UI Libraries**: Aceternity UI, Magic UI (100+ components)
- **Infrastructure**: Vercel, Railway, PostgreSQL

## 🚀 Quick Start

### Prerequisites
```bash
# Required tools
node >= 18.0.0          # For frontend
python >= 3.11          # For backend  
pnpm >= 8.0.0          # Package manager (NOT npm/yarn)
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
python main.py                               # Alternative start method
```

### Git Workflow
```bash
# 1. Start new feature
git checkout -b feature/description

# 2. Make changes and verify
pnpm run typecheck      # No TypeScript errors
pytest                  # Backend tests pass

# 3. Commit with conventional format
git add .
git commit -m "feat: add new portfolio template"
# Commit types: feat|fix|docs|style|refactor|test|chore

# 4. Push and create PR
git push origin feature/description
gh pr create --title "feat: description" --body "Closes #123"
```

## 🏗️ Architecture

### Project Structure
```
CV2WEB-V4/
├── src/                    # Backend (FastAPI)
│   ├── api/               # API routes and endpoints
│   ├── core/              # Business logic
│   │   ├── cv_extractors/ # AI-powered CV parsing
│   │   ├── generators/    # Portfolio generation
│   │   └── schemas/       # Data models
│   └── templates/         # Portfolio templates
├── packages/              
│   └── new-renderer/      # Frontend (Next.js)
├── components/            # Shared UI components
│   ├── aceternity/        # Premium animations
│   └── magicui/          # Magic UI library
├── tests/                 # Test suites
└── .taskmaster/          # AI task management
```

### Data Flow
```
User Upload → File Validation → AI Extraction → Portfolio Generation → Preview → Deploy
     ↓              ↓                ↓                  ↓                ↓        ↓
   (FastAPI)    (Security)    (Gemini 2.5)      (Templates)        (Next.js) (Vercel)
```

## ⚙️ Configuration

### Environment Setup
```bash
# Backend configuration (config.py)
BACKEND_PORT = 2000             # ⚠️ Not 8000!
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001"]

# AI Models
GEMINI_MODEL = "gemini-2.5-flash"
CLAUDE_MODEL = "claude-3-5-sonnet-20241022"
```

### Credential Management
```bash
# ⚠️ NEVER commit API keys! Use keychain manager:
python src/utils/setup_keychain.py

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
- **CV Extraction**: `create tasks for improving CV extraction with Gemini 2.5 Flash`
- **UI Components**: `break down portfolio templates focusing on Aceternity components`
- **API Features**: `create tasks for new FastAPI endpoint with authentication`
- **Research**: `research latest Next.js 15 patterns and update our frontend tasks`

## 🛠️ Common Development Tasks

### Adding a New Portfolio Template
```typescript
// 1. Create template component
// src/templates/portfolio-templates/modern-minimal.tsx
export const ModernMinimalTemplate: React.FC<PortfolioProps> = ({ data }) => {
  // Template implementation
}

// 2. Register in generator
// src/core/generators/portfolio_generator.py
TEMPLATES = {
    "modern-minimal": ModernMinimalTemplate,
    // ... other templates
}

// 3. Add preview
// packages/new-renderer/app/templates/[id]/page.tsx
```

### Adding a New API Endpoint
```python
# 1. Create route file
# src/api/routes/analytics.py
from fastapi import APIRouter, Depends
router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/usage")
async def get_usage_stats():
    return {"total_cvs": 1234}

# 2. Register in main.py
app.include_router(analytics.router)

# 3. Test the endpoint
# http://localhost:2000/docs
```

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `pnpm install` in project root |
| TypeScript errors | Run `pnpm run typecheck` to see all errors |
| "Port 2000 already in use" | Kill existing process: `lsof -ti:2000 \| xargs kill` |
| Import errors | Ensure using `src/` prefix for absolute imports |
| CV extraction fails | Check Gemini API quota and credentials |
| Large file warning | Use Git LFS for files >50MB |

### Debug Commands
```bash
# Check service status
curl http://localhost:2000/health    # Backend health
curl http://localhost:3000/api/health # Frontend health

# View logs
docker logs cv2web-backend -f        # Backend logs
pnpm run dev --verbose               # Frontend verbose logs

# Database issues
python src/utils/init_db.py          # Reinitialize database

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
- **Google Gemini 2.5 Flash** - CV extraction (primary, model in config.py)
- **Claude 3.5 Sonnet** - Content enhancement
- **Google Cloud Vision** - OCR for images
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
# Portfolio generation
python src/utils/generate_complete_portfolio.py
python src/utils/generate_test_portfolio.py

# Component validation
python src/utils/validate_registry.py   # Validate component registry

# Development utilities
python src/utils/setup_keychain.py      # Setup credentials
```

## ⚠️ Critical Reminders

1. **ALWAYS** run `pnpm run typecheck` before committing
2. **NEVER** use npm or yarn - only pnpm
3. **NEVER** commit API keys - use keychain manager
4. **ALWAYS** check existing components before creating new ones
5. Backend runs on port **2000**, not 8000
6. Maximum file upload size is **10MB**
7. Use **Read/Grep** tools to research before coding
8. **NEVER** use code from `/legacy/` directory
9. **Note**: config.py and main.py at root are still actively used

## Auto-use Context7
When asked about any of these, **ALWAYS** use Context7 MCP tools:
- FastAPI implementation patterns
- React/Next.js best practices
- Google Gemini API usage
- Anthropic Claude API integration
- AWS Textract/Google Vision OCR
- Tailwind CSS v4 patterns
- TypeScript patterns
- Any library documentation
- Code examples from external libraries

## Recent Updates
- **2025-07-14**: Complete CLAUDE.md restructure with improved organization
- **2025-07-13**: Removed all .DS_Store files and .next directories
- **2025-07-13**: Deleted unnecessary GitHub branches
- **2025-07-13**: Removed package-lock.json files (use pnpm)
- **2025-07-13**: Moved test files from scripts to /tests/

---
*Last updated: 2025-07-14 | Version: 4.1*