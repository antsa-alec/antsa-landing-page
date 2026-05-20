export type SsrSectionRow = {
  name: string;
  content: Record<string, unknown>;
  features?: Array<Record<string, unknown>>;
  pricing?: Array<Record<string, unknown>>;
  team?: Array<Record<string, unknown>>;
  testimonials?: Array<Record<string, unknown>>;
  faqs?: Array<Record<string, unknown>>;
};

export type SsrHelpArticle = {
  title: string;
  content: string;
  category: string;
};

export type SsrLegalPage = {
  title: string;
  content: string;
  last_updated: string;
};

export function loadAllSections(): SsrSectionRow[];
export function loadHelpArticles(): SsrHelpArticle[];
export function loadLegalPage(slug: string): SsrLegalPage | null;
