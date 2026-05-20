import { Typography, Layout } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

type LegalPage = { title: string; content: string; last_updated: string };

export default function PrivacyPolicy({ page = null }: { page?: LegalPage | null }) {
  if (!page) {
    return (
      <Content style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <Paragraph>Privacy policy content is not currently available.</Paragraph>
      </Content>
    );
  }
  return (
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
          textDecoration: 'none',
        }}
      >
        <ArrowLeftOutlined /> Back to Home
      </a>
      <Title level={1} style={{ fontSize: '40px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
        {page.title}
      </Title>
      <Paragraph style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px' }}>
        Last updated: {page.last_updated}
      </Paragraph>
      <div className="legal-content" style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8 }}>
        <Markdown remarkPlugins={[remarkGfm]}>{page.content}</Markdown>
      </div>
    </Content>
  );
}
