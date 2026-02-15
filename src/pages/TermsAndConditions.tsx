import { Typography, Layout } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const TermsAndConditions = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Content style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
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

        <Title level={1} style={{ fontSize: '40px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          Terms &amp; Conditions
        </Title>

        <Paragraph style={{ fontSize: '16px', color: '#64748b', marginBottom: '40px' }}>
          Last updated: February 2026
        </Paragraph>

        <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8 }}>
          These Terms and Conditions govern your use of the ANTSA platform operated by ANTSA Pty Ltd
          (ABN: 77 664 161 237) (ACN: 664 161 237). By accessing or using ANTSA, you agree to be bound by these terms.
        </Paragraph>

        <Paragraph style={{ fontSize: '16px', color: '#475569', lineHeight: 1.8 }}>
          This page is a placeholder. The full terms and conditions will be published here prior to launch.
          For questions, please contact us at{' '}
          <a href="mailto:admin@antsa.com.au" style={{ color: '#48abe2' }}>admin@antsa.com.au</a>.
        </Paragraph>
      </Content>
    </Layout>
  );
};

export default TermsAndConditions;
