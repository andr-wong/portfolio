'use client';

import { useState, useEffect, useCallback, Fragment } from 'react';
import AmbientField from './AmbientField';
import BentoSite from './BentoSite';

type Mode = 'light' | 'dark';
type Page = 'work' | 'personal';

function useStored<T extends string>(key: string, init: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [v, setV] = useState<T>(() => {
    try {
      return (localStorage.getItem(key) as T) || init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, v);
    } catch {}
  }, [key, v]);
  return [v, setV];
}

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a0.6 0.6 0 0 0-0.8-0.8 9.7 9.7 0 1 0 12.1 12.1 0.6 0.6 0 0 0-0.8-0.8Z" />
  </svg>
);

export default function PortfolioApp() {
  const [mode, setMode] = useStored<Mode>('aw-mode', 'light');
  const [page, setPage] = useStored<Page>('aw-page', 'work');

  const variant = mode === 'light' ? 'daybreak' : 'eclipse';
  const toggle = useCallback(
    () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    [setMode]
  );

  return (
    <div className={`bento-app ${mode}`}>
      <AmbientField mode={mode} />
      <div className="bento-bar">
        <div className="brand">
          <div className="mark">AW</div>
          <div className="who">
            Andrew Wong <span>· Adelaide</span>
          </div>
        </div>
        <div className="spacer" />
        <div className="seg" role="tablist">
          <button
            className={page === 'work' ? 'on' : ''}
            onClick={() => setPage('work')}
            role="tab"
            aria-selected={page === 'work'}
          >
            Work
          </button>
          <button
            className={page === 'personal' ? 'on' : ''}
            onClick={() => setPage('personal')}
            role="tab"
            aria-selected={page === 'personal'}
          >
            Personal
          </button>
        </div>
        <button
          className="modebtn"
          onClick={toggle}
          aria-label={mode === 'light' ? 'Switch to dark' : 'Switch to light'}
          title={mode === 'light' ? 'Switch to dark' : 'Switch to light'}
        >
          {mode === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </div>
      <div className="bento-site-wrap">
        {/* key forces BentoSite remount so entrance animation replays on each switch */}
        <Fragment key={`${mode}-${page}`}>
          <BentoSite variant={variant} page={page} />
        </Fragment>
      </div>
    </div>
  );
}
