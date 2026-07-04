import { useEffect } from 'react';
import HeroSplit from './components/HeroSplit';
import AudienceStrip from './components/AudienceStrip';
import GapBetweenSessions from './components/GapBetweenSessions';
import WhyItMatters from './components/WhyItMatters';
import WhatAntsaDoes from './components/WhatAntsaDoes';
import Comparison from './components/Comparison';
import AntsaBot from './components/AntsaBot';
import FeaturesSection from './components/FeaturesSection';
import Governance from './components/Governance';
import Audiences from './components/Audiences';
import Security from './components/Security';
import TeamSection from './components/TeamSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import ClinicsCTA from './components/ClinicsCTA';
import ComplianceBadgesStrip from './components/ComplianceBadgesStrip';
import ClinicalDisclaimer from './components/ClinicalDisclaimer';
import Section from './components/Section';
import ClientOnly from './ssr/ClientOnly';
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
      <Section name="audience_strip"><AudienceStrip /></Section>
      <Section name="gap"><GapBetweenSessions /></Section>
      <Section name="why_it_matters"><WhyItMatters /></Section>
      <Section name="what_antsa_does"><WhatAntsaDoes /></Section>
      <Section name="comparison"><Comparison /></Section>
      <Section name="antsabot"><AntsaBot /></Section>
      <Section name="features"><FeaturesSection section={byName.features} /></Section>
      <Section name="governance"><Governance /></Section>
      <Section name="audiences"><Audiences /></Section>
      <Section name="security"><Security /></Section>
      <Section name="team"><TeamSection section={byName.team} /></Section>
      {/*
        PricingSection fetches /api/stripe/pricing on the client and reconciles it
        against the CMS-seeded plans. Wrapping in ClientOnly keeps SSR/hydration
        clean; the CMS plans render after hydration.
      */}
      <Section name="pricing">
        <ClientOnly fallback={<div id="pricing" />}>
          <PricingSection section={byName.pricing} />
        </ClientOnly>
      </Section>
      <Section name="faq"><FAQSection section={byName.faq} /></Section>
      <Section name="for_clinics"><ClinicsCTA /></Section>
      <Section name="compliance"><ComplianceBadgesStrip section={byName.compliance} /></Section>
      <Section name="disclaimer"><ClinicalDisclaimer /></Section>
    </>
  );
}

export default App;
