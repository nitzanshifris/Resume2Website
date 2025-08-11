# RESUME2WEBSITE Project Context

## Project Overview
RESUME2WEBSITE is an AI-powered CV to portfolio website converter that transforms resumes into stunning portfolio websites using FastAPI (Python) backend and Next.js (TypeScript) frontend in a pnpm monorepo.

## Key Technologies
- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: Next.js 15 + TypeScript
- **AI Services**: Claude 4 Opus ONLY (temperature 0.0 for deterministic CV extraction)
  - Claude 3.5 Sonnet: Defined but unused (future portfolio expert)
  - Gemini: Completely disabled
- **UI Libraries**: Aceternity UI, Magic UI, Shadcn/ui
- **Database**: SQLite
- **Infrastructure**: Vercel deployment, pnpm monorepo

## Recent Changes (August 2025)
- Fixed portfolio generation stability (Next.js binary, path duplication, watchfiles)
- Added resource limits per portfolio (memory/CPU)
- Implemented automated cleanup for old portfolios
- Added basic metrics/monitoring for portfolios
- Consolidated Git branches (nitzan-development-2 → main)
- Archived legacy code to archive-only-2025-08-05 branch
- Fixed double CV extraction issue for anonymous users

## Current Project Structure
```
RESUME2WEBSITE-V4/
├── src/
│   ├── api/             # FastAPI backend
│   ├── templates/       # Portfolio templates (v1.5, v2.1)
│   └── components/      # Shared UI components
├── sandboxes/           # Isolated portfolio generation
├── data/
│   ├── cv_uploads/      # User CV files
│   └── generated_portfolios/  # Generated portfolio files
├── scripts/             # Utility scripts
└── tests/              # Test files
```

## API Endpoints
- `/auth/register` - User registration
- `/auth/login` - User login
- `/auth/google` - Google OAuth
- `/cv/upload` - Upload CV files (supports batch uploads)
- `/cv/extract` - Extract structured data from CV
- `/cv/data/{job_id}` - Get extracted CV data
- `/portfolios/generate` - Generate portfolio in sandbox
- `/portfolios/{portfolio_id}/status` - Check generation status
- `/portfolios/metrics` - View portfolio metrics

## Important Files
- `src/api/routes/portfolio_generator.py` - Main portfolio generation logic
- `src/api/routes/cv.py` - CV upload and extraction
- `src/api/routes/auth.py` - Authentication endpoints
- `src/templates/v0_template_v1.5/` - Version 1.5 template
- `src/templates/v0_template_v2.1/` - Version 2.1 template
- `CLAUDE.md` - Comprehensive development guide

## Development Guidelines
1. Always work on feature branches (current: Nitzan-development)
2. Use sandboxed environments for portfolio generation
3. Run `pnpm run typecheck` before commits
4. Use pnpm for package management (never npm/yarn)
5. Test both templates (v1.5 and v2.1) when making changes

## Portfolio Generation Features
- 100+ animated components with SmartCard system
- 10 view modes per card (text, images, code, GitHub, video, etc.)
- Full edit mode with drag & drop
- Theme customization (6 color schemes)
- Typography settings
- Profile photo management
- Watermark control

## Performance Optimizations
- Resource limits: NODE_OPTIONS="--max-old-space-size=512"
- Automated cleanup: MAX_ACTIVE_PORTFOLIOS = 20
- File watching exclusions via .watchmanconfig
- CV extraction caching to prevent duplicate API calls