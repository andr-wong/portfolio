import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { BENTO } from '@/components/bento/data'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.dev'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Andrew Wong — Software Engineer',
  description:
    'Portfolio of Andrew Wong, CS student at the University of Adelaide specialising in software engineering and AI. Adelaide / Remote.',
  openGraph: {
    title: 'Andrew Wong — Software Engineer',
    description:
      'CS student at the University of Adelaide specialising in software engineering and AI.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: `${BENTO.name[0]} ${BENTO.name[1]}`,
              url: SITE_URL,
              email: `mailto:${BENTO.contact.email}`,
              jobTitle: 'Software Engineer',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Adelaide',
                addressRegion: 'SA',
                addressCountry: 'AU',
              },
              sameAs: [BENTO.contact.github, BENTO.contact.linkedin],
            }),
          }}
        />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
