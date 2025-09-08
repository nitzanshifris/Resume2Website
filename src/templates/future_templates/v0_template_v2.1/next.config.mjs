/** @type {import('next').NextConfig} */

// EXACT parents allowed (dev + prod). Use env to avoid committing domains.
const allowedParents = (process.env.FRAME_PARENTS || 'http://localhost:3019,http://localhost:3000,https://resume2website.com,https://www.resume2website.com')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

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
  // Let middleware set headers; avoid double headers in Next config
}

export default nextConfig
