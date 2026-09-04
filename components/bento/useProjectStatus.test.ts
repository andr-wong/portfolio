// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProjectStatus } from './useProjectStatus'
import type { StatusResponse } from '@/app/api/status/route'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useProjectStatus', () => {
  it('starts null so server and first client render agree (no hydration mismatch)', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {}))) // never resolves
    const { result } = renderHook(() => useProjectStatus())
    expect(result.current).toBeNull()
  })

  it('fills in from /api/status after mount', async () => {
    const payload: StatusResponse = {
      checkedAt: '2026-01-01T00:00:00.000Z',
      projects: [{ host: 'headcount.andrwong.com', ok: true, ms: 42 }],
    }
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        expect(url).toBe('/api/status')
        return new Response(JSON.stringify(payload), { status: 200 })
      })
    )
    const { result } = renderHook(() => useProjectStatus())
    await waitFor(() => expect(result.current).toEqual(payload))
  })

  it('stays null on a fetch failure instead of throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline')
      })
    )
    const { result } = renderHook(() => useProjectStatus())
    await new Promise((r) => setTimeout(r, 20))
    expect(result.current).toBeNull()
  })
})
