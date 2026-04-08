'use client'

import OrganicBlob from './OrganicBlob'

// 4 blobs at different positions/scales/speeds to avoid synchrony
const BLOBS = [
  { position: [-2.5, 1.0, -1.5] as [number, number, number], scale: 1.4, color: '#1A0533', speed: 0.4 },
  { position: [2.8, -1.2, -2.0] as [number, number, number], scale: 1.1, color: '#7CFFD4', speed: 0.6 },
  { position: [-1.0, -2.0, -3.0] as [number, number, number], scale: 0.9, color: '#1A0533', speed: 0.35 },
  { position: [1.5, 2.2, -2.5] as [number, number, number], scale: 1.3, color: '#7CFFD4', speed: 0.5 },
]

export default function BiopunkLayer() {
  return (
    <>
      {BLOBS.map((blob, i) => (
        <OrganicBlob key={i} {...blob} />
      ))}
    </>
  )
}
