import { useState } from 'react';
import antsaLogo from '../assets/antsa-logo.png';
import type { ChromeData, HeaderConfig } from '../pages/chrome-data';

/**
 * HEADER — sticky, translucent, clinician-governed design. AntD-free (plain
 * HTML + CSS + inline SVG) so it stays off the marketing critical path.
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
            <img src={antsaLogo} alt="ANTSA for professionals" width={140} height={38} style={{ height: 38, width: 'auto', display: 'block' }} />
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

          <button
            type="button"
            className="dc-mobile-toggle"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#0F1622', padding: 6 }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <div className="dc-mobile-menu" role="dialog" aria-modal="true">
          <div className="dc-mobile-menu__scrim" onClick={() => setOpen(false)} />
          <div className="dc-mobile-menu__panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <img src={antsaLogo} alt="ANTSA" width={110} height={30} style={{ height: 30, width: 'auto' }} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0F1622', padding: 6 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {NAV.map((n) => (
              <a
                key={n.label}
                className="dc-nav-link"
                href={navHref(n.href)}
                {...extraProps(n.href)}
                onClick={() => setOpen(false)}
                style={{ fontSize: 17, padding: '10px 0' }}
              >
                {n.label}
              </a>
            ))}
            <div style={{ height: 1, background: '#E6E9EE', margin: '10px 0' }} />
            <a className="dc-nav-link" href={cfg.signin_url} {...extraProps(cfg.signin_url)} style={{ fontSize: 17, padding: '10px 0' }}>
              {cfg.signin_label}
            </a>
            <a className="dc-btn dc-btn-secondary" href={cfg.signup_url} {...extraProps(cfg.signup_url)} style={{ marginTop: 6 }}>
              {cfg.signup_label}
            </a>
            <a className="dc-btn dc-btn-primary" href={cfg.demo_url} {...extraProps(cfg.demo_url)} style={{ marginTop: 8 }}>
              {cfg.demo_label}
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1040px) {
          .dc-desktop-nav { display: none !important; }
          .dc-mobile-toggle { display: inline-flex !important; align-items: center; }
        }
        .dc-mobile-menu { position: fixed; inset: 0; z-index: 1100; }
        .dc-mobile-menu__scrim { position: absolute; inset: 0; background: rgba(15,22,34,.4); }
        .dc-mobile-menu__panel {
          position: absolute; top: 0; right: 0; height: 100%; width: min(320px, 86vw);
          background: #fff; box-shadow: -8px 0 32px rgba(15,22,34,.16);
          padding: 18px 22px; display: flex; flex-direction: column; overflow-y: auto;
          animation: dcSlideIn .25s ease-out;
        }
        @keyframes dcSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
}
