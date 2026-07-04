import { Fragment, type ReactNode } from 'react';

/**
 * WHY BETWEEN-SESSION — "The hardest moments happen between appointments"
 *
 * A four-step horizontal flow (Session → Between-session activity →
 * Clinician visibility → Next session) with small arrow icons between cards.
 * Each card keeps its own top-border accent and colored icon chip.
 */

type Step = {
  title: string;
  caption: string;
  accent: string;
  chipBg: string;
  icon: ReactNode;
};

const steps: Step[] = [
  {
    title: 'Session',
    caption: 'Goals set, skills introduced',
    accent: '#48ABE2',
    chipBg: '#DCE9FB',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 16l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Between-session activity',
    caption: 'Tasks, mood, journalling',
    accent: '#1F9D8B',
    chipBg: '#D6EFEA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: 'Clinician visibility',
    caption: 'You see what is changing',
    accent: '#E0922C',
    chipBg: '#FAEBD3',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'Next session',
    caption: 'Informed and focused',
    accent: '#7C6CE0',
    chipBg: '#E6E2FA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
];

const arrow = (
  <div style={{ display: 'flex', alignItems: 'center', color: '#C2CCDA', flexShrink: 0 }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  </div>
);

export default function WhyItMatters() {
  return (
    <section style={{ background: '#fff', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#2E96D4', marginBottom: 12 }}>
            Why it matters
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 5.2vw, 32px)', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 14px' }}>
            The hardest moments happen <span style={{ color: '#48ABE2' }}>between</span> appointments
          </h2>
          <p style={{ fontSize: 18, lineHeight: '28px', color: '#5B6472', maxWidth: 720, margin: 0 }}>
            ANTSA® helps clinicians stay informed when clients are completing tasks, tracking mood, journalling, using support tools, or becoming disengaged.
          </p>
        </div>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {steps.map((step, i) => (
            <Fragment key={step.title}>
              {i > 0 && arrow}
              <div
                style={{
                  flex: '1 1 200px',
                  minWidth: 168,
                  background: '#fff',
                  border: '1px solid #E6E9EE',
                  borderTop: `3px solid ${step.accent}`,
                  borderRadius: 16,
                  padding: '22px 16px',
                  textAlign: 'center',
                  boxShadow: '0 4px 16px rgba(15,22,34,.04)',
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: step.chipBg,
                    color: step.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{step.title}</div>
                <div style={{ fontSize: 12.5, color: '#5B6472', marginTop: 4, lineHeight: 1.45 }}>{step.caption}</div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
