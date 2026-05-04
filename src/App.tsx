import { ConfigProvider, Layout } from 'antd';
import { useEffect } from 'react';
import AppHeader from './components/AppHeader';
import HeroSplit from './components/HeroSplit';
import TrustStrip from './components/TrustStrip';
import WhySwitchSection from './components/WhySwitchSection';
import EverythingOneLoginSection from './components/EverythingOneLoginSection';
import TheShiftSection from './components/TheShiftSection';
import TheAntsaSection from './components/TheAntsaSection';
import FeaturesSection from './components/FeaturesSection';
import TeamSection from './components/TeamSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import ForClinicsBand from './components/ForClinicsBand';
import TestimonialsSection from './components/TestimonialsSection';
import ComplianceBadgesStrip from './components/ComplianceBadgesStrip';
import AppFooter from './components/AppFooter';
import './styles/global.css';

const { Content } = Layout;

const theme = {
  token: {
    colorPrimary: '#48abe2',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#48abe2',
    colorTextBase: '#0f172a',
    colorBgBase: '#ffffff',
    borderRadius: 10,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.6,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#ffffff',
    },
    Card: {
      borderRadiusLG: 12,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 44,
      fontWeight: 600,
    },
  },
};

function App() {
  useEffect(() => {
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
      },
    );

    const observeElements = () => {
      const revealElements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale',
      );
      revealElements.forEach((el) => {
        if (!el.classList.contains('observed')) {
          el.classList.add('observed');
          observer.observe(el);
        }
      });
    };

    observeElements();

    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };
      if (!tryScroll()) {
        let attempts = 0;
        const scrollInterval = setInterval(() => {
          if (tryScroll() || ++attempts > 10) clearInterval(scrollInterval);
        }, 150);
      }
    }

    const intervalId = setInterval(observeElements, 500);

    return () => {
      clearInterval(intervalId);
      const revealElements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale',
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
          <HeroSplit />
          <TrustStrip />
          <WhySwitchSection />
          <EverythingOneLoginSection />
          <TheShiftSection />
          <TheAntsaSection />
          <FeaturesSection />
          <TeamSection />
          <PricingSection />
          <FAQSection />
          <ForClinicsBand />
          <TestimonialsSection />
          <ComplianceBadgesStrip />
        </Content>
        <AppFooter />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
