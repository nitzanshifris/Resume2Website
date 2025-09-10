# Google Authentication Portfolio 404 Error Analysis

## Executive Summary
The 404 error on `/api/v1/portfolio/list` after successful Google authentication is caused by an incorrect API endpoint path in the frontend code. The frontend is calling `/api/v1/portfolio/list` but the actual endpoint is `/api/v1/generation/list`.

## Root Cause Analysis

### 1. Authentication Flow (Working Correctly ✅)
- Google OAuth authentication completes successfully
- User session is properly established (user_id: 9aa6841b-9ade-4d4b-90f0-8dbd902b560d)
- Session ID is correctly passed in subsequent requests

### 2. Routing Configuration Issue (Root Cause ❌)

#### Backend Route Mount Points (main.py)
```python
# Line 55 in main.py
app.include_router(portfolio_generator.router, prefix="/api/v1/generation")
```

The portfolio_generator router is mounted at `/api/v1/generation`, NOT `/api/v1/portfolio`.

#### Actual Endpoint Location
```python
# Line 1157 in src/api/routes/portfolio_generator.py
@router.get("/list")
async def list_user_portfolios(current_user_id: str = Depends(get_current_user)):
```

This creates the endpoint at: `/api/v1/generation/list`

#### Frontend Incorrect Calls
Two locations in the frontend are using the wrong endpoint:

1. **app/page.tsx (Line 947)**:
```typescript
const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/list`, {
```

2. **lib/api.ts (Line 424)**:
```typescript
return apiRequest('/api/v1/portfolio/list', {
```

## Complete Endpoint Mapping

### Portfolio Generator Endpoints (All under /api/v1/generation/)
- `POST /api/v1/generation/generate/{job_id}` - Generate portfolio
- `GET /api/v1/generation/list` - List user portfolios ⚠️ (NOT /api/v1/portfolio/list)
- `POST /api/v1/generation/{portfolio_id}/deploy` - Deploy to Vercel
- `POST /api/v1/generation/{portfolio_id}/restart` - Restart portfolio
- `GET /api/v1/generation/{portfolio_id}/status` - Get portfolio status
- `PUT /api/v1/generation/{portfolio_id}/cv-data` - Update CV data
- `GET /api/v1/generation/{portfolio_id}/cv-data` - Get CV data
- `DELETE /api/v1/generation/{portfolio_id}` - Delete portfolio
- `GET /api/v1/generation/portfolios/metrics` - Get portfolio metrics
- `POST /api/v1/generation/{portfolio_id}/setup-custom-domain` - Setup custom domain

## Applied Fixes ✅

### Fix 1: Update app/page.tsx (Line 947)
```typescript
// Changed from:
const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/list`, {
// To:
const response = await fetch(`${API_BASE_URL}/api/v1/generation/list`, {
```

### Fix 2: Update app/page.tsx (Line 877)
```typescript
// Changed from:
const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${urlPortfolioId}/status`)
// To:
const response = await fetch(`${API_BASE_URL}/api/v1/generation/${urlPortfolioId}/status`)
```

### Fix 3: Update lib/api.ts (Line 424)
```typescript
// Changed from:
return apiRequest('/api/v1/portfolio/list', {
// To:
return apiRequest('/api/v1/generation/list', {
```

### Fix 4: Update lib/api.ts (Line 437)
```typescript
// Changed from:
return apiRequest(`/api/v1/portfolio/${portfolioId}`, {
// To:
return apiRequest(`/api/v1/generation/${portfolioId}`, {
```

### Fix 5: Update lib/jobFlow/api.ts (Line 340)
```typescript
// Changed from:
const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/generate/${jobId}`, {
// To:
const response = await fetch(`${API_BASE_URL}/api/v1/generation/generate/${jobId}`, {
```

### Fix 6: Update components/processing-page.tsx (Line 180)
```typescript
// Changed from:
const generateUrl = `${API_BASE_URL}/api/v1/portfolio/generate/${activeJobId}`
// To:
const generateUrl = `${API_BASE_URL}/api/v1/generation/generate/${activeJobId}`
```

## Summary of All Fixes
All incorrect references to `/api/v1/portfolio/*` have been updated to `/api/v1/generation/*` across 6 locations in 4 files.

## Additional Findings

### 1. No Legacy Portfolio Route
- The commented line in main.py (line 16) suggests there was an archived portfolio route
- This has been completely replaced by portfolio_generator
- No `/api/v1/portfolio/*` endpoints exist anymore

### 2. Authentication Working Correctly
- Google OAuth flow is functioning properly
- Session management is correct
- The 404 error occurs AFTER successful authentication
- Session ID is being passed correctly in headers

### 3. Other Portfolio-Related API Calls
All other portfolio-related API calls in the frontend should be verified to use `/api/v1/generation/` prefix:
- Generate: `/api/v1/generation/generate/{job_id}`
- Deploy: `/api/v1/generation/{portfolio_id}/deploy`
- Delete: `/api/v1/generation/{portfolio_id}`
- Status: `/api/v1/generation/{portfolio_id}/status`

## Impact Assessment
- **Severity**: High - Prevents portfolio restoration after authentication
- **Affected Users**: All users logging in via Google OAuth (and likely regular login too)
- **Affected Features**: Portfolio list retrieval, portfolio restoration on login

## Testing Recommendations
After applying the fixes:
1. Test Google OAuth login flow
2. Verify portfolio list loads correctly
3. Test portfolio restoration after page refresh
4. Check other portfolio operations (generate, deploy, delete)
5. Test with both authenticated and anonymous users

## Prevention Measures
1. Consider creating API endpoint constants in a shared configuration file
2. Add integration tests for authentication → portfolio list flow
3. Document the correct API endpoints in the frontend codebase
4. Consider adding a redirect from old endpoints to new ones for backwards compatibility

---
*Analysis completed: 2025-09-09*
*Issue: 404 error on /api/v1/portfolio/list after Google authentication*
*Root Cause: Frontend using incorrect endpoint path (should be /api/v1/generation/list)*