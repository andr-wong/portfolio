// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import CommandPalette from './CommandPalette'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function setup(overrides?: Partial<React.ComponentProps<typeof CommandPalette>>) {
  const onOpenChange = vi.fn()
  const onNavigate = vi.fn()
  const onToggleTheme = vi.fn()
  const onOpenContact = vi.fn()
  const utils = render(
    <CommandPalette
      open
      onOpenChange={onOpenChange}
      mode="light"
      page="work"
      onNavigate={onNavigate}
      onToggleTheme={onToggleTheme}
      onOpenContact={onOpenContact}
      {...overrides}
    />
  )
  return { ...utils, onOpenChange, onNavigate, onToggleTheme, onOpenContact }
}

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    render(
      <CommandPalette
        open={false}
        onOpenChange={() => {}}
        mode="light"
        page="work"
        onNavigate={() => {}}
        onToggleTheme={() => {}}
        onOpenContact={() => {}}
      />
    )
    expect(document.body.querySelector('.cmdk-panel')).toBeNull()
  })

  it('renders into document.body via portal, focused on the input, when open', () => {
    setup()
    const input = screen.getByRole('combobox')
    expect(input).toHaveFocus()
  })

  it('only offers the page you are not currently on', () => {
    setup({ page: 'work' })
    expect(screen.getByText('Go to Personal')).toBeInTheDocument()
    expect(screen.queryByText('Go to Work')).not.toBeInTheDocument()
  })

  it('filters commands as you type', () => {
    setup()
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'github' } })
    expect(screen.getByText('Open GitHub')).toBeInTheDocument()
    expect(screen.queryByText('Open LinkedIn')).not.toBeInTheDocument()
  })

  it('runs the selected command and closes on Enter', () => {
    const { onNavigate, onOpenChange } = setup()
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'personal' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onNavigate).toHaveBeenCalledWith('personal')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('runs a command on click', () => {
    const { onToggleTheme, onOpenChange } = setup()
    fireEvent.click(screen.getByText('Switch to dark theme'))
    expect(onToggleTheme).toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes on Escape without running anything', () => {
    const { onNavigate, onOpenChange } = setup()
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onNavigate).not.toHaveBeenCalled()
  })

  it('opens on Cmd+K from anywhere on the page, even while closed', () => {
    const onOpenChange = vi.fn()
    render(
      <CommandPalette
        open={false}
        onOpenChange={onOpenChange}
        mode="light"
        page="work"
        onNavigate={() => {}}
        onToggleTheme={() => {}}
        onOpenContact={() => {}}
      />
    )
    fireEvent.keyDown(document, { key: 'k', metaKey: true })
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('only lists projects that have a live url (HCF Router is excluded)', () => {
    setup()
    expect(screen.getByText('Open Mapster')).toBeInTheDocument()
    expect(screen.getByText('Open Headcount')).toBeInTheDocument()
    expect(screen.queryByText('Open HCF Router')).not.toBeInTheDocument()
  })

  it('shows "No matches." for a query that matches nothing', () => {
    setup()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'xyzzy' } })
    expect(screen.getByText('No matches.')).toBeInTheDocument()
  })

  it('opens the resume PDF in a new tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { onOpenChange } = setup()
    fireEvent.click(screen.getByText('Download resume (PDF)'))
    expect(openSpy).toHaveBeenCalledWith('/andrew-wong-resume.pdf', '_blank', 'noopener,noreferrer')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
