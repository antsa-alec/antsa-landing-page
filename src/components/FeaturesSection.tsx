import { useEffect, useState } from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
  image_url?: string;
}

const accentColors = [
  '#48abe2',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#ec4899',
  '#06b6d4',
  '#ef4444',
  '#84cc16',
  '#6366f1',
];

const FeaturesSection = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/features')
      .then((res) => res.json())
      .then((data) => {
        const items = data.content?.items || data.items;
        if (items && items.length > 0) {
          setFeatures(items);
        }
      })
      .catch((err) => console.error('Failed to load features:', err))
      .finally(() => setLoading(false));
  }, []);

  const defaultFeatures: Feature[] = [
    {
      id: '1',
      title: 'Clinician-Overseen AI Chatbot',
      description: 'Assign the ANTSA chatbot to support clients between sessions as part of your treatment plan. It is activated by you and aligned to the client\u2019s goals and current needs.\n\nClients are informed that interactions form part of the clinical record and are visible to you. You can review conversations, provide feedback, and refine how the chatbot responds over time to ensure it operates within your clinical parameters.\n\nAll conversations sit within the client record. The chatbot does not diagnose, replace therapy, or function independently of your oversight. It extends structured support while keeping the practitioner in the loop.',
      icon: 'RobotOutlined',
    },
    {
      id: '2',
      title: 'Practitioner AI Assistant',
      description: 'A back-end AI assistant helps you review each client\u2019s recorded data within ANTSA before sessions, including client chatbot conversations, homework tasks such as journalling, mood entries, psychometrics, messaging, and recent engagement.\n\nIt brings this information together to highlight patterns, changes, and areas for discussion. It can also respond to practice-level queries, such as how many clients are scheduled today, or summarise activity across your caseload.\n\nIt does not determine risk, diagnose, or generate treatment plans. Clinical interpretation and decisions remain with you.',
      icon: 'BulbOutlined',
    },
    {
      id: '3',
      title: 'Single Integrated Clinical Record and Secure Messaging',
      description: 'Session notes, chatbot conversations, psychometrics, mood tracking, telehealth sessions, messaging, and uploaded documents sit within one secure client file.\n\nYou can upload reports, letters, and external documents directly into the record. Client communication occurs within the platform rather than across external tools, keeping conversations connected to care.\n\nThis reduces fragmentation and supports continuity, visibility, and professional documentation standards.',
      icon: 'FileProtectOutlined',
    },
    {
      id: '4',
      title: 'AI Scribe and Structured Templates',
      description: 'Generate structured session notes using clinical templates aligned with professional standards. The AI scribe can transcribe sessions, draft progress notes, and assist with multiple documentation formats depending on your preferred template.\n\nYou can also dictate private notes directly into the system, allowing you to capture reflections or observations that are not shared with the client. Templates support different clinical needs, including structured progress notes, summaries, and other documentation formats.\n\nAll notes remain editable, reviewable, and practitioner-approved before finalisation. The system assists with drafting, but responsibility for accuracy, interpretation, and clinical content remains with you.',
      icon: 'FileTextOutlined',
    },
    {
      id: '5',
      title: 'Telehealth, Calendar, and Session Summaries',
      description: 'Conduct secure video sessions within ANTSA. Use the integrated calendar to schedule appointments and generate telehealth links directly from the client record.\n\nAutomatic session summaries support accurate documentation and continuity of care, with sessions and scheduling connected within one system.',
      icon: 'VideoCameraOutlined',
    },
    {
      id: '6',
      title: 'Mood and Engagement Monitoring',
      description: 'Track mood entries and engagement patterns between sessions. Identify changes from baseline and shifts in participation earlier, supporting informed discussion and more focused sessions.\n\nClinical interpretation remains your responsibility.',
      icon: 'LineChartOutlined',
    },
    {
      id: '7',
      title: 'Homework, Between-Session Tasks, and Automated Reminders',
      description: 'Assign therapeutic tasks aligned with formulation, goals, and client capacity. Schedule reminders for homework, check-ins, and questionnaires within the treatment plan without manual follow-up.\n\nCompletion and engagement become visible within the client record, supporting continuity and therapeutic momentum.',
      icon: 'CheckSquareOutlined',
    },
    {
      id: '8',
      title: 'Psychometric Measures',
      description: 'Assign validated questionnaires within the system. Responses are stored directly in the client record for longitudinal comparison and integrated review alongside session notes and engagement data.',
      icon: 'FormOutlined',
    },
    {
      id: '9',
      title: 'Client-Facing App',
      description: 'ANTSA includes a secure client-facing application connected directly to your clinical system. Clients complete assigned tasks, mood tracking, psychometrics, psychoeducation, chatbot conversations, and telehealth sessions within the same environment.\n\nThese activities are accessed through the downloadable ANTSA mobile app, allowing clients to engage with their treatment plan from their own device between sessions.\n\nBetween-session care remains structured, visible, and connected to your record rather than occurring across disconnected apps.',
      icon: 'MobileOutlined',
    },
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  if (loading) return null;

  return (
    <section
      id="features"
      style={{
        background: '#f8fafc',
        padding: '120px 20px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
            FEATURES
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
            What{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ANTSA
            </span>{' '}
            includes.
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
            A governed digital mental health system that brings together the core tools practitioners use to support and monitor clients between appointments.
          </Paragraph>
        </div>

        {/* Alternating Feature Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {displayFeatures.map((feature, index) => {
            const color = feature.color || accentColors[index % accentColors.length];
            const imageOnLeft = index % 2 === 0;
            const hasImage = !!feature.image_url;

            const imageBlock = (
              <div
                style={{
                  flex: '0 0 auto',
                  width: '340px',
                  minHeight: '240px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: hasImage ? 'transparent' : `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                  border: hasImage ? 'none' : `1px solid ${color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {hasImage ? (
                  <img
                    src={feature.image_url}
                    alt={feature.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '16px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '20px',
                      background: `${color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
                        opacity: 0.8,
                      }}
                    />
                  </div>
                )}
              </div>
            );

            const textBlock = (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: `${color}12`,
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: color,
                    }}
                  />
                </div>
                <Title
                  level={3}
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '16px',
                  }}
                >
                  {feature.title}
                </Title>
                <Paragraph
                  style={{
                    fontSize: '15px',
                    color: '#64748b',
                    marginBottom: 0,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {feature.description}
                </Paragraph>
              </div>
            );

            return (
              <div
                key={feature.id}
                className="reveal"
                style={{
                  display: 'flex',
                  flexDirection: imageOnLeft ? 'row' : 'row-reverse',
                  gap: '48px',
                  alignItems: 'stretch',
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '40px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 50}ms`,
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 16px 40px ${color}12`;
                  e.currentTarget.style.borderColor = `${color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {imageBlock}
                {textBlock}
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          #features > div > div:last-child > div {
            flex-direction: column !important;
          }
          #features > div > div:last-child > div > div:first-child {
            width: 100% !important;
            min-height: 180px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
