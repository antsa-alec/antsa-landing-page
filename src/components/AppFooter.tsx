import { Layout, Row, Col, Typography, Space } from 'antd';
import { GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Footer style={{ background: '#001529', padding: '40px 20px', textAlign: 'center' }}>
      <Row justify="center">
        <Col xs={22} sm={20} md={16}>
          <Space size="large" style={{ marginBottom: '20px' }}>
            <GithubOutlined style={{ fontSize: '1.5rem', color: '#ffffff', cursor: 'pointer' }} />
            <LinkedinOutlined style={{ fontSize: '1.5rem', color: '#ffffff', cursor: 'pointer' }} />
            <TwitterOutlined style={{ fontSize: '1.5rem', color: '#ffffff', cursor: 'pointer' }} />
          </Space>
          <div style={{ marginBottom: '20px' }}>
            <Space split="|" size="large">
              <Link style={{ color: '#ffffff' }}>Privacy Policy</Link>
              <Link style={{ color: '#ffffff' }}>Terms of Service</Link>
              <Link style={{ color: '#ffffff' }}>Support</Link>
              <Link style={{ color: '#ffffff' }}>About Us</Link>
            </Space>
          </div>
          <Text style={{ color: '#8c8c8c' }}>
            © {currentYear} ANTSA. All rights reserved. | Data encrypted and hosted in Australia
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;

