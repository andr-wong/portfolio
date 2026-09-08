import { ImageResponse } from 'next/og'
import { loadAbstractFonts } from './og-fonts'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Apple's home-screen icon spec expects an opaque square (iOS applies its
// own rounding/mask), so this deliberately has no transparency or radius of
// its own — see app/icon.tsx for the colour choice rationale.
const INK = '#1c1b19'
const PAPER = '#f6f4ef'

export default async function AppleIcon() {
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
            fontSize: 85,
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
