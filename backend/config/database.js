import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to rebuild better-sqlite3 if it fails to load
let db;
try {
  db = new Database(join(__dirname, '..', 'content.db'));
} catch (error) {
  if (error.code === 'ERR_DLOPEN_FAILED') {
    console.log('⚠️  Database module needs rebuilding...');
    try {
      execSync('npm rebuild better-sqlite3', { 
        cwd: join(__dirname, '..'),
        stdio: 'inherit'
      });
      db = new Database(join(__dirname, '..', 'content.db'));
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

// Seed legal pages defaults
try {
  const lpCount = db.prepare("SELECT COUNT(*) as cnt FROM legal_pages").get();
  if (lpCount.cnt === 0) {
    const ins = db.prepare("INSERT OR IGNORE INTO legal_pages (slug, title, content, last_updated) VALUES (?, ?, ?, ?)");
    ins.run('privacy-policy', 'Privacy Policy', '', 'February 2026');
    ins.run('terms-and-conditions', 'Terms & Conditions', '', 'February 2026');
    console.log('✅ Seeded legal_pages with defaults');
  }
} catch (e) {
  // Will be created on next restart
}

export default db;

