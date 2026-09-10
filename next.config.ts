import type { NextConfig } from 'next'

// script-src allows 'unsafe-inline' rather than hashing or nonce-ing
// specific scripts. Both were tried and rejected:
//  - Hashing app/layout.tsx's two known inline scripts isn't enough — Next
//    itself injects additional inline scripts to bootstrap the RSC payload,
//    with content that varies per build/page, so they can't be hash-pinned.
//  - A per-request nonce (via a proxy.ts, this version's renamed
//    middleware.ts) would cover those, but per the Next.js 16 docs a nonce
//    only works on dynamically-rendered pages — it would force the
//    homepage and case-study pages off static generation, a real
//    performance regression for a site that has no user-controlled content
//    rendered as HTML (React escapes by default; the only
//    dangerouslySetInnerHTML calls are this file's two static, self-authored
//    scripts) to justify the trade against.
// Every other directive below is fully locked down, so this still blocks
// external script/object/frame injection, base-tag hijacking, and
// cross-origin form submission — the actual gap this leaves is inline-script
// isolation specifically, not CSP as a whole.
const CSP = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: https://github.com`,
  `font-src 'self'`,
  `connect-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
].join('; ')

const nextConfig: NextConfig = {
  // Turbopack is the default in Next.js 16
  turbopack: {},

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
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ]
  },
}

export default nextConfig
