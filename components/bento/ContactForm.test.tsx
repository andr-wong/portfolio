// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import ContactForm from './ContactForm'
import { BENTO } from './data'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('ContactForm', () => {
  it('renders the form fields into document.body via portal', () => {
    render(<ContactForm onClose={() => {}} variant="daybreak" />)
    expect(document.body.querySelector('.contact-modal')).not.toBeNull()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('submits the form and shows a success message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    )
    render(<ContactForm onClose={() => {}} variant="daybreak" />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } })
    fireEvent.click(screen.getByRole('button', { name: /send$/i }))

    await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument())
    expect(fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Jane', email: 'jane@example.com', message: 'Hello there' }),
      })
    )
  })

  it('shows an inline error with a mailto fallback when the API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ error: 'Failed to send. Please try again.' }), { status: 502 }))
    )
    render(<ContactForm onClose={() => {}} variant="daybreak" />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } })
    fireEvent.click(screen.getByRole('button', { name: /send$/i }))

    await waitFor(() => expect(screen.getByText(/failed to send/i)).toBeInTheDocument())
    expect(screen.getByRole('link', { name: /email me directly/i })).toHaveAttribute(
      'href',
      `mailto:${BENTO.contact.email}`
    )
  })

  it('closes on Escape', () => {
    const onClose = vi.fn()
    render(<ContactForm onClose={onClose} variant="daybreak" />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('starts with a fresh form on every mount (parent unmounts to reset, per BentoSite)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    )
    const { unmount } = render(<ContactForm onClose={() => {}} variant="daybreak" />)
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } })
    fireEvent.click(screen.getByRole('button', { name: /send$/i }))
    await waitFor(() => expect(screen.getByText(/message sent/i)).toBeInTheDocument())
    unmount()

    render(<ContactForm onClose={() => {}} variant="daybreak" />)
    expect(screen.queryByText(/message sent/i)).toBeNull()
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })
})
