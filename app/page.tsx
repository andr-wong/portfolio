import type { Metadata } from 'next'
import PortfolioApp from '@/components/bento/PortfolioApp'

export const metadata: Metadata = {
  title: 'Andrew Wong',
  description:
    'Portfolio of Andrew Wong, final-year CS student at the University of Adelaide. Building real systems that ship — Adelaide / Remote.',
}

export default function HomePage() {
  return <PortfolioApp />
}
