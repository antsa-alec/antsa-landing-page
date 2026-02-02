import { useEffect, useState } from 'react';
import { Typography, Row, Col, Space } from 'antd';
import { TwitterOutlined, FacebookOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons';

const { Title, Paragraph, Link } = Typography;

interface FooterSettings {
  company_name?: string;
  copyright_text?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_linkedin?: string;
  social_github?: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface FooterLink {
  id: string;
  label: string;
  url: string;
  category: string;
  category_id?: number | null;
}

/**
 * FOOTER - Dark theme with multiple columns
 */
const AppFooter = () => {
  const [settings, setSettings] = useState<FooterSettings>({});
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/content/settings').then((res) => res.json()),
      fetch('/api/content/footer-links').then((res) => res.json()),
      fetch('/api/content/social-links').then((res) => res.json()),
    ])
      .then(([settingsData, linksData, socialLinksData]) => {
        if (settingsData.settings) {
          setSettings(settingsData.settings);
        }
        if (linksData.links) {
          setLinks(linksData.links);
        }
        if (socialLinksData.links) {
          setSocialLinks(socialLinksData.links);
        }
      })
      .catch((err) => console.error('Failed to load footer data:', err))
      .finally(() => setLoading(false));
  }, []);

  const companyName = settings.company_name || 'SaaS Template';
  const copyrightText = settings.copyright_text || 'Designed by ANTSA Team';

  // Default navigation links
  const defaultLinks = {
    product: [
      { id: '1', label: 'Product', url: '#', category: 'product' },
      { id: '2', label: 'Docs', url: '#', category: 'product' },
      { id: '3', label: 'Blog', url: '#', category: 'product' },
      { id: '4', label: 'Community', url: '#', category: 'product' },
      { id: '5', label: 'Company', url: '#', category: 'product' },
    ],
    legal: [
      { id: '6', label: 'Terms Of Service', url: '#', category: 'legal' },
      { id: '7', label: 'Privacy Policy', url: '#', category: 'legal' },
    ],
  };

  // Use database links if available, otherwise defaults
  const productLinks = links.length > 0 
    ? links.filter((l) => l.category === 'product' || (l.category_id === 1)) 
    : defaultLinks.product;
  const legalLinks = links.length > 0
    ? links.filter((l) => l.category === 'legal' || !l.category_id)
    : defaultLinks.legal;

  if (loading) {
    return null;
  }

  return (
    <footer
      style={{
        background: '#0f172a',
        color: '#ffffff',
        padding: '80px 20px 32px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Main Footer Content */}
        <Row gutter={[48, 48]} style={{ marginBottom: '64px' }}>
          {/* Brand Column */}
          <Col xs={24} md={8}>
            <Title
              level={3}
              style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              {companyName}
            </Title>
            <Paragraph
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '15px',
                lineHeight: 1.7,
              }}
            >
              Transform mental healthcare with AI-powered solutions.
            </Paragraph>
          </Col>

          {/* Navigation Links */}
          <Col xs={12} md={8}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {productLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '15px',
                    display: 'block',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Social Links */}
          <Col xs={12} md={8}>
            <Space size={16}>
              {socialLinks.map((link) => {
                let Icon = TwitterOutlined; // Default
                if (link.platform === 'facebook') Icon = FacebookOutlined;
                if (link.platform === 'linkedin') Icon = LinkedinOutlined;
                if (link.platform === 'github') Icon = GithubOutlined;
                
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
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
                      e.currentTarget.style.background = '#a855f7';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Icon />
                  </a>
                );
              })}
            </Space>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
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
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              margin: 0,
            }}
          >
            © Copyright 2026 {companyName}. {copyrightText}.
          </Paragraph>

          {/* Legal Links */}
          <Space size={24}>
            {legalLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                }}
              >
                {link.label}
              </Link>
            ))}
          </Space>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
