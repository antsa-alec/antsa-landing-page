import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card } from 'antd';
import * as AntIcons from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface ShiftItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

interface SectionContent {
  badge?: string;
  title?: string;
  title_highlights?: string;
  subtitle?: string;
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
 * THE SHIFT SECTION - Problem statement cards
 * Shows 6 issues with current mental health care landscape
 */
const TheShiftSection = () => {
  const [items, setItems] = useState<ShiftItem[]>([]);
  const [sectionContent, setSectionContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/the-shift')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setSectionContent(data.content);
        }
        if (data.items) {
          setItems(data.items);
        }
      })
      .catch((err) => console.error('Failed to load The Shift content:', err))
      .finally(() => setLoading(false));
  }, []);

  const badge = sectionContent.badge || 'THE SHIFT IN MENTAL HEALTH CARE';
  const title = sectionContent.title || 'Mental health care has already moved. Systems have not.';
  const titleHighlights: string[] = sectionContent.title_highlights
    ? (typeof sectionContent.title_highlights === 'string' ? JSON.parse(sectionContent.title_highlights) : sectionContent.title_highlights)
    : ['already moved'];
  const subtitle = sectionContent.subtitle || 'Clients are using consumer AI tools, journalling apps, and chatbots between appointments. Conversations about distress, risk, and crisis are happening outside formal care pathways, without governance, or clinician visibility.';

  const defaultItems: ShiftItem[] = [
    { id: '1', title: 'Care Has Shifted', description: 'Mental health support increasingly happens between sessions. Clients reflect, disclose, and seek advice in real time, often outside the consulting room.', icon: 'SwapOutlined', color: '#48abe2' },
    { id: '2', title: 'AI Is Already In Use', description: 'People are turning to consumer-facing chatbots and digital tools for mental health support. These tools are widely accessible, immediate, and unregulated within clinical frameworks.', icon: 'RobotOutlined', color: '#8b5cf6' },
    { id: '3', title: 'No Early Warning', description: 'Deterioration often occurs between appointments. Without structured monitoring, clinicians have no timely visibility of escalating distress.', icon: 'WarningOutlined', color: '#f59e0b' },
    { id: '4', title: 'Risk Is Not Reliably Managed', description: 'Generative AI tools are not designed for structured risk assessment, escalation protocols, or duty-of-care frameworks. Distress can be reinforced rather than clinically managed.', icon: 'ExclamationCircleOutlined', color: '#ef4444' },
    { id: '5', title: 'Clinicians Are Being Cut Out', description: 'No visibility of what advice was given, how it was interpreted, or whether risk was present. Clinical judgement and formulation are excluded from digital interactions.', icon: 'DisconnectOutlined', color: '#ec4899' },
    { id: '6', title: 'No Governance Mechanism', description: 'Mental health conversations are occurring at scale without oversight, accountability, or system-level governance. Quality of care is reduced when digital support operates outside clinical control.', icon: 'AuditOutlined', color: '#06b6d4' },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  const renderIcon = (iconName: string, color?: string) => {
    const IconComponent = (AntIcons as any)[iconName] || AntIcons.StarOutlined;
    return <IconComponent style={{ fontSize: '28px', color: color || '#48abe2' }} />;
  };

  if (loading) return null;

  return (
    <section
      id="the-shift"
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
            {title.includes('Systems have not.') ? (
              <>
                <HighlightedText
                  text={title.split('Systems have not.')[0].trim()}
                  highlights={titleHighlights}
                />
                <br />
                Systems have not.
              </>
            ) : (
              <HighlightedText text={title} highlights={titleHighlights} />
            )}
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

        {/* Problem Cards Grid */}
        <Row gutter={[32, 32]}>
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
      </div>
    </section>
  );
};

export default TheShiftSection;
