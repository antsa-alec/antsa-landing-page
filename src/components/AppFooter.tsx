/**
 * FOOTER - NEXT-LEVEL DESIGN
 * Features: Modern dark theme, social media animations
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
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Footer } = Layout;
const { Text, Link } = Typography;

// Using relative URL so Vite proxy can handle the request
const API_BASE_URL = '/api';

interface FooterSettings {
  footer_copyright?: string;
  footer_tagline?: string;
  footer_subtitle?: string;
}

interface FooterLink {
  id: number;
  label: string;
  url: string;
  order_index: number;
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
  other: GlobalOutlined,
};

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<FooterSettings>({});
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
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

    const fetchFooterLinks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/footer-links`);
        const data = await response.json();
        
        if (!ignore && response.ok && data.links) {
          setFooterLinks(data.links);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching footer links:', error);
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
    fetchFooterLinks();
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

  return (
    <Footer style={{ 
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      padding: '60px 20px 30px',
      textAlign: 'center',
    }}>
      <Row justify="center">
        <Col xs={22} sm={20} md={16} lg={14}>
          {/* Logo/Brand */}
          <div style={{ marginBottom: '30px' }}>
            <Text style={{ 
              fontSize: '2rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #48abe2 0%, #2196f3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              ANTSA
            </Text>
          </div>

          {/* Social Media Icons */}
          <Space size="large" style={{ marginBottom: '30px' }}>
            {socialLinks.map((socialLink) => {
              const IconComponent = getIconForPlatform(socialLink.platform);
              return (
                <a
                  key={socialLink.id}
                  href={socialLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      width: '45px',
                      height: '45px',
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
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <IconComponent style={{ fontSize: '1.4rem', color: '#ffffff' }} />
                  </div>
                </a>
              );
            })}
          </Space>

          {/* Links */}
          <div style={{ marginBottom: '30px' }}>
            <Space split={<span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>} size="large" wrap>
              {footerLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.url}
                  target={link.url && link.url !== '#' ? '_blank' : undefined}
                  rel={link.url && link.url !== '#' ? 'noopener noreferrer' : undefined}
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 500,
                    transition: 'color 0.3s ease',
                    cursor: link.url && link.url !== '#' ? 'pointer' : 'default',
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
          </div>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'rgba(255, 255, 255, 0.1)',
            margin: '30px 0',
          }} />

          {/* Copyright */}
          <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
            {settings.footer_copyright || `© ${currentYear} ANTSA. All rights reserved.`}
            {' • '}
            {settings.footer_tagline ? (
              <span dangerouslySetInnerHTML={{ __html: settings.footer_tagline }} />
            ) : (
              <>Made with <HeartFilled style={{ color: '#48abe2', margin: '0 5px' }} /> in Australia</>
            )}
          </Text>
          <br />
          <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
            {settings.footer_subtitle || 'Data encrypted and securely hosted on Australian servers'}
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
