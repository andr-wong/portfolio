import { describe, expect, it } from 'vitest'
import { BENTO, BENTO_PERSONAL } from './data'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

describe('BENTO (work page data)', () => {
  it('has a valid contact email', () => {
    expect(BENTO.contact.email).toMatch(EMAIL_REGEX)
  })

  it('has non-empty github and linkedin URLs', () => {
    expect(BENTO.contact.github).toMatch(/^https:\/\//)
    expect(BENTO.contact.linkedin).toMatch(/^https:\/\//)
  })

  it('has at least one skill and one stat', () => {
    expect(BENTO.skills.length).toBeGreaterThan(0)
    expect(BENTO.stats.length).toBeGreaterThan(0)
  })

  it('has at least one timeline entry', () => {
    expect(BENTO.timeline.length).toBeGreaterThan(0)
  })

  it('every project has a non-empty tag, name, desc, and stack', () => {
    const projects = Object.values(BENTO.projects)
    expect(projects.length).toBeGreaterThan(0)
    for (const project of projects) {
      expect(project.tag.length).toBeGreaterThan(0)
      expect(project.name.length).toBeGreaterThan(0)
      expect(project.desc.length).toBeGreaterThan(0)
      expect(project.stack.length).toBeGreaterThan(0)
    }
  })

  it('project tags are unique', () => {
    const tags = Object.values(BENTO.projects).map((p) => p.tag)
    expect(new Set(tags).size).toBe(tags.length)
  })
})

describe('BENTO_PERSONAL (personal page data)', () => {
  it('has a valid contact email matching the work page', () => {
    expect(BENTO_PERSONAL.contact.email).toMatch(EMAIL_REGEX)
    expect(BENTO_PERSONAL.contact.email).toBe(BENTO.contact.email)
  })

  it('has at least one stat and one principle', () => {
    expect(BENTO_PERSONAL.stats.length).toBeGreaterThan(0)
    expect(BENTO_PERSONAL.principles.length).toBeGreaterThan(0)
  })
})
