import type { Metadata } from 'next'
import Link from 'next/link'
import CaseStudyBar from '@/components/casestudy/CaseStudyBar'
import { BENTO } from '@/components/bento/data'

export const metadata: Metadata = {
  title: 'Not found · Andrew Wong',
  description: 'This page does not exist.',
}

export default function NotFound() {
  return (
    <div className="bento-app">
      <CaseStudyBar />
      <div className="bento-site-wrap">
        <div className="paper-doc in casestudy-doc">
          <section className="title-block">
            <h1 className="paper-title">
              404 <em>&middot; not found</em>
            </h1>
            <p className="paper-subtitle">This page doesn&apos;t exist, or the link&apos;s gone stale.</p>
          </section>

          <p className="mono see-also casestudy-nav">
            <Link href="/">&larr; Back to the full portfolio</Link> &middot;{' '}
            <a href={`mailto:${BENTO.contact.email}`}>{BENTO.contact.email}</a>
          </p>

          <footer className="doc-footer mono">p. 1 of 1 &middot; compiled 2026 &middot; Andrew Wong</footer>
        </div>
      </div>
    </div>
  )
}
