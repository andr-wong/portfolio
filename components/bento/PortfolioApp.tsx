'use client';

import { useCallback, useState, useSyncExternalStore, Fragment } from 'react';
import AmbientField from './AmbientField';
import BentoSite from './BentoSite';
import ContactForm from './ContactForm';
import CommandPalette from './CommandPalette';
import { SunIcon, MoonIcon } from './icons';
import { modePref, pagePref, PAGES, type Page } from './prefs';

export default function PortfolioApp() {
  const mode = useSyncExternalStore(
    modePref.subscribe,
    modePref.getSnapshot,
    modePref.getServerSnapshot
  );
  const page = useSyncExternalStore(
    pagePref.subscribe,
    pagePref.getSnapshot,
    pagePref.getServerSnapshot
  );

  const variant = mode === 'light' ? 'daybreak' : 'eclipse';
  const [contactOpen, setContactOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const toggle = useCallback(() => {
    modePref.set(mode === 'light' ? 'dark' : 'light');
  }, [mode]);

  const choosePage = useCallback((next: Page) => pagePref.set(next), []);

  const onTabKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!delta) return;
      e.preventDefault();
      const next = PAGES[(PAGES.indexOf(page) + delta + PAGES.length) % PAGES.length];
      choosePage(next);
      document.getElementById(`tab-${next}`)?.focus();
    },
    [page, choosePage]
  );

  return (
    <div className="bento-app">
      <AmbientField mode={mode} />
      <div className="bento-bar">
        <div className="brand">
          <div className="mark">AW</div>
          <div className="who">
            Andrew Wong <span>· Adelaide</span>
          </div>
        </div>
        <div className="spacer" />
        <div className="seg" role="tablist" aria-label="Sections" onKeyDown={onTabKeyDown}>
          {PAGES.map((p) => (
            <button
              key={p}
              id={`tab-${p}`}
              type="button"
              className={page === p ? 'on' : ''}
              onClick={() => choosePage(p)}
              role="tab"
              aria-selected={page === p}
              aria-controls="page-panel"
              // Roving tabindex: only the selected tab is a tab stop, and the
              // arrow keys move between tabs from there, per the ARIA tabs pattern.
              tabIndex={page === p ? 0 : -1}
            >
              {p === 'work' ? 'Work' : 'Personal'}
            </button>
          ))}
        </div>
        <button
          className="cmdk-hint mono"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette"
          title="Command palette"
        >
          &#8984;K
        </button>
        <button
          className="modebtn"
          onClick={toggle}
          aria-label={mode === 'light' ? 'Switch to dark' : 'Switch to light'}
          title={mode === 'light' ? 'Switch to dark' : 'Switch to light'}
        >
          {mode === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
      <div
        className="bento-site-wrap"
        id="page-panel"
        role="tabpanel"
        aria-labelledby={`tab-${page}`}
      >
        {/* key forces BentoSite remount so entrance animation replays on each switch */}
        <Fragment key={`${mode}-${page}`}>
          <BentoSite variant={variant} page={page} onOpenContact={() => setContactOpen(true)} />
        </Fragment>
      </div>
      {/* Rendered here, not inside BentoSite, so switching page/theme mid-draft
          doesn't unmount the form and lose whatever the visitor typed. */}
      {contactOpen && <ContactForm onClose={() => setContactOpen(false)} />}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        mode={mode}
        page={page}
        onNavigate={choosePage}
        onToggleTheme={toggle}
        onOpenContact={() => setContactOpen(true)}
      />
    </div>
  );
}
