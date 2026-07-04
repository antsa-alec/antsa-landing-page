import type { CSSProperties } from 'react';

/**
 * COMPARISON — "Most platforms stop at the appointment"
 *
 * Two-column card layout: "Other platforms" (grey X icons) vs. "ANTSA"
 * (blue-bordered card, green check icons). The whole section is gated behind
 * `showComparison` in the design (default true), so it renders unconditionally.
 */

const XIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const CheckIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const otherItems: string[] = [
  'Primarily an AI Scribe',
  'Focused on the appointment itself',
  'Limited visibility between sessions',
  'Separate tools for notes, telehealth, homework and questionnaires',
  'Little insight into what clients are doing between appointments',
];

const antsaItems: string[] = [
  'AI Scribe is only one part of the platform',
  'Supports clinicians in session and clients between sessions',
  'Gives clinicians visibility into engagement, mood and tasks',
  'Keeps notes, telehealth, homework, forms, resources and support in one place',
  'Helps clinicians stay at the centre of care',
];

export default function Comparison() {
  const listStyle: CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  };

  return (
    <section id="compare" style={{ background: '#fff', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#2E96D4', marginBottom: 12 }}>
            More than an AI Scribe
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 5.2vw, 32px)', lineHeight: '40px', fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 14px' }}>
            <span style={{ color: '#48ABE2' }}>Most platforms</span> stop at the appointment
          </h2>
          <p style={{ fontSize: 18, lineHeight: '28px', color: '#5B6472', maxWidth: 660, margin: 0 }}>
            ANTSA® supports the whole mental health care journey, helping clinicians stay connected, and keeping clients engaged.
          </p>
        </div>
        <div className="dc-grid-2" style={{ gap: 20, alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #E6E9EE', borderRadius: 22, padding: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#5B6472' }}>Other platforms</h3>
            <p style={{ fontSize: 14, color: '#8B95A3', margin: '0 0 20px' }}>Built mainly around session notes</p>
            <ul style={listStyle}>
              {otherItems.map((item) => (
                <li key={item} style={{ display: 'flex', gap: 12, fontSize: 15, color: '#5B6472' }}>
                  <span style={{ flexShrink: 0, color: '#AAB2BD', marginTop: 1 }}>{XIcon}</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: '#fff', border: '2px solid #48ABE2', borderRadius: 22, padding: 32, boxShadow: '0 8px 28px rgba(72,171,226,.12)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#0F1622' }}>ANTSA</h3>
            <p style={{ fontSize: 14, color: '#2E96D4', margin: '0 0 20px' }}>Built for clinician-led mental health care</p>
            <ul style={listStyle}>
              {antsaItems.map((item) => (
                <li key={item} style={{ display: 'flex', gap: 12, fontSize: 15, color: '#22272F' }}>
                  <span style={{ flexShrink: 0, color: '#1F9D8B', marginTop: 1 }}>{CheckIcon}</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
