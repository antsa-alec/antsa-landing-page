/**
 * FEATURES SECTION - NEXT-LEVEL DESIGN
 * Features: 3D card transforms, gradient borders, smooth hover effects, staggered animations
 */

import { Row, Col, Card, Typography } from 'antd';
import {
  RobotOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  SmileOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <RobotOutlined />,
    title: 'jAImee',
    description: "The world's first clinician-overseen therapy chatbot. Available 24/7 to support clients between sessions with evidence-based therapeutic conversations.",
    gradient: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
    color: '#48abe2',
  },
  {
    icon: <FileTextOutlined />,
    title: 'AI Scribe',
    description: 'Transcribes sessions and generates comprehensive summaries, saving hours of paperwork. Focus on your clients while AI handles the documentation.',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#10b981',
  },
  {
    icon: <ThunderboltOutlined />,
    title: 'kAI',
    description: 'An upcoming AI assistant that supports practitioners with real-time insights during sessions, helping deliver better therapeutic outcomes.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#f59e0b',
  },
  {
    icon: <DashboardOutlined />,
    title: 'Practitioner Dashboard',
    description: 'Comprehensive dashboard with client insights, real-time mood tracking, and detailed reports to monitor progress and outcomes.',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    color: '#8b5cf6',
  },
  {
    icon: <SmileOutlined />,
    title: 'Client Tools',
    description: 'Empower clients with mood tracking, journaling, homework resources, and direct access to jAImee for continuous support.',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    color: '#ec4899',
  },
  {
    icon: <BookOutlined />,
    title: 'Homework Resources',
    description: 'Unlimited homework tasks and reminders to keep clients engaged and progressing between sessions.',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    color: '#06b6d4',
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Col xs={22} sm={11} md={8} key={index} className="reveal-scale">
      <Card
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          height: '100%',
          borderRadius: '20px',
          border: 'none',
          background: '#ffffff',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 2px ' + feature.color + '20'
            : '0 8px 20px rgba(0, 0, 0, 0.08)',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gradient Background Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: feature.gradient,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />

        {/* Icon Container with Gradient Background */}
        <div style={{
          width: '80px',
          height: '80px',
          background: feature.gradient,
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          fontSize: '2.5rem',
          color: '#ffffff',
          transform: isHovered ? 'rotate(5deg) scale(1.05)' : 'rotate(0deg) scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          boxShadow: `0 10px 25px ${feature.color}30`,
        }}>
          {feature.icon}
        </div>

        {/* Title */}
        <Title 
          level={4} 
          style={{ 
            marginBottom: '12px',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#1a202c',
          }}
        >
          {feature.title}
        </Title>

        {/* Description */}
        <Paragraph style={{ 
          color: '#4a5568',
          fontSize: '1rem',
          lineHeight: 1.7,
          marginBottom: 0,
        }}>
          {feature.description}
        </Paragraph>

        {/* Hover Accent Line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: feature.gradient,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </Card>
    </Col>
  );
};

const FeaturesSection = () => {
  return (
    <div style={{ 
      padding: '100px 20px',
      background: 'linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '0',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '0',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      <Row justify="center" style={{ marginBottom: '70px', position: 'relative', zIndex: 1 }}>
        <Col xs={22} sm={20} md={18} lg={14}>
          {/* Section Badge */}
          <div 
            className="reveal"
            style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #48abe220 0%, #2196f320 100%)',
              color: '#48abe2',
              padding: '8px 20px',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              ✨ Platform Features
            </span>
          </div>

          {/* Main Title */}
          <Title 
            level={2} 
            className="reveal"
            style={{ 
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.3,
            }}
          >
            Powerful Features for Modern
            <br />Mental Health Practice
          </Title>

          {/* Subtitle */}
          <Paragraph 
            className="reveal"
            style={{ 
              textAlign: 'center',
              fontSize: '1.2rem',
              color: '#4a5568',
              lineHeight: 1.8,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Everything you need to provide exceptional care while reducing administrative burden by up to 80%
          </Paragraph>
        </Col>
      </Row>

      {/* Feature Cards */}
      <Row gutter={[32, 32]} justify="center" style={{ position: 'relative', zIndex: 1 }}>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </Row>

      {/* Bottom CTA Section */}
      <Row justify="center" style={{ marginTop: '80px' }}>
        <Col xs={22} sm={20} md={16} lg={12}>
          <div 
            className="reveal"
            style={{
              background: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
              borderRadius: '24px',
              padding: '50px 40px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              filter: 'blur(40px)',
            }} />
            
            <Title 
              level={3} 
              style={{ 
                color: '#ffffff',
                marginBottom: '15px',
                fontSize: '1.8rem',
                fontWeight: 700,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Ready to Transform Your Practice?
            </Title>
            <Paragraph style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              marginBottom: '30px',
              position: 'relative',
              zIndex: 1,
            }}>
              Join 500+ clinicians who have already reduced their admin time by 80%
            </Paragraph>
            <button
              style={{
                background: '#ffffff',
                color: '#48abe2',
                border: 'none',
                padding: '16px 40px',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                zIndex: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }}
            >
              Get Started Free →
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FeaturesSection;
