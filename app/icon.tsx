import { ImageResponse } from 'next/og'
import { loadAbstractFonts } from './og-fonts'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// A solid-fill favicon reads reliably against both light and dark browser
// chrome, unlike a transparent one — the same tradeoff a filled badge makes
// over an outlined one at 16-32px. Ink background + paper "AW" mirrors the
// top-bar .mark badge's colours (see app/globals.css), just inverted, since
// a favicon can't adapt to the visitor's chosen site theme the way the badge
// itself does.
const INK = '#1c1b19'
const PAPER = '#f6f4ef'

export default async function Icon() {
  const fonts = await loadAbstractFonts()
  const italic = fonts.filter((f) => f.style === 'italic')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: INK,
        }}
      >
        <span
          style={{
            fontFamily: italic.length ? 'Source Serif 4' : 'serif',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 15,
            color: PAPER,
          }}
        >
          AW
        </span>
      </div>
    ),
    { ...size, fonts: italic }
  )
}
