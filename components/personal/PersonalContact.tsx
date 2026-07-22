import Link from 'next/link'
import Reveal from '@/components/portfolio/Reveal'

export default function PersonalContact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <Reveal>
          <span className="eyebrow contact-eyebrow">End of file · personal</span>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="contact-headline">
            Coffee,{' '}
            <span className="non-italic" style={{ color: 'var(--accent)' }}>or</span>{' '}
            code review.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p style={{ marginTop: 28, color: 'var(--fg-mute)', maxWidth: '52ch', marginInline: 'auto' }}>
            Adelaide-based. Happy to chat about graduate roles, weekend hackathons, or
            the right place to sit in a North Adelaide café.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="contact-cta">
            <a className="btn btn-primary" href="mailto:andrwong101@gmail.com">
              Say hi <span className="arrow">→</span>
            </a>
            <Link className="btn" href="/">
              Back to the work <span className="arrow">→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
