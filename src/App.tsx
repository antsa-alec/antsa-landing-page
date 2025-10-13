import { ConfigProvider, Layout } from 'antd';
import { useEffect } from 'react';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import AppFooter from './components/AppFooter';
import './styles/global.css';

const { Content } = Layout;

/**
 * ENHANCED ANTSA THEME
 * Next-level professional color palette with refined token system
 */
const theme = {
  token: {
    colorPrimary: '#667eea',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    colorTextBase: '#1a202c',
    colorBgBase: '#ffffff',
    borderRadius: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.6,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f7fafc',
    },
    Card: {
      borderRadiusLG: 16,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 48,
      fontWeight: 600,
    },
  },
};

/**
 * MAIN APP COMPONENT
 * Implements scroll reveal animations and smooth transitions
 */
function App() {
  useEffect(() => {
    // Intersection Observer for scroll reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all elements with reveal classes
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
    
    revealElements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
        <Content>
          <HeroSection />
          <FeaturesSection />
          <PricingSection />
          <TestimonialsSection />
          <TeamSection />
          <ContactSection />
        </Content>
        <AppFooter />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
