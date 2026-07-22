'use client'

import { useRef, useCallback } from 'react'
import { NOW } from '@/lib/now'
import { useTilt } from '@/hooks/useTilt'
import BentoCell from '@/components/professional/BentoCell'

export default function PersonalBento() {
  const gridRef = useRef<HTMLDivElement>(null)

  const handleGridMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const grid = gridRef.current
    if (!grid) return
    const rect = grid.getBoundingClientRect()
    grid.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    grid.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }, [])

  const handleGridMouseLeave = useCallback(() => {
    const grid = gridRef.current
    if (!grid) return
    grid.style.setProperty('--mouse-x', '-600px')
    grid.style.setProperty('--mouse-y', '-600px')
  }, [])

  const { ref: hobbyRef, handleMouseMove: hobbyTilt, handleMouseLeave: hobbyTiltLeave } = useTilt(4)

  const readingHref = NOW.reading.url || undefined

  return (
    <section className="personal-bento-section">
      <div
        ref={gridRef}
        className="bento-grid personal-bento-grid"
        style={{ '--mouse-x': '-600px', '--mouse-y': '-600px' } as React.CSSProperties}
        onMouseMove={handleGridMouseMove}
        onMouseLeave={handleGridMouseLeave}
      >
        {/* Hobby photo — grayscale → colour on hover */}
        <div
          ref={hobbyRef}
          className="bento-cell bento-cell-hobby personal-bento-hobby"
          onMouseMove={hobbyTilt}
          onMouseLeave={hobbyTiltLeave}
        >
          <div className="bento-photo-inner bento-hobby-inner" />
        </div>

        {/* Currently reading */}
        <BentoCell className="bento-cell-reading personal-bento-reading">
          {readingHref && (
            <a
              href={readingHref}
              target="_blank"
              rel="noreferrer"
              className="bento-cover-link"
              aria-label={`Read about ${NOW.reading.title}`}
            />
          )}
          <div className="bento-reading-content">
            <span className="bento-eyebrow">Reading</span>
            <p className="bento-book-title">{NOW.reading.title}</p>
            <p className="bento-book-author">{NOW.reading.author}</p>
          </div>
        </BentoCell>

        {/* Location */}
        <BentoCell className="bento-cell-location personal-bento-location">
          <div className="bento-location-content">
            <div className="bento-radar-wrap" aria-hidden="true">
              <span className="bento-radar-dot" />
            </div>
            <p className="bento-location-city">Adelaide, AU</p>
            <p className="bento-location-tz">GMT+9:30</p>
          </div>
        </BentoCell>
      </div>
    </section>
  )
}
