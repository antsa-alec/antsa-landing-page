import { useEffect, useState } from 'react';
import { Typography, Layout, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface LegalPage {
  title: string;
  content: string;
  last_updated: string;
}

const TermsAndConditions = () => {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/legal/terms-and-conditions')
      .then((res) => res.json())
      .then((data) => {
        if (data.page) setPage(data.page);
      })
      .catch((err) => console.error('Failed to load terms:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Content style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#48abe2',
            fontSize: '15px',
            fontWeight: 500,
            marginBottom: '40px',
          }}
        >
          <ArrowLeftOutlined /> Back to Home
        </a>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Title level={1} style={{ fontSize: '40px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              {page?.title || 'Terms & Conditions'}
            </Title>

            {page?.last_updated && (
              <Paragraph style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px' }}>
                Last updated: {page.last_updated}
              </Paragraph>
            )}

            {page?.content ? (
              <div
                className="legal-content"
                style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8 }}
              >
                <Markdown remarkPlugins={[remarkGfm]}>{page.content}</Markdown>
              </div>
            ) : (
              <>
                <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8 }}>
                  These Terms and Conditions govern your use of the ANTSA platform operated by ANTSA Pty Ltd
                  (ABN: 77 664 161 237) (ACN: 664 161 237). By accessing or using ANTSA, you agree to be bound by these terms.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8 }}>
                  This page is a placeholder. The full terms and conditions will be published here prior to launch.
                  For questions, please contact us at{' '}
                  <a href="mailto:admin@antsa.com.au" style={{ color: '#48abe2' }}>admin@antsa.com.au</a>.
                </Paragraph>
              </>
            )}
          </>
        )}
      </Content>
    </Layout>
  );
};

export default TermsAndConditions;
