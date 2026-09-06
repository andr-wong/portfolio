import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudyBar from '@/components/casestudy/CaseStudyBar'
import CaseStudyPage from '@/components/casestudy/CaseStudyPage'
import { CASE_STUDIES, CASE_STUDY_SLUGS } from '@/components/casestudy/data'

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
  return {
    title: `${study.name} — Andrew Wong`,
    description: study.tagline,
    openGraph: { title: `${study.name} — Andrew Wong`, description: study.tagline },
    twitter: { card: 'summary', title: `${study.name} — Andrew Wong`, description: study.tagline },
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
