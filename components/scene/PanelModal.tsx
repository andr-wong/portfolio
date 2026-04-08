'use client'

import { useEffect, useCallback, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PanelContent } from '@/types/panel'

const AboutPanel = lazy(() => import('@/components/panels/AboutPanel'))
const SkillsPanel = lazy(() => import('@/components/panels/SkillsPanel'))
const ContactPanel = lazy(() => import('@/components/panels/ContactPanel'))
const ProjectsPanel = lazy(() => import('@/components/panels/ProjectsPanel'))
const FeaturedProjectPanel = lazy(
  () => import('@/components/panels/FeaturedProjectPanel')
)

const PANEL_TITLES: Record<PanelContent, string> = {
  projects: 'Projects',
  about: 'About',
  skills: 'Skills',
  contact: 'Contact',
  'featured-a': 'Featured',
  'featured-b': 'Featured II',
}

function PanelContent({ content }: { content: PanelContent }) {
  switch (content) {
    case 'about':    return <AboutPanel />
    case 'skills':   return <SkillsPanel />
    case 'contact':  return <ContactPanel />
    case 'projects': return <ProjectsPanel />
    case 'featured-a': return <FeaturedProjectPanel index={0} />
    case 'featured-b': return <FeaturedProjectPanel index={1} />
  }
}

interface PanelModalProps {
  activePanelId: string | null
  panelContent: PanelContent | null
  onClose: () => void
}

export default function PanelModal({
  activePanelId,
  panelContent,
  onClose,
}: PanelModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <AnimatePresence>
      {activePanelId && panelContent && (
        <motion.div
          key={activePanelId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(3, 2, 10, 0.65)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal card */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={panelContent ? PANEL_TITLES[panelContent] : 'Panel'}
            style={{
              position: 'relative',
              width: 'min(560px, 90vw)',
              maxHeight: '80vh',
              overflowY: 'auto',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(124,255,212,0.2)',
              borderRadius: '12px',
              padding: '32px',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '18px',
                lineHeight: 1,
                cursor: 'none',
              }}
            >
              ✕
            </button>

            <h2
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '22px',
                color: '#F0F4FF',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              {PANEL_TITLES[panelContent]}
            </h2>

            <Suspense
              fallback={
                <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'monospace' }}>
                  Loading...
                </p>
              }
            >
              <PanelContent content={panelContent} />
            </Suspense>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
