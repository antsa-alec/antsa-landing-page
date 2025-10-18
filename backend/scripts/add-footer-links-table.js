import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '..', 'content.db'));

console.log('🔧 Adding footer_links table...');

try {
  // Create footer_links table
  db.exec(`
    CREATE TABLE IF NOT EXISTS footer_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Insert default footer links
  const insertLink = db.prepare(`
    INSERT INTO footer_links (label, url, order_index)
    VALUES (?, ?, ?)
  `);

  const defaultLinks = [
    ['Privacy Policy', '#', 1],
    ['Terms of Service', '#', 2],
  ];

  defaultLinks.forEach(([label, url, order]) => {
    insertLink.run(label, url, order);
  });

  // Remove old footer URL settings from content table
  db.exec(`
    DELETE FROM content WHERE key IN (
      'footer_privacy_url',
      'footer_terms_url', 
      'footer_support_url',
      'footer_about_url',
      'footer_careers_url'
    );
  `);

  console.log('✅ Footer links table created and migrated successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

db.close();

