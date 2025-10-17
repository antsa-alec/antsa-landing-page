import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Typography, message, Spin } from 'antd';
import {
  LogoutOutlined,
  DashboardOutlined,
  RocketOutlined,
  AppstoreOutlined,
  DollarOutlined,
  CommentOutlined,
  TeamOutlined,
  PhoneOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import LoginPage from '../components/admin/LoginPage';
import DashboardView from '../components/admin/DashboardView';
import HeroEditor from '../components/admin/HeroEditor';
import FeaturesEditor from '../components/admin/FeaturesEditor';
import PricingEditor from '../components/admin/PricingEditor';
import TestimonialsEditor from '../components/admin/TestimonialsEditor';
import TeamEditor from '../components/admin/TeamEditor';
import ContactEditor from '../components/admin/ContactEditor';
import SettingsView from '../components/admin/SettingsView';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Using relative URL so Vite proxy can handle the request
const API_BASE_URL = '/api';

export interface AuthContextType {
  token: string | null;
  user: { id: number; username: string } | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

const Admin = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token is invalid
          localStorage.removeItem('admin_token');
          setToken(null);
          message.error('Session expired. Please login again.');
        }
      } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('admin_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleLogin = (newToken: string, userData: any) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('admin_token', newToken);
    message.success('Login successful!');
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_token');
    message.info('Logged out successfully');
  };

  const authContext: AuthContextType = {
    token,
    user,
    login: handleLogin,
    logout: handleLogout,
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!token || !user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'hero', icon: <RocketOutlined />, label: 'Hero Section' },
    { key: 'features', icon: <AppstoreOutlined />, label: 'Features' },
    { key: 'pricing', icon: <DollarOutlined />, label: 'Pricing' },
    { key: 'testimonials', icon: <CommentOutlined />, label: 'Testimonials' },
    { key: 'team', icon: <TeamOutlined />, label: 'Team' },
    { key: 'contact', icon: <PhoneOutlined />, label: 'Contact' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'dashboard':
        return <DashboardView auth={authContext} />;
      case 'hero':
        return <HeroEditor auth={authContext} />;
      case 'features':
        return <FeaturesEditor auth={authContext} />;
      case 'pricing':
        return <PricingEditor auth={authContext} />;
      case 'testimonials':
        return <TestimonialsEditor auth={authContext} />;
      case 'team':
        return <TeamEditor auth={authContext} />;
      case 'contact':
        return <ContactEditor auth={authContext} />;
      case 'settings':
        return <SettingsView auth={authContext} />;
      default:
        return <DashboardView auth={authContext} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        style={{
          background: '#001529',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Title level={4} style={{ color: '#48abe2', margin: 0 }}>
            ANTSA Admin
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          items={menuItems}
          onClick={({ key }) => setSelectedMenu(key)}
          style={{ marginTop: 16 }}
        />
      </Sider>

      <Layout style={{ marginLeft: 250 }}>
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <Title level={5} style={{ margin: 0 }}>
            {menuItems.find(item => item.key === selectedMenu)?.label || 'Dashboard'}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: '#666' }}>Welcome, {user.username}</span>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content style={{
          margin: '24px',
          padding: 24,
          background: '#fff',
          minHeight: 'calc(100vh - 112px)',
          borderRadius: 8,
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
export { API_BASE_URL };

