'use client';

import { useEffect, useState } from 'react';
import { BENTO, BENTO_PERSONAL } from './data';
import { useBentoMotion } from './useBentoMotion';
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

const Section = ({
  n,
  title,
  dly,
  children,
}: {
  n: string;
  title: string;
  dly?: string;
  children: React.ReactNode;
}) => (
  <section className="pspec reveal" style={{ '--d': dly ?? '0ms' } as React.CSSProperties}>
    <h2>
      <span className="secnum mono">&sect;{n}</span> {title}
    </h2>
    {children}
  </section>
);

const Figure = ({
  n,
  tag,
  name,
  desc,
  tags,
  host,
  href,
  meta,
  quiet,
  dly,
}: {
  n: string;
  tag: string;
  name: string;
  desc: string;
  tags: string[];
  host?: string;
  href?: string;
  meta?: React.ReactNode;
  quiet?: boolean;
  dly?: string;
}) => (
  <figure
    className={`fig reveal${quiet ? ' quiet' : ''}`}
    style={{ '--d': dly ?? '0ms' } as React.CSSProperties}
  >
    {href && <a className="fig-cover" href={href} target="_blank" rel="noreferrer" aria-label={`Open ${name}`} />}
    <div className="fig-plate mono">FIG. {n}</div>
    <figcaption>
      <span className="fig-tag mono">{tag}</span>
      {meta}
      <h3>{name}</h3>
    </figcaption>
    <p>{desc}</p>
    <p className="fig-meta mono">
      {tags.join(' · ')}
      {host && <span className="fig-doi">doi:{host}</span>}
    </p>
  </figure>
);

export default function BentoSite({ variant, page }: BentoSiteProps) {
  const isWork = page === 'work';
  const stats = isWork ? BENTO.stats : BENTO_PERSONAL.stats;
  const { ref, shown, time, counts } = useBentoMotion(stats);
  const [contactOpen, setContactOpen] = useState(false);

  // Eclipse: cursor spotlight tracks across the tall scrollable page.
  // getBoundingClientRect forces a synchronous layout read, so it must not
  // run on every raw pointermove (which can fire far faster than the
  // display refreshes) — the raw handler only records coordinates, and a
  // single rAF per frame does the measurement and paint.
  useEffect(() => {
    if (variant !== 'eclipse') return;
    const root = ref.current;
    if (!root) return;
    const spot = root.querySelector('.spotlight') as HTMLElement | null;
    if (!spot) return;

    let clientX = 0;
    let clientY = 0;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      spot.style.setProperty('--mx', ((clientX - r.left) / r.width) * 100 + '%');
      spot.style.setProperty('--my', ((clientY - r.top) / r.height) * 100 + '%');
    };
    const onMove = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    root.addEventListener('pointermove', onMove);
    return () => {
      root.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [variant, page, ref]);

  const FigureZero = ({ city }: { city: string }) => (
    <figure className="fig fig-zero reveal" style={{ '--d': '120ms' } as React.CSSProperties}>
      <div className="fig-plate mono">FIG. 0</div>
      <div className="fig-zero-visual" aria-hidden="true">
        <span className="fig-zero-mark">AW</span>
      </div>
      <figcaption className="mono">Subject, identifying marks visible &mdash; {city}.</figcaption>
    </figure>
  );

  const renderWork = () => {
    const p = BENTO.projects;
    const keywords = BENTO.skills
      .slice(0, 5)
      .map(([k]) => k)
      .join(', ');
    return (
      <>
        <section className="title-block reveal">
          <h1 className="paper-title">
            {BENTO.name[0]} <em>{BENTO.name[1]}</em>
          </h1>
          <p className="paper-subtitle">Full-Stack Software Engineer &middot; CS &apos;26 &middot; University of Adelaide</p>
          <p className="byline mono">
            Correspondence: <a href={`mailto:${BENTO.contact.email}`}>{BENTO.contact.email}</a> &middot;{' '}
            {BENTO.location.city} &middot; <span className="live-clock">{time} ACST</span>
          </p>
        </section>

        <section className="abstract-block reveal" style={{ '--d': '60ms' } as React.CSSProperties}>
          <span className="abstract-label mono">Abstract</span>
          <p className="abstract-text">{BENTO.tagline}</p>
          <p className="keywords mono">
            <span className="kw-label">Keywords &mdash;</span> {keywords}
          </p>
          <p className="status-line mono">{BENTO.status} &mdash; under review</p>
        </section>

        <FigureZero city={BENTO.location.city} />

        <div className="paper-body">
          <Section n="1" title="Related work" dly="0ms">
            <table className="spec-table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {BENTO.skills.map(([k, v], i) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td className="mono bar-cell">
                      <span className="bar-track">
                        <span
                          className="bar-fill"
                          style={{
                            transform: shown ? `scaleX(${v / 100})` : 'scaleX(0)',
                            transitionDelay: `${300 + i * 60}ms`,
                          }}
                        />
                      </span>
                      {v}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section n="2" title="Contributions" dly="60ms">
            <Figure
              n="1"
              tag={p.mapster.tag}
              name={p.mapster.name}
              desc={p.mapster.desc}
              tags={p.mapster.stack}
              host={p.mapster.host}
              href={p.mapster.url}
              meta={<span className="fig-award">&#9733; {p.mapster.award}</span>}
              dly="0ms"
            />
            <Figure
              n="2"
              tag={p.headcount.tag}
              name={p.headcount.name}
              desc={p.headcount.desc}
              tags={p.headcount.stack}
              host={p.headcount.host}
              href={p.headcount.url}
              meta={
                <span className="fig-live">
                  <span className="livedot" />
                  live
                </span>
              }
              dly="60ms"
            />
            <Figure
              n="3"
              tag={p.hcf.tag}
              name={p.hcf.name}
              desc={p.hcf.desc}
              tags={p.hcf.stack}
              quiet
              dly="120ms"
            />
          </Section>

          <Section n="3" title="Evaluation" dly="120ms">
            <table className="spec-table results-table">
              <tbody>
                {BENTO.stats.map((s, i) => (
                  <tr key={s.cap}>
                    <td>{s.cap}</td>
                    <td className="mono result-val">
                      {counts[i]}
                      {s.suffix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section n="4" title="Chronology" dly="180ms">
            <ol className="ref-list mono">
              {BENTO.timeline.map(([y, t]) => (
                <li key={y}>
                  <span className="ref-yr">[{y}]</span> {t}
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <section className="correspondence reveal" style={{ '--d': '240ms' } as React.CSSProperties}>
          <h2>
            <span className="secnum mono">&sect;5</span> Correspondence
          </h2>
          <p className="corr-line">
            Build something durable.{' '}
            <button className="btn-corr" onClick={() => setContactOpen(true)}>
              Send correspondence &rarr;
            </button>
          </p>
          <p className="mono see-also">
            See also:{' '}
            <a href={BENTO.contact.github} target="_blank" rel="noreferrer">
              <GithubIcon /> GitHub
            </a>{' '}
            &middot;{' '}
            <a href={BENTO.contact.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
          </p>
        </section>

        <footer className="doc-footer mono">p. 1 of 1 &mdash; compiled 2026 &mdash; Andrew Wong</footer>
      </>
    );
  };

  const renderPersonal = () => {
    const bp = BENTO_PERSONAL;
    const keywords = Array.from(new Set([...bp.cook.chips, ...bp.maps.chips, ...bp.faith.chips])).join(', ');
    return (
      <>
        <section className="title-block reveal">
          <h1 className="paper-title">
            {bp.headline[0]} <em>{bp.headline[1]}</em>
          </h1>
          <p className="paper-subtitle">Personal appendix &middot; off the clock</p>
          <p className="byline mono">
            Correspondence: <a href={`mailto:${bp.contact.email}`}>{bp.contact.email}</a> &middot; {bp.location.city}{' '}
            &middot; <span className="live-clock">{time} ACST</span>
          </p>
        </section>

        <section className="abstract-block reveal" style={{ '--d': '60ms' } as React.CSSProperties}>
          <span className="abstract-label mono">Abstract</span>
          <p className="abstract-text">{bp.tagline}</p>
          <p className="keywords mono">
            <span className="kw-label">Keywords &mdash;</span> {keywords}
          </p>
          <p className="status-line mono">{bp.status}</p>
        </section>

        <FigureZero city={bp.location.city} />

        <div className="paper-body">
          <Section n="1" title="Off the clock" dly="0ms">
            <Figure n="1" tag={bp.cook.tag} name={bp.cook.name} desc={bp.cook.desc} tags={bp.cook.chips} quiet dly="0ms" />
            <Figure n="2" tag={bp.maps.tag} name={bp.maps.name} desc={bp.maps.desc} tags={bp.maps.chips} quiet dly="60ms" />
            <Figure
              n="3"
              tag={bp.faith.tag}
              name={bp.faith.name}
              desc={bp.faith.desc}
              tags={bp.faith.chips}
              quiet
              dly="120ms"
            />
          </Section>

          <Section n="2" title="In rotation" dly="60ms">
            <table className="spec-table">
              <tbody>
                {bp.now.map(([k, v]) => (
                  <tr key={k}>
                    <td className="mono">{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section n="3" title="Personal metrics" dly="120ms">
            <table className="spec-table results-table">
              <tbody>
                {bp.stats.map((s, i) => (
                  <tr key={s.cap}>
                    <td>{s.cap}</td>
                    <td className="mono result-val">
                      {counts[i]}
                      {s.suffix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section n="4" title="Supplementary material" dly="180ms">
            <figure className="fig fig-supp reveal" style={{ '--d': '180ms' } as React.CSSProperties}>
              <div className="fig-plate mono">FIG. S1</div>
              <PersonalWidget dly="0ms" />
            </figure>
          </Section>

          <Section n="5" title="Assumptions" dly="240ms">
            <ol className="ref-list assumptions">
              {bp.principles.map(([k, v]) => (
                <li key={k}>
                  <span className="assum-k mono">{k}</span>
                  <p>{v}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section n="6" title="Limitations" dly="300ms">
            <p className="limitations-text">
              <span className="mono limit-label">{bp.retail.label}.</span> {bp.retail.line}
            </p>
          </Section>
        </div>

        <section className="correspondence reveal" style={{ '--d': '360ms' } as React.CSSProperties}>
          <h2>
            <span className="secnum mono">&sect;7</span> Correspondence
          </h2>
          <p className="corr-line">
            {bp.contactLine}{' '}
            <button className="btn-corr" onClick={() => setContactOpen(true)}>
              Send correspondence &rarr;
            </button>
          </p>
          <p className="mono see-also">
            See also:{' '}
            <a href={bp.contact.github} target="_blank" rel="noreferrer">
              <GithubIcon /> GitHub
            </a>{' '}
            &middot;{' '}
            <a href={bp.contact.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
          </p>
        </section>

        <footer className="doc-footer mono">p. 1 of 1 &mdash; compiled 2026 &mdash; Andrew Wong</footer>
      </>
    );
  };

  return (
    <div className={`paper-doc${shown ? ' in' : ''}`} ref={ref}>
      {/* Always rendered so the markup is theme-independent; CSS reveals it
          only under :root[data-mode="dark"]. */}
      <div className="spotlight" />
      {isWork ? renderWork() : renderPersonal()}
      {contactOpen && <ContactForm onClose={() => setContactOpen(false)} />}
    </div>
  );
}
