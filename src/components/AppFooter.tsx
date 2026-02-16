import { useEffect, useState } from 'react';
import { Typography, Space, Button, Input, message } from 'antd';
import {
  InstagramOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  MailOutlined,
  CheckCircleFilled,
  ArrowRightOutlined,
} from '@ant-design/icons';
import antsaLogo from '../assets/logo-black.png';

const { Paragraph, Link } = Typography;

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface FooterContent {
  copyright?: string;
  description?: string;
}

/**
 * FOOTER - Dark theme with ANTSA logo, social icons, legal links, subscribe
 */
const AppFooter = () => {
  const [footerContent, setFooterContent] = useState<FooterContent>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [legalLinks, setLegalLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe form state
  const [subscribeName, setSubscribeName] = useState('');
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/content/section/footer').then((res) => res.json()),
      fetch('/api/content/social-links').then((res) => res.json()),
      fetch('/api/content/footer-links').then((res) => res.json()),
    ])
      .then(([footerData, socialData, linksData]) => {
        if (footerData.content) {
          setFooterContent(footerData.content);
        }
        if (socialData.links) {
          setSocialLinks(socialData.links);
        }
        if (linksData.links) {
          setLegalLinks(linksData.links);
        }
      })
      .catch((err) => console.error('Failed to load footer data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async () => {
    // Validation
    if (!subscribeName.trim()) {
      setSubscribeError('Please enter your name.');
      return;
    }
    if (!subscribeEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subscribeEmail)) {
      setSubscribeError('Please enter a valid email address.');
      return;
    }

    setSubscribeError('');
    setSubscribeLoading(true);

    try {
      const response = await fetch('/api/content/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: subscribeName.trim(), email: subscribeEmail.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribeSuccess(true);
        setSubscribeName('');
        setSubscribeEmail('');
        message.success(data.message || 'Thank you for subscribing!');
      } else if (response.status === 409) {
        setSubscribeError('This email is already subscribed.');
      } else {
        setSubscribeError(data.errors?.[0]?.msg || data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubscribeError('Network error. Please try again.');
    } finally {
      setSubscribeLoading(false);
    }
  };

  const copyright = footerContent.copyright || 'Copyright \u00A9 ANTSA Pty Ltd 2026 (ABN: 77 664 161 237) (ACN: 664 161 237) - All Rights Reserved.';

  const defaultSocialLinks: SocialLink[] = [
    { id: '1', platform: 'instagram', url: 'https://www.instagram.com/antsa.ai/' },
    { id: '2', platform: 'facebook', url: 'https://www.facebook.com/antsa.ai/' },
    { id: '3', platform: 'linkedin', url: 'https://www.linkedin.com/company/antsa-ai/' },
    { id: '4', platform: 'email', url: 'mailto:admin@antsa.com.au' },
  ];

  const defaultLegalLinks: FooterLink[] = [
    { id: '1', label: 'Privacy Policy', url: '/privacy-policy' },
    { id: '2', label: 'Terms & Conditions', url: '/terms-and-conditions' },
  ];

  const displaySocial = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;
  const displayLegal = legalLinks.length > 0 ? legalLinks : defaultLegalLinks;

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <InstagramOutlined />;
      case 'facebook': return <FacebookOutlined />;
      case 'linkedin': return <LinkedinOutlined />;
      case 'email': return <MailOutlined />;
      default: return <MailOutlined />;
    }
  };

  if (loading) return null;

  return (
    <footer
      style={{
        background: '#000000',
        color: '#ffffff',
        padding: '60px 20px 32px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Left: Logo and description */}
          <div style={{ maxWidth: '300px', flex: '1 1 250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img
                src={antsaLogo}
                alt="ANTSA"
                style={{
                  height: '160px',
                  width: 'auto',
                  objectFit: 'contain',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          {/* Center: Social Icons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Follow Us
            </div>
            <Space size={12}>
              {displaySocial.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.platform === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '18px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#48abe2';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </Space>
          </div>

          {/* Right: Subscribe Form */}
          <div style={{ minWidth: '300px', maxWidth: '400px', flex: '1 1 300px' }}>
            {subscribeSuccess ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px',
                  background: 'rgba(72, 171, 226, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(72, 171, 226, 0.2)',
                }}
              >
                <CheckCircleFilled style={{ fontSize: '32px', color: '#48abe2', marginBottom: '12px' }} />
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  You're subscribed!
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Thank you for joining. We'll keep you updated.
                </div>
                <Button
                  type="link"
                  style={{ color: '#48abe2', marginTop: '12px', padding: 0 }}
                  onClick={() => setSubscribeSuccess(false)}
                >
                  Subscribe another email
                </Button>
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  Stay in the loop
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginBottom: '20px',
                    lineHeight: 1.5,
                  }}
                >
                  Get updates on new features, clinical insights, and product news.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Input
                    placeholder="Your name"
                    value={subscribeName}
                    onChange={(e) => {
                      setSubscribeName(e.target.value);
                      setSubscribeError('');
                    }}
                    onPressEnter={() => {
                      const emailInput = document.getElementById('subscribe-email');
                      emailInput?.focus();
                    }}
                    className="footer-subscribe-input"
                    style={{
                      height: '44px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '14px',
                    }}
                    styles={{ input: { color: '#ffffff' } }}
                  />
                  <Input
                    id="subscribe-email"
                    placeholder="Your email address"
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => {
                      setSubscribeEmail(e.target.value);
                      setSubscribeError('');
                    }}
                    onPressEnter={handleSubscribe}
                    className="footer-subscribe-input"
                    style={{
                      height: '44px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '14px',
                    }}
                    styles={{ input: { color: '#ffffff' } }}
                  />
                  {subscribeError && (
                    <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '-4px' }}>
                      {subscribeError}
                    </div>
                  )}
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    loading={subscribeLoading}
                    onClick={handleSubscribe}
                    style={{
                      height: '44px',
                      borderRadius: '10px',
                      background: '#48abe2',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '15px',
                    }}
                  >
                    Subscribe
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Copyright */}
          <Paragraph
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '13px',
              margin: 0,
            }}
          >
            {copyright}
          </Paragraph>

          {/* Legal Links */}
          <Space size={24}>
            {displayLegal.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '13px',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                }}
              >
                {link.label}
              </Link>
            ))}
          </Space>
        </div>
      </div>
      {/* Placeholder color override for dark inputs */}
      <style>{`
        .footer-subscribe-input input::placeholder {
          color: rgba(255, 255, 255, 0.45) !important;
        }
        .footer-subscribe-input input {
          color: #ffffff !important;
        }
      `}</style>
    </footer>
  );
};

export default AppFooter;
