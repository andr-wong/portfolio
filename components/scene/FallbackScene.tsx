'use client'

// 2D fallback rendered when WebGL is unavailable or viewport < 768px

export default function FallbackScene() {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--observatory-void)' }}
    >
      {/* Floating glass panels */}
      <div className="grid gap-4 p-6 w-full max-w-2xl">
        {['Projects', 'About', 'Skills', 'Contact'].map((label, i) => (
          <div
            key={label}
            className="glass-panel p-6 rounded-lg animate-float"
            style={{
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <h2
              className="font-mono text-sm"
              style={{ color: 'var(--observatory-mint)' }}
            >
              {label}
            </h2>
          </div>
        ))}
      </div>

      {/* Nameplate */}
      <div className="absolute bottom-12 text-center">
        <h1
          className="font-sans text-4xl font-semibold"
          style={{ color: 'var(--observatory-text)' }}
        >
          Andrew Wong
        </h1>
        <p
          className="font-mono text-sm mt-2"
          style={{ color: 'var(--observatory-muted)' }}
        >
          AI Engineer · Full-Stack Developer · CS Graduate 2025
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
