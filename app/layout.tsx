import type { Metadata } from 'next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
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
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
