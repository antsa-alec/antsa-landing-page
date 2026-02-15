import { ConfigProvider, Layout } from 'antd';
import { useEffect } from 'react';
import AppHeader from './components/AppHeader';
import HeroSection from './components/HeroSection';
import TheShiftSection from './components/TheShiftSection';
import TheAntsaSection from './components/TheAntsaSection';
import FeaturesSection from './components/FeaturesSection';
import TeamSection from './components/TeamSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import ComplianceBadgesStrip from './components/ComplianceBadgesStrip';
import AppFooter from './components/AppFooter';
import './styles/global.css';

const { Content } = Layout;

/**
 * ANTSA THEME - Modern Blue Gradient
 */
const theme = {
  token: {
    colorPrimary: '#48abe2',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#48abe2',
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
          <TheShiftSection />
          <TheAntsaSection />
          <FeaturesSection />
          <TeamSection />
          <PricingSection />
          <FAQSection />
          <ComplianceBadgesStrip />
        </Content>
        <AppFooter />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
