# Documentation Discrepancies Report - Resume2Website V4

## Executive Summary
This report documents critical discrepancies found between the project documentation (CLAUDE.md, Code Review Agent) and the actual codebase implementation. These discrepancies could lead to confusion during development and incorrect assumptions about system behavior.

## Critical Discrepancies Found

### 1. 🔴 CV Data Structure - MAJOR DISCREPANCY
**Documentation States**: 18 sections in CV data structure
**Actual Implementation**: 16 sections

**Missing Sections**:
- Section #17: Patents (not implemented)
- Section #18: Testimonials (not implemented)

**Actually Implemented Sections** (src/core/schemas/unified_nullable.py):
1. hero
2. contact
3. summary
4. experience
5. education
6. skills
7. projects
8. achievements
9. certifications
10. languages
11. courses
12. volunteer
13. publications
14. speaking
15. hobbies
16. unclassified_text

**Action Required**: Update all documentation to reflect 16 sections, not 18.

### 2. 🔴 Portfolio Templates - CRITICAL MISMATCH
**Documentation States**: 
- 2 active templates: v0_template_v1.5, v0_template_v2.1
- Multiple template support

**Actual Implementation** (src/api/routes/portfolio_generator.py):
```python
AVAILABLE_TEMPLATES = {
    "official_template_v1": "src/templates/official_template_v1"
}
DEFAULT_TEMPLATE = "official_template_v1"
```

**Action Required**: 
- ✅ Moved old templates to src/templates/future_templates/
- ✅ Updated CLAUDE.md to reflect single template
- ✅ Updated Code Review Agent documentation

### 3. 🟠 Undocumented API Endpoints
**Missing from Documentation**:

#### CV Management (src/api/routes/cv.py):
- `POST /api/v1/upload-anonymous` - Anonymous upload flow
- `POST /api/v1/upload-multiple` - Bulk upload capability
- `POST /api/v1/extract/{job_id}` - Separate extraction endpoint
- `POST /api/v1/claim` - Claim anonymous CVs
- `GET /api/v1/download/{job_id}/all` - Get all files info
- `GET /api/v1/download/{job_id}/{filename}` - Download specific file
- `GET /api/v1/current-user-info` - Current user details
- `GET /api/v1/profile` - User profile endpoint
- `PUT /api/v1/profile` - Update profile

#### Undocumented Systems:
- **Metrics System** (src/api/routes/metrics.py):
  - `GET /api/v1/metrics/current` - Real-time metrics
  - `GET /api/v1/metrics/history` - Historical data
  
- **Workflows System** (src/api/routes/workflows.py):
  - Complete workflow management system
  
- **SSE System** (src/api/routes/sse.py):
  - Server-sent events for real-time updates
  
- **Enhanced CV System** (src/api/routes/cv_enhanced.py):
  - Advanced CV processing capabilities

### 4. 🟡 Authentication Routes Confusion
**Issue**: Duplicate and inconsistent authentication endpoints

**Found in cv.py**:
- `/register` (should be `/api/v1/auth/register`)
- `/login` (should be `/api/v1/auth/login`)

**Found in user_auth.py**:
- Properly prefixed OAuth routes
- `/api/v1/auth/google/callback`
- `/api/v1/auth/linkedin/callback`

**Action Required**: Clarify which auth routes are active and remove duplicates.

### 5. 🟡 Circuit Breaker Configuration
**Documentation States**: "5 failures → 60s timeout"
**Actual Implementation** (src/core/cv_extraction/circuit_breaker.py):
- Failure threshold: 5 ✅
- Timeout: Exponential backoff starting at 30s, not fixed 60s
- Pattern: 30s, 60s, 120s, etc.

**Action Required**: Update docs to mention exponential backoff.

### 6. ✅ Correctly Documented Items
These items were verified and are accurate:
- Resume Gate threshold: 60 (configurable)
- Port configuration: Backend 2000, Frontend 3019, Portfolios 4000-5000
- Payment endpoints (Stripe integration)
- File storage with hash deduplication
- Portfolio resource limits (20 max, 512MB each)
- 24-hour auto-cleanup

## Recommendations

### Immediate Actions:
1. **Update CV Section Count**: Change all references from 18 to 16 sections
2. **Document Missing Endpoints**: Add the 9+ missing endpoints to CLAUDE.md
3. **Remove Template References**: Ensure only official_template_v1 is referenced
4. **Fix Auth Route Documentation**: Clarify the correct authentication flow

### Medium Priority:
1. **Document Metrics System**: Add section about real-time metrics
2. **Document Workflows System**: Explain workflow capabilities
3. **Update Circuit Breaker Docs**: Mention exponential backoff
4. **Add SSE Documentation**: Explain real-time update system

### Long Term:
1. **Consider Implementing**: Patents and Testimonials sections if needed
2. **Consolidate Auth Routes**: Remove duplicate authentication endpoints
3. **Template Migration Guide**: Document how to add new templates

## Files Requiring Updates

### Must Update:
- `/CLAUDE.md` - Main documentation (partially done)
- `/.claude/agents/core/code-review-agent.md` (partially done)
- `/docs/CUSTOM_AGENTS_DEVELOPMENT_PLAN.md`
- Any README files mentioning templates or CV structure

### Should Review:
- `/extended_claude.md` (if exists)
- Any API documentation
- Frontend code expecting 18 sections

## Validation Checklist
- [ ] CV sections updated to 16 everywhere
- [ ] Template references updated to official_template_v1 only
- [ ] All API endpoints documented
- [ ] Authentication flow clarified
- [ ] Circuit breaker behavior correctly described
- [ ] Metrics and workflows systems documented

---

*Report Generated: Current Session*
*Severity: High - Multiple critical documentation issues affecting development*