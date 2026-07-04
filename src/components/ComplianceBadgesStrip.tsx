import type { CSSProperties, ReactNode } from 'react';

/**
 * COMPLIANCE BADGES — slim strip of trust marks above the footer.
 *
 * The approved design used three <img> badge graphics (GDPR / Australian
 * Privacy Principles / HIPAA). Those asset files do not exist, so each badge is
 * rendered as a large rounded blue chip containing an inline SVG icon, with a
 * bold title and caption beneath it.
 *
 * Accepts an optional `section` prop purely for backward compatibility with the
 * CMS-driven page renderer; the value is ignored and the three fixed badges are
 * always shown.
 */

type ComplianceProps = { section?: { content?: { badges?: unknown } } };

const badges: { title: string; caption: string; icon: ReactNode }[] = [
  {
    title: 'GDPR',
    caption: 'European data protection standards',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <rect x="9" y="11" width="6" height="5" rx="1" />
        <path d="M10 11V9.5a2 2 0 0 1 4 0V11" />
      </svg>
    ),
  },
  {
    title: 'Australian Privacy Principles',
    caption: 'Hosted on Australian servers',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'HIPAA',
    caption: 'US healthcare data protection',
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="12" y1="8" x2="12" y2="14" />
        <line x1="9" y1="11" x2="15" y2="11" />
      </svg>
    ),
  },
];

const chipStyle: CSSProperties = {
  width: 96,
  height: 96,
  borderRadius: 20,
  background: '#fff',
  border: '1px solid #E6E9EE',
  boxShadow: '0 12px 28px rgba(15,22,34,.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#48ABE2',
};

export default function ComplianceBadgesStrip(_props: ComplianceProps) {
  return (
    <section id="compliance" style={{ background: '#EEF4FB', borderTop: '1px solid #E6E9EE', padding: '44px 0' }}>
      <div
        className="dc-container"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 56, flexWrap: 'wrap' }}
      >
        {badges.map((badge) => (
          <div
            key={badge.title}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}
          >
            <div style={chipStyle}>{badge.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F1622' }}>{badge.title}</div>
            <div style={{ fontSize: 13, color: '#5B6472' }}>{badge.caption}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
