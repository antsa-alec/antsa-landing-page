/**
 * PRICING SECTION - NEXT-LEVEL DESIGN
 * Features: Glassmorphism, 3D effects, animated borders, premium visual hierarchy
 */

import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, Space, Spin } from 'antd';
import { 
  CheckCircleOutlined, 
  CrownOutlined, 
  TeamOutlined, 
  GiftOutlined,
  StarFilled,
  ArrowRightOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// Using relative URL so Vite proxy can handle the request
const API_BASE_URL = '/api';

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  period: string;
  featured: number;
  features: string[];
  // Optional properties for hardcoded plans
  icon?: React.ReactElement;
  description?: string;
  highlighted?: boolean;
  gradient?: string;
  color?: string;
  badge?: string;
}

const pricingPlans = [
  {
    icon: <GiftOutlined />,
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
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#10b981',
  },
  {
    icon: <CrownOutlined />,
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
    gradient: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
    color: '#48abe2',
    badge: 'MOST POPULAR',
  },
  {
    icon: <TeamOutlined />,
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
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    color: '#8b5cf6',
  },
];

const PricingCard = ({ 
  plan, 
  index, 
  freeCtaText, 
  paidCtaText, 
  signupUrl 
}: { 
  plan: any; // Combined type of PricingPlan and hardcoded plan
  index: number;
  freeCtaText: string;
  paidCtaText: string;
  signupUrl: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Col xs={22} sm={20} md={8} key={index} className="reveal-scale">
      <Card
        hoverable
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          height: '100%',
          borderRadius: '24px',
          border: plan.highlighted 
            ? `3px solid ${plan.color}`
            : '2px solid #e2e8f0',
          background: plan.highlighted
            ? 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)'
            : '#ffffff',
          boxShadow: plan.highlighted
            ? `0 20px 50px ${plan.color}30`
            : isHovered 
              ? '0 20px 40px rgba(0, 0, 0, 0.12)'
              : '0 8px 20px rgba(0, 0, 0, 0.08)',
          transform: plan.highlighted 
            ? 'scale(1.05)' 
            : isHovered 
              ? 'translateY(-8px)' 
              : 'translateY(0)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'visible',
          zIndex: plan.highlighted ? 2 : 1,
        }}
      >
        {/* Popular Badge */}
        {plan.badge && (
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: plan.gradient,
              color: '#ffffff',
              padding: '8px 24px',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
              boxShadow: `0 6px 20px ${plan.color}40`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <StarFilled /> {plan.badge}
          </div>
        )}

        {/* Icon Container */}
        <div style={{ textAlign: 'center', marginTop: plan.badge ? '30px' : '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: plan.gradient,
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            color: '#ffffff',
            marginBottom: '24px',
            transform: isHovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: `0 10px 30px ${plan.color}40`,
          }}>
            {plan.icon}
          </div>
        </div>

        {/* Plan Name */}
        <Title 
          level={3} 
          style={{ 
            textAlign: 'center',
            marginBottom: '8px',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#1a202c',
          }}
        >
          {plan.name}
        </Title>

        {/* Price */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Title 
            level={2} 
            style={{ 
              background: plan.gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 900,
            }}
          >
            {plan.price}
          </Title>
        </div>

        {/* Period */}
        <Text 
          style={{ 
            display: 'block',
            textAlign: 'center',
            fontSize: '1rem',
            color: '#718096',
            fontWeight: 600,
            marginBottom: '15px',
          }}
        >
          {plan.period}
        </Text>

        {/* Description */}
        <Paragraph 
          style={{ 
            textAlign: 'center',
            color: '#4a5568',
            fontSize: '1rem',
            marginBottom: '30px',
            fontWeight: 500,
          }}
        >
          {plan.description}
        </Paragraph>

        {/* CTA Button */}
        <Button
          type={plan.highlighted ? 'primary' : 'default'}
          size="large"
          block
          icon={<ArrowRightOutlined />}
          onClick={() => signupUrl && signupUrl !== '#' && window.open(signupUrl, '_blank')}
          style={{
            height: '56px',
            fontSize: '1.05rem',
            fontWeight: 700,
            borderRadius: '12px',
            marginBottom: '30px',
            background: plan.highlighted ? plan.gradient : '#f7fafc',
            color: plan.highlighted ? '#ffffff' : plan.color,
            border: plan.highlighted ? 'none' : `2px solid ${plan.color}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: signupUrl && signupUrl !== '#' ? 'pointer' : 'default',
          }}
          onMouseEnter={(e) => {
            if (plan.highlighted) {
              e.currentTarget.style.boxShadow = `0 8px 30px ${plan.color}60`;
              e.currentTarget.style.transform = 'translateY(-3px)';
            } else {
              e.currentTarget.style.background = plan.color;
              e.currentTarget.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (plan.highlighted) {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            } else {
              e.currentTarget.style.background = '#f7fafc';
              e.currentTarget.style.color = plan.color;
            }
          }}
        >
          {plan.price === '$0' ? freeCtaText : paidCtaText}
        </Button>

        {/* Features List */}
        <div style={{ textAlign: 'left' }}>
          <Text 
            strong 
            style={{ 
              display: 'block',
              marginBottom: '16px',
              color: '#1a202c',
              fontSize: '0.95rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            What's Included:
          </Text>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {plan.features.map((feature: string, idx: number) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <CheckCircleOutlined 
                  style={{ 
                    color: plan.color,
                    fontSize: '1.1rem',
                    marginTop: '2px',
                    flexShrink: 0,
                  }} 
                />
                <Text 
                  style={{ 
                    color: '#4a5568',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  {feature}
                </Text>
              </div>
            ))}
          </Space>
        </div>
      </Card>
    </Col>
  );
};

const PricingSection = () => {
  const [pricingData, setPricingData] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [freeCtaText, setFreeCtaText] = useState('Start Free Trial');
  const [paidCtaText, setPaidCtaText] = useState('Get Started');
  const [signupUrl, setSignupUrl] = useState('#');

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/section/pricing`);
        const data = await response.json();
        if (response.ok && data.content.plans && data.content.plans.length > 0) {
          setPricingData(data.content.plans);
        } else {
          // Fallback to hardcoded plans if no API data
          setPricingData(pricingPlans.map((plan, idx) => ({
            id: idx,
            name: plan.name,
            price: plan.price,
            period: plan.period || '',
            featured: plan.highlighted ? 1 : 0,
            features: plan.features
          })));
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
        // Fallback to hardcoded plans
        setPricingData(pricingPlans.map((plan, idx) => ({
          id: idx,
          name: plan.name,
          price: plan.price,
          period: plan.period || '',
          featured: plan.highlighted ? 1 : 0,
          features: plan.features
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/section/settings`);
        const data = await response.json();
        
        if (response.ok && data.content) {
          setFreeCtaText(data.content.pricing_free_cta_text || 'Start Free Trial');
          setPaidCtaText(data.content.pricing_paid_cta_text || 'Get Started');
          setSignupUrl(data.content.signup_url || '#');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '100px 20px',
      background: 'linear-gradient(180deg, #f7fafc 0%, #ffffff 50%, #f7fafc 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorations */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      <Row justify="center" style={{ marginBottom: '80px', position: 'relative', zIndex: 1 }}>
        <Col xs={22} sm={20} md={18} lg={14}>
          {/* Section Badge */}
          <div 
            className="reveal"
            style={{
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
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
              💎 Transparent Pricing
            </span>
          </div>

          {/* Main Title */}
          <Title 
            level={2} 
            className="reveal"
            style={{ 
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #1a202c 0%, #4a5568 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.3,
            }}
          >
            Choose Your Perfect Plan
          </Title>

          {/* Subtitle */}
          <Paragraph 
            className="reveal"
            style={{ 
              textAlign: 'center',
              fontSize: '1.2rem',
              color: '#4a5568',
              lineHeight: 1.8,
              maxWidth: '650px',
              margin: '0 auto',
            }}
          >
            All plans include Australian-hosted data encryption, unlimited support, and no minimum term. Start with a 30-day free trial.
          </Paragraph>
        </Col>
      </Row>

      {/* Pricing Cards */}
      <Row gutter={[32, 40]} justify="center" style={{ position: 'relative', zIndex: 1 }}>
        {(pricingData.length > 0 ? pricingData : pricingPlans).map((plan, index) => (
          <PricingCard 
            key={index} 
            plan={plan} 
            index={index}
            freeCtaText={freeCtaText}
            paidCtaText={paidCtaText}
            signupUrl={signupUrl}
          />
        ))}
      </Row>
    </div>
  );
};

export default PricingSection;
