import type { MetadataRoute } from 'next'
import { CASE_STUDY_SLUGS } from '@/components/casestudy/data'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    {
      url: BASE,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...CASE_STUDY_SLUGS.map((slug) => ({
      url: `${BASE}/work/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
