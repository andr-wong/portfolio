'use client'

import { useRef, useCallback } from 'react'
import { Github, LinkedIn, Mail } from '@/components/portfolio/Icons'

export default function BentoHero() {
  const heroPhotoRef = useRef<HTMLDivElement>(null)

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = heroPhotoRef.current
    if (!img) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    img.style.transition = 'transform 0.15s ease'
    img.style.transform = `translate(${(x * -12).toFixed(1)}px, ${(y * -12).toFixed(1)}px) scale(1.03)`
  }, [])

  const handleHeroMouseLeave = useCallback(() => {
    const img = heroPhotoRef.current
    if (!img) return
    img.style.transition = 'transform 0.5s ease'
    img.style.transform = ''
  }, [])

  return (
    <section
      className="bento-hero-split"
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
    >
      {/* Photo side */}
      <div className="bento-hero-photo-side">
        <div ref={heroPhotoRef} className="bento-hero-photo-inner" />
        <div className="bento-grain" aria-hidden="true" />
        <div className="bento-hero-photo-scrim" aria-hidden="true" />
      </div>

      {/* Content side */}
      <div className="bento-hero-content-side">
        <div className="bento-hero-top-meta">
          <span className="bento-hero-index">001 — Professional</span>
          <div className="bento-status">
            <span className="bento-status-dot" aria-hidden="true">●</span>
            <span>Open to graduate roles · 2026</span>
          </div>
        </div>

        <div className="bento-hero-main">
          <h1 className="bento-hero-name">
            Andrew<br />
            <span className="bento-hero-name-italic">Wong.</span>
          </h1>
          <p className="bento-hero-subline">
            Software Engineer · Full-Stack Developer
          </p>
          <p className="bento-hero-statement">
            A final-year CS student building <em>real systems that ship</em> —
            fintech-adjacent tooling, event aggregation, and the small civic
            apps that quietly replace WhatsApp chains.
          </p>

          <div className="bento-hero-cta-row">
            <a className="btn btn-primary" href="#projects">
              View Work <span className="arrow">→</span>
            </a>
            <a className="btn" href="/cv.pdf">
              Download CV <span className="arrow">→</span>
            </a>
          </div>

          <div className="bento-hero-social">
            <a href="https://github.com/andr-wong" target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub">
              <Github />
            </a>
            <a href="https://linkedin.com/in/andrwong" target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn">
              <LinkedIn />
            </a>
            <a href="mailto:andrwong101@gmail.com" className="icon-btn" aria-label="Email">
              <Mail />
            </a>
          </div>
        </div>

        <div className="bento-hero-bottom-meta">
          <span className="bento-submeta">Adelaide, SA · UTC+9:30</span>
          <span className="bento-submeta">BCS · University of Adelaide · 2026</span>
        </div>
      </div>
    </section>
  )
}
