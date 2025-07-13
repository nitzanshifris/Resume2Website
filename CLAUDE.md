# CV2WEB V4 - Claude Code Assistant Guide

## IMPORTANT: Environment Setup
- **YOU MUST** use pnpm, not npm or yarn
- **ALWAYS** run typecheck after making code changes: `pnpm run typecheck`
- **NEVER** use code from `/legacy/` directory
- **ALWAYS** check existing components before creating new ones
- Backend runs on port 2000, frontend on port 3000

## Project Overview
AI-powered CV to portfolio website converter using FastAPI (Python) + Next.js (TypeScript) in a pnpm monorepo.

## Most Used Commands

### Backend (Python FastAPI)
```bash
uvicorn main:app --reload --port 2000  # Start backend
pytest                                   # Run tests
```

### Frontend (Next.js/TypeScript)
```bash
pnpm install                            # Install dependencies
pnpm run dev                            # Start dev server
pnpm run build                          # Build project
pnpm run typecheck                      # Check types (IMPORTANT!)
pnpm run test                           # Run tests
pnpm run storybook                      # Component development
```

### Debug Commands
```bash
pnpm why [package]                      # Check why package installed
curl http://localhost:2000/docs         # Check if backend running
pnpm ls                                 # List all workspace packages
git status && git diff                  # Check changes before commit
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

## AI Services
- **Google Gemini 2.0** - CV extraction (primary)
- **Claude API** - Content enhancement
- **Google Cloud Vision** - OCR
- **AWS Textract** - Alternative OCR

## Git Workflow
```bash
git status                              # Check changes
pnpm run typecheck                      # Verify no TS errors
git add -A                              # Stage changes
git commit -m "feat: descriptive message"
```

## REMEMBER
1. **typecheck** after changes
2. **pnpm** not npm
3. Check **existing code** first
4. Use **Read/Grep** tools for research
5. Follow **existing patterns**