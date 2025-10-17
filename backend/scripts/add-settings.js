import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'content.db'));

console.log('🔧 Adding global settings section...');

try {
  // Check if settings section exists
  const checkSection = db.prepare('SELECT * FROM sections WHERE name = ?');
  let settingsSection = checkSection.get('settings');

  if (!settingsSection) {
    // Create settings section
    const insertSection = db.prepare(`
      INSERT INTO sections (name, enabled, order_index)
      VALUES ('settings', 1, 999)
    `);
    const result = insertSection.run();
    settingsSection = { id: result.lastInsertRowid };
    console.log('✅ Created settings section');
  } else {
    console.log('⚠️  Settings section already exists');
  }

  // Add default settings
  const upsertSetting = db.prepare(`
    INSERT INTO content (section_id, key, value, type)
    VALUES (?, ?, ?, 'text')
    ON CONFLICT(section_id, key) DO UPDATE SET
      value = excluded.value
  `);

  const settings = [
    { key: 'signup_url', value: 'https://app.antsa.ai/signup' },
    { key: 'pricing_url', value: 'https://app.antsa.ai/pricing' },
    { key: 'demo_video_url', value: 'https://www.youtube.com/watch?v=demo' },
    { key: 'features_cta_text', value: 'Get Started Free' },
    { key: 'features_cta_url', value: 'https://app.antsa.ai/signup' },
    { key: 'pricing_free_cta_text', value: 'Start Free Trial' },
    { key: 'pricing_paid_cta_text', value: 'Get Started' },
  ];

  settings.forEach(({ key, value }) => {
    upsertSetting.run(settingsSection.id, key, value);
  });

  console.log('✅ Default settings added successfully!');
} catch (error) {
  console.error('Error:', error.message);
}

db.close();

