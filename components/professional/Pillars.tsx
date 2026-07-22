import Reveal from '@/components/portfolio/Reveal'
import SectionHead from '@/components/portfolio/SectionHead'

const items = [
  { title: 'Frontend', desc: 'React, Svelte, Next. Care about real interaction details — focus rings, empty states, the things demos skip.' },
  { title: 'Backend', desc: 'FastAPI and Node. Comfortable in Postgres, Supabase auth flows, role-based access, edge functions.' },
  { title: 'Systems', desc: 'C++, algorithms, the side that came from a CS degree and a transferred mech-eng year. Dijkstra in production, on purpose.' },
  { title: 'Data', desc: 'Python and R for analysis. Regression models, web scraping, de-duplication across messy sources at scale.' },
  { title: 'Shipping', desc: 'Vercel, Railway, GitHub Pages. Knowing when to use each. The tool ships when someone is using it on Sunday.' },
  { title: 'Communication', desc: "Three years of retail floor work — JB Hi-Fi, Myer, McDonald's — taught a clarity that no whiteboard interview ever did." },
]

export default function Pillars() {
  return (
    <section className="section" id="strengths">
      <div className="container">
        <SectionHead
          eyebrow="Capability map"
          title="Six surfaces, <em>one engineer.</em>"
          meta={['Section 004', 'Strengths']}
        />
        <Reveal>
          <div className="pillars">
            {items.map((p, i) => (
              <div key={p.title} className="pillar">
                <span className="pillar-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="pillar-title">{p.title}</div>
                <div className="pillar-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
