import { Row, Col, Card, Statistic, Typography } from 'antd';
import {
  FileTextOutlined,
  AppstoreOutlined,
  DollarOutlined,
  CommentOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { AuthContextType } from '../../pages/Admin';

const { Title, Paragraph } = Typography;

interface DashboardViewProps {
  auth: AuthContextType;
}

const DashboardView = ({ auth: _auth }: DashboardViewProps) => {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>Welcome to ANTSA Admin Panel</Title>
        <Paragraph style={{ fontSize: '1.1rem', color: '#666' }}>
          Manage all aspects of your landing page content, images, and settings from one central location.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Content Sections"
              value={7}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#48abe2' }}
            />
            <Paragraph style={{ marginTop: 8, marginBottom: 0, color: '#666' }}>
              Hero, Features, Pricing, Testimonials, Team, Contact, Footer
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Feature Items"
              value={6}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
            <Paragraph style={{ marginTop: 8, marginBottom: 0, color: '#666' }}>
              jAImee, AI Scribe, kAI, Dashboard, Client Tools, Homework
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Pricing Plans"
              value={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
            <Paragraph style={{ marginTop: 8, marginBottom: 0, color: '#666' }}>
              Create and manage your pricing tiers
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Testimonials"
              value={0}
              prefix={<CommentOutlined />}
              valueStyle={{ color: '#8b5cf6' }}
            />
            <Paragraph style={{ marginTop: 8, marginBottom: 0, color: '#666' }}>
              Add client success stories
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Team Members"
              value={0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#ec4899' }}
            />
            <Paragraph style={{ marginTop: 8, marginBottom: 0, color: '#666' }}>
              Showcase your team
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 32, background: '#f0fdf4', border: '1px solid #86efac' }}>
        <Title level={4} style={{ color: '#10b981', marginTop: 0 }}>
          🚀 Quick Start Guide
        </Title>
        <ul style={{ fontSize: '1rem', lineHeight: 1.8 }}>
          <li>Edit text content in the <strong>Hero Section</strong></li>
          <li>Customize feature cards in <strong>Features</strong></li>
          <li>Add pricing plans in <strong>Pricing</strong></li>
          <li>Upload images and manage media assets</li>
          <li>Change your password in <strong>Settings</strong></li>
        </ul>
      </Card>
    </div>
  );
};

export default DashboardView;

