import { useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/bg_hero_image.jpeg';
import heroVideo from '../assets/BG_HERO_2_SUMMIT_2.mp4';
import {
  Calendar, MapPin, Users, Mic, Award,
  ArrowRight, Star, Shield,
} from 'lucide-react';
import { stats } from '../data/mockData';
import { useLumaEvents } from '../hooks/useLumaEvents';
import { useAwsEvents } from '../hooks/useAwsEvents';
import { useApp } from '../context/AppContext';
import {
  getEventImage,
  getEventLocation,
  formatEventDateRange,
  isUpcoming,
  getEventTrack,
  TRACK_LABELS,
  TRACK_COLORS,
} from '../services/lumaService';

// â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Small helper so Hero can call openRegister from context
function HeroRegisterButton() {
  const { openRegister } = useApp();
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
      <button
        type="button"
        onClick={openRegister}
        className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-semibold text-base px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        style={{ backgroundColor: 'var(--color-accent)' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
      >
        Register for Event <ArrowRight size={18} />
      </button>
    </div>
  );
}

function Hero() {
  // Inject a <link rel="preload"> for the poster image so it is fetched at
  // high priority — makes the LCP element render before the video downloads.
  useEffect(() => {
    const existing = document.querySelector('link[data-hero-poster]');
    if (existing) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = heroBg;
    link.setAttribute('fetchpriority', 'high');
    link.setAttribute('data-hero-poster', '1');
    document.head.appendChild(link);
  }, []);

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
        preload="none"
        aria-hidden="true"
      />
      {/* Dark overlay so text stays readable */}
      <div className="absolute inset-0" style={{ backgroundColor: 'var(--hero-overlay)' }} />
      {/* Subtle blue tint overlay */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,14,26,0.6) 0%, var(--hero-tint) 100%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: '1px', borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
            <Star size={13} fill="currentColor" /> Flagship Event · March 23, 2026
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4" style={{ color: '#fff' }}>
            CISOevents<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, var(--color-accent), var(--color-accent2))' }}>
              2026
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-light tracking-widest mb-6 uppercase" style={{ color: '#e2e8f0' }}>
            Discover • Connect • Build
          </p>

          <p className="text-lg md:text-xl mb-3" style={{ color: '#e2e8f0' }}>
            Join <span className="font-semibold" style={{ color: '#fff' }}>500+ security leaders</span> shaping the future of cybersecurity and AI.
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base mb-8 sm:mb-10" style={{ color: '#e2e8f0' }}>
            <Calendar size={17} style={{ color: 'var(--color-accent)' }} />
            <span>March 23, 2026</span>
            <span className="mx-2" style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
            <MapPin size={17} style={{ color: 'var(--color-accent)' }} />
            <span>San Francisco, CA</span>
          </div>

          <HeroRegisterButton />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: '#e2e8f0' }}>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-current to-transparent" />
      </div>
    </section>
  );
}

// â”€â”€â”€ Stats Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€â”€ About / Value Prop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AboutSection() {
  return (
    <section
      className="py-14 sm:py-20"
      style={{
        backgroundColor: 'var(--color-bg-alt)',
        backgroundImage:
          'linear-gradient(135deg, var(--about-overlay-1) 0%, var(--about-overlay-2) 55%, rgba(0,0,0,0.6) 100%), url(https://t3.ftcdn.net/jpg/08/33/64/06/360_F_833640636_yf7vmgqbMOawNRJDI1xjef2ydnsnJ1gb.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: '#cbd5ff' }}>Presented by Neptune Media</p>
          <h2 className="section-title mb-4" style={{ color: '#fff' }}>More Than a Conference</h2>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(226,232,240,0.9)' }}>
            CISOevents isn't just a conference – it's the epicenter for the evolution of Cyber Security &amp; AI.
            Every summit connects you with the industry experts shaping both the AI and Cyber Security industries.
          </p>
        </div>

        {/* AI / Cybersecurity Track */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
            <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap px-2" style={{ color: '#fff' }}>
              CISOevents – AI &amp; Cyber Security Track
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
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

        {/* About Series */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-base leading-relaxed" style={{ color: 'rgba(226,232,240,0.9)' }}>
            This premier CISOevents series expands beyond the US, with gatherings planned in{' '}
            <span className="font-semibold" style={{ color: '#fff' }}>Toronto</span> and{' '}
            <span className="font-semibold" style={{ color: '#fff' }}>London</span>. We consistently attract
            mid-to-large enterprises, providing a platform to connect with a vast and influential audience.
          </p>
        </div>

      </div>
    </section>
  );
}

// â”€â”€â”€ Upcoming Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function UpcomingEvents() {
  const { openRegister } = useApp();
  const { upcoming: lumaUpcoming, loading: lumaLoading, error } = useLumaEvents();
  const { events: awsEvents, loading: awsLoading } = useAwsEvents();

  const loading = lumaLoading || awsLoading;

  // Merge AWS upcoming events (already date-filtered by backend) with Luma upcoming,
  // AWS events first so the RSA 2026 event appears at top.
  const show = useMemo(() => {
    const awsUpcoming = awsEvents.filter(isUpcoming);
    return [...awsUpcoming, ...lumaUpcoming].slice(0, 3);
  }, [awsEvents, lumaUpcoming]);

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
              View on Luma â†’
            </a>
          </p>
        )}

        {/* No upcoming events */}
        {!loading && !error && show.length === 0 && (
          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No upcoming events right now – check back soon or{' '}
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

// ContactSection extracted → src/pages/Contact.tsx

export default function Home() {
  return (
    <>
      {/* <Hero /> */}
      {/* <StatsBar /> */}
      {/* <AboutSection /> */}
      {/* <UpcomingEvents /> */}
    </>
  );
}
