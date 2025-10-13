import { Row, Col, Card, Typography, Avatar } from 'antd';
import { UserOutlined, StarFilled } from '@ant-design/icons';

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
    <div style={{ padding: '80px 20px', background: '#ffffff' }}>
      <Row justify="center" style={{ marginBottom: '50px' }}>
        <Col xs={22} sm={20} md={18}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Trusted by Clinicians and Clients
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666' }}>
            See what our community has to say about ANTSA
          </Paragraph>
        </Col>
      </Row>
      <Row gutter={[32, 32]} justify="center">
        {testimonials.map((testimonial, index) => (
          <Col xs={22} sm={11} md={6} key={index}>
            <Card
              hoverable
              style={{
                height: '100%',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff', fontSize: '2rem' }}
                >
                  {testimonial.avatar}
                </Avatar>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarFilled key={i} style={{ color: '#faad14', fontSize: '1rem' }} />
                ))}
              </div>
              <Paragraph style={{ fontStyle: 'italic', color: '#666', marginBottom: '20px' }}>
                "{testimonial.quote}"
              </Paragraph>
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ display: 'block' }}>
                  {testimonial.name}
                </Text>
                <Text type="secondary" style={{ fontSize: '0.9rem' }}>
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

