'use client'

import { PROJECTS } from '@/lib/projects'

export default function ProjectsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {PROJECTS.map((project) => (
        <a
          key={project.slug}
          href={`/projects/${project.slug}`}
          style={{
            display: 'block',
            padding: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            textDecoration: 'none',
            pointerEvents: 'auto',
            transition: 'border-color 0.2s',
          }}
        >
          {/* Thumbnail swatch when no image */}
          {project.images.length === 0 && (
            <div
              style={{
                width: '100%',
                height: '60px',
                borderRadius: '4px',
                background: project.primaryColor + '22',
                border: `1px solid ${project.primaryColor}44`,
                marginBottom: '8px',
              }}
            />
          )}

          <h3
            style={{
              fontSize: '13px',
              color: '#F0F4FF',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            {project.title}
          </h3>
          <p
            style={{
              fontSize: '11px',
              color: '#94A3B8',
              lineHeight: 1.5,
              marginBottom: '8px',
            }}
          >
            {project.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {project.stack.slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '11px',
                  color: '#38BDF8',
                  border: '1px solid rgba(56,189,248,0.2)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  )
}
