import { loadLegalPage } from '../../../backend/ssr/data-providers.js';

export type TermsData = { page: { title: string; content: string; last_updated: string } | null };

export function data(): TermsData {
  return { page: loadLegalPage('terms-and-conditions') };
}
