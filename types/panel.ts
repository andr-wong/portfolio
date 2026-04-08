export type PanelContent =
  | 'projects'
  | 'about'
  | 'skills'
  | 'contact'
  | 'featured-a'
  | 'featured-b'

export interface PanelData {
  id: string
  label: string
  orbitRadius: number
  orbitSpeed: number
  orbitOffset: number        // initial angle offset in radians
  orbitInclination: number   // tilt from XZ plane in radians
  content: PanelContent
}
