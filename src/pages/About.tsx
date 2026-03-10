import { Link } from 'react-router-dom';
import { Shield, Users, Mic, Globe, Award, Building2, Mail, Phone, ArrowRight } from 'lucide-react';

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatItem { value: string; label: string }
const stats: StatItem[] = [
  { value: '500+',  label: 'Security Leaders' },
  { value: '50+',   label: 'Events Hosted' },
  { value: '30+',   label: 'Cities Reached' },
  { value: '10+',   label: 'Years Experience' },
];

// ─── Values ────────────────────────────────────────────────────────────────────
const values = [
  {
    icon: Shield,
    title: 'Peer-Led Conversations',
    desc: 'Every agenda is crafted around the real challenges CISOs face — not vendor pitches. Discussions are candid, unscripted, and off the record by default.',
  },
  {
    icon: Users,
    title: 'Vetted Community',
    desc: 'Attendance is curated. We ensure every seat is filled by a qualified security executive, making the network you build here genuinely valuable.',
  },
  {
    icon: Mic,
    title: 'Practitioner Speakers Only',
    desc: "Our speakers are active CISOs, VPs of Security, and hands-on practitioners — not marketers. You hear what's actually working in the field.",
  },
  {
    icon: Globe,
    title: 'National Reach',
    desc: 'From San Francisco to New York, our regional summits bring the conversation to where you are — with local context and national perspective.',
  },
  {
    icon: Award,
    title: 'Vendor-Neutral',
    desc: 'CISOevents does not endorse any product or vendor. Sponsors gain visibility, but conversations remain objective and peer-driven.',
  },
  {
    icon: Building2,
    title: 'Operated by Neptune Media',
    desc: 'CISOevents is a brand of Neptune Media LLC — a Wyoming-based media and events company dedicated to the cybersecurity executive community.',
  },
];

// ─── Event Formats ─────────────────────────────────────────────────────────────
const formats = [
  {
    name: 'Horizon Summit',
    tagline: 'Annual flagship conference',
    desc: 'Full-day executive summit bringing together 150–250 CISOs and security leaders for keynotes, panels, roundtables, and a networking dinner.',
    color: 'var(--color-accent)',
  },
  {
    name: 'Roundtables',
    tagline: 'Intimate peer discussions',
    desc: 'Invite-only sessions of 15–25 security leaders exploring a focused topic over lunch or dinner. No slides, no demos — just peer insight.',
    color: '#3b82f6',
  },
  {
    name: 'Virtual Briefings',
    tagline: 'On-demand access',
    desc: 'Short-form virtual sessions keeping the CISO community up to date on emerging threats, regulatory shifts, and strategic decisions.',
    color: '#8b5cf6',
  },
];

export default function About() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative py-28 px-4 text-center overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, var(--page-hero-c1) 0%, var(--page-hero-c2) 55%, var(--page-hero-c3) 100%), url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative max-w-3xl mx-auto">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            About CISOevents
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight" style={{ color: 'var(--color-heading)' }}>
            Where the <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #2563eb 0%, #06b6d4 50%, #0ea5e9 100%)' }}
            >CISO Community</span> Comes Together
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            CISOevents is a community-first platform producing executive summits, roundtables, and virtual briefings
            exclusively for Chief Information Security Officers and senior security leaders across North America.
          </p>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 border-y" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold" style={{ color: 'var(--color-accent)' }}>{s.value}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--color-text)' }}>Our Mission</h2>
            <p className="leading-relaxed mb-5" style={{ color: 'var(--color-text-muted)' }}>
              The modern CISO operates in isolation. Despite the growing number of conferences, most events prioritize
              vendor relationships over peer connection. CISOevents was built to fix that.
            </p>
            <p className="leading-relaxed mb-5" style={{ color: 'var(--color-text-muted)' }}>
              We create spaces where security executives can speak candidly about what's working, what's failing, and
              what's coming — without the pressure of a product pitch in every hallway conversation.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Whether it's our flagship Horizon Summit, an intimate roundtable dinner, or a virtual briefing, every
              CISOevents experience is designed around one goal: <strong style={{ color: 'var(--color-text)' }}>meaningful peer connection</strong>.
            </p>
          </div>

          {/* Visual card */}
          <div
            className="rounded-2xl p-8 border"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <blockquote className="text-lg italic leading-relaxed mb-6" style={{ color: 'var(--color-text)' }}>
              "The best security strategies don't come from vendor decks — they come from conversations with peers
              who've already faced your next breach."
            </blockquote>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>— CISOevents Philosophy</p>
          </div>
        </div>
      </section>

      {/* ── What We Stand For ────────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>What We Stand For</h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
              Six principles that shape every event we produce.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(v => (
              <div
                key={v.title}
                className="rounded-xl p-6 border transition-transform hover:-translate-y-1"
                style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(var(--color-accent-rgb, 234 179 8), 0.12)' }}
                >
                  <v.icon size={20} style={{ color: 'var(--color-accent)' }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Event Formats ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>Our Event Formats</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Three ways we bring the community together.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {formats.map(f => (
              <div
                key={f.name}
                className="rounded-xl p-6 border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <div
                  className="w-2 h-8 rounded-full mb-4"
                  style={{ backgroundColor: f.color }}
                />
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: f.color }}>{f.tagline}</p>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>{f.name}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
              style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
            >
              View Upcoming Events <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Who Attends ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--color-text)' }}>Who Attends</h2>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Our events are designed for senior cybersecurity executives — not practitioners in their first role or
              general IT professionals. Attendance is vetted to protect the quality of peer conversation.
            </p>
            <ul className="space-y-3">
              {[
                'Chief Information Security Officers (CISOs)',
                'Deputy / Associate CISOs',
                'VP / Director of Security',
                'Chief Security Officers (CSOs)',
                'CIOs with security oversight',
                'Security practitioners by invitation',
              ].map(r => (
                <li key={r} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-accent)' }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--color-text)' }}>Who Sponsors</h2>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Sponsorship is available to cybersecurity vendors and service providers seeking meaningful access to
              CISO-level buyers — not just brand impressions.
            </p>
            <ul className="space-y-3">
              {[
                'Cybersecurity product vendors',
                'Managed security service providers (MSSPs)',
                'Consulting & advisory firms',
                'Insurance & risk management providers',
                'Compliance & legal technology companies',
              ].map(r => (
                <li key={r} className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#3b82f6' }} />
                  {r}
                </li>
              ))}
            </ul>
            <a
              href="mailto:charlesp@cisoevents.com?subject=Sponsorship Inquiry"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors hover:bg-blue-600"
              style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
            >
              Inquire About Sponsorship <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ── About Neptune Media ──────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-5" style={{ color: 'var(--color-text)' }}>About Neptune Media LLC</h2>
          <p className="leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
            CISOevents is operated by <strong style={{ color: 'var(--color-text)' }}>Neptune Media LLC</strong>, a Wyoming-based media and live events company
            focused exclusively on the cybersecurity executive market. Neptune Media produces editorial content,
            podcasts, and in-person events under the CISOevents and Horizon Summit brands.
          </p>
          <p className="leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            All events are produced in-house with a commitment to quality over quantity — we run fewer, better events
            so that every attendee and sponsor has a genuinely premium experience.
          </p>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 text-center"
        style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}
      >
        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>Get in Touch</h2>
        <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          Questions about attendance, speaking, or sponsorship? Reach us directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="mailto:charlesp@cisoevents.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            <Mail size={16} /> charlesp@cisoevents.com
          </a>
          <a
            href="tel:+13212362561"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <Phone size={16} /> +1 (321) 236-2561
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            Contact Form <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
}
