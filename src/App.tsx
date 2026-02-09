import { ConfigProvider, Layout } from 'antd';
import { useEffect } from 'react';
import AppHeader from './components/AppHeader';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import WhyAntsaSection from './components/WhyAntsaSection';
import TrustStandardsSection from './components/TrustStandardsSection';
import TeamSection from './components/TeamSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import AppFooter from './components/AppFooter';
import './styles/global.css';

const { Content } = Layout;

/**
 * ANTSA THEME - Modern Blue Gradient
 */
const theme = {
  token: {
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    colorTextBase: '#0f172a',
    colorBgBase: '#ffffff',
    borderRadius: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.6,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#ffffff',
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
        <AppHeader />
        <Content style={{ marginTop: '70px' }}>
          <HeroSection />
          <FeaturesSection />
          <WhyAntsaSection />
          <TrustStandardsSection />
          <TeamSection />
          <PricingSection />
          <FAQSection />
          <CTASection />
        </Content>
        <AppFooter />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
