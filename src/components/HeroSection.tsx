import { Row, Col, Button, Typography } from 'antd';
import { RocketOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HeroSection = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '100px 20px',
      textAlign: 'center',
      color: '#ffffff',
    }}>
      <Row justify="center">
        <Col xs={22} sm={20} md={16} lg={14}>
          <Title level={1} style={{ color: '#ffffff', fontSize: '3rem', marginBottom: '20px' }}>
            <HeartOutlined style={{ marginRight: '15px' }} />
            Welcome to ANTSA
          </Title>
          <Paragraph style={{
            fontSize: '1.3rem',
            color: '#ffffff',
            marginBottom: '30px',
            lineHeight: '1.8',
          }}>
            A digital mental health platform designed to reduce administrative burden 
            while strengthening therapeutic outcomes
          </Paragraph>
          <Paragraph style={{
            fontSize: '1.1rem',
            color: '#f0f0f0',
            marginBottom: '40px',
          }}>
            We bridge the gap between sessions so clients never feel alone in their care
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            style={{
              height: '50px',
              fontSize: '1.1rem',
              background: '#ffffff',
              color: '#667eea',
              border: 'none',
              fontWeight: 'bold',
            }}
          >
            Start 30-Day Free Trial
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default HeroSection;

