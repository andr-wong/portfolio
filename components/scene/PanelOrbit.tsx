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
}

export default function PanelOrbit({
  data,
  orbitActive,
  onSelect,
  isActive,
}: PanelOrbitProps) {
  const groupRef = useRef<Group>(null)
  const worldPosRef = useRef<Vector3>(new Vector3())

  useFrame(({ clock }) => {
    if (!groupRef.current || !orbitActive) return
    const t = clock.elapsedTime
    const angle = t * data.orbitSpeed + data.orbitOffset

    const x = Math.cos(angle) * data.orbitRadius
    const z = Math.sin(angle) * data.orbitRadius
    const y = Math.sin(angle + data.orbitOffset) * Math.tan(data.orbitInclination) * data.orbitRadius

    groupRef.current.position.set(x, y, z)
    worldPosRef.current.set(x, y, z)
  })

  const handleSelect = (id: string, _localPos: Vector3) => {
    onSelect(id, worldPosRef.current.clone())
  }

  return (
    <group ref={groupRef}>
      <GlassPanel
        data={data}
        worldPos={new Vector3(0, 0, 0)}
        onSelect={handleSelect}
        isActive={isActive}
      />
    </group>
  )
}
