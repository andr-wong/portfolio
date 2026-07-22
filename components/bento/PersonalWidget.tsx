'use client';

// ═══════════════════════════════════════════════════════════════════════
//  PERSONAL WIDGET — edit WIDGET_CONFIG to make this tile uniquely yours
//
//  Examples of what you could put here:
//    • Currently watching anime    →  type: 'anime-scene'
//    • Favourite album right now   →  type: 'vinyl'
//    • A game you can't put down   →  type: 'game'
//    • A place you want to visit   →  type: 'map-pin'
//
//  Swap the <MoonScene /> below with your own JSX if you want a
//  completely different animation. The tile is self-contained.
// ═══════════════════════════════════════════════════════════════════════

const WIDGET_CONFIG = {
  label: 'currently watching',
  title: 'Dungeon Meshi',
  meta: '2024 · Studio TRIGGER',
  tags: ['anime', 'shonen', 'food'],
};

interface PersonalWidgetProps {
  dly: string;
}

export function PersonalWidget({ dly }: PersonalWidgetProps) {
  return (
    <section
      className="tile widget-tile"
      style={{ '--d': dly } as React.CSSProperties}
      aria-label={`Currently: ${WIDGET_CONFIG.title}`}
    >
      <div className="label widget-lbl">{WIDGET_CONFIG.label}</div>

      {/* ── Replace the scene component below to change the animation ── */}
      <div className="widget-scene" aria-hidden="true">
        <MoonScene />
      </div>

      <div className="widget-footer">
        <div className="widget-title">{WIDGET_CONFIG.title}</div>
        <div className="widget-meta">{WIDGET_CONFIG.meta}</div>
        <div className="widget-tags">
          {WIDGET_CONFIG.tags.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Anime night sky scene ──────────────────────────────────────────────
// Pure CSS animation: floating moon, drifting sakura petals, twinkling stars.
// Change the colours in globals.css under "/* ---- Personal Widget ---- */".

function MoonScene() {
  return (
    <div className="moon-scene">
      <div className="ms-moon" />
      <div className="ms-petal ms-p0" />
      <div className="ms-petal ms-p1" />
      <div className="ms-petal ms-p2" />
      <div className="ms-petal ms-p3" />
      <div className="ms-petal ms-p4" />
      <div className="ms-petal ms-p5" />
      <div className="ms-star ms-s0" />
      <div className="ms-star ms-s1" />
      <div className="ms-star ms-s2" />
      <div className="ms-star ms-s3" />
      <div className="ms-star ms-s4" />
      <div className="ms-star ms-s5" />
      <div className="ms-star ms-s6" />
      <div className="ms-star ms-s7" />
      <div className="ms-silhouette" />
    </div>
  );
}
