import Reveal from '@/components/portfolio/Reveal'

const items = [
  {
    title: 'Cooking on a budget',
    desc: 'My first real web app scraped supermarket prices to find the cheapest ingredients per recipe. The interest predates the project — the project just made it scale.',
  },
  {
    title: 'Maps, routes, geography',
    desc: "I will absolutely spend a Saturday tweaking Mapbox styles. Three of my projects involve a map. This is not a coincidence.",
  },
  {
    title: 'Church community',
    desc: 'Hope Church Adelaide. Most of my software ends up here first — Headcount and the transport router both live in this orbit.',
  },
  {
    title: 'Retail, oddly',
    desc: "Three years across JB Hi-Fi, Myer, and McDonald's. Talking to people about what they actually need before pitching a solution. Translates more directly to engineering than people realise.",
  },
  {
    title: 'Side languages',
    desc: 'C++ for systems courses, R for the fertility regression project, MATLAB for a Scrabble solver because the assignment said so. None of them are my daily driver. All of them rounded the edges off.',
  },
  {
    title: 'Long-form thinking',
    desc: 'Writing through a problem before writing the code. Most of the project pages on the other tab started as a notes file.',
  },
]

export default function Hobbies() {
  return (
    <section className="section" id="hobbies">
      <div className="container">
        <div className="section-head reveal in">
          <div>
            <div className="eyebrow">The longer list</div>
            <h2 style={{ marginTop: 16 }}>
              Things I keep <em>coming back to.</em>
            </h2>
          </div>
          <div className="section-meta">
            <span>Section 002 / personal</span>
          </div>
        </div>
        <Reveal>
          <ul className="list-rule">
            {items.map((item, i) => (
              <li key={item.title}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <div className="item-title">{item.title}</div>
                  <div className="item-desc">{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
