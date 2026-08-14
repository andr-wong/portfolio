# Bento Portfolio Completion Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the live bento-grid portfolio (`app/page.tsx` → `components/bento/PortfolioApp.tsx`) to a shippable, maintained state — remove the dead 3D "Observatory" and orphaned older bento-design code paths, wire the existing contact API into the actual UI, close the SEO gaps, and add a light regression-test net.

**Architecture:** No architectural change to the live site. This plan is subtractive (delete unreachable code trees + unused deps) and additive-in-place (a form component wired to the existing `/api/contact` route, two Next.js file-convention additions for SEO, a Vitest suite covering the two things most likely to silently break: content data integrity and the contact API).

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, plain CSS (`app/globals.css`, no framework), Bun as package manager/runtime, Vitest (new) for tests.

## Global Constraints

- Package manager is Bun (`bun.lock` present, `bun run build` is the verified build command) — use `bun add` / `bun install` / `bun run`, not `npm`.
- Path alias `@/*` maps to repo root (see `tsconfig.json`).
- Two themes exist and must both keep working: `.bento-daybreak` and `.bento-eclipse`, selected in `components/bento/PortfolioApp.tsx`. Both define the same CSS custom-property names (`--tile`, `--ink`, `--line`, `--accent`, `--fd`, `--fm`, etc.) with different values — write new CSS against these variables, not hardcoded colors, so one rule set works in both themes.
- Content data lives in `components/bento/data.ts` (`BENTO`, `BENTO_PERSONAL`) — this is the single source of truth for the live site. Do not resurrect `lib/projects.ts`.
- `data.ts` has no `'use client'` directive — it's safe to import from Server Components (used in Task 6).
- After every task that touches routing or deletes files, re-run `bun run build` before committing — it must stay green (0 errors).

---

## Task 1: Repo hygiene — clear stale artifacts, track the lockfile

**Files:**
- Delete: `hero-aligned.png`, `hero-current.png`, `hero-eclipse.png`, `hero-fullpage.png`, `hero-work.png`, `home-work-page.png`, `personal-page-full.png`, `work-hero.png` (all at repo root)
- Modify: `app/page.tsx` (already has an uncommitted title change, from a prior session)
- Track: `bun.lock` (currently untracked; not in `.gitignore`, should be committed for reproducible installs)

**Interfaces:** None — this task has no code interfaces, it only touches git state.

- [ ] **Step 1: Confirm nothing else references the loose screenshots**

Run: `grep -rn "hero-aligned\|hero-current\|hero-eclipse\|hero-fullpage\|hero-work\|home-work-page\|personal-page-full\|work-hero" --include="*.tsx" --include="*.ts" --include="*.css" --include="*.md" app components lib public docs 2>/dev/null`
Expected: no output (they are orphaned dev screenshots from a previous QA pass, per project memory — not referenced by any component or doc).

- [ ] **Step 2: Delete the stale screenshots**

```bash
rm hero-aligned.png hero-current.png hero-eclipse.png hero-fullpage.png hero-work.png home-work-page.png personal-page-full.png work-hero.png
```

- [ ] **Step 3: Stage and commit**

```bash
git add bun.lock app/page.tsx
git status
git commit -m "chore: track bun.lock, drop stale screenshots, commit pending title tweak"
```

Expected `git status` before commit: the 8 PNGs no longer listed (deleted, untracked so they just vanish), `bun.lock` and `app/page.tsx` staged.

---

## Task 2: Remove the dead 3D "Observatory" system

**Files:**
- Delete: `components/scene/` (entire directory), `components/hud/` (entire directory), `components/panels/` (entire directory), `components/LoadSequence.tsx`, `hooks/useObservatoryCamera.ts`, `shaders/` (entire directory), `types/panel.ts`, `lib/panels.ts`
- Modify: `package.json` (remove unused dependencies)

**Interfaces:** None of these files are imported from any file under `app/` or from the live `components/bento/*` tree (verified: `three`, `@react-three/fiber`, `@react-three/drei`, `simplex-noise`, `gsap` are only referenced inside the tree being deleted).

- [ ] **Step 1: Verify the tree really is unreachable before deleting**

```bash
grep -rln "components/scene\|components/hud\|components/panels\|LoadSequence\|useObservatoryCamera\|types/panel\|lib/panels" app components/bento components/ui 2>/dev/null
```
Expected: no output.

- [ ] **Step 2: Delete the dead directories and files**

```bash
rm -rf components/scene components/hud components/panels shaders
rm components/LoadSequence.tsx hooks/useObservatoryCamera.ts types/panel.ts lib/panels.ts
```

- [ ] **Step 3: Remove the now-unused dependencies from `package.json`**

Remove these entries from `"dependencies"`:
```json
"@chenglou/pretext": "^0.0.5",
"@react-three/drei": "^10.7.7",
"@react-three/fiber": "^9.5.0",
"@types/three": "^0.183.1",
"gsap": "^3.14.2",
"simplex-noise": "^4.0.3",
"three": "^0.183.2"
```
Leave `framer-motion`, `next`, `react`, `react-dom`, `@vercel/analytics`, `@vercel/speed-insights` untouched — those are still used by the live site.

- [ ] **Step 4: Reinstall to sync `bun.lock`**

```bash
bun install
```

- [ ] **Step 5: Verify the build is still clean**

```bash
bun run build
```
Expected: succeeds, no errors, no warnings about missing modules.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove dead 3D Observatory scene system and its deps"
```

---

## Task 3: Remove the orphaned older bento design and its routes

**Files:**
- Delete: `components/personal/` (entire directory), `components/professional/` (entire directory), `components/portfolio/` (entire directory), `components/ProjectDetail.tsx`, `app/personal/` (entire directory), `app/projects/` (entire directory), `lib/projects.ts`, `lib/now.ts`, `hooks/useTilt.ts`, `hooks/useDeviceCapability.ts`
- Modify: `app/sitemap.ts`

**Interfaces:** `hooks/useTilt.ts` was only consumed by `components/personal/PersonalBento.tsx` and `components/professional/BentoCell.tsx` (both deleted here). `hooks/useDeviceCapability.ts` was only consumed by `components/scene/SceneWrapper.tsx` (deleted in Task 2). `lib/now.ts`'s only consumer was `components/personal/PersonalBento.tsx` (deleted here). None of these are referenced from `app/page.tsx`, `components/bento/*`, or `components/ui/*`.

- [ ] **Step 1: Verify unreachability before deleting**

```bash
grep -rln "components/personal\|components/professional\|components/portfolio\|ProjectDetail\|lib/projects\|lib/now\|useTilt\|useDeviceCapability" app/page.tsx components/bento components/ui app/layout.tsx 2>/dev/null
```
Expected: no output.

- [ ] **Step 2: Delete the orphaned tree**

```bash
rm -rf components/personal components/professional components/portfolio app/personal app/projects
rm components/ProjectDetail.tsx lib/projects.ts lib/now.ts hooks/useTilt.ts hooks/useDeviceCapability.ts
```

- [ ] **Step 3: Update `app/sitemap.ts` to drop the now-deleted `/projects/[slug]` routes**

Replace the full contents of `app/sitemap.ts` with:

```typescript
import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andrwong.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

- [ ] **Step 4: Verify the build is still clean**

```bash
bun run build
```
Expected: succeeds. Route list should now show only `/`, `/api/contact`, `/robots.txt`, `/sitemap.xml` (plus `/_not-found`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove orphaned personal/professional bento design and dead routes"
```

---

## Task 4: Set up Vitest and cover `components/bento/data.ts`

**Files:**
- Create: `vitest.config.ts`
- Create: `components/bento/data.test.ts`
- Modify: `package.json` (add `vitest` devDependency, add `test` script)

**Interfaces:**
- Consumes: `BENTO`, `BENTO_PERSONAL` exported from `components/bento/data.ts` (already exist, unchanged by this task).
- Produces: `bun run test` as the standard test entrypoint for all later tasks in this plan.

- [ ] **Step 1: Add Vitest**

```bash
bun add -d vitest
```

- [ ] **Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 3: Add the `test` script to `package.json`**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write the failing test — `components/bento/data.test.ts`**

```typescript
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
```

- [ ] **Step 5: Run it to verify it passes (data is already real, so this should pass immediately — it exists to catch future regressions)**

Run: `bun run test`
Expected: `components/bento/data.test.ts` — all tests PASS, 0 failures.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts components/bento/data.test.ts package.json bun.lock
git commit -m "test: add vitest and content-data integrity tests"
```

---

## Task 5: Test the `/api/contact` route logic

**Files:**
- Create: `app/api/contact/route.test.ts`

**Interfaces:**
- Consumes: `POST` exported from `app/api/contact/route.ts` (existing, unchanged — signature `(req: NextRequest) => Promise<NextResponse>`).

- [ ] **Step 1: Write the failing tests**

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'

const SITE_URL = 'https://andrwong.dev'

function makeRequest(body: unknown, opts?: { referer?: string; ip?: string }) {
  return new NextRequest(`${SITE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      referer: opts?.referer ?? `${SITE_URL}/`,
      'x-forwarded-for': opts?.ip ?? '203.0.113.1',
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL
    process.env.RESEND_API_KEY = 'test-key'
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 200 }))
    )
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('rejects requests from a different origin (CSRF)', async () => {
    const res = await POST(
      makeRequest(
        { name: 'A', email: 'a@b.com', message: 'hi' },
        { referer: 'https://evil.example.com/' }
      )
    )
    expect(res.status).toBe(403)
  })

  it('rejects an invalid email', async () => {
    const res = await POST(makeRequest({ name: 'A', email: 'not-an-email', message: 'hi' }))
    expect(res.status).toBe(400)
  })

  it('rejects a missing name', async () => {
    const res = await POST(makeRequest({ name: '', email: 'a@b.com', message: 'hi' }))
    expect(res.status).toBe(400)
  })

  it('rejects a message over the length limit', async () => {
    const res = await POST(
      makeRequest({ name: 'A', email: 'a@b.com', message: 'x'.repeat(2001) })
    )
    expect(res.status).toBe(400)
  })

  it('sends via Resend and returns 200 on a valid request', async () => {
    const res = await POST(makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('returns 502 when Resend fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('resend down', { status: 500 }))
    )
    const res = await POST(makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }))
    expect(res.status).toBe(502)
  })

  it('returns 500 when RESEND_API_KEY is not configured', async () => {
    delete process.env.RESEND_API_KEY
    const res = await POST(makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }))
    expect(res.status).toBe(500)
  })

  it('rate-limits after 5 requests from the same IP within the window', async () => {
    const ip = '203.0.113.99'
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }, { ip }))
      expect(res.status).toBe(200)
    }
    const sixth = await POST(makeRequest({ name: 'A', email: 'a@b.com', message: 'hi' }, { ip }))
    expect(sixth.status).toBe(429)
  })
})
```

- [ ] **Step 2: Run to verify it fails first (module doesn't exist as a test target error, or if it runs, confirm behavior)**

Run: `bun run test app/api/contact/route.test.ts`
Expected: if this is the first run, all tests should already PASS since `route.ts` is unchanged existing code — this test suite exists to lock in current behavior, not to drive new implementation. Confirm all 8 tests pass with 0 failures.

Note: the in-memory rate limiter in `route.ts` is a module-level `Map` that persists across tests in the same file — the rate-limit test intentionally uses a fresh IP (`203.0.113.99`) not used by earlier tests, so it isn't polluted by them. Keep this in mind if adding more tests later — pick a fresh IP per test that touches rate limiting.

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.test.ts
git commit -m "test: cover contact API route validation, CSRF, and rate limiting"
```

---

## Task 6: Wire the contact form into the live UI

**Files:**
- Create: `components/bento/ContactForm.tsx`
- Modify: `components/bento/BentoSite.tsx` (the `Contact` inline component, around line 126-146)
- Modify: `app/globals.css` (append modal styles)
- Create: `components/bento/ContactForm.test.tsx`
- Modify: `package.json` (add test deps)

**Interfaces:**
- Consumes: `POST /api/contact` (Task 5's tested route) with JSON body `{ name: string, email: string, message: string }`, returns `{ ok: true }` on 200 or `{ error: string }` on 4xx/5xx.
- Produces: `ContactForm` component with props `{ isOpen: boolean; onClose: () => void }`, exported as default from `components/bento/ContactForm.tsx`.

- [ ] **Step 1: Add component-testing dependencies**

```bash
bun add -d @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

- [ ] **Step 2: Update `vitest.config.ts` to support a React plugin (keep default environment as `node`; component tests opt into jsdom per-file)**

Replace the full contents of `vitest.config.ts` with:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```typescript
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Write `components/bento/ContactForm.tsx`**

```tsx
'use client';

import { useState } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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

  return (
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
                <a href="mailto:andrwong101@gmail.com">Email me directly</a>
              </p>
            )}
            <button className="btn primary" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Wire it into `components/bento/BentoSite.tsx`**

Add the import near the top (after the `PersonalWidget` import):
```typescript
import ContactForm from './ContactForm';
```

Add state inside `BentoSite`, right after the `const { ref, shown, time, counts } = useBentoMotion(stats);` line:
```typescript
const [contactOpen, setContactOpen] = useState(false);
```
(Add `useState` to the existing `import { useEffect } from 'react';` line, making it `import { useEffect, useState } from 'react';`.)

Replace the `Contact` component body (currently lines 126-146) with:
```tsx
const Contact = ({ dly, line }: { dly: string; line: string }) => (
  <section className="tile contact" style={{ '--d': dly } as React.CSSProperties}>
    <div className="cleft">
      <div className="label clbl">Let&apos;s talk</div>
      <div className="cline">{line}</div>
    </div>
    <div className="cright">
      <button className="mail" onClick={() => setContactOpen(true)}>
        Send a message
      </button>
      <div className="socials">
        <a className="soc" href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <GithubIcon />
        </a>
        <a className="soc" href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
      </div>
    </div>
  </section>
);
```

Render the modal once, right before the component's closing return (find the outermost returned JSX root element in `BentoSite` and add `<ContactForm isOpen={contactOpen} onClose={() => setContactOpen(false)} />` as its last child, as a sibling to the existing page content — it must render outside the themed `.grid`/`.band` structure so it overlays the whole page).

- [ ] **Step 6: Append modal CSS to `app/globals.css`**

These rules use the shared CSS custom properties (`--tile`, `--ink`, `--line`, `--accent`, `--fm`, `--fd`, `--mute`) that both `.bento-daybreak` and `.bento-eclipse` define, so one rule set covers both themes:

```css
/* Contact form modal */
.contact-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.contact-modal {
  background: var(--tile);
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  position: relative;
  font-family: var(--fb);
}
.contact-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: var(--mute);
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 8px;
}
.contact-modal-close:hover { color: var(--ink); }
.contact-modal form { display: flex; flex-direction: column; gap: 6px; }
.contact-modal .label { margin-top: 12px; }
.contact-modal input,
.contact-modal textarea {
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  color: var(--ink);
  font-family: var(--fb);
  font-size: 14px;
  resize: vertical;
}
.contact-modal input:focus,
.contact-modal textarea:focus {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
.contact-modal .btn { margin-top: 18px; align-self: flex-start; }
.contact-modal-error {
  color: var(--accent);
  font-size: 13px;
  margin-top: 8px;
}
.contact-modal-success { text-align: center; }
.contact-modal-success p { margin-bottom: 16px; }
```

- [ ] **Step 7: Write `components/bento/ContactForm.test.tsx`**

```tsx
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
```

- [ ] **Step 8: Run the tests**

Run: `bun run test`
Expected: `components/bento/ContactForm.test.tsx` — all 3 tests PASS. `components/bento/data.test.ts` and `app/api/contact/route.test.ts` from earlier tasks still PASS.

- [ ] **Step 9: Manual browser check (both themes, both pages)**

```bash
bun run dev
```
Open `http://localhost:3000`, click "Send a message" in the contact tile on the Work page, submit a test message (needs `RESEND_API_KEY` in `.env.local` to actually deliver — without it you should see the inline error + mailto fallback, which is also correct behavior to verify). Toggle to the Personal page and to the eclipse theme and repeat — confirm the modal is legible and on-brand in all four combinations.

- [ ] **Step 10: Verify production build**

```bash
bun run build
```
Expected: succeeds.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: wire contact form into the live UI, add component tests"
```

---

## Task 7: Add the missing OG image via Next.js file convention

**Files:**
- Create: `app/opengraph-image.tsx`
- Modify: `app/layout.tsx`

**Interfaces:** Next.js App Router auto-discovers `app/opengraph-image.tsx` and injects the resulting image into `<meta property="og:image">` — no manual wiring needed once the file exists.

- [ ] **Step 1: Create `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Andrew Wong — Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0b0a0c',
          color: '#ece7df',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 20, letterSpacing: 4, color: '#ff7a3d', textTransform: 'uppercase' }}>
          Open to graduate roles — 2026
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24, display: 'flex' }}>
          Andrew Wong
        </div>
        <div style={{ fontSize: 32, color: '#968e85', marginTop: 16, display: 'flex' }}>
          Software Engineer · Adelaide, SA
        </div>
      </div>
    ),
    { ...size }
  )
}
```

- [ ] **Step 2: Remove the broken manual image reference in `app/layout.tsx`**

In the `openGraph` block, remove the `images: ['/og-image.png'],` line — the file convention from Step 1 supplies it automatically. The `openGraph` object becomes:
```typescript
openGraph: {
  title: 'Andrew Wong — Software Engineer',
  description:
    'CS student at the University of Adelaide specialising in software engineering and AI.',
},
```

- [ ] **Step 3: Verify**

```bash
bun run build
```
Then run `bun run dev` and open `http://localhost:3000/opengraph-image` directly — confirm a 1200×630 PNG renders with the name and tagline.

- [ ] **Step 4: Commit**

```bash
git add app/opengraph-image.tsx app/layout.tsx
git commit -m "feat: add generated OG image, remove broken static image reference"
```

---

## Task 8: Add Person structured data (JSON-LD)

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `BENTO` from `@/components/bento/data` (existing export, read-only).

- [ ] **Step 1: Add the import and JSON-LD script to `app/layout.tsx`**

Add the import at the top:
```typescript
import { BENTO } from '@/components/bento/data'
```

Inside `RootLayout`, add a `<script type="application/ld+json">` as the first child of `<body>`, before `{children}`:
```tsx
<body>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: `${BENTO.name[0]} ${BENTO.name[1]}`,
        url: SITE_URL,
        email: `mailto:${BENTO.contact.email}`,
        jobTitle: 'Software Engineer',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Adelaide',
          addressRegion: 'SA',
          addressCountry: 'AU',
        },
        sameAs: [BENTO.contact.github, BENTO.contact.linkedin],
      }),
    }}
  />
  {children}
  <SpeedInsights />
  <Analytics />
</body>
```

- [ ] **Step 2: Verify**

```bash
bun run build
bun run dev
```
Open `http://localhost:3000`, view page source, confirm the `<script type="application/ld+json">` block is present with the correct name/email/github/linkedin values. Validate at Google's Rich Results Test if desired (paste the rendered HTML — no live URL needed since the site isn't deployed with this change yet).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add Person structured data for SEO"
```

---

## Build Order

Tasks are ordered by dependency:

```
Task 1 (hygiene)
  → Task 2 (remove 3D system)
    → Task 3 (remove orphaned bento design + routes)  — depends on Task 2 completing first so hooks/useDeviceCapability's other consumer is already gone
      → Task 4 (vitest setup + data tests)
        → Task 5 (contact API tests)
          → Task 6 (wire contact form + component tests)  — depends on Task 5's understanding of the route contract
            → Task 7 (OG image)
              → Task 8 (JSON-LD, imports BENTO)
```

Tasks 7 and 8 have no dependency on each other and could be done in either order or in parallel; they're sequenced here only because they both touch `app/layout.tsx` and doing them one at a time avoids merge noise.

---

## NOT In Scope (This Plan)

- Deploying to production / rotating `RESEND_API_KEY` on Vercel (existing env var management, unchanged).
- Redesigning the bento visual system itself — this plan is cleanup + gap-closing, not a redesign.
- E2E/Playwright tests — the light Vitest suite (data integrity + API route + one component) covers the highest-value regression surface without the setup cost of a browser test runner. Revisit if the contact flow or theme toggle starts breaking in ways unit tests don't catch.
- Re-adding `/projects/[slug]` case-study pages — deleted in Task 3 because they're currently unreachable from the live UI; if case studies are wanted later, that's new scope requiring its own plan (the bento project tiles would need to link internally instead of to external demo URLs).

---

## Self-Review Notes

- **Spec coverage:** all four scope items chosen by the user are covered — dead-code removal (Tasks 2-3), light test suite (Tasks 4-6), contact form wiring (Task 6), OG image (Task 7), JSON-LD (Task 8), repo-root cleanup (Task 1).
- **Type consistency:** `ContactForm` props (`isOpen`, `onClose`) match between the component definition (Task 6 Step 4) and its usage in `BentoSite.tsx` (Task 6 Step 5) and its test (Task 6 Step 7). The `/api/contact` request/response shape used in `ContactForm.tsx` matches the actual route contract verified in Task 5's tests.
- **Verified against real code**, not assumed: all file paths, line-range references, CSS variable names, and the exact current `Contact` component JSX were read from the live repo before writing this plan.
