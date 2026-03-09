/**
 * lumaService.ts
 *
 * Fetches Luma event data via the Express backend proxy.
 * The backend scrapes __NEXT_DATA__ from lu.ma � no API key needed.
 *
 * Upcoming vs Past is computed purely from end_at date so events
 * automatically move to "past" once their end time passes.
 */

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || 'https://cisoevents-prototype-backend.vercel.app';

// --- Types --------------------------------------------------------------------

export interface LumaGeoAddress {
  city?: string;
  region?: string;
  country?: string;
  full_address?: string;
  short_address?: string;
  city_state?: string;
  address?: string;
}

export interface LumaHost {
  name: string;
  avatar_url?: string;
  username?: string;
  bio_short?: string;
  website?: string;
  linkedin_handle?: string;
  twitter_handle?: string;
}

export interface LumaTicketInfo {
  is_free: boolean;
  price?: number | null;
  max_price?: number | null;
  currency_info?: unknown;
  is_sold_out?: boolean;
  require_approval?: boolean;
}

/** Normalised Luma event � fields unified across API / scrape responses */
export interface LumaEvent {
  api_id: string;
  name: string;
  description?: string;
  /** ISO-8601 string */
  start_at: string;
  /** ISO-8601 string */
  end_at: string;
  /** The slug portion of the lu.ma URL, e.g. "iuutm274" */
  url: string;
  cover_url?: string;
  /** 'offline' | 'online' | 'hybrid' */
  location_type?: string;
  /** Scraped events use geo_address_info; unified here */
  geo_address_info?: LumaGeoAddress;
  hosts?: LumaHost[];
  ticket_info?: LumaTicketInfo;
  tags?: string[];
  timezone?: string;
}

interface EventsAllResponse {
  ok: boolean;
  events: LumaEvent[];
  total?: number;
  source?: string;
  error?: string;
}

// --- Fallback image pool (deterministic per event) ---------------------------
// When an event has no cover image we pick a cybersecurity-themed Unsplash
// photo based on a hash of api_id � same event always shows the same image.

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Returns the event cover image, or a consistent deterministic fallback
 * chosen from FALLBACK_IMAGES based on the event's api_id.
 */
export function getEventImage(event: LumaEvent): string {
  if (event.cover_url) return event.cover_url;
  return FALLBACK_IMAGES[hashStr(event.api_id) % FALLBACK_IMAGES.length];
}

// --- Service ------------------------------------------------------------------

/**
 * Fetch ALL events (upcoming + past) from the backend proxy.
 * No API key required � the backend scrapes lu.ma public pages.
 */
export async function getLumaAllEvents(): Promise<LumaEvent[]> {
  const res = await fetch(`${API_BASE}/api/luma/events/all`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body?.error ?? `Server error ${res.status}`);
  }
  const data = (await res.json()) as EventsAllResponse;
  if (!data.ok) throw new Error(data.error ?? 'Unknown error from backend');
  return data.events ?? [];
}

// --- Date-based status helpers ------------------------------------------------

/** True if the event has not yet ended. */
export function isUpcoming(event: LumaEvent): boolean {
  return new Date(event.end_at ?? event.start_at) > new Date();
}

/** True if the event has already ended. */
export function isPast(event: LumaEvent): boolean {
  return !isUpcoming(event);
}

// --- Display helpers ----------------------------------------------------------

export function formatEventDate(event: LumaEvent): string {
  return new Date(event.start_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export function formatEventDateShort(event: LumaEvent): string {
  return new Date(event.start_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
}

export function formatEventDateRange(event: LumaEvent): string {
  const start = new Date(event.start_at);
  const end   = new Date(event.end_at);
  const same  = start.toDateString() === end.toDateString();
  if (same) {
    return start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  const s = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const e = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${s} � ${e}`;
}

export function getEventYear(event: LumaEvent): number {
  return new Date(event.start_at).getFullYear();
}

export function getEventLocation(event: LumaEvent): string {
  if (event.location_type === 'online') return 'Online';
  const g = event.geo_address_info;
  if (!g) return '';
  if (g.city_state) return g.city_state;
  if (g.city && g.country) return `${g.city}, ${g.country}`;
  return g.short_address ?? g.full_address ?? g.city ?? '';
}

export function getLumaEventUrl(event: LumaEvent): string {
  return event.url.startsWith('http') ? event.url : `https://lu.ma/${event.url}`;
}

// --- Track classification ----------------------------------------------------

export type EventTrack = 'cyber' | 'startup' | 'other';

/**
 * Classifies an event by keyword-matching its name.
 * Luma has no explicit category field so we infer from the title.
 */
export function getEventTrack(event: LumaEvent): EventTrack {
  const n = event.name.toLowerCase();
  const cyberKeywords = ['cyber', 'ciso', 'security', ' ai ', 'ai &', '& ai', 'gitex', 'wallarm', 'cloudflare', 'cxo', 'cio', 'api security', 'risk london', 'soc', 'zero trust'];
  const startupKeywords = ['startup', 'investor', 'pitch', 'venture', 'elevate', 'evoke', 'evoke media', 'neptune media', 'energy week', 'real estate'];
  if (cyberKeywords.some(k => n.includes(k))) return 'cyber';
  if (startupKeywords.some(k => n.includes(k))) return 'startup';
  return 'other';
}

export const TRACK_LABELS: Record<EventTrack, string> = {
  cyber: '🛡️ Cyber & AI',
  startup: '🚀 Startup & Investor',
  other: '🌐 Other',
};

export const TRACK_COLORS: Record<EventTrack, { bg: string; text: string; border: string }> = {
  cyber:   { bg: 'rgba(0,168,255,0.12)', text: '#00A8FF', border: 'rgba(0,168,255,0.3)' },
  startup: { bg: 'rgba(249,115,22,0.12)', text: '#f97316', border: 'rgba(249,115,22,0.3)' },
  other:   { bg: 'rgba(148,163,184,0.12)', text: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
};
