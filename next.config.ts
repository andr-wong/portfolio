import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack is the default in Next.js 16
  turbopack: {},

  // Deliberately no Content-Security-Policy here: the pre-paint theme script
  // and the JSON-LD block in app/layout.tsx are both inline <script> tags,
  // and a CSP without 'unsafe-inline' (or per-request nonces, which need
  // middleware) would silently block them — breaking exactly the
  // flash-of-wrong-theme bug this codebase already fixed once. Adding CSP
  // properly is real, separate work; these four have no such interaction
  // and are safe to add outright.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
