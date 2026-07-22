import Reveal from '@/components/portfolio/Reveal'
import SectionHead from '@/components/portfolio/SectionHead'

export default function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <SectionHead
          eyebrow="Formation"
          title="Education."
          meta={['Section 006']}
        />
        <Reveal>
          <div className="edu-grid">
            <div className="edu">
              <div className="edu-degree">Bachelor of Computer Science</div>
              <div className="edu-institution">University of Adelaide — Adelaide, SA</div>
              <div className="edu-meta">
                <span>S2 2023 — Jul 2026 (expected)</span>
                <span>Final year</span>
              </div>
            </div>
            <div className="edu">
              <div className="edu-degree">
                B. Mechanical Engineering
                <span style={{ color: 'var(--fg-dim)', fontSize: 14, fontStyle: 'italic' }}> · transferred</span>
              </div>
              <div className="edu-institution">University of Adelaide — Adelaide, SA</div>
              <div className="edu-meta">
                <span>Semester 1, 2023</span>
                <span>Pivot → CS</span>
              </div>
            </div>
            <div className="edu">
              <div className="edu-degree">SACE</div>
              <div className="edu-institution">Modbury High School — Adelaide, SA</div>
              <div className="edu-meta">
                <span>2018 — 2022</span>
                <span>Foundation</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
