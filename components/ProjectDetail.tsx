'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/lib/projects'

const TAG_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: '#38BDF8',
  border: '1px solid rgba(56,189,248,0.25)',
  padding: '3px 8px',
  borderRadius: '4px',
  fontFamily: 'var(--font-jetbrains-mono), monospace',
}

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'clamp(24px, 5vw, 80px) 24px',
        color: '#F0F4FF',
      }}
    >
      {/* Back */}
      <a
        href="/"
        style={{
          display: 'inline-block',
          marginBottom: '40px',
          fontSize: '12px',
          color: '#7CFFD4',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          textDecoration: 'none',
          letterSpacing: '0.05em',
        }}
      >
        ← Observatory
      </a>

      {/* Hero */}
      <div
        style={{
          background: project.primaryColor + '11',
          border: `1px solid ${project.primaryColor}33`,
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '40px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 600,
            lineHeight: 1.15,
            marginBottom: '12px',
          }}
        >
          {project.title}
        </h1>
        <p style={{ color: '#CBD5E1', lineHeight: 1.7, marginBottom: '16px' }}>
          {project.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {project.stack.map((t) => (
            <span key={t} style={TAG_STYLE}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...TAG_STYLE, color: '#7CFFD4', borderColor: 'rgba(124,255,212,0.3)', textDecoration: 'none', padding: '6px 16px' }}
            >
              Live Demo ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...TAG_STYLE, textDecoration: 'none', padding: '6px 16px' }}
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>

      {/* Sections */}
      <Section title="Problem">
        <p style={{ color: '#CBD5E1', lineHeight: 1.7 }}>{project.problem}</p>
      </Section>

      <Section title="Role">
        <p style={{ color: '#CBD5E1', lineHeight: 1.7 }}>{project.role}</p>
      </Section>

      {project.aiAngle && (
        <Section title="AI Angle">
          <p style={{ color: '#CBD5E1', lineHeight: 1.7 }}>{project.aiAngle}</p>
        </Section>
      )}

      {/* Screenshots gallery */}
      {project.images.length > 0 && (
        <Section title="Gallery">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {project.images.map((src) => (
              <button
                key={src}
                onClick={() => setLightboxSrc(src)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'none',
                  padding: 0,
                }}
              >
                <img
                  src={src}
                  alt={project.title}
                  style={{ width: '100%', display: 'block', objectFit: 'cover', height: '140px' }}
                />
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSrc(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(3,2,10,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
            }}
          >
            <img
              src={lightboxSrc}
              alt="Full size"
              style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section style={{ marginBottom: '36px' }}>
      <h2
        style={{
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '11px',
          color: '#7CFFD4',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
