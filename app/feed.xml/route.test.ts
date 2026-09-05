// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { GET } from './route'
import { BENTO } from '@/components/bento/data'

describe('GET /feed.xml', () => {
  it('returns valid RSS with the correct content type', async () => {
    const res = await GET()
    expect(res.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8')
    const xml = await res.text()
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0"')
  })

  it('includes one item per timeline entry, newest first', async () => {
    const xml = await (await GET()).text()
    const itemCount = xml.match(/<item>/g)?.length ?? 0
    expect(itemCount).toBe(BENTO.timeline.length)
    const firstYear = BENTO.timeline[0][0]
    expect(xml.indexOf(`#${firstYear}`)).toBeLessThan(
      xml.indexOf(`#${BENTO.timeline[BENTO.timeline.length - 1][0]}`)
    )
  })

  it('escapes XML special characters (data.ts has a literal "&" in a timeline entry)', async () => {
    const xml = await (await GET()).text()
    expect(xml).toContain('&amp;')
    expect(xml).not.toMatch(/JB Hi-Fi & Myer/)
  })

  it('is well-formed enough for DOMParser to read without a parsererror', async () => {
    const xml = await (await GET()).text()
    const doc = new DOMParser().parseFromString(xml, 'application/xml')
    expect(doc.querySelector('parsererror')).toBeNull()
    expect(doc.querySelectorAll('item').length).toBe(BENTO.timeline.length)
  })
})
