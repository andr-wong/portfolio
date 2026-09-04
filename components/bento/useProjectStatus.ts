'use client';

import { useEffect, useState } from 'react';
import type { StatusResponse } from '@/app/api/status/route';

// Starts null (server render and first client render agree — no hydration
// mismatch) and fills in after mount, same pattern as useBentoMotion's
// clock/count-up. A fetch failure leaves it null rather than throwing, so
// callers just render their "checking..." state a little longer.
export function useProjectStatus(): StatusResponse | null {
  const [status, setStatus] = useState<StatusResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/status')
      .then((res) => (res.ok ? (res.json() as Promise<StatusResponse>) : null))
      .then((data) => {
        if (!cancelled && data) setStatus(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
