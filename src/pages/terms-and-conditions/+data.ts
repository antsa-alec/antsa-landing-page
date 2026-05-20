import { loadLegalPage, loadChromeData } from '../../../backend/ssr/data-providers.js';
import type { ChromeData } from '../chrome-data';

export type TermsData = {
  page: { title: string; content: string; last_updated: string } | null;
  chrome: ChromeData;
};

export function data(): TermsData {
  return {
    page: loadLegalPage('terms-and-conditions'),
    chrome: loadChromeData() as ChromeData,
  };
}
