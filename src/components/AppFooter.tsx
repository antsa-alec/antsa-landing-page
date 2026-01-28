/**
 * FOOTER - MULTI-COLUMN LAYOUT
 * Features: Modern dark theme, categorized links, social media animations
 */

import { Layout, Row, Col, Typography, Space } from 'antd';
import { 
  GithubOutlined, 
  LinkedinOutlined, 
  TwitterOutlined, 
  HeartFilled,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  GlobalOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import watermarkLogo from '../assets/watermark.png';

const { Footer } = Layout;
const { Text, Link, Title } = Typography;

// Using relative URL so Vite proxy can handle the request
const API_BASE_URL = '/api';

interface FooterSettings {
  footer_copyright?: string;
  footer_tagline?: string;
  footer_subtitle?: string;
  header_logo_text?: string;
}

interface FooterLink {
  id: number;
  label: string;
  url: string;
  order_index: number;
  category_id?: number | null;
}

interface FooterCategory {
  id: number;
  title: string;
  order_index: number;
  links: FooterLink[];
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  order_index: number;
}

// Map platform names to Ant Design icons
const socialIconMap: Record<string, any> = {
  github: GithubOutlined,
  linkedin: LinkedinOutlined,
  twitter: TwitterOutlined,
  x: TwitterOutlined, // X (formerly Twitter)
  facebook: FacebookOutlined,
  instagram: InstagramOutlined,
  youtube: YoutubeOutlined,
  tiktok: GlobalOutlined, // TikTok doesn't have a dedicated icon, use global
  website: GlobalOutlined,
  email: MailOutlined,
  other: GlobalOutlined,
};

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<FooterSettings>({});
  const [categories, setCategories] = useState<FooterCategory[]>([]);
  const [uncategorizedLinks, setUncategorizedLinks] = useState<FooterLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/section/settings`);
        const data = await response.json();
        
        if (!ignore && response.ok && data.content) {
          setSettings(data.content);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching footer settings:', error);
        }
      }
    };

    const fetchFooterCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/footer-categories`);
        const data = await response.json();
        
        if (!ignore && response.ok) {
          setCategories(data.categories || []);
          setUncategorizedLinks(data.uncategorizedLinks || []);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching footer categories:', error);
        }
      }
    };

    const fetchSocialLinks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/social-links`);
        const data = await response.json();
        
        if (!ignore && response.ok && data.links) {
          setSocialLinks(data.links);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching social links:', error);
        }
      }
    };

    fetchSettings();
    fetchFooterCategories();
    fetchSocialLinks();

    return () => {
      ignore = true;
    };
  }, []);

  // Get icon component for platform
  const getIconForPlatform = (platform: string) => {
    const normalizedPlatform = platform.toLowerCase();
    return socialIconMap[normalizedPlatform] || GlobalOutlined;
  };

  const handleLinkClick = (url: string) => {
    if (!url || url === '#') return;
    
    if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <Footer style={{ 
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      padding: '80px 20px 30px',
    }}>
      <Row justify="center">
        <Col xs={22} sm={22} md={22} lg={20} xl={18}>
          {/* Main Footer Content - Multi-Column Layout */}
          <Row gutter={[48, 48]} style={{ marginBottom: '60px' }}>
            {/* Brand Column */}
            <Col xs={24} sm={24} md={8} lg={6}>
              <div style={{ marginBottom: '24px' }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <img 
                    src={watermarkLogo} 
                    alt="ANTSA Logo" 
                    style={{ 
                      width: '48px',
                      height: '48px',
                      objectFit: 'contain',
                    }} 
                  />
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 800, 
                    color: '#48abe2',
                    letterSpacing: '-0.5px',
                  }}>
                    {settings.header_logo_text || 'ANTSA'}
                  </span>
                </div>
                <Text style={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  display: 'block',
                  marginBottom: '24px',
                }}>
                  {settings.footer_subtitle || 'AI-powered mental health platform connecting practitioners with clients for better care.'}
                </Text>

                {/* Social Media Icons */}
                <Space size="middle">
                  {socialLinks.map((socialLink) => {
                    const IconComponent = getIconForPlatform(socialLink.platform);
                    const isEmail = socialLink.platform.toLowerCase() === 'email';
                    const linkUrl = isEmail && !socialLink.url.startsWith('mailto:') 
                      ? `mailto:${socialLink.url}` 
                      : socialLink.url;
                    
                    return (
                      <a
                        key={socialLink.id}
                        href={linkUrl}
                        target={isEmail ? undefined : "_blank"}
                        rel={isEmail ? undefined : "noopener noreferrer"}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
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
                          <IconComponent style={{ fontSize: '1.2rem', color: '#ffffff' }} />
                        </div>
                      </a>
                    );
                  })}
                </Space>
              </div>
            </Col>

            {/* Link Columns */}
            {categories.map((category) => (
              <Col xs={12} sm={8} md={5} lg={4} key={category.id}>
                <Title 
                  level={5} 
                  style={{ 
                    color: '#ffffff',
                    marginBottom: '20px',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  {category.title}
                </Title>
                <Space direction="vertical" size={12}>
                  {category.links.map((link) => (
                    <Link 
                      key={link.id}
                      onClick={() => handleLinkClick(link.url)}
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.95rem',
                        transition: 'color 0.3s ease',
                        cursor: 'pointer',
                        display: 'block',
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
            ))}

            {/* Uncategorized links column (if any) */}
            {uncategorizedLinks.length > 0 && (
              <Col xs={12} sm={8} md={5} lg={4}>
                <Title 
                  level={5} 
                  style={{ 
                    color: '#ffffff',
                    marginBottom: '20px',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  Links
                </Title>
                <Space direction="vertical" size={12}>
                  {uncategorizedLinks.map((link) => (
                    <Link 
                      key={link.id}
                      onClick={() => handleLinkClick(link.url)}
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.95rem',
                        transition: 'color 0.3s ease',
                        cursor: 'pointer',
                        display: 'block',
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
            )}
          </Row>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
            marginBottom: '30px',
          }} />

          {/* Bottom Bar - Copyright */}
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                {settings.footer_copyright || `© ${currentYear} ANTSA. All rights reserved.`}
              </Text>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
                {settings.footer_tagline ? (
                  <span dangerouslySetInnerHTML={{ __html: settings.footer_tagline }} />
                ) : (
                  <>Made with <HeartFilled style={{ color: '#48abe2', margin: '0 5px' }} /> in Australia</>
                )}
              </Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
