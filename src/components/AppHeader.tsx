import { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header } = Layout;

/**
 * APP HEADER - Clean navigation with logo
 * Responsive mobile menu
 */
const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: MenuProps['items'] = [
    {
      key: 'product',
      label: <a href="#features">Product</a>,
    },
    {
      key: 'docs',
      label: <a href="#pricing">Docs</a>,
    },
    {
      key: 'blog',
      label: <a href="#faq">Blog</a>,
    },
    {
      key: 'community',
      label: <a href="#testimonials">Community</a>,
    },
    {
      key: 'company',
      label: <a href="#contact">Company</a>,
    },
  ];

  return (
    <>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: '#ffffff',
          boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            📊
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            SaaS Template
          </span>
        </div>

        {/* Desktop Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '15px',
              fontWeight: 500,
            }}
            className="desktop-menu"
          />

          {/* Auth Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
            className="desktop-auth"
          >
            <Button
              type="text"
              style={{
                fontSize: '15px',
                fontWeight: 500,
                color: '#0f172a',
              }}
            >
              Sign In
            </Button>
            <Button
              type="primary"
              style={{
                background: '#0f172a',
                border: 'none',
                fontSize: '15px',
                fontWeight: 500,
                borderRadius: '8px',
                height: '40px',
                padding: '0 24px',
              }}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            className="mobile-menu-button"
            type="text"
            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
            onClick={() => setMobileMenuOpen(true)}
            style={{
              display: 'none',
            }}
          />
        </div>
      </Header>

      {/* Mobile Drawer Menu */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
              }}
            >
              📊
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>SaaS Template</span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        closeIcon={<CloseOutlined />}
      >
        <Menu
          mode="vertical"
          items={menuItems}
          style={{
            border: 'none',
            fontSize: '16px',
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            type="text"
            block
            style={{
              fontSize: '16px',
              fontWeight: 500,
              height: '48px',
            }}
          >
            Sign In
          </Button>
          <Button
            type="primary"
            block
            style={{
              background: '#0f172a',
              border: 'none',
              fontSize: '16px',
              fontWeight: 500,
              height: '48px',
              borderRadius: '8px',
            }}
          >
            Sign Up
          </Button>
        </div>
      </Drawer>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-menu,
          .desktop-auth {
            display: none !important;
          }
          .mobile-menu-button {
            display: inline-flex !important;
          }
        }

        .ant-menu-horizontal .ant-menu-item,
        .ant-menu-horizontal .ant-menu-submenu {
          border-bottom: none !important;
        }

        .ant-menu-horizontal .ant-menu-item:hover,
        .ant-menu-horizontal .ant-menu-item-selected {
          color: #a855f7 !important;
          border-bottom: none !important;
        }

        .ant-menu-horizontal .ant-menu-item::after {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default AppHeader;
