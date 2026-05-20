import express from 'express';
import db from '../config/database.js';

const router = express.Router();

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://antsa.ai';

const STATIC_ROUTES = [
  { path: '/', title: 'ANTSA — Support clients between sessions. Reduce admin.' },
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
  const featuresStmt = db.prepare(
    'SELECT title, description, image_url FROM feature_items WHERE section_id = ? ORDER BY order_index',
  );
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
  const tagline =
    stripHtml(hero.title) ||
    'Support clients between sessions. Reduce admin. One system built for practitioners.';
  const summary =
    stripHtml(hero.description) ||
    'Australian-built mental health platform for practitioners: client engagement, AI documentation (including ANTSAbot), telehealth, and measures — one secure Australian-hosted login.';

  const lines = [];
  lines.push('# ANTSA');
  lines.push('');
  lines.push(`> ${summary}`);
  lines.push('');
  lines.push(tagline);
  lines.push('');
  lines.push('## Highlights');
  lines.push('- Why practitioners switch — streamlined admin and engagement (`why_switch`)');
  lines.push('- Everything in one login — dashboard, clients, telehealth, client app, mood (`everything_one_login`)');
  lines.push('- For clinics — governance, onboarding, and collaboration (`for_clinics`)');
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
        const img =
          f.image_url && String(f.image_url).trim()
            ? ` (screenshot: ${stripHtml(f.image_url)})`
            : '';
        lines.push(`- **${stripHtml(f.title)}** — ${stripHtml(f.description)}${img}`);
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

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Build a human-readable HTML block for the page body. React replaces #root on
// mount, so this is only seen by non-JS clients (LLM fetchers, link previewers,
// archive bots). Generated live from the CMS so admin edits show up immediately.
export function buildSeoBodyHtml(sections, helpArticles = []) {
  const hero = sections.find((s) => s.name === 'hero')?.content || {};
  const heroTitle =
    stripHtml(hero.title) ||
    'Support clients between sessions. Reduce admin. One system built for practitioners.';
  const heroDescription = stripHtml(hero.description) || '';

  const out = [];
  out.push('<main>');
  out.push(`<header><h1>${escapeHtml(heroTitle)}</h1>`);
  if (heroDescription) out.push(`<p>${escapeHtml(heroDescription)}</p>`);
  out.push('<nav><ul>');
  for (const r of STATIC_ROUTES) {
    out.push(`<li><a href="${r.path}">${escapeHtml(r.title)}</a></li>`);
  }
  out.push('<li><a href="mailto:admin@antsa.com.au">Contact ANTSA</a></li>');
  out.push('</ul></nav></header>');

  for (const section of sections) {
    if (section.name === 'hero') continue;
    const c = section.content || {};

    if (section.name === 'trust_strip') {
      const trustItems = Array.isArray(c.items) ? c.items : [];
      if (trustItems.length) {
        out.push('<section aria-label="Trust indicators"><h2>Trust and hosting</h2><ul>');
        for (const it of trustItems) {
          out.push(`<li>${escapeHtml(stripHtml(it.label))}</li>`);
        }
        out.push('</ul></section>');
      }
      continue;
    }

    if (section.name === 'for_clinics') {
      out.push('<section id="for-clinics">');
      const t = stripHtml(c.title);
      const sub = stripHtml(c.subtitle);
      if (t) out.push(`<h2>${escapeHtml(t)}</h2>`);
      if (sub) out.push(`<p>${escapeHtml(sub)}</p>`);
      const list = Array.isArray(c.checklist) ? c.checklist : [];
      if (list.length) {
        out.push('<ul>');
        for (const x of list) {
          out.push(`<li>${escapeHtml(stripHtml(x))}</li>`);
        }
        out.push('</ul>');
      }
      out.push('</section>');
      continue;
    }

    const title = stripHtml(c.title);
    const subtitle = stripHtml(c.subtitle);
    const description = stripHtml(c.description);

    if (
      !title &&
      !subtitle &&
      !description &&
      !section.features?.length &&
      !section.pricing?.length &&
      !section.team?.length &&
      !section.testimonials?.length &&
      !section.faqs?.length
    ) {
      continue;
    }

    out.push('<section>');
    if (title) out.push(`<h2>${escapeHtml(title)}</h2>`);
    if (subtitle) out.push(`<p><em>${escapeHtml(subtitle)}</em></p>`);
    if (description) out.push(`<p>${escapeHtml(description)}</p>`);

    if (section.features?.length) {
      out.push('<ul>');
      for (const f of section.features) {
        const img = f.image_url
          ? ` <img src="${escapeHtml(f.image_url)}" alt="${escapeHtml(stripHtml(f.title))}" />`
          : '';
        out.push(
          `<li><strong>${escapeHtml(stripHtml(f.title))}</strong> — ${escapeHtml(stripHtml(f.description))}${img}</li>`,
        );
      }
      out.push('</ul>');
    }

    if (section.pricing?.length) {
      out.push('<ul>');
      for (const p of section.pricing) {
        const period = p.period ? `/${stripHtml(p.period)}` : '';
        out.push(`<li><strong>${escapeHtml(stripHtml(p.name))}</strong> — ${escapeHtml(stripHtml(p.price))}${escapeHtml(period)}`);
        if (Array.isArray(p.features) && p.features.length) {
          out.push('<ul>');
          for (const feat of p.features) {
            const text = stripHtml(typeof feat === 'string' ? feat : feat?.text || '');
            if (text) out.push(`<li>${escapeHtml(text)}</li>`);
          }
          out.push('</ul>');
        }
        out.push('</li>');
      }
      out.push('</ul>');
    }

    if (section.team?.length) {
      out.push('<ul>');
      for (const m of section.team) {
        out.push(`<li><strong>${escapeHtml(stripHtml(m.name))}</strong> — ${escapeHtml(stripHtml(m.role))}${m.bio ? `. ${escapeHtml(stripHtml(m.bio))}` : ''}</li>`);
      }
      out.push('</ul>');
    }

    if (section.testimonials?.length) {
      out.push('<ul>');
      for (const t of section.testimonials) {
        out.push(`<li>"${escapeHtml(stripHtml(t.content))}" — ${escapeHtml(stripHtml(t.name))}${t.role ? `, ${escapeHtml(stripHtml(t.role))}` : ''}</li>`);
      }
      out.push('</ul>');
    }

    if (section.faqs?.length) {
      out.push('<dl>');
      for (const f of section.faqs) {
        out.push(`<dt>${escapeHtml(stripHtml(f.question))}</dt>`);
        out.push(`<dd>${escapeHtml(stripHtml(f.answer))}</dd>`);
      }
      out.push('</dl>');
    }

    out.push('</section>');
  }

  if (helpArticles.length) {
    out.push('<section><h2>Help Centre</h2><ul>');
    for (const a of helpArticles) {
      const title = stripHtml(a.title);
      const body = stripHtml(a.content);
      if (!title) continue;
      out.push(`<li><strong>${escapeHtml(title)}</strong>${body ? ` — ${escapeHtml(body.slice(0, 400))}` : ''}</li>`);
    }
    out.push('</ul></section>');
  }

  out.push('<footer><p>ANTSA Pty Ltd · <a href="https://antsa.ai/">antsa.ai</a> · <a href="mailto:admin@antsa.com.au">admin@antsa.com.au</a></p></footer>');
  out.push('</main>');
  return out.join('');
}

// FAQPage JSON-LD — high signal for LLMs and Google rich results.
export function buildFaqJsonLd(sections) {
  const all = [];
  for (const s of sections) {
    if (Array.isArray(s.faqs)) {
      for (const f of s.faqs) {
        const q = stripHtml(f.question);
        const a = stripHtml(f.answer);
        if (q && a) all.push({ q, a });
      }
    }
  }
  if (!all.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: all.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export { loadAllSections, loadHelpArticles };

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
