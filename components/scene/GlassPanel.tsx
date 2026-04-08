'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { PlaneGeometry, EdgesGeometry, Vector3 } from 'three'
import type { Mesh } from 'three'
import type { PanelData } from '@/types/panel'

const PANEL_W = 2.5
const PANEL_H = 1.8

interface GlassPanelProps {
  data: PanelData
  worldPos: Vector3
  onSelect: (id: string, pos: Vector3) => void
  isActive: boolean
}

export default function GlassPanel({
  data,
  worldPos,
  onSelect,
  isActive,
}: GlassPanelProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  const edgesGeometry = useMemo(
    () => new EdgesGeometry(new PlaneGeometry(PANEL_W, PANEL_H)),
    []
  )

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.lookAt(camera.position)
    // Hover: nudge toward camera
    const targetZ = hovered ? 0.15 : 0
    meshRef.current.position.z +=
      (targetZ - meshRef.current.position.z) * 0.1
  })

  const highlighted = hovered || isActive

  return (
    <group
      position={worldPos}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(data.id, worldPos)
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh ref={meshRef}>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        <meshPhysicalMaterial
          transmission={0.95}
          roughness={0.05}
          metalness={0}
          color="#ffffff"
          opacity={0.06}
          transparent
          envMapIntensity={1}
        />
      </mesh>

      {/* Border edges */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial
          color={highlighted ? '#7CFFD4' : '#ffffff'}
          transparent
          opacity={highlighted ? 0.6 : 0.15}
        />
      </lineSegments>

      {/* Label above panel */}
      <Html center position={[0, PANEL_H / 2 + 0.15, 0]} style={{ pointerEvents: 'none' }}>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '11px',
            color: highlighted ? '#7CFFD4' : 'rgba(255,255,255,0.6)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s',
            userSelect: 'none',
          }}
        >
          {data.label}
        </span>
      </Html>
    </group>
  )
}
