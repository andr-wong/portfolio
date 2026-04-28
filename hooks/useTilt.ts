'use client'

import { useRef, useCallback } from 'react'

export function useTilt(maxDeg = 5) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transition = 'transform 0.08s linear'
      el.style.transform = `perspective(800px) rotateY(${(x * maxDeg * 2).toFixed(2)}deg) rotateX(${(-y * maxDeg * 2).toFixed(2)}deg)`
    },
    [maxDeg],
  )

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.4s ease'
    el.style.transform = ''
  }, [])

  return { ref, handleMouseMove, handleMouseLeave }
}
