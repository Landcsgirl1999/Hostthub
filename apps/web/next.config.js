/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@hostit/ui', '@hostit/db'],
  images: {
    domains: ['localhost', 'hostithub.com', 'www.hostithub.com'],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3003',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 