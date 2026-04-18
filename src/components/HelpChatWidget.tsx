import { useState } from 'react';
import { Button, Input, Typography } from 'antd';
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

/**
 * HELP CHAT WIDGET
 * Floating contact form that sends queries to help@antsa.com.au via backend API.
 * Displays a confirmation to the user after submission.
 */
const HelpChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!messageText.trim()) {
      setError('Please enter your message.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: messageText.trim(),
        }),
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

  const handleReset = () => {
    setSubmitted(false);
    setError('');
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open help chat"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(72, 171, 226, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(72, 171, 226, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(72, 171, 226, 0.4)';
          }}
        >
          <MessageOutlined style={{ fontSize: '26px', color: '#ffffff' }} />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatWidgetSlideIn 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Title
                level={4}
                style={{
                  color: '#ffffff',
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                Need Help?
              </Title>
              <Paragraph
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  margin: 0,
                  fontSize: '13px',
                }}
              >
                Send us a message and we'll get back to you.
              </Paragraph>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close help chat"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <CloseOutlined style={{ fontSize: '14px', color: '#ffffff' }} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircleFilled style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }} />
                <Title
                  level={4}
                  style={{
                    color: '#0f172a',
                    marginBottom: '8px',
                    fontSize: '20px',
                    fontWeight: 700,
                  }}
                >
                  Message Sent!
                </Title>
                <Paragraph style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                  Thank you for reaching out. We've sent a confirmation to your email and our team will respond shortly.
                </Paragraph>
                <Button
                  type="link"
                  onClick={handleReset}
                  style={{ color: '#48abe2', fontWeight: 600 }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    style={{
                      height: '44px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Email
                  </label>
                  <Input
                    placeholder="your@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    style={{
                      height: '44px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: '6px',
                    }}
                  >
                    Message
                  </label>
                  <TextArea
                    placeholder="How can we help?"
                    value={messageText}
                    onChange={(e) => { setMessageText(e.target.value); setError(''); }}
                    rows={4}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                      resize: 'none',
                    }}
                  />
                </div>
                {error && (
                  <div style={{ color: '#ef4444', fontSize: '13px' }}>
                    {error}
                  </div>
                )}
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  loading={loading}
                  onClick={handleSubmit}
                  style={{
                    height: '48px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                  }}
                >
                  Send Message
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes chatWidgetSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default HelpChatWidget;
