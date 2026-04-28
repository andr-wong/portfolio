# Bento Hero — Design Spec
**Date:** 2026-04-28  
**Status:** Approved  
**Replaces:** `HeroPro.tsx` hero section on `/`

---

## Overview

Replace the current hero section with a full-viewport asymmetric bento grid. Six cells of three sizes tile personal content alongside professional identity — a photo, GitHub activity, current reading, a hobby shot, and location. Cursor interactions (cell tilt + spotlight glow) make the grid feel alive on first load.

---

## Grid Layout

12-column CSS grid, viewport-height first screen. Three cell sizes: large, medium, small.

```
┌─────────────────────────────┬───────────────┐
│                             │  NAME /       │  row 1
│        PHOTO                │  TAGLINE      │
│        (cols 1–8, rows 1–2) ├───────────────┤
│                             │  GITHUB       │  row 2
│                             │  HEATMAP      │
├───────────────┬─────────────┴───────────────┤
│   READING     │   HOBBY PHOTO   │  LOCATION  │  row 3
└───────────────┴─────────────────┴────────────┘
```

| Cell | Cols | Rows | Size |
|------|------|------|------|
| Photo | 1–8 | 1–2 | Large |
| Name / tagline | 9–12 | 1 | Medium |
| GitHub heatmap | 9–12 | 2 | Medium |
| Currently reading | 1–4 | 3 | Medium |
| Hobby photo | 5–9 | 3 | Medium |
| Location | 10–12 | 3 | Small |

**Mobile:** single column stack — Name → Photo → GitHub → Reading → Hobby → Location.

---

## Cell Designs

Each cell has a unique visual treatment — no two cells share the same aesthetic.

### Photo
- Full-bleed `next/image`, `object-fit: cover`
- No text overlay
- 1px `var(--accent)` border on the right edge
- Source: `public/photos/bento-main.jpg` (user-supplied)
- **Unique treatment:** Image parallaxes opposite to cursor movement (~8px range) using `mousemove` on the cell, giving the image depth behind the frame. CSS film grain overlay via a tiling `noise.svg` at 4% opacity.

### Name / Tagline
- Name in `var(--font-display)`, large
- One-liner beneath in `var(--font-body)`, muted
- Status pill: `● Available for work` in `var(--accent)` green
- Subtext: `Adelaide-based engineer` in `var(--font-mono)`, `var(--fg-mute)`
- **Unique treatment:** Slow animated diagonal gradient background — dark navy → dark green, cycling every 8s via `@keyframes background-position`. The `●` dot pulses via a separate `@keyframes` opacity animation (0.4s loop). Name has a faint `text-shadow` glow in `var(--accent)`.

### GitHub Heatmap
- Embed: `https://ghchart.rshah.org/andr-wong` (free SVG proxy, no API key)
- `next/image` with `unoptimized` prop
- `next.config.js` hostname allowlist: `ghchart.rshah.org`
- Dark cell background; SVG green squares align with `var(--accent)`
- Label beneath: `contributions · github.com/andr-wong` in mono, muted
- **Unique treatment:** A thin horizontal scan line sweeps left-to-right across the contribution graph on a 4s `@keyframes` loop — a `var(--accent)` gradient stripe at 15% opacity, `pointer-events: none`. Makes the static SVG feel live, like a radar sweep.

### Currently Reading
- Data source: `lib/now.ts` — static TS file, user edits to update
- Schema: `{ reading: { title: string, author: string, url?: string } }`
- Layout: `READING` eyebrow → title in display font → author in mono
- Cell links to `url` if provided; otherwise non-interactive
- **Unique treatment:** A 4px book-spine gradient bar on the left edge (`var(--accent)` → transparent). Slow shimmer animation — a `@keyframes` `background-position` shift on a diagonal gradient overlay, like light catching a book cover. Subtle and literary.

### Hobby Photo
- Full-bleed `next/image`, `object-fit: cover`
- Source: `public/photos/bento-hobby.jpg` (user-supplied)
- **Unique treatment:** Default state: `filter: grayscale(100%) brightness(0.7)`. On hover: transitions to full colour over 400ms (`transition: filter 0.4s ease`). One of the most memorable effects — the reveal on hover rewards exploration.

### Location
- `Adelaide, AU` large, `GMT+9:30` beneath in muted mono
- **Unique treatment:** A radar ping — a small dot at centre with two expanding ring animations using `@keyframes box-shadow`, staggered by 1s. Rings pulse outward in `var(--accent)` and fade to transparent, looping every 2.5s. Feels like a live location broadcast. Dot-grid CSS background texture behind the typography.

---

## Visual Treatment

- **Gap:** 12px between cells, color `var(--bg)` (cells float as panels)
- **Border radius:** 8px per cell
- **Hover lift:** `transform: translateY(-2px)` + `box-shadow: 0 8px 24px rgba(0,255,153,0.08)`
- **Photo hover:** `filter: brightness(1.05)`
- **Reveal animation:** cells stagger-reveal on load using existing `Reveal` component, ~80ms delay between cells, left-to-right top-to-bottom order

---

## Cursor Interactions

### A — Cell Tilt (per-cell)
Each cell tracks `mousemove` within its bounds and applies a CSS 3D perspective tilt:
- Max rotation: 5° on both X and Y axes
- `perspective: 800px` on cell wrapper
- `transform: rotateX(Ydeg) rotateY(Xdeg)` driven by cursor offset from cell centre
- `transition: transform 0.1s ease` on entry, `0.4s ease` on exit (snap back)
- Implementation: `useTilt` custom hook — attaches/detaches `mousemove` + `mouseleave` listeners via `useEffect`, updates a ref-based transform (no React state re-renders)

### B — Spotlight Glow (grid-level)
A `radial-gradient` follows the cursor across the entire grid:
- Grid container tracks `mousemove`, writes `--mouse-x` and `--mouse-y` CSS variables
- `::before` pseudo-element on the grid renders: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0,255,153,0.06), transparent)`
- `pointer-events: none` on pseudo-element
- Effect only active when cursor is within the grid; fades out on `mouseleave`

Both effects are pure DOM/CSS — no animation library dependency.

---

## Data

### `lib/now.ts`
```ts
export const NOW = {
  reading: {
    title: 'The Pragmatic Programmer',
    author: 'Hunt & Thomas',
    url: '',
  },
}
```
User edits this file to update the reading cell. No CMS, no database.

### Images
- `public/photos/bento-main.jpg` — portrait or candid photo of Andrew (user-supplied)
- `public/photos/bento-hobby.jpg` — hobby/lifestyle photo (user-supplied)

---

## Files

### New
| File | Purpose |
|------|---------|
| `components/professional/BentoHero.tsx` | Grid component |
| `components/professional/BentoCell.tsx` | Individual cell wrapper with tilt hook |
| `hooks/useTilt.ts` | Mouse tilt logic |
| `lib/now.ts` | Currently reading data |

### Modified
| File | Change |
|------|--------|
| `app/page.tsx` | Swap `<HeroPro />` → `<BentoHero />` |
| `app/globals.css` | Add `.bento-grid`, `.bento-cell`, cell modifier classes |
| `next.config.js` | Add `ghchart.rshah.org` to image hostname allowlist |

### Unchanged
| File | Note |
|------|------|
| `components/professional/HeroPro.tsx` | Kept, just unused — easy to restore |

---

## Dependencies

None new. Uses: `next/image`, existing `Reveal` component, existing CSS variables, vanilla DOM event listeners.

---

## Out of Scope

- Spotify / now-playing integration (not in available content)
- CMS or database for now data (static file is sufficient)
- Opinions/hot-take cards (not in available content)
- Animated cursor (existing cursor behaviour unchanged)
