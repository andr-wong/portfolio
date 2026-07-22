interface SectionHeadProps {
  eyebrow: string
  title: string
  meta?: string[]
}

export default function SectionHead({ eyebrow, title, meta }: SectionHeadProps) {
  return (
    <div className="section-head reveal in">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 style={{ marginTop: 16 }} dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {meta && (
        <div className="section-meta">
          {meta.map((m) => <span key={m}>{m}</span>)}
        </div>
      )}
    </div>
  )
}
