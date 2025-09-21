/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  swcMinify: false,
  compiler: {
    // Отключаем SWC полностью
    removeConsole: false,
  },
  experimental: {
    forceSwcTransforms: false,
  },
}

module.exports = nextConfig
