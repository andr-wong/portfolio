export interface Project {
  slug: string
  title: string
  description: string
  longDescription: string
  stack: string[]
  role: string
  problem: string
  aiAngle?: string
  demoUrl?: string
  githubUrl?: string
  images: string[]
  featured: boolean
  primaryColor: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'mapster',
    title: 'Mapster',
    description: 'Single map for everything happening in Adelaide. Built across one hackathon weekend — 2nd Place at CSC × UPC 2025.',
    longDescription: 'Mapster aggregates 100+ events from 6 sources including council sites, university calendars, and social platforms. A FastAPI scraping layer de-duplicates events using Supabase, then feeds a SvelteKit front-end built on Mapbox GL. OpenAI Vision parses physical poster images into structured event data.',
    stack: ['SvelteKit', 'FastAPI', 'Supabase', 'Mapbox GL', 'OpenAI'],
    role: 'Full-stack developer — scraper architecture + front-end',
    problem: 'Adelaide has no single source of truth for local events. Information is scattered across council sites, Facebook events, university portals, and physical posters.',
    aiAngle: 'Used OpenAI Vision to parse photos of physical event posters into structured JSON — date, time, location, description — dramatically expanding coverage without manual data entry.',
    demoUrl: 'https://mapster.city',
    githubUrl: 'https://github.com/andr-wong',
    images: [],
    featured: true,
    primaryColor: '#00FF99',
  },
  {
    slug: 'headcount',
    title: 'Headcount',
    description: 'Replaced a manual WhatsApp chain used to coordinate Sunday attendance at Hope Church Adelaide.',
    longDescription: 'Tap-to-count, paste-to-import roster lists, and calendar-based attendance reports. Full authentication with role-based access — only service leaders can edit. A Supabase Edge Function posts a changelog to a private channel on every git commit, keeping non-technical coordinators informed without a dashboard login.',
    stack: ['Vanilla JS', 'Supabase', 'Supabase Edge Functions'],
    role: 'Solo developer — product, design, and engineering',
    problem: 'Sunday attendance was coordinated via a WhatsApp chain — error-prone, unarchived, and dependent on a single volunteer\'s availability. No historical data existed.',
    demoUrl: 'https://headcount.andrwong.com',
    images: [],
    featured: true,
    primaryColor: '#7dd3fc',
  },
  {
    slug: 'hcf-transport',
    title: 'HCF Transport',
    description: 'Church and lifegroup transport coordinator. Assigns passengers to drivers using Dijkstra over real OSRM routes.',
    longDescription: 'Saves driver and passenger addresses, supports multiple groups and configurable destinations, and assigns passengers to drivers using Dijkstra over real OSRM road-distance routing. High-priority passengers (elderly, mobility-limited) are assigned first, then the algorithm minimises total distance across the remaining assignments. Persistent storage via Zustand + localStorage.',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'MapLibre GL', 'OSRM', 'Zustand', 'shadcn/ui'],
    role: 'Solo developer — algorithm design, UI, and deployment',
    problem: 'Church transport coordination was managed in a spreadsheet with manual distance estimates. Routes were suboptimal and the process took ~30 minutes each week.',
    images: [],
    featured: true,
    primaryColor: '#a78bfa',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured).slice(0, 2)
}
