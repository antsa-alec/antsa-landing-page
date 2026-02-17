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
    fetch('/api/stripe/pricing')
      .then((res) => {
        if (!res.ok) throw new Error('Stripe unavailable');
        return res.json();
      })
      .then((data) => {
        if (data.plans && data.plans.length > 0) {
          setPlans(data.plans);
        } else {
          throw new Error('No plans returned');
        }
      })
      .catch((err) => console.error('Failed to load pricing:', err))
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
        'Clinician-Overseen AI Chatbot',
        'Practitioner AI Assistant',
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
      cta_text: 'Start Free Trial',
      cta_url: 'https://au.antsa.ai/sign-in',
    },
    {
      id: '2',
      name: 'Clinic / Practice',
      price: '',
      period: '',
      features: [
        'Everything in Solo Practitioner',
        'Reduced per-licence pricing',
        'Multi-practitioner management',
        'Practice-level reporting',
        'Encrypted practitioner communication',
        'Real-time reporting of practitioner usage',
      ],
      featured: false,
      cta_text: 'Contact Us',
      cta_url: 'mailto:admin@antsa.com.au?subject=ANTSA%20Clinic%20Pricing%20Enquiry',
    },
    {
      id: '3',
      name: 'Enterprise',
      price: '',
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
      cta_url: 'mailto:admin@antsa.com.au?subject=ANTSA%20Enterprise%20Enquiry',
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
            const hasPrice = plan.price && /^\$\d/.test(plan.price);
            const isContact = !hasPrice;

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
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }}
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

                  {/* Header zone - fixed height so buttons & features align across cards */}
                  <div style={{ minHeight: '190px', display: 'flex', flexDirection: 'column' }}>
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

                    {/* Price - only shown for plans with a dollar amount */}
                    {hasPrice && (
                      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '40px',
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
                    )}

                    {/* Spacer pushes button to bottom of header zone */}
                    <div style={{ flex: 1, minHeight: '16px' }} />

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
                        background: plan.featured ? 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)' : '#ffffff',
                        border: plan.featured ? 'none' : '2px solid #e2e8f0',
                        color: plan.featured ? '#ffffff' : '#0f172a',
                      }}
                      href={plan.cta_url || (isContact ? 'mailto:admin@antsa.com.au?subject=ANTSA%20Pricing%20Enquiry' : 'https://au.antsa.ai/sign-in')}
                    >
                      {plan.cta_text}
                    </Button>
                  </div>

                  {/* Features List - grows to fill remaining card space */}
                  <div style={{ flex: 1, paddingTop: '24px' }}>
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
                  </div>
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
