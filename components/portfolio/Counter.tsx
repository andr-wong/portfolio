'use client'

import { useRef, useState, useEffect } from 'react'

interface CounterProps {
  to: number
  suffix?: string
  duration?: number
}

export default function Counter({ to, suffix = '', duration = 1600 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf: number
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(to * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf) }
  }, [to, duration])

  return (
    <span ref={ref} className="stat-num">
      {val}{suffix && <span className="stat-suffix">{suffix}</span>}
    </span>
  )
}
