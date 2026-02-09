import { Typography, Row, Col } from 'antd';
import { SafetyOutlined, GlobalOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

/**
 * TRUST & STANDARDS SECTION
 * Compliance and regulatory information
 */
const TrustStandardsSection = () => {
  return (
    <section
      id="trust-standards"
      style={{
        background: '#f8fafc',
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
            TRUST & STANDARDS
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
            Compliance alignment reflects system design and data handling practices
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
            ANTSA access is practitioner-controlled and does not replace practitioner responsibility for professional and regulatory obligations.
          </Paragraph>
        </div>

        {/* Compliance Badges */}
        <Row gutter={[48, 48]} justify="center" align="middle">
          <Col xs={24} sm={12} md={8}>
            <div
              className="reveal"
              style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <SafetyOutlined
                style={{
                  fontSize: '64px',
                  color: '#3b82f6',
                  marginBottom: '24px',
                }}
              />
              <Title
                level={4}
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '12px',
                }}
              >
                GDPR Compliant
              </Title>
              <Paragraph
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  marginBottom: 0,
                }}
              >
                European data protection standards
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div
              className="reveal"
              style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <GlobalOutlined
                style={{
                  fontSize: '64px',
                  color: '#3b82f6',
                  marginBottom: '24px',
                }}
              />
              <Title
                level={4}
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '12px',
                }}
              >
                Australian Privacy Principles
              </Title>
              <Paragraph
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  marginBottom: 0,
                }}
              >
                Hosted on Australian Servers
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <div
              className="reveal"
              style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}
            >
              <MedicineBoxOutlined
                style={{
                  fontSize: '64px',
                  color: '#3b82f6',
                  marginBottom: '24px',
                }}
              />
              <Title
                level={4}
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '12px',
                }}
              >
                HIPAA Compliant
              </Title>
              <Paragraph
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  marginBottom: 0,
                }}
              >
                US healthcare data protection
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default TrustStandardsSection;
