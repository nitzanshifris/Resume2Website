# AI Decision Log

## Portfolio Generation Stability Fixes (2025-08-05)
**Decision**: Switch from pnpm to npm in sandboxes
**Reasoning**: Next.js binary not found errors in isolated environments
**Implementation**:
- Changed all pnpm commands to npm in portfolio_generator.py
- Added cleanup of ALL lockfiles before installation
- Fixed path duplication bug in Next.js binary execution
**Impact**: Stable portfolio generation without binary errors

## Resource Management (2025-08-05)
**Decision**: Add resource limits and automated cleanup
**Reasoning**: Prevent memory overload and accumulation of old portfolios
**Implementation**:
- NODE_OPTIONS="--max-old-space-size=512" for each portfolio
- MAX_ACTIVE_PORTFOLIOS = 20 with automated cleanup
- Portfolio metrics tracking system
**Impact**: Better resource utilization and system stability

## Git Branch Consolidation (2025-08-05)
**Decision**: Make nitzan-development-2 the new main branch
**Reasoning**: Main branch was outdated (July 22-23) vs nitzan-development-2 (August 1-5)
**Implementation**:
- Merged nitzan-development-2 into main
- Created backup tags for safety
- Archived legacy code to separate branch
**Impact**: Cleaner codebase with latest work in main

## Double CV Extraction Fix (2025-08-05)
**Decision**: Check database for existing CV data before extraction
**Reasoning**: Anonymous users were triggering duplicate extractions
**Implementation**:
- Modified extract endpoint to query database first
- Only extract if no existing data found
**Impact**: Significant performance improvement, no duplicate API calls

## Schema Migration (2025-01-14)
**Decision**: Migrate from `unified.py` to `unified_nullable.py` schema
**Reasoning**: User requested all JSON fields to be nullable (null instead of empty strings)
**Implementation**: 
- Created new schema with all fields as Optional[type] = None
- Added custom model_dump_nullable() method
- Updated all imports across codebase
**Impact**: JSON output now properly represents missing data as null

## Isolated Environments (2025-01-14)
**Decision**: Implement sandboxed portfolio generation
**Reasoning**: Video learnings emphasized security and preventing code pollution
**Implementation**:
- Created sandboxes/ directory structure
- Each portfolio gets unique job-id sandbox
- Preview before export to main codebase
**Impact**: Safer code generation, no direct edits to main project

## Logging Enhancement (2025-01-14)
**Decision**: Implement structured live readable logging
**Reasoning**: Video emphasized importance of transparency in AI actions
**Implementation**:
- Created LiveLogger with visual indicators
- Progress bars for long tasks
- Tree and table formatting
- Step timing tracking
**Impact**: Users can follow AI reasoning and progress in real-time

## Git Workflow Enforcement (2025-01-14)
**Decision**: Mandatory branch-based development
**Reasoning**: User explicitly requested never working on main branch
**Implementation**:
- Updated CLAUDE.md with strict Git rules
- Always check current branch
- Require user approval for add/commit/push
**Impact**: Prevents accidental changes to main branch