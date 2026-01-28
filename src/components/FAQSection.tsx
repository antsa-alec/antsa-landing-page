/**
 * FAQ SECTION - EXPANDABLE QUESTIONS
 * Features: Ant Design Collapse/Accordion, section title and subtitle, smooth animations
 */

import { useEffect, useState } from 'react';
import { Row, Col, Typography, Collapse, Spin } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Using relative URL so Vite proxy can handle the request
const API_BASE_URL = '/api';

interface FAQItem {
  id: number;
  section_id: number;
  question: string;
  answer: string;
  order_index: number;
}

interface SectionContent {
  title?: string;
  subtitle?: string;
}

const FAQSection = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [sectionContent, setSectionContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(true);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    let ignore = false;

    const fetchFAQ = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/faq`);
        const data = await response.json();
        
        if (!ignore && response.ok) {
          setFaqItems(data.items || []);
          setSectionContent(data.sectionContent || {});
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching FAQ:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchFAQ();

    return () => {
      ignore = true;
    };
  }, []);

  // Don't render section if no FAQ items
  if (!loading && faqItems.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '100px 20px', 
        textAlign: 'center',
        background: 'linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  const title = sectionContent.title || 'Frequently Asked Questions';
  const subtitle = sectionContent.subtitle || 'Everything you need to know about ANTSA';

  // Split FAQs into two columns for larger screens
  const midPoint = Math.ceil(faqItems.length / 2);
  const leftColumn = faqItems.slice(0, midPoint);
  const rightColumn = faqItems.slice(midPoint);

  const renderCollapseItem = (item: FAQItem) => ({
    key: item.id.toString(),
    label: (
      <span style={{ 
        fontWeight: 600, 
        fontSize: '1rem',
        color: '#1a202c',
      }}>
        {item.question}
      </span>
    ),
    children: (
      <Paragraph style={{ 
        color: '#4a5568',
        fontSize: '0.95rem',
        lineHeight: 1.8,
        marginBottom: 0,
      }}>
        {item.answer}
      </Paragraph>
    ),
  });

  return (
    <div 
      id="faq"
      style={{ 
        padding: '100px 20px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(72, 171, 226, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-5%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Section Header */}
      <Row justify="center" style={{ marginBottom: '60px', position: 'relative', zIndex: 1 }}>
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
              ❓ FAQ
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
            {title}
          </Title>

          {/* Subtitle */}
          <Paragraph 
            className="reveal"
            style={{ 
              textAlign: 'center',
              fontSize: '1.2rem',
              color: '#4a5568',
              lineHeight: 1.8,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            {subtitle}
          </Paragraph>
        </Col>
      </Row>

      {/* FAQ Accordion - Two Column Layout */}
      <Row gutter={[32, 32]} justify="center" style={{ position: 'relative', zIndex: 1 }}>
        <Col xs={22} sm={22} md={11} lg={10}>
          <div className="reveal-left">
            <Collapse
              accordion
              activeKey={activeKeys}
              onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
              expandIcon={({ isActive }) => (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isActive ? '#48abe2' : '#f7fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  {isActive ? (
                    <MinusOutlined style={{ color: '#ffffff', fontSize: '0.8rem' }} />
                  ) : (
                    <PlusOutlined style={{ color: '#48abe2', fontSize: '0.8rem' }} />
                  )}
                </div>
              )}
              expandIconPosition="end"
              items={leftColumn.map(renderCollapseItem)}
              style={{
                background: 'transparent',
                border: 'none',
              }}
              className="faq-collapse"
            />
          </div>
        </Col>
        
        <Col xs={22} sm={22} md={11} lg={10}>
          <div className="reveal-right">
            <Collapse
              accordion
              activeKey={activeKeys}
              onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : [keys])}
              expandIcon={({ isActive }) => (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isActive ? '#48abe2' : '#f7fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  {isActive ? (
                    <MinusOutlined style={{ color: '#ffffff', fontSize: '0.8rem' }} />
                  ) : (
                    <PlusOutlined style={{ color: '#48abe2', fontSize: '0.8rem' }} />
                  )}
                </div>
              )}
              expandIconPosition="end"
              items={rightColumn.map(renderCollapseItem)}
              style={{
                background: 'transparent',
                border: 'none',
              }}
              className="faq-collapse"
            />
          </div>
        </Col>
      </Row>

      {/* Custom CSS for Collapse styling */}
      <style>{`
        .faq-collapse .ant-collapse-item {
          background: #ffffff;
          border-radius: 12px !important;
          margin-bottom: 16px;
          border: 1px solid #e2e8f0 !important;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .faq-collapse .ant-collapse-item:hover {
          border-color: #48abe2 !important;
          box-shadow: 0 4px 15px rgba(72, 171, 226, 0.1);
        }

        .faq-collapse .ant-collapse-item-active {
          border-color: #48abe2 !important;
          box-shadow: 0 4px 20px rgba(72, 171, 226, 0.15);
        }

        .faq-collapse .ant-collapse-header {
          padding: 20px 24px !important;
          align-items: center !important;
        }

        .faq-collapse .ant-collapse-content {
          border-top: 1px solid #e2e8f0 !important;
        }

        .faq-collapse .ant-collapse-content-box {
          padding: 20px 24px !important;
          background: #fafafa;
        }

        .faq-collapse .ant-collapse-item:last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default FAQSection;
