import type { ReactNode } from 'react';

/**
 * ANTSABOT — "ANTSAbot (optional AI - clinical oversight built in)"
 *
 * Static section: a screenshot on the left and four feature rows on the right,
 * each with a colored icon chip, plus an italic clinical disclaimer.
 */

const features: { chipBg: string; iconColor: string; label: string; icon: ReactNode }[] = [
  {
    chipBg: '#DCE9FB',
    iconColor: '#48ABE2',
    label: 'Supports reflection and psychoeducation',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    chipBg: '#D6EFEA',
    iconColor: '#1F9D8B',
    label: 'Used between sessions',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    chipBg: '#E6E2FA',
    iconColor: '#7C6CE0',
    label: 'Reviewable by the clinician',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    chipBg: '#FAEBD3',
    iconColor: '#E0922C',
    label: 'Can be turned off at any time',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="5" width="22" height="14" rx="7" />
        <circle cx="8" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function AntsaBot() {
  return (
    <section id="antsabot" style={{ background: '#F3F7FC', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#2E96D4', marginBottom: 12 }}>
            ANTSAbot
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 5.2vw, 32px)', lineHeight: 1.25, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 14px' }}>
            ANTSAbot <span style={{ color: '#5B6472', fontWeight: 500, fontSize: 22 }}>(optional AI - clinical oversight built in)</span>
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#5B6472', maxWidth: 640, margin: 0 }}>
            Your clients are already using AI.<br />
            <strong style={{ color: '#0F1622', fontWeight: 600 }}>ANTSAbot is the one their clinician assigns and reviews.</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1.3, minWidth: 300 }}>
            <img
              src="/landing/client-detail-overview.png"
              alt="How clinical oversight works with ANTSAbot"
              width={1440}
              height={900}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: 'auto', borderRadius: 16, border: '1px solid #E6E9EE', boxShadow: '0 8px 28px rgba(15,22,34,.06)', display: 'block' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {features.map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid #E6E9EE', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: f.chipBg, color: f.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#22272F' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#8B95A3', margin: '36px 0 0', fontStyle: 'italic' }}>
          Not independent therapy. Not a crisis service. Never a replacement for clinical judgement.
        </p>
      </div>
    </section>
  );
}
