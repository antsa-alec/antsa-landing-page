/**
 * HERO SECTION - NEXT-LEVEL DESIGN
 * Features: Animated gradient background, parallax effect, glassmorphism, floating elements
 */

import { Row, Col, Button, Typography, Space } from 'antd';
import { RocketOutlined, HeartOutlined, PlayCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient-shift 15s ease infinite',
      padding: '120px 20px 140px',
      textAlign: 'center',
      color: '#ffffff',
      overflow: 'hidden',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Floating Decorative Shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 10s ease-in-out infinite',
        animationDelay: '2s',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite',
        animationDelay: '4s',
      }} />

      {/* Main Content with Parallax */}
      <Row justify="center" style={{
        position: 'relative',
        zIndex: 1,
        transform: `translateY(${scrollY * 0.5}px)`,
        transition: 'transform 0.1s ease-out',
      }}>
        <Col xs={22} sm={20} md={18} lg={16} xl={14}>
          {/* Badge */}
          <div className="reveal" style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50px',
            padding: '8px 20px',
            marginBottom: '30px',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            animation: 'fadeInUp 0.8s ease-out',
          }}>
            <HeartOutlined style={{ marginRight: '8px' }} />
            Welcome to the Future of Mental Health Care
          </div>

          {/* Main Heading */}
          <Title 
            level={1} 
            className="reveal"
            style={{ 
              color: '#ffffff', 
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              marginBottom: '30px',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            Transform Mental Healthcare
            <br />
            <span style={{ 
              background: 'linear-gradient(to right, #ffffff, #f0f0f0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              With AI-Powered Intelligence
            </span>
          </Title>

          {/* Subheading */}
          <Paragraph 
            className="reveal"
            style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '20px',
              lineHeight: 1.8,
              maxWidth: '800px',
              margin: '0 auto 20px',
              animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            Reduce administrative burden by 80% while strengthening therapeutic outcomes. 
            Our AI-powered platform bridges the gap between sessions.
          </Paragraph>

          {/* Secondary Text */}
          <Paragraph 
            className="reveal"
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '50px',
              fontWeight: 500,
              animation: 'fadeInUp 0.8s ease-out 0.6s backwards',
            }}
          >
            Trusted by 500+ clinicians • 10,000+ active clients • Australian hosted
          </Paragraph>

          {/* CTA Buttons */}
          <Space 
            className="reveal"
            size="large" 
            wrap
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.8s backwards',
            }}
          >
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              style={{
                height: '60px',
                padding: '0 40px',
                fontSize: '1.1rem',
                background: '#ffffff',
                color: '#667eea',
                border: 'none',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)';
              }}
            >
              Start Free Trial <ArrowRightOutlined />
            </Button>
            
            <Button
              size="large"
              icon={<PlayCircleOutlined />}
              style={{
                height: '60px',
                padding: '0 40px',
                fontSize: '1.1rem',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                fontWeight: 600,
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              Watch Demo
            </Button>
          </Space>

          {/* Trust Indicators */}
          <div 
            className="reveal"
            style={{
              marginTop: '60px',
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              animation: 'fadeInUp 0.8s ease-out 1s backwards',
            }}
          >
            {[
              { value: '500+', label: 'Clinicians' },
              { value: '10K+', label: 'Clients' },
              { value: '80%', label: 'Time Saved' },
              { value: '4.9/5', label: 'Rating' },
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 800, 
                  color: '#ffffff',
                  marginBottom: '5px',
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'float 2s ease-in-out infinite',
      }}>
        <div style={{
          width: '30px',
          height: '50px',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '20px',
          position: 'relative',
        }}>
          <div style={{
            width: '6px',
            height: '10px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '3px',
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'float 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

