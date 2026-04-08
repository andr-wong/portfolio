'use client'

import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

const DEFAULT_POS = new Vector3(0, 0, 8)
const LERP_FACTOR = 0.05

// Must be called inside a <Canvas> context
export function useObservatoryCamera() {
  const targetRef = useRef<Vector3>(DEFAULT_POS.clone())
  const { camera } = useThree()

  useFrame(() => {
    camera.position.lerp(targetRef.current, LERP_FACTOR)
  })

  const focusPanel = useCallback((worldPos: Vector3) => {
    const direction = worldPos.clone().normalize()
    targetRef.current = direction.multiplyScalar(4.5)
  }, [])

  const resetCamera = useCallback(() => {
    targetRef.current = DEFAULT_POS.clone()
  }, [])

  return { focusPanel, resetCamera }
}
