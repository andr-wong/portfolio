'use client'

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  done: boolean
}

export default function LoadingScreen({ done }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true)
  // Stagger the text lines in
  const [showGreeting, setShowGreeting] = useState(false)
  const [showSub, setShowSub] = useState(false)
  const [showMeta, setShowMeta] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowGreeting(true), 300)
    const t2 = setTimeout(() => setShowSub(true), 900)
    const t3 = setTimeout(() => setShowMeta(true), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setVisible(false), 750)
      return () => clearTimeout(t)
    }
  }, [done])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#03020A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: done ? 0 : 1,
        transition: 'opacity 0.7s ease',
        pointerEvents: done ? 'none' : 'all',
        padding: '24px',
      }}
    >
      {/* Corner bracket decoration — top left */}
      <div style={{ position: 'absolute', top: 32, left: 32 }}>
        <CornerBracket />
      </div>
      {/* Corner bracket decoration — bottom right (rotated) */}
      <div style={{ position: 'absolute', bottom: 32, right: 32, transform: 'rotate(180deg)' }}>
        <CornerBracket />
      </div>

      {/* System label */}
      <p style={MONO_LABEL} aria-hidden="true">
        PORTFOLIO / v2026.1
      </p>

      {/* Main greeting */}
      <h1
        style={{
          ...fadeIn(showGreeting),
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 700,
          color: '#F0F4FF',
          margin: '16px 0 0',
          textAlign: 'center',
          letterSpacing: '-0.02em',
          lineHeight: 1.15,
        }}
      >
        Hi, I&apos;m{' '}
        <span style={{ color: '#7CFFD4' }}>Andrew</span>.
      </h1>

      {/* Sub-heading */}
      <p
        style={{
          ...fadeIn(showSub),
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: '#94A3B8',
          margin: '12px 0 0',
          textAlign: 'center',
          fontWeight: 400,
        }}
      >
        Software Engineer &mdash; AI &amp; Full-Stack
      </p>

      {/* Welcome tag */}
      <p
        style={{
          ...fadeIn(showSub),
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '13px',
          color: '#38BDF8',
          margin: '8px 0 0',
          textAlign: 'center',
          letterSpacing: '0.04em',
        }}
      >
        Welcome to my portfolio
      </p>

      {/* Divider */}
      <div
        style={{
          ...fadeIn(showMeta),
          width: 'min(320px, 80vw)',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(124,255,212,0.3), transparent)',
          margin: '32px 0',
        }}
      />

      {/* Meta info row */}
      <div
        style={{
          ...fadeIn(showMeta),
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { label: 'Based in', value: 'Sydney, AU' },
          { label: 'Open to', value: 'Grad Roles' },
          { label: 'Focus', value: 'AI Engineering' },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ ...MONO_LABEL, marginBottom: '4px' }}>{label}</p>
            <p
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '13px',
                color: '#E2E8F0',
                margin: 0,
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div
        style={{
          ...fadeIn(showMeta),
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '48px',
        }}
      >
        <div style={{ display: 'flex', gap: '5px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#7CFFD4',
                animation: `obs-dot 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <p
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '11px',
            color: 'rgba(124,255,212,0.45)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Loading Observatory
        </p>
      </div>

      <style>{`
        @keyframes obs-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function CornerBracket() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M0 12 L0 0 L12 0" stroke="rgba(124,255,212,0.25)" strokeWidth="1" />
    </svg>
  )
}

const MONO_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-jetbrains-mono), monospace',
  fontSize: '10px',
  color: 'rgba(124,255,212,0.4)',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  margin: 0,
}

function fadeIn(show: boolean): React.CSSProperties {
  return {
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(8px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  }
}
