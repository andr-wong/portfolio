'use client'

const LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/andrwong' },
  { label: 'GitHub', href: 'https://github.com/andrwong' },
  { label: 'Resume', href: '/resume.pdf' },
]

export default function AboutPanel() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        {/* Avatar placeholder */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(124,255,212,0.1)',
            border: '1px solid rgba(124,255,212,0.3)',
            flexShrink: 0,
          }}
        />
        <div>
          <p
            style={{
              fontSize: '13px',
              color: '#7CFFD4',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              marginBottom: '2px',
            }}
          >
            Andrew Wong
          </p>
          <p
            style={{
              fontSize: '11px',
              color: '#94A3B8',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
            }}
          >
            Open to grad roles — Sydney / Remote
          </p>
        </div>
      </div>

      <p
        style={{
          fontSize: '13px',
          color: '#CBD5E1',
          lineHeight: 1.7,
          marginBottom: '20px',
        }}
      >
        CS graduate from UNSW, specialising in AI engineering and full-stack
        development. I build systems that use machine learning to solve real
        problems — from RAG pipelines to production web apps. I care about
        shipping code that works for actual people.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            style={{
              fontSize: '11px',
              color: '#38BDF8',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              textDecoration: 'none',
              border: '1px solid rgba(56,189,248,0.3)',
              padding: '4px 10px',
              borderRadius: '4px',
              transition: 'border-color 0.2s',
              pointerEvents: 'auto',
            }}
          >
            {label} ↗
          </a>
        ))}
      </div>
    </div>
  )
}
