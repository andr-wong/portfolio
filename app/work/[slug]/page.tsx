import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudyBar from '@/components/casestudy/CaseStudyBar'
import CaseStudyPage from '@/components/casestudy/CaseStudyPage'
import { CASE_STUDIES, CASE_STUDY_SLUGS } from '@/components/casestudy/data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.com'

export function generateStaticParams() {
  return CASE_STUDY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = CASE_STUDIES[slug]
  if (!study) return {}
  const title = `${study.name} — Andrew Wong`
  const url = `${SITE_URL}/work/${slug}`
  return {
    title,
    description: study.tagline,
    // Without this, these pages silently inherit the root layout's
    // alternates.canonical (the homepage URL) since generateMetadata only
    // overrides fields it explicitly sets — every case-study page would
    // claim "/" as its canonical, telling search engines each one is a
    // duplicate of the homepage rather than a real page worth indexing.
    alternates: { canonical: url },
    openGraph: { title, description: study.tagline, url },
    twitter: { card: 'summary', title, description: study.tagline },
  }
}

export default async function WorkCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = CASE_STUDIES[slug]
  if (!study) notFound()

  return (
    <div className="bento-app">
      <CaseStudyBar />
      <div className="bento-site-wrap">
        <CaseStudyPage study={study} />
      </div>
    </div>
  )
}
