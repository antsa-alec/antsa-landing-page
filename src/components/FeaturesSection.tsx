import { Row, Col, Card, Typography } from 'antd';
import {
  RobotOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
  SmileOutlined,
  BookOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <RobotOutlined style={{ fontSize: '3rem', color: '#1890ff' }} />,
    title: 'jAImee',
    description: "The world's first clinician-overseen therapy chatbot. Available 24/7 to support clients between sessions with evidence-based therapeutic conversations.",
  },
  {
    icon: <FileTextOutlined style={{ fontSize: '3rem', color: '#52c41a' }} />,
    title: 'AI Scribe',
    description: 'Transcribes sessions and generates comprehensive summaries, saving hours of paperwork. Focus on your clients while AI handles the documentation.',
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: '3rem', color: '#faad14' }} />,
    title: 'kAI',
    description: 'An upcoming AI assistant that supports practitioners with real-time insights during sessions, helping deliver better therapeutic outcomes.',
  },
  {
    icon: <DashboardOutlined style={{ fontSize: '3rem', color: '#722ed1' }} />,
    title: 'Practitioner Dashboard',
    description: 'Comprehensive dashboard with client insights, real-time mood tracking, and detailed reports to monitor progress and outcomes.',
  },
  {
    icon: <SmileOutlined style={{ fontSize: '3rem', color: '#eb2f96' }} />,
    title: 'Client Tools',
    description: 'Empower clients with mood tracking, journaling, homework resources, and direct access to jAImee for continuous support.',
  },
  {
    icon: <BookOutlined style={{ fontSize: '3rem', color: '#13c2c2' }} />,
    title: 'Homework Resources',
    description: 'Unlimited homework tasks and reminders to keep clients engaged and progressing between sessions.',
  },
];

const FeaturesSection = () => {
  return (
    <div style={{ padding: '80px 20px', background: '#ffffff' }}>
      <Row justify="center" style={{ marginBottom: '50px' }}>
        <Col xs={22} sm={20} md={18}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Powerful Features for Modern Mental Health Practice
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666' }}>
            Everything you need to provide exceptional care while reducing administrative burden
          </Paragraph>
        </Col>
      </Row>
      <Row gutter={[32, 32]} justify="center">
        {features.map((feature, index) => (
          <Col xs={22} sm={11} md={8} key={index}>
            <Card
              hoverable
              style={{
                height: '100%',
                textAlign: 'center',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ marginBottom: '20px' }}>{feature.icon}</div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph style={{ color: '#666' }}>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeaturesSection;

