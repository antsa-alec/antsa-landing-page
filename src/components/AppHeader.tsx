import { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import antsaIcon from '../assets/antsa-icon.png';

const { Header } = Layout;

const SIGNUP_URL = 'https://au.antsa.ai/sign-in';
const SIGNIN_URL = 'https://au.antsa.ai/sign-in';

/**
 * APP HEADER - Clean navigation with logo
 * Responsive mobile menu
 */
const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      label: <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>,
    },
    {
      key: 'the-shift',
      label: <a href="#the-shift">The Shift</a>,
    },
    {
      key: 'the-antsa',
      label: <a href="#the-antsa">The ANTSA</a>,
    },
    {
      key: 'features',
      label: <a href="#features">Features</a>,
    },
    {
      key: 'team',
      label: <a href="#team">Our Team</a>,
    },
    {
      key: 'pricing',
      label: <a href="#pricing">Pricing</a>,
    },
    {
      key: 'faq',
      label: <a href="#faq">FAQ</a>,
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
          <img 
            src={antsaIcon} 
            alt="ANTSA" 
            style={{
              height: '40px',
              width: '40px',
              borderRadius: '10px',
              objectFit: 'contain',
            }}
          />
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
              href={SIGNIN_URL}
            >
              Sign In
            </Button>
            <Button
              type="primary"
              style={{
                background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                border: 'none',
                fontSize: '15px',
                fontWeight: 500,
                borderRadius: '8px',
                height: '40px',
                padding: '0 24px',
              }}
              href={SIGNUP_URL}
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
            <img 
              src={antsaIcon} 
              alt="ANTSA" 
              style={{
                height: '32px',
                width: '32px',
                borderRadius: '6px',
                objectFit: 'contain',
              }}
            />
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
            href={SIGNIN_URL}
          >
            Sign In
          </Button>
          <Button
            type="primary"
            block
            style={{
              background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
              border: 'none',
              fontSize: '16px',
              fontWeight: 500,
              height: '48px',
              borderRadius: '8px',
            }}
            href={SIGNUP_URL}
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
          color: #48abe2 !important;
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
