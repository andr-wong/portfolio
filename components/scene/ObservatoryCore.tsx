'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import type { Mesh, PointLight, MeshStandardMaterial } from 'three'

export default function ObservatoryCore() {
  const meshRef = useRef<Mesh>(null)
  const lightRef = useRef<PointLight>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // Breathing pulse: emissiveIntensity 0.5 → 1.5
    const pulse = 1.0 + Math.sin(t * 0.8) * 0.5
    if (meshRef.current) {
      const mat = meshRef.current.material as MeshStandardMaterial
      mat.emissiveIntensity = pulse
    }
    if (lightRef.current) {
      lightRef.current.intensity = pulse * 1.5
    }
  })

  return (
    <group>
      {/* Core orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#7CFFD4"
          emissive="#7CFFD4"
          emissiveIntensity={1.0}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Attached point light */}
      <pointLight
        ref={lightRef}
        color="#7CFFD4"
        intensity={2}
        distance={8}
        position={[0, 0, 0]}
      />

      {/* Outer glow via sparkles */}
      <Sparkles
        count={30}
        scale={1.8}
        size={1.2}
        speed={0.3}
        color="#7CFFD4"
        opacity={0.6}
      />
    </group>
  )
}
