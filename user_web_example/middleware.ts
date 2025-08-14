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
        <link rel="icon" href="/data/logo/logo.png" type="image/png">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            position: relative;
            overflow: hidden;
          }
          
          /* Animated background effect similar to hero */
          body::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: move 20s linear infinite;
            opacity: 0.3;
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
            font-size: clamp(32px, 5vw, 56px);
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 24px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .gradient-text {
            background: linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
          }
          
          .subheadline {
            font-size: clamp(18px, 3vw, 24px);
            margin-bottom: 48px;
            opacity: 0.95;
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
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 16px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }
          
          .email-input::placeholder {
            color: rgba(255,255,255,0.6);
          }
          
          .email-input:focus {
            outline: none;
            border-color: rgba(255,255,255,0.4);
            background: rgba(255,255,255,0.15);
          }
          
          .submit-btn {
            padding: 16px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }
          
          .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
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
          <img src="/data/logo/logo.png" alt="Resume2Website" class="logo" onerror="this.style.display='none'">
          
          <h1>
            There is a new way to get hired, and no, 
            <span class="gradient-text">it's not a PDF resume</span>
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