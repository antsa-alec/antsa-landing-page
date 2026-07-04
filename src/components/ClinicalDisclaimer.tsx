/**
 * CLINICAL DISCLAIMER — amber band with a warning triangle and italic disclaimer copy.
 *
 * Static section: no CMS, no props. Copy matches the approved design exactly,
 * including the bold "Clinical disclaimer." lead and the "call 000" text.
 */

export default function ClinicalDisclaimer() {
  return (
    <section
      style={{
        background: '#FBF7EE',
        borderTop: '1px solid #EFE6D2',
        borderBottom: '1px solid #EFE6D2',
        padding: '28px 0',
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}
      >
        <span style={{ flexShrink: 0, color: '#B98714', marginTop: 2 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#7A6A45', margin: 0, fontStyle: 'italic' }}>
          <strong style={{ color: '#5E5232', fontStyle: 'italic' }}>Clinical disclaimer.</strong> ANTSA® is a
          digital mental health platform designed to support clinicians and clients. It does not replace
          professional judgement, diagnosis, treatment, crisis care or emergency support. ANTSAbot does not
          provide independent therapy or medical advice. ANTSA® is not a crisis service, if you are in
          immediate danger, call 000 in Australia or contact a crisis support service.
        </p>
      </div>
    </section>
  );
}
