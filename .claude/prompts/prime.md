    # RESUME2WEBSITE Project Understanding Prompt

    When starting a new session with RESUME2WEBSITE, follow this systematic approach to understand the AI-powered portfolio generation platform:

    ## 1. Project Overview & Core Architecture
    - **READ** the CLAUDE.md file in the project's root folder - this is the primary source of truth for RESUME2WEBSITE's architecture, workflows, and development guidelines
    - **UNDERSTAND** RESUME2WEBSITE's purpose: AI-powered CV to portfolio website converter using FastAPI (Python) backend and Next.js (TypeScript) frontend in a pnpm monorepo
    - **EXAMINE** the project structure:
      - `src/` - Backend (FastAPI) with API routes, CV extraction, and portfolio generation
      - `src/templates/` - Portfolio templates (v1.5, v2.1) with data adapters and SmartCard system
      - `data/` - File storage and CV examples
      - `sandboxes/` - Isolated portfolio generation environments
      - `scripts/` - Utility scripts and tools
      - `tests/` - Test files

    ## 2. Key Systems & Technologies
    - **CV Extraction**: Claude 4 Opus ONLY with temperature 0.0 for deterministic extraction
    - **Portfolio Expert**: AI-powered guidance system (future feature in development)
    - **Portfolio Generation**: Isolated sandbox environments with Next.js instances
    - **Authentication**: Session-based auth with Google OAuth and email/password
    - **Database**: SQLite with CV data storage and file preservation
    - **Tech Stack**: FastAPI, Next.js 15, TypeScript, Tailwind CSS v4, pnpm
    - **Templates**: v0_template_v1.5 and v0_template_v2.1 with 100+ animated components

    ## 3. Critical Development Workflows
    - **Git Workflow**: MANDATORY branch-based development (NEVER work on main, current: Nitzan-development)
    - **TypeScript**: MUST run `pnpm run typecheck` before committing
    - **Backend**: `uvicorn main:app --reload --port 2000`, activate venv before development
    - **Frontend**: pnpm only (NEVER npm/yarn), port 3000
    - **Portfolio Sandboxes**: npm only (NOT pnpm) for isolated environments, unique ports 4000+
    - **Performance**: Resource limits per portfolio, automated cleanup system

    ## 4. AI Services Integration
    - **Claude 4 Opus**: ONLY AI service actually used (deterministic CV extraction at temperature 0.0)
    - **Claude 3.5 Sonnet**: Defined but unused (intended for future portfolio expert)
    - **Gemini**: Completely disabled in codebase
    - **File Hash Caching**: Prevents duplicate CV processing
    - **Performance**: Resource limits (NODE_OPTIONS="--max-old-space-size=512")

    ## 5. Data Flow Understanding
    ```
    User Upload → File Validation → AI Extraction → CV Editor → Portfolio Expert → Generation → Preview → Deploy
         ↓              ↓                ↓             ↓            ↓                ↓           ↓        ↓
       (FastAPI)    (Security)      (Claude 4)   (CRUD Ops)   (AI Guidance)    (Sandbox)   (Next.js) (Vercel)
    ```

    ## 6. API Endpoints Knowledge
    - **Authentication**: `/auth/register`, `/auth/login`, `/auth/google`
    - **CV Management**: `/cv/upload`, `/cv/extract`, `/cv/data/{job_id}`
    - **Portfolio Generation**: `/portfolios/generate`, `/portfolios/{portfolio_id}/status`, `/portfolios/metrics`
    - **Session Management**: Session-based authentication with proper cookies

    ## 7. Development Environment Setup
    - **Prerequisites**: Node ≥18, Python ≥3.11, pnpm ≥8.0.0
    - **Backend**: `source venv/bin/activate && uvicorn main:app --reload --port 2000`
    - **Frontend**: `pnpm run dev` (port 3000)
    - **Database**: SQLite with automatic migrations
    - **Credentials**: Use keychain manager, NEVER commit API keys

    ## 8. Critical Reminders (August 2025 Updates)
    - **File Preservation**: Original CV files are permanently stored with hash-based caching
    - **Sandbox Isolation**: Each portfolio runs in isolated npm environment (not pnpm)
    - **Claude 4 Integration**: ONLY AI service used, temperature 0.0 for maximum determinism
    - **Resource Management**: MAX_ACTIVE_PORTFOLIOS = 20, automated cleanup system
    - **Performance Fixes**: Next.js binary fixes, path duplication resolved, .watchmanconfig optimization
    - **Git Consolidation**: Legacy code archived to archive-only-2025-08-05 branch

    ## 9. Knowledge Validation
    Before proceeding with any work, confirm understanding:
    - How does RESUME2WEBSITE's AI extraction pipeline work with Claude 4 Opus only?
    - What are the two portfolio templates (v1.5, v2.1) and their SmartCard system?
    - How are portfolio instances managed in isolated npm sandbox environments?
    - What is the CV data adapter system and why is it critical for templates?
    - How does the authentication and file preservation system work with SQLite?
    - What are the mandatory Git workflow requirements (never work on main)?
    - Why do sandboxes use npm while main project uses pnpm?
    - What performance optimizations are in place (resource limits, cleanup)?

