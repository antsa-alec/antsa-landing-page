import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '..', 'content.db'));

console.log('🔧 Adding team_member_socials table...');

try {
  // Create team_member_socials table
  db.exec(`
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
  `);

  console.log('✅ Team member socials table created successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

db.close();

