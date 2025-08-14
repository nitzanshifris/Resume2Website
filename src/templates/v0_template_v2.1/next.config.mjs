/** @type {import('next').NextConfig} */

// SECURITY: Only allow embedding from trusted origins
// Add your actual production domain here
// EXACT parents that may frame this app:
const allowedParents = [
  'http://localhost:3019',                // your dev parent
  'https://resume2website.com',           // production domain
  'https://www.resume2website.com',       // www version
];

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
          { key: 'Content-Security-Policy', value: `frame-ancestors 'self' ${allowedParents.join(' ')};` },
          // NOTE: do not include X-Frame-Options here at all
        ],
      },
    ]
  }
}

export default nextConfig
