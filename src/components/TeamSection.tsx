/**
 * TEAM SECTION - NEXT-LEVEL DESIGN  
 * Features: Modern card design, social media hover effects
 */

import { Row, Col, Card, Typography, Avatar, Space } from 'antd';
import { LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const teamMembers = [
  {
    name: 'Dr. Alex Rodriguez',
    role: 'Founder & CEO',
    avatar: '👨‍⚕️',
    bio: 'Clinical psychologist with 15+ years experience. Passionate about leveraging technology to improve mental health outcomes.',
  },
  {
    name: 'Sophie Mitchell',
    role: 'CTO',
    avatar: '👩‍💻',
    bio: 'Former AI researcher at leading tech companies. Expert in machine learning and natural language processing.',
  },
  {
    name: 'Dr. Priya Patel',
    role: 'Chief Clinical Officer',
    avatar: '👩‍⚕️',
    bio: 'Psychiatrist specializing in digital mental health. Ensures all AI tools meet clinical standards and ethical guidelines.',
  },
  {
    name: 'Marcus Thompson',
    role: 'Head of Product',
    avatar: '👨‍💼',
    bio: 'Product leader with experience building healthcare SaaS platforms. Focused on creating intuitive user experiences.',
  },
];

const TeamSection = () => {
  return (
    <div style={{ 
      padding: '100px 20px',
      background: 'linear-gradient(180deg, #f7fafc 0%, #ffffff 100%)',
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
              👥 Our Team
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
            Meet the Minds Behind ANTSA
          </Title>

          <Paragraph className="reveal" style={{ 
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#4a5568',
            lineHeight: 1.8,
          }}>
            A diverse team of clinicians, technologists, and healthcare innovators
          </Paragraph>
        </Col>
      </Row>

      <Row gutter={[32, 32]} justify="center">
        {teamMembers.map((member, index) => (
          <Col xs={22} sm={11} md={6} key={index} className="reveal-scale">
            <Card
              hoverable
              style={{
                height: '100%',
                textAlign: 'center',
                borderRadius: '20px',
                border: '2px solid #f0f0f0',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
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
              <Avatar
                size={110}
                style={{
                  background: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
                  fontSize: '3.5rem',
                  marginBottom: '20px',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                }}
              >
                {member.avatar}
              </Avatar>

              <Title level={4} style={{ marginBottom: '5px', fontSize: '1.3rem', fontWeight: 700 }}>
                {member.name}
              </Title>

              <Text style={{ 
                display: 'block',
                color: '#48abe2',
                fontSize: '0.95rem',
                fontWeight: 600,
                marginBottom: '15px',
              }}>
                {member.role}
              </Text>

              <Paragraph style={{ 
                color: '#4a5568',
                marginBottom: '25px',
                fontSize: '0.95rem',
                lineHeight: 1.7,
              }}>
                {member.bio}
              </Paragraph>

              <Space size="middle">
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#48abe2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2196f3';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <LinkedinOutlined style={{ fontSize: '1.3rem', color: '#ffffff' }} />
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#48abe2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2196f3';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#667eea';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <MailOutlined style={{ fontSize: '1.3rem', color: '#ffffff' }} />
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TeamSection;
