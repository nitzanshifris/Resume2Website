# RESUME2WEBSITE V4 - Claude Code Instructions

## Project Overview
RESUME2WEBSITE is an AI-powered platform that transforms CVs into stunning portfolio websites using FastAPI backend + Next.js frontend with Claude 4 Opus for deterministic data extraction.

### What RESUME2WEBSITE Does
- **Extracts** CV data using Claude 4 Opus (temperature 0.0) into 18 structured sections
- **Generates** portfolio websites in isolated sandbox environments 
- **Preview Mode**: Instant local portfolio preview (ports 4000-5000) before deployment
- **Manages** multiple portfolio instances with real-time health monitoring
- **Provides** CV editing capabilities with CRUD operations
- **Authenticates** users with email/password + Google OAuth + LinkedIn OAuth
- **Preserves** original files with hash-based deduplication
- **Payments**: Stripe Embedded Checkout for premium features
- **Portfolio Persistence**: Automatically restores user's last portfolio on login

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
python3 -m uvicorn main:app --host 127.0.0.1 --port 2000  # Start FastAPI (localhost:2000)
python main.py                 # Alternative with optimizations

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
3. **Current branch**: main (merged from nitzan-4)
4. **ALWAYS** ask explicit approval before:
   - `git add .`
   - `git commit -m "message"`
   - `git push origin branch-name`
   - `git merge` - **NEVER merge without explicit permission**
   - `git rebase` - **NEVER rebase without explicit permission**

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
POST /api/v1/upload                       # Upload CV (authenticated users - validates + extracts)
POST /api/v1/upload-anonymous             # Upload CV (anonymous - validates only, NO extraction)
POST /api/v1/extract/{job_id}             # Extract CV data (called after signup for anonymous)
GET /api/v1/cv/{job_id}                   # Get CV data
PUT /api/v1/cv/{job_id}                   # Update CV data
GET /api/v1/my-cvs                        # List user's CVs
GET /api/v1/download/{job_id}             # Download original file

# Portfolio Generation (PRIMARY)
POST /api/v1/portfolio/generate/{job_id}  # Generate portfolio preview (local)
POST /api/v1/portfolio/deploy/{job_id}    # Deploy portfolio to Vercel (after preview)
POST /api/v1/portfolio/generate-anonymous/{job_id}  # Anonymous generation
GET /api/v1/portfolio/list                # List user portfolios
GET /api/v1/portfolio/{id}/status         # Check portfolio status
POST /api/v1/portfolio/{id}/restart       # Restart portfolio server

# Payment Processing
POST /api/v1/payments/create-checkout-session  # Create Stripe checkout
GET /api/v1/payments/session-status/{id}       # Check payment status

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
- **Resume Gate Validation**: Stricter for images (requires 500+ chars, 3+ signal types, both contact AND experience)
  - Smart rejection reasons with helpful suggestions
  - Image-specific validation rules to prevent screenshot abuse
- **CV Extraction**: 18 sections, cached in SQLite, hash-based deduplication
  - Modular architecture with specialized components (section_extractor, post_processor, etc.)
  - Circuit breaker pattern for LLM resilience (5 failures → 60s timeout)
  - Factory pattern for extractor instances (no singleton conflicts)
  - Confidence scoring for extraction quality (caches only >0.75 confidence)
  - Real-time metrics tracking at `/api/v1/metrics/current`
- **Portfolio Generation**: Two-stage process - Preview first, then optional deployment
- **Preview Mode**: Instant local preview on ports 4000-5000 (no deployment needed)
- **Deployment**: Optional Vercel deployment after preview approval (~2-3 min)
- **Templates**: 2 active (v0_template_v1.5, v0_template_v2.1)
- **Authentication**: Email/password + Google OAuth + LinkedIn OAuth, session-based
- **File Storage**: Preserved in data/uploads/ with hash-based deduplication
- **Build Optimization**: .npmrc for legacy-peer-deps, no recursive install scripts
- **Payment Integration**: Stripe Embedded Checkout (test & live modes)
- **Portfolio Restoration**: Automatic portfolio recovery on page refresh/re-login

## Development Workflow Patterns
### CV Processing Flow

#### Anonymous Users (NEW FLOW):
```
1. Upload file → /upload-anonymous → Resume Gate validation → Save file → Return job_id (NO extraction)
2. Frontend shows MacBook animation → Shows signup modal after 6 seconds
3. User signs up → handleAuthSuccess → Calls /extract/{job_id} → Claude 4 Opus extraction
4. Portfolio generation continues with extracted data
```

#### Authenticated Users:
```
1. Upload CV → /upload → Resume Gate validation → Text extraction → Claude 4 Opus analysis → SQLite storage
2. CV Editor → User edits extracted data → CRUD operations
3. Portfolio generation → Isolated sandbox → Template injection → Vercel deployment
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
- **Validation Guards**: File fingerprinting (name-size-lastModified) to prevent double uploads
- **Error Handling**: Structured errors with Resume Gate reasons and suggestions
- **Retry Flow**: Seamless retry with skipValidation flag for already-validated files
- **State Management**: currentJobId tracks anonymous uploads across signup flow

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
- **Vercel deployment hangs**: Check `ps aux | grep vercel`, may be building
- **Infinite npm install loop**: Remove `"install": "npm install"` from scripts
- **"Cannot find module"**: Run `pnpm install` in project root
- **TypeScript errors**: Run `npx tsc --noEmit` in user_web_example folder
- **Python venv issues**: Check `which python` shows venv path
- **Resume Gate too strict/lenient**: Adjust threshold in settings.py (default=60)
- **Double upload on retry**: Check validation guards in handleFileSelect
- **Animation not starting**: Verify skipValidation flag and event dispatching

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

## Portfolio Generation Flow
### Two-Stage Process
1. **Preview Stage** (Default):
   - Authenticated: Upload → Extract → Generate → **Local Preview**
   - Anonymous: Upload (validation only) → Animation → Signup → Extract → Generate → **Local Preview**
   - Instant preview on `http://localhost:4000`
   - No deployment, runs locally for testing
   - Portfolio persists across page refreshes

2. **Deployment Stage** (Optional - After Payment):
   - User approves preview → Payment → **Deploy to Vercel**
   - Real-time progress monitoring (~2-3 min)
   - Returns live URL: `https://portfolio-xxxxx.vercel.app`
   - Automatic custom domain: `https://john-doe.portfolios.resume2website.com`

### Key Implementation Details
- **CLI Integration**: Uses `vercel` CLI to bypass 10MB API limit
- **Build Optimization**: 
  - `.npmrc` with `legacy-peer-deps=true`
  - Build deps moved to `dependencies`
  - NO recursive install scripts (causes infinite loops!)
- **Prerequisites**: 
  - Vercel CLI: `npm install -g vercel`
  - API token: `python3 src/utils/setup_keychain.py`

### Production Site Protection
The main app at resume2website.com is protected with authentication middleware:
- **Access with secret key**: `https://resume2website.com?key=YOUR_SECRET_KEY`
- **Cookie authentication**: Valid for 7 days after first access
- **Unauthorized visitors**: See "Coming Soon" page with animated red X over "PDF resume"
- **Coming Soon page**: Custom landing with email capture and gradient text styling
- **Configuration**: Edit `user_web_example/middleware.ts` to change secret key
- **Testing protection**: Use incognito window or clear cookies
- **Local development**: Frontend on port 3000, Backend on port 2000 (no ngrok needed)

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

## Portfolio Custom Domains & Iframe Embedding

### ✅ AUTOMATIC Iframe Embedding (No Manual Steps!)
Every portfolio now works in iframes automatically - no manual Vercel configuration needed!

### Automatic Custom Domain Generation
Every portfolio gets a custom subdomain based on the person's name:
- **John Doe** → `https://john-doe.portfolios.resume2website.com`
- **Michelle Lopez** → `https://michelle-lopez.portfolios.resume2website.com`

### How It Works (Fully Automated):
1. **Pre-configure project** before deployment with iframe settings
2. **Deploy with `--public` flag** → Automatically disables all authentication
3. **Extract deployment ID** from CLI output or API fallback
4. **Add custom domain** to project via Vercel API
5. **Create alias** pointing to production deployment
6. **Verify headers** → Confirms iframe embedding works

### Key Implementation Details:
- **CLI Flag**: `vercel --prod --public` forces public deployment (no auth)
- **Project Pre-configuration**: Settings applied BEFORE deployment
- **Environment Variables**: FRAME_PARENTS set for iframe origins
- **CSP Headers**: Handled by middleware, not vercel.json (avoids conflicts)
- **No Manual Steps**: Protection is disabled automatically during generation

### Verification:
```bash
# Check if portfolio is accessible (should return 200)
curl -I https://your-name.portfolios.resume2website.com/

# Good response (automatic public deployment):
HTTP/2 200
# NO X-Frame-Options header
# CSP frame-ancestors present
# NO authentication required
```

### Troubleshooting:
- **If iframe still blocked**: Check backend logs for deployment errors
- **DNS issues**: Wait 2-3 minutes for propagation
- **Cache issues**: Clear browser cache if seeing old protected version

## Important Files to Know
- **config.py** - Backend configuration, environment variables, AI model settings
- **main.py** - FastAPI application entry point with routing
- **src/api/routes/portfolio_generator.py** - Portfolio generation + optional Vercel deployment
- **src/api/routes/cv.py** - CV upload, extraction, CRUD operations (separate flows for anonymous/authenticated)
- **src/api/routes/metrics.py** - Real-time extraction metrics endpoint
- **src/api/routes/payments.py** - Stripe payment processing endpoints
- **src/api/routes/user_auth.py** - OAuth authentication endpoints (Google, LinkedIn)
- **src/api/db.py** - SQLite database operations, user management, session handling
- **src/core/cv_extraction/data_extractor.py** - Main extraction orchestrator (uses factory pattern)
- **src/core/cv_extraction/llm_service.py** - Claude 4 Opus integration with circuit breaker
- **src/core/cv_extraction/metrics.py** - Performance metrics collection
- **src/core/cv_extraction/circuit_breaker.py** - Resilience pattern for LLM failures
- **src/utils/cv_resume_gate.py** - Resume validation logic with image-specific rules
- **src/services/vercel_deployer.py** - Vercel CLI integration for deployments
- **user_web_example/app/page.tsx** - Main frontend with anonymous/auth flows, retry handling
- **user_web_example/lib/api.ts** - API client with uploadFile, extractCVData functions
- **user_web_example/components/interactive-cv-pile.tsx** - CV upload UI with drag-drop
- **user_web_example/components/ui/error-toast.tsx** - Resume Gate error display with retry
- **user_web_example/components/embedded-checkout-modal.tsx** - Stripe payment modal
- **user_web_example/app/payment-return/page.tsx** - Payment confirmation page
- **package.json** - Frontend dependencies, scripts, workspace config
- **requirements.txt** - Python backend dependencies
- **.claude/commands/** - Development utility scripts
- **docs/PORTFOLIO_IFRAME_SETUP.md** - Portfolio iframe embedding guide

---
*For comprehensive documentation, architecture details, and troubleshooting guides, see: `extended_claude.md`*

*Language: Always respond in English, even if user writes in Hebrew*