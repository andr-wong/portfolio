'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, Group } from 'three'
import type { PanelData } from '@/types/panel'
import GlassPanel from './GlassPanel'

interface PanelOrbitProps {
  data: PanelData
  orbitActive: boolean
  onSelect: (id: string, pos: Vector3) => void
  isActive: boolean
  onHoverChange: (hovered: boolean) => void
}

// Compute orbit position at a given elapsed time
function orbitPosition(data: PanelData, t: number, speed: number) {
  const angle = t * speed + data.orbitOffset
  return {
    x: Math.cos(angle) * data.orbitRadius,
    z: Math.sin(angle) * data.orbitRadius,
    y:
      Math.sin(angle + data.orbitOffset) *
      Math.tan(data.orbitInclination) *
      data.orbitRadius,
  }
}

export default function PanelOrbit({
  data,
  orbitActive,
  onSelect,
  isActive,
  onHoverChange,
}: PanelOrbitProps) {
  const groupRef = useRef<Group>(null)
  const speedRef = useRef(data.orbitSpeed)

  useFrame(({ clock }) => {
    if (!groupRef.current || !orbitActive) return

    // Slow orbit to 20% when panel is active so it's easier to observe
    const targetSpeed = isActive ? data.orbitSpeed * 0.2 : data.orbitSpeed
    speedRef.current += (targetSpeed - speedRef.current) * 0.05

    const { x, y, z } = orbitPosition(data, clock.elapsedTime, speedRef.current)
    groupRef.current.position.set(x, y, z)
  })

  // Pre-position at t=0 so panels are never at the origin before orbitActive fires
  const init = orbitPosition(data, 0, data.orbitSpeed)

  return (
    <group ref={groupRef} position={[init.x, init.y, init.z]}>
      <GlassPanel
        data={data}
        onSelect={onSelect}
        isActive={isActive}
        onHoverChange={onHoverChange}
      />
    </group>
  )
}
