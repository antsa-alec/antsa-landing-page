import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card } from 'antd';
import * as AntIcons from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * FEATURES SECTION - Modern Icon Grid
 * Technology showcase with icons
 */
const FeaturesSection = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/features')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setFeatures(data.items);
        }
      })
      .catch((err) => console.error('Failed to load features:', err))
      .finally(() => setLoading(false));
  }, []);

  // Default features
  const defaultFeatures = [
    {
      id: '1',
      title: 'Node.js',
      description: 'Powerful backend runtime built on Chrome\'s V8 JavaScript engine.',
      icon: 'NodeIndexOutlined',
    },
    {
      id: '2',
      title: 'React',
      description: 'A JavaScript library for building user interfaces with components.',
      icon: 'ReactOutlined',
    },
    {
      id: '3',
      title: 'TypeScript',
      description: 'Typed superset of JavaScript that compiles to plain JavaScript.',
      icon: 'CodeOutlined',
    },
    {
      id: '4',
      title: 'AI Assistant',
      description: '24/7 intelligent support powered by advanced language models.',
      icon: 'RobotOutlined',
    },
    {
      id: '5',
      title: 'Video Sessions',
      description: 'Secure video conferencing with built-in recording capabilities.',
      icon: 'VideoCameraOutlined',
    },
    {
      id: '6',
      title: 'Analytics',
      description: 'Comprehensive insights and reporting for practice management.',
      icon: 'BarChartOutlined',
    },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  // Render icon dynamically
  const renderIcon = (iconName: string) => {
    const IconComponent = (AntIcons as any)[iconName] || AntIcons.StarOutlined;
    return <IconComponent style={{ fontSize: '32px', color: '#a855f7' }} />;
  };

  if (loading) {
    return null;
  }

  return (
    <section
      id="features"
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
              color: '#a855f7',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Features
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
            Unlock the Full Potential of the{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Mental Health Platform
            </span>
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            A comprehensive platform connecting practitioners with clients, built with modern technologies and AI-powered features.
          </Paragraph>
        </div>

        {/* Feature Grid */}
        <Row gutter={[32, 32]}>
          {displayFeatures.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={feature.id}>
              <Card
                className="reveal"
                style={{
                  height: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  background: '#ffffff',
                  padding: '32px 24px',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 50}ms`,
                }}
                bodyStyle={{ padding: 0 }}
                bordered={false}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#a855f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ marginBottom: '20px' }}>
                  {renderIcon(feature.icon)}
                </div>
                <Title
                  level={4}
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '12px',
                  }}
                >
                  {feature.title}
                </Title>
                <Paragraph
                  style={{
                    fontSize: '15px',
                    color: '#64748b',
                    marginBottom: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default FeaturesSection;
