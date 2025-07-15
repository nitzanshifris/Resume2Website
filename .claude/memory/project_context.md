# CV2WEB Project Context

## Project Overview
CV2WEB is an AI-powered CV to portfolio website converter that transforms resumes into stunning portfolio websites.

## Key Technologies
- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: Next.js 15 + TypeScript
- **AI Services**: Google Gemini 2.5 Flash, Claude 3.5 Sonnet
- **UI Libraries**: Aceternity UI, Magic UI
- **Infrastructure**: Vercel, PostgreSQL

## Recent Changes
- Implemented nullable JSON schema for all CV data fields
- Added isolated sandbox environments for portfolio generation
- Enhanced Git workflow to enforce branch-based development
- Created structured logging system with live readable output
- Integrated Claude SDK with best practices (retry, caching, streaming)

## Current Focus Areas
1. Portfolio generation in isolated sandboxes
2. Live readable logging throughout the system
3. Branch-based development workflow
4. Claude SDK integration improvements

## API Endpoints
- `/cv/upload` - Upload and process CV files
- `/cv/extract` - Extract structured data from CV
- `/portfolio/generate` - Generate portfolio in sandbox
- `/portfolio/preview` - Preview generated portfolio
- `/portfolio/export` - Export approved portfolio

## Important Files
- `src/core/schemas/unified_nullable.py` - Nullable CV data schema
- `src/services/claude_service.py` - Enhanced Claude SDK integration
- `src/utils/live_logger.py` - Structured logging system
- `sandboxes/` - Isolated environment for portfolio generation

## Development Guidelines
1. Always work on feature branches, never on main
2. Use sandboxed environments for all code generation
3. Implement live readable logging for transparency
4. Follow the structured Git workflow in CLAUDE.md
5. Use pnpm for package management (never npm/yarn)