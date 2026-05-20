import { useEffect } from 'react';
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
import Section from './components/Section';
import type { SectionRow } from './pages/index/+data';
import './styles/global.css';

function App({ sections = [] }: { sections?: SectionRow[] }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    const observe = () => {
      document
        .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach((el) => {
          if (!el.classList.contains('observed')) {
            el.classList.add('observed');
            observer.observe(el);
          }
        });
    };

    observe();

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
        const interval = setInterval(() => {
          if (tryScroll() || ++attempts > 10) clearInterval(interval);
        }, 150);
      }
    }

    const intervalId = setInterval(observe, 500);
    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  const byName = Object.fromEntries((sections ?? []).map((s) => [s.name, s]));

  return (
    <>
      <Section name="hero"><HeroSplit section={byName.hero} /></Section>
      <Section name="trust_strip"><TrustStrip section={byName.trust_strip} /></Section>
      <Section name="why_switch"><WhySwitchSection section={byName.why_switch} /></Section>
      <Section name="everything_one_login">
        <EverythingOneLoginSection section={byName.everything_one_login} />
      </Section>
      <Section name="the-shift"><TheShiftSection section={byName['the-shift']} /></Section>
      <Section name="the-antsa"><TheAntsaSection section={byName['the-antsa']} /></Section>
      <Section name="features"><FeaturesSection section={byName.features} /></Section>
      <Section name="team"><TeamSection section={byName.team} /></Section>
      <Section name="pricing"><PricingSection section={byName.pricing} /></Section>
      <Section name="faq"><FAQSection section={byName.faq} /></Section>
      <Section name="for_clinics"><ForClinicsBand section={byName.for_clinics} /></Section>
      <Section name="testimonials"><TestimonialsSection section={byName.testimonials} /></Section>
      <Section name="compliance"><ComplianceBadgesStrip section={byName.compliance} /></Section>
    </>
  );
}

export default App;
