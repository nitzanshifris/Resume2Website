import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Create response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Content Security Policy
  // Modified to allow iframe embedding from any origin
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' fonts.googleapis.com;
    img-src 'self' data: blob: https: http:;
    font-src 'self' fonts.gstatic.com;
    connect-src 'self' fonts.googleapis.com fonts.gstatic.com;
    media-src 'self';
    object-src 'none';
    child-src 'self';
    frame-src *;
    frame-ancestors *;
    base-uri 'self';
    form-action 'self';
    manifest-src 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()

  // Apply security headers
  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  // Remove X-Frame-Options to allow iframe embedding
  response.headers.delete('X-Frame-Options')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Only add HSTS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  return response
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}