'use client'

import OrganicBlob from './OrganicBlob'

// 3 blobs (was 4) — each 4x cheaper after IcosahedronGeometry detail reduction
const BLOBS = [
  { position: [-2.5,  1.0, -1.5] as [number, number, number], scale: 1.4, color: '#1A0533', speed: 0.4 },
  { position: [ 2.8, -1.2, -2.0] as [number, number, number], scale: 1.1, color: '#7CFFD4', speed: 0.6 },
  { position: [-1.0, -2.0, -3.0] as [number, number, number], scale: 1.0, color: '#1A0533', speed: 0.35 },
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
