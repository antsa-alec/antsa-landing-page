import type { CSSProperties } from 'react';

/**
 * FOR CLINICS & ENTERPRISES — CTA band.
 *
 * Left column: bank icon, heading, description + a 2-col checklist of enterprise
 * capabilities. Right column: a "Talk to us" outline button (mailto).
 */

const checklist = [
  'Role-based access',
  'Advanced reporting',
  'Integrations & API access',
  'Dedicated onboarding',
];

const liStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  fontSize: 15,
  fontWeight: 500,
  color: '#22272F',
  alignItems: 'center',
};

export default function ClinicsCTA() {
  return (
    <section id="contact" style={{ background: '#EAF2FB', padding: '60px 0', borderTop: '1px solid #DCE6F2' }}>
      <div className="dc-container" style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ color: '#48ABE2', marginBottom: 16 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="22" x2="21" y2="22" />
              <line x1="6" y1="18" x2="6" y2="11" />
              <line x1="10" y1="18" x2="10" y2="11" />
              <line x1="14" y1="18" x2="14" y2="11" />
              <line x1="18" y1="18" x2="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: 'clamp(23px, 5.2vw, 30px)', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 18px' }}>
            For clinics &amp; enterprises
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#5B6472', margin: 0, maxWidth: 340, flexShrink: 0 }}>
              Need multi-practitioner access, reporting, integrations or enterprise rollout?<br />
              ANTSA® scales with your organisation.
            </p>
            <ul className="dc-grid-2" style={{ listStyle: 'none', margin: 0, padding: 0, gap: '14px 20px', flex: 1, minWidth: 280 }}>
              {checklist.map((item) => (
                <li key={item} style={liStyle}>
                  <span style={{ color: '#48ABE2', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>{' '}
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ flexShrink: 0, alignSelf: 'center' }}>
          <a className="dc-btn dc-btn-outline" href="mailto:admin@antsa.com.au">
            Talk to us
          </a>
        </div>
      </div>
    </section>
  );
}
