# Portfolio Website Design Spec
**Date:** 2026-04-08
**Concept:** The Observatory
**Author:** Andrew Wong

---

## Overview

A futuristic, head-turning portfolio website for a final-semester CS student specializing in AI, targeting graduate job opportunities. The site must capture employer attention within 5 seconds.

**Core identity:** Brilliant & technical, Bold & creative, Experimental & cutting-edge.

**Primary content:** Full-stack applications first, AI/ML projects second.

**The concept:** "The Observatory" — the visitor lands inside a 3D glass space station suspended in a deep-space nebula. Frosted glass panels orbit a central core. Organic bioluminescent shapes pulse beneath the glass, suggesting living AI. Navigation is spatial — click a panel to engage it. The site IS the proof of skill.

---

## Architecture & Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 15 (App Router) | SSR, static generation, Vercel deployment |
| 3D Engine | React Three Fiber + Drei | React-native Three.js with pre-built helpers |
| Styling | Tailwind CSS | 2D overlay panels and utility classes |
| Animation | Framer Motion + GSAP | 2D transitions + cinematic load sequence |
| Deployment | Vercel | Zero-config, edge CDN, preview deployments |

**Route structure:**
```
/                  → The Observatory (3D hero, all primary navigation)
/projects/[slug]   → Static project detail page (2D, glass-styled)
```

The entire portfolio experience lives on `/`. Project slugs exist for deep-linking to individual projects.

---

## Visual Design

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#03020A` | Space void, base layer |
| Nebula purple | `#1A0533` | Background fog, organic blobs |
| Nebula blue | `#0A1628` | Depth layer |
| Glass fill | `rgba(255,255,255,0.06)` | Frosted glass panel surfaces |
| Glass border | `rgba(255,255,255,0.15)` | Panel edges |
| Accent primary | `#7CFFD4` | Bioluminescent mint — hover, glow, CTAs |
| Accent secondary | `#C084FC` | Soft violet — organic tendrils, labels |
| Accent tertiary | `#38BDF8` | Ice blue — links, skill tags |
| Text primary | `#F0F4FF` | Headings |
| Text secondary | `#94A3B8` | Body, metadata |

**Key visual technique:** Biopunk organic blob shapes animate *beneath* the glass panels using simplex noise vertex displacement. Colors `#1A0533` and `#7CFFD4` at 30% opacity. Creates the impression of something alive under glass.

### Typography

| Role | Font | Usage |
|------|------|-------|
| Headings | Space Grotesk | Geometric, techy, less overused than Inter |
| Monospace | JetBrains Mono | HUD elements, labels, code, coordinates readout |
| Body | Inter | Project descriptions, readable body text |

### Micro-details

- Scanline overlay at 5% opacity across full viewport (CRT/holographic feel)
- Panel corners use CSS `clip-path` — sharp, angled geometry instead of rounded corners
- Custom cursor: crosshair that expands on hover over interactive elements
- HUD coordinates readout (bottom-left): mouse position displayed as fake latitude/longitude in `JetBrains Mono`

---

## 3D Scene Design

### Scene Layers (back to front)

1. **Skybox** — GLSL shader nebula (deep purple/midnight blue) + drifting star particles
2. **Organic biopunk layer** — 3-5 low-poly blob meshes with simplex noise vertex morphing. `#1A0533` and `#7CFFD4` at 30% opacity
3. **Observatory core** — central glowing orb/ring representing the user. Pulses gently
4. **Floating glass panels** — 6 panels orbiting the core at varying distances, speeds, and tilt. Each `lookAt` the camera
5. **HUD overlay** — 2D CSS layer: coordinates, compass ring, name, title

### Interaction Model

| Action | Response |
|--------|----------|
| Hover panel | Panel lifts toward camera, border glows `#7CFFD4`, label appears, cursor changes |
| Click panel | Camera lerps toward panel (GSAP), panel expands into full modal, others fade |
| Click outside / Escape | Camera returns to default, panels resume orbit |
| Scroll | Slowly rotates entire scene (cinematic barrel feel) — no navigation destination change |

### Load Sequence (0–4 seconds)

| Time | Event |
|------|-------|
| 0.0s | Black screen |
| 0.3s | Scanline flicker, nebula fades in |
| 0.8s | Organic blobs morph into position |
| 1.2s | Observatory core pulses to life |
| 1.8s | Glass panels materialize one by one with shimmer |
| 2.5s | HUD elements type in (`JetBrains Mono`, character by character) |
| 3.0s | Name fades in, large, centered |
| 3.5s | Subtitle appears: `AI Engineer · Full-Stack Developer · CS Graduate 2025` |
| 4.0s | Panels begin slow orbit — site fully interactive |

The cinematic sequence IS the loading time. Assets load during playback; the user never sees a spinner.

---

## Content Structure

### The 6 Floating Panels

| Panel | Label | Content |
|-------|-------|---------|
| 1 | `PROJECTS` | Grid of all project cards, links to `/projects/[slug]` |
| 2 | `ABOUT` | Bio (AI-first framing), photo (optional), what you're looking for |
| 3 | `SKILLS` | Categorized skill tags |
| 4 | `CONTACT` | Email, LinkedIn, GitHub + contact form |
| 5 | `[Featured Project A]` | Best full-stack project — pre-expanded teaser in the scene |
| 6 | `[Featured Project B]` | Best AI/ML project — pre-expanded teaser in the scene |

Panels 5 and 6 are featured directly in the 3D scene so employers see your best work without clicking.

### Skills Panel Categories

- `Languages` — Python, TypeScript, SQL, etc.
- `AI/ML` — PyTorch, HuggingFace, LangChain, RAG, etc.
- `Full-Stack` — Next.js, React, Node.js, PostgreSQL, etc.
- `Infrastructure` — Docker, Vercel, AWS, etc.

### About Panel Framing

Lead with AI specialization, not degree:
> "I build full-stack applications with AI at the core — not bolted on. Final semester CS student specializing in AI, graduating 2025, looking for graduate roles in [target locations/roles]."

### Project Detail Page (`/projects/[slug]`)

2D glass-styled layout — no 3D (performance + readability). Sections:

1. Hero — project name, 1-line description, stack tags
2. Problem — what you were solving and why it matters
3. Your role — what you specifically built
4. Demo — embedded video or live link, screenshots
5. AI angle — model used, architecture, what you learned (if applicable)
6. GitHub link

---

## Performance & Accessibility

### Performance

- **Progressive load** — cinematic intro plays while assets load. No visible spinner.
- **Mobile fallback** — on screens < 768px or WebGL unavailable: 2D version with same glassmorphism aesthetic, CSS-animated panels. No degraded experience.
- **Asset budget** — nebula is a GLSL shader (no image). Blobs are procedural geometry. Target: < 400kb JS gzipped.
- **Lazy load** — project detail pages statically generated at build time.
- **Suspense boundaries** — R3F scene wrapped in `<Suspense>` for graceful fallback.

### Accessibility

- All panels keyboard-navigable (Tab + Enter)
- `prefers-reduced-motion` disables all animations — panels snap into place, no orbit, no morphing
- Semantic HTML beneath canvas — screen readers access full content
- All text meets WCAG AA contrast ratio
- `og:image` — pre-rendered Observatory screenshot for social sharing

### SEO

- Next.js static generation — Google can index all content
- Structured metadata per project page
- `og:image` pre-rendered from Observatory scene

---

## What Makes This Head-Turning

1. The load sequence IS the first impression — 4 seconds of cinema before the user even interacts
2. The site itself is a portfolio piece — building a 3D WebGL experience demonstrates more than any project card could say
3. The aesthetic is genuinely unique — glassmorphism + biopunk organic is not a combination employers have seen
4. Featured projects live in the 3D scene — no clicking required to see your best work
5. The HUD micro-details (coordinates, custom cursor, scanlines) sell the "living interface" feeling
