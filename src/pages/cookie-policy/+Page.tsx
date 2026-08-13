import type { CSSProperties } from 'react';
import { AUDIT_SCOPE, TRACKER_REGISTER } from '../../privacy/tracker-register';

const cell: CSSProperties = { padding: 12, border: '1px solid #DCE5EE', textAlign: 'left', verticalAlign: 'top' };

export default function Page() {
  return (
    <section style={{ padding: '72px 20px', maxWidth: 1120, margin: '0 auto', width: '100%', color: '#0F1622' }}>
      <a href="/" style={{ color: '#2E96D4', fontWeight: 700, textDecoration: 'none' }}>← Back to home</a>
      <h1 style={{ margin: '30px 0 10px', fontSize: 'clamp(32px, 5vw, 46px)' }}>Cookie and tracking policy</h1>
      <p style={{ color: '#5B6472', marginBottom: 30 }}>Live register last audited: 13 August 2026 · Register version 2026-08-13.1</p>

      <h2>How consent works</h2>
      <p style={{ lineHeight: 1.7, color: '#475569' }}>
        Optional tracking is off by default. We load the Google Analytics tracking tag only after you actively accept
        Analytics. Doing nothing or continuing to browse is not consent. You can reject all categories or withdraw
        consent from the persistent privacy control on every page. Refusal is remembered and the banner is not shown
        again for 12 months. Advertising and optional functional categories are available as separate choices, but no
        technologies in those categories are currently installed.
      </p>

      <h2 style={{ marginTop: 34 }}>Cross-platform review status</h2>
      <ul style={{ lineHeight: 1.7, color: '#475569' }}>
        {AUDIT_SCOPE.map((item) => <li key={item.platform}><strong>{item.platform}:</strong> {item.result}</li>)}
      </ul>

      <h2 style={{ marginTop: 34 }}>Marketing-site technology register</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 900, fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#EEF4FB' }}>
              {['Platform', 'Name / technology', 'Purpose', 'Provider and recipients', 'Duration', 'Category', 'When loaded'].map((heading) => (
                <th key={heading} style={cell}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRACKER_REGISTER.map((entry) => (
              <tr key={entry.id}>
                <td style={cell}>{entry.platform}</td>
                <td style={cell}><strong>{entry.technology}</strong><br />{entry.storage}</td>
                <td style={cell}>{entry.purpose}</td>
                <td style={cell}>{entry.provider}<br />Recipients: {entry.recipients}</td>
                <td style={cell}>{entry.duration}</td>
                <td style={{ ...cell, textTransform: 'capitalize' }}>{entry.category}</td>
                <td style={cell}>{entry.trigger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 34 }}>Contact and collection notice</h2>
      <p style={{ lineHeight: 1.7, color: '#475569' }}>
        ANTSA Pty Ltd is the data controller for marketing-site usage data. With Analytics consent, Google receives
        device, browser and page-usage information so ANTSA can measure aggregate site use. Analytics is not required
        to use the site. To access or correct information, complain, or ask about this register, email{' '}
        <a href="mailto:help@antsa.ai">help@antsa.ai</a>. More detail is available in our{' '}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>
    </section>
  );
}
