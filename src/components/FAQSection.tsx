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
 * FAQ SECTION - Simple accordion design
 */
const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/faq')
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          // Transform to match component interface
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

  // Default FAQs
  const defaultFaqs: FAQ[] = [
    {
      id: '1',
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: '2',
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: '3',
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: '4',
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: '5',
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: '6',
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  if (loading) {
    return null;
  }

  return (
    <section
      id="faq"
      style={{
        background: '#f8fafc',
        padding: '120px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
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
            Find answers to common questions about our platform.
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
                    fontSize: '18px',
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
                marginBottom: '16px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
              }}
            >
              <Paragraph
                style={{
                  fontSize: '16px',
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
