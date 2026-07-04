import { useState } from 'react';
import type { ReactNode } from 'react';
import antsaLogo from '../assets/antsa-logo.png';
import type { ChromeData, SocialLink, FooterLink, FooterContent } from '../pages/chrome-data';

/**
 * FOOTER — dark, clinician-governed design. Three columns: brand, Follow us,
 * Stay in the loop (functional newsletter subscribe → /api/content/subscribe).
 * Social + footer links + copyright are CMS-driven via `chrome`.
 */

const DEFAULT_SOCIAL: SocialLink[] = [
  { id: 'ig', platform: 'instagram', url: 'https://www.instagram.com/antsa.app/' },
  { id: 'fb', platform: 'facebook', url: 'https://www.facebook.com/ANTSAforProfessionals' },
  { id: 'li', platform: 'linkedin', url: 'https://www.linkedin.com/company/antsa-mentalhealth' },
  { id: 'em', platform: 'email', url: 'mailto:admin@antsa.com.au' },
];

const DEFAULT_COPYRIGHT =
  'Copyright © ANTSA® Pty Ltd 2026 (ABN: 77 664 161 237) (ACN: 664 161 237) · All rights reserved';

const socialIcon = (platform: string): ReactNode => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case 'facebook':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
  }
};

export default function AppFooter({ chrome }: { chrome?: ChromeData }) {
  const footerContent: FooterContent = chrome?.footer ?? {};
  const social = chrome?.socialLinks?.length ? chrome.socialLinks : DEFAULT_SOCIAL;
  const legalPaths = new Set(['/privacy-policy', '/terms-and-conditions']);
  const extraLinks: FooterLink[] = (chrome?.footerLinks ?? []).filter((l) => !legalPaths.has(l.url));
  const copyright = footerContent.copyright || DEFAULT_COPYRIGHT;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const subscribe = async () => {
    if (!name.trim()) return setError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/content/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        setName('');
        setEmail('');
      } else if (res.status === 409) {
        setError('This email is already subscribed.');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 42,
    borderRadius: 10,
    background: '#1A2433',
    border: '1px solid #2A3647',
    color: '#fff',
    fontSize: 14,
    padding: '0 14px',
    outline: 'none',
  };

  const legalLinkStyle: React.CSSProperties = { color: '#B7C0CD', transition: 'color .2s ease' };

  return (
    <footer style={{ background: '#0F1622', padding: '56px 0 0', color: '#fff' }}>
      <div className="dc-container">
        <div className="dc-footer-grid" style={{ display: 'grid', gap: 48, paddingBottom: 44, alignItems: 'start' }}>
          {/* Brand */}
          <div>
            <img
              src={antsaLogo}
              alt="ANTSA for professionals"
              style={{ height: 40, marginBottom: 18, filter: 'brightness(0) invert(1)' }}
            />
            <p style={{ fontSize: 14, color: '#8B95A3', maxWidth: 280, margin: 0 }}>
              Clinician-governed digital mental health support for the whole therapy journey.
            </p>
          </div>

          {/* Explore — crawlable sub-page nav (internal linking + Google sitelinks) */}
          <nav aria-label="Site pages">
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 16px', color: '#8B95A3' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Home', '/'],
                ['Clinical governance', '/governance'],
                ['Free trial', '/free-trial'],
                ['Help centre', '/help'],
                ['Privacy policy', '/privacy-policy'],
                ['Terms & conditions', '/terms-and-conditions'],
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="dc-footer-link" style={{ fontSize: 14 }}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Follow us */}
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', margin: '0 0 16px', color: '#8B95A3' }}>
              Follow us
            </h4>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {social.map((s) => (
                <a
                  key={s.id ?? s.platform}
                  href={s.url}
                  {...(s.platform.toLowerCase() === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  aria-label={s.platform}
                  className="dc-social"
                  style={{ width: 42, height: 42, borderRadius: 999, background: '#1A2433', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C3CBD6' }}
                >
                  {socialIcon(s.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Stay in the loop */}
          <div>
            <h4 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>Stay in the loop</h4>
            <p style={{ fontSize: 14, color: '#8B95A3', margin: '0 0 16px' }}>
              The mental health AI space is moving fast. Stay up-to-date with our newsletter.
            </p>
            {done ? (
              <div style={{ fontSize: 14, color: '#7FB6F0' }}>You&apos;re subscribed — thank you!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  style={inputStyle}
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                />
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') subscribe(); }}
                />
                {error && <div style={{ color: '#ef6b6b', fontSize: 13 }}>{error}</div>}
                <button
                  type="button"
                  onClick={subscribe}
                  disabled={loading}
                  className="dc-btn dc-btn-primary"
                  style={{ width: '100%', border: 'none', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Subscribing…' : 'Subscribe'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid #2A3647',
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 13,
            color: '#8B95A3',
          }}
        >
          <div>{copyright}</div>
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
            <a href="/governance" style={legalLinkStyle}>Clinical governance</a>
            <a href="/privacy-policy" style={legalLinkStyle}>Privacy policy</a>
            <a href="/terms-and-conditions" style={legalLinkStyle}>Terms &amp; conditions</a>
            {extraLinks.map((l) => (
              <a
                key={l.id ?? l.url}
                href={l.url}
                {...(l.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                style={legalLinkStyle}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dc-footer-grid { grid-template-columns: 1.6fr 1fr 1fr 1.6fr; }
        @media (max-width: 980px) { .dc-footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 780px) {
          .dc-footer-grid { grid-template-columns: 1fr; text-align: left; }
        }
      `}</style>
    </footer>
  );
}
