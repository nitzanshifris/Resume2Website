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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' fonts.gstatic.com",
              "connect-src 'self' http://localhost:2000 http://127.0.0.1:2000 https://*.ngrok-free.app https://*.ngrok.app https://*.ngrok.io fonts.googleapis.com fonts.gstatic.com",
              "media-src 'self'",
              "object-src 'none'",
              "child-src 'self'",
              "frame-src * blob:", // Allow all frame sources including blob URLs
              "frame-ancestors *", // Critical: Allow iframe embedding from any origin
              "base-uri 'self'",
              "form-action 'self'",
              "manifest-src 'self'",
              "upgrade-insecure-requests"
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // Allow iframe embedding
          },
        ],
      },
    ];
  },
}

export default nextConfig
