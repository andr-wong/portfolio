import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.dev'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Andrew Wong — AI Engineer & Full-Stack Developer',
  description:
    'Portfolio of Andrew Wong, CS graduate specialising in AI engineering and full-stack development. Sydney / Remote.',
  openGraph: {
    title: 'Andrew Wong — AI Engineer & Full-Stack Developer',
    description:
      'CS graduate specialising in AI engineering and full-stack development.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} h-full`}
    >
      <body className="h-full scanlines">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
