'use client';

/**
 * Browser-only preferences (theme, current page).
 *
 * These live in localStorage, so the server cannot know them and renders a
 * default. useSyncExternalStore is the hydration-safe way to read that kind of
 * value: React uses the server snapshot for the hydration render, then
 * immediately re-renders with the real client value. No mismatch warning, and
 * no setState inside an effect.
 */

type Pref<T extends string> = {
  subscribe: (onChange: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (value: T) => void;
};

function createPref<T extends string>(
  serverValue: T,
  readClient: () => T,
  writeClient: (value: T) => void
): Pref<T> {
  const listeners = new Set<() => void>();
  let cached: T | null = null;

  return {
    subscribe(onChange) {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
    // Cached because getSnapshot must return a stable value between renders,
    // or React re-renders forever.
    getSnapshot: () => (cached ??= readClient()),
    getServerSnapshot: () => serverValue,
    set(value) {
      cached = value;
      writeClient(value);
      listeners.forEach((notify) => notify());
    },
  };
}

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return allowed.includes(stored as T) ? (stored as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export type Mode = 'light' | 'dark';
export type Page = 'work' | 'personal';

export const PAGES: readonly Page[] = ['work', 'personal'];

export const modePref = createPref<Mode>(
  'light',
  // The inline script in layout.tsx has already resolved the stored value (or
  // the OS preference) onto <html data-mode> before first paint, so read back
  // what it decided rather than re-deriving it.
  () => (document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light'),
  (value) => {
    document.documentElement.dataset.mode = value;
    writeStored('aw-mode', value);
  }
);

export const pagePref = createPref<Page>(
  'work',
  () => readStored('aw-page', PAGES, 'work'),
  (value) => writeStored('aw-page', value)
);
