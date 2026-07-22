import Reveal from '@/components/portfolio/Reveal'
import SectionHead from '@/components/portfolio/SectionHead'
import { ExternalArrow } from '@/components/portfolio/Icons'

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead
          eyebrow="Selected work"
          title="Three things <em>actually in production.</em>"
          meta={['Section 003', '7 total · 3 featured']}
        />

        <div className="projects-grid">
          <Reveal tag="article" className="project-card span-7">
            <div className="visual viz-map" />
            <div className="project-num">PRJ — 001</div>
            <h3 className="project-title">
              Mapster<br />
              <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Adelaide event aggregation.</span>
            </h3>
            <p className="project-desc">
              Single map for everything happening in Adelaide. SvelteKit front-end, FastAPI scrapers,
              Supabase de-dup. Built across one hackathon weekend with the HackerCodex team.
            </p>
            <div className="project-impact">
              2nd Place — CSC × UPC Hackathon 2025. 100+ events from 6 sources at launch,
              including OpenAI Vision parsing of physical posters.
            </div>
            <div className="project-meta">
              <div className="project-tags">
                {['SvelteKit', 'FastAPI', 'Supabase', 'Mapbox', 'OpenAI'].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <div className="project-links">
                <a href="https://mapster.city" target="_blank" rel="noreferrer" className="project-link">
                  Live <ExternalArrow />
                </a>
                <a href="/projects/mapster" className="project-link">Case study <ExternalArrow /></a>
              </div>
            </div>
          </Reveal>

          <Reveal tag="article" className="project-card span-5" delay={120}>
            <div className="visual viz-grid-fine" />
            <div className="project-num">PRJ — 002</div>
            <h3 className="project-title">
              Headcount<br />
              <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Sunday-morning ops.</span>
            </h3>
            <p className="project-desc">
              Replaced a manual WhatsApp chain used to coordinate Sunday attendance across two services
              at Hope Church Adelaide. Tap-to-count, paste-to-import, reports on a calendar.
            </p>
            <div className="project-impact">
              Full auth, role-based access, and a Supabase Edge Function that posts a changelog
              on every git commit.
            </div>
            <div className="project-meta">
              <div className="project-tags">
                {['Vanilla JS', 'Supabase', 'Edge Fns'].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <div className="project-links">
                <a href="https://headcount.andrwong.com" target="_blank" rel="noreferrer" className="project-link">
                  Live <ExternalArrow />
                </a>
                <a href="/projects/headcount" className="project-link">Case study <ExternalArrow /></a>
              </div>
            </div>
          </Reveal>

          <Reveal tag="article" className="project-card span-12" delay={80}>
            <div className="visual viz-route" />
            <div className="project-num">PRJ — 003</div>
            <h3 className="project-title" style={{ maxWidth: '14ch' }}>
              HCF Transport —{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>passengers, drivers, Dijkstra.</span>
            </h3>
            <p className="project-desc" style={{ maxWidth: '64ch' }}>
              Church and lifegroup transport coordinator. Saves driver and passenger addresses,
              supports multiple groups and configurable destinations, and assigns passengers to
              drivers using Dijkstra over real OSRM routes — high-priority passengers first,
              then optimised by total distance.
            </p>
            <div className="project-meta">
              <div className="project-tags">
                {['Next.js 16', 'React 19', 'TypeScript', 'MapLibre', 'OSRM', 'Zustand', 'shadcn/ui'].map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <div className="project-links">
                <a href="/projects/hcf-transport" className="project-link">Case study <ExternalArrow /></a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div style={{
            marginTop: 56,
            paddingTop: 32,
            borderTop: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--fg-mute)',
          }}>
            <span>Also in the archive</span>
            <span>Recipe price-comparison · Fertility regression (R) · Tile platformer (C++) · Scrabble solver (MATLAB)</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
