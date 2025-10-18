import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '..', 'content.db'));

console.log('🔧 Creating settings section...');

try {
  // Insert settings section if it doesn't exist
  const insertSection = db.prepare(`
    INSERT OR IGNORE INTO sections (name, enabled, order_index)
    VALUES ('settings', 1, 99)
  `);
  
  insertSection.run();

  // Get the settings section ID
  const section = db.prepare('SELECT id FROM sections WHERE name = ?').get('settings');
  
  if (section) {
    console.log(`✅ Settings section created with ID: ${section.id}`);
    
    // Add default content keys for settings
    const insertContent = db.prepare(`
      INSERT OR IGNORE INTO content (section_id, key, value, type)
      VALUES (?, ?, ?, ?)
    `);
    
    const defaultSettings = [
      ['signup_url', '#', 'text'],
      ['pricing_url', '#', 'text'],
      ['demo_video_url', '#', 'text'],
      ['features_cta_text', 'Get Started Free', 'text'],
      ['features_cta_url', '#', 'text'],
      ['pricing_free_cta_text', 'Start Free Trial', 'text'],
      ['pricing_paid_cta_text', 'Get Started', 'text'],
      ['footer_copyright', '© 2025 ANTSA. All rights reserved.', 'text'],
      ['footer_tagline', 'Made with ❤️ in Australia', 'text'],
      ['footer_subtitle', 'Data encrypted and securely hosted on Australian servers', 'text'],
    ];
    
    defaultSettings.forEach(([key, value, type]) => {
      insertContent.run(section.id, key, value, type);
    });
    
    console.log('✅ Default settings content added');
  }
  
  console.log('✅ Settings section setup complete!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

db.close();

