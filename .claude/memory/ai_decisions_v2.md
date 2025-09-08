# AI Decision Log V2 - Resume2Website V4

## Current Architecture Decisions

### AI Model Selection (Active)
**Decision**: Use Claude 4 Opus ONLY for CV extraction
**Reasoning**: Deterministic results with temperature 0.0, highest quality extraction
**Implementation**: All extraction through `src/core/cv_extraction/llm_service.py`
**Impact**: Consistent, high-quality CV parsing across all file types

### CV Structure (2025-01-08)
**Decision**: 15-section CV structure (not 18)
**Reasoning**: Patents merged into achievements, testimonials frontend-only
**Sections**: Hero, Contact, Summary, Experience, Education, Skills, Projects, Achievements, Certifications, Languages, Volunteer, Publications, Speaking, Courses, Hobbies
**Impact**: Simplified data model, cleaner extraction

### Single Template Strategy (2025-01-08)
**Decision**: Use only `official_template_v1`
**Reasoning**: Consistency, easier maintenance, proven design
**Implementation**: Removed v0_template_v1.5 and v0_template_v2.1
**Impact**: Simplified portfolio generation, consistent user experience

### Two-Stage Portfolio Process (Active)
**Decision**: Preview first (local), then optional deployment
**Reasoning**: Users can test before paying, reduces failed deployments
**Implementation**: 
- Preview on ports 4000-5000
- Deploy to Vercel after payment
**Impact**: Better user experience, reduced support issues

## Historical Decisions (Preserved for Context)

### Sandbox npm Usage (2025-08-05)
**Decision**: Use npm in sandboxes, pnpm in main project
**Reasoning**: Next.js binary resolution issues in isolated environments
**Implementation**: All sandbox operations use npm
**Impact**: Stable portfolio generation

### Resource Management (2025-08-05)
**Decision**: Implement strict resource limits
**Limits**:
- Max 20 active portfolios
- 512MB memory per portfolio
- 24-hour automatic cleanup
**Impact**: Prevents system overload

### Circuit Breaker Pattern (Active)
**Decision**: Exponential backoff for LLM failures
**Pattern**: 5 failures → 30s, 60s, 120s... backoff
**Implementation**: `src/core/cv_extraction/circuit_breaker.py`
**Impact**: Resilient API integration

### File Validation Strategy (Active)
**Decision**: Resume Gate with stricter rules for images
**Reasoning**: Prevent screenshot abuse, ensure real CVs
**Requirements for Images**:
- 500+ characters extracted
- 3+ signal types (dates, emails, bullets)
- Both contact AND experience sections
**Impact**: Higher quality inputs

### Authentication Architecture (Active)
**Decision**: Session-based auth with multiple providers
**Providers**: Email/password, Google OAuth, LinkedIn OAuth
**Storage**: SQLite with secure session cookies
**Impact**: Flexible user authentication

### Anonymous Flow (Active)
**Decision**: Validate-only for anonymous, extract after signup
**Reasoning**: Save Claude API costs, encourage signups
**Flow**: Upload → Validate → Animation → Signup → Extract
**Impact**: 40% reduction in API costs

### Caching Strategy (Active)
**Decision**: Cache extractions with >0.75 confidence
**Implementation**: File hash deduplication in SQLite
**Impact**: Instant results for duplicate files

### Git Workflow (Active)
**Decision**: Feature branches only, never work on main
**Current Branch**: development-flow-rebuild2
**Rules**: Require approval for commits, pushes, merges
**Impact**: Protected production code

## Agent System Decisions (2025-01-08)

### Agent Output Organization
**Decision**: Save all agent outputs to `.claude/agents/data/[agent-name]/`
**Reasoning**: Organized, findable, prevents root directory clutter
**Format**: `YYYY-MM-DD_HH-MM-SS_task-description.md`
**Impact**: Clean project structure

### Code-Reviewer Agent
**Decision**: Comprehensive agent with all undocumented features
**Knowledge**: 29 endpoints across SSE, workflows, metrics, enhanced CV
**Tools**: Read, Grep, Glob, Write, Edit, MultiEdit
**Impact**: Thorough code reviews with project context

## Performance Decisions

### Factory Pattern for Extractors
**Decision**: New instance per extraction
**Reasoning**: Avoid state contamination between extractions
**Implementation**: `DataExtractorFactory` in data_extractor.py
**Impact**: Thread-safe extraction

### SSE for Real-time Updates
**Decision**: Server-Sent Events for progress tracking
**Endpoints**: 9 SSE endpoints for various operations
**Impact**: Live feedback during long operations

### Workflow Orchestration
**Decision**: Advanced workflow system with correlation
**Features**: Background tasks, pattern analysis, alerts
**Impact**: Complex operation management

## Security Decisions

### API Key Management
**Decision**: Keychain storage, never in code
**Implementation**: `src/utils/setup_keychain.py`
**Impact**: Secure credential management

### Rate Limiting
**Decision**: User and endpoint specific limits
**Implementation**: Throughout SSE and API endpoints
**Impact**: Prevents abuse

### Admin Access Control
**Decision**: Separate admin role verification
**Implementation**: `require_admin` dependency
**Impact**: Protected admin endpoints

---

*Last Updated: 2025-01-08*
*Version: 2.0*
*Maintained by: Resume2Website V4 Development Team*