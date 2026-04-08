'use client'

import { useEffect, useRef, useState } from 'react'

const BASE_LAT = 33.87   // Sydney
const BASE_LON = 151.21

function toSexagesimal(deg: number, posDir: string, negDir: string): string {
  const dir = deg >= 0 ? posDir : negDir
  const abs = Math.abs(deg)
  const d = Math.floor(abs)
  const m = Math.floor((abs - d) * 60)
  return `${d}°${String(m).padStart(2, '0')}'${dir}`
}

export default function CoordinatesDisplay() {
  const [coords, setCoords] = useState({ lat: BASE_LAT, lon: BASE_LON })
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    const tick = () => {
      const { x, y } = mouseRef.current
      const latOffset = ((y / window.innerHeight) - 0.5) * 2
      const lonOffset = ((x / window.innerWidth) - 0.5) * 4
      setCoords({
        lat: BASE_LAT + latOffset,
        lon: BASE_LON + lonOffset,
      })
      rafRef.current = setTimeout(tick, 33) // ~30fps
    }
    tick()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafRef.current) clearTimeout(rafRef.current)
    }
  }, [])

  return (
    <div
      style={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: '11px',
        color: '#7CFFD4',
        letterSpacing: '0.08em',
        lineHeight: 1.6,
        userSelect: 'none',
      }}
    >
      <div>LAT {toSexagesimal(coords.lat, 'N', 'S')}</div>
      <div>LON {toSexagesimal(coords.lon, 'E', 'W')}</div>
    </div>
  )
}
