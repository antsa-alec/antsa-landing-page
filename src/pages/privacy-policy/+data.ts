import { loadLegalPage, loadChromeData } from '../../../backend/ssr/data-providers.js';
import type { ChromeData } from '../chrome-data';

export type PrivacyData = {
  page: { title: string; content: string; last_updated: string } | null;
  chrome: ChromeData;
};

export function data(): PrivacyData {
  return {
    page: loadLegalPage('privacy-policy'),
    chrome: loadChromeData() as ChromeData,
  };
}
