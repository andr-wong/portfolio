import { ImageResponse } from 'next/og'

export const alt = 'Andrew Wong — Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0b0a0c',
          color: '#ece7df',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 20, letterSpacing: 4, color: '#ff7a3d', textTransform: 'uppercase' }}>
          Open to graduate roles — 2026
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24, display: 'flex' }}>
          Andrew Wong
        </div>
        <div style={{ fontSize: 32, color: '#968e85', marginTop: 16, display: 'flex' }}>
          Software Engineer · Adelaide, SA
        </div>
      </div>
    ),
    { ...size }
  )
}
