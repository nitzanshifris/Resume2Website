# Resume2Website V4 - Code Review Task List

## Review Summary
Code review of SSE implementation revealed multiple critical security vulnerabilities and architectural violations. The implementation lacks essential Resume2Website V4 patterns including rate limiting, admin authentication, workflow correlation, circuit breaker integration, and proper error handling.

## Key Issues Found
- Multiple critical security vulnerabilities in SSE endpoints
- Missing rate limiting and connection management
- Admin endpoint without proper authentication
- No workflow correlation or metrics integration
- Missing circuit breaker pattern for LLM service calls
- Lacks proper SSE headers and connection cleanup
- No authentication validation or permission checking

---

### 🔴 Critical Priority
- [ ] **[SECURITY]** Fix admin metrics endpoint with no authentication in `/src/api/routes/new_feature_sse.py:18-21`
- [ ] **[SECURITY]** Add missing rate limiting to portfolio streaming endpoint in `/src/api/routes/new_feature_sse.py:8-16`
- [ ] **[SECURITY]** Implement authentication validation for all SSE endpoints - currently completely bypassed
- [ ] **[SSE]** Fix missing proper SSE headers (Cache-Control, Connection, CORS) in StreamingResponse
- [ ] **[RESOURCE]** Add connection cleanup and timeout handling to prevent resource leaks

### 🟠 High Priority  
- [ ] **[ARCHITECTURE]** Integrate circuit breaker pattern for LLM service calls (required for Claude API resilience)
- [ ] **[WORKFLOW]** Add workflow correlation IDs using `src/services/correlation_manager.py` patterns
- [ ] **[METRICS]** Connect to existing metrics system (`src/core/cv_extraction/metrics.py`) for monitoring
- [ ] **[ADMIN]** Use proper admin authentication from `src/api/routes/auth.py:require_admin` dependency
- [ ] **[LOGGING]** Implement structured logging with SSELiveLogger from `src/utils/sse_live_logger.py`

### 🟡 Medium Priority
- [ ] **[ERROR]** Add proper error handling with SSE error message patterns from existing implementation
- [ ] **[CLIENT]** Implement client disconnect detection with `request.is_disconnected()` pattern
- [ ] **[PREFIX]** Use proper router prefix pattern matching existing SSE routes (`prefix="/sse"`)
- [ ] **[IMPORTS]** Follow absolute import pattern: `from src.services.rate_limiter import rate_limiter`

### 🟢 Low Priority
- [ ] **[DOCUMENTATION]** Add comprehensive docstrings following project patterns
- [ ] **[TYPING]** Add proper type hints for all function parameters and returns