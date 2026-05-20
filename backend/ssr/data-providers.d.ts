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

export type HelpArticle = {
  id: number;
  title: string;
  content: string;
  order_index: number;
};

export type HelpSubCategory = {
  id: number;
  name: string;
  slug: string;
  articles: HelpArticle[];
};

export type HelpCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  articles: HelpArticle[];
  subcategories: HelpSubCategory[];
};

export function loadAllSections(): SsrSectionRow[];
export function loadHelpArticles(): SsrHelpArticle[];
export function loadLegalPage(slug: string): SsrLegalPage | null;
export function loadHelpForFrontend(): { categories: HelpCategory[] };
