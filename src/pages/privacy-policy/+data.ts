import { loadLegalPage } from '../../../backend/ssr/data-providers.js';

export type PrivacyData = { page: { title: string; content: string; last_updated: string } | null };

export function data(): PrivacyData {
  return { page: loadLegalPage('privacy-policy') };
}
