import Reveal from '@/components/portfolio/Reveal'

const notes = [
  {
    title: 'On shipping',
    body: "A tool is a tool when someone else uses it on Sunday morning without asking me how. Not before.",
  },
  {
    title: 'On stack',
    body: 'Pick the smallest thing that makes the next six months pleasant. I will defend Vanilla JS in mixed company.',
  },
  {
    title: 'On Adelaide',
    body: 'Quietly the best place to build software in. Underrated coffee, real seasons, no hyperscaler distraction.',
  },
  {
    title: 'On retail jobs',
    body: 'Three years on a sales floor will improve your engineering communication more than any book on the subject.',
  },
]

export default function Notes() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal in">
          <div>
            <div className="eyebrow">Field notes</div>
            <h2 style={{ marginTop: 16 }}>
              A few <em>opinions</em>, lightly held.
            </h2>
          </div>
          <div className="section-meta">
            <span>Section 003 / personal</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {notes.map((note, i) => (
            <Reveal key={note.title} delay={i * 80}>
              <div className="note-card">
                <div className="eyebrow" style={{ marginBottom: 14 }}>{note.title}</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 22px)', lineHeight: 1.45 }}>
                  {note.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
