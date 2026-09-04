import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET, type StatusResponse } from './route'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('GET /api/status', () => {
  it('reports ok:true with a timing for a reachable target', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 200 }))
    )
    const res = await GET()
    const body = (await res.json()) as StatusResponse
    expect(body.projects).toHaveLength(2)
    for (const check of body.projects) {
      expect(check.ok).toBe(true)
      expect(check.ms).not.toBeNull()
    }
    expect(new Date(body.checkedAt).toString()).not.toBe('Invalid Date')
  })

  it('reports ok:false with ms:null when a target throws (network error, timeout, abort)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network error')
      })
    )
    const res = await GET()
    const body = (await res.json()) as StatusResponse
    for (const check of body.projects) {
      expect(check.ok).toBe(false)
      expect(check.ms).toBeNull()
    }
  })

  it('reports ok:false for a non-2xx response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 500 }))
    )
    const res = await GET()
    const body = (await res.json()) as StatusResponse
    for (const check of body.projects) {
      expect(check.ok).toBe(false)
    }
  })

  it('checks each target independently — one failing does not affect the other', async () => {
    let call = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        call += 1
        if (call === 1) throw new Error('down')
        return new Response(null, { status: 200 })
      })
    )
    const res = await GET()
    const body = (await res.json()) as StatusResponse
    expect(body.projects.map((c) => c.ok)).toEqual([false, true])
  })
})
