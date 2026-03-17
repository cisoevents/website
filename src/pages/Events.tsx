import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, Users, Filter, Search, ExternalLink, RefreshCw } from 'lucide-react';
import { useLumaEvents } from '../hooks/useLumaEvents';
import { useAwsEvents } from '../hooks/useAwsEvents';
import { useApp } from '../context/AppContext';
import { AWS_MODAL_MARKER } from '../data/awsEvents';
import {
  getEventImage,
  getEventLocation,
  formatEventDateRange,
  getEventYear,
  getLumaEventUrl,
  isUpcoming,
  getEventTrack,
  TRACK_LABELS,
  TRACK_COLORS,
  type EventTrack,
} from '../services/lumaService';

export default function Events() {
  const { openRegister } = useApp();
  const { events: lumaEvents, loading: lumaLoading, error, refresh } = useLumaEvents();
  const { events: awsEvents, loading: awsLoading } = useAwsEvents();

  // Merge AWS + Luma events, AWS first (upcoming events on top)
  const events = useMemo(() => {
    const seen = new Set<string>();
    const merged = [...awsEvents, ...lumaEvents].filter(e => {
      if (seen.has(e.api_id)) return false;
      seen.add(e.api_id);
      return true;
    });
    return merged;
  }, [awsEvents, lumaEvents]);

  const loading = lumaLoading || awsLoading;

  const [searchParams] = useSearchParams();
  // Default to 'upcoming' so clicking Events in the navbar shows upcoming events
  const initialTab = (searchParams.get('tab') ?? 'upcoming') as 'all' | 'upcoming' | 'past';

  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'past'>(initialTab);
  const [trackFilter,  setTrackFilter]  = useState<'all' | EventTrack>('all');
  const [yearFilter,   setYearFilter]   = useState('all');
  const [search,       setSearch]       = useState('');

  // Derive year list from real data
  const years = useMemo(() => {
    const ys = [...new Set(events.map(e => String(getEventYear(e))))].sort((a, b) => Number(b) - Number(a));
    return ['all', ...ys];
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter(ev => {
      const upcoming = isUpcoming(ev);
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'upcoming' && upcoming) ||
        (statusFilter === 'past'     && !upcoming);
      const matchTrack  = trackFilter === 'all' || getEventTrack(ev) === trackFilter;
      const matchYear   = yearFilter === 'all' || String(getEventYear(ev)) === yearFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || ev.name.toLowerCase().includes(q) || getEventLocation(ev).toLowerCase().includes(q);
      return matchStatus && matchTrack && matchYear && matchSearch;
    });
  }, [events, statusFilter, trackFilter, yearFilter, search]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Page Header */}
      <div
        className="pt-28 pb-16 px-4"
        style={{
          backgroundImage:
            'linear-gradient(135deg, var(--page-hero-c1) 0%, var(--page-hero-c2) 55%, var(--page-hero-c3) 100%), url(https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <p className="font-semibold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>Explore</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: 'var(--color-heading)' }}>All Events</h1>
          <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
            World-class cybersecurity gatherings — live and on-demand.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Filters */}
        <div className="rounded-2xl p-5 mb-8 flex flex-wrap gap-4 items-center"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>

          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <Filter size={16} />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-dim)' }} />
            <input
              type="text"
              aria-label="Search events or location"
              placeholder="Search events or location�"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-9 py-2 text-sm"
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Status:</span>
            <div className="flex gap-1">
              {(['all', 'upcoming', 'past'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={statusFilter === s
                    ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
                    : { backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-text-muted)' }}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Track */}
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Track:</span>
            <div className="flex gap-1 flex-wrap">
              <button
                onClick={() => setTrackFilter('all')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={trackFilter === 'all'
                  ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
                  : { backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-text-muted)' }}
              >
                All Tracks
              </button>
              {(['cyber', 'startup', 'other'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTrackFilter(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={trackFilter === t
                    ? { backgroundColor: TRACK_COLORS[t].text, color: '#fff' }
                    : { backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-text-muted)' }}
                >
                  {TRACK_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Year */}
          {years.length > 2 && (
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Year:</span>
              <div className="flex gap-1 flex-wrap">
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => setYearFilter(y)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={yearFilter === y
                      ? { backgroundColor: 'var(--color-accent)', color: '#fff' }
                      : { backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-text-muted)' }}
                  >
                    {y === 'all' ? 'All Years' : y}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-dim)' }}>
              {loading ? 'Loading�' : `${filtered.length} event${filtered.length !== 1 ? 's' : ''}`}
            </span>
            <button
              onClick={refresh}
              title="Refresh events"
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-dim)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-5 py-4 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
            Could not load events from Luma: {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && events.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="h-52" style={{ backgroundColor: 'var(--color-dark-bg)' }} />
                <div className="p-5 space-y-3">
                  <div className="h-5 rounded" style={{ backgroundColor: 'var(--color-border)' }} />
                  <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--color-border)' }} />
                  <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--color-border)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
              <Calendar size={28} style={{ color: 'var(--color-text-dim)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-heading)' }}>No events found</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Try adjusting your filters or check back soon.</p>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map(ev => {
              const upcoming = isUpcoming(ev);
              const location = getEventLocation(ev);
              const lumaUrl  = getLumaEventUrl(ev);

              const track = getEventTrack(ev);
              const trackColor = TRACK_COLORS[track];
              return (
                <div key={ev.api_id} className="card overflow-hidden group">
                  {/* Image */}
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={getEventImage(ev)}
                      alt={ev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Status + Track badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                        upcoming ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        {upcoming ? 'Upcoming' : 'Past'}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: trackColor.bg, color: trackColor.text, border: `1px solid ${trackColor.border}`, backdropFilter: 'blur(4px)' }}>
                        {TRACK_LABELS[track]}
                      </span>
                    </div>
                    {/* Tags overlay */}
                    {ev.tags && ev.tags.length > 0 && (
                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                        {ev.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3
                      className="font-bold text-lg mb-3 leading-tight transition-colors"
                      style={{ color: 'var(--color-heading)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-heading)'}
                    >
                      {ev.name}
                    </h3>

                    <div className="space-y-1.5 mb-5">
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        <Calendar size={13} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                        <span>{formatEventDateRange(ev)}</span>
                      </div>
                      {location && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          <MapPin size={13} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                          <span>{location}</span>
                        </div>
                      )}
                      {ev.hosts && ev.hosts.length > 0 && (
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          <Users size={13} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                          <span>{ev.hosts.map(h => h.name).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Ticket badge */}
                    {ev.ticket_info && (
                      <div className="mb-4">
                        {ev.ticket_info.is_free ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
                            Free Event
                          </span>
                        ) : ev.ticket_info.require_approval ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--color-accent-10)', color: 'var(--color-accent)' }}>
                            Apply to Attend
                          </span>
                        ) : null}
                      </div>
                    )}

                    {ev.url === AWS_MODAL_MARKER || upcoming ? (
                      <button
                        type="button"
                        onClick={openRegister}
                        className="flex items-center justify-center gap-1.5 w-full text-white font-semibold text-sm py-2.5 rounded-lg transition-all duration-200"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                      >
                        Register
                      </button>
                    ) : (
                      <a
                        href={lumaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full text-white font-semibold text-sm py-2.5 rounded-lg transition-all duration-200"
                        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-dark-bg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--color-surface)'; }}
                      >
                        View Recap
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer link to Luma */}
        {!loading && events.length > 0 && (
          <p className="text-center mt-10 text-sm" style={{ color: 'var(--color-text-dim)' }}>
            Data sourced live from{' '}
            <a href="https://lu.ma/cisoevents" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--color-accent)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-accent)'}
            >
              lu.ma/cisoevents
            </a>
            {' '}� refreshes every 10 minutes
          </p>
        )}
      </div>
    </div>
  );
}
