import Reveal from '@/components/portfolio/Reveal'
import Counter from '@/components/portfolio/Counter'

const items = [
  { num: 3, suffix: 'yr', label: 'Years writing production code' },
  { num: 7, suffix: '', label: 'Projects shipped or completed' },
  { num: 3, suffix: '', label: 'Apps live in production' },
  { num: 2, suffix: 'nd', label: 'CSC × UPC Hackathon · 2025' },
]

export default function Stats() {
  return (
    <section className="section" style={{ paddingTop: 'clamp(40px, 6vw, 80px)' }}>
      <div className="container">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 28 }}>Proof — last 36 months</div>
        </Reveal>
        <Reveal>
          <div className="stats-grid">
            {items.map((s) => (
              <div key={s.label} className="stat">
                <Counter to={s.num} suffix={s.suffix} />
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal>
          <div style={{
            marginTop: 18,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--fg-dim)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            BCS · University of Adelaide · expected July 2026
          </div>
        </Reveal>
      </div>
    </section>
  )
}
