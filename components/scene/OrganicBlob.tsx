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

const NOISE_STRENGTH = 0.35
const UPDATE_INTERVAL = 0.05  // seconds between noise updates

export default function OrganicBlob({
  position,
  scale,
  color,
  speed,
}: OrganicBlobProps) {
  const meshRef = useRef<Mesh>(null)
  const lastUpdateRef = useRef(0)

  // Create a reusable noise3D function and original positions once
  const { noise3D, originalPositions } = useMemo(() => {
    const geometry = new IcosahedronGeometry(1, 3) // ~160 vertices
    const pos = geometry.attributes.position
    const originals = new Float32Array(pos.array.length)
    originals.set(pos.array)
    return { noise3D: createNoise3D(), originalPositions: originals }
  }, [])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return

    const elapsed = clock.elapsedTime
    // Throttle: only update geometry every ~50ms
    if (elapsed - lastUpdateRef.current < UPDATE_INTERVAL) return
    lastUpdateRef.current = elapsed

    const geometry = mesh.geometry as BufferGeometry
    const pos = geometry.attributes.position
    const t = elapsed * speed

    for (let i = 0; i < pos.count; i++) {
      const ox = originalPositions[i * 3]
      const oy = originalPositions[i * 3 + 1]
      const oz = originalPositions[i * 3 + 2]

      // Noise displacement along the vertex normal direction
      const n = noise3D(ox + t, oy + t * 0.7, oz + t * 0.5)
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
      const nx = ox / len
      const ny = oy / len
      const nz = oz / len

      const disp = n * NOISE_STRENGTH
      pos.setXYZ(i, ox + nx * disp, oy + ny * disp, oz + nz * disp)
    }

    pos.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} position={new Vector3(...position)} scale={scale}>
      <icosahedronGeometry args={[1, 3]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}
