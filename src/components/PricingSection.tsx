import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Button, List } from 'antd';
import { CheckOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  cta_text: string;
  cta_url?: string;
}

/**
 * PRICING SECTION - Three-tier pricing cards
 */
const PricingSection = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try Stripe dynamic pricing first, fall back to DB-seeded content
    fetch('/api/stripe/pricing')
      .then((res) => {
        if (!res.ok) throw new Error('Stripe unavailable');
        return res.json();
      })
      .then((data) => {
        if (data.plans && data.plans.length > 0) {
          setPlans(data.plans);
        } else {
          throw new Error('No Stripe plans');
        }
      })
      .catch(() => {
        // Fallback: load from CMS / DB seed
        fetch('/api/content/section/pricing')
          .then((res) => res.json())
          .then((data) => {
            if (data.content && data.content.plans) {
              const transformedPlans = data.content.plans.map((plan: any) => ({
                id: String(plan.id),
                name: plan.name,
                price: plan.price,
                period: plan.period !== undefined && plan.period !== null ? plan.period : '/month',
                features: Array.isArray(plan.features) ? plan.features : [],
                featured: Boolean(plan.featured),
                cta_text: plan.cta_text || (plan.price === 'Contact Us' ? 'Contact Us' : 'Get Started'),
                cta_url: plan.cta_url,
              }));
              setPlans(transformedPlans);
            }
          })
          .catch((err) => console.error('Failed to load pricing:', err));
      })
      .finally(() => setLoading(false));
  }, []);

  const defaultPlans: PricingPlan[] = [
    {
      id: '1',
      name: 'Solo Practitioner',
      price: '$79',
      period: '/month',
      features: [
        'Full platform access',
        'AI chatbot (jAImee)',
        'AI Scribe & Templates',
        'Telehealth & Session Summaries',
        'Mood & Distress Tracking',
        'Secure Messaging',
        'Homework Task Assignment',
        'Psychoeducation Library',
        'Automated Reminders',
        'Psychometric Measures',
      ],
      featured: true,
      cta_text: 'Get Started',
      cta_url: 'https://au.antsa.ai/sign-in',
    },
    {
      id: '2',
      name: 'Clinic / Practice',
      price: 'Contact Us',
      period: '',
      features: [
        'Everything in Solo Practitioner',
        'Reduced per-licence pricing for practices with multiple practitioner licences',
        'Multi-practitioner management',
        'Practice-level reporting',
      ],
      featured: false,
      cta_text: 'Contact Us',
      cta_url: 'mailto:admin@antsa.com.au?subject=ANTSA%20Pricing%20Enquiry&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20learn%20more%20about%20your%20pricing%20options.%0A%0AThanks!',
    },
    {
      id: '3',
      name: 'Enterprise',
      price: 'Contact Us',
      period: '',
      features: [
        'Everything in Clinic / Practice',
        'Custom integrations',
        'Dedicated support',
        'Service-level agreements',
        'Custom deployment options',
      ],
      featured: false,
      cta_text: 'Contact Us',
      cta_url: 'mailto:admin@antsa.com.au?subject=ANTSA%20Pricing%20Enquiry&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20learn%20more%20about%20your%20pricing%20options.%0A%0AThanks!',
    },
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  if (loading) return null;

  return (
    <section
      id="pricing"
      style={{
        background: '#ffffff',
        padding: '120px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Title
            level={5}
            className="reveal"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#48abe2',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            PRICING
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
            Pricing should be{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              simple
            </span>.
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
            One system. Full access. No hidden add-ons.
          </Paragraph>
        </div>

        {/* Pricing Cards */}
        <Row gutter={[32, 32]} justify="center">
          {displayPlans.map((plan, index) => {
            const isContact = plan.price === 'Contact Us' || plan.cta_text === 'Contact Us';

            return (
              <Col xs={24} sm={24} md={8} key={plan.id}>
                <Card
                  className="reveal"
                  style={{
                    height: '100%',
                    border: plan.featured ? '2px solid #48abe2' : '1px solid #e2e8f0',
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
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {plan.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                        color: '#ffffff',
                        padding: '4px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
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
                  <div style={{ marginBottom: '24px' }}>
                    <span
                      style={{
                        fontSize: plan.price === 'Contact Us' ? '32px' : plan.price.startsWith('From') ? '36px' : '48px',
                        fontWeight: 800,
                        color: '#0f172a',
                      }}
                    >
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span
                        style={{
                          fontSize: '18px',
                          color: '#64748b',
                          marginLeft: '4px',
                        }}
                      >
                        {plan.period}
                      </span>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    type={plan.featured ? 'primary' : 'default'}
                    block
                    size="large"
                    icon={isContact ? <MailOutlined /> : undefined}
                    style={{
                      height: '56px',
                      fontSize: '16px',
                      fontWeight: 600,
                      borderRadius: '12px',
                      marginBottom: '32px',
                      background: plan.featured ? 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)' : '#ffffff',
                      border: plan.featured ? 'none' : '2px solid #e2e8f0',
                      color: plan.featured ? '#ffffff' : '#0f172a',
                    }}
                    href={plan.cta_url || (isContact ? 'mailto:admin@antsa.com.au?subject=ANTSA%20Pricing%20Enquiry&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20learn%20more%20about%20your%20pricing%20options.%0A%0AThanks!' : 'https://au.antsa.ai/sign-in')}
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
                          padding: '10px 0',
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
                              fontSize: '14px',
                              color: '#475569',
                              flex: 1,
                              lineHeight: 1.5,
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
            );
          })}
        </Row>
      </div>
    </section>
  );
};

export default PricingSection;
