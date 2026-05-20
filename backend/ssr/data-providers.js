import db from '../config/database.js';
import { loadAllSections, loadHelpArticles } from '../routes/seo.js';

export { loadAllSections, loadHelpArticles };

/**
 * Load the data needed by the global chrome (AppHeader + AppFooter) on every page.
 * Returning this from each page's +data.ts ensures the SSR HTML matches the client's
 * first render, eliminating hydration mismatches that previously occurred because
 * AppHeader/AppFooter fetched these values via useEffect on the client only.
 *
 * Shape:
 *   {
 *     header: { signup_url, signup_label, signin_url, signin_label, demo_url, demo_label } | null,
 *     footer: { copyright?, description? } | null,
 *     socialLinks: Array<{ id, platform, url }>,
 *     footerLinks: Array<{ id, label, url }>,
 *   }
 */
export function loadChromeData() {
  const result = {
    header: null,
    footer: null,
    socialLinks: [],
    footerLinks: [],
  };

  try {
    const sectionStmt = db.prepare('SELECT id FROM sections WHERE name = ?');
    const contentStmt = db.prepare('SELECT key, value, type FROM content WHERE section_id = ?');

    const readSectionContent = (name) => {
      const row = sectionStmt.get(name);
      if (!row) return null;
      const content = {};
      for (const c of contentStmt.all(row.id)) {
        try {
          content[c.key] = c.type === 'json' ? JSON.parse(c.value) : c.value;
        } catch {
          content[c.key] = c.value;
        }
      }
      return content;
    };

    result.header = readSectionContent('header');
    result.footer = readSectionContent('footer');
  } catch (err) {
    console.error('loadChromeData(): header/footer section load failed:', err);
  }

  try {
    result.socialLinks = db
      .prepare('SELECT * FROM social_links ORDER BY order_index')
      .all();
  } catch (err) {
    console.error('loadChromeData(): social_links load failed:', err);
  }

  try {
    result.footerLinks = db
      .prepare('SELECT * FROM footer_links ORDER BY order_index')
      .all();
  } catch (err) {
    console.error('loadChromeData(): footer_links load failed:', err);
  }

  return result;
}

/**
 * Load a single legal page (privacy-policy, terms-and-conditions, …) by slug.
 * Returns { title, content, last_updated } or null if not found.
 */
export function loadLegalPage(slug) {
  try {
    const row = db
      .prepare('SELECT title, content, last_updated FROM legal_pages WHERE slug = ?')
      .get(slug);
    return row || null;
  } catch (err) {
    console.error(`loadLegalPage(${slug}) failed:`, err);
    return null;
  }
}

/**
 * Load the full help centre category tree for SSR.
 * Returns the same shape as GET /api/content/help: { categories: Category[] }
 */
export function loadHelpForFrontend() {
  try {
    const categories = db
      .prepare('SELECT * FROM help_categories WHERE parent_id IS NULL ORDER BY order_index')
      .all();

    const subCatStmt = db.prepare(
      'SELECT * FROM help_categories WHERE parent_id = ? ORDER BY order_index'
    );
    const articlesStmt = db.prepare(
      'SELECT * FROM help_articles WHERE category_id = ? ORDER BY order_index'
    );

    const tree = categories.map((cat) => {
      const subcategories = subCatStmt.all(cat.id).map((sub) => ({
        ...sub,
        articles: articlesStmt.all(sub.id),
      }));
      return {
        ...cat,
        articles: articlesStmt.all(cat.id),
        subcategories,
      };
    });

    return { categories: tree };
  } catch (err) {
    console.error('loadHelpForFrontend() failed:', err);
    return { categories: [] };
  }
}
