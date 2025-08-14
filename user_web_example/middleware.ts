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
  
  // Not authenticated - show coming soon page
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Coming Soon</title>
        <meta name="description" content="Coming Soon - A new way to get hired">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/logo.png" type="image/png">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            min-height: 100vh;
            background: linear-gradient(to bottom right, transparent, white, #f9fafb);
            color: #111827;
            position: relative;
            overflow: hidden;
          }
          
          /* Gradient overlay matching hero section */
          body::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, transparent, rgba(16, 185, 129, 0.08) 50%, rgba(56, 189, 248, 0.15));
            pointer-events: none;
          }
          
          body::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, transparent, rgba(37, 99, 235, 0.06) 50%, rgba(16, 185, 129, 0.09));
            pointer-events: none;
          }
          
          @keyframes move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          .container {
            position: relative;
            z-index: 1;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 40px;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
          }
          
          h1 {
            font-size: clamp(32px, 5vw, 60px);
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 24px;
            color: #111827;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
          }
          
          @media (min-width: 768px) {
            h1 {
              font-size: 60px;
            }
          }
          
          .gradient-text {
            background: linear-gradient(to right, #10b981, #38bdf8, #2563eb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
          }
          
          .pdf-text {
            position: relative;
            display: inline-block;
            color: #6b7280;
          }
          
          .pdf-text::after {
            content: '✕';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            color: #ef4444;
            font-size: 80px;
            font-weight: bold;
            animation: crossAnimation 0.6s ease-out 1s forwards;
            z-index: 10;
          }
          
          @keyframes crossAnimation {
            0% {
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1) rotate(360deg);
              opacity: 1;
            }
          }
          
          .subheadline {
            font-size: clamp(18px, 3vw, 24px);
            margin-bottom: 48px;
            color: #6b7280;
            font-weight: 400;
            line-height: 1.5;
          }
          
          .form-container {
            width: 100%;
            max-width: 450px;
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
          }
          
          .email-input {
            flex: 1;
            padding: 16px 20px;
            border: 1px solid #e5e7eb;
            border-radius: 9999px;
            background: white;
            color: #111827;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
          
          .email-input::placeholder {
            color: #9ca3af;
          }
          
          .email-input:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          }
          
          .submit-btn {
            padding: 16px 32px;
            background: linear-gradient(to right, #10b981, #38bdf8, #2563eb);
            border: none;
            border-radius: 9999px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
          }
          
          .submit-btn:hover {
            background: linear-gradient(to right, #059669, #0ea5e9, #1d4ed8);
            transform: scale(1.05);
            box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
          }
          
          .submit-btn:active {
            transform: translateY(0);
          }
          
          .success-message {
            color: #4ade80;
            font-size: 16px;
            display: none;
            animation: fadeIn 0.5s ease;
          }
          
          .success-message.show {
            display: block;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @media (max-width: 640px) {
            .form-container {
              flex-direction: column;
            }
            
            .submit-btn {
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <svg class="logo" width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#2563eb" font-size="28" font-weight="bold" font-family="system-ui">
              R2W
            </text>
          </svg>
          
          <h1>
            There is a new way to get hired,<br/>
            and no, it's not a <span class="pdf-text">PDF resume</span>
          </h1>
          
          <p class="subheadline">
            Be the first to know when we're live and get 
            <span class="gradient-text">40% off</span>
          </p>
          
          <form class="form-container" onsubmit="handleSubmit(event)">
            <input 
              type="email" 
              class="email-input" 
              placeholder="Enter your email"
              required
              id="emailInput"
            >
            <button type="submit" class="submit-btn">
              Get Early Access
            </button>
          </form>
          
          <p class="success-message" id="successMessage">
            🎉 Thank you! We'll notify you when we launch.
          </p>
        </div>
        
        <script>
          function handleSubmit(event) {
            event.preventDefault();
            const email = document.getElementById('emailInput').value;
            const successMsg = document.getElementById('successMessage');
            
            // Here you would normally send the email to your backend
            console.log('Email submitted:', email);
            
            // Show success message
            successMsg.classList.add('show');
            document.getElementById('emailInput').value = '';
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              successMsg.classList.remove('show');
            }, 5000);
          }
        </script>
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