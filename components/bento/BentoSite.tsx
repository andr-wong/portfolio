'use client';

import { useEffect, useState } from 'react';
import { BENTO, BENTO_PERSONAL } from './data';
import { useBentoMotion } from './useBentoMotion';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';
import { PersonalWidget } from './PersonalWidget';
import ContactForm from './ContactForm';

type Variant = 'daybreak' | 'eclipse';
type Page = 'work' | 'personal';

interface BentoSiteProps {
  variant: Variant;
  page: Page;
}

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v6.47z" />
  </svg>
);

const GoArrow = () => (
  <span className="go" aria-hidden="true">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 11 11 5M5 5h6v6" />
    </svg>
  </span>
);

const TileLink = ({ href, label }: { href: string; label: string }) => (
  <a className="tile-cover" href={href} target="_blank" rel="noreferrer" aria-label={label} />
);

const Chips = ({ items }: { items: string[] }) => (
  <div className="chips">
    {items.map((s) => (
      <span className="chip" key={s}>
        {s}
      </span>
    ))}
  </div>
);

const Band = ({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) => (
  <section className="band">
    {eyebrow && (
      <div className="band-head">
        <span className="eyebrow">{eyebrow}</span>
        <span className="rule" />
      </div>
    )}
    {children}
  </section>
);

export default function BentoSite({ variant, page }: BentoSiteProps) {
  const isWork = page === 'work';
  const d = isWork ? BENTO : BENTO_PERSONAL;
  const stats = isWork ? BENTO.stats : BENTO_PERSONAL.stats;
  const { ref, shown, time, counts } = useBentoMotion(stats);
  const [contactOpen, setContactOpen] = useState(false);

  // Eclipse: cursor spotlight tracks across the tall scrollable page
  useEffect(() => {
    if (variant !== 'eclipse') return;
    const root = ref.current;
    if (!root) return;
    const spot = root.querySelector('.spotlight') as HTMLElement | null;
    if (!spot) return;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      spot.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      spot.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    };
    root.addEventListener('pointermove', onMove);
    return () => root.removeEventListener('pointermove', onMove);
  }, [variant, page, ref]);

  const PARTICLE_WORDS = ['AW', "CS '26", 'Adelaide', 'Builder'];

  const Portrait = ({ dly }: { dly: string }) => (
    <section className="tile portrait particle-portrait" style={{ '--d': dly } as React.CSSProperties}>
      <ParticleTextEffect
        words={PARTICLE_WORDS}
        interval={300}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 'inherit' }}
      />
      <div className="ploc" style={{ position: 'relative', zIndex: 1 }}>
        <span className="mono">{isWork ? BENTO.location.city : BENTO_PERSONAL.location.city}</span>
      </div>
    </section>
  );

  const Clock = ({ dly }: { dly: string }) => (
    <section className="tile clock" style={{ '--d': dly } as React.CSSProperties}>
      <div className="label">Local · ACST</div>
      <div className="time">{time}</div>
      <div className="label dimlbl">
        {isWork ? BENTO.location.meta : BENTO_PERSONAL.location.meta}
      </div>
    </section>
  );

  const Stats = ({ dly }: { dly: string }) => (
    <section className="tile stats" style={{ '--d': dly } as React.CSSProperties}>
      {stats.map((s, i) => (
        <div className="stat" key={i}>
          <div className="num">
            {counts[i]}
            {s.suffix}
          </div>
          <div className="cap">{s.cap}</div>
        </div>
      ))}
    </section>
  );

  const contact = isWork ? BENTO.contact : BENTO_PERSONAL.contact;

  const Contact = ({ dly, line }: { dly: string; line: string }) => (
    <section className="tile contact" style={{ '--d': dly } as React.CSSProperties}>
      <div className="cleft">
        <div className="label clbl">Let&apos;s talk</div>
        <div className="cline">{line}</div>
      </div>
      <div className="cright">
        <button className="mail" onClick={() => setContactOpen(true)}>
          Send a message
        </button>
        <div className="socials">
          <a className="soc" href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a className="soc" href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
      </div>
    </section>
  );

  const renderWork = () => {
    const p = BENTO.projects;
    return (
      <>
        <Band>
          <div className="band-grid bg-hero">
            <section className="tile hero" style={{ '--d': '0ms' } as React.CSSProperties}>
              {variant === 'daybreak' && <div className="sheen" />}
              <div className="status">
                <span className="ping" />
                {BENTO.status}
              </div>
              <div className="hero-body">
                <div className="name">
                  {BENTO.name[0]}
                  <br />
                  <em>{BENTO.name[1]}.</em>
                </div>
                <div className="hero-specialty">Full-Stack &middot; CS &apos;26</div>
                <p className="role">{BENTO.tagline}</p>
              </div>
              <div className="ctas">
                <a className="btn primary" href={`mailto:${BENTO.contact.email}`}>
                  Get in touch
                </a>
                <a className="btn" href={p.mapster.url} target="_blank" rel="noreferrer">
                  View work
                  <svg className="btn-arr" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M3 8h10M9 5l4 3-4 3" />
                  </svg>
                </a>
              </div>
            </section>
            <div className="stack">
              <Portrait dly="90ms" />
              <Clock dly="150ms" />
            </div>
          </div>
        </Band>

        <Band eyebrow="By the numbers">
          <div className="band-grid">
            <Stats dly="0ms" />
          </div>
        </Band>

        <Band eyebrow="Selected work">
          <div className="band-grid bg-feature">
            <section className="tile proj feature" style={{ '--d': '0ms' } as React.CSSProperties}>
              {variant === 'daybreak' && <div className="mapbg" />}
              <TileLink href={p.mapster.url!} label={`Open ${p.mapster.name}`} />
              <GoArrow />
              <div className="prow">
                <span className="pn">{p.mapster.tag}</span>
                <span className="award">★ {p.mapster.award}</span>
              </div>
              <div className="pmid">
                <h3>{p.mapster.name}</h3>
                <p>{p.mapster.desc}</p>
              </div>
              <Chips items={p.mapster.stack} />
            </section>
          </div>
          <div className="band-grid bg-duo">
            <section className="tile proj" style={{ '--d': '60ms' } as React.CSSProperties}>
              <TileLink href={p.headcount.url!} label={`Open ${p.headcount.name}`} />
              <GoArrow />
              <div className="prow">
                <span className="pn">{p.headcount.tag}</span>
                <span className="live">
                  <span className="livedot" />
                  live
                </span>
              </div>
              <div className="pmid">
                <h3>{p.headcount.name}</h3>
                <p>{p.headcount.desc}</p>
              </div>
              <Chips items={p.headcount.stack} />
            </section>
            <section className="tile proj quiet" style={{ '--d': '120ms' } as React.CSSProperties}>
              <div className="prow">
                <span className="pn">{p.hcf.tag}</span>
              </div>
              <div className="pmid">
                <h3>{p.hcf.name}</h3>
                <p>{p.hcf.desc}</p>
              </div>
              <Chips items={p.hcf.stack} />
            </section>
          </div>
        </Band>

        <Band eyebrow="Stack & trajectory">
          <div className="band-grid bg-skills">
            <section className="tile skills" style={{ '--d': '0ms' } as React.CSSProperties}>
              <div className="label">Stack · by confidence</div>
              <div className="sklist">
                {BENTO.skills.map(([k, v], i) => (
                  <div className="srow" key={k}>
                    <span className="sk">{k}</span>
                    <span className="track">
                      <span
                        className="fill"
                        style={{
                          transform: shown ? `scaleX(${v / 100})` : 'scaleX(0)',
                          transitionDelay: `${380 + i * 70}ms`,
                        }}
                      />
                    </span>
                    <span className="skpct">{v}%</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="tile tl" style={{ '--d': '90ms' } as React.CSSProperties}>
              <div className="label">Trajectory</div>
              <div className="tsteps">
                {BENTO.timeline.map(([y, t]) => (
                  <div className="tstep" key={y}>
                    <span className="yr">&apos;{y}</span>
                    <span className="td">{t}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Band>

        <Band eyebrow="Get in touch">
          <div className="band-grid bg-nowcontact">
            <section className="tile now" style={{ '--d': '0ms' } as React.CSSProperties}>
              <div className="label">Now</div>
              <div className="nlist">
                {BENTO.now.map(([k, v]) => (
                  <div className="nrow" key={k}>
                    <span className="nk">{k}</span>
                    <span className="nv">{v}</span>
                  </div>
                ))}
              </div>
            </section>
            <Contact dly="90ms" line="Build something durable." />
          </div>
        </Band>
      </>
    );
  };

  const renderPersonal = () => {
    const bp = BENTO_PERSONAL;
    const heroName = (
      <div className="name">
        {bp.headline[0]}
        <br />
        <em>{bp.headline[1]}</em>
      </div>
    );
    return (
      <>
        <Band>
          <div className="band-grid bg-hero">
            <section className="tile hero" style={{ '--d': '0ms' } as React.CSSProperties}>
              {variant === 'daybreak' && <div className="sheen" />}
              <div className="status">
                <span className="ping" />
                {bp.status}
              </div>
              <div className="hero-body">
                {heroName}
                <p className="role">{bp.tagline}</p>
              </div>
              <div className="ctas">
                <a className="btn primary" href={`mailto:${bp.contact.email}`}>
                  Say hi
                </a>
                <a className="btn" href="#work">
                  The work →
                </a>
              </div>
            </section>
            <div className="stack">
              <Portrait dly="90ms" />
              <Clock dly="150ms" />
            </div>
          </div>
        </Band>

        <Band eyebrow="Off the clock">
          <div className="band-grid bg-feature">
            <section className="tile proj feature quiet" style={{ '--d': '0ms' } as React.CSSProperties}>
              <div className="prow">
                <span className="pn">{bp.cook.tag}</span>
              </div>
              <div className="pmid">
                <h3>{bp.cook.name}</h3>
                <p>{bp.cook.desc}</p>
              </div>
              <Chips items={bp.cook.chips} />
            </section>
          </div>
          <div className="band-grid bg-duo">
            <section className="tile proj quiet" style={{ '--d': '60ms' } as React.CSSProperties}>
              <div className="prow">
                <span className="pn">{bp.maps.tag}</span>
              </div>
              <div className="pmid">
                <h3>{bp.maps.name}</h3>
                <p>{bp.maps.desc}</p>
              </div>
              <Chips items={bp.maps.chips} />
            </section>
            <section className="tile proj quiet" style={{ '--d': '120ms' } as React.CSSProperties}>
              <div className="prow">
                <span className="pn">{bp.faith.tag}</span>
              </div>
              <div className="pmid">
                <h3>{bp.faith.name}</h3>
                <p>{bp.faith.desc}</p>
              </div>
              <Chips items={bp.faith.chips} />
            </section>
          </div>
        </Band>

        <Band eyebrow="In rotation">
          <div className="band-grid bg-skills">
            <section className="tile now" style={{ '--d': '0ms' } as React.CSSProperties}>
              <div className="label">In rotation</div>
              <div className="nlist">
                {bp.now.map(([k, v]) => (
                  <div className="nrow" key={k}>
                    <span className="nk">{k}</span>
                    <span className="nv">{v}</span>
                  </div>
                ))}
              </div>
            </section>
            <Stats dly="90ms" />
          </div>
        </Band>

        <Band eyebrow="On loop">
          <div className="band-grid bg-widget">
            <PersonalWidget dly="0ms" />
          </div>
        </Band>

        <Band eyebrow="Lightly held">
          <div className="band-grid bg-principles">
            {bp.principles.map(([k, v], i) => (
              <section
                className="tile princard"
                style={{ '--d': `${i * 70}ms` } as React.CSSProperties}
                key={k}
              >
                <span className="nk">{k}</span>
                <p className="pv">{v}</p>
              </section>
            ))}
          </div>
        </Band>

        <Band eyebrow="Say hello">
          <div className="band-grid bg-nowcontact">
            <section className="tile proj retl quiet" style={{ '--d': '0ms' } as React.CSSProperties}>
              <div className="label">{bp.retail.label}</div>
              <p className="retl-line">{bp.retail.line}</p>
            </section>
            <Contact dly="90ms" line={bp.contactLine} />
          </div>
        </Band>
      </>
    );
  };

  return (
    <div
      className={`bento-${variant} site-bento${shown ? ' in' : ''}`}
      ref={ref}
    >
      {variant === 'eclipse' && <div className="spotlight" />}
      {isWork ? renderWork() : renderPersonal()}
      <ContactForm isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
