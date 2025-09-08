# Common Issues & Solutions - Resume2Website V4

## 🔴 Critical Issues

### 1. CSS Not Loading in Portfolio
**Symptoms**: Generated portfolio has no styles, looks broken
**Cause**: Missing autoprefixer in postcss.config.mjs
**Solution**:
```javascript
// postcss.config.mjs MUST include:
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},  // THIS IS REQUIRED!
  },
};
```
**Prevention**: Always check postcss config when creating templates

### 2. Portfolio Stuck at 55% Progress
**Symptoms**: Generation hangs at "Starting server... 55%"
**Causes**:
1. npm install failed in sandbox
2. Next.js binary not found
3. Server failed to start
**Solutions**:
- Check sandbox npm install output
- Verify node_modules exists in sandbox
- Check for port conflicts (4000-5000)
- Look for error in server startup logs
**Prevention**: Clear .next cache, use npm (not pnpm) in sandboxes

### 3. Authentication Routes Conflict
**Symptoms**: Login/register endpoints give 404 or conflict errors
**Cause**: Duplicate routes in cv.py and user_auth.py
**Solution**: Use ONLY user_auth.py for auth routes
**Prevention**: Never add auth routes to cv.py

### 4. CV Extraction Hangs or Fails
**Symptoms**: Upload succeeds but extraction never completes
**Causes**:
1. Claude API key invalid/expired
2. Circuit breaker triggered
3. Network timeout
**Solutions**:
```bash
# Check API key
python3 src/utils/setup_keychain.py

# Check circuit breaker status
curl http://localhost:2000/api/v1/metrics/circuit-breaker/status

# Reset if needed (admin only)
curl -X POST http://localhost:2000/api/v1/metrics/circuit-breaker/reset
```
**Prevention**: Monitor API quotas, implement proper error handling

## 🟠 Common Development Issues

### 5. TypeScript Errors in Frontend
**Symptoms**: `pnpm run typecheck` fails
**Common Causes**:
1. Using function declarations instead of arrow functions
2. Missing type annotations
3. Using require() instead of import
**Solution Examples**:
```typescript
// ❌ Wrong
function Component() { }
const data = require('./data')

// ✅ Correct
export const Component: React.FC = () => { }
import { data } from './data'
```

### 6. Double CV Upload on Retry
**Symptoms**: Same file uploads twice when retrying after error
**Cause**: Missing file fingerprint validation
**Solution**: Check for existing upload using file hash
```typescript
const fingerprint = `${file.name}-${file.size}-${file.lastModified}`
if (uploadedFiles.has(fingerprint)) return
```

### 7. Vercel Deployment Hangs
**Symptoms**: Deployment stuck, no progress
**Causes**:
1. Build running in background
2. API token expired
3. Project not configured
**Debug**:
```bash
# Check for running Vercel processes
ps aux | grep vercel

# Kill if stuck
pkill -f vercel

# Verify token
vercel whoami
```

### 8. Database Locked Error
**Symptoms**: "database is locked" SQLite error
**Cause**: Multiple processes accessing database
**Solutions**:
1. Ensure single FastAPI instance
2. Use connection pooling
3. Add retry logic with backoff
**Quick Fix**:
```bash
# Restart backend
lsof -ti:2000 | xargs kill
python3 main.py
```

## 🟡 Configuration Issues

### 9. Wrong Template Referenced
**Symptoms**: Portfolio uses old template, missing features
**Cause**: Code references old templates (v0_template_v1.5 or v0_template_v2.1)
**Solution**: Update all references to `official_template_v1`
**Check**:
```bash
grep -r "v0_template" src/
# Should return nothing
```

### 10. Port Already in Use
**Symptoms**: "address already in use" error
**Common Ports**:
- 2000: Backend
- 3019: Frontend
- 4000-5000: Portfolio previews
**Solutions**:
```bash
# Find process using port
lsof -i :2000

# Kill process
kill -9 <PID>

# Or kill all on port
lsof -ti:2000 | xargs kill
```

### 11. Module Not Found Errors
**Symptoms**: Cannot find module 'X'
**Causes**:
1. Dependencies not installed
2. Wrong package manager used
3. Corrupted node_modules
**Solutions**:
```bash
# Main project (use pnpm)
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Sandboxes (use npm)
rm -rf node_modules package-lock.json
npm install
```

## 🟢 Minor/Cosmetic Issues

### 12. Resume Gate Too Strict/Lenient
**Symptoms**: Valid CVs rejected or invalid ones accepted
**Solution**: Adjust threshold in settings
```python
# src/utils/cv_resume_gate.py
RESUME_GATE_THRESHOLD = 60  # Default, adjust as needed
IMAGE_THRESHOLD = 80  # Stricter for images
```

### 13. File Upload Size Limit
**Symptoms**: Large files rejected
**Solution**: Update config.py
```python
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB default
# Increase if needed, but consider resource implications
```

### 14. Session Expiry Too Short
**Symptoms**: Users logged out frequently
**Solution**: Update SESSION_EXPIRY_DAYS in config
```python
SESSION_EXPIRY_DAYS = 7  # Default
```

## 🔧 Development Environment Issues

### 15. Python Virtual Environment Not Active
**Symptoms**: Import errors, wrong Python version
**Solution**:
```bash
source venv/bin/activate
which python  # Should show venv path
```

### 16. Git Branch Issues
**Symptoms**: Working on wrong branch
**Prevention**:
```bash
# Always check branch first
git branch --show-current

# Create feature branch
git checkout -b feature/your-feature

# Never work on main!
```

### 17. API Key Not Found
**Symptoms**: "API key not configured" errors
**Solution**:
```bash
# Setup keychain
python3 src/utils/setup_keychain.py

# Or use .env file (development only)
echo "CV_CLAUDE_API_KEY=your-key" >> .env
```

## 📊 Performance Issues

### 18. Slow CV Extraction
**Symptoms**: Extraction takes >2 minutes
**Causes**:
1. Large file size
2. Complex CV structure
3. API rate limiting
**Solutions**:
- Implement progress indicators
- Cache extraction results
- Optimize prompt for faster processing

### 19. Memory Leaks in Portfolios
**Symptoms**: Node processes consuming excessive memory
**Solution**: Enforce resource limits
```javascript
// In portfolio start script
NODE_OPTIONS="--max-old-space-size=512"
```

### 20. Too Many Open Files
**Symptoms**: "EMFILE: too many open files" error
**Solution**:
```bash
# Increase limit (Mac)
ulimit -n 10000

# Check current limit
ulimit -n
```

## 🚨 Emergency Fixes

### Quick Recovery Commands
```bash
# Full reset (keeps data)
.claude/commands/maintenance/cleanup.sh
rm -rf sandboxes/*
pkill -f node
pkill -f python

# Restart services
source venv/bin/activate
python3 main.py &
pnpm run dev

# Check health
curl http://localhost:2000/health
curl http://localhost:3019/api/health
```

### Database Recovery
```bash
# Backup database
cp data/resume2website.db data/backup_$(date +%Y%m%d).db

# Clear cache only
python3 scripts/utilities/clear_cv_cache.py

# Force re-extraction
python3 scripts/utilities/force_reextraction.py
```

## 📝 Prevention Checklist

Before commits:
- [ ] Run `pnpm run typecheck`
- [ ] Check current git branch
- [ ] Verify no hardcoded API keys
- [ ] Test with both authenticated and anonymous flows
- [ ] Check for console.log statements
- [ ] Verify template references are correct

Before deployment:
- [ ] All tests passing
- [ ] Circuit breaker status healthy
- [ ] Resource limits configured
- [ ] Environment variables set
- [ ] Database backed up

---

*Last Updated: 2025-01-08*
*Purpose: Quick reference for troubleshooting*
*Note: Add new issues as they're discovered and solved*