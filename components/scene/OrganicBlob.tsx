'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { IcosahedronGeometry, Vector3 } from 'three'
import type { Mesh, BufferGeometry } from 'three'
import { createNoise3D } from 'simplex-noise'

interface OrganicBlobProps {
  position: [number, number, number]
  scale: number
  color: string
  speed: number
}

const NOISE_STRENGTH = 0.3
const UPDATE_INTERVAL = 0.06  // ~16fps for blob morphing is plenty

export default function OrganicBlob({
  position,
  scale,
  color,
  speed,
}: OrganicBlobProps) {
  const meshRef = useRef<Mesh>(null)
  const lastUpdateRef = useRef(0)

  const { noise3D, originalPositions } = useMemo(() => {
    // Detail 2 = ~40 vertices (was detail 3 = ~160). 4x cheaper.
    const geometry = new IcosahedronGeometry(1, 2)
    const pos = geometry.attributes.position
    const originals = new Float32Array(pos.array.length)
    originals.set(pos.array)
    return { noise3D: createNoise3D(), originalPositions: originals }
  }, [])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return

    const elapsed = clock.elapsedTime
    if (elapsed - lastUpdateRef.current < UPDATE_INTERVAL) return
    lastUpdateRef.current = elapsed

    const geometry = mesh.geometry as BufferGeometry
    const pos = geometry.attributes.position
    const t = elapsed * speed

    for (let i = 0; i < pos.count; i++) {
      const ox = originalPositions[i * 3]
      const oy = originalPositions[i * 3 + 1]
      const oz = originalPositions[i * 3 + 2]

      const n = noise3D(ox + t, oy + t * 0.7, oz + t * 0.5)
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
      const disp = n * NOISE_STRENGTH

      pos.setXYZ(
        i,
        ox + (ox / len) * disp,
        oy + (oy / len) * disp,
        oz + (oz / len) * disp
      )
    }

    pos.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} position={new Vector3(...position)} scale={scale}>
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.22}
        roughness={0.9}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  )
}
