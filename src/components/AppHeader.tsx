import { useEffect, useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined, CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import antsaLogo from '../assets/antsa-logo.png';

const { Header } = Layout;

// Defaults — overridden at runtime by CMS values from /api/content/section/header
const DEFAULTS = {
  signup_url: '/free-trial',
  signup_label: 'Start Free Trial',
  signin_url: 'https://au.antsa.ai/sign-in',
  signin_label: 'Log In',
  demo_url: 'https://calendly.com/sally-anne-mcc',
  demo_label: 'Book a Demo',
};

const isExternal = (url: string) => /^https?:\/\//i.test(url);

const sectionHref = (hash: string) => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/') {
    return `/${hash}`;
  }
  return hash;
};

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cfg, setCfg] = useState(DEFAULTS);

  useEffect(() => {
    fetch('/api/content/section/header')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const c = d?.content || {};
        setCfg({
          signup_url: c.signup_url || DEFAULTS.signup_url,
          signup_label: c.signup_label || DEFAULTS.signup_label,
          signin_url: c.signin_url || DEFAULTS.signin_url,
          signin_label: c.signin_label || DEFAULTS.signin_label,
          demo_url: c.demo_url || DEFAULTS.demo_url,
          demo_label: c.demo_label || DEFAULTS.demo_label,
        });
      })
      .catch(() => {});
  }, []);

  const externalProps = (url: string) =>
    isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

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
    {
      key: 'login',
      label: (
        <a href={cfg.signin_url} {...externalProps(cfg.signin_url)}>
          {cfg.signin_label}
        </a>
      ),
    },
    {
      key: 'trial',
      label: (
        <a href={cfg.signup_url} {...externalProps(cfg.signup_url)}>
          {cfg.signup_label}
        </a>
      ),
    },
    {
      key: 'demo',
      label: (
        <a href={cfg.demo_url} {...externalProps(cfg.demo_url)}>
          {cfg.demo_label}
        </a>
      ),
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
            alignItems: 'center',
            textDecoration: 'none',
          }}
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          aria-label="ANTSA For Professionals — home"
        >
          <img
            src={antsaLogo}
            alt="ANTSA For Professionals"
            style={{ height: 44, width: 'auto', display: 'block' }}
          />
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
            <Button
              type="link"
              href={cfg.signin_url}
              {...externalProps(cfg.signin_url)}
              style={{ color: '#0f172a', fontWeight: 500, padding: '0 8px' }}
            >
              {cfg.signin_label}
            </Button>
            <Button
              type="primary"
              href={cfg.signup_url}
              {...externalProps(cfg.signup_url)}
              style={{ background: '#48abe2', borderColor: '#48abe2', fontWeight: 600 }}
            >
              {cfg.signup_label}
            </Button>
            <Button
              icon={<CalendarOutlined />}
              href={cfg.demo_url}
              {...externalProps(cfg.demo_url)}
              style={{ borderColor: '#48abe2', color: '#48abe2', fontWeight: 600 }}
            >
              {cfg.demo_label}
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
        title={
          <img
            src={antsaLogo}
            alt="ANTSA For Professionals"
            style={{ height: 32, width: 'auto', display: 'block' }}
          />
        }
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
