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
      title: 'Clinician-Overseen AI Chatbot',
      description: 'A practitioner-assigned AI chatbot that supports clients between sessions, with all interactions visible within the clinical record.',
      icon: 'RobotOutlined',
    },
    {
      id: '2',
      title: 'AI Scribe & Templates',
      description: 'AI-assisted session notes with structured clinical templates to reduce administrative burden.',
      icon: 'FileTextOutlined',
    },
    {
      id: '3',
      title: 'Telehealth & Session Summaries',
      description: 'Integrated video sessions with automatic session summaries to support accurate documentation.',
      icon: 'VideoCameraOutlined',
    },
    {
      id: '4',
      title: 'Psychometric Measures',
      description: 'Assignable psychometric questionnaires completed and stored directly in the client file.',
      icon: 'FormOutlined',
    },
    {
      id: '5',
      title: 'Automated Reminders',
      description: 'Scheduled notifications for tasks, check-ins, and questionnaires without increasing practitioner workload.',
      icon: 'BellOutlined',
    },
    {
      id: '6',
      title: 'Homework Task Assignment',
      description: 'Practitioner-assigned therapeutic tasks with automated delivery and completion tracking between sessions.',
      icon: 'CheckSquareOutlined',
    },
    {
      id: '7',
      title: 'Psychoeducation Library',
      description: 'Evidence-based educational resources assigned by practitioners to support client insight and engagement.',
      icon: 'ReadOutlined',
    },
    {
      id: '8',
      title: 'Mood & Distress Tracking',
      description: 'Ongoing mood monitoring to identify patterns and early warning signs between appointments.',
      icon: 'LineChartOutlined',
    },
    {
      id: '9',
      title: 'Secure Messaging',
      description: 'HIPAA-compliant messaging for practitioner-client communication and care coordination.',
      icon: 'MessageOutlined',
    },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  // Render icon dynamically
  const renderIcon = (iconName: string) => {
    const IconComponent = (AntIcons as any)[iconName] || AntIcons.StarOutlined;
    return <IconComponent style={{ fontSize: '32px', color: '#48abe2' }} />;
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
              color: '#48abe2',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            FEATURES
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
            Supporting{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              safe and secure
            </span>{' '}
            care between sessions.
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
            A governed digital mental health system that brings together the core tools practitioners use to support and monitor clients between appointments.
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
                  e.currentTarget.style.borderColor = '#48abe2';
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
