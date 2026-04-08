'use client'

import { useEffect, useRef } from 'react'

interface CustomCursorProps {
  /** Set to true when hovering a 3D panel (passed from ObservatoryScene) */
  panel3DHovered?: boolean
}

export default function CustomCursor({ panel3DHovered }: CustomCursorProps) {
  const cursorRef = useRef<SVGSVGElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const scaleRef = useRef(1)
  const targetScaleRef = useRef(1)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Update position synchronously — no transition, no React state
    const onMove = (e: MouseEvent) => {
      if (!cursorRef.current) return
      cursorRef.current.style.left = `${e.clientX}px`
      cursorRef.current.style.top = `${e.clientY}px`

      // Detect DOM interactives (buttons, links) — NOT canvas
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      const isDomInteractive =
        el !== null &&
        !(el instanceof HTMLCanvasElement) &&
        el.closest('button, a, [role="button"], input, textarea') !== null

      targetScaleRef.current = isDomInteractive ? 1.6 : 1
    }

    // Animate scale separately so position is never delayed
    const animateScale = () => {
      scaleRef.current += (targetScaleRef.current - scaleRef.current) * 0.18
      if (dotRef.current) {
        dotRef.current.setAttribute('r', String(1.5 + scaleRef.current * 0.5))
      }
      if (ringRef.current) {
        const r = 7 + (scaleRef.current - 1) * 6
        ringRef.current.setAttribute('r', String(r))
        ringRef.current.style.opacity = String(
          0.3 + (scaleRef.current - 1) * 0.4
        )
      }
      rafRef.current = requestAnimationFrame(animateScale)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animateScale)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Panel hover changes the ring color via prop
  useEffect(() => {
    targetScaleRef.current = panel3DHovered ? 1.8 : 1
  }, [panel3DHovered])

  const mint = '#7CFFD4'

  return (
    <svg
      ref={cursorRef}
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="-14 -14 28 28"
      fill="none"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 10000,
        transform: 'translate(-50%, -50%)',
        // No transition — position updates synchronously via style.left/top
        willChange: 'left, top',
        overflow: 'visible',
      }}
    >
      {/* Crosshair arms */}
      <line x1="0" y1="-12" x2="0" y2="-5"  stroke={mint} strokeWidth="0.8" />
      <line x1="0" y1=" 5"  x2="0" y2=" 12" stroke={mint} strokeWidth="0.8" />
      <line x1="-12" y1="0" x2="-5" y2="0"  stroke={mint} strokeWidth="0.8" />
      <line x1="  5" y1="0" x2="12" y2="0"  stroke={mint} strokeWidth="0.8" />

      {/* Expanding ring (animated via ref) */}
      <circle
        ref={ringRef}
        cx="0"
        cy="0"
        r="7"
        stroke={mint}
        strokeWidth="0.6"
        fill="none"
        style={{ opacity: 0.3, transition: 'none' }}
      />

      {/* Centre dot */}
      <circle
        ref={dotRef}
        cx="0"
        cy="0"
        r="1.5"
        fill={mint}
        opacity="0.9"
      />
    </svg>
  )
}
