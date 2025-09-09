# Resume2Website V4 - Project Context V2

## 🎯 Project Overview
Resume2Website V4 is an AI-powered platform that transforms CVs into stunning portfolio websites using Claude 4 Opus for extraction and modern web technologies for generation.

## 🏗️ Current Architecture

### Tech Stack
- **Backend**: FastAPI (Python 3.11+) on port 2000
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS v4 on port 3019
- **Database**: SQLite with session-based authentication
- **AI**: Claude 4 Opus ONLY (temperature 0.0)
- **Deployment**: Vercel (optional after preview)
- **Package Manager**: pnpm (main), npm (sandboxes)

### Directory Structure
```
Resume2Website-V4/
├── src/                          # Backend code
│   ├── api/                     # API layer
│   │   ├── routes/             # All endpoints
│   │   │   ├── cv.py          # CV operations (NO auth)
│   │   │   ├── portfolio_generator.py # Portfolio creation
│   │   │   ├── user_auth.py  # OAuth (CANONICAL auth)
│   │   │   ├── payments.py   # Stripe integration
│   │   │   ├── metrics.py    # Real-time metrics (8 endpoints)
│   │   │   ├── workflows.py  # Orchestration (9 endpoints)
│   │   │   ├── sse.py       # Server-sent events (9 endpoints)
│   │   │   └── cv_enhanced.py # Enhanced processing (3 endpoints)
│   │   └── db.py             # Database operations
│   ├── core/                  # Business logic
│   │   ├── cv_extraction/    # AI extraction system
│   │   │   ├── data_extractor.py # Factory pattern
│   │   │   ├── llm_service.py    # Claude integration
│   │   │   └── circuit_breaker.py # Resilience
│   │   └── schemas/          # Data models
│   │       └── unified_nullable.py # 15-section CV schema
│   ├── services/              # Business services
│   ├── templates/             # Portfolio templates
│   │   ├── official_template_v1/ # ONLY active template
│   │   └── future_templates/     # Archived templates
│   └── utils/                 # Utilities
│       └── cv_resume_gate.py # File validation
├── user_web_example/            # Frontend (Next.js)
│   ├── app/                   # App router
│   ├── components/            # React components
│   └── lib/                   # Utilities
├── data/                        # Storage
│   ├── uploads/              # Preserved user files
│   ├── resume2website.db     # SQLite database
│   └── generated_portfolios/ # Portfolio outputs
├── sandboxes/                   # Isolated environments
├── scripts/                     # Utility scripts
│   ├── utilities/            # Database tools
│   └── testing/              # Test scripts
├── .claude/                     # Claude Code config
│   ├── agents/               # Custom agents
│   │   ├── code-reviewer.md # Active agent
│   │   └── data/            # Agent outputs
│   ├── commands/             # Organized scripts
│   └── memory/              # This context
└── docs/                        # Documentation
```

## 📊 System Components

### 1. CV Processing Pipeline
```
Upload → Resume Gate Validation → Text Extraction → Claude 4 Opus → 15 Sections → Cache
```
- **File Support**: PDF, DOCX, TXT, MD, Images (JPG, PNG)
- **Validation**: Stricter for images (500+ chars, 3+ signals)
- **Extraction**: Temperature 0.0 for determinism
- **Caching**: >0.75 confidence scores cached

### 2. Portfolio Generation (Two-Stage)
```
Stage 1: Preview (Local) → Instant preview on ports 4000-5000
Stage 2: Deploy (Optional) → Payment → Vercel deployment
```
- **Template**: official_template_v1 (ONLY)
- **Limits**: 20 max portfolios, 512MB each, 24h cleanup
- **Domains**: Auto-generated (john-doe.portfolios.resume2website.com)

### 3. Authentication System
- **Providers**: Email/password, Google OAuth, LinkedIn OAuth
- **Storage**: Session-based with SQLite
- **Routes**: All in `user_auth.py` (cv.py has NO auth)

### 4. Payment Integration
- **Provider**: Stripe Embedded Checkout
- **Flow**: Preview free → Payment for deployment
- **Endpoints**: `/api/v1/payments/create-checkout-session`

## 🔌 API Endpoints (Complete List)

### Core CV Operations
- `POST /api/v1/upload` - Upload CV (authenticated)
- `POST /api/v1/upload-anonymous` - Upload (validation only)
- `POST /api/v1/extract/{job_id}` - Extract CV data
- `GET /api/v1/cv/{job_id}` - Get CV data
- `PUT /api/v1/cv/{job_id}` - Update CV data
- `GET /api/v1/my-cvs` - List user's CVs
- `DELETE /api/v1/cv/{job_id}` - Delete CV

### Portfolio Management
- `POST /api/v1/portfolio/generate/{job_id}` - Generate preview
- `POST /api/v1/portfolio/deploy/{job_id}` - Deploy to Vercel
- `GET /api/v1/portfolio/list` - List portfolios
- `GET /api/v1/portfolio/{id}/status` - Check status
- `POST /api/v1/portfolio/{id}/restart` - Restart server

### Authentication (user_auth.py ONLY)
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Current user
- `POST /api/v1/auth/google/callback` - Google OAuth
- `POST /api/v1/auth/linkedin/callback` - LinkedIn OAuth

### Advanced Systems (29 Undocumented)
- **SSE**: 9 endpoints for real-time updates
- **Workflows**: 9 endpoints for orchestration
- **Metrics**: 8 endpoints for monitoring
- **Enhanced CV**: 3 endpoints for advanced processing

## 🔑 Critical Configuration

### Environment Variables
```bash
CV_CLAUDE_API_KEY=xxx          # Required
DATABASE_PATH=data/resume2website.db
SESSION_EXPIRY_DAYS=7
PORTFOLIO_START_PORT=4000
PORTFOLIO_END_PORT=5000
PORTFOLIO_MAX_INSTANCES=20
```

### Key Files
- `config.py` - Backend configuration
- `main.py` - FastAPI entry point
- `CLAUDE.md` - Primary documentation
- `extended_claude.md` - Detailed guide
- `postcss.config.mjs` - MUST include autoprefixer!

## 🎨 CV Data Structure (15 Sections)
1. **Hero** - Name, title, tagline, photo
2. **Contact** - Email, phone, location, links
3. **Summary** - Professional summary
4. **Experience** - Work history
5. **Education** - Degrees, institutions
6. **Skills** - Technical and soft skills
7. **Projects** - Portfolio items
8. **Achievements** - Awards, accomplishments
9. **Certifications** - Professional certs
10. **Languages** - Spoken languages
11. **Volunteer** - Community work
12. **Publications** - Articles, papers
13. **Speaking** - Presentations
14. **Courses** - Training completed
15. **Hobbies** - Personal interests

## ⚙️ Business Rules & Constraints
- **AI Model**: Claude 4 Opus ONLY (no alternatives)
- **Temperature**: 0.0 for determinism
- **Circuit Breaker**: 5 failures → exponential backoff
- **Resource Limits**: 20 portfolios, 512MB each
- **Cleanup**: 24-hour automatic
- **Confidence**: >0.75 for caching
- **Git**: Feature branches only (current: development-flow-rebuild2)
- **Package Manager**: pnpm (main), npm (sandboxes)

## 🚀 Development Workflow

### Daily Commands
```bash
# Backend
source venv/bin/activate
python3 -m uvicorn main:app --host 127.0.0.1 --port 2000

# Frontend
pnpm run dev
pnpm run typecheck  # MUST run before commits
pnpm run build

# Testing
pytest
python3 tests/unit/run_unit_tests.py

# Utilities
.claude/commands/maintenance/cleanup.sh
```

### Anonymous vs Authenticated Flow
- **Anonymous**: Upload → Validate → Show animation → Signup → Extract
- **Authenticated**: Upload → Validate → Extract immediately

## 🤖 Claude Code Integration

### Custom Agents
- **code-reviewer**: Comprehensive review with 29 endpoint knowledge
- **Output Location**: `.claude/agents/data/[agent-name]/`

### Commands Organization
```
.claude/commands/
├── maintenance/  # System cleanup
├── development/ # Dev utilities  
├── portfolio/   # Portfolio tools
├── taskmaster/  # Task management
└── deprecated/  # Old scripts
```

## 📈 Current Status
- **Branch**: development-flow-rebuild2
- **Template**: official_template_v1 (ONLY)
- **CV Sections**: 15 (not 18)
- **Auth Source**: user_auth.py (not cv.py)
- **Last Updated**: 2025-01-08

---

*Version: 2.0*
*Purpose: Accurate project context for Claude Code sessions*
*Critical: This supersedes all previous context files*