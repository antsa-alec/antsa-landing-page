/**
 * FOOTER - NEXT-LEVEL DESIGN
 * Features: Modern dark theme, social media animations
 */

import { Layout, Row, Col, Typography, Space } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined, HeartFilled } from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer style={{ 
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      padding: '60px 20px 30px',
      textAlign: 'center',
    }}>
      <Row justify="center">
        <Col xs={22} sm={20} md={16} lg={14}>
          {/* Logo/Brand */}
          <div style={{ marginBottom: '30px' }}>
            <Text style={{ 
              fontSize: '2rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #14b8a6 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              ANTSA
            </Text>
          </div>

          {/* Social Media Icons */}
          <Space size="large" style={{ marginBottom: '30px' }}>
            {[GithubOutlined, LinkedinOutlined, TwitterOutlined].map((Icon, index) => (
              <div
                key={index}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#14b8a6';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Icon style={{ fontSize: '1.4rem', color: '#ffffff' }} />
              </div>
            ))}
          </Space>

          {/* Links */}
          <div style={{ marginBottom: '30px' }}>
            <Space split={<span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>} size="large" wrap>
              {['Privacy Policy', 'Terms of Service', 'Support', 'About Us', 'Careers'].map((item, index) => (
                <Link 
                  key={index}
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 500,
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  {item}
                </Link>
              ))}
            </Space>
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
            margin: '30px 0',
          }} />

          {/* Copyright */}
          <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
            © {currentYear} ANTSA. All rights reserved. • Made with <HeartFilled style={{ color: '#14b8a6', margin: '0 5px' }} /> in Australia
          </Text>
          <br />
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
            Data encrypted and securely hosted on Australian servers
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
