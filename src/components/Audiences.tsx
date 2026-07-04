import type { CSSProperties, ReactNode } from 'react';

/**
 * AUDIENCES — "Support that fits how you work"
 *
 * Three static cards (clinicians / clinics & organisations / clients), each with a
 * coloured icon chip, title, description and a check-list. The first card keeps the
 * `id="clinicians"` anchor target used by the nav.
 */

type Audience = {
  id?: string;
  chipBg: string;
  accent: string;
  icon: ReactNode;
  title: string;
  description: string;
  items: string[];
};

const check = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const audiences: Audience[] = [
  {
    id: 'clinicians',
    chipBg: '#DCE9FB',
    accent: '#48ABE2',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
    title: 'For clinicians',
    description:
      'Deliver between-session care in a structured, visible way, without increasing your admin load.',
    items: [
      'Reduce documentation time',
      'Keep homework and resources in one place',
      'See mood trends and engagement',
      'Use AI within a governance framework',
    ],
  },
  {
    chipBg: '#D6EFEA',
    accent: '#1F9D8B',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <line x1="9" y1="9" x2="9" y2="9.01" />
        <line x1="9" y1="13" x2="9" y2="13.01" />
      </svg>
    ),
    title: 'For clinics & organisations',
    description:
      'A scalable platform for clinically governed digital mental health support across teams.',
    items: [
      'Consistent workflows across teams',
      'Australian-hosted and privacy-aligned',
      'Support for governance and risk mitigation',
      'Reduce multiple subscriptions',
    ],
  },
  {
    chipBg: '#FAEBD3',
    accent: '#E0922C',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
      </svg>
    ),
    title: 'For clients',
    description:
      'Support between appointments, guided by your clinician, never a replacement for them.',
    items: [
      'Tasks, journalling and mood tracking',
      'Resources chosen by your clinician',
      'Your clinician decides which tools fit',
      'Not a crisis or emergency service',
    ],
  },
];

const cardStyle: CSSProperties = {
  background: '#fff',
  border: '1px solid #E6E9EE',
  borderRadius: 18,
  padding: 30,
  boxShadow: '0 4px 16px rgba(15,22,34,.04)',
};

export default function Audiences() {
  return (
    <section id="audiences" style={{ background: '#F3F7FC', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#2E96D4', marginBottom: 12 }}>
            Who ANTSA is for
          </div>
          <h2 style={{ fontSize: 32, lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
            <span style={{ color: '#48ABE2' }}>Support</span> that fits how <span style={{ color: '#48ABE2' }}>you</span> work
          </h2>
        </div>
        <div className="dc-grid-3" style={{ gap: 20, alignItems: 'start' }}>
          {audiences.map((a) => (
            <div key={a.title} id={a.id} style={cardStyle}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: a.chipBg,
                  color: a.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                }}
              >
                {a.icon}
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: '0 0 8px' }}>{a.title}</h3>
              <p style={{ fontSize: 15, color: '#5B6472', lineHeight: 1.55, margin: '0 0 18px' }}>{a.description}</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {a.items.map((item) => (
                  <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#22272F' }}>
                    <span style={{ color: a.accent, flexShrink: 0 }}>{check}</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
