﻿import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, Calendar, Users, Building2, Mic, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface FaqEntry {
  q: string;
  a: React.ReactNode;
}

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
  faqs: FaqEntry[];
}

// â”€â”€â”€ FAQ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const categories: Category[] = [
  {
    id: 'about',
    label: 'About CISOevents',
    icon: Shield,
    faqs: [
      {
        q: 'What is CISOevents?',
        a: 'CISOevents is a premier event series connecting cybersecurity and AI leaders â€” CISOs, CIOs, investors, and startup founders â€” through curated summits, roundtable dinners, and exclusive networking events worldwide. Organized by Neptune Media LLC.',
      },
      {
        q: 'Who attends CISOevents?',
        a: 'Our audience includes C-suite executives (CISO, CIO, CTO, CEO), cybersecurity practitioners, venture capitalists, enterprise technology buyers, and startup founders in the cybersecurity and AI space.',
      },
      {
        q: 'Where are events held?',
        a: 'CISOevents are held globally â€” including major tech and financial hubs such as New York, Miami, San Francisco, London, Dubai (GITEX), and Singapore. Check our Events page for upcoming locations.',
      },
      {
        q: 'How is CISOevents different from other cybersecurity conferences?',
        a: 'We focus on intimate, curated experiences rather than massive trade shows. Our events emphasize real conversations, deal-making, and peer learning in small groups â€” not just keynotes and vendor booths.',
      },
    ],
  },
  {
    id: 'registration',
    label: 'Registration & Tickets',
    icon: Calendar,
    faqs: [
      {
        q: 'How do I register for a CISOevents event?',
        a: (
          <>
            Click <strong>Register Now</strong> on any event listing. You will be directed to{' '}
            <a href="https://lu.ma/cisoevents" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: 'var(--color-accent)' }}>Luma</a>
            {' '}â€” our official registration platform â€” to complete your sign-up. Some events require
            approval before your spot is confirmed.
          </>
        ),
      },
      {
        q: 'Are events free to attend?',
        a: 'Pricing varies per event. Some events are complimentary with approval for qualified executives. Others are ticketed. Check each event listing on Luma for accurate pricing and eligibility requirements.',
      },
      {
        q: 'What is included in my registration?',
        a: (
          <>
            Inclusions vary per event and pass type. Most standard registrations include access to all
            sessions, networking breaks, and select refreshments. Our <strong>VIP Pass</strong> â€” where
            available â€” is the only pass tier that includes both Lunch and Dinner. Review the specific
            event listing for a full breakdown of what is included with each pass type.
          </>
        ),
      },
      {
        q: 'Are meals included with my registration?',
        a: 'Meal inclusions depend on the pass type. The VIP Pass is the only pass tier that includes both Lunch and Dinner. Standard passes may include light refreshments during networking breaks. Check the specific event listing for full details.',
      },
      {
        q: 'Can I cancel my registration or get a refund?',
        a: 'All passes are non-refundable. If you are unable to attend, please contact us at charlesp@cisoevents.com as early as possible â€” in certain circumstances we may be able to transfer your registration to a future event.',
      },
      {
        q: 'Can I purchase tickets at the door?',
        a: 'Yes â€” walk-in tickets may be available at select events, subject to capacity. Walk-in purchases are charged at the Full Retail Rate. We recommend registering in advance through Luma to secure your spot at the best rate.',
      },
      {
        q: 'How can I buy tickets for special events or workshops?',
        a: (
          <>
            Tickets for special side events, workshops, and dinners can be purchased via the registration
            links on the specific event page or through our{' '}
            <Link to="/events" className="underline" style={{ color: 'var(--color-accent)' }}>
              Events page
            </Link>
            . Each special event has its own Luma listing with separate ticketing.
          </>
        ),
      },
      {
        q: 'How do I subscribe to CISOevents calendar updates?',
        a: 'You can subscribe to our live event calendar via the iCal / Google Calendar button on the Events page. This auto-updates whenever new events are added.',
      },
      {
        q: 'Can I attend virtually?',
        a: 'Selected events offer virtual attendance or live streams. Each event listing will indicate whether a virtual option is available. Recordings of keynotes are typically published on our YouTube channel after the event.',
      },
    ],
  },
  {
    id: 'speakers',
    label: 'Speakers & Content',
    icon: Mic,
    faqs: [
      {
        q: 'How do I apply to speak at a CISOevents event?',
        a: (
          <>
            To apply as a speaker, email{' '}
            <a href="mailto:charlesp@cisoevents.com" className="underline" style={{ color: 'var(--color-accent)' }}>
              charlesp@cisoevents.com
            </a>{' '}
            with your name, title, company, topic idea, and a brief bio. Our team reviews all speaker applications.
          </>
        ),
      },
      {
        q: 'Are events recorded?',
        a: 'Many events are recorded. Highlights, keynote footage, and panel recordings are published on our YouTube channel and in the Gallery section of this website.',
      },
      {
        q: 'Where can I find past event recordings?',
        a: (
          <>
            Visit our{' '}
            <Link to="/gallery" className="underline" style={{ color: 'var(--color-accent)' }}>
              Gallery
            </Link>{' '}
            page for videos and photos from past events, or visit our{' '}
            <a href="https://www.youtube.com/@horizonsummit" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: 'var(--color-accent)' }}>YouTube channel</a>.
          </>
        ),
      },
    ],
  },
  {
    id: 'sponsors',
    label: 'Sponsorship & Partners',
    icon: Building2,
    faqs: [
      {
        q: 'How can my company sponsor a CISOevents event?',
        a: (
          <>
            We offer tailored sponsorship packages for cybersecurity vendors, VCs, and enterprise brands. Email{' '}
            <a href="mailto:charlesp@cisoevents.com" className="underline" style={{ color: 'var(--color-accent)' }}>
              charlesp@cisoevents.com
            </a>{' '}
            or call{' '}
            <a href="tel:+13212362561" className="underline" style={{ color: 'var(--color-accent)' }}>
              +1 (321) 236-2561
            </a>{' '}
            to request our sponsorship deck.
          </>
        ),
      },
      {
        q: 'What sponsorship tiers are available?',
        a: 'We offer custom packages tailored to your goals â€” from logo placement and exhibit tables, to speaking slots, roundtable hosting, and exclusive dinner sponsorships. Contact us for the full sponsorship deck.',
      },
      {
        q: 'When is the deadline to submit sponsor logos and materials?',
        a: (
          <>
            To be included in printed or digital materials, all sponsor logos and required content must be
            submitted at least <strong>30 days before the event</strong>. Logos submitted after that date
            will be posted on the website and social media, but may not appear in on-screen graphics during
            the event. Files must be in vector format (AI, EPS, or SVG preferred; high-resolution PNG
            accepted if no vector exists).
          </>
        ),
      },
      {
        q: 'Can my startup participate in a pitch session?',
        a: 'Yes. Certain CISOevents include startup showcase segments and investor pitch opportunities. These are curated by application. Email us with your startup information to be considered.',
      },
      {
        q: 'Does CISOevents endorse sponsors?',
        a: "Use of a sponsor's name or logo on the event website, social media, or mailing list does not constitute endorsement by CISOevents of the sponsor or its products, services, or programs. CISOevents is a non-exclusive platform â€” we do not offer or imply exclusive relationships with any sponsor.",
      },
    ],
  },
  {
    id: 'legal',
    label: 'Terms & Policies',
    icon: FileText,
    faqs: [
      {
        q: 'Where can I find the Terms and Conditions for sponsorship?',
        a: (
          <>
            Full sponsorship terms and conditions are provided in your Sponsorship Agreement upon signing.
            Key terms include: sponsor trademark usage policy, production timeline and logo deadlines,
            payment terms (ACH/wire preferred â€” Net 15 available for Accounts Payable), non-exclusivity,
            and force majeure clauses. Contact{' '}
            <a href="mailto:charlesp@cisoevents.com" className="underline" style={{ color: 'var(--color-accent)' }}>
              charlesp@cisoevents.com
            </a>{' '}
            to request a copy of the full agreement.
          </>
        ),
      },
      {
        q: 'What is the payment policy for sponsorships?',
        a: 'Preferred payment is by ACH or wire transfer. Net 15 terms are available for Accounts Payable. Credit cards are accepted as a last resort (processing fees apply). Full payment must be received at least 75 days before the event â€” failure to pay by this deadline may result in sponsorship cancellation.',
      },
      {
        q: 'What is the Code of Conduct for events?',
        a: (
          <>
            All attendees, speakers, and sponsors are required to adhere to the CISOevents Code of Conduct,
            which includes respectful, professional behavior throughout all event activities. CISOevents
            reserves the right to remove any individual or reject any sponsor for violations. The full
            Code of Conduct can be found at{' '}
            <a href="https://cisoevents.com/coc" target="_blank" rel="noopener noreferrer"
              className="underline" style={{ color: 'var(--color-accent)' }}>cisoevents.com/coc</a>.
          </>
        ),
      },
      {
        q: 'What happens if an event is cancelled due to circumstances beyond your control?',
        a: "CISOevents includes a Force Majeure clause in all agreements. In the event of cancellation due to fire, flood, natural disaster, acts of government, health and safety concerns (including COVID-related changes), or other causes beyond our commercially reasonable control, CISOevents and Neptune Media LLC are held harmless from legal and financial liability beyond the fee already paid. We will make every effort to notify attendees and reschedule affected events.",
      },
      {
        q: 'Does CISOevents store my personal data?',
        a: (
          <>
            CISOevents does not store personal registration data on this website. All event registrations
            are handled by Luma, who manages your data under their own privacy policy. Our website only
            caches public event data in your browser's local storage (auto-clears every 10 minutes). See
            our{' '}
            <Link to="/privacy" className="underline" style={{ color: 'var(--color-accent)' }}>
              Privacy Policy
            </Link>{' '}
            for full details.
          </>
        ),
      },
    ],
  },
  {
    id: 'contact',
    label: 'Contact & General',
    icon: Users,
    faqs: [
      {
        q: 'How do I contact CISOevents?',
        a: (
          <>
            Email us at{' '}
            <a href="mailto:charlesp@cisoevents.com" className="underline" style={{ color: 'var(--color-accent)' }}>
              charlesp@cisoevents.com
            </a>{' '}
            or call{' '}
            <a href="tel:+13212362561" className="underline" style={{ color: 'var(--color-accent)' }}>
              +1 (321) 236-2561
            </a>
            . You can also use the contact form on our homepage.
          </>
        ),
      },
      {
        q: 'How do I stay updated on new events?',
        a: 'Follow us on LinkedIn, X (Twitter), and Instagram @cisoevents, or subscribe to our calendar on the Events page. You can also register on Luma to receive notifications for new event announcements.',
      },
      {
        q: 'I have feedback or a complaint â€” who do I contact?',
        a: (
          <>
            We welcome all feedback. Please email{' '}
            <a href="mailto:charlesp@cisoevents.com" className="underline" style={{ color: 'var(--color-accent)' }}>
              charlesp@cisoevents.com
            </a>{' '}
            directly. We aim to respond within 2 business days.
          </>
        ),
      },
    ],
  },
];

// â”€â”€â”€ FaqItem â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FaqItem({ q, a }: FaqEntry) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: open ? 'var(--color-surface)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${open ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={() => setOpen(v => !v)}
      >
        <span className="font-medium text-sm leading-snug" style={{ color: open ? '#fff' : '#d1d5db' }}>
          {q}
        </span>
        <ChevronDown
          size={16}
          className="shrink-0 transition-transform duration-200"
          style={{
            color: 'var(--color-accent)',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '400px' : '0px' }}
      >
        <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-3">
          {a}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('about');
  const [searchQuery, setSearchQuery] = useState('');

  const allFaqs = categories.flatMap(c => c.faqs.map(f => ({ ...f, category: c.label })));

  const searchResults = searchQuery.trim().length > 1
    ? allFaqs.filter(f =>
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof f.a === 'string' && f.a.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  const activeData = categories.find(c => c.id === activeCategory)!;

  return (
    <div
      className="min-h-screen pt-20 pb-20"
      style={{ backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* â”€â”€ Header â”€â”€ */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ backgroundColor: 'rgba(0,168,255,0.1)', color: 'var(--color-accent)', border: '1px solid rgba(0,168,255,0.2)' }}
          >
            <HelpCircle size={13} />
            Help Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            Everything you need to know about CISOevents â€” registration, speaking, sponsorship, and more.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              aria-label="Search frequently asked questions"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-xl text-sm focus:outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-lg leading-none"
              >
                Ã—
              </button>
            )}
          </div>
        </div>

        {/* â”€â”€ Search Results â”€â”€ */}
        {searchResults !== null && (
          <div className="mb-12">
            <p className="text-sm text-gray-500 mb-4">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </p>
            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <HelpCircle size={32} className="mx-auto mb-3 opacity-30" />
                <p>No results found. Try a different search or{' '}
                  <a href="mailto:charlesp@cisoevents.com" className="underline" style={{ color: 'var(--color-accent)' }}>
                    contact us
                  </a>.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((f, i) => (
                  <FaqItem key={i} q={f.q} a={f.a} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* â”€â”€ Category Tabs + FAQs â”€â”€ */}
        {!searchResults && (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar categories */}
            <aside className="lg:w-56 shrink-0">
              <nav className="space-y-1 lg:sticky lg:top-24">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  const isActive = cat.id === activeCategory;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? 'rgba(0,168,255,0.12)' : 'transparent',
                        color: isActive ? 'var(--color-accent)' : '#9ca3af',
                        border: `1px solid ${isActive ? 'rgba(0,168,255,0.25)' : 'transparent'}`,
                      }}
                    >
                      <Icon size={15} className="shrink-0" />
                      {cat.label}
                    </button>
                  );
                })}
              </nav>

              {/* Still need help */}
              <div
                className="mt-8 p-4 rounded-xl text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  Still have questions?
                </p>
                <a
                  href="mailto:charlesp@cisoevents.com"
                  className="block w-full text-center text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
                >
                  Email Us
                </a>
              </div>
            </aside>

            {/* FAQ list */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-6">
                <activeData.icon size={18} style={{ color: 'var(--color-accent)' }} />
                <h2 className="text-lg font-semibold text-white">{activeData.label}</h2>
                <span
                  className="ml-auto text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: 'rgba(0,168,255,0.1)', color: 'var(--color-accent)' }}
                >
                  {activeData.faqs.length} questions
                </span>
              </div>
              <div className="space-y-3">
                {activeData.faqs.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* â”€â”€ Bottom CTA â”€â”€ */}
        <div
          className="mt-16 p-8 rounded-2xl text-center"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-xl font-bold text-white mb-2">Ready to join the community?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Browse our upcoming events and reserve your spot today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/events"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
            >
              View Upcoming Events
            </Link>
            <a
              href="mailto:charlesp@cisoevents.com"
              className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Contact Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
