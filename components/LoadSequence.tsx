'use client'

import { useEffect, useState } from 'react'

type LoadStage =
  | 'idle'
  | 'nebula'
  | 'blobs'
  | 'core'
  | 'panels'
  | 'hud'
  | 'name'
  | 'subtitle'
  | 'complete'

interface LoadState {
  stage: LoadStage
  orbitActive: boolean
  hudVisible: boolean
  nameplateVisible: boolean
  nameplateFullOpacity: boolean
  splashDone: boolean
}

const TIMINGS: Array<{ delay: number; state: Partial<LoadState> }> = [
  { delay: 300,  state: { stage: 'nebula' } },
  { delay: 800,  state: { stage: 'blobs' } },
  { delay: 1200, state: { stage: 'core' } },
  { delay: 1800, state: { stage: 'panels' } },
  { delay: 2500, state: { stage: 'hud', hudVisible: true } },
  { delay: 3000, state: { stage: 'name', nameplateVisible: true, nameplateFullOpacity: true } },
  { delay: 3500, state: { stage: 'subtitle' } },
  // Dismiss splash just before orbit starts — scene is fully laid out by now
  { delay: 3700, state: { splashDone: true } },
  { delay: 4000, state: { stage: 'complete', orbitActive: true } },
]

export function useLoadSequence(prefersReducedMotion: boolean): LoadState {
  const [state, setState] = useState<LoadState>({
    stage: 'idle',
    orbitActive: false,
    hudVisible: false,
    nameplateVisible: false,
    nameplateFullOpacity: false,
    splashDone: false,
  })

  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip all animation — jump straight to complete
      setState({
        stage: 'complete',
        orbitActive: true,
        hudVisible: true,
        nameplateVisible: true,
        nameplateFullOpacity: true,
        splashDone: true,
      })
      return
    }

    const timers = TIMINGS.map(({ delay, state: patch }) =>
      setTimeout(() => setState((prev) => ({ ...prev, ...patch })), delay)
    )

    return () => timers.forEach(clearTimeout)
  }, [prefersReducedMotion])

  return state
}
