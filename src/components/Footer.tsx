import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Linkedin, Twitter, Youtube, Facebook, ChevronDown } from 'lucide-react';
import logo from '../assets/CISOevents-Logo-R2.png';

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const socials = [
  { Icon: Linkedin,      href: 'https://www.linkedin.com/company/cisoevents',             label: 'LinkedIn' },
  { Icon: Twitter,       href: 'https://x.com/cisoevents',                                label: 'X / Twitter' },
  { Icon: Youtube,       href: 'https://www.youtube.com/@horizonsummit',                  label: 'YouTube' },
  { Icon: TikTokIcon,    href: 'https://www.tiktok.com/@cisoevents',                      label: 'TikTok' },
  { Icon: Facebook,      href: 'https://www.facebook.com/cisoevents',                     label: 'Facebook' },
  { Icon: InstagramIcon, href: 'https://www.instagram.com/cisoevents',                    label: 'Instagram' },
  { Icon: WhatsAppIcon,  href: 'https://call.whatsapp.com/voice/raAu2mPWQE8pJp9BS00HZl', label: 'WhatsApp' },
];

const faqs = [
  {
    q: 'What is CISOevents?',
    a: 'CISOevents is a premier event series connecting cybersecurity and AI leaders — CISOs, CIOs, investors, and startup founders — through curated summits, dinners, and networking events worldwide.',
  },
  {
    q: 'Are events free to attend?',
    a: 'Pricing varies per event. Some are free with approval, others are paid. Check each event listing on Luma for accurate pricing.',
  },
  {
    q: 'How do I register?',
    a: "Click 'Register Now' on any event. You'll be taken to Luma — our official registration platform — to complete sign-up.",
  },
  {
    q: 'Are events recorded?',
    a: 'Many events are recorded. Highlights and keynotes are available on our YouTube channel (@horizonsummit) and in the Gallery.',
  },
];

function FaqItem({ q, a, openId, setOpenId }: { q: string; a: string; openId: string | null; setOpenId: (v: string | null) => void }) {
  const isOpen = openId === q;
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <button
        className="w-full flex items-center justify-between gap-2 py-3 text-left"
        onClick={() => setOpenId(isOpen ? null : q)}
      >
        <span className="text-sm font-medium text-gray-300 leading-snug">{q}</span>
        <ChevronDown
          size={14}
          className="shrink-0 transition-transform duration-200"
          style={{ color: 'var(--color-accent)', transform: isOpen ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '180px' : '0px' }}
      >
        <p className="text-xs text-gray-500 pb-3 leading-relaxed pr-4">{a}</p>
      </div>
    </div>
  );
}

export default function Footer() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <footer style={{ backgroundColor: 'var(--color-dark-bg)' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src={logo} alt="CISOevents" className="h-7 w-auto brightness-0 invert" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              The premier platform connecting cybersecurity and AI leaders through world-class events, podcasts, and community.
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-accent)' }}>Follow Us</p>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center transition-colors duration-200"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-5" style={{ color: 'var(--color-accent)' }}>Quick Access</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Upcoming Events', to: '/events' },
                { label: 'Past Events',     to: '/events?tab=past' },
                { label: 'Gallery',         to: '/gallery' },
                { label: 'Podcasts',        to: '/podcasts' },
                { label: 'FAQs',            to: '/faq' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-5" style={{ color: 'var(--color-accent)' }}>Contact</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <Mail size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <a href="mailto:charlesp@cisoevents.com" className="text-gray-400 hover:text-white text-sm transition-colors break-all">
                  charlesp@cisoevents.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <a href="tel:+13212362561" className="text-gray-400 hover:text-white text-sm transition-colors">
                  +1 (321) 236-2561
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <span className="text-gray-400 text-sm">Neptune Media LLC<br />Wyoming 82801, USA</span>
              </li>
            </ul>
            <div className="mt-5 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs text-gray-500 leading-relaxed">
                All event registrations are powered by{' '}
                <a href="https://lu.ma/cisoevents" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white underline transition-colors">
                  Luma Events ↗
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider mb-5" style={{ color: 'var(--color-accent)' }}>FAQs</h4>
            {faqs.map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} openId={openFaq} setOpenId={setOpenFaq} />
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
            © 2026 CISOevents. All rights reserved. A Neptune Media Company.
          </p>
          <div className="flex gap-5">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy Policy</Link>
            <Link to="/faq" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">FAQ</Link>
            <a href="mailto:charlesp@cisoevents.com" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Contact</a>
          </div>
          <p className="text-[11px] text-gray-500">
            Powered by{' '}
            <a
              href="https://bluesproutagency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white underline transition-colors"
            >
              Blue Sprout Agency
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
