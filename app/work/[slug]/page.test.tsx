// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import WorkCaseStudyPage, { generateMetadata, generateStaticParams } from './page'
import { CASE_STUDY_SLUGS } from '@/components/casestudy/data'

describe('generateStaticParams', () => {
  it('returns exactly the known case-study slugs', () => {
    expect(generateStaticParams()).toEqual(CASE_STUDY_SLUGS.map((slug) => ({ slug })))
  })
})

describe('generateMetadata', () => {
  it('returns the case study title/description for a known slug', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'headcount' }) })
    expect(meta.title).toBe('Headcount — Andrew Wong')
    expect(meta.description).toContain('WhatsApp attendance')
  })

  it('returns empty metadata for an unknown slug', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'nope' }) })
    expect(meta).toEqual({})
  })
})

describe('WorkCaseStudyPage', () => {
  it('renders the case study for a known slug', async () => {
    const el = await WorkCaseStudyPage({ params: Promise.resolve({ slug: 'mapster' }) })
    expect(el).toBeTruthy()
  })

  it('calls notFound() for an unknown slug', async () => {
    await expect(
      WorkCaseStudyPage({ params: Promise.resolve({ slug: 'nope' }) })
    ).rejects.toThrow()
  })
})
