import { ImageResponse } from 'next/og'
import { loadAbstractFonts } from './og-fonts'

export const alt = 'Andrew Wong — Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Matches "The Abstract" light theme (see app/globals.css :root[data-mode="light"])
// so the link preview a recruiter sees in Slack/LinkedIn/iMessage looks like the
// same document the site renders, not a leftover from an earlier design pass.
const PAPER = '#f6f4ef'
const INK = '#1c1b19'
const MUTE = '#5c584f'
const ACCENT = '#a6291d'

export default async function Image() {
  const fonts = await loadAbstractFonts()
  const serif = fonts.some((f) => f.name === 'Source Serif 4') ? 'Source Serif 4' : 'serif'
  const mono = fonts.some((f) => f.name === 'IBM Plex Mono') ? 'IBM Plex Mono' : 'monospace'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '84px 96px',
          background: PAPER,
          color: INK,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: mono,
            fontSize: 20,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: ACCENT,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 999, background: ACCENT, display: 'flex' }} />
          Open to graduate roles — 2026
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 104,
            marginTop: 28,
            lineHeight: 1.05,
          }}
        >
          Andrew&nbsp;
          <span style={{ display: 'flex', color: ACCENT, fontStyle: 'italic' }}>Wong</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: serif,
            fontStyle: 'italic',
            fontSize: 34,
            color: MUTE,
            marginTop: 20,
          }}
        >
          Full-Stack Software Engineer · CS &apos;26 · University of Adelaide
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 56,
            paddingTop: 28,
            borderTop: `1.5px solid ${INK}`,
            fontFamily: mono,
            fontSize: 20,
            letterSpacing: 1,
            color: MUTE,
          }}
        >
          andrwong101@gmail.com · Adelaide, SA
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
