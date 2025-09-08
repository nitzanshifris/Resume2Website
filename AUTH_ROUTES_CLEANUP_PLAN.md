# Authentication Routes Cleanup Plan

## Current Problem
Duplicate authentication routes causing conflicts:

### cv.py routes:
- `POST /register` → `/api/v1/register`
- `POST /login` → `/api/v1/login`

### user_auth.py routes:
- `POST /register` → `/api/v1/register` 
- `POST /login` → `/api/v1/login`

**Result**: cv.py routes override user_auth.py routes (cv.py included after user_auth.py in main.py)

## Current Frontend Usage
Frontend uses `/api/v1/register` and `/api/v1/login` (email-auth-form.tsx line 61)

## Recommended Solution

### Phase 1: Quick Fix (Test First!)
1. **Test current functionality** with existing cv.py routes
2. **Move cv.py auth routes to proper prefix** like `/api/v1/cv/auth/` to avoid conflict
3. **Test that user_auth.py routes work** at `/api/v1/register` and `/api/v1/login`
4. **Verify frontend still works**

### Phase 2: Proper Cleanup
1. **Choose canonical implementation**:
   - Keep user_auth.py (more focused, better structure)
   - Remove cv.py auth routes entirely
2. **Update any dependencies** on cv.py auth routes
3. **Clean up imports and unused code**

## Risk Assessment
🔴 **HIGH RISK**: These are actively used by frontend
🟡 **MEDIUM RISK**: Database calls are identical, so behavior should be same

## Testing Checklist
- [ ] Test registration with existing frontend
- [ ] Test login with existing frontend  
- [ ] Test OAuth flows (Google/LinkedIn) from user_auth.py
- [ ] Verify session handling works correctly
- [ ] Check that cv.py endpoints still work with auth

## Implementation Steps

### Step 1: Temporary Route Prefix (Safe)
Move cv.py auth routes to `/cv/auth/` prefix to avoid collision:
```python
# In cv.py, change:
@router.post("/register", ...)  # becomes /api/v1/cv/auth/register
# To:
@router.post("/cv/auth/register", ...)
```

### Step 2: Test user_auth.py Routes
Verify user_auth.py routes work at `/api/v1/register` and `/api/v1/login`

### Step 3: Remove cv.py Auth Routes Entirely
Once confirmed user_auth.py works, remove from cv.py:
- register function (lines ~248-280)
- login function (lines ~282-310)
- Related imports

### Step 4: Verify All Systems
- Frontend auth still works
- CV upload/processing with auth works
- OAuth flows work
- Session management works

## Files to Modify
1. `src/api/routes/cv.py` - Remove duplicate auth routes
2. `main.py` - Verify route order (user_auth.py should come first)
3. Frontend - No changes needed (already uses correct endpoints)

## Rollback Plan
If issues occur:
1. Revert cv.py changes
2. Keep duplicate routes temporarily with different prefixes
3. Investigate deeper issues

---
**Status**: Plan created, ready for implementation
**Risk Level**: Medium (test thoroughly)