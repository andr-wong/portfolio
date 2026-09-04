'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BENTO } from './data';

interface ContactFormProps {
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm({ onClose }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // The parent only ever mounts this component after a click, well after
  // hydration, so document already exists here in practice — this guards
  // non-browser test/render environments without needing an effect.
  const canPortal = typeof document !== 'undefined';

  useEffect(() => {
    if (!canPortal) return;
    const opener = document.activeElement as HTMLElement | null;
    nameInputRef.current?.focus();

    // aria-modal="true" tells assistive tech the rest of the page is inert, so
    // Tab must not be able to reach it. Without this the dialog announces as
    // modal but keyboard focus still walks out into the page behind it.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [canPortal, onClose]);

  if (!canPortal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Message not sent. Try emailing directly.');
        setStatus('error');
        return;
      }
      setStatus('success');
    } catch {
      setError('Message not sent. Try emailing directly.');
      setStatus('error');
    }
  };

  return createPortal(
    <div className="contact-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="contact-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Send a message"
        onClick={(e) => e.stopPropagation()}
      >
          <button
          className="contact-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {status === 'success' ? (
          <div className="contact-modal-success">
            <p role="status">Message sent. I&apos;ll get back to you soon.</p>
            <button className="btn" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="label" htmlFor="cf-name">
              Name
            </label>
            <input
              id="cf-name"
              ref={nameInputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === 'submitting'}
            />
            <label className="label" htmlFor="cf-email">
              Email
            </label>
            <input
              id="cf-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === 'submitting'}
            />
            <label className="label" htmlFor="cf-message">
              Message
            </label>
            <textarea
              id="cf-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={status === 'submitting'}
              rows={5}
            />
            {status === 'error' && (
              <p className="contact-modal-error" role="alert">
                {error}{' '}
                <a href={`mailto:${BENTO.contact.email}`}>Email me directly</a>
              </p>
            )}
            <button className="btn primary" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
