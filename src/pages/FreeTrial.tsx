import { ConfigProvider, Layout, Typography, Button, Space, Row, Col } from 'antd';
import {
  RobotOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  MessageOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import '../styles/global.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const REGISTRATION_URL = 'https://au.antsa.ai/sign-up';

const theme = {
  token: {
    colorPrimary: '#48abe2',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#48abe2',
    colorTextBase: '#0f172a',
    colorBgBase: '#ffffff',
    borderRadius: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.6,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#ffffff',
    },
  },
};

const features = [
  {
    icon: <RobotOutlined style={{ fontSize: '28px', color: '#48abe2' }} />,
    title: 'ANTSAbot AI assistant',
    description: 'A clinician-overseen chatbot that supports your clients between sessions, aligned to their treatment goals and visible in the clinical record.',
  },
  {
    icon: <FileTextOutlined style={{ fontSize: '28px', color: '#8b5cf6' }} />,
    title: 'AI Scribe & Templates',
    description: 'Generate structured session notes using clinical templates. Transcribe sessions, draft progress notes, and dictate private reflections.',
  },
  {
    icon: <VideoCameraOutlined style={{ fontSize: '28px', color: '#10b981' }} />,
    title: 'Telehealth & Scheduling',
    description: 'Conduct secure video sessions with integrated calendar, appointment scheduling, and automatic session summaries.',
  },
  {
    icon: <MessageOutlined style={{ fontSize: '28px', color: '#f59e0b' }} />,
    title: 'Secure Messaging',
    description: 'Communicate with clients within the platform. Conversations stay connected to the clinical record, not scattered across external tools.',
  },
  {
    icon: <LineChartOutlined style={{ fontSize: '28px', color: '#ec4899' }} />,
    title: 'Mood & Engagement Tracking',
    description: 'Monitor mood entries and engagement patterns between sessions. Identify shifts in participation and baseline changes early.',
  },
  {
    icon: <SafetyCertificateOutlined style={{ fontSize: '28px', color: '#06b6d4' }} />,
    title: 'Psychometric Measures',
    description: 'Assign validated questionnaires stored directly in the client record for longitudinal comparison and integrated review.',
  },
];

const trialIncludes = [
  'Full platform access for 14 days',
  'Up to 3 active clients',
  'AI Scribe and clinical templates',
  'ANTSAbot AI assistant for client support',
  'Telehealth and session summaries',
  'Mood tracking and psychometrics',
  'Secure messaging and homework tasks',
  'Psychoeducation library',
  'No credit card required upfront',
];

const FreeTrial = () => {
  return (
    <ConfigProvider theme={theme}>
      <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
        <AppHeader />
        <Content style={{ marginTop: '70px' }}>
          {/* Hero Section */}
          <section
            style={{
              background: 'linear-gradient(160deg, #e0effe 0%, #f0f4ff 30%, #ffffff 60%, #f5f0ff 100%)',
              padding: '120px 20px 100px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-200px',
                right: '-200px',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(72, 171, 226, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                  color: '#ffffff',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '32px',
                }}
              >
                Free 14-Day Trial
              </div>
              <Title
                level={1}
                style={{
                  fontSize: 'clamp(32px, 5vw, 52px)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: '#0f172a',
                  marginBottom: '24px',
                  letterSpacing: '-0.02em',
                }}
              >
                Experience the full{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  ANTSA platform
                </span>
                {' '}before you commit.
              </Title>
              <Paragraph
                style={{
                  fontSize: 'clamp(16px, 2.5vw, 19px)',
                  color: '#475569',
                  maxWidth: '750px',
                  margin: '0 auto 40px',
                  lineHeight: 1.75,
                }}
              >
                ANTSA is an Australian-built digital mental health system designed to support safe, supervised care between appointments. Try every feature free for 14 days with up to 3 clients.
              </Paragraph>
              <Space size="large" wrap style={{ justifyContent: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  style={{
                    height: '60px',
                    padding: '0 44px',
                    fontSize: '18px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                    border: 'none',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(72, 171, 226, 0.4)',
                  }}
                  href={REGISTRATION_URL}
                >
                  Start Your Free Trial
                </Button>
              </Space>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClockCircleOutlined /> 14-day free trial
                </span>
                <span style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TeamOutlined /> Up to 3 clients
                </span>
                <span style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <SafetyCertificateOutlined /> No credit card required
                </span>
              </div>
            </div>
          </section>

          {/* What is ANTSA Section */}
          <section style={{ background: '#ffffff', padding: '100px 20px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
              <Title
                level={5}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#48abe2',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                ABOUT ANTSA
              </Title>
              <Title
                level={2}
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '24px',
                  letterSpacing: '-0.02em',
                }}
              >
                What is ANTSA?
              </Title>
              <Paragraph
                style={{
                  fontSize: '17px',
                  color: '#475569',
                  lineHeight: 1.8,
                  maxWidth: '800px',
                  margin: '0 auto',
                }}
              >
                ANTSA is a comprehensive digital mental health platform built in Australia for mental health practitioners.
                It brings AI within clinical governance, records, and duty-of-care frameworks, rather than leaving clients
                to use unregulated tools on their own. From AI-powered session notes to clinician-overseen chatbots,
                telehealth, psychometrics, and secure messaging, ANTSA integrates everything into a single clinical record
                so practitioners stay in the loop when care happens between sessions.
              </Paragraph>
            </div>
          </section>

          {/* Key Features Grid */}
          <section style={{ background: '#f8fafc', padding: '100px 20px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <Title
                  level={5}
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#48abe2',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  KEY FEATURES
                </Title>
                <Title
                  level={2}
                  style={{
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '16px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Everything you need in{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    one platform
                  </span>.
                </Title>
              </div>
              <Row gutter={[32, 32]}>
                {features.map((feature, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '32px 28px',
                        border: '1px solid #e2e8f0',
                        height: '100%',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '14px',
                          background: '#f0f9ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '20px',
                        }}
                      >
                        {feature.icon}
                      </div>
                      <Title
                        level={4}
                        style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#0f172a',
                          marginBottom: '12px',
                        }}
                      >
                        {feature.title}
                      </Title>
                      <Paragraph
                        style={{
                          fontSize: '14px',
                          color: '#64748b',
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {feature.description}
                      </Paragraph>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          {/* What the Trial Includes */}
          <section style={{ background: '#ffffff', padding: '100px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <Title
                  level={5}
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#48abe2',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  FREE TRIAL
                </Title>
                <Title
                  level={2}
                  style={{
                    fontSize: 'clamp(28px, 4vw, 40px)',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '16px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  What's included in the trial?
                </Title>
                <Paragraph
                  style={{
                    fontSize: '17px',
                    color: '#64748b',
                    lineHeight: 1.7,
                  }}
                >
                  Full access to every feature, no restrictions. Just sign up and start using ANTSA with your clients.
                </Paragraph>
              </div>
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '20px',
                  padding: '40px',
                  border: '1px solid #e2e8f0',
                }}
              >
                {trialIncludes.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 0',
                      borderBottom: index < trialIncludes.length - 1 ? '1px solid #e2e8f0' : 'none',
                    }}
                  >
                    <CheckCircleOutlined style={{ fontSize: '20px', color: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: '16px', color: '#334155', fontWeight: 500 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              padding: '100px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <Title
                level={2}
                style={{
                  fontSize: 'clamp(28px, 4vw, 40px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '20px',
                  letterSpacing: '-0.02em',
                }}
              >
                Ready to get started?
              </Title>
              <Paragraph
                style={{
                  fontSize: '17px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '36px',
                  lineHeight: 1.7,
                }}
              >
                Join mental health practitioners across Australia who are using ANTSA to support supervised, between-session care. Start your free 14-day trial today.
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                style={{
                  height: '60px',
                  padding: '0 44px',
                  fontSize: '18px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                  border: 'none',
                  color: '#ffffff',
                  boxShadow: '0 8px 24px rgba(72, 171, 226, 0.4)',
                }}
                href={REGISTRATION_URL}
              >
                Start Your Free Trial
              </Button>
            </div>
          </section>
        </Content>
        <AppFooter />
      </Layout>
    </ConfigProvider>
  );
};

export default FreeTrial;
