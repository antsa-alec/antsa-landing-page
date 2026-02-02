import { Typography, Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

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
          You are ready?
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Paragraph>

        {/* CTA Button */}
        <div className="reveal">
          <Button
            icon={<GithubOutlined />}
            size="large"
            style={{
              height: '64px',
              padding: '0 48px',
              fontSize: '18px',
              fontWeight: 600,
              borderRadius: '12px',
              background: '#0f172a',
              border: 'none',
              color: '#ffffff',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.3)',
            }}
          >
            Star on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
