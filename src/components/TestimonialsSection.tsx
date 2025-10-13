/**
 * TESTIMONIALS SECTION - NEXT-LEVEL DESIGN
 * Features: Masonry-style layout, quote styling, animated ratings
 */

import { Row, Col, Card, Typography, Avatar, Rate } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const testimonials = [
  {
    name: 'Dr. Sarah Thompson',
    role: 'Clinical Psychologist',
    avatar: '👩‍⚕️',
    rating: 5,
    quote: "ANTSA has transformed my practice. The AI Scribe saves me hours each week, and my clients love having 24/7 access to jAImee. It's like having an assistant that never sleeps.",
  },
  {
    name: 'Michael Chen',
    role: 'Client',
    avatar: '👨',
    rating: 5,
    quote: "Having jAImee available between sessions has been a game-changer for my mental health journey. It's comforting to know I can reach out anytime and get thoughtful, helpful responses.",
  },
  {
    name: 'Dr. Emma Williams',
    role: 'Clinic Owner',
    avatar: '👩‍💼',
    rating: 5,
    quote: "We've been using ANTSA across our entire clinic. The practitioner dashboard and reporting features give us incredible insights into our practice, and our clinicians are much happier with reduced paperwork.",
  },
  {
    name: 'James Foster',
    role: 'Client',
    avatar: '👨‍💻',
    rating: 5,
    quote: "The mood tracking and journaling features help me stay on top of my mental health. I can see my progress over time, which is incredibly motivating.",
  },
];

const TestimonialsSection = () => {
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
              💬 Testimonials
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
            Trusted by Clinicians and Clients
          </Title>

          <Paragraph className="reveal" style={{ 
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#4a5568',
            lineHeight: 1.8,
          }}>
            See what our community has to say about ANTSA
          </Paragraph>
        </Col>
      </Row>

      <Row gutter={[32, 32]} justify="center">
        {testimonials.map((testimonial, index) => (
          <Col xs={22} sm={11} md={6} key={index} className="reveal-scale">
            <Card
              hoverable
              style={{
                height: '100%',
                borderRadius: '20px',
                border: '2px solid #f0f0f0',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
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
              <MessageOutlined style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                fontSize: '2.5rem',
                color: '#48abe2',
                opacity: 0.1,
              }} />
              
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Avatar
                  size={70}
                  icon={<UserOutlined />}
                  style={{ 
                    backgroundColor: '#48abe2',
                    fontSize: '2rem',
                    marginBottom: '15px',
                  }}
                >
                  {testimonial.avatar}
                </Avatar>
                <Rate disabled defaultValue={testimonial.rating} style={{ fontSize: '1rem', color: '#faad14' }} />
              </div>

              <Paragraph style={{ 
                fontStyle: 'italic',
                color: '#4a5568',
                marginBottom: '25px',
                fontSize: '1rem',
                lineHeight: 1.7,
              }}>
                "{testimonial.quote}"
              </Paragraph>

              <div style={{ 
                textAlign: 'center',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '15px',
              }}>
                <Text strong style={{ display: 'block', fontSize: '1.1rem', color: '#1a202c' }}>
                  {testimonial.name}
                </Text>
                <Text type="secondary" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  {testimonial.role}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TestimonialsSection;
