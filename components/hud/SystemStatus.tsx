'use client'

const STATUS_LINES = [
  { label: 'SYS', value: 'ONLINE' },
  { label: 'AI', value: 'ACTIVE' },
  { label: 'VERSION', value: '2026.1' },
  { label: 'MODE', value: 'OBSERVATORY' },
]

export default function SystemStatus() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: '11px',
        color: '#94A3B8',
        letterSpacing: '0.1em',
        lineHeight: 1.8,
        textAlign: 'right',
        userSelect: 'none',
      }}
    >
      {STATUS_LINES.map(({ label, value }) => (
        <div key={label}>
          <span style={{ opacity: 0.5 }}>{label}: </span>
          <span style={{ color: '#7CFFD4' }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
