import type { CSSProperties, ReactNode } from 'react';

/**
 * SECURITY — "Trusted with sensitive clinical information"
 *
 * Eight small trust cards in a responsive 4-up grid. The final card ("ISO 27001")
 * carries an absolutely-positioned "In progress" pill (card keeps position:relative).
 */

type SecurityCard = {
  title: string;
  description: string;
  icon: ReactNode;
  pill?: string;
};

const cards: SecurityCard[] = [
  {
    title: 'Australian hosting',
    description: 'Data stored on Australian servers.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: 'Encryption',
    description: 'Encrypted storage and transfer.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'Two-factor authentication',
    description: 'Extra protection for accounts.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Self-contained platform',
    description: 'ANTSA® is designed to keep client information secure within a controlled clinical platform.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Practitioner oversight',
    description: 'Clinicians govern tool use.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-9" />
        <path d="M14 17H5" />
        <circle cx="17" cy="17" r="3" />
        <circle cx="7" cy="7" r="3" />
      </svg>
    ),
  },
  {
    title: 'Not used to train AI',
    description: 'Client data is not used to train models.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 7 17l-5-5" />
        <path d="m22 10-7.5 7.5L13 16" />
      </svg>
    ),
  },
  {
    title: 'APP, HIPAA & GDPR aligned',
    description: 'Aligned with leading privacy frameworks.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: 'ISO 27001',
    description: 'Certification currently in progress.',
    pill: 'In progress',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
];

export default function Security() {
  const cardStyle: CSSProperties = {
    background: '#F3F7FC',
    border: '1px solid #E6E9EE',
    borderRadius: 16,
    padding: 22,
  };

  return (
    <section id="security" style={{ background: '#fff', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#2E96D4', marginBottom: 12 }}>
            Security &amp; governance
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 5.2vw, 32px)', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 14px' }}>
            Trusted with sensitive clinical information
          </h2>
          <p style={{ fontSize: 18, lineHeight: '28px', color: '#5B6472', maxWidth: 640, margin: 0 }}>
            Built for health professionals, with privacy and oversight designed in from the start.
          </p>
        </div>
        <div className="dc-grid-4" style={{ gap: 16 }}>
          {cards.map((card) => (
            <div key={card.title} style={card.pill ? { ...cardStyle, position: 'relative' } : cardStyle}>
              {card.pill && (
                <span
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: '#FAEBD3',
                    color: '#9A6A12',
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 999,
                  }}
                >
                  {card.pill}
                </span>
              )}
              <div style={{ color: '#48ABE2', marginBottom: 12 }}>{card.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{card.title}</div>
              <p style={{ fontSize: 13, color: '#5B6472', margin: 0, lineHeight: 1.45 }}>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
