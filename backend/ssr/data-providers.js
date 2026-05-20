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
