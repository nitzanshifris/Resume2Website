# CV2WEB V4 - Claude Code Assistant Guide

## Quick Setup
```bash
./quickstart.sh                         # One-command setup (recommended)
```

## IMPORTANT: Environment Setup
- **YOU MUST** use pnpm, not npm or yarn
- **ALWAYS** run typecheck after making code changes: `pnpm run typecheck`
- **NEVER** use code from `/legacy/` directory
- **ALWAYS** check existing components before creating new ones
- Backend runs on port **2000** (configured in config.py)
- Frontend runs on port 3000
- Max file upload: 10MB

## IMPORTANT: Auto-use Context7
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

## Project Overview
AI-powered CV to portfolio website converter using FastAPI (Python) + Next.js (TypeScript) in a pnpm monorepo.

## Most Used Commands

### Backend (Python FastAPI)
```bash
# Setup virtual environment (first time)
python3 -m venv venv                    # Create venv
source venv/bin/activate                # Activate (macOS/Linux)
pip install -r requirements.txt         # Install dependencies

# Run backend
uvicorn main:app --reload --port 2000  # Start backend
python main.py                          # Alternative start method

# Testing
pytest                                  # Run all tests
python tests/comprehensive_test.py      # Comprehensive test suite
python tests/quick_api_test.sh          # Quick API health check
```

### Frontend (Next.js/TypeScript)
```bash
pnpm install                            # Install dependencies
pnpm run dev                            # Start dev server
pnpm run build                          # Build project
pnpm run typecheck                      # Check types (IMPORTANT!)
pnpm run test                           # Run tests
pnpm run storybook                      # Component development
pnpm run gen:stories                    # Generate Storybook stories
pnpm run gen:props                      # Extract component props
```

### Debug Commands
```bash
pnpm why [package]                      # Check why package installed
curl http://localhost:2000/docs         # Check if backend running (FastAPI docs)
pnpm ls                                 # List all workspace packages
git status && git diff                  # Check changes before commit
```

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

## Code Style (IMPORTANT)

### TypeScript/JavaScript
- **MUST** use ES modules: `import { foo } from 'bar'` (NOT require)
- **MUST** run typecheck before committing
- Prefer functional React components with hooks
- Use Tailwind CSS classes for styling

### Python
- Use type hints for all functions
- Use absolute imports: `from src.api.routes import cv`
- Follow PEP 8 conventions

## Common Tasks & Examples

### Example: Fix TypeScript Error
When you see "Property 'X' does not exist":
1. Run: `pnpm run typecheck` to see all errors
2. Check type definition in `src/core/schemas/unified.py` or relevant `.ts` file
3. Update the interface/type definition
4. Run typecheck again to verify

### Example: Add New API Endpoint
1. Create route file: `src/api/routes/new_feature.py`
2. Add schema: `src/api/schemas.py`
3. Include in `main.py`: `app.include_router(new_feature.router)`
4. Test: `curl http://localhost:2000/docs`

### Example: Add New UI Component
1. Check existing: `ls components/aceternity/` or `components/magicui/`
2. Copy similar component as template
3. Follow naming convention: `kebab-case.tsx`
4. Add story: `new-component.stories.tsx`

## Claude Code Specific Instructions

### Research Before Coding
- **ALWAYS** use Read/Grep to check existing patterns first
- Look for similar implementations before creating new code
- Check `package.json` for available scripts and dependencies

### Multi-File Changes
- Create a checklist in `scratch.md` for complex tasks
- Mark items as you complete them
- Use `git status` to track changes

### After Making Changes
- **MUST** run: `pnpm run typecheck`
- If tests exist, run: `pnpm run test`
- Check for console errors in browser
- Verify imports are working

## Key Directories
```
/src/
  /api/          - FastAPI backend
  /core/         - Business logic (CV extraction, portfolio gen)
  /templates/    - Portfolio templates
/packages/
  /new-renderer/ - Next.js app
/components/     - UI components (Aceternity, Magic UI)
```

## Architecture Notes
- Monorepo with pnpm workspaces
- Strategy pattern for portfolio generators
- Unified schema for CV data (`src/core/schemas/unified.py`)
- 100+ animated UI components available

## Common Gotchas & Solutions
| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `pnpm install` in root |
| TypeScript errors | Run `pnpm run typecheck` |
| Port already in use | Kill process or use different port |
| Large file warning | Use Git LFS for files >50MB |
| Import not working | Check if using `src/` prefix correctly |

## AI Services & Configuration
- **Google Gemini 2.5 Flash** - CV extraction (primary, model in config.py)
- **Claude 3.5 Sonnet** - Content enhancement
- **Google Cloud Vision** - OCR for images
- **AWS Textract** - Alternative OCR
- **OpenAI API** - Optional enhancement
- **Vercel** - Deployment platform
- **Pinecone** - Optional vector search

### Credential Setup (IMPORTANT)
```bash
python src/utils/setup_keychain.py      # Secure credential storage
```
**Never store API keys in files!** Use the keychain manager.

## Git Workflow
```bash
git status                              # Check changes
pnpm run typecheck                      # Verify no TS errors
git add -A                              # Stage changes
git commit -m "feat: descriptive message"
git push origin main                    # Push to GitHub
```

### GitHub Integration
- **PR Reviews**: Mention `@claude` in PR comments for AI review
- **CI/CD**: Automated workflows in `.github/workflows/`
- **Actions**: Claude Code GitHub Action configured

## Debugging Tips
- **Backend logs**: Check terminal running uvicorn
- **Frontend errors**: Open browser DevTools Console (F12)
- **Python errors**: Check venv is activated (`which python` should show venv path)
- **TypeScript errors**: Run `pnpm run typecheck`
- **API issues**: Visit http://localhost:2000/docs for FastAPI interactive docs

## Project Configuration (config.py)
- **Backend Port**: 2000 (not 8000!)
- **CORS Origins**: localhost:3000, 3001, 5173
- **Max Upload**: 10MB
- **File Types**: PDF, DOCX, DOC, TXT, MD, RTF, ODT, HTML, images
- **Session Expiry**: 7 days
- **AI Models**: 
  - Gemini: `gemini-2.5-flash`
  - Claude: `claude-3-5-sonnet-20241022`

## REMEMBER
1. **typecheck** after changes
2. **pnpm** not npm
3. Check **existing code** first
4. Use **Read/Grep** tools for research
5. Follow **existing patterns**
6. Backend runs on **port 2000**
7. Use **quickstart.sh** for setup
8. **Never** commit API keys