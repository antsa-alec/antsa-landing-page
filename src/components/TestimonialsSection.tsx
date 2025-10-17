/**
 * TESTIMONIALS SECTION - NEXT-LEVEL DESIGN
 * Features: Masonry-style layout, quote styling, animated ratings
 */

import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Avatar, Rate, Spin } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// Using relative URL so Vite proxy can handle the request
const API_BASE_URL = '/api';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/section/testimonials`);
        const data = await response.json();
        
        if (!ignore && response.ok && data.content && data.content.items) {
          setTestimonials(data.content.items);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching testimonials:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchTestimonials();
    
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

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
                "{testimonial.content}"
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
