<!-- /autoplan restore point: /Users/andrwong/.gstack/projects/andr-wong-portfolio/main-autoplan-restore-20260408-111935.md -->

# Portfolio Implementation Plan — The Observatory

**Date:** 2026-04-08
**Spec:** `docs/superpowers/specs/2026-04-08-portfolio-design.md`
**Stack:** Next.js 15 + React Three Fiber + Drei + Tailwind + GSAP + Framer Motion
**Deploy:** Vercel

---

## Premises

1. The employer audience has WebGL-capable browsers (Chrome/Firefox/Edge — true for 99%+ of modern machines)
2. The portfolio's primary goal is to get an interview, not be a design showcase — content still matters
3. Build time is a real constraint (final semester student)
4. Three.js/R3F has a learning curve — time budget must account for this
5. Mobile employers exist but are secondary — desktop is primary target

---

## Phase 1: Project Setup & Foundation

**Goal:** Runnable Next.js app with all dependencies installed, basic routing, and Tailwind configured.

### Tasks

1.1 Init Next.js 15 project with App Router
```bash
npx create-next-app@latest portfolio --typescript --tailwind --app --eslint
```

1.2 Install 3D dependencies
```bash
npm install three @react-three/fiber @react-three/drei
npm install @types/three
```

1.3 Install animation dependencies
```bash
npm install gsap framer-motion
```

1.4 Install font dependencies
```bash
# Using next/font for Space Grotesk, JetBrains Mono, Inter
```

1.5 Configure Tailwind custom colors in `tailwind.config.ts`:
- `observatory-void: #03020A`
- `observatory-nebula-purple: #1A0533`
- `observatory-nebula-blue: #0A1628`
- `observatory-mint: #7CFFD4`
- `observatory-violet: #C084FC`
- `observatory-ice: #38BDF8`

1.6 Set up route structure:
```
app/
  layout.tsx          # Root layout with fonts, metadata
  page.tsx            # Observatory (3D hero)
  projects/
    [slug]/
      page.tsx        # Project detail (static)
  globals.css         # CSS custom properties, scanline overlay
```

1.7 Set up `lib/projects.ts` — static project data (slug, title, description, stack, demo URL, GitHub, AI angle)

**Deliverable:** `npm run dev` renders a Tailwind-styled blank page on port 3000. Routes exist.

---

## Phase 2: 3D Scene Foundation

**Goal:** A working R3F canvas with camera, lighting, and a placeholder object.

### Tasks

2.1 Create `components/scene/ObservatoryScene.tsx`:
- `<Canvas>` with `camera={{ position: [0, 0, 8], fov: 60 }}`
- `<Suspense fallback={null}>`
- Basic ambient + point lights
- `<OrbitControls>` disabled (camera is controlled by GSAP)

2.2 Create `components/scene/SceneWrapper.tsx`:
- Detects WebGL support on mount
- Renders `<ObservatoryScene>` if supported
- Renders `<FallbackScene>` (2D) if not
- Renders nothing during SSR (dynamic import with `ssr: false`)

2.3 Wire `SceneWrapper` into `app/page.tsx` with `next/dynamic`

2.4 Verify: A grey R3F canvas renders in the browser. No console errors.

**Deliverable:** Working 3D canvas. Placeholder box visible.

---

## Phase 3: Skybox — Nebula Background

**Goal:** Deep space backdrop using a GLSL shader sphere.

### Tasks

3.1 Create `components/scene/NebulaBackground.tsx`:
- Large sphere (`radius=50, side=BackSide`) wrapping the scene
- Custom `ShaderMaterial` with vertex + fragment shaders

3.2 Write `shaders/nebula.frag.glsl`:
- Base color: `#03020A`
- Blend radial fog of `#0A1628` and `#1A0533`
- Simplex noise for cloud-like variation
- Use `vUv` for coordinates

3.3 Write `shaders/nebula.vert.glsl`:
- Standard passthrough with `vUv` varying

3.4 Create `components/scene/StarField.tsx`:
- 2000 points using `<Points>` from Drei
- Random positions on sphere surface
- Small white/ice-blue dots, randomized opacity
- Slow drift animation via `useFrame`

**Deliverable:** Deep space background with stars visible. Scene feels like outer space.

---

## Phase 4: Organic Biopunk Layer

**Goal:** Living, morphing blob shapes behind the glass panels.

### Tasks

4.1 Create `components/scene/OrganicBlob.tsx`:
- Icosphere geometry with ~100 vertices
- `MeshStandardMaterial` with `color=#1A0533`, `opacity=0.3`, `transparent`
- On each `useFrame`: displace vertices using simplex noise keyed to `clock.elapsedTime`
- Props: `position`, `scale`, `color`, `speed`

4.2 Create `components/scene/BiopunkLayer.tsx`:
- Renders 4 `OrganicBlob` instances at different positions/scales
- Mix of `#1A0533` and `#7CFFD4` at 30% opacity
- Stagger speeds to avoid synchrony

4.3 Install simplex noise: `npm install simplex-noise`

4.4 Performance: reuse geometry ref, only update positions via `BufferAttribute` (not recreating geometry each frame). Update throttled to every 50ms (not every frame): `if (clock.elapsedTime % 0.05 < 0.016) updateGeometry()`. Set `geometry.attributes.position.needsUpdate = true` only after mutation, never otherwise. Target: ≤4 CPU noise calculations per 50ms window (one per blob).

**Deliverable:** Soft, pulsing organic shapes visible behind the scene. Gives "alive under glass" feeling.

---

## Phase 5: Observatory Core

**Goal:** Central glowing orb representing "you."

### Tasks

5.1 Create `components/scene/ObservatoryCore.tsx`:
- Sphere geometry, radius 0.4
- `MeshStandardMaterial` with `emissive=#7CFFD4`, `emissiveIntensity` animated 0.5→1.5
- Outer glow using Drei `<Sparkles>` or a second larger transparent sphere

5.2 Point light attached to core: `color=#7CFFD4`, intensity 2, distance 8

5.3 Slow pulsing: `Math.sin(clock.elapsedTime * 0.8)` drives `emissiveIntensity`

**Deliverable:** Glowing green-mint orb at scene center, breathing gently.

---

## Phase 6: Glass Panel System

**Goal:** 6 frosted glass panels orbiting the core.

### Tasks

6.1 Create `types/panel.ts`:
```typescript
interface PanelData {
  id: string
  label: string
  orbitRadius: number
  orbitSpeed: number
  orbitOffset: number  // initial angle offset (radians)
  orbitInclination: number  // tilt from XZ plane
  content: 'projects' | 'about' | 'skills' | 'contact' | 'featured-a' | 'featured-b'
}
```

6.2 Create `lib/panels.ts` — static panel config for all 6 panels

6.3 Create `components/scene/GlassPanel.tsx`:
- `PlaneGeometry` (2.5 × 1.8)
- `MeshPhysicalMaterial`:
  - `transmission=0.95`, `roughness=0.05`, `metalness=0`
  - `color=#ffffff`, `opacity=0.06`, `transparent`
  - `envMapIntensity=1`
- Border: thin `EdgesGeometry` with `LineBasicMaterial` `color=#ffffff`, `opacity=0.15`
- Label (2D HTML via `<Html>` from Drei, centered above panel)
- Hover state: border color → `#7CFFD4`, slight Z-axis translation toward camera
- Click handler prop

6.4 Create `components/scene/PanelOrbit.tsx`:
- Wraps a `GlassPanel` in orbit math
- On `useFrame`: `x = cos(time * speed + offset) * radius`, `z = sin(...) * radius`
- Inclination applied as Y rotation on parent group
- Panel always `lookAt` camera position

6.5 Create `components/scene/PanelSystem.tsx`:
- Renders 6 `PanelOrbit` instances
- Passes `onPanelClick(panelId)` down

6.6 Environment map: `<Environment preset="city">` from Drei for glass reflections

**Deliverable:** 6 glass panels orbiting the core. Hover highlights. Clickable.

---

## Phase 7: Interaction & Camera System

**Goal:** Click a panel → camera moves to it, panel expands. Click away → reset.

### Tasks

7.1 Create `hooks/useObservatoryCamera.ts`:
- Holds `activePanelId` state and `targetPos` (Vector3)
- `focusPanel(id)`: sets `targetPos` to panel world position (does NOT tween camera directly)
- `resetCamera()`: sets `targetPos` back to `[0, 0, 8]`
- `useFrame` inside hook lerps `camera.position` toward `targetPos` each frame:
  ```typescript
  useFrame(({ camera }) => {
    camera.position.lerp(new Vector3(...targetPos), 0.05)
  })
  ```
- CRITICAL: Do NOT use GSAP to mutate camera position directly — GSAP and R3F's render loop race and cause jitter. All camera mutation must happen inside `useFrame`.

7.2 Wire click handlers: clicking a panel calls `focusPanel`, clicking scene background calls `resetCamera`

7.3 Create `components/scene/PanelModal.tsx`:
- Renders as `<Html fullscreen>` overlay when a panel is active
- Framer Motion `AnimatePresence` for enter/exit
- Glass-styled modal (CSS backdrop-filter: blur, rgba background)
- Content routed by `activePanelId`
- Close button + Escape key listener

7.4 Scroll handler on Canvas:
- `onWheel`: rotate entire scene group by small delta on Y axis
- Clamp rotation speed so it's cinematic, not vertiginous

7.5 Keyboard: Tab/Enter to cycle through panels (accessibility)

**Deliverable:** Full interaction loop. Click panel → camera moves, modal opens. Escape → reset.

---

## Phase 8: HUD Overlay

**Goal:** 2D interface elements that make the site feel like a real operating system.

### Tasks

8.1 Create `components/hud/CoordinatesDisplay.tsx`:
- Tracks mouse position via `mousemove` listener
- Maps to fake lat/long: `LAT 33°52'N  LON 151°12'E` (Sydney coords + mouse offset)
- JetBrains Mono, `#7CFFD4`, bottom-left, 12px
- Updates at 30fps (throttled)

8.2 Create `components/hud/CompassRing.tsx`:
- SVG circle with tick marks
- Rotates slowly (CSS animation, 120s full rotation)
- Position: bottom-left, above coordinates

8.3 Create `components/hud/SystemStatus.tsx`:
- Top-right corner
- Lines like: `SYS: ONLINE`, `AI: ACTIVE`, `VERSION: 2025.1`
- JetBrains Mono, `#94A3B8`, 10px

8.4 Create `components/hud/Nameplate.tsx`:
- Center of viewport during load sequence
- Large heading: user's name (Space Grotesk, `#F0F4FF`)
- Subtitle: `AI Engineer · Full-Stack Developer · CS Graduate 2025`
- Stays visible (at 50% opacity) while panels are in orbit — only fades out when a panel is clicked
- Rationale: recruiter needs to see who you are at all times, not just for 0.5s

8.5 Scanline CSS overlay in `globals.css`:
```css
.scanlines::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.05) 2px,
    rgba(0,0,0,0.05) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

8.6 Custom cursor in `globals.css`:
- `cursor: none` on body
- `components/hud/CustomCursor.tsx`: follows mouse, crosshair SVG, expands on interactive elements

**Deliverable:** Full HUD visible. Coordinates update on mouse move. Custom cursor active.

---

## Phase 9: Cinematic Load Sequence

**Goal:** The 4-second cinematic that makes employers stop in the first 5 seconds.

### Tasks

9.1 Create `components/LoadSequence.tsx`:
- State machine: `idle → nebula → blobs → core → panels → hud → name → subtitle → complete`
- Controls visibility/opacity of each scene layer via refs + GSAP

9.2 GSAP timeline:
```
t=0.0  black screen (initial state)
t=0.3  nebula sphere opacity 0→1 (0.8s ease-in)
t=0.8  blobs scale 0→1, opacity 0→0.3 (0.6s)
t=1.2  core emissive 0→1, point light intensity 0→2 (0.5s)
t=1.8  panels: stagger materialOpacity 0→0.06 per panel (0.15s each)
t=2.5  HUD elements: typewriter effect on each line (0.8s total)
t=3.0  name plate: opacity 0→1 (0.4s)
t=3.5  subtitle: opacity 0→1 (0.4s)
t=4.0  panels begin orbit (speed 0→1 over 1s), site interactive
```

9.3 Typewriter effect for HUD lines:
- `components/hud/Typewriter.tsx`: renders characters one by one using `setInterval`
- Char delay: 30ms

9.4 Loading gate: R3F `useProgress` hook monitors asset load. Load sequence only starts when progress === 100.

9.5 `prefers-reduced-motion` check: if true, skip animation — all elements appear instantly at t=0.

9.6 Error state design (add to this phase):
- WebGL failure → show 2D fallback with brief message: "3D mode unavailable — viewing classic mode" (dismissible, top banner)
- Partial panel load (shader error) → missing panels simply don't appear in orbit; HUD shows normally
- Contact form API error → inline error below submit: "Message not sent. Try [email link] directly." with retry button
- Missing project image → solid color swatch using project's primary stack color as placeholder

### Absolute Load Timing Reference

Implementer reference (start time → duration → end time):

| Event | Start | Duration | End |
|-------|-------|----------|-----|
| Black screen | 0.0s | 0.3s | 0.3s |
| Nebula fade-in | 0.3s | 0.8s | 1.1s |
| Blobs scale-in | 0.8s | 0.6s | 1.4s |
| Core glow | 1.2s | 0.5s | 1.7s |
| Panels materialize (6×, staggered by 0.15s each) | 1.8s | 0.9s | 2.7s |
| HUD typewriter (all elements parallel) | 2.5s | 0.8s | 3.3s |
| Nameplate fade-in | 3.0s | 0.4s | 3.4s |
| Subtitle fade-in | 3.5s | 0.4s | 3.9s |
| Orbit speed ramp (0→full) | 4.0s | 1.0s | 5.0s |

9.5 `prefers-reduced-motion` check: if true, skip animation — all elements appear instantly at t=0.

**Deliverable:** Full cinematic intro plays on first load. Employers see the observatory come to life.

---

## Phase 10: Panel Content

**Goal:** Each panel has real content. Projects, About, Skills, Contact all functional.

### Tasks

10.1 **Projects panel** (`components/panels/ProjectsPanel.tsx`):
- Grid of project cards (2 columns)
- Each card: thumbnail (screenshot), title, 1-line description, stack tags
- Click → navigate to `/projects/[slug]`

10.2 **About panel** (`components/panels/AboutPanel.tsx`):
- Photo (optional, circular, 80px)
- Bio paragraph (AI-first framing)
- Location + availability badge: `Open to grad roles — Sydney / Remote`
- Links: LinkedIn, GitHub, Resume PDF

10.3 **Skills panel** (`components/panels/SkillsPanel.tsx`):
- 4 category rows: Languages, AI/ML, Full-Stack, Infrastructure
- Skill tags with ice-blue (`#38BDF8`) border
- Skill proficiency not shown (avoid implicit ranking trap)

10.4 **Contact panel** (`components/panels/ContactPanel.tsx`):
- Email link (mailto)
- LinkedIn, GitHub icon links
- Simple form: name, email, message → POST to API route `/api/contact`
- Honeypot field (hidden) to block bots
- API route (`app/api/contact/route.ts`):
  - Validate `referer` header matches `NEXT_PUBLIC_SITE_URL` (CSRF protection)
  - Rate limit: max 5 requests/hour per IP (use Upstash Redis free tier or simple in-memory Map)
  - Validate email format with regex
  - Limit message to 2000 chars
  - Return 400 with clear error message on validation failure
  - Use Resend for email delivery
- Form success state: thank you message, form clears
- Form error state: inline error below submit button, retry available

10.5 **Featured panel A** (`components/panels/FeaturedProjectPanel.tsx`):
- Larger format, pre-expanded in scene
- Project name, 2-sentence description, stack tags
- "View full case study" → `/projects/[slug]`
- Demo link + GitHub link

10.6 **Featured panel B**: Same component, different data

10.7 Add real project data to `lib/projects.ts` (user fills in their actual projects)

**Deliverable:** All 6 panels have working content. Contact form sends email.

---

## Phase 11: Project Detail Pages

**Goal:** Individual project pages accessible via `/projects/[slug]`.

### Tasks

11.1 `app/projects/[slug]/page.tsx`:
- `generateStaticParams` from `lib/projects.ts`
- `generateMetadata` for SEO

11.2 `components/ProjectDetail.tsx` layout:
- Glass-styled hero section: project name, description, stack tags
- Problem section
- Role section
- Demo: `<video>` or `<iframe>` for live demo + screenshots gallery
- AI angle section (conditional)
- GitHub + live demo CTAs
- Back link → `/` (returns to Observatory)

11.3 Screenshot gallery: lightbox on click using Framer Motion

11.4 Layout uses same dark background (`#03020A`) + glassmorphism panels as Observatory — visual consistency

**Deliverable:** All projects have detail pages. Statically generated at build time.

---

## Phase 12: Mobile Fallback (2D Mode)

**Goal:** Employers on phones see a beautiful 2D version, not a broken 3D site.

### Tasks

12.1 `components/scene/FallbackScene.tsx` (rendered when WebGL unavailable or `window.innerWidth < 768`):
- Same background color `#03020A`
- CSS glassmorphism panels (backdrop-filter: blur)
- CSS animation: panels float up/down with `@keyframes`
- Same HUD elements (coordinates, name, subtitle)
- Scrollable layout: panels stack vertically

12.2 Breakpoint detection hook `hooks/useDeviceCapability.ts`:
- Checks `window.innerWidth`, WebGL support via canvas test
- Returns `{ is3DCapable: boolean }`

12.3 `SceneWrapper` uses this hook to choose 3D vs 2D

12.4 `prefers-reduced-motion`: 2D mode also disables float animations

**Deliverable:** Open on mobile → 2D glass layout. Same content, same aesthetic.

---

## Phase 13: Performance Optimization

**Goal:** Under 400kb gzipped JS. Fast initial load. 60fps on mid-range hardware.

### Tasks

13.1 Bundle analysis: `npm install @next/bundle-analyzer`, run analysis, identify large chunks

13.2 Three.js tree-shaking: import only used geometries/materials (not all of Three)

13.3 DRACO compression for any geometry files (none expected — all procedural)

13.4 Texture-free: confirm nebula and blobs are all procedural (no PNG/JPG assets)

13.5 Dynamic import: `next/dynamic` with `ssr: false` for the Canvas component

13.6 Frame budget: profile with React DevTools + Spector.js. Target: draw calls < 20/frame

13.7 `useFrame` optimization: expensive calculations (noise) only on dirty flag

13.8 Asset preloading: `<link rel="preconnect">` for Google Fonts in `app/layout.tsx`

**Deliverable:** Lighthouse performance score ≥ 85. Bundle < 400kb gzipped. 60fps on mid-range laptop.

---

## Phase 14: Accessibility

**Goal:** WCAG AA. Keyboard navigable. Reduced motion respected.

### Tasks

14.1 Keyboard navigation:
- Tab cycles through the 6 panels (via `tabIndex` on panel hit areas)
- Enter activates focused panel
- Escape closes active panel
- Visible focus ring (use `:focus-visible`, `#7CFFD4` outline)

14.2 Screen reader:
- `<Canvas aria-hidden="true">` — 3D scene is decorative
- Semantic HTML rendered beneath canvas with all content (visually hidden)
- Skip-to-content link at top

14.3 Reduced motion:
- `window.matchMedia('(prefers-reduced-motion: reduce)')` checked on mount
- If true: skip load sequence, disable orbit, disable blob morphing, disable cursor effects

14.4 Color contrast: verify all text on glass panels meets 4.5:1 ratio (use WebAIM contrast checker)

14.5 Touch targets: on 2D mobile, all interactive elements ≥ 44×44px

**Deliverable:** axe DevTools shows 0 violations. Tab through the site works fully.

---

## Phase 15: SEO & Metadata

**Goal:** Google can index content. Social sharing works.

### Tasks

15.1 Root `app/layout.tsx` metadata:
```typescript
export const metadata: Metadata = {
  title: '[Name] — AI Engineer & Full-Stack Developer',
  description: 'Portfolio of [Name], CS graduate specializing in AI...',
  openGraph: { images: ['/og-image.png'] }
}
```

15.2 Generate `og-image.png`: screenshot of the Observatory at `1200×630` using Puppeteer or manually captured

15.3 Per-project metadata in `generateMetadata` function

15.4 `robots.txt` and `sitemap.xml` via Next.js App Router conventions

15.5 Structured data: `Person` + `CreativeWork` JSON-LD in layout

**Deliverable:** Google Search Console can index site. Social shares show Observatory preview image.

---

## Phase 16: Deployment

**Goal:** Live on a custom domain via Vercel. CI/CD pipeline active.

### Tasks

16.1 Push to GitHub: `git remote add origin <repo>`, initial push

16.2 Connect Vercel: import GitHub repo, auto-detect Next.js

16.3 Environment variables: `RESEND_API_KEY` (for contact form) via Vercel dashboard

16.4 Custom domain: configure DNS in Vercel dashboard (user needs domain purchased)

16.5 Verify: production build succeeds, all routes accessible, contact form works

16.6 Set up preview deployments: every PR gets a Vercel preview URL

**Deliverable:** Portfolio live at `https://[domain].com`. Contact form sends email. CI/CD active.

---

## Build Order

The phases have dependencies. Follow this order strictly:

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
→ Phase 8 → Phase 9 → Phase 10 → Phase 11 → Phase 12 → Phase 13
→ Phase 14 → Phase 15 → Phase 16
```

Phase 12 (mobile fallback) can be built in parallel with Phase 11 (project detail pages) once Phase 10 (panel content) is done — it depends on Phase 10 panel content, not just Phase 2.
Phase 15 (SEO) can be done at any point after Phase 1.

---

## NOT In Scope (This Plan)

- Blog or writing section
- AI chatbot "Ask me anything" (was considered, deferred — adds complexity without core need)
- Dark/light mode toggle (dark-only is intentional)
- Authentication / admin panel for updating projects (use static data + redeploy)
- Analytics (add Vercel Analytics post-launch in < 30 mins)
- Internationalization

---

## What Already Exists

| Sub-problem | Existing solution |
|-------------|------------------|
| Next.js boilerplate | `create-next-app` handles it |
| 3D glass material | Drei `MeshPhysicalMaterial` with transmission |
| Orbit controls (disabled) | Drei `<OrbitControls>` |
| Environment reflections | Drei `<Environment>` |
| HTML in 3D space | Drei `<Html>` |
| Progress tracking | R3F `useProgress` hook |
| Typewriter effect | Build custom — 20 lines, no dep needed |
| Simplex noise | `simplex-noise` npm package |
| Animation tweening | GSAP (already planned) |
| CSS glassmorphism | Native CSS `backdrop-filter: blur()` |

---

---

## Phase 17: Testing

**Goal:** Catch regressions before they reach production. Achievable in 1-2 days.

### Tasks

17.1 Unit tests (`vitest`):
- `useObservatoryCamera`: test `focusPanel` sets correct `targetPos`, `resetCamera` returns to `[0,0,8]`
- `lib/projects.ts`: all slugs are unique, all required fields present
- Contact form API route: validate email rejection, message length limit, referer check

17.2 E2E tests (Playwright):
- Panel click → modal opens
- Escape key → modal closes
- Tab through 6 panels → all focusable
- Enter on focused panel → modal opens
- Mobile viewport → 2D layout renders, 3D canvas absent

17.3 Visual: capture a screenshot of the Observatory at t=4.0s (after load sequence) as a manual regression baseline

17.4 Performance: Lighthouse CI in Vercel preview — fail PR if performance score < 80

**Deliverable:** `npm test` passes. Playwright suite passes on CI.

---

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|---------|
| 1 | Setup | Use Next.js 15 App Router | Mechanical | P5 (explicit) | Industry standard, best docs, Vercel native | Pages Router |
| 2 | Setup | React Three Fiber over raw Three.js | Mechanical | P5 (explicit) | React integration, Drei helpers save weeks | Raw Three.js |
| 3 | Setup | Static project data in `lib/projects.ts` | Mechanical | P5 (explicit) | No CMS needed for a portfolio. Redeploy to update | Headless CMS |
| 4 | Contact | Resend for email delivery | Mechanical | P3 (pragmatic) | Best DX for Next.js API routes, free tier sufficient | SendGrid, Nodemailer |
| 5 | Mobile | 2D CSS fallback, not responsive 3D | Mechanical | P5 (explicit) | Responsive 3D is 10x harder. CSS glass is beautiful | Responsive Three.js |
| 6 | AI chatbot | Deferred | Mechanical | P5 (explicit) | Adds significant complexity, risk of bad responses, distraction from portfolio content | In this plan |
| 7 | Phase 7 | useFrame lerp for camera, not GSAP direct | Mechanical | P5 (explicit) | GSAP vs R3F render loop race = jitter. useFrame is the correct R3F pattern | GSAP camera mutation |
| 8 | Contact | Add CSRF + rate limiting + validation | Mechanical | P1 (completeness) | API route is public — security is not optional | Unprotected route |
| 9 | HUD | Nameplate persists until panel click | Mechanical | P5 (explicit) | Recruiter must always know who they're looking at | Fade at 3.5s |
| 10 | Phase 9 | Add error states Phase 9.6 | Mechanical | P1 (completeness) | WebGL failure, form errors, partial load must all degrade gracefully | Happy-path only |
| 11 | Phase 4 | Throttle noise updates to 50ms intervals | Mechanical | P3 (pragmatic) | 60fps noise on 400 vertices → CPU bound on mid-range hardware | Every-frame update |
| 12 | Phase 12 | Depends on Phase 10 (not Phase 2) | Mechanical | P3 (pragmatic) | 2D fallback needs actual panel content to mirror | Wrong dependency |
| 13 | All | Add Phase 17 testing | Mechanical | P1 (completeness) | Zero tests in original plan → silent regressions guaranteed | No tests |

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | Skipped — no developer-facing scope |

**VERDICT:** APPROVED — user accepted all auto-decisions, proceeding with Observatory as primary portfolio. Two taste decisions open (glass material, phase order). One user challenge surfaced and user confirmed original direction.

### Cross-Phase Themes Identified
1. **Performance risk** — flagged by CEO + Eng independently. Mitigation: profile by end of Phase 5.
2. **Mobile/fallback secondary** — flagged by CEO + Design independently. Test 2D fallback on Windows before Phase 10.
