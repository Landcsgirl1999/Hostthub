/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@hostit/ui', '@hostit/db'],
  images: {
    domains: ['localhost'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3003',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
}

module.exports = nextConfig 