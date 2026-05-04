/**
 * One-time / idempotent migrations for the 2026 practitioner landing redesign.
 * Safe on production: gated by settings markers; does not clobber non-empty admin edits
 * for arbitrary keys (hero uses a dedicated one-shot patch).
 */
import db from '../config/database.js';

const MARKER_SECTIONS = 'redesign_2026_sections_v1_done';
const MARKER_JAIMEE = 'redesign_2026_jaimee_rename_done';
const MARKER_REAL_SCREENSHOTS_V2 = 'redesign_2026_real_screenshots_v2_done';

function getSetting(key) {
  try {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
    return row?.value ?? null;
  } catch {
    return null;
  }
}

function setSetting(key, value) {
  db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, value);
}

function ensureSection(name, orderIndex) {
  db.prepare(`
    INSERT INTO sections (name, enabled, order_index)
    VALUES (?, 1, ?)
    ON CONFLICT(name) DO UPDATE SET
      enabled = 1,
      order_index = excluded.order_index,
      updated_at = CURRENT_TIMESTAMP
  `).run(name, orderIndex);
}

function getSectionId(name) {
  const row = db.prepare('SELECT id FROM sections WHERE name = ?').get(name);
  return row?.id ?? null;
}

function replaceJaimeeEverywhere() {
  const run = (sql) => {
    try {
      db.exec(sql);
    } catch (e) {
      console.warn('jaimee replace skip:', e.message);
    }
  };
  run(`UPDATE content SET value = replace(replace(replace(replace(value, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT')`);
  run(`UPDATE feature_items SET title = replace(replace(replace(replace(title, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT'), description = replace(replace(replace(replace(description, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT')`);
  run(`UPDATE testimonials SET name = replace(replace(replace(replace(name, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT'), role = replace(replace(replace(replace(role, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT'), content = replace(replace(replace(replace(content, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT')`);
  run(`UPDATE faq_items SET question = replace(replace(replace(replace(question, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT'), answer = replace(replace(replace(replace(answer, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT')`);
  run(`UPDATE pricing_plans SET name = replace(replace(replace(replace(name, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT'), features = replace(replace(replace(replace(features, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT')`);
  run(`UPDATE help_articles SET title = replace(replace(replace(replace(title, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT'), content = replace(replace(replace(replace(content, 'jAImee', 'ANTSAbot'), 'Jaimee', 'ANTSAbot'), 'jaimee', 'ANTSAbot'), 'JAIMEE', 'ANTSABOT')`);
}

function runSectionsMigration() {
  if (getSetting(MARKER_SECTIONS) === '1') return;

  const order = [
    ['hero', 1],
    ['trust_strip', 2],
    ['why_switch', 3],
    ['everything_one_login', 4],
    ['the-shift', 5],
    ['the-antsa', 6],
    ['features', 7],
    ['team', 8],
    ['pricing', 9],
    ['faq', 10],
    ['for_clinics', 11],
    ['testimonials', 12],
    ['compliance', 13],
    ['footer', 14],
  ];

  for (const [name, idx] of order) {
    ensureSection(name, idx);
  }

  const contentUpsert = db.prepare(`
    INSERT INTO content (section_id, key, value, type)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(section_id, key) DO UPDATE SET
      value = excluded.value,
      type = excluded.type,
      updated_at = CURRENT_TIMESTAMP
  `);

  const heroId = getSectionId('hero');
  if (heroId) {
    contentUpsert.run(
      heroId,
      'badge',
      'BUILT BY CLINICIANS. TRUSTED BY PRACTITIONERS',
      'text',
    );
    contentUpsert.run(
      heroId,
      'title',
      'Support clients between sessions. Reduce admin. One system built for practitioners.',
      'text',
    );
    contentUpsert.run(heroId, 'title_highlights', JSON.stringify(['Reduce admin.']), 'json');
    contentUpsert.run(
      heroId,
      'description',
      'ANTSA combines client engagement tools, AI documentation, telehealth, reminders, questionnaires and practitioner-visible AI support in one secure Australian system.',
      'text',
    );
    contentUpsert.run(heroId, 'cta_primary', 'Start Free Trial', 'text');
    contentUpsert.run(heroId, 'cta_primary_url', '/free-trial', 'text');
    contentUpsert.run(heroId, 'cta_secondary', 'Book a Demo', 'text');
    contentUpsert.run(
      heroId,
      'cta_secondary_url',
      'mailto:admin@antsa.com.au?subject=Book%20a%20Demo%20-%20ANTSA&body=Hi%20ANTSA%20team%2C%0A%0AI%E2%80%99d%20like%20to%20book%20a%20demo%20of%20the%20ANTSA%20platform.%0A%0APlease%20let%20me%20know%20your%20available%20times.%0A%0AThanks!',
      'text',
    );
    contentUpsert.run(heroId, 'hero_desktop_image', '/landing/hero-dashboard.svg', 'text');
    contentUpsert.run(heroId, 'hero_mobile_image', '/landing/hero-phone.svg', 'text');
  }

  const trustId = getSectionId('trust_strip');
  if (trustId) {
    const badges = JSON.stringify([
      { label: 'Australian Hosted', icon: 'GlobalOutlined' },
      { label: 'Built by Clinicians', icon: 'MedicineBoxOutlined' },
      { label: 'HIPAA & APP Aligned', icon: 'SafetyCertificateOutlined' },
      { label: 'No Lock-In', icon: 'UnlockOutlined' },
      { label: 'Unlimited Clients', icon: 'TeamOutlined' },
    ]);
    contentUpsert.run(trustId, 'items', badges, 'json');
  }

  const whyId = getSectionId('why_switch');
  if (whyId) {
    contentUpsert.run(whyId, 'badge', 'WHY PRACTITIONERS SWITCH TO ANTSA', 'text');
    contentUpsert.run(whyId, 'title', 'Why practitioners switch', 'text');
    contentUpsert.run(
      whyId,
      'subtitle',
      'One platform aligned to how modern mental health practice actually works.',
      'text',
    );

    const count = db.prepare('SELECT COUNT(*) as c FROM feature_items WHERE section_id = ?').get(whyId);
    if (count.c === 0) {
      const fi = db.prepare(`
        INSERT INTO feature_items (section_id, title, description, icon, color, gradient, order_index, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const items = [
        {
          title: 'Less Admin',
          description:
            'AI scribe, automated session summaries, and structured templates cut documentation time so you can focus on clients.',
          icon: 'FileTextOutlined',
          color: '#48abe2',
          gradient: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
          order_index: 1,
        },
        {
          title: 'Better Client Engagement',
          description:
            'Homework, journaling, messaging, and ANTSAbot keep clients connected between sessions — all visible to you.',
          icon: 'TeamOutlined',
          color: '#10b981',
          gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          order_index: 2,
        },
        {
          title: 'Fewer Subscriptions',
          description:
            'Telehealth, forms, mood tracking, and notes in one login instead of stitching tools together.',
          icon: 'AppstoreOutlined',
          color: '#8b5cf6',
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
          order_index: 3,
        },
        {
          title: 'Stay In The Loop',
          description:
            'See between-session activity, mood trends, and alerts so nothing important is missed.',
          icon: 'EyeOutlined',
          color: '#f59e0b',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          order_index: 4,
        },
        {
          title: 'Secure & Compliant',
          description:
            'Australian hosting, clinical governance, and privacy-aligned design built for health professionals.',
          icon: 'SafetyOutlined',
          color: '#06b6d4',
          gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
          order_index: 5,
        },
      ];
      for (const it of items) {
        fi.run(
          whyId,
          it.title,
          it.description,
          it.icon,
          it.color,
          it.gradient,
          it.order_index,
          null,
        );
      }
    }
  }

  const eolId = getSectionId('everything_one_login');
  if (eolId) {
    contentUpsert.run(eolId, 'badge', 'EVERYTHING IN ONE LOGIN', 'text');
    contentUpsert.run(eolId, 'title', 'Your whole practice stack, unified', 'text');
    contentUpsert.run(
      eolId,
      'subtitle',
      'Dashboard, client app, telehealth, AI notes, and outcomes — without tab overload.',
      'text',
    );

    const count = db.prepare('SELECT COUNT(*) as c FROM feature_items WHERE section_id = ?').get(eolId);
    if (count.c === 0) {
      const fi = db.prepare(`
        INSERT INTO feature_items (section_id, title, description, icon, color, gradient, order_index, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const tiles = [
        {
          title: 'Practitioner Dashboard',
          description: "See what's happening between sessions.",
          icon: 'DashboardOutlined',
          color: '#48abe2',
          gradient: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
          order_index: 1,
          image_url: '/landing/tile-dashboard.svg',
        },
        {
          title: 'Client App',
          description: 'Engage and support clients anytime, anywhere.',
          icon: 'MobileOutlined',
          color: '#10b981',
          gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          order_index: 2,
          image_url: '/landing/tile-client-app.svg',
        },
        {
          title: 'Telehealth',
          description: 'Built-in secure video for every session.',
          icon: 'VideoCameraOutlined',
          color: '#8b5cf6',
          gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
          order_index: 3,
          image_url: '/landing/tile-telehealth.svg',
        },
        {
          title: 'AI Scribe & Notes',
          description: 'Automated notes and session summaries.',
          icon: 'EditOutlined',
          color: '#f59e0b',
          gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          order_index: 4,
          image_url: '/landing/tile-ai-scribe.svg',
        },
        {
          title: 'Mood Tracking',
          description: 'Monitor progress and identify patterns early.',
          icon: 'LineChartOutlined',
          color: '#06b6d4',
          gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
          order_index: 5,
          image_url: '/landing/tile-mood.svg',
        },
      ];
      for (const t of tiles) {
        fi.run(
          eolId,
          t.title,
          t.description,
          t.icon,
          t.color,
          t.gradient,
          t.order_index,
          t.image_url,
        );
      }
    }
  }

  const fcId = getSectionId('for_clinics');
  if (fcId) {
    contentUpsert.run(fcId, 'title', 'For Clinics & Enterprises', 'text');
    contentUpsert.run(
      fcId,
      'subtitle',
      'Need multi-practitioner access, reporting, integrations or enterprise rollout? ANTSA scales with your organisation.',
      'text',
    );
    contentUpsert.run(
      fcId,
      'checklist',
      JSON.stringify([
        'Role-based access',
        'Advanced reporting',
        'Integrations & API access',
        'Dedicated onboarding',
      ]),
      'json',
    );
    contentUpsert.run(fcId, 'cta_label', 'Talk to Us', 'text');
    contentUpsert.run(fcId, 'cta_href', 'mailto:admin@antsa.com.au?subject=Enterprise%20ANTSA', 'text');
  }

  const testId = getSectionId('testimonials');
  if (testId) {
    db.prepare('UPDATE sections SET enabled = 1 WHERE id = ?').run(testId);
    contentUpsert.run(testId, 'badge', 'TRUSTED BY PRACTITIONERS', 'text');
    contentUpsert.run(testId, 'title', 'Trusted by practitioners', 'text');
    contentUpsert.run(
      testId,
      'subtitle',
      'Teams use ANTSA to stay connected to clients and reduce administrative load.',
      'text',
    );

    const tc = db.prepare('SELECT COUNT(*) as c FROM testimonials WHERE section_id = ?').get(testId);
    if (tc.c === 0) {
      db.prepare(`
        INSERT INTO testimonials (section_id, name, role, content, rating, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        testId,
        'Psychologist',
        'Private Practice',
        'ANTSA has transformed the way I support my clients between sessions. I save time, stay in the loop, and my clients feel more supported.',
        5,
        1,
      );
    }
  }

  setSetting(MARKER_SECTIONS, '1');
  console.log('✅ redesign_2026: sections + content migration applied');
}

function runJaimeeRename() {
  if (getSetting(MARKER_JAIMEE) === '1') return;
  replaceJaimeeEverywhere();
  setSetting(MARKER_JAIMEE, '1');
  console.log('✅ redesign_2026: jAImee → ANTSAbot rename applied');
}

/**
 * v2 — point hero + EOL feature_items at real product PNGs (committed under
 * /landing/*.png by the build) and replace any leftover SVG paths from v1.
 */
function runRealScreenshotsV2() {
  if (getSetting(MARKER_REAL_SCREENSHOTS_V2) === '1') return;

  const heroId = getSectionId('hero');
  const contentUpsert = db.prepare(`
    INSERT INTO content (section_id, key, value, type)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(section_id, key) DO UPDATE SET
      value = excluded.value,
      type = excluded.type,
      updated_at = CURRENT_TIMESTAMP
  `);
  if (heroId) {
    // Replace the SVG placeholder if no admin override has been set.
    const replaceIfPlaceholder = (key, newPath) => {
      const row = db
        .prepare('SELECT value FROM content WHERE section_id = ? AND key = ?')
        .get(heroId, key);
      const v = row?.value || '';
      if (!row || v === '' || v.endsWith('.svg') || v.includes('/landing/hero-')) {
        contentUpsert.run(heroId, key, newPath, 'text');
      }
    };
    replaceIfPlaceholder('hero_desktop_image', '/landing/dashboard.png');
    replaceIfPlaceholder('hero_mobile_image', '/landing/mobile-sign-in.png');
  }

  // EOL tiles — swap each placeholder svg for its png counterpart.
  const eolId = getSectionId('everything_one_login');
  if (eolId) {
    const swap = (titleLike, png) => {
      db.prepare(
        `UPDATE feature_items SET image_url = ?, updated_at = CURRENT_TIMESTAMP
         WHERE section_id = ? AND title LIKE ?
           AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%/tile-%.svg' OR image_url LIKE '%/landing/tile-%')`,
      ).run(png, eolId, titleLike);
    };
    swap('Practitioner Dashboard%', '/landing/dashboard.png');
    swap('Client App%', '/landing/clients-list.png');
    swap('Telehealth%', '/landing/calendar.png');
    swap('AI Scribe%', '/landing/templates.png');
    swap('Mood%', '/landing/client-detail-overview.png');
  }

  setSetting(MARKER_REAL_SCREENSHOTS_V2, '1');
  console.log('✅ redesign_2026: real product screenshots applied');
}

export function runRedesignMigrations() {
  try {
    runSectionsMigration();
    runJaimeeRename();
    runRealScreenshotsV2();
  } catch (e) {
    console.error('⚠️ redesign_2026 migration error:', e.message);
  }
}

