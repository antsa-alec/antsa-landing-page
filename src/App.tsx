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
/**
 * ANTSA BRAND COLORS - Blue Theme
 * Primary: rgb(72, 171, 226) / #48abe2
 * Secondary: White
 * Alt: Black
 */
const theme = {
  token: {
    colorPrimary: '#48abe2', // Sky Blue
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#48abe2',
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
      bodyBg: '#f5f7fa',
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

    // Function to observe all reveal elements (including dynamically loaded ones)
    const observeElements = () => {
      const revealElements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale'
      );
      revealElements.forEach((el) => {
        if (!el.classList.contains('observed')) {
          el.classList.add('observed');
          observer.observe(el);
        }
      });
    };

    // Initial observation
    observeElements();

    // Re-observe when new content loads (for dynamically loaded sections)
    const intervalId = setInterval(observeElements, 500);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      const revealElements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale'
      );
      revealElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
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
