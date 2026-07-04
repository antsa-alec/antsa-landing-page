import { useState } from 'react';
import { Drawer, Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import antsaLogo from '../assets/antsa-logo.png';
import type { ChromeData, HeaderConfig } from '../pages/chrome-data';

/**
 * HEADER — sticky, translucent, clinician-governed design.
 * Nav CTAs (Log in / Start free trial / Book a demo) are CMS-driven via
 * chrome.header with the approved defaults as fallback.
 */

const DEFAULTS = {
  signup_url: 'https://antsa.ai/free-trial',
  signup_label: 'Start free trial',
  signin_url: 'https://au.antsa.ai/sign-in',
  signin_label: 'Log in',
  demo_url: 'https://calendly.com/sally-anne-mcc',
  demo_label: 'Book a demo',
};

const NAV: { label: string; href: string; external?: boolean }[] = [
  { label: 'Features', href: '#features' },
  { label: 'For clinicians', href: '#audiences' },
  { label: 'Team', href: '#team' },
  { label: 'Security', href: '#security' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: 'mailto:admin@antsa.com.au', external: true },
];

const isExternal = (url: string) => /^(https?:|mailto:)/i.test(url);
const extraProps = (url: string) =>
  /^https?:/i.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

const resolveCfg = (h: HeaderConfig | null | undefined) => ({
  signup_url: h?.signup_url || DEFAULTS.signup_url,
  signup_label: h?.signup_label || DEFAULTS.signup_label,
  signin_url: h?.signin_url || DEFAULTS.signin_url,
  signin_label: h?.signin_label || DEFAULTS.signin_label,
  demo_url: h?.demo_url || DEFAULTS.demo_url,
  demo_label: h?.demo_label || DEFAULTS.demo_label,
});

type AppHeaderProps = { chrome?: ChromeData; urlPathname?: string };

export default function AppHeader({ chrome, urlPathname = '/' }: AppHeaderProps) {
  const [open, setOpen] = useState(false);
  const cfg = resolveCfg(chrome?.header);
  // Anchor links only work in-page on the home route; prefix with "/" elsewhere.
  const navHref = (href: string) =>
    isExternal(href) || urlPathname === '/' ? href : `/${href}`;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255,255,255,.94)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid #E6E9EE',
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '13px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <a
            href={navHref('#hero')}
            style={{ display: 'flex', alignItems: 'center' }}
            aria-label="ANTSA for professionals — home"
            onClick={(e) => {
              if (typeof window !== 'undefined' && window.location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img src={antsaLogo} alt="ANTSA for professionals" style={{ height: 38, width: 'auto', display: 'block' }} />
          </a>

          <nav className="dc-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            {NAV.map((n) => (
              <a key={n.label} className="dc-nav-link" href={navHref(n.href)} {...extraProps(n.href)}>
                {n.label}
              </a>
            ))}
          </nav>

          <div className="dc-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a className="dc-nav-link" href={cfg.signin_url} {...extraProps(cfg.signin_url)} style={{ padding: '8px 4px' }}>
              {cfg.signin_label}
            </a>
            <a className="dc-btn dc-btn-secondary dc-btn-sm" href={cfg.signup_url} {...extraProps(cfg.signup_url)}>
              {cfg.signup_label}
            </a>
            <a className="dc-btn dc-btn-primary dc-btn-sm" href={cfg.demo_url} {...extraProps(cfg.demo_url)}>
              {cfg.demo_label}
            </a>
          </div>

          <Button
            className="dc-mobile-toggle"
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20 }} />}
            onClick={() => setOpen(true)}
            style={{ display: 'none' }}
            aria-label="Open menu"
          />
        </div>
      </header>

      <Drawer
        title={<img src={antsaLogo} alt="ANTSA" style={{ height: 30, display: 'block' }} />}
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        closeIcon={<CloseOutlined />}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {NAV.map((n) => (
            <a
              key={n.label}
              className="dc-nav-link"
              href={navHref(n.href)}
              {...extraProps(n.href)}
              onClick={() => setOpen(false)}
              style={{ fontSize: 17 }}
            >
              {n.label}
            </a>
          ))}
          <div style={{ height: 1, background: '#E6E9EE', margin: '4px 0' }} />
          <a className="dc-nav-link" href={cfg.signin_url} {...extraProps(cfg.signin_url)} style={{ fontSize: 17 }}>
            {cfg.signin_label}
          </a>
          <a className="dc-btn dc-btn-secondary" href={cfg.signup_url} {...extraProps(cfg.signup_url)}>
            {cfg.signup_label}
          </a>
          <a className="dc-btn dc-btn-primary" href={cfg.demo_url} {...extraProps(cfg.demo_url)}>
            {cfg.demo_label}
          </a>
        </div>
      </Drawer>

      <style>{`
        @media (max-width: 1040px) {
          .dc-desktop-nav { display: none !important; }
          .dc-mobile-toggle { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
