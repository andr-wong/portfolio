'use client'

export default function CompassRing() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      style={{
        animation: 'spin 120s linear infinite',
        opacity: 0.5,
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <circle
        cx="36"
        cy="36"
        r="32"
        stroke="#7CFFD4"
        strokeWidth="0.5"
        opacity="0.6"
      />
      {/* Tick marks every 30° */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180
        const inner = i % 3 === 0 ? 28 : 30
        const x1 = 36 + inner * Math.cos(angle)
        const y1 = 36 + inner * Math.sin(angle)
        const x2 = 36 + 32 * Math.cos(angle)
        const y2 = 36 + 32 * Math.sin(angle)
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#7CFFD4"
            strokeWidth={i % 3 === 0 ? 1 : 0.5}
            opacity="0.6"
          />
        )
      })}
      {/* N indicator */}
      <text
        x="36"
        y="12"
        textAnchor="middle"
        fontSize="7"
        fill="#7CFFD4"
        fontFamily="var(--font-jetbrains-mono), monospace"
        opacity="0.8"
      >
        N
      </text>
    </svg>
  )
}
