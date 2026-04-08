import type { MetadataRoute } from 'next'
import { PROJECTS } from '@/lib/projects'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...projectRoutes,
  ]
}
