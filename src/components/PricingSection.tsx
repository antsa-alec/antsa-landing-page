import { Row, Col, Card, Button, Typography, List } from 'antd';
import { CheckCircleOutlined, CrownOutlined, TeamOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const pricingPlans = [
  {
    icon: <GiftOutlined style={{ fontSize: '3rem', color: '#52c41a' }} />,
    name: 'FREE Trial',
    price: '$0',
    period: '30 days',
    description: 'Try all features risk-free',
    features: [
      'Unlimited clients',
      'Unlimited homework tasks',
      'Unlimited reminders',
      'Unlimited reports per client',
      'Data encrypted on Australian servers',
      'Real-time mood tracking',
      'Access to jAImee chatbot',
      'No credit card required',
    ],
    highlighted: false,
  },
  {
    icon: <CrownOutlined style={{ fontSize: '3rem', color: '#1890ff' }} />,
    name: 'SOLO Practitioner',
    price: '$59',
    period: 'per month',
    description: 'Perfect for individual practitioners',
    features: [
      'Everything in FREE trial',
      'Unlimited clients',
      'Unlimited homework tasks',
      'Unlimited reminders',
      'Unlimited reports per client',
      'Data encrypted on Australian servers',
      'Real-time mood tracking',
      'AI Scribe for session notes',
      'Priority support',
      'Monthly payment (+ G.S.T.)',
      'No minimum term',
    ],
    highlighted: true,
  },
  {
    icon: <TeamOutlined style={{ fontSize: '3rem', color: '#722ed1' }} />,
    name: 'CLINIC Owner',
    price: 'From $50',
    period: 'per practitioner/month',
    description: 'Scalable solution for clinics',
    features: [
      'Everything in SOLO plan',
      'Unlimited practitioners',
      'Reduced costs for increased licences',
      'Encrypted communication with practitioners',
      'Real-time reporting of practitioner usage',
      'Various reports available',
      'Clinic-wide analytics',
      'Dedicated account manager',
      'Custom integrations available',
      'Monthly payment (+ G.S.T.)',
      'No minimum term',
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <div style={{ padding: '80px 20px', background: '#f5f7fa' }}>
      <Row justify="center" style={{ marginBottom: '50px' }}>
        <Col xs={22} sm={20} md={18}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
            Simple, Transparent Pricing
          </Title>
          <Paragraph style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666' }}>
            Choose the plan that works best for you. All plans include Australian-hosted data encryption.
          </Paragraph>
        </Col>
      </Row>
      <Row gutter={[32, 32]} justify="center">
        {pricingPlans.map((plan, index) => (
          <Col xs={22} sm={20} md={8} key={index}>
            <Card
              hoverable
              style={{
                height: '100%',
                textAlign: 'center',
                borderRadius: '12px',
                border: plan.highlighted ? '3px solid #1890ff' : '1px solid #e8e8e8',
                boxShadow: plan.highlighted
                  ? '0 8px 24px rgba(24,144,255,0.2)'
                  : '0 4px 12px rgba(0,0,0,0.08)',
                position: 'relative',
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-15px',
                    right: '20px',
                    background: '#1890ff',
                    color: '#fff',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginBottom: '20px' }}>{plan.icon}</div>
              <Title level={3}>{plan.name}</Title>
              <Title level={2} style={{ color: '#1890ff', margin: '10px 0' }}>
                {plan.price}
              </Title>
              <Text type="secondary" style={{ fontSize: '1rem' }}>
                {plan.period}
              </Text>
              <Paragraph style={{ color: '#666', margin: '15px 0' }}>
                {plan.description}
              </Paragraph>
              <List
                dataSource={plan.features}
                renderItem={(feature) => (
                  <List.Item style={{ border: 'none', padding: '8px 0' }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                    <Text>{feature}</Text>
                  </List.Item>
                )}
                style={{ textAlign: 'left', marginTop: '20px' }}
              />
              <Button
                type={plan.highlighted ? 'primary' : 'default'}
                size="large"
                style={{
                  marginTop: '20px',
                  width: '100%',
                  height: '45px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                {plan.price === '$0' ? 'Start Free Trial' : 'Get Started'}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PricingSection;

