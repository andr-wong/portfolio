'use client'

import { useCallback } from 'react'
import { Vector3 } from 'three'

// Camera control is handled by <OrbitControls> in the scene.
// This hook exists as a stub so callsites don't need to change.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useObservatoryCamera() {
  // No-ops — OrbitControls owns camera position now
  const focusPanel = useCallback((_worldPos: Vector3) => {}, [])
  const resetCamera = useCallback(() => {}, [])
  return { focusPanel, resetCamera }
}
