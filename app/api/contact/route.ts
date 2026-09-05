import { type NextRequest, NextResponse } from 'next/server'
import { BENTO } from '@/components/bento/data'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE_LENGTH = 2000
const MAX_NAME_LENGTH = 200
const MAX_EMAIL_LENGTH = 320 // RFC 5321 upper bound

// Same fallback used by app/layout.tsx, app/sitemap.ts, and app/robots.ts —
// keeping this one in sync matters more than the others: if
// NEXT_PUBLIC_SITE_URL is ever unset in production, this must not return
// falsy, or the CSRF check below silently stops checking anything. Read
// per-request rather than hoisted to module scope, matching every other env
// read in this file, so it reflects the environment at call time.
function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.com'
}

// Simple in-memory rate limiter (resets on deploy/cold start)
const requestCounts = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = requestCounts.get(ip)

  if (!entry || entry.resetAt < now) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count++
  return false
}

interface ContactBody {
  name: unknown
  email: unknown
  message: unknown
}

export async function POST(req: NextRequest) {
  // CSRF: check referer matches our origin
  const referer = req.headers.get('referer') ?? ''
  if (!referer.startsWith(getSiteUrl())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Rate limit by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
      { status: 429 }
    )
  }

  let body: ContactBody
  try {
    body = await req.json() as ContactBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, message } = body

  if (typeof name !== 'string' || name.trim().length < 1) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Name must be under ${MAX_NAME_LENGTH} characters` },
      { status: 400 }
    )
  }
  if (typeof email !== 'string' || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: 'A valid email address is required' },
      { status: 400 }
    )
  }
  if (typeof message !== 'string' || message.trim().length < 1) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 }
    )
  }

  // Send via Resend
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured')
    return NextResponse.json(
      { error: 'Server configuration error. Please email directly.' },
      { status: 500 }
    )
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio Contact <contact@andrwong.com>',
      // The real destination, not a second hardcoded literal — this was
      // previously 'andrew@andrwong.dev', a domain with no DNS records at
      // all (confirmed via dig: NXDOMAIN), so every successful-looking send
      // was actually bouncing. Every other contact surface on the site
      // already uses BENTO.contact.email; this one just hadn't been wired
      // to the same source of truth.
      to: [BENTO.contact.email],
      subject: `Portfolio contact from ${name.trim()}`,
      text: `Name: ${name.trim()}\nEmail: ${email}\n\n${message.trim()}`,
    }),
  })

  if (!res.ok) {
    console.error('Resend error:', res.status, await res.text())
    return NextResponse.json(
      { error: 'Failed to send. Please try again.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
