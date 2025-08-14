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
    // Set cookie and allow access
    const response = NextResponse.next()
    response.cookies.set('authenticated', 'true', { 
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return response
  }
  
  if (authenticated?.value === 'true') {
    return NextResponse.next()
  }
  
  // Not authenticated - show access denied
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Access Restricted</title>
        <style>
          body {
            font-family: system-ui;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #0A0A0A;
            color: white;
          }
          .container {
            text-align: center;
          }
          h1 {
            font-size: 48px;
            margin-bottom: 16px;
          }
          p {
            color: #888;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🔒</h1>
          <h1>Coming Soon</h1>
          <p>This site is under development</p>
        </div>
      </body>
    </html>
    `,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  )
}

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