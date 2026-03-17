import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const PORT = process.env.PORT ?? 3001;
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM              = 'CISOevents <charlesp@cisoevents.com>';
const ADMIN_EMAIL       = 'charlesp@cisoevents.com';
const SITE_URL          = 'https://cisoevents.com';
const LOGO_URL          = 'https://cisoevents-prototype.vercel.app/CISOevents-Logo-R2.png';
const LUMA_URL          = 'https://lu.ma/cisoevents';
const LUMA_CALENDAR_SLUG = process.env.LUMA_CALENDAR_SLUG ?? 'cisoevents';
const LUMA_API_KEY      = process.env.LUMA_API_KEY ?? '';        // Free — get from your Luma dashboard → Settings → API

// ── Luma types ─────────────────────────────────────────────────────────────────
interface LumaEventEntry {
  api_id: string;
  name: string;
  description?: string;
  start_at: string;
  end_at: string;
  url: string;
  cover_url?: string;
  location_type?: string;
  geo_address_json?: { city?: string; country?: string; full_address?: string };
  hosts?: Array<{ name: string; avatar_url?: string }>;
  ticket_info?: { is_free: boolean; price?: number; currency?: string };
  tags?: string[];
}

// ── Simple in-memory cache (5-min TTL) ────────────────────────────────────────
interface CacheEntry<T> { data: T; expires: number }
const cache = new Map<string, CacheEntry<unknown>>();
function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data as T;
  cache.delete(key);
  return null;
}
function cacheSet<T>(key: string, data: T, ttlMs = 5 * 60_000): void {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

// ── Luma scraper — extracts __NEXT_DATA__ from the public page ─────────────────
interface ScrapedCalendar {
  events: LumaEventEntry[];
  calendarApiId: string;
  totalEventCount: number;
}

async function scrapeLumaCalendarPageFull(slug: string): Promise<ScrapedCalendar> {
  // Allow passing a full URL (e.g. for ?period=past queries) or just a slug
  const url = slug.startsWith('http') ? slug : `https://lu.ma/${slug}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`Luma page returned ${res.status} for /${slug}`);

  const html = await res.text();

  // Next.js embeds all page data here
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) throw new Error('Could not locate __NEXT_DATA__ in Luma page — structure may have changed');

  const nextData = JSON.parse(match[1]);
  const pp   = nextData?.props?.pageProps ?? {};
  const data = pp?.initialData?.data ?? {};

  const calendarApiId: string   = (data?.calendar?.api_id as string) ?? '';
  const totalEventCount: number = ((data?.event_start_ats ?? []) as unknown[]).length;

  // Luma stores the event list under featured_items; each entry has a .event object
  const featuredItems: Array<{
    api_id?: string;
    event?: LumaEventEntry;
    start_at?: string;
    hosts?: unknown[];
    ticket_info?: unknown;
    tags?: string[];
  }> = (data.featured_items ?? []) as typeof featuredItems;

  if (featuredItems.length > 0) {
    const events = featuredItems
      .filter((item) => item.event)
      .map((item) => ({
        ...item.event!,
        start_at: item.event!.start_at ?? item.start_at ?? '',
        hosts: item.event!.hosts ?? (item.hosts as LumaEventEntry['hosts']) ?? [],
        ticket_info: item.event!.ticket_info ?? (item.ticket_info as LumaEventEntry['ticket_info']),
        tags: item.event!.tags ?? item.tags ?? [],
      }));
    return { events, calendarApiId, totalEventCount };
  }

  // Legacy / alternative shapes across Luma versions
  const rawEvents: LumaEventEntry[] = ((
    data.events ??
    data.calendarEvents ??
    pp?.events ??
    pp?.calendarEvents ??
    []
  ) as LumaEventEntry[]);

  return { events: rawEvents, calendarApiId, totalEventCount };
}

// ── Luma scraper — single event page ──────────────────────────────────────────
async function scrapeLumaEventPage(eventSlug: string): Promise<LumaEventEntry | null> {
  const url = `https://lu.ma/${eventSlug}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) return null;

  const html = await res.text();
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return null;

  const nextData = JSON.parse(match[1]);
  const pp = nextData?.props?.pageProps ?? {};
  return (pp?.event ?? pp?.initialData?.event ?? null) as LumaEventEntry | null;
}

// ── Luma official API helper (free key required — not the paid SDK) ────────────
async function fetchLumaApiEvents(): Promise<LumaEventEntry[]> {
  const res = await fetch('https://api.lu.ma/public/v1/calendar/list-events?pagination_limit=50', {
    headers: { 'x-luma-api-key': LUMA_API_KEY },
  });
  if (!res.ok) throw new Error(`Luma API error ${res.status}: ${await res.text()}`);
  const json = await res.json() as { entries?: Array<{ event: LumaEventEntry }> };
  return (json.entries ?? []).map((e) => e.event);
}

const app = express();

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:4173',
  'http://localhost:4175',
  'https://cisoevents.com',
  'https://www.cisoevents.com',
  'https://website-gray-psi-92.vercel.app',
  'https://cisoevents-prototype.vercel.app',
];

const envAllowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const vercelFrontendUrl = (process.env.FRONTEND_URL ?? '').trim();
const allowedOrigins = new Set<string>([
  ...defaultAllowedOrigins,
  ...envAllowedOrigins,
  ...(vercelFrontendUrl ? [vercelFrontendUrl] : []),
]);

const isAllowedVercelPreviewOrigin = (origin: string): boolean => {
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin) || isAllowedVercelPreviewOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
}));
app.use(express.json());

// ── Types ──────────────────────────────────────────────────────────────────────
interface ContactBody {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// ── Shared email parts ─────────────────────────────────────────────────────────
function header(): string {
  return `
    <div style="background:#0A0E1A;padding:28px 36px;border-radius:8px 8px 0 0;">
      <table style="border-collapse:collapse;width:100%;">
        <tr>
          <td>
            <a href="${SITE_URL}" style="display:inline-block;text-decoration:none;">
              <img
                src="${LOGO_URL}"
                alt="CISOevents"
                width="160"
                style="display:block;height:auto;border:0;max-width:160px;"
              />
            </a>
            <div style="margin-top:10px;height:2px;width:56px;background:linear-gradient(90deg,#00A8FF 0%,#0055AA 100%);border-radius:2px;"></div>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function footer(): string {
  const year = new Date().getFullYear();
  return `
    <div style="background:#0A0E1A;padding:24px 36px;border-radius:0 0 8px 8px;text-align:center;">
      <div style="margin-bottom:10px;">
        <a href="${SITE_URL}" style="font-family:sans-serif;font-size:13px;color:#00A8FF;text-decoration:none;margin:0 10px;">cisoevents.com</a>
        <span style="color:#334155;font-size:13px;">|</span>
        <a href="${LUMA_URL}" style="font-family:sans-serif;font-size:13px;color:#00A8FF;text-decoration:none;margin:0 10px;">Upcoming Events</a>
        <span style="color:#334155;font-size:13px;">|</span>
        <a href="mailto:${ADMIN_EMAIL}" style="font-family:sans-serif;font-size:13px;color:#00A8FF;text-decoration:none;margin:0 10px;">${ADMIN_EMAIL}</a>
      </div>
      <p style="font-family:sans-serif;font-size:11px;color:#475569;margin:8px 0 0;">
        &copy; ${year} CISOevents. All rights reserved.
      </p>
    </div>
  `;
}

// ── Email 1: Confirmation to the person who submitted ─────────────────────────
function confirmationHtml(name: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:32px 16px;background:#F1F5F9;">
      <div style="max-width:600px;margin:0 auto;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.10);">
        ${header()}
        <div style="background:#ffffff;padding:40px 36px;">
          <h2 style="font-family:sans-serif;font-size:22px;font-weight:700;color:#0A0E1A;margin:0 0 12px;">
            Thanks for reaching out, ${escapeHtml(name)}!
          </h2>
          <div style="height:2px;width:40px;background:#00A8FF;border-radius:2px;margin-bottom:24px;"></div>
          <p style="font-family:sans-serif;font-size:15px;color:#334155;line-height:1.75;margin:0 0 16px;">
            We've received your message and our team will get back to you as soon as possible.
          </p>
          <p style="font-family:sans-serif;font-size:15px;color:#334155;line-height:1.75;margin:0 0 32px;">
            In the meantime, explore our upcoming CISO community events and connect with fellow security leaders.
          </p>
          <a href="${LUMA_URL}"
             style="display:inline-block;background:#00A8FF;color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:13px 28px;border-radius:6px;letter-spacing:0.5px;">
            View Upcoming Events &rarr;
          </a>
        </div>
        ${footer()}
      </div>
    </body>
    </html>
  `;
}

// ── Email 2: New submission notification to admin ──────────────────────────────
function notificationHtml(name: string, email: string, phone: string | undefined, message: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:32px 16px;background:#F1F5F9;">
      <div style="max-width:600px;margin:0 auto;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.10);">
        ${header()}
        <div style="background:#ffffff;padding:40px 36px;">
          <h2 style="font-family:sans-serif;font-size:22px;font-weight:700;color:#0A0E1A;margin:0 0 12px;">
            New Contact Form Submission
          </h2>
          <div style="height:2px;width:40px;background:#00A8FF;border-radius:2px;margin-bottom:24px;"></div>

          <div style="background:#F0F9FF;border-left:4px solid #00A8FF;padding:12px 16px;border-radius:0 6px 6px 0;margin-bottom:28px;">
            <p style="font-family:sans-serif;font-size:13px;color:#64748B;margin:0;">
              Submitted via <a href="${SITE_URL}" style="color:#00A8FF;text-decoration:none;">cisoevents.com</a> contact form
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-family:sans-serif;">
            <tr>
              <td style="padding:12px 0;color:#64748B;font-size:13px;width:88px;vertical-align:top;border-bottom:1px solid #F1F5F9;">Name</td>
              <td style="padding:12px 0;font-size:15px;font-weight:600;color:#0A0E1A;border-bottom:1px solid #F1F5F9;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#64748B;font-size:13px;vertical-align:top;border-bottom:1px solid #F1F5F9;">Email</td>
              <td style="padding:12px 0;border-bottom:1px solid #F1F5F9;">
                <a href="mailto:${escapeHtml(email)}" style="color:#00A8FF;font-size:15px;text-decoration:none;">${escapeHtml(email)}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding:12px 0;color:#64748B;font-size:13px;vertical-align:top;border-bottom:1px solid #F1F5F9;">Phone</td>
              <td style="padding:12px 0;font-size:15px;color:#0A0E1A;border-bottom:1px solid #F1F5F9;">${escapeHtml(phone)}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:12px 0;color:#64748B;font-size:13px;vertical-align:top;">Message</td>
              <td style="padding:12px 0;font-size:15px;color:#0A0E1A;line-height:1.75;">${escapeHtml(message).replace(/\n/g, '<br>')}</td>
            </tr>
          </table>

          <div style="margin-top:32px;">
            <a href="mailto:${escapeHtml(email)}?subject=Re: Your CISOevents Inquiry"
               style="display:inline-block;background:#00A8FF;color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:13px 28px;border-radius:6px;letter-spacing:0.5px;">
              Reply to ${escapeHtml(name)} &rarr;
            </a>
          </div>
        </div>
        ${footer()}
      </div>
    </body>
    </html>
  `;
}

// ── POST /api/contact ─────────────────────────────────────────────────────────
app.post('/api/contact', async (req: Request<object, object, ContactBody>, res: Response) => {
  const { name, email, phone, message } = req.body ?? {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }

  try {
    await Promise.all([
      // 1️⃣ Confirmation to the person who submitted
      resend.emails.send({
        from: FROM,
        to: [email],
        replyTo: ADMIN_EMAIL,
        subject: `Thanks for reaching out, ${name}!`,
        html: confirmationHtml(name),
      }),
      // 2️⃣ New submission notification to admin
      resend.emails.send({
        from: FROM,
        to: [ADMIN_EMAIL],
        replyTo: email,
        subject: `New inquiry from ${name} — CISOevents`,
        html: notificationHtml(name, email, phone, message),
      }),
    ]);

    res.json({ ok: true });
  } catch (err) {
    console.error('[Resend error]', err);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

// ── Fetch past events from public Luma api2 endpoint (no auth required) ───────
const LUMA_CALENDAR_API_ID = 'cal-UUSrbsMbch811dC';

async function fetchLumaPastEvents(limit = 50): Promise<LumaEventEntry[]> {
  const url = `https://api2.luma.com/calendar/get-items?calendar_api_id=${LUMA_CALENDAR_API_ID}&pagination_limit=${limit}&period=past`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`api2.luma.com returned ${res.status}`);
  const json = await res.json() as { entries?: Array<{ event: LumaEventEntry; hosts?: LumaEventEntry['hosts']; ticket_info?: LumaEventEntry['ticket_info'] }> };
  return (json.entries ?? []).map(entry => ({
    ...entry.event,
    hosts: entry.event.hosts ?? entry.hosts ?? [],
    ticket_info: entry.event.ticket_info ?? entry.ticket_info,
  }));
}

// ── GET /api/luma/events/all ── combining upcoming + past, auto status by date ──
// Upcoming: scraped from public lu.ma page (unchanged)
// Past: fetched from public api2.luma.com endpoint (no auth needed)
// Server caches for 10 minutes.
app.get('/api/luma/events/all', async (_req: Request, res: Response) => {
  const CACHE_KEY = `luma:events:all:${LUMA_CALENDAR_SLUG}`;
  const cached = cacheGet<LumaEventEntry[]>(CACHE_KEY);
  if (cached) { res.json({ ok: true, events: cached, source: 'cache' }); return; }

  try {
    let all: LumaEventEntry[];

    if (LUMA_API_KEY) {
      all = await fetchLumaApiEvents();
    } else {
      // Upcoming: scrape public page (unchanged)
      // Past: call the public api2.luma.com endpoint directly
      const [upcomingResult, pastEvents] = await Promise.all([
        scrapeLumaCalendarPageFull(LUMA_CALENDAR_SLUG),
        fetchLumaPastEvents(50),
      ]);

      // Deduplicate by api_id
      const seen = new Set<string>();
      all = [];
      for (const ev of [...upcomingResult.events, ...pastEvents]) {
        if (ev.api_id && !seen.has(ev.api_id)) {
          seen.add(ev.api_id);
          all.push(ev);
        }
      }
    }

    // Sort: soonest first (upcoming), then most recent past
    all.sort((a, b) => {
      const aEnd = new Date(a.end_at ?? a.start_at).getTime();
      const bEnd = new Date(b.end_at ?? b.start_at).getTime();
      const now = Date.now();
      const aUpcoming = aEnd > now;
      const bUpcoming = bEnd > now;
      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;
      if (aUpcoming) return aEnd - bEnd;        // upcoming: soonest first
      return bEnd - aEnd;                        // past: most recent first
    });

    cacheSet(CACHE_KEY, all, 10 * 60_000);       // 10-min cache
    res.json({ ok: true, events: all, total: all.length, source: LUMA_API_KEY ? 'api' : 'scrape' });
  } catch (err) {
    console.error('[Luma all-events error]', err);
    res.status(502).json({ ok: false, error: String(err) });
  }
});

// ── GET /api/luma/events ── list all public calendar events ───────────────────
app.get('/api/luma/events', async (_req: Request, res: Response) => {
  const CACHE_KEY = `luma:events:${LUMA_CALENDAR_SLUG}`;
  const cached = cacheGet<{ events: LumaEventEntry[]; meta: Record<string, unknown> }>(CACHE_KEY);
  if (cached) { res.json({ ok: true, ...cached, source: 'cache' }); return; }

  try {
    let events: LumaEventEntry[];
    let meta: Record<string, unknown> = {};

    if (LUMA_API_KEY) {
      // Use free official API key from Luma dashboard → Settings → API
      events = await fetchLumaApiEvents();
      meta = { hint: 'Fetched via Luma public API' };
    } else {
      // Scrape __NEXT_DATA__ from the public calendar page
      // NOTE: This returns "featured_items" only (~1-5 events).
      // For all events, add LUMA_API_KEY to backend/.env — it's FREE to generate:
      //   Luma → your calendar → Settings → Integrations → API → Create Key
      const { events: scraped, calendarApiId, totalEventCount } = await scrapeLumaCalendarPageFull(LUMA_CALENDAR_SLUG);
      events = scraped;
      meta = {
        calendarApiId,
        totalEventCount,
        hint: `Only featured events returned (${scraped.length}/${totalEventCount}). Set LUMA_API_KEY in backend/.env for all ${totalEventCount} events (key is free at lu.ma).`,
      };
    }

    const payload = { events, meta };
    cacheSet(CACHE_KEY, payload);
    res.json({ ok: true, ...payload, source: LUMA_API_KEY ? 'api' : 'scrape' });
  } catch (err) {
    console.error('[Luma events error]', err);
    res.status(502).json({ ok: false, error: String(err) });
  }
});

// ── GET /api/luma/event/:slug ── single event by slug or API ID ───────────────
app.get('/api/luma/event/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };
  const CACHE_KEY = `luma:event:${slug}`;
  const cached = cacheGet<LumaEventEntry>(CACHE_KEY);
  if (cached) { res.json({ ok: true, event: cached, source: 'cache' }); return; }

  try {
    let event: LumaEventEntry | null = null;

    if (LUMA_API_KEY) {
      const r = await fetch(`https://api.lu.ma/public/v1/event/get?api_id=${encodeURIComponent(slug)}`, {
        headers: { 'x-luma-api-key': LUMA_API_KEY },
      });
      if (r.ok) event = ((await r.json()) as { event: LumaEventEntry }).event;
    }

    // Fallback: scrape the public event page
    if (!event) event = await scrapeLumaEventPage(slug);

    if (!event) { res.status(404).json({ ok: false, error: 'Event not found' }); return; }

    cacheSet(CACHE_KEY, event);
    res.json({ ok: true, event, source: LUMA_API_KEY ? 'api' : 'scrape' });
  } catch (err) {
    console.error('[Luma event error]', err);
    res.status(502).json({ ok: false, error: String(err) });
  }
});

// ── YouTube ───────────────────────────────────────────────────────────────────
const YT_API_KEY    = (process.env.YOUTUBE_API_KEY ?? '').trim();
const YT_CHANNEL_ID = (process.env.YOUTUBE_CHANNEL_ID ?? 'UCELI9tCv6_jcrI_KbWkCwOA').trim();
const YT_BASE       = 'https://www.googleapis.com/youtube/v3';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  channelTitle: string;
}

interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  publishedAt: string;
}

// ── RSS helpers ──────────────────────────────────────────────────────────────

function parseRSSEntries(xml: string, fallbackAuthor = 'CISOevents'): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(xml)) !== null) {
    const e = m[1];
    const videoId = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!videoId) continue;
    const title     = (e.match(/<title>([^<]+)<\/title>/)?.[1] ?? '')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const published = e.match(/<published>([^<]+)<\/published>/)?.[1] ?? '';
    const desc      = (e.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? '').substring(0, 200);
    const thumb     = e.match(/url="(https:\/\/i\.ytimg\.com\/vi\/[^"]+)"/)?.[1]
      ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const author    = e.match(/<name>([^<]+)<\/name>/)?.[1] ?? fallbackAuthor;
    videos.push({ id: videoId, title, description: desc, thumbnail: thumb, publishedAt: published, url: `https://www.youtube.com/watch?v=${videoId}`, channelTitle: author });
  }
  return videos;
}

async function fetchRSSFeed(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { Accept: 'application/rss+xml, application/xml, text/xml' } });
    return res.ok ? await res.text() : null;
  } catch { return null; }
}

// Known playlist IDs — supplements the channel RSS (which only returns ~15 videos)
const KNOWN_PLAYLIST_IDS = [
  'PL7oYSEYWENY6HzHJECx0GNOCuH2YNCxqf', // Startup & Investor Podcast
  'PL7oYSEYWENY65aHxx_KoX0I9x_86xp-_w', // Horizon Summit AI, Cyber & FinTech
];

// ── RSS fallback (no API key — fetches channel + known playlists) ─────────────
async function fetchVideosViaRSS(): Promise<YouTubeVideo[]> {
  console.log('[YouTube] No API key — falling back to multi-RSS');
  const feeds = await Promise.all([
    fetchRSSFeed(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`),
    ...KNOWN_PLAYLIST_IDS.map(id =>
      fetchRSSFeed(`https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`)
    ),
  ]);
  const seen = new Set<string>();
  const videos: YouTubeVideo[] = [];
  for (const xml of feeds) {
    if (!xml) continue;
    for (const v of parseRSSEntries(xml)) {
      if (!seen.has(v.id)) { seen.add(v.id); videos.push(v); }
    }
  }
  videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return videos;
}

// ── API v3 functions (require YOUTUBE_API_KEY) ────────────────────────────────
async function fetchAllChannelVideos(): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];
  let pageToken = '';

  do {
    const url = new URL(`${YT_BASE}/search`);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('channelId', YT_CHANNEL_ID);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('order', 'date');
    url.searchParams.set('key', YT_API_KEY);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const data = await fetch(url.toString()).then(r => r.json()) as Record<string, unknown>;
    if (data.error) throw new Error(JSON.stringify(data.error));

    const items = (data.items ?? []) as Array<Record<string, unknown>>;
    for (const item of items) {
      const snippet = item.snippet as Record<string, unknown>;
      const idObj   = item.id as Record<string, unknown>;
      const videoId = idObj?.videoId as string;
      if (!videoId) continue;
      const thumbs  = (snippet.thumbnails as Record<string, { url: string }>) ?? {};
      const thumb   = thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? '';
      videos.push({
        id:           videoId,
        title:        (snippet.title as string) ?? '',
        description:  ((snippet.description as string) ?? '').substring(0, 200),
        thumbnail:    thumb,
        publishedAt:  (snippet.publishedAt as string) ?? '',
        url:          `https://www.youtube.com/watch?v=${videoId}`,
        channelTitle: (snippet.channelTitle as string) ?? '',
      });
    }

    pageToken = (data.nextPageToken as string) ?? '';
  } while (pageToken);

  return videos;
}

// Fetch all playlists for the channel
async function fetchAllPlaylists(): Promise<YouTubePlaylist[]> {
  const playlists: YouTubePlaylist[] = [];
  let pageToken = '';

  do {
    const url = new URL(`${YT_BASE}/playlists`);
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('channelId', YT_CHANNEL_ID);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', YT_API_KEY);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const data = await fetch(url.toString()).then(r => r.json()) as Record<string, unknown>;
    if (data.error) throw new Error(JSON.stringify(data.error));

    const items = (data.items ?? []) as Array<Record<string, unknown>>;
    for (const item of items) {
      const snippet        = item.snippet as Record<string, unknown>;
      const contentDetails = item.contentDetails as Record<string, unknown>;
      const thumbs         = (snippet.thumbnails as Record<string, { url: string }>) ?? {};
      playlists.push({
        id:          item.id as string,
        title:       (snippet.title as string) ?? '',
        description: (snippet.description as string) ?? '',
        thumbnail:   thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? '',
        itemCount:   (contentDetails?.itemCount as number) ?? 0,
        publishedAt: (snippet.publishedAt as string) ?? '',
      });
    }

    pageToken = (data.nextPageToken as string) ?? '';
  } while (pageToken);

  return playlists;
}

// Fetch videos inside a specific playlist
async function fetchPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
  const videos: YouTubeVideo[] = [];
  let pageToken = '';

  do {
    const url = new URL(`${YT_BASE}/playlistItems`);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', YT_API_KEY);
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const data = await fetch(url.toString()).then(r => r.json()) as Record<string, unknown>;
    if (data.error) throw new Error(JSON.stringify(data.error));

    const items = (data.items ?? []) as Array<Record<string, unknown>>;
    for (const item of items) {
      const snippet = item.snippet as Record<string, unknown>;
      const res     = snippet.resourceId as Record<string, unknown>;
      const videoId = res?.videoId as string;
      if (!videoId) continue;
      const thumbs  = (snippet.thumbnails as Record<string, { url: string }>) ?? {};
      videos.push({
        id:           videoId,
        title:        (snippet.title as string) ?? '',
        description:  ((snippet.description as string) ?? '').substring(0, 200),
        thumbnail:    thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url ?? '',
        publishedAt:  (snippet.publishedAt as string) ?? '',
        url:          `https://www.youtube.com/watch?v=${videoId}`,
        channelTitle: (snippet.channelTitle as string) ?? '',
      });
    }

    pageToken = (data.nextPageToken as string) ?? '';
  } while (pageToken);

  return videos;
}

// GET /api/youtube/videos — all channel videos (API v3 with RSS fallback)
app.get('/api/youtube/videos', async (_req: Request, res: Response) => {
  const cacheKey = `yt_videos_${YT_CHANNEL_ID}`;
  const cached = cacheGet<YouTubeVideo[]>(cacheKey);
  if (cached) return res.json({ ok: true, videos: cached, total: cached.length, cached: true, source: 'cache' });
  try {
    let videos: YouTubeVideo[];
    let source: string;
    if (YT_API_KEY) {
      try {
        videos = await fetchAllChannelVideos();
        source = 'api';
      } catch (apiErr) {
        console.warn('[YouTube] API failed, falling back to RSS:', apiErr);
        videos = await fetchVideosViaRSS();
        source = 'rss-fallback';
      }
    } else {
      videos = await fetchVideosViaRSS();
      source = 'rss';
    }
    cacheSet(cacheKey, videos, 60 * 60_000); // 1 h
    res.json({ ok: true, videos, total: videos.length, cached: false, source });
  } catch (err) {
    console.error('[YouTube videos error]', err);
    res.status(502).json({ ok: false, error: String(err) });
  }
});

// GET /api/youtube/playlists — all channel playlists (requires API key)
app.get('/api/youtube/playlists', async (_req: Request, res: Response) => {
  if (!YT_API_KEY) {
    return res.json({ ok: true, playlists: [], total: 0, note: 'YOUTUBE_API_KEY not set — playlists unavailable' });
  }
  const cacheKey = `yt_playlists_${YT_CHANNEL_ID}`;
  const cached = cacheGet<YouTubePlaylist[]>(cacheKey);
  if (cached) return res.json({ ok: true, playlists: cached, total: cached.length, cached: true });
  try {
    const playlists = await fetchAllPlaylists();
    cacheSet(cacheKey, playlists, 60 * 60_000); // 1 h
    res.json({ ok: true, playlists, total: playlists.length, cached: false });
  } catch (err) {
    console.error('[YouTube playlists error]', err);
    res.status(502).json({ ok: false, error: String(err) });
  }
});

// GET /api/youtube/podcasts — all channel playlists (API v3 or hardcoded fallback)
// YouTube podcasts are standard playlists; this endpoint returns all so the
// front-end can display them as tabs without hardcoding IDs.
app.get('/api/youtube/podcasts', async (_req: Request, res: Response) => {
  const FALLBACK_PLAYLISTS: YouTubePlaylist[] = [
    {
      id: 'PL7oYSEYWENY6HzHJECx0GNOCuH2YNCxqf',
      title: 'Startup & Investor Podcast',
      description: 'Founders, investors and operators share what it really takes to build in cybersecurity.',
      thumbnail: `https://i.ytimg.com/vi/placeholder/hqdefault.jpg`,
      itemCount: 0,
      publishedAt: '',
    },
    {
      id: 'PL7oYSEYWENY65aHxx_KoX0I9x_86xp-_w',
      title: 'Horizon Summit Series',
      description: 'In-depth conversations recorded live at the Horizon Summit gatherings.',
      thumbnail: `https://i.ytimg.com/vi/placeholder/hqdefault.jpg`,
      itemCount: 0,
      publishedAt: '',
    },
  ];

  if (!YT_API_KEY) {
    return res.json({ ok: true, playlists: FALLBACK_PLAYLISTS, total: FALLBACK_PLAYLISTS.length, source: 'fallback' });
  }

  const cacheKey = `yt_podcasts_${YT_CHANNEL_ID}`;
  const cached = cacheGet<YouTubePlaylist[]>(cacheKey);
  if (cached) return res.json({ ok: true, playlists: cached, total: cached.length, cached: true, source: 'cache' });

  try {
    const all = await fetchAllPlaylists();
    // Return all playlists — the front-end can filter if needed
    cacheSet(cacheKey, all, 60 * 60_000); // 1 h
    res.json({ ok: true, playlists: all, total: all.length, cached: false, source: 'api' });
  } catch (err) {
    console.warn('[YouTube podcasts] API failed, returning fallback:', err);
    res.json({ ok: true, playlists: FALLBACK_PLAYLISTS, total: FALLBACK_PLAYLISTS.length, source: 'fallback' });
  }
});

// GET /api/youtube/playlist/:id — videos inside a playlist (API key, with RSS fallback)
app.get('/api/youtube/playlist/:id', async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const cacheKey = `yt_playlist_items_${id}`;
  const cached = cacheGet<YouTubeVideo[]>(cacheKey);
  if (cached) return res.json({ ok: true, videos: cached, total: cached.length, cached: true });
  try {
    let videos: YouTubeVideo[];
    let source: string;

    if (YT_API_KEY) {
      try {
        videos = await fetchPlaylistVideos(id);
        source = 'api';
      } catch (apiErr) {
        console.warn('[YouTube] Playlist API failed, falling back to RSS:', apiErr);
        const xml = await fetchRSSFeed(`https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`);
        videos = xml ? parseRSSEntries(xml) : [];
        // If playlist RSS is empty too, fall back to channel feed
        if (videos.length === 0 && YT_CHANNEL_ID) {
          const chanXml = await fetchRSSFeed(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`);
          videos = chanXml ? parseRSSEntries(chanXml) : [];
          source = 'rss-channel-fallback';
        } else {
          source = 'rss-fallback';
        }
      }
    } else {
      // No API key — try playlist-specific RSS first, then channel RSS
      const xml = await fetchRSSFeed(`https://www.youtube.com/feeds/videos.xml?playlist_id=${id}`);
      videos = xml ? parseRSSEntries(xml) : [];
      if (videos.length === 0 && YT_CHANNEL_ID) {
        console.log(`[YouTube] Playlist RSS empty for ${id}, falling back to channel RSS`);
        const chanXml = await fetchRSSFeed(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`);
        videos = chanXml ? parseRSSEntries(chanXml) : [];
        source = 'rss-channel';
      } else {
        source = 'rss';
      }
    }

    cacheSet(cacheKey, videos, 60 * 60_000); // 1 h
    res.json({ ok: true, videos, total: videos.length, cached: false, source });
  } catch (err) {
    console.error('[YouTube playlist items error]', err);
    res.status(502).json({ ok: false, error: String(err) });
  }
});

// ── AWS Events Builder scraper ─────────────────────────────────────────────────
// Reads a comma-separated list of event URLs from AWS_EVENT_URLS env var.
// Falls back to the hardcoded RSA 2026 event.
const AWS_EVENT_URLS: string[] = (process.env.AWS_EVENT_URLS ?? '')
  .split(',').map(u => u.trim()).filter(Boolean);
const DEFAULT_AWS_EVENT_URLS = AWS_EVENT_URLS.length > 0
  ? AWS_EVENT_URLS
  : ['https://events.builder.aws.com/event/768a0f09-c528-4b97-8e16-21aa32ec533d'];

interface AwsJsonLdEvent {
  '@type'?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  image?: string | { url?: string };
  location?: {
    name?: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
    };
  };
  organizer?: { name?: string } | Array<{ name?: string }>;
}

async function scrapeAwsEventPage(url: string): Promise<LumaEventEntry | null> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) return null;

  const html = await res.text();

  // Extract JSON-LD schemas — look for @type: Event
  let eventData: AwsJsonLdEvent | null = null;
  const jsonLdRe = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = jsonLdRe.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      const schemas: AwsJsonLdEvent[] = Array.isArray(parsed) ? parsed : [parsed];
      const ev = schemas.find(s => s['@type'] === 'Event');
      if (ev) { eventData = ev; break; }
    } catch { /* malformed JSON — skip */ }
  }

  if (!eventData) return null;

  let startDate = eventData.startDate ? new Date(eventData.startDate) : null;
  if (!startDate || isNaN(startDate.getTime())) return null;

  // Cvent JSON-LD often emits midnight UTC (e.g. "Tue Mar 24 00:00:00 UTC 2026").
  // Midnight UTC = March 23 at 4 PM PST, so the scraper would store "March 24"
  // while the real calendar date is March 23. Fix: shift midnight-UTC dates to
  // noon UTC so they render as the same calendar date in any timezone (UTC-12 to UTC+12).
  if (startDate.getUTCHours() === 0 && startDate.getUTCMinutes() === 0 && startDate.getUTCSeconds() === 0) {
    startDate = new Date(startDate.getTime() - 12 * 60 * 60 * 1000); // UTC midnight → noon-12h = previous day noon
  }

  // endDate is rarely in JSON-LD for Cvent pages — default start + 4 h
  const endDate = eventData.endDate
    ? new Date(eventData.endDate)
    : new Date(startDate.getTime() + 4 * 60 * 60 * 1000);

  const loc  = eventData.location;
  const addr = loc?.address;
  const cityState = [addr?.addressLocality, addr?.addressRegion].filter(Boolean).join(', ');
  const fullAddress = [loc?.name, addr?.streetAddress, cityState].filter(Boolean).join(', ');

  const cover = typeof eventData.image === 'string'
    ? eventData.image
    : (eventData.image as { url?: string } | undefined)?.url;

  const organizerRaw = eventData.organizer;
  const organizerName = Array.isArray(organizerRaw)
    ? organizerRaw[0]?.name
    : organizerRaw?.name;

  const idMatch = url.match(/\/event\/([a-f0-9-]{8,})/i);
  const eventId  = idMatch ? idMatch[1] : url;

  return {
    api_id:        `aws-${eventId}`,
    name:          eventData.name ?? 'CISOevents Event',
    description:   eventData.description,
    start_at:      startDate.toISOString(),
    end_at:        endDate.toISOString(),
    url,                    // full URL — getLumaEventUrl() already handles http:// prefix
    cover_url:     cover,
    location_type: 'offline',
    geo_address_json: {
      city:         addr?.addressLocality,
      country:      'US',
      full_address: fullAddress || undefined,
    },
    hosts: organizerName ? [{ name: organizerName }] : [{ name: 'CISOevents' }],
  };
}

// GET /api/aws/events — scrape all configured AWS event pages, return upcoming only
app.get('/api/aws/events', async (_req: Request, res: Response) => {
  const CACHE_KEY = 'aws:events:upcoming';
  const cached = cacheGet<LumaEventEntry[]>(CACHE_KEY);
  if (cached) { res.json({ ok: true, events: cached, source: 'cache' }); return; }

  try {
    const results = await Promise.all(DEFAULT_AWS_EVENT_URLS.map(scrapeAwsEventPage));
    const all = results.filter((e): e is LumaEventEntry => e !== null);

    // Filter to upcoming (end_at > now) — same logic as frontend isUpcoming()
    const now = Date.now();
    const upcoming = all.filter(e => new Date(e.end_at ?? e.start_at).getTime() > now);

    cacheSet(CACHE_KEY, upcoming, 60 * 60_000); // 1-hour cache
    res.json({ ok: true, events: upcoming, total: upcoming.length, source: 'scrape' });
  } catch (err) {
    console.error('[AWS events error]', err);
    res.status(502).json({ ok: false, error: String(err) });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Export for Vercel serverless
export default app;

// Listen only when running locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✓ CISOevents API server running on http://localhost:${PORT}`);
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
