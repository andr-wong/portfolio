import Reveal from '@/components/portfolio/Reveal'

const items = [
  { label: 'Reading', value: 'Designing Data-Intensive Applications', meta: 'Slow burn · 2026' },
  { label: 'Listening', value: 'Lo-fi house & the occasional film score', meta: "Anything that doesn't pull focus" },
  { label: 'Cooking', value: "Cantonese home-style + whatever's on special", meta: 'See: cheapest-ingredients project' },
  { label: 'Volunteering', value: 'Hope Church Adelaide', meta: 'Sunday roster · transport · welcome' },
]

export default function Now() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal in">
          <div>
            <div className="eyebrow">Right now</div>
            <h2 style={{ marginTop: 16 }}>
              What&rsquo;s <em>currently in rotation.</em>
            </h2>
          </div>
          <div className="section-meta">
            <span>Section 001 / personal</span>
          </div>
        </div>
        <Reveal>
          <div className="now">
            {items.map((item) => (
              <div key={item.label} className="now-card">
                <div className="now-label">{item.label}</div>
                <div className="now-value">{item.value}</div>
                <div className="now-meta">{item.meta}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
