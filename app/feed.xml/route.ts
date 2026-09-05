import { BENTO } from '@/components/bento/data'

// Static: the timeline only changes when data.ts changes (a new deploy),
// not per-request, so this is prerendered like sitemap.xml/robots.txt
// rather than re-run on every feed-reader poll.
export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.com'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  // BENTO.timeline only records the year each milestone happened, not the
  // exact day — using Jan 1 of that year as pubDate is honest about that
  // granularity rather than inventing a false-precision date.
  const items = BENTO.timeline
    .map(([year, text]) => {
      const pubDate = new Date(`${year}-01-01T00:00:00Z`).toUTCString()
      return `    <item>
      <title>${escapeXml(`${year} — ${text}`)}</title>
      <description>${escapeXml(text)}</description>
      <link>${SITE_URL}</link>
      <guid isPermaLink="false">${SITE_URL}/feed.xml#${year}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Andrew Wong — Chronology</title>
    <link>${SITE_URL}</link>
    <description>Career and project milestones from andrwong.com.</description>
    <language>en-au</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
