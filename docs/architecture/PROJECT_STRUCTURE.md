# RESUME2WEBSITE-V4 Project Structure

## Overview
This document provides a comprehensive overview of the RESUME2WEBSITE-V4 project structure, explaining the purpose and contents of each directory.

## Root Directory Structure

```
RESUME2WEBSITE-V4/
├── src/                        # All backend source code
│   ├── api/                    # API routes and database
│   ├── core/                   # Core business logic
│   ├── services/               # Business services
│   ├── templates/              # Portfolio templates
│   └── utils/                  # Utility functions
├── user_web_example/           # Frontend Next.js application
├── components/                 # Shared UI component libraries
├── data/                       # Storage and examples
├── sandboxes/                  # Isolated portfolio environments
├── docs/                       # Documentation
├── tests/                      # Test suites
├── scripts/                    # Utility scripts
├── main.py                     # FastAPI entry point
├── config.py                   # Configuration
└── CLAUDE.md                   # Development guide
```

## Directory Details

### `/src` - Backend Source Code

#### `/src/api` - API Layer
- **`routes/`** - FastAPI endpoints
  - `auth.py` - Authentication (login, register, logout)
  - `cv.py` - CV upload and processing
  - `cv_enhanced.py` - Enhanced CV operations
  - `portfolio_generator.py` - Portfolio generation
  - `sse.py` - Server-sent events
  - `workflows.py` - Workflow management
- **`db.py`** - SQLite database operations
- **`schemas.py`** - Pydantic models
- **`middleware/`** - Request middleware

#### `/src/core` - Business Logic
- **`cv_extraction/`** - CV processing
  - `data_extractor.py` - Claude 4 Opus extraction
  - `advanced_section_classifier.py` - Section classification
  - `date_validator.py` - Date validation
  - `location_parser.py` - Location parsing
  - `role_inferencer.py` - Role inference
  - `url_normalizer.py` - URL normalization
- **`local/`** - Local processing
  - `text_extractor.py` - PDF/DOCX extraction
  - `smart_deduplicator.py` - Text deduplication
  - `keychain_manager.py` - Credential management
- **`schemas/`** - Data models
  - `unified_nullable.py` - CV data schema (15 sections)

#### `/src/services` - Business Services
- `claude_service.py` - Claude API integration
- `claude_portfolio_expert.py` - AI portfolio guidance
- `sse_service.py` - Real-time updates
- `rate_limiter.py` - API rate limiting
- `metrics_collector.py` - Performance metrics
- `log_aggregation_service.py` - Log analysis

#### `/src/templates` - Portfolio Templates
- `official_template_v1/` - Official portfolio template
- `resume2web_branded/` - Branded template
- Each template contains:
  - `app/` - Next.js pages
  - `components/` - React components
  - `lib/cv-data-adapter.tsx` - Data transformation
  - `package.json` - Dependencies

### `/user_web_example` - Frontend Application
Main Next.js application for RESUME2WEBSITE interface.

- **`app/`** - App router pages
  - `page.tsx` - Landing page
  - `auth/` - Authentication pages
- **`components/`** - React components
  - `dashboard-pages/` - Dashboard views
    - `cv-editor.tsx` - CV editing interface
    - `my-resume.tsx` - Resume display
    - `my-website.tsx` - Portfolio preview
  - `ui/` - UI primitives
  - `auth-modal.tsx` - Authentication modal
  - `interactive-cv-pile.tsx` - CV upload
  - `processing-page.tsx` - Progress display
  - `pricing-modal.tsx` - Pricing tiers
- **`contexts/`** - React contexts
  - `AuthContext.tsx` - Authentication state
- **`lib/`** - Utilities
  - `api.ts` - API client
  - `utils.ts` - Helper functions

### `/components` - Shared UI Libraries
- **`libraries/`**
  - `aceternity/ui/` - Aceternity components
  - `magic-ui/ui/` - Magic UI components
- **`gallery-app/`** - Component showcase

### `/data` - Storage
- **`cv_examples/`** - Test CV files
  - `pdf_examples/` - PDF samples
  - `png_examples/` - Image samples
  - `text_examples/` - Text samples
- **`uploads/`** - User uploaded files
- **`generated_portfolios/`** - Generated sites
- **`resume2website.db`** - SQLite database

### `/sandboxes` - Portfolio Sandboxes
Isolated environments for each generated portfolio.
- **`portfolios/`** - Individual portfolio instances
  - Each sandbox contains full Next.js project
  - Unique port allocation (4000+)
  - Independent npm dependencies

### `/docs` - Documentation
- **`README.md`** - Documentation hub
- **`CV_EDITOR_IMPLEMENTATION.md`** - CV editor guide
- **`api/`** - API documentation
  - `CURRENT_PIPELINE.md` - System flow
  - `api.md` - Endpoint reference
- **`architecture/`** - Design docs
- **`taskmaster/`** - Task management
- **`guides/`** - How-to guides
- **`archive/`** - Historical docs

### `/tests` - Test Suites
- **`unit/`** - Unit tests
- **`integration/`** - Integration tests
- **`e2e/`** - End-to-end tests
- **`fixtures/`** - Test data
- Individual test files for specific features

### `/scripts` - Utility Scripts
- `start_resume2website.sh` - Start all services
- `cleanup.sh` - Clean generated files
- `quickstart.sh` - One-command setup

## Key Configuration Files

### Root Level
- **`main.py`** - FastAPI application
- **`config.py`** - Global configuration
- **`requirements.txt`** - Python dependencies
- **`package.json`** - Node dependencies
- **`pnpm-workspace.yaml`** - pnpm workspace

### Frontend Config
- **`next.config.mjs`** - Next.js config
- **`tailwind.config.ts`** - Tailwind CSS
- **`tsconfig.json`** - TypeScript config
- **`postcss.config.mjs`** - PostCSS (must include autoprefixer!)

## Data Flow

1. **Upload** → `user_web_example` → `/api/v1/upload-cv`
2. **Extract** → `src/core/local/text_extractor.py`
3. **AI Process** → `src/core/cv_extraction/data_extractor.py` (Claude 4)
4. **Classify** → `src/core/cv_extraction/advanced_section_classifier.py`
5. **Edit** → `components/dashboard-pages/cv-editor.tsx`
6. **Generate** → `src/api/routes/portfolio_generator.py`
7. **Sandbox** → `/sandboxes/portfolios/{id}/`
8. **Preview** → Live on unique port

## Environment Variables

Set via `src/utils/setup_keychain.py`:
```
# API Keys
ANTHROPIC_API_KEY       # Claude 4 Opus
GOOGLE_CLOUD_PROJECT    # Google Vision OCR
AWS_ACCESS_KEY_ID       # AWS Textract

# Database
DATABASE_URL=data/resume2website.db

# Ports
BACKEND_PORT=2000       # FastAPI
FRONTEND_PORT=3000      # Next.js
```

## Development Workflow

1. **Setup**
   ```bash
   # Backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Frontend
   pnpm install
   
   # Credentials
   python3 src/utils/setup_keychain.py
   ```

2. **Run Services**
   ```bash
   # Terminal 1: Backend
   python3 main.py
   
   # Terminal 2: Frontend
   pnpm run dev
   ```

3. **Testing**
   ```bash
   # Backend tests
   pytest
   
   # Frontend checks
   pnpm run typecheck
   ```

## Portfolio Generation Details

Generated portfolios are created in isolated sandboxes:

```
sandboxes/portfolios/{user_id}_{job_id}_{portfolio_id}/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities
│   └── cv-data-adapter.tsx # Data transformation
├── public/                 # Static assets
├── package.json            # Dependencies (npm)
├── next.config.mjs         # Next.js config
├── tailwind.config.js      # Tailwind config
├── postcss.config.mjs      # PostCSS (with autoprefixer!)
└── portfolio_metadata.json # Generation metadata
```

## Best Practices

1. **Code Organization**
   - Backend logic in `/src`
   - Frontend in `/user_web_example`
   - Shared components in `/components`

2. **Testing**
   - Run `pnpm run typecheck` before commits
   - Test CV uploads with files from `/data/cv_examples`
   - Never use made-up CV data

3. **Git Workflow**
   - Always work on feature branches
   - Never commit to main directly
   - Get approval before pushing

4. **Performance**
   - Portfolio generation uses npm (not pnpm) in sandboxes
   - Each portfolio limited to 1.5GB memory
   - Automatic cleanup after 24 hours