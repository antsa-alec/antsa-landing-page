import { useEffect, useState } from 'react';
import { Typography, Collapse } from 'antd';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

/**
 * FAQ SECTION - Accordion with small blue section label
 */
const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/faq')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          const transformedFaqs = data.items.map((item: any) => ({
            id: String(item.id),
            question: item.question,
            answer: item.answer,
          }));
          setFaqs(transformedFaqs);
        }
      })
      .catch((err) => console.error('Failed to load FAQs:', err))
      .finally(() => setLoading(false));
  }, []);

  const defaultFaqs: FAQ[] = [
    { id: '1', question: 'Is ANTSA a therapy replacement?', answer: 'No. ANTSA supports care between sessions. Clinical judgement, formulation, and responsibility remain with the practitioner. AI support is assigned and overseen within defined clinical parameters. Practitioners control access. Clients are invited into the system by their practitioner and engage only with assigned supports.' },
    { id: '2', question: 'Does ANTSA diagnose mental health conditions?', answer: 'No. ANTSA is a practitioner-governed digital support system. It does not diagnose, independently treat, or make autonomous clinical decisions. Practitioners remain responsible for clinical decision-making.' },
    { id: '3', question: 'How is ANTSA different from consumer AI tools?', answer: 'Consumer tools operate outside clinical systems. ANTSA sits inside your practice workflow. You assign supports, monitor engagement, review interactions, and retain accountability within a single integrated record.' },
    { id: '4', question: 'How does ANTSA help with risk management?', answer: 'ANTSA provides structured visibility into mood data, engagement patterns, and client interactions between sessions. This supports earlier identification of deterioration rather than reactive crisis response.' },
    { id: '5', question: 'Is the AI supervised in real time?', answer: 'No. Practitioners can review interactions after they occur. Oversight, feedback, and adjustment remain in your control.' },
    { id: '6', question: 'Is client data secure?', answer: 'Yes. ANTSA is hosted on secure Australian servers and aligned with Australian Privacy Principles and professional standards. Data is contained within your governed clinical system.' },
    { id: '7', question: 'Does ANTSA replace practitioner responsibility?', answer: 'No. Clinical judgement, regulatory compliance, and duty of care remain with the practitioner at all times. ANTSA is practitioner-controlled infrastructure. Compliance alignment reflects system design and data handling practices, not a transfer of professional responsibility.' },
    { id: '8', question: 'What happens if a client discloses risk in the platform?', answer: 'ANTSA supports visibility and structured monitoring. It does not replace crisis services. Practitioners retain responsibility for clinical response and escalation according to their professional standards.' },
    { id: '9', question: 'Does ANTSA include telehealth and note-taking?', answer: 'Yes. Telehealth, AI scribe, client engagement tools, mood tracking, and AI-assisted support are included within one system. There are no add-on feature tiers.' },
    { id: '10', question: 'Can ANTSA be used without assigning the AI chatbot?', answer: 'Yes. All AI-assisted components are practitioner-assigned. The system can be used for engagement, mood tracking, telehealth, and documentation without AI support if preferred.' },
    { id: '11', question: 'Can ANTSA be used in group practices or organisations?', answer: 'Yes. ANTSA supports solo practitioners, group practices and larger services. It is designed as governed infrastructure, making it suitable for structured service environments.' },
    { id: '12', question: 'Is client data used to train external AI models?', answer: 'No. Client data remains within the governed system and is not used to train public or external AI models.' },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  if (loading) return null;

  return (
    <section
      id="faq"
      style={{
        background: '#f8fafc',
        padding: '120px 20px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
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
            FAQ
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
            Frequently Asked Questions
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Find answers to common questions about ANTSA.
          </Paragraph>
        </div>

        {/* FAQ Accordion */}
        <Collapse
          className="reveal faq-collapse"
          bordered={false}
          expandIconPosition="end"
          style={{
            background: 'transparent',
          }}
        >
          {displayFaqs.map((faq) => (
            <Panel
              header={
                <Title
                  level={5}
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#0f172a',
                    margin: 0,
                  }}
                >
                  {faq.question}
                </Title>
              }
              key={faq.id}
              style={{
                marginBottom: '12px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
            >
              <Paragraph
                style={{
                  fontSize: '15px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {faq.answer}
              </Paragraph>
            </Panel>
          ))}
        </Collapse>
      </div>
    </section>
  );
};

export default FAQSection;
