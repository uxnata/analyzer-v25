/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  swcMinify: false,
  experimental: {
    forceSwcTransforms: false,
  },
         // Railway optimizations
         env: {
           RAILWAY_TIMEOUT: '120000',
           NODE_OPTIONS: '--max-old-space-size=2048'
         },
  // API route timeout configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
