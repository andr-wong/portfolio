import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PROJECTS, getProjectBySlug } from '@/lib/projects'
import ProjectDetail from '@/components/ProjectDetail'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} — Andrew Wong`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Andrew Wong`,
      description: project.description,
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <main
      id="main-content"
      style={{ background: 'var(--bg)', minHeight: '100vh' }}
    >
      <ProjectDetail project={project} />
    </main>
  )
}
