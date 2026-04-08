'use client'

import { useState, useEffect } from 'react'

interface DeviceCapability {
  is3DCapable: boolean
  prefersReducedMotion: boolean
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    is3DCapable: true,
    prefersReducedMotion: false,
  })

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const hasWebGL = !!gl

    const isWide = window.innerWidth >= 768
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    setCapability({
      is3DCapable: hasWebGL && isWide,
      prefersReducedMotion: reducedMotion,
    })
  }, [])

  return capability
}
