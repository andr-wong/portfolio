// Satori's supported font weights (see @vercel/og's Weight type).
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

// ImageResponse (Satori) accepts ttf/otf/woff font data, but Google Fonts'
// CSS2 endpoint serves woff2 (unsupported) to modern user agents. Requesting
// with an old-browser UA string gets back plain woff files instead — the
// standard workaround for using Google Fonts in an OG image.
async function loadGoogleFont(family: string, weight: FontWeight, italic = false): Promise<ArrayBuffer | null> {
  try {
    const style = italic ? '1,' : '0,';
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${style}${weight}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0' } }
    ).then((r) => r.text());
    const match = css.match(/src: url\(([^)]+)\) format\('(?:woff|truetype|opentype)'\)/);
    if (!match) return null;
    return await fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export interface OgFont {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: 'normal' | 'italic';
}

// Best-effort: returns whichever of these load successfully so the image
// still renders (with a generic fallback font) if the Google Fonts fetch
// fails at build/request time.
export async function loadAbstractFonts(): Promise<OgFont[]> {
  const specs: [string, FontWeight, boolean][] = [
    ['Source Serif 4', 600, false],
    ['Source Serif 4', 600, true],
    ['IBM Plex Mono', 500, false],
  ];
  const results = await Promise.all(
    specs.map(async ([family, weight, italic]) => {
      const data = await loadGoogleFont(family, weight, italic);
      const style: 'normal' | 'italic' = italic ? 'italic' : 'normal';
      return data ? { name: family, data, weight, style } : null;
    })
  );
  return results.filter((f): f is OgFont => f !== null);
}
