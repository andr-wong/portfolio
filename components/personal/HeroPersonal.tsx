export default function HeroPersonal() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-meta">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Index</span>
            <span className="hero-meta-value">002 — Personal</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Mood</span>
            <span className="hero-meta-value">Glad you&rsquo;re here.</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Currently</span>
            <span className="hero-meta-value">Coffee · code · church on Sundays</span>
          </div>
        </div>

        <h1 className="hero-title display personal-hero-title">
          <span className="word"><span>off the</span></span>{' '}
          <span className="word"><span className="italic">clock.</span></span>
        </h1>

        <p className="hero-statement">
          Same person, lower contrast. Here&rsquo;s what I do{' '}
          <em>when nothing&rsquo;s shipping</em> — the music, the food, the volunteer
          work, and the long Adelaide afternoons that produced most of the projects on
          the other page.
        </p>
      </div>
    </section>
  )
}
