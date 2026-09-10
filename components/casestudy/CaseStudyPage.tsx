import Link from 'next/link';
import type { CaseStudy } from './data';

export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  return (
    <div className="paper-doc in casestudy-doc">
      <section className="title-block">
        <h1 className="paper-title">{study.name}</h1>
        <p className="paper-subtitle">{study.tagline}</p>
        <p className="byline mono">
          {study.meta} &middot;{' '}
          <a href={study.liveUrl} target="_blank" rel="noreferrer">
            {study.host} &#8599;
          </a>
        </p>
        <p className="keywords mono">
          <span className="kw-label">Stack:</span> {study.stack.join(', ')}
        </p>
      </section>

      <div className="casestudy-body">
        {study.sections.map((section, i) => (
          <section className="pspec" key={section.heading}>
            <h2>
              <span className="secnum mono">&sect;{i + 1}</span> {section.heading}
            </h2>
            {section.paragraphs.map((p, j) => (
              <p className="prose-text" key={j}>
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <p className="mono see-also casestudy-nav">
        <Link href="/">&larr; Back to the full portfolio</Link> &middot;{' '}
        <a href={study.liveUrl} target="_blank" rel="noreferrer">
          Visit {study.name} &#8599;
        </a>
      </p>

      <footer className="doc-footer mono">p. 1 of 1 &middot; compiled 2026 &middot; Andrew Wong</footer>
    </div>
  );
}
