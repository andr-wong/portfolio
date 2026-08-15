'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BENTO } from './data';

interface ContactFormProps {
  onClose: () => void;
  variant: 'daybreak' | 'eclipse';
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm({ onClose, variant }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  // The parent only ever mounts this component after a click, well after
  // hydration, so document already exists here in practice — this guards
  // non-browser test/render environments without needing an effect.
  const canPortal = typeof document !== 'undefined';

  useEffect(() => {
    if (!canPortal) return;
    nameInputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
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
    // The theme class carries the --tile/--ink/--mute/--fb custom properties this
    // modal relies on; it must be re-applied here because the portal renders into
    // document.body, outside the themed .bento-daybreak/.bento-eclipse subtree that
    // .bento-site-wrap's stacking context would otherwise trap it under.
    <div
      className={`bento-${variant}`}
      style={{ position: 'static', height: 0, width: 0, padding: 0, margin: 0, background: 'transparent', overflow: 'visible' }}
    >
      <div className="contact-modal-overlay" role="presentation" onClick={onClose}>
        <div
          className="contact-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Send a message"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="contact-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
          {status === 'success' ? (
            <div className="contact-modal-success">
              <p>Message sent. I&apos;ll get back to you soon.</p>
              <button className="btn" onClick={onClose}>
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
                <p className="contact-modal-error">
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
      </div>
    </div>,
    document.body
  );
}
