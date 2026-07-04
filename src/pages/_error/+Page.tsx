/**
 * Vike error page — rendered for unmatched routes (404) and render errors (500).
 * Its presence makes Vike return the correct HTTP status instead of the server's
 * blanket 500 fallback. Rendered inside +Layout, so header/footer still show.
 */
export default function ErrorPage() {
  return (
    <section style={{ background: '#EEF4FB', padding: '96px 0', minHeight: '60vh' }}>
      <div className="dc-container" style={{ textAlign: 'center', maxWidth: 640 }}>
        <div className="dc-eyebrow" style={{ marginBottom: 14 }}>Page not found</div>
        <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em', color: '#0F1622', margin: '0 0 16px' }}>
          We couldn&apos;t find that page
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: '#5B6472', margin: '0 auto 32px', maxWidth: 480 }}>
          The link may be broken or the page may have moved. Let&apos;s get you back to safe ground.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="dc-btn dc-btn-primary" href="/">Back to home</a>
          <a className="dc-btn dc-btn-secondary" href="/help">Help centre</a>
        </div>
      </div>
    </section>
  );
}
