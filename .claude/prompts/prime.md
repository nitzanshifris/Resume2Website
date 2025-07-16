    # CV2WEB Project Understanding Prompt

    When starting a new session with CV2WEB, follow this systematic approach to understand the AI-powered portfolio generation platform:

    ## 1. Project Overview & Core Architecture
    - **READ** the CLAUDE.md file in the project's root folder - this is the primary source of truth for CV2WEB's architecture, workflows, and development guidelines
    - **UNDERSTAND** CV2WEB's purpose: AI-powered CV to portfolio website converter using FastAPI (Python) backend and Next.js (TypeScript) frontend
    - **EXAMINE** the project structure:
      - `src/` - Backend (FastAPI) with API routes, CV extraction, and portfolio generation
      - `packages/new-renderer/` - Frontend (Next.js) application
      - `src/templates/` - Portfolio templates with data adapters
      - `data/` - File storage and CV examples
      - `sandboxes/` - Isolated portfolio generation environments

    ## 2. Key Systems & Technologies
    - **CV Extraction**: Claude 4 Opus with temperature 0.0 for deterministic extraction
    - **Portfolio Expert**: AI-powered guidance system using Claude 4
    - **Portfolio Generation**: Isolated sandbox environments with Next.js instances
    - **Authentication**: Session-based auth with Google OAuth and email/password
    - **Database**: SQLite with CV data storage and file preservation
    - **Tech Stack**: FastAPI, Next.js 15, TypeScript, Tailwind CSS v4, pnpm

    ## 3. Critical Development Workflows
    - **Git Workflow**: MANDATORY branch-based development (NEVER work on main)
    - **TypeScript**: MUST run `pnpm run typecheck` before committing
    - **Backend**: Port 2000 (NOT 8000), activate venv before development
    - **Frontend**: pnpm only (NEVER npm/yarn), port 3000
    - **Portfolio Management**: Unique ports 4000+ for each portfolio instance

    ## 4. AI Services Integration
    - **Claude 4 Opus**: Primary extraction model with deterministic settings
    - **Portfolio Expert**: Conversational AI for portfolio guidance
    - **Google Cloud Vision**: OCR for image processing
    - **AWS Textract**: Alternative OCR service
    - **File Hash Caching**: Prevents duplicate processing

    ## 5. Data Flow Understanding
    ```
    User Upload → File Validation → AI Extraction → CV Editor → Portfolio Expert → Generation → Preview → Deploy
         ↓              ↓                ↓             ↓            ↓                ↓           ↓        ↓
       (FastAPI)    (Security)      (Claude 4)   (CRUD Ops)   (AI Guidance)    (Sandbox)   (Next.js) (Vercel)
    ```

    ## 6. API Endpoints Knowledge
    - **CV Management**: `/api/v1/cv/`, `/api/v1/my-cvs`, `/api/v1/download/`
    - **Portfolio Expert**: `/api/v1/portfolio-expert/start-session`, `/api/v1/portfolio-expert/chat`
    - **Portfolio Generation**: `/api/v1/portfolios/generate`, `/api/v1/portfolios/{id}/status`
    - **Authentication**: Session-based with X-Session-ID header

    ## 7. Development Environment Setup
    - **Prerequisites**: Node ≥18, Python ≥3.11, pnpm ≥8.0.0
    - **Backend**: `source venv/bin/activate && uvicorn main:app --reload --port 2000`
    - **Frontend**: `pnpm run dev` (port 3000)
    - **Database**: SQLite with automatic migrations
    - **Credentials**: Use keychain manager, NEVER commit API keys

    ## 8. Critical Reminders
    - **File Preservation**: Original CV files are now permanently stored
    - **Sandbox Isolation**: Each portfolio runs in isolated environment
    - **Claude 4 Integration**: Temperature 0.0 for maximum determinism
    - **CV Editor**: Full CRUD operations on extracted data
    - **Portfolio Expert**: AI guidance with session management
    - **SSE Ready**: Infrastructure prepared for real-time updates

    ## 9. Knowledge Validation
    Before proceeding with any work, confirm understanding:
    - How does CV2WEB's AI extraction pipeline work with Claude 4?
    - What is the portfolio expert system and how does it guide users?
    - How are portfolio instances managed in isolated sandboxes?
    - What is the CV data adapter system and why is it important?
    - How does the authentication and file preservation system work?
    - What are the mandatory Git workflow requirements?

