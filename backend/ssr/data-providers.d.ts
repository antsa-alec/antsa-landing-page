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

export type SsrChromeData = {
  header: {
    signup_url?: string;
    signup_label?: string;
    signin_url?: string;
    signin_label?: string;
    demo_url?: string;
    demo_label?: string;
  } | null;
  footer: { copyright?: string; description?: string } | null;
  socialLinks: Array<{ id: string | number; platform: string; url: string }>;
  footerLinks: Array<{ id: string | number; label: string; url: string }>;
};

export function loadAllSections(): SsrSectionRow[];
export function loadHelpArticles(): SsrHelpArticle[];
export function loadLegalPage(slug: string): SsrLegalPage | null;
export function loadHelpForFrontend(): { categories: HelpCategory[] };
export function loadChromeData(): SsrChromeData;
