import { useEffect } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AWS_REGISTER_URL = 'https://events.builder.aws.com/event/768a0f09-c528-4b97-8e16-21aa32ec533d';

export default function RegisterModal() {
  const { registerOpen, closeRegister } = useApp();

  // Close on Escape key
  useEffect(() => {
    if (!registerOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRegister(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [registerOpen, closeRegister]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = registerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [registerOpen]);

  if (!registerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) closeRegister(); }}
    >
      <div
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Event Registration"
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
              <CalendarDays size={16} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-heading)' }}>Event Registration</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                AI Agents, Identity &amp; Accountability · March 23, 2026 · AWS Builder's Loft, SF
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Open in new tab fallback */}
            <a
              href={AWS_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            >
              Open in new tab ↗
            </a>
            <button
              type="button"
              onClick={closeRegister}
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
        </div>

        {/* Registration iframe */}
        <div className="h-[72vh] min-h-[480px]">
          <iframe
            src={AWS_REGISTER_URL}
            title="Event Registration — CISOevents"
            className="w-full h-full border-0"
            allow="payment"
          />
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t flex justify-end"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <button
            type="button"
            onClick={closeRegister}
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
