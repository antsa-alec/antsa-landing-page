import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '..', 'content.db'));

console.log('🔧 Adding new tables for landing page refactor...');

try {
  // ==========================================
  // 1. Navigation Items Table
  // ==========================================
  console.log('  Creating nav_items table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS nav_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      url TEXT,
      order_index INTEGER DEFAULT 0,
      parent_id INTEGER,
      is_cta INTEGER DEFAULT 0,
      cta_style TEXT DEFAULT 'default',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES nav_items(id) ON DELETE CASCADE
    );
  `);

  // Insert default navigation items
  const insertNav = db.prepare(`
    INSERT OR IGNORE INTO nav_items (label, url, order_index, parent_id, is_cta, cta_style)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Check if nav_items already has data
  const navCount = db.prepare('SELECT COUNT(*) as count FROM nav_items').get();
  if (navCount.count === 0) {
    const defaultNavItems = [
      ['Product', '#features', 1, null, 0, 'default'],
      ['Pricing', '#pricing', 2, null, 0, 'default'],
      ['Testimonials', '#testimonials', 3, null, 0, 'default'],
      ['Team', '#team', 4, null, 0, 'default'],
      ['Contact', '#contact', 5, null, 0, 'default'],
      ['Sign In', 'https://app.antsa.ai/login', 6, null, 1, 'ghost'],
      ['Get Started', 'https://app.antsa.ai/signup', 7, null, 1, 'primary'],
    ];

    defaultNavItems.forEach(([label, url, order, parentId, isCta, ctaStyle]) => {
      insertNav.run(label, url, order, parentId, isCta, ctaStyle);
    });
    console.log('  ✓ Default navigation items inserted');
  }

  // ==========================================
  // 2. Sponsors/Partners Table
  // ==========================================
  console.log('  Creating sponsors table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS sponsors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT,
      website_url TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add sponsors section to sections table if not exists
  const sponsorsSection = db.prepare('SELECT id FROM sections WHERE name = ?').get('sponsors');
  if (!sponsorsSection) {
    db.prepare(`
      INSERT INTO sections (name, enabled, order_index)
      VALUES (?, ?, ?)
    `).run('sponsors', 1, 2); // After hero (1)
    console.log('  ✓ Sponsors section added');
  }

  // Add sponsors section content defaults
  const sponsorsSectionId = db.prepare('SELECT id FROM sections WHERE name = ?').get('sponsors')?.id;
  if (sponsorsSectionId) {
    const insertContent = db.prepare(`
      INSERT OR IGNORE INTO content (section_id, key, value, type)
      VALUES (?, ?, ?, ?)
    `);
    insertContent.run(sponsorsSectionId, 'title', 'Trusted By', 'text');
    insertContent.run(sponsorsSectionId, 'subtitle', 'Leading mental health organizations', 'text');
  }

  // ==========================================
  // 3. FAQ Items Table
  // ==========================================
  console.log('  Creating faq_items table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS faq_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
    );
  `);

  // Add FAQ section to sections table if not exists
  const faqSection = db.prepare('SELECT id FROM sections WHERE name = ?').get('faq');
  if (!faqSection) {
    db.prepare(`
      INSERT INTO sections (name, enabled, order_index)
      VALUES (?, ?, ?)
    `).run('faq', 1, 5); // After pricing (4)
    console.log('  ✓ FAQ section added');
  }

  // Add FAQ section content defaults and default items
  const faqSectionId = db.prepare('SELECT id FROM sections WHERE name = ?').get('faq')?.id;
  if (faqSectionId) {
    const insertContent = db.prepare(`
      INSERT OR IGNORE INTO content (section_id, key, value, type)
      VALUES (?, ?, ?, ?)
    `);
    insertContent.run(faqSectionId, 'title', 'Frequently Asked Questions', 'text');
    insertContent.run(faqSectionId, 'subtitle', 'Everything you need to know about ANTSA', 'text');

    // Check if FAQ items already exist
    const faqCount = db.prepare('SELECT COUNT(*) as count FROM faq_items WHERE section_id = ?').get(faqSectionId);
    if (faqCount.count === 0) {
      const insertFaq = db.prepare(`
        INSERT INTO faq_items (section_id, question, answer, order_index)
        VALUES (?, ?, ?, ?)
      `);

      const defaultFaqs = [
        ['What is ANTSA?', 'ANTSA is an AI-powered mental health platform that connects practitioners with clients. It includes tools like jAImee (our AI chatbot), AI Scribe for session transcription, and comprehensive practitioner dashboards.', 1],
        ['How does the free trial work?', 'Our 30-day free trial gives you full access to all features with no credit card required. You can add unlimited clients, use all AI features, and experience the full platform before deciding on a paid plan.', 2],
        ['Is my data secure?', 'Absolutely. All data is encrypted and securely hosted on Australian servers. We comply with Australian privacy laws and healthcare data regulations to ensure your client information is protected.', 3],
        ['Can I cancel anytime?', 'Yes, there are no minimum terms or lock-in contracts. You can cancel your subscription at any time, and you\'ll continue to have access until the end of your billing period.', 4],
        ['What support do you offer?', 'We offer email support for all plans, with priority support for paid subscribers. Clinic owners also get a dedicated account manager for personalized assistance.', 5],
        ['How does jAImee work?', 'jAImee is our AI mental health assistant that provides 24/7 support to clients between sessions. It uses evidence-based conversations and is overseen by practitioners to ensure quality care.', 6],
      ];

      defaultFaqs.forEach(([question, answer, order]) => {
        insertFaq.run(faqSectionId, question, answer, order);
      });
      console.log('  ✓ Default FAQ items inserted');
    }
  }

  // ==========================================
  // 4. Footer Categories Table
  // ==========================================
  console.log('  Creating footer_categories table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS footer_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add category_id column to footer_links if not exists
  try {
    db.exec(`ALTER TABLE footer_links ADD COLUMN category_id INTEGER REFERENCES footer_categories(id)`);
    console.log('  ✓ category_id column added to footer_links');
  } catch (e) {
    // Column likely already exists
    if (!e.message.includes('duplicate column')) {
      console.log('  ℹ category_id column already exists in footer_links');
    }
  }

  // Insert default footer categories
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM footer_categories').get();
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare(`
      INSERT INTO footer_categories (title, order_index)
      VALUES (?, ?)
    `);

    const defaultCategories = [
      ['Product', 1],
      ['Company', 2],
      ['Legal', 3],
    ];

    defaultCategories.forEach(([title, order]) => {
      insertCategory.run(title, order);
    });
    console.log('  ✓ Default footer categories inserted');

    // Get category IDs and update existing footer links
    const productCat = db.prepare('SELECT id FROM footer_categories WHERE title = ?').get('Product');
    const companyCat = db.prepare('SELECT id FROM footer_categories WHERE title = ?').get('Company');
    const legalCat = db.prepare('SELECT id FROM footer_categories WHERE title = ?').get('Legal');

    // Update existing footer links with categories
    const updateLink = db.prepare('UPDATE footer_links SET category_id = ? WHERE label = ?');
    
    // Assign Privacy Policy and Terms to Legal
    if (legalCat) {
      updateLink.run(legalCat.id, 'Privacy Policy');
      updateLink.run(legalCat.id, 'Terms of Service');
    }

    // Insert additional footer links for other categories
    const insertLink = db.prepare(`
      INSERT OR IGNORE INTO footer_links (label, url, order_index, category_id)
      VALUES (?, ?, ?, ?)
    `);

    if (productCat) {
      insertLink.run('Features', '#features', 1, productCat.id);
      insertLink.run('Pricing', '#pricing', 2, productCat.id);
      insertLink.run('AI Scribe', '#features', 3, productCat.id);
      insertLink.run('jAImee', '#features', 4, productCat.id);
    }

    if (companyCat) {
      insertLink.run('About Us', '#team', 1, companyCat.id);
      insertLink.run('Contact', '#contact', 2, companyCat.id);
      insertLink.run('Support', 'mailto:support@antsa.com.au', 3, companyCat.id);
    }

    console.log('  ✓ Footer links updated with categories');
  }

  // ==========================================
  // 5. Add header settings to settings section
  // ==========================================
  console.log('  Adding header settings...');
  const settingsSection = db.prepare('SELECT id FROM sections WHERE name = ?').get('settings');
  if (settingsSection) {
    const insertContent = db.prepare(`
      INSERT OR IGNORE INTO content (section_id, key, value, type)
      VALUES (?, ?, ?, ?)
    `);
    insertContent.run(settingsSection.id, 'header_logo_text', 'ANTSA', 'text');
    insertContent.run(settingsSection.id, 'header_sticky', 'true', 'text');
    insertContent.run(settingsSection.id, 'header_transparent_on_hero', 'true', 'text');
  }

  console.log('✅ All new tables created successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

db.close();
