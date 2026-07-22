import Reveal from '@/components/portfolio/Reveal'
import SectionHead from '@/components/portfolio/SectionHead'

const stack = [
  'TypeScript', 'Python', 'C++', 'R', 'MATLAB',
  'React', 'Next.js', 'SvelteKit', 'FastAPI', 'Node',
  'Supabase', 'PostgreSQL', 'Tailwind', 'shadcn/ui',
  'Mapbox GL', 'MapLibre', 'OSRM', 'OpenAI', 'Selenium', 'Vercel', 'Railway',
]

export default function Profile() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionHead
          eyebrow="The short version"
          title="A consulting mindset, <em>wrapped around</em> a software engineer."
          meta={['Section 002', 'Profile']}
        />
        <div className="profile">
          <Reveal>
            <div className="profile-photo">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
              <div className="placeholder">[ Portrait / 4:5 ]</div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="profile-prose">
              <p>
                I build full-stack systems end-to-end — from a Mapbox-driven event map for a hackathon
                weekend to a Dijkstra-based passenger router that quietly replaced a manual spreadsheet
                on Sunday mornings.
              </p>
              <p className="mute" style={{ fontSize: '0.85em' }}>
                The thread across my work is the same: <em>find the boring, manual, error-prone
                process</em> — the WhatsApp chain, the spreadsheet, the copy-pasted poster — and
                replace it with something humane and durable.
              </p>
              <div className="stack-list">
                {stack.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
