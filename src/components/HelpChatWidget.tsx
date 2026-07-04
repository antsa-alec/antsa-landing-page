import { useState } from 'react';

/**
 * HELP CHAT WIDGET — floating contact form → /api/contact. AntD-free (plain
 * HTML + inline SVG) so it doesn't pull AntD onto the marketing critical path.
 * Rendered via <ClientOnly> in +Layout.
 */

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 44,
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  fontSize: 14,
  padding: '0 12px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

const HelpChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return setError('Please enter your name.');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.');
    if (!messageText.trim()) return setError('Please enter your message.');
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: messageText.trim() }),
      });
      if (response.ok) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessageText('');
      } else {
        const data = await response.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const label = (text: string) => (
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>{text}</label>
  );

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open help chat"
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999, width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(72, 171, 226, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {open && (
        <div
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999, width: 380, maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 48px)', background: '#fff', borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'chatWidgetSlideIn 0.3s ease-out',
          }}
        >
          <div style={{ background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ color: '#fff', margin: 0, fontSize: 18, fontWeight: 700 }}>Need help?</h4>
              <p style={{ color: 'rgba(255,255,255,.85)', margin: 0, fontSize: 13 }}>Send us a message and we'll get back to you.</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close help chat"
              style={{ background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ color: '#10b981', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h4 style={{ color: '#0f172a', marginBottom: 8, fontSize: 20, fontWeight: 700 }}>Message sent!</h4>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                  Thank you for reaching out. We've sent a confirmation to your email and our team will respond shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#48abe2', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  {label('Name')}
                  <input placeholder="Your name" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} style={inputStyle} />
                </div>
                <div>
                  {label('Email')}
                  <input placeholder="your@email.com" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} style={inputStyle} />
                </div>
                <div>
                  {label('Message')}
                  <textarea
                    placeholder="How can we help?"
                    value={messageText}
                    onChange={(e) => { setMessageText(e.target.value); setError(''); }}
                    rows={4}
                    style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'none' }}
                  />
                </div>
                {error && <div style={{ color: '#ef4444', fontSize: 13 }}>{error}</div>}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    height: 48, borderRadius: 10, background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                    border: 'none', fontWeight: 600, fontSize: 15, color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1,
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  {loading ? 'Sending…' : 'Send message'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatWidgetSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default HelpChatWidget;
