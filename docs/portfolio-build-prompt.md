# Portfolio Website — Build Prompt

> Paste this into any capable code/website builder (Claude, v0, Lovable, Bolt, Cursor).
> It is intentionally complete: design system, content, layout, and acceptance criteria are all specified.

---

## ROLE

You are a senior product designer + front-end engineer. Build a personal portfolio website for **Andrew Wong**, a final-year Computer Science student in Adelaide applying for graduate software engineering roles. The site must be **immediately scannable** (a recruiter finds the important things in under 10 seconds), visually **distinctive** (not a generic template), and **personal** (it sounds like a real person who builds things, not a CV dump).

## AUDIENCE & GOAL

- Primary visitor: a recruiter or engineering manager screening for a graduate role, skimming on desktop, often on mobile.
- They must learn, fast: *who he is, what he's built that's real, what he's good at, how to contact him, where the code/demos are.*
- Secondary goal: convey personality and taste so he's memorable.
- Single call to action throughout: **see the work** and **get in touch**.

## NON-NEGOTIABLE PRINCIPLES

1. **Scannability first.** Strong visual hierarchy. The most important info (name, one-line pitch, "open to grad roles", links to live projects, contact) is reachable without hunting. Use clear section numbering, generous whitespace, and short blocks of text. No walls of prose.
2. **Cool but legible.** Distinctive design, but never at the cost of readability or load speed. No gimmicks that get in the way of information.
3. **Personal, not corporate.** Microcopy is plainspoken and a little dry. Avoid buzzwords ("passionate", "synergy", "results-driven"). Avoid em dashes in body copy where a period works.
4. **Real content only.** Use the content provided below verbatim or lightly edited. Do not invent achievements.

---

## DESIGN SYSTEM — "Swiss / Grid"

A clean, structured, design-engineer aesthetic. Think Swiss typographic grid meets a modern developer portfolio.

**Color tokens**
- Background / paper: `#FFFFFF`
- Ink (primary text): `#0A0A0A`
- Accent (electric blue, used sparingly): `#1F4DFF`
- Muted text: `#6B6B6B`
- Hairline rules / borders: `#E4E4E4`
- Soft fill (tag backgrounds, subtle blocks): `#F6F6F4`
- Dark section (contact block): background `#0A0A0A`, text `#FFFFFF`, accent `#5B7BFF`

**Typography**
- Display + UI: **Space Grotesk** (weights 400/500/600/700). Tight tracking on big headings (`letter-spacing: -0.03em`), line-height ~0.95 for hero.
- Labels / eyebrows / meta / numbers: **JetBrains Mono** (uppercase, `letter-spacing: 0.12em`, 11px).
- Body copy: **Inter** (400/500), line-height 1.5–1.6.
- Load via the platform's font system (e.g. `next/font/google`) and expose as CSS variables. No FOUT.

**Layout language**
- A visible grid: 1px hairline rules separating sections and dividing card rows/columns.
- Numbered sections: small mono label top-right of each section, e.g. `01 / About`, `02 / Selected Work`.
- Accent blue is used for: one or two words in each headline, the status dot, primary buttons, link underlines, and stat numbers. Nowhere else.
- Buttons: sharp corners (border-radius 0–2px). Solid blue primary, ink-outline ghost secondary.
- Generous section padding (desktop ~64px vertical, 48px horizontal). Tighten gracefully on mobile.

**Motion (subtle)**
- Gentle fade/slide-up on scroll-into-view for section content (respect `prefers-reduced-motion`).
- Stat numbers count up once when they enter the viewport.
- Hover: small lift/underline on cards and links. No parallax, no 3D, no heavy animation.

---

## SITE STRUCTURE

Two pages, shared nav and footer.

- `/` — **Professional** (the main page, recruiter-facing)
- `/personal` — **Personal** (off-the-clock; same visual language, lighter tone)
- `/projects/[slug]` — optional detail pages for featured projects (reuse the design system)

**Nav** (sticky, thin 2px ink bottom border): brand `Andrew Wong` left; links `Work` / `Personal` / `Contact` right; active link in accent blue.

**Footer** (mono, small, muted): `© 2026 ANDREW WONG` · `ADELAIDE / 34.92°S 138.60°E` · `BUILT WITH NEXT.JS`.

---

## PAGE 1 — PROFESSIONAL (`/`)

### Hero
Two-column grid (≈ 1.6fr / 1fr). Left:
- Eyebrow (mono, with blue status dot): `● OPEN TO GRADUATE ROLES — 2026`
- Headline (huge, ~64px desktop): **I build software that replaces the spreadsheet.** — accent-blue the word "spreadsheet."
- Bio (Inter, max ~540px): *"Final-year CS student at the University of Adelaide. When I see a process being done by hand that shouldn't be, I tend to end up writing the software for it — event platforms, civic tooling, and the small apps that quietly retire a WhatsApp chain."*
- CTAs: solid blue **View Work →**, ghost **Download CV** (links to a PDF).

Right column = a meta panel separated by a left hairline, rows divided by hairlines:
- `LOCATION` → Adelaide, SA · UTC+9:30
- `STUDYING` → BCS, University of Adelaide · 2026
- `RECENT` → 2nd place — CSC × UPC Hackathon
- `STACK` → TS · Python · SvelteKit · Next.js

### Stats strip
Four cells divided by vertical hairlines. Big accent-blue numbers, mono caption beneath:
- `3yr` — Writing production code
- `7` — Projects shipped or completed
- `3` — Apps live in production
- `2nd` — CSC × UPC Hackathon 2025

### 01 / About
Heading: **A consulting mindset, _wrapped around an engineer._** (accent the italic clause). Two columns:
- Left, two short paragraphs: *"I build full-stack systems end-to-end — from a Mapbox-driven event map built across a hackathon weekend, to a Dijkstra-based passenger router that quietly replaced a manual spreadsheet on Sunday mornings."* / *"The thread across my work is the same: find the boring, manual, error-prone process and replace it with something humane and durable."*
- Right: mono label `TECH I REACH FOR` + a wrap of bordered tags: TypeScript, Python, React, Next.js, SvelteKit, FastAPI, Supabase, PostgreSQL, Mapbox GL, OpenAI, Tailwind.

### 02 / Selected Work
Heading: **Three things _actually in production._** Three project cards in a bordered 3-column grid (stack to 1 column on mobile). Each card: mono number, title, one-line blurb, mono stack chips, and links.

1. **Mapster** — `001` — *Single map for everything happening in Adelaide. 100+ events from 6 sources. 2nd place, CSC × UPC 2025.* — SvelteKit · FastAPI · Supabase · Mapbox · OpenAI — Live ↗ (https://mapster.city), GitHub ↗
2. **Headcount** — `002` — *Replaced a manual WhatsApp chain for Sunday attendance at Hope Church Adelaide. Auth, roles, calendar reports. Live in use.* — Vanilla JS · Supabase · Edge Functions — Live ↗ (https://headcount.andrwong.com), GitHub ↗
3. **HCF Router** — `003` — *Passenger-to-driver assignment, by hand, automated. Dijkstra routing, address autocomplete, live map.* — Next.js · MapLibre · OSRM · Supabase — Case study ↗

(Optionally link each to a `/projects/[slug]` detail page with: Problem, Role, AI Angle, full stack, screenshots.)

### 03 / Capabilities
Heading: **Six surfaces, _one engineer._** A 3×2 grid of tiles (hairline-separated). Each: mono tag, short title, one sentence.
- `↳ FE` Front-end systems — React, Next.js, SvelteKit. Interactive maps, real-time UI, design systems from scratch.
- `↳ BE` Back-end & APIs — FastAPI, Node, Supabase. REST design, auth, role-based access, edge functions.
- `↳ DATA` Data & scraping — Selenium, BeautifulSoup, dedup pipelines. Messy sources into clean structured data.
- `↳ AI` Applied AI — OpenAI Vision parsing posters into structured events. Practical, shipped, not demo-ware.
- `↳ ALGO` Algorithms — Dijkstra routing, regression modelling in R, collision systems in C++.
- `↳ SHIP` Ship & operate — Vercel, Railway, CI. Things that go live and stay live, used by real people.

### 04 / Timeline
Heading: **Four years, _compounding quietly._** Vertical list, mono year in accent, divided by hairlines:
- `2025` 2nd place — CSC × UPC Hackathon — built Mapster with the HackerCodex team across one weekend.
- `2024 →` Retail & sales (JB Hi-Fi, Myer) — customer problem-solving under pressure; recovered thousands in mis-scanned stock during inventory counts.
- `2023` Switched Mechanical Engineering → Computer Science at the University of Adelaide.

### 05 / Education
Heading: **Education.** Same list pattern:
- `2023–26` Bachelor of Computer Science — University of Adelaide, expected July 2026.
- `2018–22` SACE — Modbury High School, Adelaide SA.

### Contact (dark block)
Full-width `#0A0A0A` block, centered. Headline: **Let's build _something._** (accent the last word). Sub (muted): *Open to graduate software roles. Adelaide or remote.* Big primary button: `andrwong101@gmail.com →` (mailto). Below it, mono links: GitHub (github.com/andr-wong) · LinkedIn (linkedin.com/in/andrwong).

---

## PAGE 2 — PERSONAL (`/personal`)

Same design system, lighter and warmer tone. Sections:
- **Hero** — eyebrow `● OFF THE CLOCK`, headline like **The other half of the keyboard.**, short intro: *Coffee, code, and church on Sundays. Adelaide is home.*
- **Now** — `WHAT'S CURRENTLY IN ROTATION`: currently reading *The Pragmatic Programmer* (Hunt & Thomas); a "now" line; location card (Adelaide, AU · GMT+9:30).
- **Things I keep coming back to** — a short list of tools/books/habits.
- **A few opinions, lightly held** — 3–5 short, opinionated one-liners about software/engineering/life (field notes voice).
- **Contact** — same dark block, friendlier copy.

Keep personal copy honest and specific. It should feel like a person, not a brand.

---

## TECH & QUALITY BAR

- **Stack:** Next.js (App Router) + React + TypeScript. CSS variables for the design tokens (or Tailwind v4 with the tokens mapped). No CSS-in-JS runtime needed.
- **Responsive:** Fully fluid. Multi-column grids collapse to single column on mobile; hero meta panel moves below the headline; tap targets ≥ 44px. Test at 390px, 768px, 1440px.
- **Accessibility:** Semantic landmarks, one `<h1>` per page, visible focus states, color contrast ≥ WCAG AA (check blue-on-white and white-on-ink), `prefers-reduced-motion` honored, alt text on images, skip-to-content link.
- **Performance:** Lighthouse ≥ 95 on performance and accessibility. Self-hosted fonts via `next/font` with `display: swap`. No layout shift. Lazy-load below-the-fold images.
- **SEO:** Per-page `<title>` + meta description, Open Graph image, `sitemap.xml`, `robots.txt`.
- **Polish:** No placeholder lorem ipsum. No console errors. No horizontal scroll. Consistent spacing scale. One accent color, used sparingly.

## DEFINITION OF DONE

- [ ] Recruiter can find name, pitch, "open to grad roles", live project links, and contact within 10 seconds on both desktop and mobile.
- [ ] Two pages built, nav active states correct, all external links work (mapster.city, headcount.andrwong.com, GitHub, LinkedIn, mailto).
- [ ] Design matches the Swiss/Grid system: white/ink/electric-blue, Space Grotesk + JetBrains Mono + Inter, visible grid, numbered sections.
- [ ] Fully responsive, AA accessible, Lighthouse ≥ 95 perf + a11y, no console errors.
- [ ] Copy reads like a real person. No buzzwords. Real content throughout.

## REFERENCE CONTACT BLOCK (source of truth)

- Name: Andrew Wong
- Email: andrwong101@gmail.com
- Location: Adelaide, SA, Australia (UTC+9:30)
- GitHub: github.com/andr-wong
- LinkedIn: linkedin.com/in/andrwong
- Study: B. Computer Science, University of Adelaide, expected July 2026
- Headline award: 2nd place, CSC × UPC Hackathon 2025 (Mapster)
