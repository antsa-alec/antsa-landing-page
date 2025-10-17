import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'content.db'));

console.log('🔧 Adding footer settings...');

try {
  // Get settings section
  const checkSection = db.prepare('SELECT * FROM sections WHERE name = ?');
  let settingsSection = checkSection.get('settings');

  if (!settingsSection) {
    console.error('❌ Settings section not found. Run add-settings.js first.');
    process.exit(1);
  }

  // Add footer settings
  const upsertSetting = db.prepare(`
    INSERT INTO content (section_id, key, value, type)
    VALUES (?, ?, ?, 'text')
    ON CONFLICT(section_id, key) DO UPDATE SET
      value = excluded.value
  `);

  const footerSettings = [
    // Footer links
    { key: 'footer_privacy_url', value: 'https://antsa.ai/privacy' },
    { key: 'footer_terms_url', value: 'https://antsa.ai/terms' },
    { key: 'footer_support_url', value: 'https://antsa.ai/support' },
    { key: 'footer_about_url', value: 'https://antsa.ai/about' },
    { key: 'footer_careers_url', value: 'https://antsa.ai/careers' },
    
    // Footer text
    { key: 'footer_copyright', value: '© 2025 ANTSA. All rights reserved.' },
    { key: 'footer_tagline', value: 'Made with ❤️ in Australia' },
    { key: 'footer_subtitle', value: 'Data encrypted and securely hosted on Australian servers' },
  ];

  footerSettings.forEach(({ key, value }) => {
    upsertSetting.run(settingsSection.id, key, value);
  });

  console.log('✅ Footer settings added successfully!');
  console.log(`   - Added ${footerSettings.length} footer configuration options`);
} catch (error) {
  console.error('Error:', error.message);
}

db.close();

