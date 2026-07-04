import type { CSSProperties, ReactNode } from 'react';

/**
 * HERO — "Mental health care belongs in clinician hands. ANTSA keeps it there."
 *
 * CMS-driven: reads section.content.* (hero section in the SQLite CMS) and falls
 * back to the approved design copy. `title_highlights` wraps matching substrings
 * of the title in the brand blue.
 */

type HeroContent = {
  badge?: string;
  title?: string;
  title_highlights?: string[] | string;
  description?: string;
  subline?: string;
  cta_primary?: string;
  cta_primary_url?: string;
  cta_secondary?: string;
  cta_secondary_url?: string;
  hero_desktop_image?: string;
};

type HeroProps = { section?: { content?: HeroContent } };

const DEFAULTS = {
  badge: 'Award-winning, clinician-governed mental health technology',
  title: 'Mental health care belongs in clinician hands. ANTSA keeps it there.',
  title_highlights: ['Mental health', 'clinician', 'ANTSA'],
  description:
    'ANTSA® helps clinicians reduce admin, support clients between sessions, and keep clinical oversight in one secure Australian platform.',
  subline: 'A tool for your practice, never a replacement for your judgement.',
  cta_primary: 'Book a demo',
  cta_primary_url: 'https://calendly.com/sally-anne-mcc',
  cta_secondary: 'Start free trial',
  cta_secondary_url: 'https://antsa.ai/free-trial',
  hero_desktop_image: '/landing/dashboard.png',
};

const isExternal = (url: string) => /^https?:\/\//i.test(url);
const linkProps = (url: string) =>
  isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

/** Wrap each highlight substring of `title` in a blue span. */
function highlight(title: string, highlights: string[]): ReactNode {
  const clean = highlights.filter(Boolean);
  if (!clean.length) return title;
  const escaped = clean.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'g');
  return title.split(re).map((part, i) =>
    clean.includes(part) ? (
      <span key={i} style={{ color: '#48ABE2' }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}

const trustPoints: { label: string; icon: ReactNode }[] = [
  {
    label: 'Australian hosted',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: 'Clinician-governed',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    label: 'Unlimited clients',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function HeroSplit({ section }: HeroProps) {
  const c = section?.content ?? {};
  const badge = c.badge || DEFAULTS.badge;
  const title = c.title || DEFAULTS.title;
  const rawHl = c.title_highlights ?? DEFAULTS.title_highlights;
  const highlights: string[] = Array.isArray(rawHl)
    ? rawHl
    : (() => {
        try {
          const parsed = JSON.parse(rawHl as string);
          return Array.isArray(parsed) ? parsed : DEFAULTS.title_highlights;
        } catch {
          return DEFAULTS.title_highlights;
        }
      })();
  const description = c.description || DEFAULTS.description;
  const subline = c.subline || DEFAULTS.subline;
  const ctaPrimary = c.cta_primary || DEFAULTS.cta_primary;
  const ctaPrimaryUrl = c.cta_primary_url || DEFAULTS.cta_primary_url;
  const ctaSecondary = c.cta_secondary || DEFAULTS.cta_secondary;
  const ctaSecondaryUrl = c.cta_secondary_url || DEFAULTS.cta_secondary_url;
  const heroImage = c.hero_desktop_image || DEFAULTS.hero_desktop_image;

  const chipStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#5B6472',
    fontWeight: 500,
  };

  return (
    <section id="hero" style={{ background: '#EEF4FB', padding: '74px 0 64px', borderBottom: '1px solid #E6E9EE' }}>
      <div className="dc-container">
        <div className="dc-eyebrow" style={{ marginBottom: 18 }}>{badge}</div>
        <h1
          style={{
            fontSize: 'clamp(30px, 7.5vw, 46px)',
            lineHeight: 1.12,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#0F1622',
            margin: '0 0 28px',
            maxWidth: 1000,
          }}
        >
          {highlight(title, highlights)}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 56, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <p style={{ fontSize: 19, lineHeight: 1.6, color: '#5B6472', margin: '0 0 18px', maxWidth: 560 }}>
              {description}
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: '#0F1622', fontWeight: 500, margin: '0 0 32px', maxWidth: 560 }}>
              {subline}
            </p>
            <div style={{ display: 'flex', gap: 14, marginBottom: 32, flexWrap: 'wrap' }}>
              <a className="dc-btn dc-btn-primary" href={ctaPrimaryUrl} {...linkProps(ctaPrimaryUrl)}>
                {ctaPrimary}
              </a>
              <a className="dc-btn dc-btn-secondary" href={ctaSecondaryUrl} {...linkProps(ctaSecondaryUrl)}>
                {ctaSecondary}
              </a>
            </div>
            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap' }}>
              {trustPoints.map((t) => (
                <div key={t.label} style={chipStyle}>
                  <span style={{ color: '#48ABE2', display: 'inline-flex' }}>{t.icon}</span> {t.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 18px 48px rgba(15,22,34,.14)', border: '1px solid #E6E9EE' }}>
              <img
                src={heroImage}
                alt="A clinician and client connected through ANTSA between sessions"
                width={1440}
                height={900}
                loading="eager"
                decoding="async"
                {...({ fetchpriority: 'high' } as Record<string, string>)}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
