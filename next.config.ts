import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack is the default in Next.js 16
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ghchart.rshah.org',
      },
    ],
  },
}

export default nextConfig
