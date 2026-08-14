// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import ContactForm from './ContactForm'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('ContactForm', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<ContactForm isOpen={false} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('submits the form and shows a success message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    )
    render(<ContactForm isOpen={true} onClose={() => {}} />)

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
    render(<ContactForm isOpen={true} onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } })
    fireEvent.click(screen.getByRole('button', { name: /send$/i }))

    await waitFor(() => expect(screen.getByText(/failed to send/i)).toBeInTheDocument())
    expect(screen.getByRole('link', { name: /email me directly/i })).toHaveAttribute(
      'href',
      'mailto:andrwong101@gmail.com'
    )
  })
})
