/**
 * GOVERNANCE — "ANTSAbot is assigned, overseen and governed by the clinician"
 *
 * Dark section: left column carries the clinical-governance copy, right column
 * is a stack of four checklist rows on dark cards.
 */

const CHECKLIST = [
  'Assigned by the practitioner',
  'Part of the clinical record',
  'Reviewable and adjustable by you',
  'Never a replacement for clinical judgement',
];

export default function Governance() {
  return (
    <section id="governance" style={{ background: '#0F1622', padding: '80px 0', color: '#fff' }}>
      <div
        className="dc-container"
        style={{ display: 'flex', gap: 56, alignItems: 'center', flexWrap: 'wrap' }}
      >
        <div style={{ flex: 1, minWidth: 320 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '.04em',
              textTransform: 'uppercase',
              color: '#8B95A3',
              marginBottom: 14,
            }}
          >
            Built for clinical governance
          </div>
          <h2
            style={{
              fontSize: 30,
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              margin: '0 0 18px',
            }}
          >
            ANTSAbot is assigned, overseen and governed by the clinician
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: '#B7C0CD', margin: '0 0 16px', maxWidth: 540 }}>
            ANTSA® does not provide independent AI therapy. ANTSAbot operates within a clinician-governed
            platform, where you decide if it is appropriate, assign it to the client, and review its use.
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: '#8B95A3',
              margin: 0,
              maxWidth: 540,
              fontStyle: 'italic',
            }}
          >
            It supports reflection, psychoeducation and engagement between sessions. It does not diagnose,
            replace therapy, provide treatment plans, give independent clinical advice or operate as a crisis
            service.
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {CHECKLIST.map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#1A2433',
                border: '1px solid #2A3647',
                borderRadius: 14,
                padding: '18px 20px',
              }}
            >
              <span style={{ color: '#7FB6F0' }}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span style={{ fontSize: 16, fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
