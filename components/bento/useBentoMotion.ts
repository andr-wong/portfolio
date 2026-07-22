'use client';

import { useRef, useState, useEffect } from 'react';
import type { StatItem } from './data';

export function useBentoMotion(stats: StatItem[], countDur = 1100) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [time, setTime] = useState('--:--');
  const [counts, setCounts] = useState<(number | string)[]>(
    () => stats.map((s) => (typeof s.n === 'number' ? 0 : s.n))
  );

  useEffect(() => {
    // setTimeout keeps the reveal working even in background/hidden iframes where
    // rAF and CSS animation timelines are paused.
    const showT = setTimeout(() => setShown(true), 40);

    const tickClock = () => {
      const now = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Australia/Adelaide' })
      );
      setTime(
        String(now.getHours()).padStart(2, '0') +
          ':' +
          String(now.getMinutes()).padStart(2, '0')
      );
    };
    tickClock();
    const ci = setInterval(tickClock, 10000);

    const start = Date.now();
    const cci = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / countDur);
      setCounts(
        stats.map((s) =>
          typeof s.n === 'number'
            ? Math.round(s.n * (1 - Math.pow(1 - p, 3)))
            : s.n
        )
      );
      if (p >= 1) clearInterval(cci);
    }, 32);

    return () => {
      clearTimeout(showT);
      clearInterval(ci);
      clearInterval(cci);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, shown, time, counts };
}
