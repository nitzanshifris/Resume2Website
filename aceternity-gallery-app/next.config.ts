/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow external images from common sources
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com', 'assets.aceternity.com', 'i.pravatar.cc'],
  },
}

export default nextConfig