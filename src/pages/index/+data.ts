import { loadAllSections, loadChromeData } from '../../../backend/ssr/data-providers.js';
import type { ChromeData } from '../chrome-data';

export type SectionRow = {
  name: string;
  content: Record<string, unknown>;
  features?: Array<Record<string, unknown>>;
  pricing?: Array<Record<string, unknown>>;
  team?: Array<Record<string, unknown>>;
  testimonials?: Array<Record<string, unknown>>;
  faqs?: Array<Record<string, unknown>>;
};

export type HomeData = { sections: SectionRow[]; chrome: ChromeData };

export function data(): HomeData {
  return {
    sections: loadAllSections() as SectionRow[],
    chrome: loadChromeData() as ChromeData,
  };
}
