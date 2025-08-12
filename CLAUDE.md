# RESUME2WEBSITE V4 - Claude Code Instructions

## Project Overview
RESUME2WEBSITE is an AI-powered platform that transforms CVs into stunning portfolio websites using FastAPI backend + Next.js frontend with Claude 4 Opus for deterministic data extraction.

### What RESUME2WEBSITE Does
- **Extracts** CV data using Claude 4 Opus (temperature 0.0) into 18 structured sections
- **Generates** portfolio websites in isolated sandbox environments 
- **Manages** multiple portfolio instances with real-time health monitoring
- **Provides** CV editing capabilities with CRUD operations
- **Authenticates** users with email/password + Google OAuth + LinkedIn OAuth
- **Preserves** original files with hash-based deduplication

## Tech Stack Essentials
- **Backend**: FastAPI + Python 3.11+ (port 2000)
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS v4 (port 3000)
- **AI**: Claude 4 Opus ONLY (temperature 0.0 for deterministic extraction)
- **Database**: SQLite with session-based authentication
- **Package Manager**: pnpm (main project), npm (sandboxes only)
- **UI Libraries**: Aceternity UI, Magic UI (100+ animated components)
- **Deployment**: Vercel + isolated sandbox environments

## Daily Development Commands
```bash
# Frontend Development
pnpm run dev                    # Start Next.js dev server (localhost:3000)
pnpm run typecheck             # ⚠️ MUST run before commits
pnpm run build                 # Build for production
pnpm run start                 # Start production build

# Backend Development  
source venv/bin/activate       # Activate Python environment
python main.py                 # Start FastAPI with optimizations (localhost:2000)
uvicorn main:app --reload --port 2000  # Alternative start method

# Testing & Quality
pytest                         # Run backend tests
python3 tests/unit/run_unit_tests.py  # Run unit tests for cv.py
python3 tests/unit/test_cv_helpers_isolated.py  # Run isolated unit tests (no DB)
pnpm run typecheck            # TypeScript validation

# Utilities
.claude/commands/cleanup.sh    # Clean build artifacts and cache
.claude/commands/prime.sh      # Initialize development environment
```

## Git Workflow Rules (CRITICAL)
1. **NEVER** work on `main` branch
2. **ALWAYS** create feature branches: `git checkout -b feature/description`
3. **ALWAYS** ask explicit approval before:
   - `git add .`
   - `git commit -m "message"`
   - `git push origin branch-name`

## Code Style Requirements
### TypeScript/React
- Use arrow functions: `export const Component: React.FC = () => {}`
- Absolute imports: `import { foo } from 'src/components/foo'`
- ES modules only: `import { x } from 'y'` (NOT require)

### Python/FastAPI  
- Type hints required: `async def func(param: str) -> Optional[Dict]:`
- Absolute imports: `from src.api.routes import cv`
- Follow PEP 8 conventions

### PostCSS Configuration (CRITICAL)
```javascript
// postcss.config.mjs - MUST include BOTH plugins
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},  // ⚠️ REQUIRED - CSS won't load without this!
  },
};
```

## CV Data Structure (18 Sections)
CV extraction creates structured data with these sections:
1. **Hero** - fullName, professionalTitle, summaryTagline, profilePhotoUrl
2. **Contact** - email, phone, location, professionalLinks, availability
3. **Summary** - summaryText, yearsOfExperience, keySpecializations
4. **Experience** - Array of jobs with title, company, dates, responsibilities, technologies
5. **Education** - Array of degrees with institution, field, dates, gpa, honors
6. **Skills** - skillCategories (grouped) + ungroupedSkills
7. **Projects** - title, description, role, technologies, urls
8. **Achievements** - value, label, context, timeframe
9. **Certifications** - title, organization, dates, credentials
10. **Languages** - language, proficiency, certification
11. **Volunteer** - role, organization, dates, description
12. **Publications** - title, type, venue, date, url
13. **Speaking** - events, topics, venues, presentations
14. **Courses** - title, institution, completion, certificates
15. **Memberships** - organization, role, type, dates
16. **Hobbies** - Array of interests
17. **Patents** - title, number, status, dates
18. **Testimonials** - name, role, company, text, date

## Key API Endpoints
```python
# CV Management
POST /api/v1/upload-cv                    # Upload CV file
GET /api/v1/cv/{job_id}                   # Get CV data
PUT /api/v1/cv/{job_id}                   # Update CV data
GET /api/v1/my-cvs                        # List user's CVs
GET /api/v1/download/{job_id}             # Download original file

# Portfolio Generation (PRIMARY)
POST /api/v1/portfolio/generate/{job_id}  # Generate portfolio
POST /api/v1/portfolio/generate-anonymous/{job_id}  # Anonymous generation
GET /api/v1/portfolio/list                # List user portfolios
GET /api/v1/portfolio/{id}/status         # Check portfolio status
POST /api/v1/portfolio/{id}/restart       # Restart portfolio server

# Authentication
POST /api/v1/auth/register                # Register user
POST /api/v1/auth/login                   # Login user
POST /api/v1/auth/logout                  # Logout
GET /api/v1/auth/me                       # Get current user
POST /api/v1/auth/google/callback         # Google OAuth callback
POST /api/v1/auth/linkedin/callback       # LinkedIn OAuth callback
GET /api/v1/auth/google/status            # Check Google OAuth availability
```

## Architecture Essentials
- **CV Extraction**: 18 sections, cached in SQLite, deduplication enabled
- **Portfolio Generation**: Isolated Next.js sandboxes (ports 4000-5000)
- **Templates**: 2 active (v0_template_v1.5, v0_template_v2.1)
- **Authentication**: Email/password + Google OAuth + LinkedIn OAuth, session-based
- **File Storage**: Preserved in data/uploads/ with hash-based deduplication
- **Resource Management**: Auto-cleanup portfolios >24h, max 20 active portfolios
- **Monitoring**: Portfolio metrics tracking, health checks, performance stats

## Development Workflow Patterns
### CV Processing Flow
```
1. User uploads CV → Text extraction → Claude 4 Opus analysis → SQLite storage
2. CV Editor → User edits extracted data → CRUD operations
3. Portfolio generation → Isolated sandbox → Template injection → Live preview
4. Resource management → Health monitoring → Auto-cleanup → Metrics tracking
```

### Template Development
```typescript
// Template structure: src/templates/template-name/
├── app/
│   ├── page.tsx              # Main portfolio page
│   ├── layout.tsx            # Template layout
│   └── globals.css           # Template styles
├── lib/
│   ├── cv-data-adapter.tsx   # Data transformation (CRITICAL)
│   └── data.tsx              # Type definitions
├── components/               # Template components
└── postcss.config.mjs        # MUST include autoprefixer!

// Register in portfolio_generator.py:
AVAILABLE_TEMPLATES = {
    "v0_template_v1.5": "src/templates/v0_template_v1.5",
    "v0_template_v2.1": "src/templates/v0_template_v2.1"
}
```

## Environment Setup
```bash
# Prerequisites
node >= 18.0.0
python >= 3.11
pnpm >= 8.0.0

# Setup
git clone <repo> && cd Resume2Website-V4
pnpm install                           # Install frontend deps
python3 -m venv venv                   # Create Python venv
source venv/bin/activate               # Activate venv
pip install -r requirements.txt       # Install backend deps
python3 src/utils/setup_keychain.py   # Setup API keys securely
```

## Key Patterns
- **Sandbox Isolation**: All portfolio generation in isolated environments using npm
- **Data Adapters**: Transform CV data to template-specific format via cv-data-adapter.tsx
- **Live Logging**: Use structured prefixes (🚀 ⏳ ✅ ⚠️ ❌) for transparency
- **Resource Management**: Auto-cleanup portfolios >24h, max 20 active, 512MB memory limit
- **Caching Strategy**: File hash deduplication, SQLite CV data cache, API response optimization

## Critical Reminders
1. **Claude 4 Opus ONLY** - No other AI models (temperature 0.0)
2. **Sandbox npm usage** - Main project uses pnpm, sandboxes use npm
3. **PostCSS autoprefixer** - Required for CSS loading
4. **Branch-based development** - Never commit to main
5. **TypeScript checks** - Must pass before commits
6. **API keys security** - Use keychain, never commit

## Troubleshooting & Debugging
### Common Issues & Quick Fixes
- **CSS not loading**: Check postcss.config.mjs has autoprefixer, clear .next cache
- **Next.js binary not found**: Sandboxes use npm, not pnpm - check PATH
- **Port conflicts**: Backend=2000, Frontend=3000, Portfolios=4000-5000 range
- **CV extraction hangs**: Check Claude API quota/credentials in keychain
- **Portfolio stuck at 55%**: Check API response format, server startup logs
- **"Cannot find module"**: Run `pnpm install` in project root
- **TypeScript errors**: Run `pnpm run typecheck` to see all errors
- **Python venv issues**: Check `which python` shows venv path

### Debug Commands
```bash
# Health checks
curl http://localhost:2000/health               # Backend health
curl http://localhost:3000/api/health           # Frontend health

# Portfolio management
curl http://localhost:2000/api/v1/portfolio/list              # List portfolios
curl http://localhost:2000/api/v1/portfolio/portfolios/metrics # Portfolio metrics

# Process monitoring
ps aux | grep node                              # Check running portfolios
lsof -i :4000-4010                            # Check portfolio ports
lsof -ti:2000 | xargs kill                    # Kill backend if stuck

# Logs and debugging
tail -f venv/logs/fastapi.log                  # Backend logs
pnpm run dev --verbose                         # Frontend verbose logs
```

### Performance Monitoring
- **Portfolio Metrics**: Active count, creation/failure rates, cleanup stats
- **Resource Limits**: Max 20 active portfolios, 512MB per portfolio
- **Auto-cleanup**: Runs every 5 minutes for portfolios >24h old
- **Health Checks**: Server status monitoring, startup time tracking

## Vercel Deployment
### Deploy Portfolios to Production
```bash
# Deploy portfolio to Vercel (handles >10MB projects)
python3 deploy_using_cli.py

# Fix dependencies before deployment
# Move build deps from devDependencies to dependencies:
# - tailwindcss, postcss, autoprefixer
# - typescript, @types/*
```

### Key Points
- **10MB API Limit**: REST API limited, use CLI for larger projects
- **Team Deployment**: Auto-detects team ID from account
- **Build Dependencies**: Must be in `dependencies` for Vercel builds
- **Keychain Required**: Run `python3 src/utils/setup_keychain.py` first

## Directory Structure
```
Resume2Website-V4/
├── src/                        # Backend (FastAPI)
│   ├── api/                   # API routes and endpoints
│   │   ├── routes/           # Individual route modules
│   │   │   ├── portfolio_generator.py  # Main portfolio creation
│   │   │   ├── cv.py         # CV CRUD operations
│   │   │   ├── auth.py       # Authentication dependencies
│   │   │   └── future_use/   # Ready but not mounted
│   │   └── db.py            # Database operations
│   ├── core/               # Business logic
│   │   ├── cv_extraction/ # AI-powered CV parsing
│   │   └── schemas/      # Data models
│   ├── services/          # Business services
│   ├── templates/         # Portfolio templates
│   │   ├── v0_template_v1.5/  # Active template
│   │   └── v0_template_v2.1/  # Active template
│   └── utils/            # Utility functions
├── user_web_example/          # Main frontend (Next.js)
│   ├── app/              # App router pages
│   ├── components/       # React components
│   └── lib/             # Frontend utilities
├── data/                     # File storage
│   ├── uploads/         # User uploaded files (preserved)
│   ├── cv_examples/     # Test CV files
│   └── generated_portfolios/ # Portfolio outputs
├── sandboxes/               # Isolated portfolio environments
├── tests/                   # Test suites
│   └── unit/               # Unit tests for cv.py helpers
├── .claude/                 # Claude-specific utilities
│   └── commands/           # Development scripts
├── config.py               # Backend configuration
├── main.py                 # FastAPI application entry
├── requirements.txt        # Python dependencies
├── package.json           # Frontend dependencies
└── extended_claude.md     # Comprehensive documentation
```

## Important Files to Know
- **config.py** - Backend configuration, environment variables, AI model settings
- **main.py** - FastAPI application entry point with routing
- **src/api/routes/portfolio_generator.py** - PRIMARY portfolio generation script
- **src/api/routes/cv.py** - CV upload, extraction, CRUD operations
- **src/api/routes/user_auth.py** - OAuth authentication endpoints (Google, LinkedIn)
- **src/api/db.py** - SQLite database operations, user management, session handling
- **src/core/cv_extraction/data_extractor.py** - Claude 4 Opus integration
- **user_web_example/app/page.tsx** - Main frontend entry point
- **package.json** - Frontend dependencies, scripts, workspace config
- **requirements.txt** - Python backend dependencies
- **.claude/commands/** - Development utility scripts

---
*For comprehensive documentation, architecture details, and troubleshooting guides, see: `extended_claude.md`*

*Language: Always respond in English, even if user writes in Hebrew*