# Resume2Website V4 - API Usage Standards & Best Practices

## ⚠️ CRITICAL: How to Correctly Call Our APIs

This document defines the **ONLY CORRECT WAY** to interact with Resume2Website V4 APIs based on extensive testing and error analysis. Following these patterns will prevent 422 Unprocessable Entity errors and other common issues.

## 🔴 THE GOLDEN RULE: File-Based JSON for All POST Requests

**NEVER** use inline JSON in curl commands. **ALWAYS** use file-based input to avoid JSON escaping issues.

### ❌ WRONG - Will cause 422 errors:
```bash
# These ALL fail with 422 Unprocessable Entity:
curl -X POST http://localhost:2000/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!"}'

curl -X POST http://localhost:2000/api/v1/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"test@example.com\", \"password\": \"Test123!\"}"
```

### ✅ CORRECT - The ONLY way that works:
```bash
# Step 1: Create JSON file
cat > /tmp/request.json << 'EOF'
{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User"
}
EOF

# Step 2: Use file in request
curl -X POST http://localhost:2000/api/v1/register \
  -H "Content-Type: application/json" \
  -d @/tmp/request.json
```

## 📋 Complete API Call Patterns

### 1. User Registration
```bash
cat > /tmp/register.json << 'EOF'
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
EOF

curl -s -X POST http://localhost:2000/api/v1/register \
  -H "Content-Type: application/json" \
  -d @/tmp/register.json | jq '.'
```

### 2. User Login (Get Session)
```bash
cat > /tmp/login.json << 'EOF'
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
EOF

# Login and save session
SESSION_ID=$(curl -s -X POST http://localhost:2000/api/v1/login \
  -H "Content-Type: application/json" \
  -d @/tmp/login.json | jq -r '.session_id')

echo "Session ID: $SESSION_ID"
```

### 3. Authenticated Requests (Using Session)
```bash
# Use session in Cookie header
curl -s http://localhost:2000/api/v1/auth/me \
  -H "Cookie: session_id=$SESSION_ID" | jq '.'
```

### 4. File Uploads (Multipart)
```bash
# Anonymous upload (no session needed)
curl -s -X POST http://localhost:2000/api/v1/upload-anonymous \
  -F "file=@path/to/cv.pdf" | jq '.'

# Authenticated upload (requires session)
curl -s -X POST http://localhost:2000/api/v1/upload \
  -H "Cookie: session_id=$SESSION_ID" \
  -F "file=@path/to/cv.pdf" | jq '.'
```

### 5. CV Extraction
```bash
# Extract CV data (requires authentication)
JOB_ID="your-job-id-here"
curl -s -X POST http://localhost:2000/api/v1/extract/$JOB_ID \
  -H "Cookie: session_id=$SESSION_ID" | jq '.'
```

### 6. Portfolio Generation
```bash
cat > /tmp/portfolio.json << 'EOF'
{
  "template": "official_template_v1"
}
EOF

curl -s -X POST http://localhost:2000/api/v1/generation/generate/$JOB_ID \
  -H "Cookie: session_id=$SESSION_ID" \
  -H "Content-Type: application/json" \
  -d @/tmp/portfolio.json | jq '.'
```

### 7. Payment Processing
```bash
cat > /tmp/checkout.json << 'EOF'
{
  "product_type": "monthly",
  "success_url": "http://localhost:3019/payment-success",
  "cancel_url": "http://localhost:3019/payment-cancel"
}
EOF

curl -s -X POST http://localhost:2000/api/v1/payments/create-checkout-session \
  -H "Cookie: session_id=$SESSION_ID" \
  -H "Content-Type: application/json" \
  -d @/tmp/checkout.json | jq '.'
```

## 🔐 Authentication Patterns

### Session Management Rules:
1. **Get session from login**: Extract `session_id` from login response
2. **Use Cookie header**: `Cookie: session_id=<session_value>`
3. **Session duration**: Valid for 7 days
4. **Required for**: Most endpoints except anonymous upload and public endpoints

### Endpoints That DON'T Require Authentication:
- `GET /health`
- `GET /api/v1/metrics/health`
- `POST /api/v1/register`
- `POST /api/v1/login`
- `POST /api/v1/upload-anonymous`
- `GET /api/v1/sse/heartbeat`
- `GET /api/v1/workflows/test`

### Endpoints That REQUIRE Authentication:
- All `/api/v1/cv/*` endpoints (except upload-anonymous)
- All `/api/v1/generation/*` endpoints
- All `/api/v1/payments/*` endpoints
- `GET /api/v1/auth/me`
- Most SSE endpoints

## 🚀 Complete Flow Example

```bash
# 1. Register user
cat > /tmp/user.json << 'EOF'
{
  "email": "newuser@example.com",
  "password": "MyPass123!",
  "name": "New User"
}
EOF
curl -s -X POST http://localhost:2000/api/v1/register \
  -H "Content-Type: application/json" \
  -d @/tmp/user.json | jq '.'

# 2. Login and get session
cat > /tmp/login.json << 'EOF'
{
  "email": "newuser@example.com",
  "password": "MyPass123!"
}
EOF
SESSION_ID=$(curl -s -X POST http://localhost:2000/api/v1/login \
  -H "Content-Type: application/json" \
  -d @/tmp/login.json | jq -r '.session_id')

# 3. Upload CV
curl -s -X POST http://localhost:2000/api/v1/upload \
  -H "Cookie: session_id=$SESSION_ID" \
  -F "file=@data/cv_examples/sample.pdf" | jq '.'

# 4. Generate portfolio
JOB_ID="<job_id_from_upload>"
cat > /tmp/portfolio.json << 'EOF'
{
  "template": "official_template_v1"
}
EOF
curl -s -X POST http://localhost:2000/api/v1/generation/generate/$JOB_ID \
  -H "Cookie: session_id=$SESSION_ID" \
  -H "Content-Type: application/json" \
  -d @/tmp/portfolio.json | jq '.'
```

## ⚠️ Common Errors and Solutions

### Error: 422 Unprocessable Entity
**Cause**: Inline JSON with improper escaping
**Solution**: ALWAYS use file-based JSON input

### Error: 401 Unauthorized / "Session ID required"
**Cause**: Missing or invalid session
**Solution**: Login first and use `Cookie: session_id=<value>` header

### Error: 404 Not Found
**Cause**: Wrong endpoint path (check routing changes)
**Solution**: Use correct paths (e.g., `/api/v1/generation/*` not `/api/v1/portfolio/*`)

### Error: JSON decode error with "Invalid \\escape"
**Cause**: Shell escaping issues with inline JSON
**Solution**: Use heredoc with 'EOF' (single quotes) to prevent escaping

## 📝 For AI Agents and Automation

When building agents or automation scripts:

1. **ALWAYS create temporary JSON files** for request bodies
2. **Use heredocs with 'EOF' in single quotes** to prevent variable expansion
3. **Store session IDs in variables** for reuse across requests
4. **Check response codes** before parsing JSON
5. **Use jq for JSON parsing** to handle errors gracefully
6. **Test endpoints in order**: health → register → login → operations

## 🎯 Testing Checklist

Before declaring an API integration complete, verify:

- [ ] All POST requests use file-based JSON
- [ ] Session management works correctly
- [ ] Error responses are handled gracefully
- [ ] File uploads work with multipart/form-data
- [ ] Streaming endpoints return SSE format
- [ ] Rate limiting is respected

## 📊 Route Reference (After Refactoring)

All routes now use centralized prefix management:

| Service | Base Path | Example Endpoint |
|---------|-----------|------------------|
| Auth | `/api/v1/` | `/api/v1/register` |
| CV | `/api/v1/` | `/api/v1/upload` |
| Generation | `/api/v1/generation/` | `/api/v1/generation/generate/{job_id}` |
| Payments | `/api/v1/payments/` | `/api/v1/payments/create-checkout-session` |
| SSE | `/api/v1/sse/` | `/api/v1/sse/heartbeat` |
| Workflows | `/api/v1/workflows/` | `/api/v1/workflows/test` |
| Metrics | `/api/v1/metrics/` | `/api/v1/metrics/health` |
| CV Enhanced | `/api/v1/cv-enhanced/` | `/api/v1/cv-enhanced/upload` |

---

**Last Updated**: 2025-09-09
**Version**: 1.0
**Status**: MANDATORY - All API calls must follow these patterns