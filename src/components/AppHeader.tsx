import { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined, CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const SIGNUP_URL = '/free-trial';
const SIGNIN_URL = 'https://au.antsa.ai/sign-in';
const DEMO_MAIL =
  'mailto:admin@antsa.com.au?subject=Book%20a%20Demo%20-%20ANTSA&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20book%20a%20demo.';

const sectionHref = (hash: string) => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    return `/${hash}`;
  }
  return hash;
};

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const desktopNav: MenuProps['items'] = [
    {
      key: 'features',
      label: <a href={sectionHref('#why-switch')}>Features</a>,
    },
    {
      key: 'for-clinics',
      label: <a href={sectionHref('#for-clinics')}>For Clinics</a>,
    },
    {
      key: 'pricing',
      label: <a href={sectionHref('#pricing')}>Pricing</a>,
    },
    {
      key: 'about',
      label: <a href={sectionHref('#team')}>About Us</a>,
    },
    {
      key: 'resources',
      label: 'Resources',
      children: [
        { key: 'faq', label: <a href={sectionHref('#faq')}>FAQ</a> },
        { key: 'help', label: <a href="/help">Help Centre</a> },
        { key: 'team', label: <a href={sectionHref('#team')}>Our Team</a> },
        { key: 'the-shift', label: <a href={sectionHref('#the-shift')}>The Shift</a> },
        { key: 'the-antsa', label: <a href={sectionHref('#the-antsa')}>The ANTSA</a> },
      ],
    },
  ];

  const mobileItems: MenuProps['items'] = [
    ...desktopNav,
    { type: 'divider' },
    { key: 'login', label: <a href={SIGNIN_URL}>Log In</a> },
    { key: 'trial', label: <a href={SIGNUP_URL}>Start Free Trial</a> },
    { key: 'demo', label: <a href={DEMO_MAIL}>Book a Demo</a> },
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
          boxShadow: '0 1px 0 rgba(0, 0, 0, 0.06)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        <a
          href={sectionHref('#hero')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.1,
            textDecoration: 'none',
          }}
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.35rem',
              color: '#48abe2',
              letterSpacing: '-0.02em',
            }}
          >
            antsa
          </span>
          <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.08em' }}>
            FOR PROFESSIONALS
          </span>
        </a>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Menu
            mode="horizontal"
            disabledOverflow
            items={desktopNav}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              minWidth: 0,
            }}
            className="desktop-menu"
          />

          <div className="desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Button type="link" href={SIGNIN_URL} style={{ color: '#0f172a', fontWeight: 500, padding: '0 8px' }}>
              Log In
            </Button>
            <Button type="primary" href={SIGNUP_URL} style={{ background: '#48abe2', borderColor: '#48abe2', fontWeight: 600 }}>
              Start Free Trial
            </Button>
            <Button icon={<CalendarOutlined />} href={DEMO_MAIL} style={{ borderColor: '#48abe2', color: '#48abe2', fontWeight: 600 }}>
              Book a Demo
            </Button>
          </div>

          <Button
            className="mobile-menu-button"
            type="text"
            icon={<MenuOutlined style={{ fontSize: '20px' }} />}
            onClick={() => setMobileMenuOpen(true)}
            style={{ display: 'none' }}
          />
        </div>
      </Header>

      <Drawer
        title={<span style={{ fontWeight: 700, color: '#48abe2' }}>antsa</span>}
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        closeIcon={<CloseOutlined />}
      >
        <Menu mode="vertical" items={mobileItems} style={{ border: 'none' }} onClick={() => setMobileMenuOpen(false)} />
      </Drawer>

      <style>{`
        @media (max-width: 1100px) {
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
        .ant-menu-horizontal .ant-menu-item::after {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default AppHeader;
