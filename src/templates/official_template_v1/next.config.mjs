/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow this Next.js app to be embedded in iframes with proper CORS
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Completely remove CSP restrictions for iframe embedding
          {
            key: 'Content-Security-Policy',
            value: "default-src * data: 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: 'unsafe-inline'; frame-ancestors *; frame-src *;",
          },
          // Remove X-Frame-Options entirely (CSP takes precedence)
          {
            key: 'X-Frame-Options',
            value: '',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

export default nextConfig
