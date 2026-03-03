import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone } from 'lucide-react';

const LAST_UPDATED = 'March 2, 2026';

interface Section {
  id: string;
  title: string;
  content: string | string[];
}

const sections: Section[] = [
  {
    id: 'overview',
    title: '1. Overview',
    content: [
      'CISOevents ("we", "our", or "us") is operated by Neptune Media LLC, a Wyoming-registered company. We respect the privacy of every attendee, speaker, sponsor, and visitor who interacts with our platform.',
      'This Privacy Policy explains how we handle information in connection with our event discovery website, located at cisoevents.com. By using our site, you agree to the terms described here.',
      'Bottom line: we do not collect, store, or sell your personal data through cisoevents.com. Event registration is handled entirely by Luma Events, and their privacy policy governs any personal data you submit to register.',
    ],
  },
  {
    id: 'data-we-collect',
    title: '2. Information We Do — and Do Not — Collect',
    content: [
      'CISOevents.com is a front-end event discovery and information website. We do NOT operate any database that stores visitor personal data.',
      'We do not capture or retain: name, email address, phone number, IP address logs, cookies for tracking, payment information, or any form submission data.',
      "The only information transmitted during your visit is your contact form submission (if you use the 'Contact Us' feature), which is forwarded directly to our team by email via Resend's transactional email service and is not stored in any database.",
    ],
  },
  {
    id: 'luma',
    title: '3. Event Registration via Luma',
    content: [
      'All event registrations are processed through Luma Events (lu.ma). When you click "Register" or "Get Tickets," you are redirected to Luma\'s platform.',
      'Any personal information you provide during registration — including your name, email, payment details, and attendance preferences — is collected and stored exclusively by Luma. We encourage you to review Luma\'s Privacy Policy at https://lu.ma/privacy before registering.',
      'CISOevents does not have access to your Luma registration data, and we do not receive your payment information.',
    ],
  },
  {
    id: 'cookies',
    title: '4. Cookies & Analytics',
    content: [
      'Our website does not currently use any third-party analytics platforms (e.g., Google Analytics), advertising networks, or tracking cookies.',
      'We may store minimal data in your browser\'s localStorage to cache public event listing data from Luma\'s public API for a faster experience. This data contains only public event details (event titles, dates, locations) and no personal information. It is automatically cleared after 10 minutes.',
      'We do not serve any targeted advertising, retargeting pixels, or behavioral tracking scripts.',
    ],
  },
  {
    id: 'third-party',
    title: '5. Third-Party Services',
    content: [
      'Our website may contain links to third-party services, including but not limited to: Luma Events (event registration), YouTube / Horizon Summit (event recordings), LinkedIn, X (Twitter), TikTok, Facebook, Instagram, and WhatsApp. Following these links takes you outside of cisoevents.com, and their own privacy policies apply.',
      'We embed YouTube videos from our channel (@horizonsummit). YouTube is operated by Google LLC, and their privacy policy applies when you play embedded videos.',
    ],
  },
  {
    id: 'children',
    title: '6. Children\'s Privacy',
    content: 'Our events and website are intended for business professionals and are not directed at individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has submitted information to us, please contact us and we will promptly address it.',
  },
  {
    id: 'security',
    title: '7. Security',
    content: 'Because we do not collect or store personal data, the risk of a personal data breach from our site is minimal. All data transmissions between your browser and cisoevents.com are encrypted via HTTPS/TLS.',
  },
  {
    id: 'changes',
    title: '8. Changes to This Policy',
    content: 'We may update this Privacy Policy as our services evolve. When we do, we will update the "Last Updated" date at the top of this page. Continued use of our website after any changes constitutes your acceptance of the revised policy.',
  },
  {
    id: 'contact',
    title: '9. Contact Us',
    content: 'If you have any questions or concerns about this Privacy Policy or how your information is handled, please reach out to us:',
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="pt-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero */}
      <div
        className="py-16"
        style={{
          background: 'linear-gradient(135deg, var(--color-dark-bg) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,168,255,0.15)' }}
            >
              <ShieldCheck size={24} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--color-heading)' }}>
                Privacy Policy
              </h1>
            </div>
          </div>
          <p className="text-sm mt-4 pl-1" style={{ color: 'var(--color-text-dim)' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-1">
            <div
              className="sticky top-24 rounded-2xl p-5"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-accent)' }}>
                Contents
              </p>
              <ul className="space-y-2">
                {sections.map(s => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-xs transition-colors hover:text-blue-500"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main body */}
          <main className="lg:col-span-3 space-y-10">
            {/* Intro callout */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'rgba(0,168,255,0.08)', border: '1px solid rgba(0,168,255,0.2)' }}
            >
              <p className="font-semibold mb-1" style={{ color: 'var(--color-accent)' }}>Our commitment to your privacy</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                CISOevents does not collect or store personal data on this website. Event registrations are handled
                solely by <a href="https://lu.ma/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">Luma Events</a>.
                We believe in radical transparency about how we operate.
              </p>
            </div>

            {sections.map(s => (
              <section key={s.id} id={s.id}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-heading)' }}>
                  {s.title}
                </h2>
                {s.id === 'contact' ? (
                  <>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-body)' }}>
                      {s.content as string}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,168,255,0.12)' }}>
                          <Mail size={15} style={{ color: 'var(--color-accent)' }} />
                        </div>
                        <a
                          href="mailto:charlesp@cisoevents.com"
                          className="text-sm font-medium hover:text-blue-400 transition-colors"
                          style={{ color: 'var(--color-heading)' }}
                        >
                          charlesp@cisoevents.com
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,168,255,0.12)' }}>
                          <Phone size={15} style={{ color: 'var(--color-accent)' }} />
                        </div>
                        <a
                          href="tel:+13212362561"
                          className="text-sm font-medium hover:text-blue-400 transition-colors"
                          style={{ color: 'var(--color-heading)' }}
                        >
                          +1 (321) 236-2561
                        </a>
                      </div>
                      <div
                        className="mt-4 p-4 rounded-xl text-sm"
                        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                      >
                        <strong style={{ color: 'var(--color-heading)' }}>Neptune Media LLC</strong><br />
                        Wyoming 82801, USA
                      </div>
                    </div>
                  </>
                ) : Array.isArray(s.content) ? (
                  <div className="space-y-4">
                    {s.content.map((para, i) => (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
                    {s.content}
                  </p>
                )}
              </section>
            ))}

            <div
              className="pt-8 border-t flex flex-wrap items-center gap-4 text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-dim)' }}
            >
              <Link to="/" className="hover:text-blue-400 transition-colors">← Back to Home</Link>
              <span>·</span>
              <Link to="/events" className="hover:text-blue-400 transition-colors">View Events</Link>
              <span>·</span>
              <a href="https://lu.ma/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                Luma Privacy Policy ↗
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
