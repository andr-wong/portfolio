import type { Metadata } from 'next'
import Nav from '@/components/portfolio/Nav'
import ScrollProgress from '@/components/portfolio/ScrollProgress'
import Footer from '@/components/portfolio/Footer'
import BentoHero from '@/components/professional/BentoHero'
import Stats from '@/components/professional/Stats'
import Profile from '@/components/professional/Profile'
import Projects from '@/components/professional/Projects'
import Pillars from '@/components/professional/Pillars'
import Timeline from '@/components/professional/Timeline'
import Education from '@/components/professional/Education'
import ProfessionalContact from '@/components/professional/ProfessionalContact'

export const metadata: Metadata = {
  title: 'Andrew Wong — Software Engineer',
  description:
    'Portfolio of Andrew Wong, final-year CS student at the University of Adelaide. Building real systems that ship — Adelaide / Remote.',
}

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <BentoHero />
        <Stats />
        <Profile />
        <Projects />
        <Pillars />
        <Timeline />
        <Education />
        <ProfessionalContact />
      </main>
      <Footer />
    </>
  )
}
