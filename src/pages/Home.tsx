import { useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/bg_hero_image.jpeg';
import heroVideo from '../assets/BG_HERO_2_SUMMIT_2.mp4';
import {
  Calendar, MapPin, Users, Mic, Award, ChevronRight,
  Play, ArrowRight, Star, Shield, CalendarPlus, Send,
  Phone, Mail, ExternalLink,
} from 'lucide-react';
import { podcasts, stats } from '../data/mockData';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || 'https://cisoevents-prototype-backend.vercel.app';
import { useLumaEvents } from '../hooks/useLumaEvents';
import {
  getEventImage,
  getEventLocation,
  formatEventDateRange,
  getLumaEventUrl,
  getEventTrack,
  TRACK_LABELS,
  TRACK_COLORS,
} from '../services/lumaService';

// ─── Add to Calendar ──────────────────────────────────────────────────────────
function AddToCalendar() {
  const [open, setOpen] = useState(false);

  const title = 'CISOevents 2026';
  const description = 'The premier cybersecurity and AI leadership summit — 500+ security executives, San Francisco, CA.';
  const location = 'San Francisco, CA';
  const start = '20260828T090000Z';
  const end   = '20260829T180000Z';

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}%2F${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=2026-08-28T09:00:00&enddt=2026-08-29T18:00:00&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}`;
  const yahooUrl = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(title)}&st=${start}&et=${end}&in_loc=${encodeURIComponent(location)}&desc=${encodeURIComponent(description)}`;

  const downloadICS = () => {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CISOevents//EN',
      'BEGIN:VEVENT',
      `DTSTART:${start}`, `DTEND:${end}`,
      `SUMMARY:${title}`, `DESCRIPTION:${description}`, `LOCATION:${location}`,
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ciso-events-2026.ics'; a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const options = [
    { label: '📅  Google Calendar', href: googleUrl, external: true },
    { label: '🍎  Apple Calendar (.ics)', href: null, onClick: downloadICS },
    { label: '📧  Outlook', href: outlookUrl, external: true },
    { label: '🗓  Yahoo Calendar', href: yahooUrl, external: true },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 border-2 text-base px-8 py-3.5 rounded-lg transition-all duration-200 font-semibold"
        style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
          e.currentTarget.style.borderColor = 'var(--color-accent-hover)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '';
          e.currentTarget.style.borderColor = 'var(--color-accent)';
          e.currentTarget.style.color = 'var(--color-accent)';
        }}
      >
        <CalendarPlus size={18} /> Add to Calendar
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 z-20 rounded-xl shadow-2xl overflow-hidden w-56"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            {options.map(({ label, href, external, onClick }) =>
              onClick ? (
                <button
                  key={label}
                  onClick={onClick}
                  className="w-full text-left px-4 py-3 text-sm transition-colors"
                  style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border-light)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-hover-5)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--color-text)'; }}
                >
                  {label}
                </button>
              ) : (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-sm transition-colors"
                  style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-border-light)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-hover-5)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--color-text)'; }}
                >
                  {label}
                </a>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={heroVideo}
        poster={heroBg}
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/60" />
      {/* Subtle blue tint overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,14,26,0.5) 0%, rgba(0,168,255,0.08) 100%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'var(--color-accent-10)', borderWidth: '1px', borderColor: 'var(--color-accent-30)', color: 'var(--color-accent)' }}>
            <Star size={13} fill="currentColor" /> Flagship Event · March 23, 2026
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4" style={{ color: 'var(--color-heading)' }}>
            CISOevents<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, var(--color-accent), var(--color-accent2))' }}>
              2026
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-light tracking-widest mb-6 uppercase" style={{ color: 'var(--color-accent)' }}>
            Discover • Connect • Build
          </p>

          <p className="text-lg md:text-xl mb-3" style={{ color: 'var(--color-text)' }}>
            Join <span className="font-semibold" style={{ color: 'var(--color-heading)' }}>500+ security leaders</span> shaping the future of cybersecurity and AI.
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base mb-8 sm:mb-10" style={{ color: 'var(--color-text-muted)' }}>
            <Calendar size={17} style={{ color: 'var(--color-accent)' }} />
            <span>March 23, 2026</span>
            <span className="mx-2" style={{ color: 'var(--color-border)' }}>|</span>
            <MapPin size={17} style={{ color: 'var(--color-accent)' }} />
            <span>San Francisco, CA</span>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
            {/* Luma Register Button */}
            <button
              className="luma-checkout--button w-full sm:w-auto flex items-center justify-center gap-2 text-white font-semibold text-base px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              type="button"
              data-luma-action="checkout"
              data-luma-event-id="iuutm274"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
            >
              Register for Event <ArrowRight size={18} />
            </button>
            <AddToCalendar />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: 'var(--color-text-dim)' }}>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-current to-transparent" />
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const icons = { Users, Mic, Award, Calendar };
  const visibleStats = stats.filter(s => s.label !== 'Speakers' && s.label !== 'Sponsors');
  return (
    <section className="py-6" style={{ backgroundColor: 'var(--color-accent)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
          {visibleStats.map(({ label, value, icon }) => {
            const Icon = icons[icon as keyof typeof icons];
            return (
              <div key={label} className="flex flex-col items-center text-center text-white gap-1">
                <Icon size={20} className="opacity-80 mb-0.5" />
                <span className="text-xl sm:text-2xl font-black">{value}</span>
                <span className="text-xs sm:text-sm font-medium opacity-90">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── About / Value Prop ───────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section className="py-14 sm:py-20" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)' }}>Presented by Neptune Media</p>
          <h2 className="section-title mb-4">More Than a Conference</h2>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            CISOevents isn't just a conference — it's the epicenter for the evolution of Cyber Security &amp; AI.
            Every summit connects you with the industry experts shaping both the AI and Cyber Security industries.
          </p>
        </div>

        {/* AI / Cybersecurity Track */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
            <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap px-2" style={{ color: 'var(--color-heading)' }}>
              CISOevents — AI &amp; Cyber Security Track
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                icon: Users,
                title: 'Forge Strategic Partnerships',
                body: 'Network with cybersecurity executive peers, colleagues, and technology providers seeking cutting-edge solutions in AI and Cyber Security. Connect with industry leaders, exchange ideas, and stay at the forefront of cybersecurity and AI excellence.',
              },
              {
                icon: Mic,
                title: 'Thought Leadership Sessions',
                body: 'Join expert-led sessions and strategic discussions designed to help leadership teams stay ahead of emerging cyber and AI challenges.',
              },
              {
                icon: Shield,
                title: 'Embrace the Power of AI',
                body: 'Discover the latest advancements in artificial intelligence and its applications across cybersecurity and beyond. Learn practical strategies to optimize protection, boost efficiency, and secure your digital future.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl p-7 transition-all duration-300"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-accent-30)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-accent-10)' }}>
                  <Icon size={22} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--color-heading)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Startup Track */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
            <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap px-2" style={{ color: 'var(--color-heading)' }}>
              CISOevents — Startup Track
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: 'var(--color-border)' }} />
          </div>
          <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
            <h3 className="text-white font-bold text-xl mb-2">Who Should Attend the Investor Conference?</h3>
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>Built for founders, executives, and capital-seekers ready to accelerate growth.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Executives Seeking Public Listing Guidance',
                  body: 'CEOs, CFOs, and C-Suite leaders from mid-cap companies seeking insights on navigating major exchanges like NYSE and Nasdaq.',
                },
                {
                  title: 'Growth-Stage Companies Seeking Capital',
                  body: 'Founders and executives looking to raise capital for their ventures.',
                },
                {
                  title: 'Investment-Ready Startups',
                  body: 'Startups seeking funding opportunities can pitch directly to attending investors.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="border border-white/10 rounded-xl p-5">
                  <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: 'var(--color-accent)' }} />
                  <h4 className="text-white font-semibold text-sm mb-2">{title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Series */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            This premier CISOevents series expands beyond the US, with gatherings planned in{' '}
            <span className="font-semibold" style={{ color: 'var(--color-heading)' }}>Toronto</span> and{' '}
            <span className="font-semibold" style={{ color: 'var(--color-heading)' }}>London</span>. We consistently attract
            mid-to-large enterprises, providing a platform to connect with a vast and influential audience.
          </p>
        </div>

      </div>
    </section>
  );
}

// ─── Upcoming Events ──────────────────────────────────────────────────────────
function UpcomingEvents() {
  const { upcoming, loading, error } = useLumaEvents();
  const show = upcoming.slice(0, 3);

  return (
    <section id="upcoming-events" className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-semibold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>Don't miss out</p>
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">World-class cybersecurity gatherings across the globe</p>
        </div>

        {/* Loading skeleton */}
        {loading && show.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="h-48" style={{ backgroundColor: 'var(--color-dark-bg)' }} />
                <div className="p-5 space-y-3">
                  <div className="h-5 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
                  <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--color-border)' }} />
                  <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--color-border)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error fallback */}
        {error && show.length === 0 && (
          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Could not load upcoming events.{' '}
            <a href="https://lu.ma/cisoevents" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
              View on Luma →
            </a>
          </p>
        )}

        {/* No upcoming events */}
        {!loading && !error && show.length === 0 && (
          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No upcoming events right now — check back soon or{' '}
            <a href="https://lu.ma/cisoevents" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>
              follow us on Luma
            </a>.
          </p>
        )}

        {/* Event cards */}
        {show.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {show.map(ev => {
              const location = getEventLocation(ev);
              const lumaUrl  = getLumaEventUrl(ev);
              return (
                <div key={ev.api_id} className="card overflow-hidden group">
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={getEventImage(ev)}
                      alt={ev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        Upcoming
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3
                      className="font-bold text-lg mb-2 leading-snug transition-colors"
                      style={{ color: 'var(--color-heading)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-heading)'}
                    >
                      {ev.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                      <Calendar size={14} style={{ color: 'var(--color-accent)' }} />
                      <span>{formatEventDateRange(ev)}</span>
                    </div>
                    {location && (
                      <div className="flex items-center gap-2 text-sm mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                        <MapPin size={14} style={{ color: 'var(--color-accent)' }} />
                        <span>{location}</span>
                      </div>
                    )}
                    {ev.hosts && ev.hosts.length > 0 && (
                      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                        <Users size={14} style={{ color: 'var(--color-accent)' }} />
                        <span>{ev.hosts.map(h => h.name).join(', ')}</span>
                      </div>
                    )}
                    <a
                      href={lumaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full text-white font-semibold text-sm py-2.5 rounded-lg transition-all duration-200"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                    >
                      Register on Luma <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 border-2 font-semibold px-6 py-3 rounded-lg transition-all"
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-accent)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--color-accent)'; }}
          >
            View All Events <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Past Events ─────────────────────────────────────────────────────────────
function PastEvents() {
  const { past, loading } = useLumaEvents();
  const show = past.slice(0, 3);

  if (!loading && show.length === 0) return null;

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-semibold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>Look Back</p>
          <h2 className="section-title">Past Events</h2>
          <p className="section-subtitle">Relive the conversations that shaped cybersecurity</p>
        </div>

        {/* Loading skeleton */}
        {loading && show.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="h-48" style={{ backgroundColor: 'var(--color-dark-bg)' }} />
                <div className="p-5 space-y-3">
                  <div className="h-5 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
                  <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--color-border)' }} />
                  <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--color-border)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {show.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {show.map(ev => {
              const location   = getEventLocation(ev);
              const lumaUrl    = getLumaEventUrl(ev);
              const track      = getEventTrack(ev);
              const trackColor = TRACK_COLORS[track];
              return (
                <div key={ev.api_id} className="card overflow-hidden group opacity-90 hover:opacity-100 transition-opacity">
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={getEventImage(ev)}
                      alt={ev.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="bg-gray-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        Past
                      </span>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: trackColor.bg, color: trackColor.text, border: `1px solid ${trackColor.border}`, backdropFilter: 'blur(4px)' }}
                      >
                        {TRACK_LABELS[track]}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3
                      className="font-bold text-lg mb-2 leading-snug transition-colors"
                      style={{ color: 'var(--color-heading)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-heading)'}
                    >
                      {ev.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                      <Calendar size={14} style={{ color: 'var(--color-accent)' }} />
                      <span>{formatEventDateRange(ev)}</span>
                    </div>
                    {location && (
                      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                        <MapPin size={14} style={{ color: 'var(--color-accent)' }} />
                        <span>{location}</span>
                      </div>
                    )}
                    <a
                      href={lumaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full font-semibold text-sm py-2.5 rounded-lg transition-all duration-200"
                      style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                    >
                      View Recap <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/events?tab=past"
            className="inline-flex items-center gap-2 border-2 font-semibold px-6 py-3 rounded-lg transition-all"
            style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-accent)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'var(--color-accent)'; }}
          >
            View All Past Events <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Latest Podcasts ──────────────────────────────────────────────────────────
function LatestPodcasts() {
  const latest = podcasts.slice(0, 3);
  return (
    <section id="podcasts" className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-semibold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>On-Demand</p>
          <h2 className="section-title">Latest Podcasts</h2>
          <p className="section-subtitle">Expert conversations on the topics that matter most</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {latest.map(pod => (
            <div key={pod.id} className="card overflow-hidden group">
              <div className="relative overflow-hidden h-44" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
                <img
                  src={pod.thumbnail}
                  alt={pod.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--color-accent)' }}>
                    <Play size={22} fill="white" className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-0.5 rounded">
                  {pod.duration}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2" style={{ color: 'var(--color-heading)' }}>
                  {pod.title}
                </h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{pod.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{pod.views} views</span>
                  <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--color-accent)' }}>
                    Watch <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left — info */}
          <div>
            <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)' }}>Get in Touch</p>
            <h2 className="section-title mb-4">Contact Us</h2>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--color-text-muted)' }}>
              Have questions about CISOevents? Interested in attending?
              Reach out and our team will get back to you shortly.
            </p>

            {/* Calendly — Book a Call */}
            <a
              href="https://calendly.com/cisoevents"
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg mb-8"
              style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
            >
              <Calendar size={18} /> Book a Call
            </a>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-accent-10)' }}>
                  <Phone size={20} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-dim)' }}>Phone</p>
                  <a href="tel:+13212362561" className="font-medium transition-colors" style={{ color: 'var(--color-text)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text)'}
                  >
                    +1-(321)-236-2561
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-accent-10)' }}>
                  <Mail size={20} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-text-dim)' }}>Email</p>
                  <a href="mailto:charles@cisoevents.com" className="font-medium transition-colors" style={{ color: 'var(--color-text)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text)'}
                  >
                    charlesp@cisoevents.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-accent-10)' }}>
                  <Send size={28} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-heading)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Name <span style={{ color: 'var(--color-accent)' }}>*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="form-input"
                      style={{ backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-heading)', borderColor: 'var(--color-border)' }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email <span style={{ color: 'var(--color-accent)' }}>*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="form-input"
                      style={{ backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-heading)', borderColor: 'var(--color-border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Phone <span style={{ color: 'var(--color-text-dim)' }}>(optional)</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="form-input"
                    style={{ backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-heading)', borderColor: 'var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="form-label">Message <span style={{ color: 'var(--color-accent)' }}>*</span></label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="form-input resize-none"
                    style={{ backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-heading)', borderColor: 'var(--color-border)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                  onMouseEnter={e => !sending && (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                >
                  {sending ? 'Sending…' : <><Send size={16} /> Send Message</>}
                </button>
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Hero />
      <StatsBar />
      <AboutSection />
      <UpcomingEvents />
      <PastEvents />
      <LatestPodcasts />
      <ContactSection />
    </>
  );
}
