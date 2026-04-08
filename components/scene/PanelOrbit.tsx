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

    const t = clock.elapsedTime
    const angle = t * speedRef.current + data.orbitOffset

    const x = Math.cos(angle) * data.orbitRadius
    const z = Math.sin(angle) * data.orbitRadius
    const y =
      Math.sin(angle + data.orbitOffset) *
      Math.tan(data.orbitInclination) *
      data.orbitRadius

    groupRef.current.position.set(x, y, z)
  })

  return (
    <group ref={groupRef}>
      <GlassPanel
        data={data}
        onSelect={onSelect}
        isActive={isActive}
        onHoverChange={onHoverChange}
      />
    </group>
  )
}
