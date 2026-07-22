import Link from 'next/link'
import Reveal from '@/components/portfolio/Reveal'

export default function ProfessionalContact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal>
          <span className="eyebrow contact-eyebrow">Section 007 — End of file</span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="contact-headline">
            Let&rsquo;s <span className="non-italic" style={{ color: 'var(--accent)' }}>build</span> something durable.
          </h2>
        </Reveal>
        <Reveal delay={250}>
          <div className="contact-email">
            <span>WRITE</span>
            <a href="mailto:andrwong101@gmail.com">andrwong101@gmail.com</a>
          </div>
        </Reveal>
        <Reveal delay={350}>
          <div className="contact-cta">
            <a className="btn btn-primary" href="mailto:andrwong101@gmail.com">
              Get in touch <span className="arrow">→</span>
            </a>
            <Link className="btn" href="/personal">
              See the personal side <span className="arrow">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
