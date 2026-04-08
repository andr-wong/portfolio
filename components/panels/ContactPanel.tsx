'use client'

import { useState } from 'react'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

interface FormData {
  name: string
  email: string
  message: string
  // Honeypot — never filled by real users
  website: string
}

const FIELD_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  padding: '8px 12px',
  color: '#F0F4FF',
  fontFamily: 'var(--font-jetbrains-mono), monospace',
  fontSize: '12px',
  outline: 'none',
}

export default function ContactPanel() {
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    website: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Honeypot check
    if (form.website) return

    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      })

      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Failed to send')
      }

      setStatus('success')
      setForm({ name: '', email: '', message: '', website: '' })
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error ? err.message : 'Something went wrong. Try again.'
      )
    }
  }

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  if (status === 'success') {
    return (
      <p style={{ color: '#7CFFD4', fontSize: '13px', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
        Message sent. I'll get back to you soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Honeypot — hidden from real users */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set('website')}
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={set('name')}
        required
        style={FIELD_STYLE}
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={set('email')}
        required
        style={FIELD_STYLE}
      />
      <textarea
        placeholder="Message"
        value={form.message}
        onChange={set('message')}
        required
        maxLength={2000}
        rows={4}
        style={{ ...FIELD_STYLE, resize: 'none' }}
      />

      {status === 'error' && (
        <p style={{ color: '#F87171', fontSize: '11px', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
          {errorMsg}{' '}
          {/* TODO: replace placeholder with real email */}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          background: 'rgba(124,255,212,0.1)',
          border: '1px solid rgba(124,255,212,0.4)',
          borderRadius: '6px',
          color: '#7CFFD4',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: '12px',
          padding: '10px',
          cursor: 'none',
          opacity: status === 'sending' ? 0.6 : 1,
          pointerEvents: 'auto',
          letterSpacing: '0.1em',
        }}
      >
        {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
    </form>
  )
}
