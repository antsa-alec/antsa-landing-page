import { useEffect, useState } from 'react';
import { Typography, Row, Col } from 'antd';
import * as AntIcons from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

// Accent colors for feature cards (cycled through)
const accentColors = [
  '#48abe2', // ANTSA blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#ef4444', // red
  '#84cc16', // lime
  '#6366f1', // indigo
];

/**
 * FEATURES SECTION - Bento-style grid with colored accent cards
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

  const defaultFeatures: Feature[] = [
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

  // Bento layout pattern: alternates between wide (span 2) and narrow (span 1)
  // Pattern for 9 items: [2,1], [1,2], [2,1], [1,1,1]
  const getSpan = (index: number): number => {
    // Row 0: items 0,1 → wide, narrow
    // Row 1: items 2,3 → narrow, wide
    // Row 2: items 4,5 → wide, narrow
    // Row 3: items 6,7,8 → even thirds
    const row = Math.floor(index / 2);
    const pos = index % 2;

    if (index >= 8) return 8; // last row: thirds
    if (index >= 6) return 8; // items 6,7: thirds

    if (row % 2 === 0) {
      return pos === 0 ? 14 : 10;
    } else {
      return pos === 0 ? 10 : 14;
    }
  };

  const renderIcon = (iconName: string, color: string) => {
    const IconComponent = (AntIcons as any)[iconName] || AntIcons.StarOutlined;
    return <IconComponent style={{ fontSize: '28px', color }} />;
  };

  if (loading) return null;

  return (
    <section
      id="features"
      style={{
        background: '#f8fafc',
        padding: '120px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            What{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ANTSA
            </span>{' '}
            includes.
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

        {/* Bento Feature Grid */}
        <Row gutter={[20, 20]}>
          {displayFeatures.map((feature, index) => {
            const color = feature.color || accentColors[index % accentColors.length];
            const span = getSpan(index);

            return (
              <Col xs={24} sm={12} lg={span} key={feature.id}>
                <div
                  className="reveal"
                  style={{
                    height: '100%',
                    borderRadius: '16px',
                    background: '#ffffff',
                    padding: '32px 28px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    transitionDelay: `${index * 50}ms`,
                    border: '1px solid #e2e8f0',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = `0 20px 40px ${color}20`;
                    e.currentTarget.style.borderColor = color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {/* Colored top accent bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${color} 0%, ${color}88 100%)`,
                    }}
                  />

                  {/* Icon with colored background pill */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: `${color}12`,
                      marginBottom: '20px',
                    }}
                  >
                    {renderIcon(feature.icon, color)}
                  </div>

                  <Title
                    level={4}
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '10px',
                    }}
                  >
                    {feature.title}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: '14px',
                      color: '#64748b',
                      marginBottom: 0,
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Paragraph>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </section>
  );
};

export default FeaturesSection;
