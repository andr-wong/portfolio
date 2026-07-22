import Link from 'next/link'
import { Github, LinkedIn, Mail } from '@/components/portfolio/Icons'

export default function HeroPro() {
  const stamp = new Date().toISOString().slice(0, 10)

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-meta">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Index</span>
            <span className="hero-meta-value">001 — Professional</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Status</span>
            <span className="hero-meta-value">Open to graduate roles · 2026</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Located</span>
            <span className="hero-meta-value">Adelaide, SA — UTC+9:30</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Updated</span>
            <span className="hero-meta-value">{stamp}</span>
          </div>
        </div>

        <h1 className="hero-title display">
          <span className="word"><span>Andrew</span></span>{' '}
          <span className="word"><span className="italic">Wong.</span></span>
        </h1>

        <div className="hero-subline">
          <span>Software Engineer</span>
          <span className="pip" />
          <span>Full-Stack Developer</span>
          <span className="pip" />
          <span>BCS · University of Adelaide · 2026</span>
        </div>

        <p className="hero-statement">
          A final-year CS student building <em>real systems that ship</em> — fintech-adjacent tooling,
          event aggregation, and the small civic apps that quietly replace WhatsApp chains.
        </p>

        <div className="hero-cta-row">
          <a className="btn btn-primary" href="#projects">View Selected Work <span className="arrow">→</span></a>
          <a className="btn" href="/cv.pdf">Download CV <span className="arrow">→</span></a>
          <a className="icon-btn" href="https://github.com/andr-wong" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github />
          </a>
          <a className="icon-btn" href="https://linkedin.com/in/andrwong" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedIn />
          </a>
          <a className="icon-btn" href="mailto:andrwong101@gmail.com" aria-label="Email">
            <Mail />
          </a>
        </div>
      </div>
    </section>
  )
}
