export interface Project {
  slug: string
  title: string
  description: string         // 1-2 sentences
  longDescription: string     // full case study
  stack: string[]
  role: string
  problem: string
  aiAngle?: string
  demoUrl?: string
  githubUrl?: string
  images: string[]            // paths under /public/projects/[slug]/
  featured: boolean
  primaryColor: string        // fallback swatch hex when image is missing
}

// TODO: Replace with your real projects before launch
export const PROJECTS: Project[] = [
  {
    slug: 'project-alpha',
    title: 'Project Alpha',
    description: 'An AI-powered tool that does something useful.',
    longDescription: 'Full case study coming soon.',
    stack: ['Next.js', 'Python', 'OpenAI', 'PostgreSQL'],
    role: 'Solo developer — full stack + ML pipeline',
    problem: 'Describe the problem here.',
    aiAngle: 'Used GPT-4 for X, resulting in Y% improvement.',
    demoUrl: undefined,
    githubUrl: undefined,
    images: [],
    featured: true,
    primaryColor: '#7CFFD4',
  },
  {
    slug: 'project-beta',
    title: 'Project Beta',
    description: 'Another project worth showcasing.',
    longDescription: 'Full case study coming soon.',
    stack: ['React', 'FastAPI', 'TypeScript'],
    role: 'Solo developer',
    problem: 'Describe the problem here.',
    aiAngle: undefined,
    demoUrl: undefined,
    githubUrl: undefined,
    images: [],
    featured: true,
    primaryColor: '#C084FC',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured).slice(0, 2)
}
