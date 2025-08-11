# Google OAuth Setup Instructions

## 1. Google Cloud Console Setup

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API (for user profile access)

2. **Configure OAuth Consent Screen**:
   - Go to APIs & Services → OAuth consent screen
   - Choose "External" user type
   - Fill in required fields:
     - App name: "RESUME2WEBSITE"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in testing mode

3. **Create OAuth 2.0 Credentials**:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "RESUME2WEBSITE Frontend"
   - Authorized redirect URIs:
     - `http://localhost:3019/auth/google/callback` (development)
     - `https://yourdomain.com/auth/google/callback` (production)

## 2. Environment Configuration

1. **Frontend (.env.local)**:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   NEXT_PUBLIC_API_URL=http://localhost:2000
   ```

2. **Backend Environment Variables**:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

## 3. Backend Implementation Required

The backend needs to implement the Google OAuth callback endpoint:

```python
# Example FastAPI endpoint
@app.post("/api/v1/auth/google/callback")
async def google_auth_callback(request: GoogleAuthRequest):
    # Exchange authorization code for tokens
    # Get user info from Google
    # Create/update user in database
    # Return session_id and user data
    pass
```

## 4. Testing

1. **Development Testing**:
   - Ensure frontend runs on `http://localhost:3019`
   - Ensure backend runs on `http://localhost:2000`
   - Test Google login flow

2. **Production Deployment**:
   - Update redirect URIs in Google Cloud Console
   - Update environment variables for production URLs
   - Test complete authentication flow

## 5. Security Considerations

- Never expose `GOOGLE_CLIENT_SECRET` in frontend code
- Use HTTPS in production
- Validate `state` parameter to prevent CSRF attacks
- Implement proper session management
- Handle token refresh if needed

## 6. Troubleshooting

Common issues:
- **"redirect_uri_mismatch"**: Check authorized redirect URIs in Google Cloud Console
- **"invalid_client"**: Verify client ID configuration
- **CORS errors**: Ensure backend allows frontend origin
- **Token exchange fails**: Check client secret in backend

## Implementation Status

✅ Frontend Google OAuth flow implemented
✅ Callback page created
✅ Environment variables configured
⚠️ Backend Google OAuth endpoint needs implementation
⚠️ Google Cloud Console setup required