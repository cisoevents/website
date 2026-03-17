import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall, CalendarDays } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/CISOevents-Logo-R2.png';
import { useApp } from '../context/AppContext';

const navLinks = [
  { label: 'About',    to: '/about' },
  { label: 'Events',   to: '/events' },
  { label: 'Gallery',  to: '/gallery' },
  // TODO: re-enable once YOUTUBE_API_KEY is set on Vercel
  // { label: 'Podcasts', to: '/podcasts' },
  { label: 'Contact',  to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { openCalendly, openRegister } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const handleAnchorClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}
      style={{
        backgroundColor: 'var(--color-nav-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid var(--color-border)`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — colorful, no filter */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="CISOevents" className="h-9 w-auto logo-themed" width="3523" height="600" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              link.to.startsWith('/#') ? (
                <button
                  key={link.label}
                  onClick={() => handleAnchorClick(link.to)}
                  className="px-4 py-2 font-medium text-sm rounded-lg transition-colors"
                  style={{ color: 'var(--color-heading)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.backgroundColor = 'var(--color-hover-10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-heading)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {link.label}
                </button>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className="px-4 py-2 font-medium text-sm rounded-lg transition-colors"
                  style={({ isActive }) => isActive
                    ? { color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-10)' }
                    : { color: 'var(--color-heading)' }}
                  onMouseEnter={e => { const target = e.currentTarget as HTMLAnchorElement; if (!(target as any)._active) { target.style.color = 'var(--color-accent)'; target.style.backgroundColor = 'var(--color-hover-10)'; } }}
                  onMouseLeave={e => { const target = e.currentTarget as HTMLAnchorElement; if (!(target as any)._active) { target.style.color = 'var(--color-heading)'; target.style.backgroundColor = 'transparent'; } }}
                >
                  {link.label}
                </NavLink>
              )
            ))}
          </div>

          {/* Desktop right CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {/* Book Call — opens Calendly modal */}
            <button
              type="button"
              onClick={openCalendly}
              className="text-sm font-semibold px-4 py-2 rounded-lg border transition-all inline-flex items-center gap-2"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-heading)',
                backgroundColor: 'var(--color-surface)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-hover-10)';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-heading)';
              }}
            >
              <PhoneCall size={16} /> Book a Call
            </button>
            {/* Register Button — opens AWS Events Builder modal */}
            <button
              type="button"
              onClick={openRegister}
              className="text-white font-semibold text-sm px-5 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent-hover)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent)'}
            >
              <CalendarDays size={16} /> Register
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-heading)' }}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-[480px]' : 'max-h-0'}`}
        style={{ backgroundColor: 'var(--color-nav-bg)', borderTop: '1px solid var(--color-border)' }}
      >
        <div className="px-4 pb-5 pt-2 flex flex-col gap-1">
          {navLinks.map(link => (
            link.to.startsWith('/#') ? (
              <button
                key={link.label}
                onClick={() => { handleAnchorClick(link.to); setOpen(false); }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors"
                style={{ color: 'var(--color-heading)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-hover-10)'; e.currentTarget.style.color = 'var(--color-accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-heading)'; }}
              >
                {link.label}
              </button>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={({ isActive }) => isActive
                  ? { color: 'var(--color-accent)', backgroundColor: 'var(--color-accent-10)' }
                  : { color: 'var(--color-heading)' }}
              >
                {link.label}
              </NavLink>
            )
          ))}
          <div className="flex items-center gap-2 px-1">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => { openCalendly(); setOpen(false); }}
            className="w-full text-sm font-semibold px-4 py-3 rounded-lg border text-center transition-colors inline-flex justify-center items-center gap-2"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-heading)',
            }}
          >
            <PhoneCall size={16} /> Book a Call
          </button>
          {/* Register Button — opens AWS Events Builder modal */}
          <button
            type="button"
            onClick={() => { openRegister(); setOpen(false); }}
            className="w-full mt-1 text-white font-semibold px-6 py-3 rounded-lg text-center text-sm transition-all inline-flex justify-center items-center gap-2"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            <CalendarDays size={16} /> Register
          </button>
        </div>
      </div>
    </nav>
  );
}
