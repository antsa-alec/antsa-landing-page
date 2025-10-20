/**
 * CONTACT SECTION - NEXT-LEVEL DESIGN
 * Features: Glass morphism cards, modern icon styling
 */

import { Row, Col, Typography } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const contactInfo = [
  {
    icon: <PhoneOutlined />,
    title: 'Call Us',
    content: '+61 3 881 22 373',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    icon: <MailOutlined />,
    title: 'Email Us',
    content: 'info@antsa.com.au',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    link: 'mailto:info@antsa.com.au',
  },
];

const ContactSection = () => {
  return (
    <div style={{ 
      padding: '100px 20px',
      background: '#ffffff',
      position: 'relative',
    }}>
      <Row justify="center" style={{ marginBottom: '70px' }}>
        <Col xs={22} sm={20} md={18} lg={14}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '20px' }}>
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
              📞 Get in Touch
            </span>
          </div>

          <Title level={2} className="reveal" style={{ 
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            We're Here to Help
          </Title>

          <Paragraph className="reveal" style={{ 
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#4a5568',
            lineHeight: 1.8,
          }}>
            Have questions? Our team is ready to assist you
          </Paragraph>
        </Col>
      </Row>

      <Row gutter={[32, 32]} justify="center">
        {contactInfo.map((info, index) => (
          <Col xs={22} sm={20} md={8} key={index} className="reveal-scale">
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #f0f0f0',
                borderRadius: '20px',
                padding: '40px 30px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                height: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                background: info.gradient,
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                color: '#ffffff',
                marginBottom: '25px',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              }}>
                {info.icon}
              </div>

              <Title level={4} style={{ marginBottom: '15px', fontWeight: 700 }}>
                {info.title}
              </Title>

              {info.link ? (
                <a href={info.link} style={{ 
                  fontSize: '1.1rem',
                  color: '#4a5568',
                  lineHeight: 1.7,
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#48abe2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#4a5568';
                }}>
                  {info.content}
                </a>
              ) : (
                <Text style={{ 
                  fontSize: '1.1rem',
                  color: '#4a5568',
                  lineHeight: 1.7,
                  display: 'block',
                }}>
                  {info.content}
                </Text>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ContactSection;
