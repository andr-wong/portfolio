'use client'

import React, { useRef, useState, useEffect, CSSProperties, ReactNode, ElementType } from 'react'

interface RevealProps {
  tag?: ElementType
  delay?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function Reveal({ tag = 'div', delay = 0, className = '', style, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return React.createElement(
    tag,
    {
      ref,
      className: `reveal ${seen ? 'in' : ''} ${className}`.trim(),
      style: { transitionDelay: `${delay}ms`, ...style },
    },
    children
  )
}
