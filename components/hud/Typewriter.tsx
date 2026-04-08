'use client'

import { useEffect, useState } from 'react'

interface TypewriterProps {
  text: string
  charDelay?: number
  startDelay?: number
  style?: React.CSSProperties
}

export default function Typewriter({
  text,
  charDelay = 30,
  startDelay = 0,
  style,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, charDelay)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(startTimer)
  }, [text, charDelay, startDelay])

  return <span style={style}>{displayed}</span>
}
