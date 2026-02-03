import { useEffect, useState } from 'react';
import { Typography, Button, Space } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface HeroContent {
  badge?: string;
  title?: string;
  description?: string;
  cta_primary?: string;
  cta_secondary?: string;
}

/**
 * HERO SECTION - Modern Clean Design
 * Inspired by modern SaaS landing pages
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

  const description = content.description || 'A comprehensive platform connecting practitioners with clients, built with React, TypeScript, AI-powered features, and modern tools.';
  const ctaPrimary = content.cta_primary || 'Get Started';
  const ctaSecondary = content.cta_secondary || 'Star on GitHub';

  if (loading) {
    return null;
  }

  return (
    <section
      id="hero"
      style={{
        background: '#ffffff',
        padding: '160px 20px 120px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Social/Badge Button */}
        <div
          className="reveal"
          style={{
            marginBottom: '32px',
          }}
        >
          <Button
            style={{
              background: '#1e293b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '30px',
              padding: '10px 28px',
              height: 'auto',
              fontSize: '14px',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(30, 41, 59, 0.3)',
            }}
          >
            <span>🐦</span> Follow @ANTSA on Twitter
          </Button>
        </div>

        {/* Main Title with Gradient Highlight */}
        <Title
          level={1}
          className="reveal"
          style={{
            fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '32px',
            color: '#0f172a',
            letterSpacing: '-0.02em',
            maxWidth: '1000px',
            margin: '0 auto 32px',
          }}
        >
          The perfect{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            mental health platform
          </span>{' '}
          to build and scale your practice with ease.
        </Title>

        {/* Description */}
        <Paragraph
          className="reveal"
          style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#64748b',
            marginBottom: '48px',
            maxWidth: '800px',
            margin: '0 auto 48px',
            lineHeight: 1.7,
          }}
        >
          {description}
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
            href="#features"
          >
            {ctaPrimary}
          </Button>
          <Button
            size="large"
            icon={<GithubOutlined />}
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
          >
            {ctaSecondary}
          </Button>
        </Space>
      </div>
    </section>
  );
};

export default HeroSection;
