import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';
import logo from '../assets/CISOevents-Logo-R2.png';

const navLinks = [
  { label: 'Events',   to: '/events' },
  { label: 'Speakers', to: '/speakers' },
  { label: 'About',    to: '/about' },
  { label: 'Gallery',  to: '/gallery' },
  { label: 'Contact',  to: '/#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — colorful, no filter */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="CISOevents" className="h-9 w-auto" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              link.to.startsWith('/#') ? (
                <button
                  key={link.label}
                  onClick={() => handleAnchorClick(link.to)}
                  className="px-4 py-2 font-medium text-sm rounded-lg transition-colors text-[#1F2D3C] hover:text-blue-600 hover:bg-blue-50"
                >
                  {link.label}
                </button>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-[#1F2D3C] hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            ))}
          </div>

          {/* Desktop right CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {/* Admin — subtle icon link */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              title="Admin Panel"
            >
              <ShieldCheck size={15} />
              <span className="hidden lg:inline">Admin</span>
            </Link>

            {/* Luma Register Button */}
            <button
              className="luma-checkout--button text-white font-semibold text-sm px-5 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              type="button"
              data-luma-action="checkout"
              data-luma-event-id="iuutm274"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent-hover)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-accent)'}
            >
              Register Now
            </button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-[480px]' : 'max-h-0'}`}
        style={{ backgroundColor: 'rgba(255,255,255,0.98)', borderTop: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="px-4 pb-5 pt-2 flex flex-col gap-1">
          {navLinks.map(link => (
            link.to.startsWith('/#') ? (
              <button
                key={link.label}
                onClick={() => { handleAnchorClick(link.to); setOpen(false); }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-left text-[#1F2D3C] hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-[#1F2D3C] hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          ))}
          <Link
            to="/admin"
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ShieldCheck size={16} /> Admin Panel
          </Link>
          <button
            className="luma-checkout--button w-full mt-1 text-white font-semibold px-6 py-3 rounded-lg text-center text-sm transition-all"
            type="button"
            data-luma-action="checkout"
            data-luma-event-id="iuutm274"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            Register Now
          </button>
        </div>
      </div>
    </nav>
  );
}
