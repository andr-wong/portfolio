'use client'

import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import ObservatoryScene from './ObservatoryScene'
import FallbackScene from './FallbackScene'

export default function SceneWrapper() {
  const { is3DCapable, prefersReducedMotion } = useDeviceCapability()

  if (!is3DCapable) {
    return <FallbackScene />
  }

  return <ObservatoryScene prefersReducedMotion={prefersReducedMotion} />
}
