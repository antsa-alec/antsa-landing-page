import db from '../config/database.js';
import { loadAllSections, loadHelpArticles } from '../routes/seo.js';

export { loadAllSections, loadHelpArticles };

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
