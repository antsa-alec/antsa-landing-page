import type { CSSProperties, ReactNode } from 'react';

/**
 * WHAT ANTSA DOES — "A secure platform for the whole therapy journey"
 *
 * Three cards, each with a distinct top-border accent + colored icon chip:
 * During sessions (blue), Between sessions (teal), Clinical visibility (amber).
 */

type Card = {
  title: string;
  body: string;
  accent: string;
  chipBg: string;
  icon: ReactNode;
};

const cards: Card[] = [
  {
    title: 'During sessions',
    body: 'Less admin. More presence.',
    accent: '#48ABE2',
    chipBg: '#DCE9FB',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: 'Between sessions',
    body: 'Structured support your client can access. That you can see.',
    accent: '#1F9D8B',
    chipBg: '#D6EFEA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6" />
        <path d="M14 3v5h5" />
        <path d="M16 16l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Clinical visibility',
    body: "Clients' between-session activity, at a glance.",
    accent: '#E0922C',
    chipBg: '#FAEBD3',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function WhatAntsaDoes() {
  const chipStyle: CSSProperties = {
    width: 46,
    height: 46,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  };

  return (
    <section id="what" style={{ background: '#F3F7FC', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#2E96D4', marginBottom: 12 }}>
            What ANTSA does
          </div>
          <h2 style={{ fontSize: 32, lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em', margin: 0, maxWidth: 760 }}>
            A secure platform for the <span style={{ color: '#48ABE2' }}>whole therapy journey</span>
          </h2>
        </div>
        <div className="dc-grid-3" style={{ gap: 20 }}>
          {cards.map((card) => (
            <div
              key={card.title}
              style={{
                background: '#fff',
                border: '1px solid #E6E9EE',
                borderTop: `3px solid ${card.accent}`,
                borderRadius: 18,
                padding: 28,
                boxShadow: '0 4px 16px rgba(15,22,34,.04)',
              }}
            >
              <div style={{ ...chipStyle, background: card.chipBg, color: card.accent }}>{card.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{card.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.55, color: '#5B6472', margin: 0 }}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
