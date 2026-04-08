import type { PanelData } from '@/types/panel'

// All panels share the same orbitSpeed so the angular gap between them
// (set by orbitOffset) is preserved permanently. Different speeds cause
// panels to drift into clusters over time.
const ORBIT_SPEED = 0.15

export const PANELS: PanelData[] = [
  {
    id: 'projects',
    label: 'Projects',
    orbitRadius: 3.2,
    orbitSpeed: ORBIT_SPEED,
    orbitOffset: 0,
    orbitInclination: 0.1,
    content: 'projects',
  },
  {
    id: 'about',
    label: 'About',
    orbitRadius: 3.2,
    orbitSpeed: ORBIT_SPEED,
    orbitOffset: Math.PI / 3,
    orbitInclination: -0.15,
    content: 'about',
  },
  {
    id: 'skills',
    label: 'Skills',
    orbitRadius: 3.4,
    orbitSpeed: ORBIT_SPEED,
    orbitOffset: (2 * Math.PI) / 3,
    orbitInclination: 0.2,
    content: 'skills',
  },
  {
    id: 'contact',
    label: 'Contact',
    orbitRadius: 3.2,
    orbitSpeed: ORBIT_SPEED,
    orbitOffset: Math.PI,
    orbitInclination: -0.1,
    content: 'contact',
  },
  {
    id: 'featured-a',
    label: 'Featured',
    orbitRadius: 3.5,
    orbitSpeed: ORBIT_SPEED,
    orbitOffset: (4 * Math.PI) / 3,
    orbitInclination: 0.25,
    content: 'featured-a',
  },
  {
    id: 'featured-b',
    label: 'Featured II',
    orbitRadius: 3.3,
    orbitSpeed: ORBIT_SPEED,
    orbitOffset: (5 * Math.PI) / 3,
    orbitInclination: -0.2,
    content: 'featured-b',
  },
]
