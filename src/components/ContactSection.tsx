import { Row, Col, Typography, Space } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ContactSection = () => {
  return (
    <div style={{ padding: '80px 20px', background: '#ffffff' }}>
      <Row justify="center">
        <Col xs={22} sm={20} md={16}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
            Get in Touch
          </Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <EnvironmentOutlined style={{ fontSize: '2rem', color: '#1890ff', marginBottom: '10px' }} />
              <Paragraph style={{ fontSize: '1.1rem', marginBottom: '5px' }}>
                <Text strong>Address</Text>
              </Paragraph>
              <Text>P.O. Box 2324, Blackburn South, 3130, Victoria, AUSTRALIA</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <PhoneOutlined style={{ fontSize: '2rem', color: '#1890ff', marginBottom: '10px' }} />
              <Paragraph style={{ fontSize: '1.1rem', marginBottom: '5px' }}>
                <Text strong>Phone</Text>
              </Paragraph>
              <Text>+61 3 881 22 373</Text>
            </div>
            <div style={{ textAlign: 'center' }}>
              <MailOutlined style={{ fontSize: '2rem', color: '#1890ff', marginBottom: '10px' }} />
              <Paragraph style={{ fontSize: '1.1rem', marginBottom: '5px' }}>
                <Text strong>Email</Text>
              </Paragraph>
              <Text>info@antsa.com.au</Text>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ContactSection;

