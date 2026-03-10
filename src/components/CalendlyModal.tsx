import { useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CalendlyModal() {
  const { calendlyOpen, closeCalendly } = useApp();

  // Close on Escape key
  useEffect(() => {
    if (!calendlyOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCalendly(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [calendlyOpen, closeCalendly]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = calendlyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [calendlyOpen]);

  if (!calendlyOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) closeCalendly(); }}
    >
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Book a Call"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-accent-10)' }}
            >
              <Calendar size={16} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>Book a Call</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Schedule time with the CISOevents team</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCalendly}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--color-hover-10)';
              e.currentTarget.style.color = 'var(--color-heading)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Calendly iframe */}
        <div className="h-[72vh] min-h-[480px]">
          <iframe
            src="https://calendly.com/cisoevents?hide_gdpr_banner=1"
            title="Book a Call — CISOevents"
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t flex justify-end"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            type="button"
            onClick={closeCalendly}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-dark-bg)', color: 'var(--color-text)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-darker-bg)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-dark-bg)'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
