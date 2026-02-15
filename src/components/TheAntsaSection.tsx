import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card } from 'antd';
import * as AntIcons from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface SolutionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

interface CareLoopStep {
  step: string;
  title: string;
  description: string;
}

interface SectionContent {
  badge?: string;
  title?: string;
  title_highlights?: string;
  subtitle?: string;
  care_loop_title?: string;
  care_loop_subtitle?: string;
  care_loop_steps?: string;
}

/**
 * Renders text with highlighted phrases in brand gradient
 */
const HighlightedText = ({ text, highlights }: { text: string; highlights: string[] }) => {
  if (!highlights || highlights.length === 0) return <>{text}</>;
  const escapedHighlights = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => {
        const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
        if (isHighlight) {
          return (
            <span
              key={i}
              style={{
                background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

/**
 * Renders text with specific phrases highlighted in brand blue
 */
const BlueHighlight = ({ text, phrases }: { text: string; phrases: string[] }) => {
  if (!phrases || phrases.length === 0) return <>{text}</>;
  const escaped = phrases.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = phrases.some(p => p.toLowerCase() === part.toLowerCase());
        return isMatch ? (
          <span key={i} style={{ color: '#48abe2', fontWeight: 600 }}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
};

/**
 * Renders "ANTSA" with "SA" in brand blue
 */
const AntsaBrand = () => (
  <span>ANT<span style={{ color: '#48abe2' }}>SA</span></span>
);

// Blue phrases for each care loop step description (by index)
const stepHighlights: Record<number, string[]> = {
  0: ['clinically appropriate between-session supports'],
  1: ['therapeutic activities between sessions', 'AI-assisted support'],
  2: ['identify patterns, progress, and signs of distress'],
  3: ['respond sooner to emerging needs'],
};

// Colors for care loop steps
const stepColors = ['#48abe2', '#10b981', '#8b5cf6', '#f59e0b'];
const stepIcons = ['ScheduleOutlined', 'InteractionOutlined', 'FundViewOutlined', 'SyncOutlined'];

/**
 * THE ANTSA SECTION - Solution statement cards + Clinical Care Loop
 */
const TheAntsaSection = () => {
  const [items, setItems] = useState<SolutionItem[]>([]);
  const [sectionContent, setSectionContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/the-antsa')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setSectionContent(data.content);
        }
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch((err) => console.error('Failed to load The ANTSA content:', err))
      .finally(() => setLoading(false));
  }, []);

  const badge = sectionContent.badge || 'PROBLEM? WE HAVE THE ANTSA';
  const title = sectionContent.title || 'The system that brings clinicians back into the loop.';
  const titleHighlights: string[] = sectionContent.title_highlights
    ? (typeof sectionContent.title_highlights === 'string' ? JSON.parse(sectionContent.title_highlights) : sectionContent.title_highlights)
    : ['into the loop'];
  const subtitle = sectionContent.subtitle || 'Between-session care should not sit outside governance. It should sit inside your clinical system. ANTSA is purpose-built infrastructure for modern mental health practice.';

  const careLoopTitle = sectionContent.care_loop_title || 'The ANTSA structured clinical care loop.';
  const careLoopSubtitle = sectionContent.care_loop_subtitle || 'One loop. One record. Human oversight.';

  let careLoopSteps: CareLoopStep[] = [];
  try {
    const raw = sectionContent.care_loop_steps;
    careLoopSteps = raw
      ? (typeof raw === 'string' ? JSON.parse(raw) : raw)
      : [];
  } catch {
    careLoopSteps = [];
  }

  if (careLoopSteps.length === 0) {
    careLoopSteps = [
      { step: '01', title: 'Assign', description: "The practitioner assigns clinically appropriate between-session supports, including optional AI-assisted support, aligned to the client's treatment plan, goals, and current level of risk." },
      { step: '02', title: 'Engage', description: 'The client engages with therapeutic activities between sessions and can access assigned AI-assisted support at any time, providing continuity and support outside appointments without replacing human care.' },
      { step: '03', title: 'Monitor', description: 'The practitioner can monitor client engagement, mood data, journalling, and interactions with assigned supports to identify patterns, progress, and signs of distress, all within a single integrated record.' },
      { step: '04', title: 'Review', description: 'The practitioner uses between-session insights to respond sooner to emerging needs rather than waiting for the next session. This supports earlier, more proportionate clinical responses.' },
    ];
  }

  const defaultItems: SolutionItem[] = [
    { id: '1', title: 'Between-Session Visibility', description: 'Mood tracking, engagement data and structured inputs give you insight into what is happening between sessions. You see patterns early, not after escalation.', icon: 'EyeOutlined', color: '#48abe2' },
    { id: '2', title: 'Practitioner-Governed AI', description: 'AI conversations are assigned by you. Interactions can be reviewed. Oversight remains with the practitioner. This is supported digital care, not independent AI advice.', icon: 'SafetyCertificateOutlined', color: '#10b981' },
    { id: '3', title: 'Structured Risk Awareness', description: 'ANTSA is designed with clinical escalation logic in mind. It supports early identification of deterioration rather than reactive crisis response.', icon: 'AlertOutlined', color: '#f59e0b' },
    { id: '4', title: 'Integrated Client Record', description: 'Client activity, tasks, and interactions are recorded within the clinical system. Between-session care becomes visible, accountable, and ethically contained.', icon: 'FileProtectOutlined', color: '#8b5cf6' },
    { id: '5', title: 'Reduced Administrative Burden', description: 'Integrated AI scribe, secure communication, telehealth, and client engagement tools sit in one system. Fewer subscriptions. Fewer logins. Less duplication.', icon: 'DashboardOutlined', color: '#ec4899' },
    { id: '6', title: 'Governance By Design', description: 'Built by clinicians. Hosted securely in Australia. Aligned with professional standards and digital health responsibilities.', icon: 'ShieldOutlined', color: '#06b6d4' },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  const renderIcon = (iconName: string, color?: string) => {
    const IconComponent = (AntIcons as any)[iconName] || AntIcons.StarOutlined;
    return <IconComponent style={{ fontSize: '28px', color: color || '#48abe2' }} />;
  };

  if (loading) return null;

  return (
    <section
      id="the-antsa"
      style={{
        background: '#f8fafc',
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
            {badge}
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
            <HighlightedText text={title} highlights={titleHighlights} />
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </Paragraph>
        </div>

        {/* Solution Cards Grid */}
        <Row gutter={[32, 32]} style={{ marginBottom: '120px' }}>
          {displayItems.map((item, index) => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card
                className="reveal"
                style={{
                  height: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  background: '#ffffff',
                  padding: '32px 24px',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 50}ms`,
                  borderTop: `3px solid ${item.color || '#48abe2'}`,
                }}
                bodyStyle={{ padding: 0 }}
                bordered={false}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  {renderIcon(item.icon, item.color)}
                </div>
                <Title
                  level={4}
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '12px',
                  }}
                >
                  {item.title}
                </Title>
                <Paragraph
                  style={{
                    fontSize: '15px',
                    color: '#64748b',
                    marginBottom: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {item.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ============================================ */}
        {/* CLINICAL CARE LOOP SUBSECTION */}
        {/* ============================================ */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Title
            level={2}
            className="reveal"
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
              maxWidth: '900px',
              margin: '0 auto 16px',
            }}
          >
            The ANTSA structured{' '}
            <span style={{ color: '#48abe2' }}>clinical care loop</span>.
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: '20px',
              color: '#64748b',
              fontWeight: 600,
              margin: '0 auto',
            }}
          >
            {careLoopSubtitle}
          </Paragraph>
        </div>

        {/* Care Loop Visual -- connected steps */}
        <div
          className="reveal"
          style={{
            position: 'relative',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          <Row gutter={[24, 24]}>
            {careLoopSteps.map((step, index) => {
              const StepIcon = (AntIcons as any)[stepIcons[index]] || AntIcons.StarOutlined;
              return (
                <Col xs={24} sm={12} lg={6} key={step.step}>
                  <div
                    style={{
                      textAlign: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Step Number Circle */}
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${stepColors[index]} 0%, ${stepColors[index]}88 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        position: 'relative',
                      }}
                    >
                      <StepIcon style={{ fontSize: '32px', color: '#ffffff' }} />
                      {/* Connector arrow (not on last item) */}
                      {index < careLoopSteps.length - 1 && (
                        <div
                          className="care-loop-connector"
                          style={{
                            position: 'absolute',
                            right: '-60%',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#cbd5e1',
                            fontSize: '24px',
                            fontWeight: 700,
                          }}
                        >
                          &rarr;
                        </div>
                      )}
                    </div>

                    {/* Step Label */}
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: stepColors[index],
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {step.step}
                    </div>

                    <Title
                      level={4}
                      style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '12px',
                      }}
                    >
                      {step.title}
                    </Title>

                    <Paragraph
                      style={{
                        fontSize: '14px',
                        color: '#64748b',
                        lineHeight: 1.65,
                        marginBottom: 0,
                      }}
                    >
                      <BlueHighlight
                        text={step.description}
                        phrases={stepHighlights[index] || []}
                      />
                    </Paragraph>
                  </div>
                </Col>
              );
            })}
          </Row>

          {/* Loop-back arrow visual */}
          <div
            className="care-loop-return reveal"
            style={{
              textAlign: 'center',
              marginTop: '32px',
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 24px',
              borderRadius: '20px',
              background: '#f1f5f9',
            }}>
              <AntIcons.RedoOutlined style={{ fontSize: '16px' }} />
              Continuous clinical care loop
            </div>
          </div>
        </div>
      </div>

      {/* Hide connectors on mobile */}
      <style>{`
        @media (max-width: 576px) {
          .care-loop-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TheAntsaSection;
