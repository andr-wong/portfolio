// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import CaseStudyPage from './CaseStudyPage'
import { CASE_STUDIES } from './data'

afterEach(cleanup)

describe('CaseStudyPage', () => {
  it.each(Object.values(CASE_STUDIES))('renders every section of $name exactly once', (study) => {
    render(<CaseStudyPage study={study} />)
    expect(screen.getByRole('heading', { level: 1, name: study.name })).toBeInTheDocument()
    const headings = screen.getAllByRole('heading', { level: 2 })
    for (const section of study.sections) {
      const matches = headings.filter((h) => h.textContent?.includes(section.heading))
      expect(matches).toHaveLength(1)
    }
    // A real bug caught while building this: "Stack" used to render as both
    // a heading (from data.ts's sections array) and a second, separately
    // auto-generated heading in the component. Only one heading should ever
    // contain "Stack" — the quick-reference line at the top of the page
    // ("Stack — Vanilla JS, ...") is a <p>, not a heading, so it doesn't
    // count here.
    expect(headings.filter((h) => h.textContent?.includes('Stack'))).toHaveLength(1)
  })

  it('links to the live site with a real href, not a placeholder', () => {
    render(<CaseStudyPage study={CASE_STUDIES.headcount} />)
    const links = screen.getAllByRole('link', { name: /headcount\.andrwong\.com|Visit Headcount/ })
    for (const link of links) {
      expect(link).toHaveAttribute('href', CASE_STUDIES.headcount.liveUrl)
    }
  })

  it('links back to the homepage', () => {
    render(<CaseStudyPage study={CASE_STUDIES.mapster} />)
    expect(screen.getByRole('link', { name: /Back to the full portfolio/ })).toHaveAttribute('href', '/')
  })
})
