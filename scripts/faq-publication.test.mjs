import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const fixtureDir = mkdtempSync(join(tmpdir(), 'antsa-faq-'));
process.env.DB_PATH = join(fixtureDir, 'content.db');
process.env.JWT_SECRET = 'faq-publication-local-test-only';

let vite;
let api;
let baseUrl;
let token;
let db;
let faqId;

before(async () => {
  ({ default: db } = await import('../backend/config/database.js'));
  const { default: express } = await import('../backend/node_modules/express/index.js');
  const { default: jwt } = await import('../backend/node_modules/jsonwebtoken/index.js');
  const { default: contentRoutes } = await import('../backend/routes/content.js');
  const { default: seoRoutes } = await import('../backend/routes/seo.js');
  const sectionId = db.prepare('INSERT INTO sections (name) VALUES (?)').run('faq').lastInsertRowid;
  const insert = db.prepare('INSERT INTO faq_items (section_id, question, answer, order_index) VALUES (?, ?, ?, ?)');
  faqId = insert.run(sectionId, 'Original fixture question?', 'Original fixture answer.', 0).lastInsertRowid;
  for (let index = 1; index <= 3; index += 1) {
    insert.run(sectionId, `Fixture question ${index}?`, `Fixture answer ${index}.`, index);
  }
  token = jwt.sign({ username: 'local-faq-test' }, process.env.JWT_SECRET);
  const app = express();
  app.use(express.json());
  app.use('/api/content', contentRoutes);
  app.use(seoRoutes);
  api = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => api.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${api.address().port}`;
  vite = await createServer({
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom',
    logLevel: 'error',
  });
});

after(async () => {
  if (api) await new Promise((resolve) => api.close(resolve));
  if (vite) (await vite.ssrLoadModule('/backend/config/database.js')).default.close();
  await vite?.close();
  db?.close();
  rmSync(fixtureDir, { recursive: true, force: true });
});

async function save(path, body) {
  const response = await fetch(`${baseUrl}/api/content/faq${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  assert.equal(response.status, 200, await response.text());
}

test('saved FAQ question, answer, title and subtitle render on the next request', async () => {
  await save(`/${faqId}`, { question: 'Updated fixture question?', answer: 'Updated fixture answer.', order_index: 0 });
  await save('/section-content', { title: 'Updated fixture title', subtitle: 'Updated fixture subtitle' });
  const { data } = await vite.ssrLoadModule('/src/pages/index/+data.ts');
  const { default: FAQSection } = await vite.ssrLoadModule('/src/components/FAQSection.tsx');
  const section = data().sections.find((row) => row.name === 'faq');
  const html = renderToStaticMarkup(createElement(FAQSection, { section }));
  for (const text of ['Updated fixture question?', 'Updated fixture answer.', 'Updated fixture title', 'Updated fixture subtitle']) {
    assert.ok(html.includes(text), `public FAQ must display ${text}`);
  }
  assert.ok(!html.includes('Original fixture question?'));
});

test('standalone FAQ page renders all saved questions while homepage offers a preview', async () => {
  const { data } = await vite.ssrLoadModule('/src/pages/faq/+data.ts');
  const { default: Page } = await vite.ssrLoadModule('/src/pages/faq/+Page.tsx');
  const { default: Head } = await vite.ssrLoadModule('/src/pages/faq/+Head.tsx');
  const { default: HomeHead } = await vite.ssrLoadModule('/src/pages/index/+Head.tsx');
  const { default: FAQSection } = await vite.ssrLoadModule('/src/components/FAQSection.tsx');
  const pageData = data();
  const html = renderToStaticMarkup(createElement(Page, pageData));
  assert.match(html, /<h1[^>]*>Updated fixture title<\/h1>/);
  assert.ok(html.includes('Fixture question 3?'));
  assert.ok(html.includes('Fixture answer 3.'));
  const preview = renderToStaticMarkup(createElement(FAQSection, { section: pageData.section, preview: true }));
  assert.ok(preview.includes('Updated fixture question?'));
  assert.ok(!preview.includes('Fixture question 3?'));
  assert.match(preview, /href="\/faq"/);
  const head = renderToStaticMarkup(createElement(Head, { data: pageData }));
  assert.match(head, /rel="canonical" href="https:\/\/antsa.ai\/faq"/);
  assert.ok(head.includes('Fixture question 3?'));
  const homeHead = renderToStaticMarkup(createElement(HomeHead, { data: { sections: [{ name: 'faq', ...pageData.section }] } }));
  assert.ok(homeHead.includes('Updated fixture question?'));
  assert.ok(!homeHead.includes('Fixture question 3?'), 'homepage schema must describe only its visible preview');
  const sitemap = await (await fetch(`${baseUrl}/sitemap.xml`)).text();
  assert.ok(sitemap.includes('<loc>https://antsa.ai/faq</loc>'));
});

test('deleting all CMS FAQs does not resurrect default questions', async () => {
  for (const { id } of db.prepare('SELECT id FROM faq_items').all()) {
    const response = await fetch(`${baseUrl}/api/content/faq/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(response.status, 200);
  }
  const { data } = await vite.ssrLoadModule('/src/pages/faq/+data.ts');
  const { default: FAQSection } = await vite.ssrLoadModule('/src/components/FAQSection.tsx');
  const html = renderToStaticMarkup(createElement(FAQSection, { section: data().section }));
  assert.ok(!html.includes('Updated fixture question?'));
  assert.ok(!html.includes('Is ANTSA a replacement for therapy?'));
});
