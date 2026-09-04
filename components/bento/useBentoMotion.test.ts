// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBentoMotion } from './useBentoMotion'
import type { StatItem } from './data'

const STATS: StatItem[] = [{ n: 7, suffix: '', cap: 'projects shipped' }]

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useBentoMotion', () => {
  it('jumps straight to final values when prefers-reduced-motion is set', () => {
    stubReducedMotion(true)
    const { result } = renderHook(() => useBentoMotion(STATS))
    // No animation frames or intervals needed — the reduced-motion branch
    // sets the final value synchronously inside the effect.
    expect(result.current.counts).toEqual([7])
  })

  it('animates from zero when motion is not reduced', async () => {
    stubReducedMotion(false)
    const { result } = renderHook(() => useBentoMotion(STATS, 200))
    expect(result.current.counts).toEqual([0])
    await waitFor(() => expect(result.current.counts).toEqual([7]), { timeout: 1000 })
  })
})
