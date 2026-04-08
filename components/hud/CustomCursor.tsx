'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!cursorRef.current) return
      cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      const interactive =
        el.closest('button, a, [role="button"], canvas') !== null
      setActive(interactive)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10000,
        // Offset so crosshair centre aligns with pointer
        marginLeft: '-12px',
        marginTop: '-12px',
        transition: 'transform 0.05s linear',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          transition: 'all 0.2s ease',
          transform: active ? 'scale(1.5)' : 'scale(1)',
        }}
      >
        {/* Crosshair */}
        <line x1="12" y1="2" x2="12" y2="8" stroke="#7CFFD4" strokeWidth="1" />
        <line x1="12" y1="16" x2="12" y2="22" stroke="#7CFFD4" strokeWidth="1" />
        <line x1="2" y1="12" x2="8" y2="12" stroke="#7CFFD4" strokeWidth="1" />
        <line x1="16" y1="12" x2="22" y2="12" stroke="#7CFFD4" strokeWidth="1" />
        <circle cx="12" cy="12" r="2" stroke="#7CFFD4" strokeWidth="1" />
        {active && (
          <circle
            cx="12"
            cy="12"
            r="5"
            stroke="#7CFFD4"
            strokeWidth="0.5"
            opacity="0.5"
          />
        )}
      </svg>
    </div>
  )
}
