/**
 * APP HEADER - STICKY NAVIGATION
 * Features: Fixed header with scroll effects, logo, nav items, CTA buttons, mobile drawer
 */

import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Drawer, Space, Dropdown } from 'antd';
import { MenuOutlined, DownOutlined, CloseOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import watermarkLogo from '../assets/watermark.png';

const { Header } = Layout;

// Using relative URL so Vite proxy can handle the request
const API_BASE_URL = '/api';

interface NavItem {
  id: number;
  label: string;
  url: string | null;
  order_index: number;
  parent_id: number | null;
  is_cta: number;
  cta_style: string;
  children?: NavItem[];
}

interface HeaderSettings {
  header_logo_text?: string;
  header_sticky?: string;
  header_transparent_on_hero?: string;
}

const AppHeader = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [settings, setSettings] = useState<HeaderSettings>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fetch navigation items
  useEffect(() => {
    let ignore = false;

    const fetchNavItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/nav-items`);
        const data = await response.json();
        
        if (!ignore && response.ok && data.items) {
          setNavItems(data.items);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching nav items:', error);
        }
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/section/settings`);
        const data = await response.json();
        
        if (!ignore && response.ok && data.content) {
          setSettings(data.content);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching header settings:', error);
        }
      }
    };

    fetchNavItems();
    fetchSettings();

    return () => {
      ignore = true;
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Separate nav items and CTA buttons
  const regularNavItems = navItems.filter(item => !item.is_cta);
  const ctaItems = navItems.filter(item => item.is_cta);

  // Handle navigation click
  const handleNavClick = (url: string | null) => {
    if (!url) return;
    
    if (url.startsWith('#')) {
      // Smooth scroll to section
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
      }
    } else {
      // External link
      window.open(url, '_blank');
    }
  };

  // Build menu items for desktop
  const buildMenuItems = (): MenuProps['items'] => {
    return regularNavItems.map(item => {
      if (item.children && item.children.length > 0) {
        // Dropdown menu
        const dropdownItems: MenuProps['items'] = item.children.map(child => ({
          key: child.id.toString(),
          label: child.label,
          onClick: () => handleNavClick(child.url),
        }));

        return {
          key: item.id.toString(),
          label: (
            <Dropdown
              menu={{ items: dropdownItems }}
              trigger={['hover']}
            >
              <span style={{ cursor: 'pointer' }}>
                {item.label} <DownOutlined style={{ fontSize: '0.7rem', marginLeft: 4 }} />
              </span>
            </Dropdown>
          ),
        };
      }

      return {
        key: item.id.toString(),
        label: item.label,
        onClick: () => handleNavClick(item.url),
      };
    });
  };

  // Build mobile menu items
  const buildMobileMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    regularNavItems.forEach(item => {
      if (item.children && item.children.length > 0) {
        items.push({
          key: item.id.toString(),
          label: item.label,
          children: item.children.map(child => ({
            key: child.id.toString(),
            label: child.label,
            onClick: () => handleNavClick(child.url),
          })),
        });
      } else {
        items.push({
          key: item.id.toString(),
          label: item.label,
          onClick: () => handleNavClick(item.url),
        });
      }
    });

    return items;
  };

  const isTransparent = settings.header_transparent_on_hero === 'true' && !scrolled;

  return (
    <>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 50px',
          height: '70px',
          background: isTransparent 
            ? 'transparent' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0, 0, 0, 0.08)' : 'none',
          transition: 'all 0.3s ease',
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
            src={watermarkLogo} 
            alt="ANTSA Logo" 
            style={{ 
              height: '40px',
              width: '40px',
              objectFit: 'contain',
            }} 
          />
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: 800, 
            color: isTransparent ? '#ffffff' : '#48abe2',
            letterSpacing: '-0.5px',
          }}>
            {settings.header_logo_text || 'ANTSA'}
          </span>
        </div>

        {/* Desktop Navigation */}
        <Menu
          mode="horizontal"
          items={buildMenuItems()}
          style={{
            flex: 1,
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            lineHeight: '70px',
          }}
          className={isTransparent ? 'header-menu-transparent' : 'header-menu-solid'}
        />

        {/* CTA Buttons (Desktop) */}
        <Space size="middle" className="desktop-cta">
          {ctaItems.map(item => (
            <Button
              key={item.id}
              type={item.cta_style === 'primary' ? 'primary' : 'default'}
              ghost={item.cta_style === 'ghost' && isTransparent}
              onClick={() => handleNavClick(item.url)}
              style={{
                height: '40px',
                padding: '0 24px',
                borderRadius: '8px',
                fontWeight: 600,
                ...(item.cta_style === 'ghost' && !isTransparent ? {
                  color: '#48abe2',
                  borderColor: '#48abe2',
                } : {}),
                ...(item.cta_style === 'primary' ? {
                  background: '#48abe2',
                  borderColor: '#48abe2',
                } : {}),
              }}
            >
              {item.label}
            </Button>
          ))}
        </Space>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: '1.5rem', color: isTransparent ? '#ffffff' : '#1a202c' }} />}
          onClick={() => setMobileMenuOpen(true)}
          className="mobile-menu-button"
          style={{
            display: 'none',
          }}
        />
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src={watermarkLogo} 
              alt="ANTSA Logo" 
              style={{ height: '32px', width: '32px' }} 
            />
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#48abe2' }}>
              {settings.header_logo_text || 'ANTSA'}
            </span>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={300}
        closeIcon={<CloseOutlined style={{ fontSize: '1.2rem' }} />}
        styles={{
          body: { padding: 0 },
        }}
      >
        <Menu
          mode="inline"
          items={buildMobileMenuItems()}
          style={{ border: 'none' }}
        />
        
        <div style={{ padding: '20px', borderTop: '1px solid #f0f0f0' }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {ctaItems.map(item => (
              <Button
                key={item.id}
                type={item.cta_style === 'primary' ? 'primary' : 'default'}
                block
                onClick={() => {
                  handleNavClick(item.url);
                  setMobileMenuOpen(false);
                }}
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  ...(item.cta_style === 'primary' ? {
                    background: '#48abe2',
                    borderColor: '#48abe2',
                  } : {
                    color: '#48abe2',
                    borderColor: '#48abe2',
                  }),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Space>
        </div>
      </Drawer>

      {/* Spacer to account for fixed header */}
      <div style={{ height: '70px' }} />

      {/* CSS for responsive menu */}
      <style>{`
        @media (max-width: 992px) {
          .ant-menu-horizontal {
            display: none !important;
          }
          .desktop-cta {
            display: none !important;
          }
          .mobile-menu-button {
            display: flex !important;
          }
        }

        /* Transparent header menu styling */
        .header-menu-transparent .ant-menu-item,
        .header-menu-transparent .ant-menu-submenu-title {
          color: rgba(255, 255, 255, 0.9) !important;
        }
        .header-menu-transparent .ant-menu-item:hover,
        .header-menu-transparent .ant-menu-item-selected,
        .header-menu-transparent .ant-menu-submenu:hover .ant-menu-submenu-title {
          color: #ffffff !important;
        }
        .header-menu-transparent .ant-menu-item::after,
        .header-menu-transparent .ant-menu-submenu::after {
          border-bottom-color: #ffffff !important;
        }

        /* Solid header menu styling */
        .header-menu-solid .ant-menu-item,
        .header-menu-solid .ant-menu-submenu-title {
          color: #4a5568 !important;
        }
        .header-menu-solid .ant-menu-item:hover,
        .header-menu-solid .ant-menu-item-selected,
        .header-menu-solid .ant-menu-submenu:hover .ant-menu-submenu-title {
          color: #48abe2 !important;
        }
        .header-menu-solid .ant-menu-item::after,
        .header-menu-solid .ant-menu-submenu::after {
          border-bottom-color: #48abe2 !important;
        }

        /* Remove default menu underline when transparent */
        .header-menu-transparent.ant-menu-horizontal > .ant-menu-item::after,
        .header-menu-transparent.ant-menu-horizontal > .ant-menu-submenu::after {
          display: none;
        }
      `}</style>
    </>
  );
};

export default AppHeader;
