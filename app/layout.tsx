import type { Metadata } from 'next'
import { Source_Serif_4, IBM_Plex_Mono } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { BENTO } from '@/components/bento/data'
import './globals.css'

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--ff-source-serif',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--ff-ibm-plex-mono',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.dev'

const TITLE = 'Andrew Wong — Software Engineer'
const SHORT_DESCRIPTION =
  'CS student at the University of Adelaide specialising in software engineering and AI.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description:
    'Portfolio of Andrew Wong, CS student at the University of Adelaide specialising in software engineering and AI. Adelaide / Remote.',
  alternates: {
    canonical: SITE_URL,
    types: { 'application/rss+xml': '/feed.xml' },
  },
  openGraph: {
    title: TITLE,
    description: SHORT_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Andrew Wong',
    type: 'website',
  },
  // opengraph-image.tsx and twitter-image are separate file conventions in
  // Next.js — declaring this explicitly (rather than assuming Open Graph
  // tags are enough) is what makes X/Twitter reliably render the same
  // preview card as LinkedIn/Slack/iMessage instead of falling back to a
  // generic link.
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SHORT_DESCRIPTION,
    images: ['/opengraph-image'],
  },
}

// Runs before first paint so a returning visitor never sees the default
// theme flash before React hydrates and applies their stored choice.
// Falls back to the OS preference when nothing has been stored yet.
const THEME_INIT = `try{var m=localStorage.getItem('aw-mode');if(m!=='light'&&m!=='dark'){m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.mode=m}catch(e){document.documentElement.dataset.mode='light'}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif4.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
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
