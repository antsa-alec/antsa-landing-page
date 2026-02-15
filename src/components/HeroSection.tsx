import { useEffect, useState } from 'react';
import { Typography, Button, Space } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import antsaLogo from '../assets/antsa-logo.png';

const { Title, Paragraph } = Typography;

interface HeroContent {
  badge?: string;
  title?: string;
  title_highlights?: string;
  description?: string;
  cta_primary?: string;
  cta_primary_url?: string;
  cta_secondary?: string;
  cta_secondary_url?: string;
}

/**
 * Renders text with highlighted phrases in brand gradient
 */
const HighlightedText = ({ text, highlights }: { text: string; highlights: string[] }) => {
  if (!highlights || highlights.length === 0) {
    return <>{text}</>;
  }

  // Build regex to match any highlight phrase
  const escapedHighlights = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
        if (isHighlight) {
          return (
            <span
              key={i}
              style={{
                background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

/**
 * HERO SECTION - Modern Clean Design with brand gradient background
 */
const HeroSection = () => {
  const [content, setContent] = useState<HeroContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/hero')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setContent(data.content);
        }
      })
      .catch((err) => console.error('Failed to load hero content:', err))
      .finally(() => setLoading(false));
  }, []);

  const titleText = content.title || 'Keeping mental health practitioners in the loop when care happens between sessions.';
  const titleHighlights: string[] = content.title_highlights
    ? (typeof content.title_highlights === 'string' ? JSON.parse(content.title_highlights) : content.title_highlights)
    : ['in the loop', 'between sessions'];
  const descriptionRaw = content.description || 'ANTSA is an Australian-built digital mental health system designed to support safe, supervised care between appointments. ANTSA brings AI within clinical governance, records, and duty-of-care frameworks, rather than leaving clients to use unregulated tools on their own.';
  const ctaPrimary = content.cta_primary || 'Start Your Free Trial';
  const ctaPrimaryUrl = content.cta_primary_url || 'https://au.antsa.ai/sign-in';
  const ctaSecondary = content.cta_secondary || 'Book a Demo';
  const ctaSecondaryUrl = content.cta_secondary_url || 'mailto:admin@antsa.com.au?subject=Book%20a%20Demo%20-%20ANTSA&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20book%20a%20demo%20of%20the%20ANTSA%20platform.%0A%0APlease%20let%20me%20know%20your%20available%20times.%0A%0AThanks!';

  if (loading) {
    return null;
  }

  return (
    <section
      id="hero"
      style={{
        background: 'linear-gradient(160deg, #e0effe 0%, #f0f4ff 30%, #ffffff 60%, #f5f0ff 100%)',
        padding: '160px 20px 120px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Subtle decorative gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(72, 171, 226, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(72, 171, 226, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ANTSA Logo */}
        <div
          className="reveal"
          style={{
            marginBottom: '48px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img 
            src={antsaLogo} 
            alt="ANTSA for Professionals" 
            style={{
              maxWidth: '500px',
              width: '100%',
              height: 'auto',
            }}
          />
        </div>

        {/* Main Title with Highlighted Phrases */}
        <Title
          level={1}
          className="reveal"
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '32px',
            color: '#0f172a',
            letterSpacing: '-0.02em',
            maxWidth: '950px',
            margin: '0 auto 32px',
          }}
        >
          <HighlightedText text={titleText} highlights={titleHighlights} />
        </Title>

        {/* Description */}
        <Paragraph
          className="reveal"
          style={{
            fontSize: 'clamp(16px, 2.5vw, 19px)',
            color: '#475569',
            marginBottom: '48px',
            maxWidth: '850px',
            margin: '0 auto 48px',
            lineHeight: 1.75,
          }}
        >
          {descriptionRaw}
        </Paragraph>

        {/* CTA Buttons */}
        <Space
          className="reveal"
          size="large"
          wrap
          style={{ justifyContent: 'center', marginBottom: '64px' }}
        >
          <Button
            type="primary"
            size="large"
            style={{
              height: '64px',
              padding: '0 48px',
              fontSize: '18px',
              fontWeight: 600,
              borderRadius: '12px',
              background: '#0f172a',
              border: 'none',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.3)',
            }}
            href={ctaPrimaryUrl}
          >
            {ctaPrimary}
          </Button>
          <Button
            size="large"
            icon={<MailOutlined />}
            style={{
              height: '64px',
              padding: '0 48px',
              fontSize: '18px',
              fontWeight: 600,
              borderRadius: '12px',
              background: '#ffffff',
              border: '2px solid #e2e8f0',
              color: '#0f172a',
            }}
            href={ctaSecondaryUrl}
          >
            {ctaSecondary}
          </Button>
        </Space>
      </div>
    </section>
  );
};

export default HeroSection;
