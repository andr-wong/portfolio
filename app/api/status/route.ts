import { NextResponse } from 'next/server'

// Regenerated at most this often — the deployed live sites don't need
// checking on every single portfolio pageview, and this keeps the route
// itself cacheable rather than doing a real network round-trip per visitor.
export const revalidate = 300

export interface ProjectCheck {
  host: string
  ok: boolean
  ms: number | null
}

export interface StatusResponse {
  checkedAt: string
  projects: ProjectCheck[]
}

const TARGETS: readonly { host: string; url: string }[] = [
  { host: 'mapster.city', url: 'https://mapster.city' },
  { host: 'headcount.andrwong.com', url: 'https://headcount.andrwong.com' },
]

const TIMEOUT_MS = 5000

async function checkOne(url: string): Promise<{ ok: boolean; ms: number | null }> {
  const start = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    // GET, not HEAD: some of these are small serverless/edge-hosted apps
    // that don't implement HEAD correctly, which would read as a false
    // "down". The body is never consumed, only the status is read.
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      cache: 'no-store',
    })
    return { ok: res.ok, ms: Date.now() - start }
  } catch {
    return { ok: false, ms: null }
  } finally {
    clearTimeout(timeout)
  }
}

export async function GET() {
  const projects = await Promise.all(
    TARGETS.map(async (t) => {
      const { ok, ms } = await checkOne(t.url)
      const check: ProjectCheck = { host: t.host, ok, ms }
      return check
    })
  )
  const body: StatusResponse = { checkedAt: new Date().toISOString(), projects }
  return NextResponse.json(body)
}
