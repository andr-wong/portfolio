'use client'

import { useRef, useEffect } from 'react'
import Reveal from '@/components/portfolio/Reveal'
import SectionHead from '@/components/portfolio/SectionHead'

const entries = [
  {
    year: '2023',
    tags: ['UofA', 'Pivot'],
    narrative: 'Started Mechanical Engineering at the University of Adelaide. One semester in, transferred to Computer Science — the right call, made fast.',
    detail: 'First production code: a recipe site that scrapes live supermarket prices to surface the cheapest ingredients per recipe.',
  },
  {
    year: '2024',
    tags: ['JB Hi-Fi', 'Headcount v1'],
    narrative: 'Picked up retail at JB Hi-Fi while the CS degree compounded. Shipped Headcount to replace a manual WhatsApp chain at church — first thing I built that someone else used every Sunday.',
    detail: 'Began the HCF Transport Calculator: Dijkstra over real OSRM routes, multiple groups, persistent storage.',
  },
  {
    year: '2025',
    tags: ['Hackathon', 'Mapster', '2nd Place'],
    narrative: 'Built Mapster across one hackathon weekend with HackerCodex. Aggregated 100+ events from 6 sources at launch. Took 2nd at CSC × UPC.',
    detail: 'Started rotating across Level 4 departments at Myer — diverse customer-facing work alongside a production-grade SaaS side build.',
  },
  {
    year: '2026',
    tags: ['Final year', 'Graduate roles'],
    narrative: 'Final year of CS. Graduating July. Looking for a graduate role where consulting-grade communication and a real shipping habit both matter.',
    detail: 'On the bench: a confidence-weighted skill visualisation, a flagship case-study PDF for HCF Transport, and the next iteration of Mapster.',
  },
]

export default function Timeline() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current || !fillRef.current) return
      const r = wrapRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const total = r.height + vh * 0.5
      const passed = Math.min(total, Math.max(0, vh - r.top))
      const pct = Math.max(0, Math.min(1, passed / total))
      fillRef.current.style.height = (pct * 100) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="section" id="journey">
      <div className="container">
        <SectionHead
          eyebrow="Trajectory"
          title="Four years, <em>compounding quietly.</em>"
          meta={['Section 005', 'Timeline']}
        />
        <div className="timeline" ref={wrapRef}>
          <div className="timeline-progress">
            <div ref={fillRef} className="timeline-progress-fill" />
          </div>
          {entries.map((e, i) => (
            <Reveal key={e.year} className="timeline-entry" delay={i * 60}>
              <div className="timeline-year">{e.year}</div>
              <div className="timeline-body">
                <div className="timeline-tags">
                  {e.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
                <div className="timeline-narrative">{e.narrative}</div>
                <div className="timeline-detail">{e.detail}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
