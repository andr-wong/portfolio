'use client'

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  done: boolean
}

export default function LoadingScreen({ done }: LoadingScreenProps) {
  // Two-stage removal: first fade out, then unmount
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (done) {
      // After the CSS transition finishes, remove from the DOM
      const t = setTimeout(() => setVisible(false), 700)
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
        gap: '28px',
        opacity: done ? 0 : 1,
        transition: 'opacity 0.65s ease',
        pointerEvents: done ? 'none' : 'all',
      }}
    >
      {/* Pulsing ring + initials */}
      <div style={{ position: 'relative', width: 72, height: 72 }}>
        {/* Outer ring — slow pulse */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1px solid rgba(124,255,212,0.25)',
            animation: 'obs-ping 2s ease-in-out infinite',
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: 'absolute',
            inset: 6,
            borderRadius: '50%',
            border: '1px solid rgba(124,255,212,0.5)',
            animation: 'obs-ping 2s ease-in-out infinite 0.4s',
          }}
        />
        {/* Core circle */}
        <div
          style={{
            position: 'absolute',
            inset: 12,
            borderRadius: '50%',
            background: 'rgba(124,255,212,0.08)',
            border: '1px solid rgba(124,255,212,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: '#7CFFD4',
              letterSpacing: '0.05em',
            }}
          >
            AW
          </span>
        </div>
      </div>

      {/* Status line */}
      <p
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '11px',
          color: 'rgba(124,255,212,0.5)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: 0,
          animation: 'obs-blink 1.4s ease-in-out infinite',
        }}
      >
        Initialising Observatory
      </p>

      <style>{`
        @keyframes obs-ping {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes obs-blink {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.75; }
        }
      `}</style>
    </div>
  )
}
