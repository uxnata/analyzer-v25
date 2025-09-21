/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  swcMinify: false,
  experimental: {
    forceSwcTransforms: false,
  },
}

module.exports = nextConfig
