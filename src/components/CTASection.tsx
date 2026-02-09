import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * CTA SECTION - Final call to action
 * Simple, centered design
 */
const CTASection = () => {
  return (
    <section
      id="cta"
      style={{
        background: '#ffffff',
        padding: '120px 20px',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Title */}
        <Title
          level={2}
          className="reveal"
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          Ready to transform your practice?
        </Title>

        {/* Description */}
        <Paragraph
          className="reveal"
          style={{
            fontSize: '18px',
            color: '#64748b',
            marginBottom: '48px',
            lineHeight: 1.7,
          }}
        >
          Join mental health practitioners using ANTSA to deliver better client care between sessions.
        </Paragraph>

        {/* CTA Button */}
        <div className="reveal">
          <Button
            type="primary"
            size="large"
            style={{
              height: '64px',
              padding: '0 48px',
              fontSize: '18px',
              fontWeight: 600,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              border: 'none',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            }}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
