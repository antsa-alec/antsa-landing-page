import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, List } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
  cta_text: string;
  cta_url?: string;
}

/**
 * PRICING SECTION - Three-tier pricing cards
 * Clean, modern pricing display
 */
const PricingSection = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data.content && data.content.plans) {
          // Transform backend data to match component structure
          const transformedPlans = data.content.plans.map((plan: any) => ({
            id: String(plan.id),
            name: plan.name,
            price: plan.price,
            period: plan.period || '/ month',
            description: plan.description || 'For individuals',
            features: Array.isArray(plan.features) ? plan.features : [],
            featured: Boolean(plan.featured),
            cta_text: plan.cta_text || 'Get Started',
            cta_url: plan.cta_url,
          }));
          setPlans(transformedPlans);
        }
      })
      .catch((err) => console.error('Failed to load pricing:', err))
      .finally(() => setLoading(false));
  }, []);

  // Default pricing plans
  const defaultPlans: PricingPlan[] = [
    {
      id: '1',
      name: 'Free',
      price: '$0',
      period: '/ month',
      description: 'For individuals',
      features: [
        '2 Team Members',
        '2 Websites',
        '2 GB Storage',
        '2 TB Transfer',
        'Email Support',
      ],
      cta_text: 'Get Started',
    },
    {
      id: '2',
      name: 'Premium',
      price: '$79',
      period: '/ month',
      description: 'For small teams',
      features: [
        '5 Team Members',
        '5 Websites',
        '5 GB Storage',
        '5 TB Transfer',
        'Email Support',
      ],
      featured: true,
      cta_text: 'Get Started',
    },
    {
      id: '3',
      name: 'Enterprise',
      price: '$199',
      period: '/ month',
      description: 'For industry leaders',
      features: [
        '100 Team Members',
        '100 Websites',
        '100 GB Storage',
        '100 TB Transfer',
        'Email Support',
      ],
      cta_text: 'Get Started',
    },
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  if (loading) {
    return null;
  }

  return (
    <section
      id="pricing"
      style={{
        background: '#ffffff',
        padding: '120px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Title
            level={5}
            className="reveal"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#a855f7',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Features
          </Title>
          <Title
            level={2}
            className="reveal"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}
          >
            Unlock the Full Potential of the{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Mental Health Platform
            </span>
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Choose the plan that works best for your practice.
          </Paragraph>
        </div>

        {/* Pricing Cards */}
        <Row gutter={[32, 32]} justify="center">
          {displayPlans.map((plan, index) => (
            <Col xs={24} sm={24} md={8} key={plan.id}>
              <Card
                className="reveal"
                style={{
                  height: '100%',
                  border: plan.featured ? '2px solid #a855f7' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  background: '#ffffff',
                  padding: '32px 24px',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 100}ms`,
                  position: 'relative',
                }}
                bodyStyle={{ padding: 0 }}
                bordered={false}
                onMouseEnter={(e) => {
                  if (!plan.featured) {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.featured) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {plan.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      color: '#ffffff',
                      padding: '4px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Plan Name */}
                <Title
                  level={3}
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '8px',
                  }}
                >
                  {plan.name}
                </Title>

                {/* Price */}
                <div style={{ marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '48px',
                      fontWeight: 800,
                      color: '#0f172a',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: '18px',
                      color: '#64748b',
                      marginLeft: '4px',
                    }}
                  >
                    {plan.period}
                  </span>
                </div>

                {/* Description */}
                <Paragraph
                  style={{
                    fontSize: '15px',
                    color: '#64748b',
                    marginBottom: '32px',
                  }}
                >
                  {plan.description}
                </Paragraph>

                {/* CTA Button */}
                <Button
                  type={plan.featured ? 'primary' : 'default'}
                  block
                  size="large"
                  style={{
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    marginBottom: '32px',
                    background: plan.featured ? '#0f172a' : '#ffffff',
                    border: plan.featured ? 'none' : '2px solid #e2e8f0',
                    color: plan.featured ? '#ffffff' : '#0f172a',
                  }}
                  href={plan.cta_url || '#'}
                >
                  {plan.cta_text}
                </Button>

                {/* Features List */}
                <List
                  dataSource={plan.features}
                  renderItem={(feature) => (
                    <List.Item
                      style={{
                        border: 'none',
                        padding: '12px 0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <CheckOutlined
                          style={{
                            color: '#10b981',
                            fontSize: '16px',
                            marginTop: '2px',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '15px',
                            color: '#475569',
                            flex: 1,
                          }}
                        >
                          {feature}
                        </span>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default PricingSection;
