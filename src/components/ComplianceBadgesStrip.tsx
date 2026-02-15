import { useEffect, useState } from 'react';
import { Typography, Row, Col } from 'antd';
import { SafetyOutlined, GlobalOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

interface Badge {
  title: string;
  description: string;
  icon: string;
}

/**
 * COMPLIANCE BADGES STRIP - Slim strip above footer
 * Shows GDPR, Australian Privacy Principles, HIPAA badges
 */
const ComplianceBadgesStrip = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/compliance')
      .then((res) => res.json())
      .then((data) => {
        if (data.content && data.content.badges) {
          const parsed = typeof data.content.badges === 'string'
            ? JSON.parse(data.content.badges)
            : data.content.badges;
          setBadges(parsed);
        }
      })
      .catch((err) => console.error('Failed to load compliance badges:', err))
      .finally(() => setLoading(false));
  }, []);

  const defaultBadges: Badge[] = [
    { title: 'GDPR Compliant', description: 'European data protection standards', icon: 'SafetyOutlined' },
    { title: 'Australian Privacy Principles', description: 'Hosted on Australian Servers', icon: 'GlobalOutlined' },
    { title: 'HIPAA Compliant', description: 'US healthcare data protection', icon: 'MedicineBoxOutlined' },
  ];

  const displayBadges = badges.length > 0 ? badges : defaultBadges;

  const getIcon = (iconName: string) => {
    const iconStyle = { fontSize: '28px', color: '#48abe2' };
    switch (iconName) {
      case 'SafetyOutlined': return <SafetyOutlined style={iconStyle} />;
      case 'GlobalOutlined': return <GlobalOutlined style={iconStyle} />;
      case 'MedicineBoxOutlined': return <MedicineBoxOutlined style={iconStyle} />;
      default: return <SafetyOutlined style={iconStyle} />;
    }
  };

  if (loading) return null;

  return (
    <section
      id="compliance"
      style={{
        background: '#f8fafc',
        padding: '60px 20px',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Row gutter={[48, 32]} justify="center" align="middle">
          {displayBadges.map((badge, index) => (
            <Col xs={24} sm={8} key={index}>
              <div
                className="reveal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getIcon(badge.icon)}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '2px',
                    }}
                  >
                    {badge.title}
                  </div>
                  <Paragraph
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: 0,
                    }}
                  >
                    {badge.description}
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

export default ComplianceBadgesStrip;
