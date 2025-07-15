# AI Decision Log

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