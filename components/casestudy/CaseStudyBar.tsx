'use client';

import { useCallback, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { SunIcon, MoonIcon } from '@/components/bento/icons';
import { modePref } from '@/components/bento/prefs';

// A trimmed version of PortfolioApp's top bar: no Work/Personal tabs (there's
// nothing to switch between on a case-study page) and no command palette
// (its commands are all homepage actions). Theme still reads/writes the same
// aw-mode preference, so a visitor arriving from the dark-mode homepage sees
// a page that matches, and :root[data-mode] (set pre-paint in the root
// layout) means the correct theme already applies before this ever hydrates.
export default function CaseStudyBar() {
  const mode = useSyncExternalStore(
    modePref.subscribe,
    modePref.getSnapshot,
    modePref.getServerSnapshot
  );

  const toggle = useCallback(() => {
    modePref.set(mode === 'light' ? 'dark' : 'light');
  }, [mode]);

  return (
    <div className="bento-bar">
      <Link className="brand" href="/">
        <div className="mark">AW</div>
        <div className="who">
          Andrew Wong <span>&middot; Adelaide</span>
        </div>
      </Link>
      <div className="spacer" />
      <Link className="back-link mono" href="/">
        &larr; Back to portfolio
      </Link>
      <button
        className="modebtn"
        onClick={toggle}
        aria-label={mode === 'light' ? 'Switch to dark' : 'Switch to light'}
        title={mode === 'light' ? 'Switch to dark' : 'Switch to light'}
      >
        {mode === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
    </div>
  );
}
