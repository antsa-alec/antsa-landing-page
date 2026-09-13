import { loadAllSections, loadChromeData } from '../../../backend/ssr/data-providers.js';
import type { FAQContent } from '../../components/FAQSection';
import type { ChromeData } from '../chrome-data';
import type { SectionRow } from '../index/+data';

export type FAQData = { section: FAQContent; chrome: ChromeData };

export function data(): FAQData {
  const sections = loadAllSections() as SectionRow[];
  return {
    section: sections.find((section) => section.name === 'faq') ?? { content: {}, faqs: [] },
    chrome: loadChromeData() as ChromeData,
  };
}
