import { useEffect, useState } from 'react';
import { Typography, Row, Col } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface WhyAntsaContent {
  title?: string;
  subtitle?: string;
  description?: string;
  reasons?: {
    id: string;
    title: string;
    description: string;
  }[];
}

/**
 * WHY ANTSA SECTION
 * Explains why practitioners should choose ANTSA
 */
const WhyAntsaSection = () => {
  const [content, setContent] = useState<WhyAntsaContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/why-antsa')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setContent(data.content);
        }
      })
      .catch((err) => console.error('Failed to load why-antsa content:', err))
      .finally(() => setLoading(false));
  }, []);

  // Default content
  const defaultReasons = [
    {
      id: '1',
      title: 'Practitioner-Controlled',
      description: 'You maintain full control over client care. ANTSA provides tools that support your clinical judgment, not replace it.',
    },
    {
      id: '2',
      title: 'Evidence-Based',
      description: 'Built on proven therapeutic approaches and designed in consultation with mental health professionals.',
    },
    {
      id: '3',
      title: 'Secure & Compliant',
      description: 'HIPAA, GDPR, and Australian Privacy Principles compliant. Your data is encrypted and hosted securely.',
    },
    {
      id: '4',
      title: 'Seamless Integration',
      description: 'Fits naturally into your existing workflow without disrupting your practice or requiring extensive training.',
    },
  ];

  const title = content.title || 'Why ANTSA';
  const subtitle = content.subtitle || 'The trusted choice for mental health professionals';
  const description = content.description || 'ANTSA is designed by clinicians, for clinicians. We understand the unique challenges of mental health practice and provide tools that enhance care while respecting professional autonomy.';
  const reasons = content.reasons && content.reasons.length > 0 ? content.reasons : defaultReasons;

  if (loading) {
    return null;
  }

  return (
    <section
      id="why-antsa"
      style={{
        background: '#ffffff',
        padding: '120px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Title
            level={5}
            className="reveal"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#3b82f6',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {title}
          </Title>
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
            {subtitle}
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            {description}
          </Paragraph>
        </div>

        {/* Reasons Grid */}
        <Row gutter={[48, 48]}>
          {reasons.map((reason, index) => (
            <Col xs={24} sm={12} key={reason.id}>
              <div
                className="reveal"
                style={{
                  display: 'flex',
                  gap: '20px',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    flexShrink: 0,
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleOutlined
                    style={{
                      fontSize: '24px',
                      color: '#ffffff',
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <Title
                    level={4}
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '12px',
                    }}
                  >
                    {reason.title}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: '16px',
                      color: '#64748b',
                      marginBottom: 0,
                      lineHeight: 1.7,
                    }}
                  >
                    {reason.description}
                  </Paragraph>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default WhyAntsaSection;
