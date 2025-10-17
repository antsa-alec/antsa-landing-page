import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'content.db'));

console.log('🔧 Updating database schema...');

try {
  // Add image_url column to team_members if it doesn't exist
  db.exec(`
    ALTER TABLE team_members ADD COLUMN image_url TEXT;
  `);
  console.log('✅ Added image_url to team_members');
} catch (e) {
  if (e.message.includes('duplicate column name')) {
    console.log('⚠️  image_url column already exists in team_members');
  } else {
    console.error('Error updating team_members:', e.message);
  }
}

// Add updated_at column update trigger
db.exec(`
  CREATE TRIGGER IF NOT EXISTS update_team_members_timestamp 
  AFTER UPDATE ON team_members
  BEGIN
    UPDATE team_members SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`);

console.log('✅ Database schema updated successfully!');
db.close();

