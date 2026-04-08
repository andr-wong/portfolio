'use client'

import { getFeaturedProjects } from '@/lib/projects'

interface FeaturedProjectPanelProps {
  index: 0 | 1
}

export default function FeaturedProjectPanel({ index }: FeaturedProjectPanelProps) {
  const featured = getFeaturedProjects()
  const project = featured[index]

  if (!project) {
    return (
      <p style={{ color: '#94A3B8', fontSize: '12px', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
        No featured project configured. Add one in lib/projects.ts.
      </p>
    )
  }

  return (
    <div>
      {/* Swatch / thumbnail */}
      <div
        style={{
          width: '100%',
          height: '80px',
          borderRadius: '6px',
          background: project.primaryColor + '22',
          border: `1px solid ${project.primaryColor}44`,
          marginBottom: '16px',
        }}
      />

      <h3
        style={{
          fontSize: '16px',
          color: '#F0F4FF',
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontWeight: 600,
          marginBottom: '8px',
        }}
      >
        {project.title}
      </h3>

      <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '12px' }}>
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {project.stack.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: '10px',
              color: '#38BDF8',
              border: '1px solid rgba(56,189,248,0.25)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <a
          href={`/projects/${project.slug}`}
          style={{
            fontSize: '11px',
            color: '#7CFFD4',
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            border: '1px solid rgba(124,255,212,0.3)',
            padding: '6px 14px',
            borderRadius: '4px',
            textDecoration: 'none',
            pointerEvents: 'auto',
          }}
        >
          Case Study →
        </a>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '11px',
              color: '#94A3B8',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              border: '1px solid rgba(148,163,184,0.2)',
              padding: '6px 14px',
              borderRadius: '4px',
              textDecoration: 'none',
              pointerEvents: 'auto',
            }}
          >
            GitHub ↗
          </a>
        )}
      </div>
    </div>
  )
}
