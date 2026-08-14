import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'

const SITE_URL = 'https://andrwong.dev'

function makeRequest(body: unknown, opts?: { referer?: string; ip?: string }) {
  return new NextRequest(`${SITE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      referer: opts?.referer ?? `${SITE_URL}/`,
      'x-forwarded-for': opts?.ip ?? '203.0.113.1',
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL
    process.env.RESEND_API_KEY = 'test-key'
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 200 }))
    )
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('rejects requests from a different origin (CSRF)', async () => {
    const res = await POST(
      makeRequest(
        { name: 'A', email: 'a@b.com', message: 'hi' },
        { referer: 'https://evil.example.com/' }
      )
    )
    expect(res.status).toBe(403)
  })

  it('rejects an invalid email', async () => {
    const res = await POST(
      makeRequest(
        { name: 'A', email: 'not-an-email', message: 'hi' },
        { ip: '203.0.113.2' }
      )
    )
    expect(res.status).toBe(400)
  })

  it('rejects a missing name', async () => {
    const res = await POST(
      makeRequest({ name: '', email: 'a@b.com', message: 'hi' }, { ip: '203.0.113.3' })
    )
    expect(res.status).toBe(400)
  })

  it('rejects a message over the length limit', async () => {
    const res = await POST(
      makeRequest(
        { name: 'A', email: 'a@b.com', message: 'x'.repeat(2001) },
        { ip: '203.0.113.4' }
      )
    )
    expect(res.status).toBe(400)
  })

  it('sends via Resend and returns 200 on a valid request', async () => {
    const res = await POST(
      makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }, { ip: '203.0.113.5' })
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('returns 502 when Resend fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('resend down', { status: 500 }))
    )
    const res = await POST(
      makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }, { ip: '203.0.113.6' })
    )
    expect(res.status).toBe(502)
  })

  it('returns 500 when RESEND_API_KEY is not configured', async () => {
    delete process.env.RESEND_API_KEY
    const res = await POST(
      makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }, { ip: '203.0.113.7' })
    )
    expect(res.status).toBe(500)
  })

  it('rate-limits after 5 requests from the same IP within the window', async () => {
    const ip = '203.0.113.99'
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }, { ip }))
      expect(res.status).toBe(200)
    }
    const sixth = await POST(makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }, { ip }))
    expect(sixth.status).toBe(429)
  })
})
