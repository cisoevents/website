/**
 * useAwsEvents — fetches upcoming AWS Events Builder events from the backend
 * (/api/aws/events), which scrapes JSON-LD from the event pages server-side.
 *
 * Cache strategy: localStorage with a 1-hour TTL (events change rarely).
 * Falls back to the static awsStaticEvents array if the backend is unreachable.
 */

import { useState, useEffect, useRef } from 'react';
import type { LumaEvent } from '../services/lumaService';
import { awsStaticEvents } from '../data/awsEvents';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || 'https://backend-website-mu.vercel.app';

const LS_KEY = 'ciso_aws_events';
const LS_TTL = 60 * 60 * 1000; // 1 hour

interface CachePayload { data: LumaEvent[]; expires: number }

function readCache(): LumaEvent[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const p: CachePayload = JSON.parse(raw);
    if (Date.now() > p.expires) { localStorage.removeItem(LS_KEY); return null; }
    return p.data;
  } catch { return null; }
}

function writeCache(events: LumaEvent[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ data: events, expires: Date.now() + LS_TTL }));
  } catch { /* quota exceeded */ }
}

export interface UseAwsEventsResult {
  events: LumaEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useAwsEvents(): UseAwsEventsResult {
  const [events, setEvents]   = useState<LumaEvent[]>(() => readCache() ?? []);
  const [loading, setLoading] = useState<boolean>(() => readCache() === null);
  const [error,   setError]   = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const doFetch = (force = false) => {
    if (!force && fetchingRef.current) return;

    const cached = readCache();
    if (!force && cached !== null) {
      setEvents(cached);
      setLoading(false);
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/aws/events`)
      .then(r => r.json())
      .then((data: { ok: boolean; events?: LumaEvent[]; error?: string }) => {
        if (!data.ok) throw new Error(data.error ?? 'Unknown error');
        const fetched = data.events ?? [];
        writeCache(fetched);
        setEvents(fetched);
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        // Fall back to static data so the card still appears
        if (events.length === 0) setEvents(awsStaticEvents);
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

  const refresh = () => {
    localStorage.removeItem(LS_KEY);
    fetchingRef.current = false;
    doFetch(true);
  };

  return { events, loading, error, refresh };
}
