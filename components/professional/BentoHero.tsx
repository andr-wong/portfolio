'use client'

import { useRef, useCallback } from 'react'
import { NOW } from '@/lib/now'
import { useTilt } from '@/hooks/useTilt'
import BentoCell from './BentoCell'

export default function BentoHero() {
  const gridRef = useRef<HTMLDivElement>(null)

  // Photo cell — tilt + parallax on the inner image layer
  const { ref: photoRef, handleMouseMove: photoTilt, handleMouseLeave: photoTiltLeave } = useTilt(4)
  const photoImgRef = useRef<HTMLDivElement>(null)

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

  const handlePhotoMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    photoTilt(e)
    const img = photoImgRef.current
    if (!img) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    img.style.transition = 'transform 0.1s ease'
    img.style.transform = `translate(${(x * -16).toFixed(1)}px, ${(y * -16).toFixed(1)}px) scale(1.04)`
  }, [photoTilt])

  const handlePhotoMouseLeave = useCallback(() => {
    photoTiltLeave()
    const img = photoImgRef.current
    if (!img) return
    img.style.transition = 'transform 0.4s ease'
    img.style.transform = ''
  }, [photoTiltLeave])

  const readingHref = NOW.reading.url || undefined

  return (
    <section className="bento-section">
      <div
        ref={gridRef}
        className="bento-grid"
        style={{ '--mouse-x': '-600px', '--mouse-y': '-600px' } as React.CSSProperties}
        onMouseMove={handleGridMouseMove}
        onMouseLeave={handleGridMouseLeave}
      >
        {/* ── Photo ──────────────────────────────────────── */}
        <div
          ref={photoRef}
          className="bento-cell bento-cell-photo"
          onMouseMove={handlePhotoMouseMove}
          onMouseLeave={handlePhotoMouseLeave}
        >
          <div ref={photoImgRef} className="bento-photo-inner" />
          <div className="bento-grain" aria-hidden="true" />
        </div>

        {/* ── Name / tagline ─────────────────────────────── */}
        <BentoCell className="bento-cell-name">
          <div className="bento-name-content">
            <h1 className="bento-name">
              Andrew <span className="bento-name-italic">Wong.</span>
            </h1>
            <p className="bento-tagline">Building systems that actually ship.</p>
            <div className="bento-status">
              <span className="bento-status-dot" aria-hidden="true">●</span>
              <span>Open to graduate roles · 2026</span>
            </div>
            <p className="bento-submeta">Adelaide-based engineer</p>
          </div>
        </BentoCell>

        {/* ── GitHub heatmap ─────────────────────────────── */}
        <BentoCell className="bento-cell-github">
          <a
            href="https://github.com/andr-wong"
            target="_blank"
            rel="noreferrer"
            className="bento-cover-link"
            aria-label="View GitHub profile"
          />
          <div className="bento-github-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://ghchart.rshah.org/00FF99/andr-wong"
              alt="GitHub contribution graph for andr-wong"
              className="bento-github-chart"
            />
            <p className="bento-github-label">contributions · github.com/andr-wong</p>
          </div>
          <div className="bento-scan-line" aria-hidden="true" />
        </BentoCell>

        {/* ── Currently reading ──────────────────────────── */}
        <BentoCell className="bento-cell-reading">
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

        {/* ── Hobby photo ────────────────────────────────── */}
        <BentoCell className="bento-cell-hobby">
          <div className="bento-photo-inner bento-hobby-inner" />
        </BentoCell>

        {/* ── Location ───────────────────────────────────── */}
        <BentoCell className="bento-cell-location">
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
