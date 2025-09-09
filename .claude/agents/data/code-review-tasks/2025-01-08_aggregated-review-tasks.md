# Resume2Website V4 - Code Review Task List

## Review Summary
Comprehensive code reviews have identified critical security vulnerabilities, architectural violations, UI/UX issues, and code quality problems that need immediate attention.

## Key Issues Found
### Security & Architecture (from SSE Review)
- Multiple critical security vulnerabilities in SSE endpoints
- Missing rate limiting and connection management
- Admin endpoint without proper authentication
- No workflow correlation or metrics integration
- Missing circuit breaker pattern for LLM service calls

### UI/UX & Code Quality (from August 2024 Review - STILL UNRESOLVED)
- MacBook container: Portfolio doesn't properly replace iframe content
- Video carousel persists after portfolio generation (should disappear)
- Legacy animation code marked "TODO: Remove" still present
- Main page.tsx file is 3750+ lines (needs refactoring)
- State persistence incomplete for `hasCompletedGeneration`
- Complex conditional rendering for three-button layout
- Popup timing logic overly complicated

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

---

## Authentication Middleware Review - middleware/auth.py

### 🔴 Critical Priority
- [ ] **[SECURITY]** Replace trivial token check with proper session-based authentication using `src/api/db.py:get_current_user`
- [ ] **[SECURITY]** Add token signature verification and expiration checks - current implementation accepts ANY token
- [ ] **[SECURITY]** Missing authentication integration with existing `src/api/routes/user_auth.py` system
- [ ] **[SECURITY]** No SQL injection protection or input sanitization for token parameter
- [ ] **[SECURITY]** Add rate limiting for authentication attempts using `src/services/rate_limiter.py`

### 🟠 High Priority
- [ ] **[ARCHITECTURE]** Integrate with existing FastAPI dependency injection system instead of raw request handling
- [ ] **[ADMIN]** Add admin role verification for protected endpoints using `require_admin` dependency
- [ ] **[SESSION]** Implement proper session management with database lookup and expiration
- [ ] **[LOGGING]** Add authentication attempt logging for security monitoring

### 🟡 Medium Priority
- [ ] **[ERROR]** Add proper error responses with structured messages instead of boolean returns
- [ ] **[TYPING]** Add proper type hints: `async def check_auth(request: Request) -> AuthResult:`
- [ ] **[HEADERS]** Support multiple authentication methods (session cookies, API keys via keychain)

---

## React Component Review - portfolio-header.tsx

### 🔴 Critical Priority
- [ ] **[TYPESCRIPT]** Fix component declaration - must use arrow function pattern: `export const PortfolioHeader: React.FC<Props> = () => {}`
- [ ] **[TYPESCRIPT]** Add proper TypeScript interface for props instead of implicit any type
- [ ] **[EXPORTS]** Change from default export to named export pattern as required by project standards
- [ ] **[IMPORTS]** Fix absolute import path - components should import from 'src/' structure

### 🟠 High Priority
- [ ] **[REACT]** Fix useEffect missing dependency array - causes infinite re-renders and performance issues
- [ ] **[NEXTJS]** Replace direct document.title manipulation with Next.js Head component for proper SSR
- [ ] **[ACCESSIBILITY]** Add proper ARIA labels and semantic HTML structure for portfolio header
- [ ] **[STATE]** Theme state management should integrate with existing theme system if available

### 🟡 Medium Priority
- [ ] **[STYLING]** Replace generic className="header" with Tailwind CSS classes following project patterns
- [ ] **[UX]** Theme toggle button needs proper styling and state indication (light/dark icon)
- [ ] **[PROPS]** Add prop validation and default values for better component reliability
- [ ] **[UI/UX]** Fix MacBook container - portfolio should replace full iframe content in `user_web_example/app/page.tsx`
- [ ] **[UI/UX]** Remove video carousel after portfolio generation completes in `user_web_example/app/page.tsx`
- [ ] **[CODE QUALITY]** Remove legacy animation code marked "TODO: Remove" in `user_web_example/app/page.tsx`
- [ ] **[REFACTOR]** Break down page.tsx (3750+ lines) into smaller components
- [ ] **[STATE]** Complete state persistence for `hasCompletedGeneration` to localStorage
- [ ] **[UI/UX]** Simplify three-button layout conditional rendering after portfolio completion
- [ ] **[UI/UX]** Simplify popup timing logic for 80% completion trigger

### 🟢 Low Priority
- [ ] **[DOCUMENTATION]** Add JSDoc comments explaining component purpose and props
- [ ] **[TESTING]** Component needs unit tests following project testing patterns