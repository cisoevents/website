/**
 * useLumaEvents — fetches all Luma events exactly once per session (or until
 * the localStorage cache expires), then derives upcoming/past client-side
 * from end_at so events transition automatically at their real end time.
 *
 * Cache strategy:
 *   - localStorage key "ciso_luma_events" with a 10-minute TTL
 *   - On mount: if cache is valid, initialise state from it and skip the fetch
 *   - useRef(false) guards against React Strict Mode's double-mount firing two
 *     in-flight requests simultaneously
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  getLumaAllEvents,
  isUpcoming,
  isPast,
  type LumaEvent,
} from '../services/lumaService';

// --- Local-storage cache ------------------------------------------------------

const LS_KEY  = 'ciso_luma_events';
const LS_TTL  = 10 * 60 * 1000;  // 10 minutes

interface CachePayload { data: LumaEvent[]; expires: number }

function readCache(): LumaEvent[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed: CachePayload = JSON.parse(raw);
    if (Date.now() > parsed.expires) { localStorage.removeItem(LS_KEY); return null; }
    return parsed.data;
  } catch { return null; }
}

function writeCache(events: LumaEvent[]): void {
  try {
    const payload: CachePayload = { data: events, expires: Date.now() + LS_TTL };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch { /* storage quota exceeded — ignore */ }
}

// --- Hook ---------------------------------------------------------------------

export interface UseLumaEventsResult {
  /** All events (upcoming + past) */
  events:   LumaEvent[];
  /** Events whose end_at is in the future — recomputed from real dates */
  upcoming: LumaEvent[];
  /** Events whose end_at has passed — recomputed from real dates */
  past:     LumaEvent[];
  loading:  boolean;
  error:    string | null;
  /** Manually bust the cache and re-fetch */
  refresh:  () => void;
}

export function useLumaEvents(): UseLumaEventsResult {
  // Initialise immediately from cache so there's no loading flash on repeat visits
  const [events, setEvents]   = useState<LumaEvent[]>(() => readCache() ?? []);
  const [loading, setLoading] = useState<boolean>(() => readCache() === null);
  const [error,   setError]   = useState<string | null>(null);

  // Prevents two simultaneous in-flight fetches (React Strict Mode mounts twice in dev)
  const fetchingRef = useRef(false);

  const doFetch = (force = false) => {
    if (!force && fetchingRef.current) return;

    // If cache still valid and not a forced refresh, skip the network call
    const cached = readCache();
    if (!force && cached !== null) {
      setEvents(cached);
      setLoading(false);
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    getLumaAllEvents()
      .then((all) => {
        writeCache(all);
        setEvents(all);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        // Keep stale cache data visible on error rather than showing empty
      })
      .finally(() => {
        setLoading(false);
        fetchingRef.current = false;
      });
  };

  useEffect(() => {
    doFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Upcoming / past split is pure date math — no "status" field from Luma needed.
  // This means once March 24 passes, that event automatically moves to "past"
  // on the next page load (or cache refresh).
  const upcoming = useMemo(() => events.filter(isUpcoming), [events]);
  const past     = useMemo(() => events.filter(isPast),     [events]);

  const refresh = () => {
    localStorage.removeItem(LS_KEY);
    fetchingRef.current = false;
    doFetch(true);
  };

  return { events, upcoming, past, loading, error, refresh };
}
