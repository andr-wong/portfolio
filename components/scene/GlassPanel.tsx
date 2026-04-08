'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html } from '@react-three/drei'
import { PlaneGeometry, EdgesGeometry, Vector3, Color } from 'three'
import type { Mesh, LineBasicMaterial } from 'three'
import type { PanelData } from '@/types/panel'

const PANEL_W = 2.5
const PANEL_H = 1.8
const COLOR_DEFAULT = new Color('#ffffff')
const COLOR_HOVER = new Color('#7CFFD4')

interface GlassPanelProps {
  data: PanelData
  onSelect: (id: string, pos: Vector3) => void
  isActive: boolean
  /** Called with true/false so ObservatoryScene can update cursor state */
  onHoverChange: (hovered: boolean) => void
}

export default function GlassPanel({
  data,
  onSelect,
  isActive,
  onHoverChange,
}: GlassPanelProps) {
  const glassMeshRef = useRef<Mesh>(null)
  const borderRef = useRef<LineBasicMaterial>(null)
  const hoveredRef = useRef(false)
  // Track position for camera focus
  const worldPosRef = useRef(new Vector3())

  const edgesGeometry = useMemo(
    () => new EdgesGeometry(new PlaneGeometry(PANEL_W, PANEL_H)),
    []
  )

  useFrame(() => {
    if (!glassMeshRef.current || !borderRef.current) return

    const highlighted = hoveredRef.current || isActive

    // Mutate material directly — no React state, no re-renders
    borderRef.current.color.lerp(
      highlighted ? COLOR_HOVER : COLOR_DEFAULT,
      0.12
    )
    borderRef.current.opacity = highlighted
      ? borderRef.current.opacity + (0.6 - borderRef.current.opacity) * 0.12
      : borderRef.current.opacity + (0.12 - borderRef.current.opacity) * 0.12

    // Nudge toward camera on hover
    const targetZ = hoveredRef.current ? 0.12 : 0
    glassMeshRef.current.position.z +=
      (targetZ - glassMeshRef.current.position.z) * 0.1
  })

  const handlePointerOver = useCallback(() => {
    hoveredRef.current = true
    onHoverChange(true)
  }, [onHoverChange])

  const handlePointerOut = useCallback(() => {
    hoveredRef.current = false
    onHoverChange(false)
  }, [onHoverChange])

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      // Get actual world position at click time
      if (glassMeshRef.current) {
        glassMeshRef.current.getWorldPosition(worldPosRef.current)
      }
      onSelect(data.id, worldPosRef.current.clone())
    },
    [data.id, onSelect]
  )

  return (
    // Billboard keeps the panel facing the camera — no useFrame lookAt needed
    <Billboard follow lockX={false} lockY={false} lockZ={false}>
      <group
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Larger invisible hit mesh for easier clicking */}
        <mesh visible={false} ref={glassMeshRef}>
          <planeGeometry args={[PANEL_W + 0.4, PANEL_H + 0.4]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Visible glass face — cheap MeshStandardMaterial, no transmission */}
        <mesh>
          <planeGeometry args={[PANEL_W, PANEL_H]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.05}
            roughness={0.1}
            metalness={0.2}
            depthWrite={false}
          />
        </mesh>

        {/* Border */}
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial
            ref={borderRef}
            color="#ffffff"
            transparent
            opacity={0.12}
          />
        </lineSegments>

        {/* Label */}
        <Html
          center
          position={[0, PANEL_H / 2 + 0.18, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            {data.label}
          </span>
        </Html>
      </group>
    </Billboard>
  )
}
