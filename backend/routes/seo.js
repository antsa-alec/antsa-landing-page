import express from 'express';
import db from '../config/database.js';

const router = express.Router();

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://antsa.ai';

const STATIC_ROUTES = [
  { path: '/', title: 'ANTSA — Digital Mental Health Platform' },
  { path: '/free-trial', title: 'Free Trial' },
  { path: '/help', title: 'Help Centre' },
  { path: '/privacy-policy', title: 'Privacy Policy' },
  { path: '/terms-and-conditions', title: 'Terms and Conditions' },
];

function stripHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadAllSections() {
  const sections = db
    .prepare('SELECT * FROM sections WHERE enabled = 1 ORDER BY order_index')
    .all();

  const contentStmt = db.prepare('SELECT key, value, type FROM content WHERE section_id = ?');
  const featuresStmt = db.prepare('SELECT title, description FROM feature_items WHERE section_id = ? ORDER BY order_index');
  const pricingStmt = db.prepare('SELECT name, price, period, features FROM pricing_plans WHERE section_id = ? ORDER BY order_index');
  const teamStmt = db.prepare('SELECT name, role, bio FROM team_members WHERE section_id = ? ORDER BY order_index');
  const testimonialsStmt = db.prepare('SELECT name, role, content FROM testimonials WHERE section_id = ? ORDER BY order_index');
  const faqStmt = db.prepare('SELECT question, answer FROM faq_items WHERE section_id = ? ORDER BY order_index');

  return sections.map((section) => {
    const content = {};
    for (const row of contentStmt.all(section.id)) {
      try {
        content[row.key] = row.type === 'json' ? JSON.parse(row.value) : row.value;
      } catch {
        content[row.key] = row.value;
      }
    }
    const extras = {};
    try { extras.features = featuresStmt.all(section.id); } catch {}
    try {
      extras.pricing = pricingStmt.all(section.id).map((p) => ({
        ...p,
        features: (() => {
          try { return p.features ? JSON.parse(p.features) : []; } catch { return []; }
        })(),
      }));
    } catch {}
    try { extras.team = teamStmt.all(section.id); } catch {}
    try { extras.testimonials = testimonialsStmt.all(section.id); } catch {}
    try { extras.faqs = faqStmt.all(section.id); } catch {}

    return { name: section.name, content, ...extras };
  });
}

function loadHelpArticles() {
  try {
    return db
      .prepare(`
        SELECT a.title AS title, a.content AS content, c.name AS category
        FROM help_articles a
        JOIN help_categories c ON c.id = a.category_id
        ORDER BY c.order_index, a.order_index
      `)
      .all();
  } catch {
    return [];
  }
}

function buildLlmsTxt(sections) {
  const hero = sections.find((s) => s.name === 'hero')?.content || {};
  const tagline = stripHtml(hero.title) || 'ANTSA — Digital Mental Health Platform';
  const summary = stripHtml(hero.description) ||
    'Australian-built digital mental health platform that keeps practitioners in the loop between sessions.';

  const lines = [];
  lines.push('# ANTSA');
  lines.push('');
  lines.push(`> ${summary}`);
  lines.push('');
  lines.push(tagline);
  lines.push('');
  lines.push('## Pages');
  for (const r of STATIC_ROUTES) {
    lines.push(`- [${r.title}](${SITE_ORIGIN}${r.path})`);
  }
  lines.push('');
  lines.push('## Machine-readable resources');
  lines.push(`- [Full content snapshot](${SITE_ORIGIN}/llms-full.txt) — every CMS-managed section as plain text`);
  lines.push(`- [Sitemap](${SITE_ORIGIN}/sitemap.xml)`);
  lines.push('');
  lines.push('## Contact');
  lines.push('- Email: admin@antsa.com.au');
  lines.push('');
  return lines.join('\n');
}

function buildLlmsFullTxt(sections, helpArticles) {
  const lines = [];
  lines.push('# ANTSA — Full Content Snapshot');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Source: ${SITE_ORIGIN}`);
  lines.push('');
  lines.push('This file is a plain-text dump of all CMS-managed marketing content,');
  lines.push('intended for LLMs and other automated readers.');
  lines.push('');

  for (const section of sections) {
    lines.push('---');
    lines.push('');
    lines.push(`## Section: ${section.name}`);
    lines.push('');

    const c = section.content || {};
    if (c.title) lines.push(`### ${stripHtml(c.title)}`);
    if (c.subtitle) lines.push(`*${stripHtml(c.subtitle)}*`);
    if (c.description) {
      lines.push('');
      lines.push(stripHtml(c.description));
    }

    for (const [key, value] of Object.entries(c)) {
      if (['title', 'subtitle', 'description'].includes(key)) continue;
      if (value == null || typeof value === 'object') continue;
      const text = stripHtml(value);
      if (!text || text.length < 3) continue;
      lines.push('');
      lines.push(`- **${key}**: ${text}`);
    }

    if (section.features?.length) {
      lines.push('');
      lines.push('### Features');
      for (const f of section.features) {
        lines.push(`- **${stripHtml(f.title)}** — ${stripHtml(f.description)}`);
      }
    }

    if (section.pricing?.length) {
      lines.push('');
      lines.push('### Pricing plans');
      for (const p of section.pricing) {
        const period = p.period ? `/${p.period}` : '';
        lines.push(`- **${p.name}** — ${p.price}${period}`);
        if (Array.isArray(p.features)) {
          for (const feat of p.features) {
            lines.push(`  - ${stripHtml(typeof feat === 'string' ? feat : feat?.text || '')}`);
          }
        }
      }
    }

    if (section.team?.length) {
      lines.push('');
      lines.push('### Team');
      for (const m of section.team) {
        lines.push(`- **${stripHtml(m.name)}** — ${stripHtml(m.role)}`);
        if (m.bio) lines.push(`  ${stripHtml(m.bio)}`);
      }
    }

    if (section.testimonials?.length) {
      lines.push('');
      lines.push('### Testimonials');
      for (const t of section.testimonials) {
        lines.push(`- "${stripHtml(t.content)}" — ${stripHtml(t.name)}${t.role ? `, ${stripHtml(t.role)}` : ''}`);
      }
    }

    if (section.faqs?.length) {
      lines.push('');
      lines.push('### FAQs');
      for (const f of section.faqs) {
        lines.push('');
        lines.push(`**Q: ${stripHtml(f.question)}**`);
        lines.push(`A: ${stripHtml(f.answer)}`);
      }
    }

    lines.push('');
  }

  if (helpArticles.length) {
    lines.push('---');
    lines.push('');
    lines.push('## Help Centre articles');
    lines.push('');
    let lastCategory = null;
    for (const a of helpArticles) {
      if (a.category !== lastCategory) {
        lines.push('');
        lines.push(`### ${a.category}`);
        lastCategory = a.category;
      }
      lines.push('');
      lines.push(`#### ${stripHtml(a.title)}`);
      const body = stripHtml(a.content);
      if (body) lines.push(body);
    }
  }

  return lines.join('\n');
}

function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = STATIC_ROUTES.map(
    (r) => `  <url>\n    <loc>${SITE_ORIGIN}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobotsTxt() {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
    `# Machine-readable site summary: ${SITE_ORIGIN}/llms.txt`,
    '',
  ].join('\n');
}

router.get('/llms.txt', (_req, res) => {
  try {
    const body = buildLlmsTxt(loadAllSections());
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=300');
    res.send(body);
  } catch (err) {
    console.error('llms.txt error:', err);
    res.status(500).type('text/plain').send('# ANTSA\n\nError generating llms.txt');
  }
});

router.get('/llms-full.txt', (_req, res) => {
  try {
    const body = buildLlmsFullTxt(loadAllSections(), loadHelpArticles());
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=300');
    res.send(body);
  } catch (err) {
    console.error('llms-full.txt error:', err);
    res.status(500).type('text/plain').send('# ANTSA\n\nError generating llms-full.txt');
  }
});

router.get('/sitemap.xml', (_req, res) => {
  try {
    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(buildSitemapXml());
  } catch (err) {
    console.error('sitemap.xml error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (_req, res) => {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(buildRobotsTxt());
});

export default router;
