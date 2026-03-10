import { useState } from 'react';
import { Calendar, Phone, Mail, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || 'https://backend-website-mu.vercel.app';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const { openCalendly } = useApp();

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
    <>
      {/* Page Hero */}
      <section
        className="py-16 sm:py-20"
        style={{
          backgroundColor: 'var(--color-bg-alt)',
          backgroundImage:
            'linear-gradient(135deg, var(--page-hero-c1) 0%, var(--page-hero-c2) 55%, var(--page-hero-c3) 100%), url(https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)' }}>
            Reach Out
          </p>
          <h1 className="section-title mb-4">Contact Us</h1>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Have questions about CISOevents? Interested in attending, speaking, or partnering?
            Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left — info */}
            <div>
              <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--color-accent)' }}>Get in Touch</p>
              <h2 className="section-title mb-4">We'd Love to Hear From You</h2>
              <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--color-text-muted)' }}>
                Have questions about CISOevents? Interested in attending?
                Reach out and our team will get back to you shortly.
              </p>

              {/* Calendly — Book a Call */}
              <button
                type="button"
                onClick={openCalendly}
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 mb-8"
                style={{
                  borderColor: 'var(--color-accent)',
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-5)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent-5)';
                  e.currentTarget.style.color = 'var(--color-accent)';
                }}
              >
                <Calendar size={18} /> Book a Call
              </button>

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

    </>
  );
}
