import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// On Azure App Service, /home persists across deployments but
// /home/site/wwwroot gets replaced on every deploy. Detect Azure
// by checking for /home/site (the App Service filesystem marker).
function getPersistentDir() {
  if (process.env.DB_PATH) return dirname(process.env.DB_PATH);
  if (existsSync('/home/site')) {
    // Running on Azure App Service
    if (!existsSync('/home/data')) mkdirSync('/home/data', { recursive: true });
    return '/home/data';
  }
  // Local development — use backend/ directory
  return join(__dirname, '..');
}

const PERSISTENT_DIR = getPersistentDir();

const DB_FILE = process.env.DB_PATH || join(PERSISTENT_DIR, 'content.db');
console.log(`💾 Database path: ${DB_FILE}`);

// Try to rebuild better-sqlite3 if it fails to load
let db;
try {
  db = new Database(DB_FILE);
} catch (error) {
  if (error.code === 'ERR_DLOPEN_FAILED') {
    console.log('⚠️  Database module needs rebuilding...');
    try {
      execSync('npm rebuild better-sqlite3', { 
        cwd: join(__dirname, '..'),
        stdio: 'inherit'
      });
      db = new Database(DB_FILE);
      console.log('✅ Database module rebuilt successfully');
    } catch (rebuildError) {
      console.error('❌ Failed to rebuild database module:', rebuildError);
      throw rebuildError;
    }
  } else {
    throw error;
  }
}

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    type TEXT DEFAULT 'text',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    UNIQUE(section_id, key)
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER,
    key TEXT NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    UNIQUE(section_id, key)
  );

  CREATE TABLE IF NOT EXISTS feature_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    gradient TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS pricing_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    period TEXT,
    featured BOOLEAN DEFAULT 0,
    features TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    image_id INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS team_member_socials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_member_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_member_id) REFERENCES team_members(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS faq_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS nav_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    parent_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES nav_items(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS footer_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS footer_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    category_id INTEGER,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES footer_categories(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS sponsors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at DATETIME,
    is_active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    path TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS legal_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    last_updated TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrations for existing databases
try {
  const imgCols = db.prepare("PRAGMA table_info(images)").all();
  if (!imgCols.some(c => c.name === 'updated_at')) {
    // No DEFAULT to stay compatible with older SQLite versions on some hosts
    db.exec("ALTER TABLE images ADD COLUMN updated_at DATETIME");
    console.log('✅ Migrated images: added updated_at column');
  }
} catch (e) {
  // Table may not exist yet
}

try {
  const tmCols = db.prepare("PRAGMA table_info(team_members)").all();
  if (!tmCols.some(c => c.name === 'image_url')) {
    db.exec("ALTER TABLE team_members ADD COLUMN image_url TEXT");
    console.log('✅ Migrated team_members: added image_url column');
  }

  const tsCols = db.prepare("PRAGMA table_info(team_member_socials)").all();
  if (!tsCols.some(c => c.name === 'order_index')) {
    db.exec("ALTER TABLE team_member_socials ADD COLUMN order_index INTEGER DEFAULT 0");
    console.log('✅ Migrated team_member_socials: added order_index column');
  }
  if (!tsCols.some(c => c.name === 'updated_at')) {
    db.exec("ALTER TABLE team_member_socials ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP");
    console.log('✅ Migrated team_member_socials: added updated_at column');
  }

  const fiCols = db.prepare("PRAGMA table_info(feature_items)").all();
  if (!fiCols.some(c => c.name === 'image_url')) {
    db.exec("ALTER TABLE feature_items ADD COLUMN image_url TEXT");
    console.log('✅ Migrated feature_items: added image_url column');
  }

  const tmCols2 = db.prepare("PRAGMA table_info(team_members)").all();
  if (!tmCols2.some(c => c.name === 'badge_url')) {
    db.exec("ALTER TABLE team_members ADD COLUMN badge_url TEXT");
    console.log('✅ Migrated team_members: added badge_url column');
  }

} catch (e) {
  // Tables may not exist yet, that's fine
}

// Ensure legal pages rows exist and populate empty content from defaults.
// Uses ON CONFLICT DO UPDATE so that:
//   - if the row doesn't exist → INSERT with seed content
//   - if the row exists with empty content → UPDATE with seed content
//   - if the row exists with real content → leave it unchanged (admin-entered content wins)
try {
  const defaultPrivacyPolicy = [
    '## 1. Introduction',
    '',
    'ANTSA Pty Ltd (ABN: 77 664 161 237) ("ANTSA", "we", "us", or "our") is committed to protecting your privacy.',
    'This Privacy Policy outlines how we collect, use, store and protect your personal information in accordance with the Australian Privacy Principles.',
    '',
    '## 2. Contact Us',
    '',
    'For privacy enquiries, please contact us at [help@antsa.com.au](mailto:help@antsa.com.au).',
    '',
    '*This page is a placeholder — the full Privacy Policy will be published here prior to launch.*',
  ].join('\n');

  const defaultTermsAndConditions = [
    '## 1. Agreement to Terms',
    '',
    'By accessing or using the ANTSA platform operated by ANTSA Pty Ltd (ABN: 77 664 161 237) (ACN: 664 161 237),',
    'you agree to be bound by these Terms & Conditions.',
    '',
    '## 2. Platform Description',
    '',
    'ANTSA provides a digital mental health platform connecting practitioners with clients.',
    '',
    '## 3. Contact Us',
    '',
    'For questions about these Terms & Conditions, please contact us at [help@antsa.com.au](mailto:help@antsa.com.au).',
    '',
    '*This page is a placeholder — the full Terms & Conditions will be published here prior to launch.*',
  ].join('\n');

  // Upsert: insert or update-if-empty so admin-entered content is never overwritten
  const upsert = db.prepare(`
    INSERT INTO legal_pages (slug, title, content, last_updated)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title       = CASE WHEN legal_pages.content = '' OR legal_pages.content IS NULL THEN excluded.title       ELSE legal_pages.title       END,
      content     = CASE WHEN legal_pages.content = '' OR legal_pages.content IS NULL THEN excluded.content     ELSE legal_pages.content     END,
      last_updated= CASE WHEN legal_pages.content = '' OR legal_pages.content IS NULL THEN excluded.last_updated ELSE legal_pages.last_updated END
  `);
  upsert.run('privacy-policy',       'Privacy Policy',       defaultPrivacyPolicy,       'February 2026');
  upsert.run('terms-and-conditions', 'Terms & Conditions',   defaultTermsAndConditions,  'February 2026');
  console.log('✅ Legal pages seeded/verified');
} catch (e) {
  console.error('⚠️  Legal pages seed error:', e.message);
}

export default db;
export { PERSISTENT_DIR };

