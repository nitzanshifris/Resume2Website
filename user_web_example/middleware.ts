import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if secret key is in URL
  const url = new URL(request.url)
  const secret = url.searchParams.get('key')
  
  // Also check if already authenticated (cookie)
  const authenticated = request.cookies.get('authenticated')
  
  // Your secret key (change this!)
  const SECRET_KEY = 'nitzan-secret-2024'
  
  if (secret === SECRET_KEY) {
    // Set long-lived cookie and allow access
    const response = NextResponse.next()
    response.cookies.set('authenticated', 'true', { 
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true, // More secure
      sameSite: 'lax', // CSRF protection
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      path: '/' // Available site-wide
    })
    // Also set a separate key for tracking the secret was used
    response.cookies.set('auth_key_used', SECRET_KEY, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    })
    return response
  }
  
  if (authenticated?.value === 'true') {
    return NextResponse.next()
  }
  
  // Not authenticated - redirect to coming soon page
  const redirectResponse = NextResponse.redirect(new URL('/coming-soon', request.url))
  // Add cache headers to prevent caching
  redirectResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  redirectResponse.headers.set('Pragma', 'no-cache')
  redirectResponse.headers.set('Expires', '0')
  return redirectResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - coming-soon (coming soon page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|coming-soon).*)',
  ],
}