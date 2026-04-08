'use client'

const SKILL_CATEGORIES = [
  {
    label: 'Languages',
    skills: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Bash'],
  },
  {
    label: 'AI / ML',
    skills: ['PyTorch', 'Hugging Face', 'LangChain', 'OpenAI API', 'RAG', 'Fine-tuning'],
  },
  {
    label: 'Full-Stack',
    skills: ['Next.js', 'React', 'FastAPI', 'Node.js', 'PostgreSQL', 'Tailwind'],
  },
  {
    label: 'Infrastructure',
    skills: ['Docker', 'Vercel', 'AWS', 'Git', 'CI/CD'],
  },
]

export default function SkillsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {SKILL_CATEGORIES.map(({ label, skills }) => (
        <div key={label}>
          <p
            style={{
              fontSize: '10px',
              color: '#94A3B8',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            {label}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: '11px',
                  color: '#38BDF8',
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  border: '1px solid rgba(56,189,248,0.25)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
