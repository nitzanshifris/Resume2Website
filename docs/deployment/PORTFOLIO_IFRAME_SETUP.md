# Portfolio Iframe Embedding Setup

## Overview
This guide explains how to properly configure portfolio sites to be embeddable in iframes, specifically for the MacBook display component in Resume2Website.

## Important Security Note
**NEVER use `frame-ancestors *`** - This is a security vulnerability that allows any site to embed your portfolio, leading to clickjacking attacks.

## Correct Implementation

### 1. Custom Domain Setup (Required)

Portfolios MUST be deployed to a custom domain, not `*.vercel.app`, because:
- Vercel platform enforces restrictive headers on `*.vercel.app` domains
- Custom domains allow full control over CSP headers
- You can configure exact parent origins that may embed the portfolio

#### Option A: Wildcard Subdomain (Recommended for Scale)
1. Add wildcard domain in Vercel: `*.portfolios.resume2website.com`
2. Each portfolio gets unique subdomain: `user123.portfolios.resume2website.com`
3. Configure once, works for all portfolios

#### Option B: Single Domain with Paths
1. Use: `portfolio.resume2website.com/abc123`
2. One project, route by path
3. Simpler setup but less scalable

### 2. Configure CSP Headers

Portfolio templates are already configured in `next.config.mjs`:

```javascript
// EXACT parents allowed (dev + prod). Use env to avoid committing domains.
const allowedParents = (process.env.FRAME_PARENTS || 'http://localhost:3019,http://localhost:3000,https://resume2website.com,https://www.resume2website.com')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${allowedParents.join(' ')};` },
          // Do NOT set X-Frame-Options at all; CSP is the control.
        ],
      },
    ];
  },
};
```

### 3. Environment Variables

Set in Vercel Project Settings for portfolio project:

```
FRAME_PARENTS=http://localhost:3019,http://localhost:3000,https://resume2website.com,https://www.resume2website.com
```

Include:
- All development URLs with ports
- Production domain(s)
- Include full scheme (http/https)
- NO wildcards - exact origins only

### 4. Verification

After deployment, verify headers:

```bash
# Check headers
curl -I https://your-portfolio.portfolios.resume2website.com | grep -i "content-security-policy\|x-frame"
```

Expected output:
- `Content-Security-Policy` with exact `frame-ancestors` list
- NO `X-Frame-Options` header

In Chrome DevTools:
1. Network tab → document request
2. Response Headers
3. Verify CSP header with correct parents
4. Confirm no X-Frame-Options

### 5. MacBook Component Usage

In your parent application:

```typescript
<iframe
  src="https://user123.portfolios.resume2website.com"  // Custom domain only
  className="w-full h-full"
  title="Portfolio Preview"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  onLoad={handleLoad}
  onError={handleError}
/>
```

## Troubleshooting

### Portfolio won't load in iframe
1. Check domain is custom, not `*.vercel.app`
2. Verify CSP header includes parent origin
3. Ensure no X-Frame-Options header present
4. Check browser console for CSP violations

### "Refused to frame" errors
- Parent origin not in FRAME_PARENTS env variable
- Using `*.vercel.app` instead of custom domain
- X-Frame-Options header still present (shouldn't be)

### Development vs Production
- Development: `http://localhost:3019` must be in FRAME_PARENTS
- Production: `https://resume2website.com` must be in FRAME_PARENTS
- Include both for seamless dev/prod experience

## Security Best Practices

1. **Explicit Parents Only**: List exact origins, never use wildcards
2. **HTTPS in Production**: Always use HTTPS for production domains
3. **Regular Audits**: Periodically review allowed parents list
4. **Remove Unused Origins**: Clean up old development URLs
5. **No X-Frame-Options**: Use CSP frame-ancestors instead (more flexible)

## Implementation Checklist

- [ ] Custom domain configured in Vercel
- [ ] FRAME_PARENTS env variable set in Vercel
- [ ] Portfolio deploys to custom domain
- [ ] CSP header verified with curl
- [ ] No X-Frame-Options header present
- [ ] Iframe loads successfully in parent app
- [ ] Both dev and prod URLs work

## Notes

- Platform headers on `*.vercel.app` cannot be reliably overridden
- CSP frame-ancestors supersedes X-Frame-Options
- Environment variables avoid hardcoding domains in code
- Custom domains provide full control over security headers