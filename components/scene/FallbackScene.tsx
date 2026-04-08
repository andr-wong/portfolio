'use client'

import { useState } from 'react'
import type { PanelContent } from '@/types/panel'
import PanelModal from './PanelModal'

const PANELS: { label: string; content: PanelContent }[] = [
  { label: 'Projects', content: 'projects' },
  { label: 'About', content: 'about' },
  { label: 'Skills', content: 'skills' },
  { label: 'Contact', content: 'contact' },
]

// 2D fallback rendered when WebGL is unavailable or viewport < 768px
export default function FallbackScene() {
  const [activeContent, setActiveContent] = useState<PanelContent | null>(null)

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--observatory-void)' }}
    >
      {/* Floating glass panels */}
      <div className="grid gap-4 p-6 w-full max-w-2xl">
        {PANELS.map(({ label, content }, i) => (
          <button
            key={label}
            onClick={() => setActiveContent(content)}
            className="glass-panel p-6 rounded-lg animate-float text-left"
            style={{
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              animationDelay: `${i * 0.3}s`,
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,255,212,0.3)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(124,255,212,0.04)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
            }}
          >
            <h2
              className="font-mono text-sm"
              style={{ color: 'var(--observatory-mint)', pointerEvents: 'none' }}
            >
              {label}
            </h2>
          </button>
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

      <PanelModal
        activePanelId={activeContent}
        panelContent={activeContent}
        onClose={() => setActiveContent(null)}
      />

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
