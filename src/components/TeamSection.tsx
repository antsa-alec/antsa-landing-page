import { Row, Col, Card, Typography, Avatar } from 'antd';
import { LinkedinOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const teamMembers = [
  {
    name: 'Dr. Alex Rodriguez',
    role: 'Founder & CEO',
    avatar: '👨‍⚕️',
    bio: 'Clinical psychologist with 15+ years experience. Passionate about leveraging technology to improve mental health outcomes.',
    linkedin: '#',
  },
  {
    name: 'Sophie Mitchell',
    role: 'CTO',
    avatar: '👩‍💻',
    bio: 'Former AI researcher at leading tech companies. Expert in machine learning and natural language processing.',
    linkedin: '#',
  },
  {
    name: 'Dr. Priya Patel',
    role: 'Chief Clinical Officer',
    avatar: '👩‍⚕️',
    bio: 'Psychiatrist specializing in digital mental health. Ensures all AI tools meet clinical standards and ethical guidelines.',
    linkedin: '#',
  },
  {
    name: 'Marcus Thompson',
    role: 'Head of Product',
    avatar: '👨‍💼',
    bio: 'Product leader with experience building healthcare SaaS platforms. Focused on creating intuitive user experiences.',
    linkedin: '#',
  },
];

const TeamSection = () => {
  return (
    <div style={{ padding: '80px 20px', background: '#f5f7fa' }}>
      <Row justify="center" style={{ marginBottom: '50px' }}>
        <Col xs={22} sm={20} md={18}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Meet Our Team
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666' }}>
            A diverse team of clinicians, technologists, and healthcare innovators
          </Paragraph>
        </Col>
      </Row>
      <Row gutter={[32, 32]} justify="center">
        {teamMembers.map((member, index) => (
          <Col xs={22} sm={11} md={6} key={index}>
            <Card
              hoverable
              style={{
                height: '100%',
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <Avatar
                size={100}
                style={{
                  backgroundColor: '#1890ff',
                  fontSize: '3rem',
                  marginBottom: '20px',
                }}
              >
                {member.avatar}
              </Avatar>
              <Title level={4} style={{ marginBottom: '5px' }}>
                {member.name}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '15px' }}>
                {member.role}
              </Text>
              <Paragraph style={{ color: '#666', marginBottom: '20px' }}>
                {member.bio}
              </Paragraph>
              <div>
                <LinkedinOutlined
                  style={{ fontSize: '1.5rem', color: '#1890ff', marginRight: '15px', cursor: 'pointer' }}
                />
                <MailOutlined
                  style={{ fontSize: '1.5rem', color: '#1890ff', cursor: 'pointer' }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TeamSection;

