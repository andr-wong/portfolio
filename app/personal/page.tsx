import type { Metadata } from 'next'
import Nav from '@/components/portfolio/Nav'
import ScrollProgress from '@/components/portfolio/ScrollProgress'
import Footer from '@/components/portfolio/Footer'
import HeroPersonal from '@/components/personal/HeroPersonal'
import PersonalBento from '@/components/personal/PersonalBento'
import Now from '@/components/personal/Now'
import Hobbies from '@/components/personal/Hobbies'
import Notes from '@/components/personal/Notes'
import PersonalContact from '@/components/personal/PersonalContact'

export const metadata: Metadata = {
  title: 'Andrew Wong — Personal',
  description: 'The off-clock side of Andrew Wong. Cooking, maps, church, and long Adelaide afternoons.',
}

export default function PersonalPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <HeroPersonal />
        <PersonalBento />
        <Now />
        <Hobbies />
        <Notes />
        <PersonalContact />
      </main>
      <Footer />
    </>
  )
}
