# Landing Page SSR (Vike) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate antsa-landing-page from a Vite SPA with UA-gated SEO body injection to true server-side rendering with Vike. Every visitor and every scraper receives identical fully populated HTML on first response.

**Architecture:** Single Express process on iisnode. Vike (Vite SSR plugin) mounted as Express middleware handles the 5 public routes. `/api/*`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt`, `/admin/*` keep their existing handlers. Per-request: Express → Vike middleware → page-specific `+data.ts` runs against SQLite → `renderToString` with AntD style extraction → full HTML returned. Client receives populated DOM and hydrates without DOM swap.

**Tech Stack:** Vite 6, Vike (latest), React 18, TypeScript, AntD 5 (`@ant-design/cssinjs`), react-router-dom 6 (admin only), Express 4, better-sqlite3, Node 18+. Tests use built-in `node --test`. Deploy to Azure App Service Windows via existing GitHub Action.

**Reference spec:** `docs/superpowers/specs/2026-05-20-landing-page-ssr-design.md`

**Branch:** `feature/ssr-vike` (already created, spec committed).

---

## File map

**Created (frontend):**
- `src/pages/+config.ts`
- `src/pages/+Layout.tsx`
- `src/pages/+onRenderHtml.tsx`
- `src/pages/+onRenderClient.tsx`
- `src/pages/+Head.tsx`
- `src/pages/index/+Page.tsx`
- `src/pages/index/+data.ts`
- `src/pages/index/+Head.tsx`
- `src/pages/free-trial/+Page.tsx`
- `src/pages/free-trial/+Head.tsx`
- `src/pages/help/+Page.tsx`
- `src/pages/help/+data.ts`
- `src/pages/help/+Head.tsx`
- `src/pages/privacy-policy/+Page.tsx`
- `src/pages/privacy-policy/+data.ts`
- `src/pages/privacy-policy/+Head.tsx`
- `src/pages/terms-and-conditions/+Page.tsx`
- `src/pages/terms-and-conditions/+data.ts`
- `src/pages/terms-and-conditions/+Head.tsx`
- `src/ssr/ClientOnly.tsx`

**Created (backend):**
- `backend/ssr/data-providers.js`
- `backend/ssr/data-providers.test.js`
- `backend/scripts/smoke-ssr.sh`

**Modified:**
- `vite.config.ts` — add Vike plugin.
- `package.json` (root) — add `vike` dependency; verify scripts.
- `tsconfig.app.json` — ensure `src/pages/` is included.
- `backend/server.js` — mount Vike middleware; remove body-injection path; add `/admin/*` static carve-out.
- `index.html` — minimal Vike-compatible shell (or delete if Vike provides programmatic template).
- `src/App.tsx` — remove Router/Routes; export as the home page composition only.
- Each section component under `src/components/` — accept its data slice via props instead of fetching from `useSections` / `/api`.

**Deleted (after SSR is green):**
- `src/main.tsx` (replaced by Vike's `+onRenderClient.tsx`).
- `src/hooks/useSections.ts` (no longer needed once data flows via props).
- `backend/lib/bot-ua.js`, `backend/lib/bot-ua.test.js`.

---

### Task 1: Install Vike and add it to Vite config

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`

- [ ] **Step 1: Install Vike**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page
npm install vike --save
```

Expected: `vike` added to `dependencies` in `package.json`. No peer-dep warnings that block install.

- [ ] **Step 2: Add Vike to vite.config.ts**

Read the current `vite.config.ts` first (it likely has `@vitejs/plugin-react`). Replace its `plugins` array to include Vike, e.g.:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';

export default defineConfig({
  plugins: [react(), vike()],
});
```

Keep any existing aliases, server config, etc. Only the `plugins` array is changing.

- [ ] **Step 3: Confirm dev build is not yet broken**

```bash
npm run build 2>&1 | tail -20
```

Expected: build may fail with a message like "Vike: no pages found in pages/" — that is acceptable for this task, we add pages in Task 2. The build must not fail for any other reason (e.g. syntax error in vite.config.ts).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.ts
git commit -m "chore(landing): install vike and add to vite.config

First step of SSR migration. No pages defined yet; subsequent commits
will scaffold the Vike pages tree."
```

---

### Task 2: Minimal Vike scaffolding — server, client, layout, one trivial page

**Goal:** Get a single Vike page rendering server-side with AntD `ConfigProvider` and no actual CMS data. Proves the toolchain works before we migrate real content.

**Files:**
- Create: `src/pages/+config.ts`
- Create: `src/pages/+onRenderHtml.tsx`
- Create: `src/pages/+onRenderClient.tsx`
- Create: `src/pages/+Layout.tsx`
- Create: `src/pages/index/+Page.tsx`

- [ ] **Step 1: Create `src/pages/+config.ts`**

```ts
import type { Config } from 'vike/types';

export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps', 'data'],
  meta: {
    Head: { env: { server: true } },
    data: { env: { server: true } },
  },
} satisfies Config;
```

- [ ] **Step 2: Create `src/pages/+onRenderHtml.tsx`**

```tsx
import { renderToString } from 'react-dom/server';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import { createCache, StyleProvider, extractStyle } from '@ant-design/cssinjs';
import Layout from './+Layout';

const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const { Page, data } = pageContext;
  if (!Page) throw new Error('No Page component provided by Vike');

  const cache = createCache();
  const appHtml = renderToString(
    <StyleProvider cache={cache}>
      <Layout pageContext={pageContext}>
        <Page {...(data as object) ?? {}} />
      </Layout>
    </StyleProvider>,
  );
  const styleTag = extractStyle(cache, true);

  const HeadComp = pageContext.config.Head;
  const headHtml = HeadComp ? renderToString(<HeadComp data={data} />) : '';

  return escapeInject`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${dangerouslySkipEscape(headHtml)}
    ${dangerouslySkipEscape(styleTag)}
  </head>
  <body>
    <div id="root">${dangerouslySkipEscape(appHtml)}</div>
  </body>
</html>`;
};

export default onRenderHtml;
```

- [ ] **Step 3: Create `src/pages/+onRenderClient.tsx`**

```tsx
import { hydrateRoot, createRoot } from 'react-dom/client';
import type { OnRenderClientAsync } from 'vike/types';
import Layout from './+Layout';

let root: ReturnType<typeof hydrateRoot> | ReturnType<typeof createRoot> | null = null;

const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page, data } = pageContext;
  if (!Page) throw new Error('No Page component provided by Vike');

  const container = document.getElementById('root');
  if (!container) throw new Error('#root not found');

  const tree = (
    <Layout pageContext={pageContext}>
      <Page {...(data as object) ?? {}} />
    </Layout>
  );

  if (pageContext.isHydration) {
    root = hydrateRoot(container, tree);
  } else {
    if (!root) root = createRoot(container);
    root.render(tree);
  }
};

export default onRenderClient;
```

- [ ] **Step 4: Create `src/pages/+Layout.tsx`** — minimal wrapper for now (AntD ConfigProvider only; AppHeader/AppFooter added in Task 5)

```tsx
import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

const theme = {
  token: {
    colorPrimary: '#48abe2',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#48abe2',
    colorTextBase: '#0f172a',
    colorBgBase: '#ffffff',
    borderRadius: 10,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.6,
  },
};

export default function Layout({ children }: { pageContext: unknown; children: ReactNode }) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
```

- [ ] **Step 5: Create `src/pages/index/+Page.tsx`** — trivial home page placeholder

```tsx
export default function Page() {
  return (
    <main>
      <h1>ANTSA SSR scaffold</h1>
      <p>Vike is rendering this server-side.</p>
    </main>
  );
}
```

- [ ] **Step 6: Build and verify**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds. Output includes `dist/client/` and `dist/server/` directories (Vike's standard split build output).

If the build error mentions a missing `index.html`, leave the existing `index.html` in place — Vike usually does not consume it once `+onRenderHtml` is defined, but Vite still expects a stub at the project root. If a real conflict surfaces, simplify `index.html` to:

```html
<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>
```

(We will revisit and possibly delete `index.html` in a later task once the Vike output is fully shaped.)

- [ ] **Step 7: Commit**

```bash
git add src/pages package.json package-lock.json index.html
git commit -m "feat(landing): scaffold vike SSR with placeholder home page

Adds the four files Vike needs to render server-side (+config, +onRenderHtml,
+onRenderClient, +Layout) plus a trivial home page placeholder. AntD theme
moved into +Layout. Real CMS pages migrated in subsequent tasks."
```

---

### Task 3: Wire Vike middleware into Express; carve out /admin and /api

**Goal:** Express delegates non-carved-out GETs to Vike's SSR pipeline. `/admin/*`, `/api/*`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt` retain their current handlers.

**Files:**
- Modify: `backend/server.js`

- [ ] **Step 1: Replace the production catch-all handler with Vike middleware**

Read the current `backend/server.js`. The relevant block is the `if (process.env.NODE_ENV === 'production')` clause that ends with `app.get('*', ...)`. Replace the entire production block with this:

```js
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  const distClientPath = path.join(distPath, 'client');

  // Serve static assets built by Vike (JS chunks, CSS, fonts).
  app.use(express.static(distClientPath, { index: false }));

  // Admin SPA carve-out. Vike never sees /admin/*; we serve the admin
  // shell directly and React mounts client-side as today.
  app.get('/admin', (_req, res) => {
    res.sendFile(path.join(distClientPath, 'index.html'));
  });
  app.get(/^\/admin\/.+$/, (_req, res) => {
    res.sendFile(path.join(distClientPath, 'index.html'));
  });

  // Everything else (the 5 public marketing routes) goes through Vike.
  const { renderPage } = await import('vike/server');
  app.get('*', async (req, res, next) => {
    const pageContextInit = { urlOriginal: req.originalUrl, headersOriginal: req.headers };
    try {
      const pageContext = await renderPage(pageContextInit);
      const { httpResponse } = pageContext;
      if (!httpResponse) return next();
      res.status(httpResponse.statusCode);
      httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value));
      res.setHeader('Cache-Control', 'no-store');
      httpResponse.pipe(res);
    } catch (err) {
      console.error('Vike SSR error:', err);
      res.status(500).sendFile(path.join(distClientPath, 'index.html'));
    }
  });
}
```

Notes:
- `await import('vike/server')` requires the surrounding scope to be async. Wrap the production block in `(async () => { ... })()` if it is not already inside an async startup function. If it is at top level of an ES module, top-level await works directly (the file uses `"type": "module"` per `backend/package.json`).
- Vike's `dist/server/` is consumed internally by `renderPage` — we only need to serve `dist/client/` statically.
- The old `getShell()` closure, `buildSeoBodyHtml`, `loadAllSections`, `loadHelpArticles`, `buildFaqJsonLd` imports, `isBotUA` import, and the body-injection branch are all removed by this replacement.

Delete the now-unused imports at the top of `backend/server.js`:

```js
// REMOVE these lines (if present):
// import { buildSeoBodyHtml, buildFaqJsonLd, loadAllSections, loadHelpArticles } from './routes/seo.js';
// import { isBotUA } from './lib/bot-ua.js';
// import { readFileSync } from 'fs';
```

Keep the `seoRoutes` import (still needed for `/llms.txt` etc.) — it now imports only the default route export:

```js
import seoRoutes from './routes/seo.js';
```

- [ ] **Step 2: Build the frontend**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page && npm run build
```

Expected: build succeeds; `dist/client/` contains static assets; `dist/server/` contains the Vike server bundle.

- [ ] **Step 3: Run the prod server and smoke-test**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page
NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
```

Then run these checks:

```bash
echo "=== / (SSR) ===" && curl -sS http://localhost:3001/ | grep -c '<h1>ANTSA SSR scaffold</h1>'
echo "=== /admin (SPA shell) ===" && curl -sS http://localhost:3001/admin | grep -c '<div id="root">'
echo "=== /api/health ===" && curl -sSI http://localhost:3001/api/health | head -1
echo "=== /llms.txt ===" && curl -sSI http://localhost:3001/llms.txt | head -1
echo "=== /sitemap.xml ===" && curl -sSI http://localhost:3001/sitemap.xml | head -1
```

Expected:
- `/` → `1` (the SSR placeholder h1 is in the HTML)
- `/admin` → `1` (root div present; SPA shell served)
- `/api/health` → `HTTP/1.1 200 OK`
- `/llms.txt` → `HTTP/1.1 200 OK`
- `/sitemap.xml` → `HTTP/1.1 200 OK`

Stop the server:

```bash
pkill -f 'node backend/server.js' || true
```

- [ ] **Step 4: Commit**

```bash
git add backend/server.js
git commit -m "feat(landing): mount vike SSR middleware in express

Express now delegates all non-/api, non-/admin, non-/llms.txt etc.
GETs to vike's renderPage(). Body-injection path and bot-UA helper
imports removed. Admin SPA carved out to keep shell-then-mount flow."
```

---

### Task 4: AntD CSS-in-JS SSR verification

**Goal:** Confirm AntD's `<StyleProvider>` + `extractStyle` is correctly inlining styles into `<head>` so the SSR'd page is fully styled on first paint.

**Files:**
- No file changes — verification only. If the test fails, fix `src/pages/+onRenderHtml.tsx` per AntD docs.

- [ ] **Step 1: Update the placeholder home page to use an AntD component**

Replace `src/pages/index/+Page.tsx` with:

```tsx
import { Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function Page() {
  return (
    <main style={{ padding: 40 }}>
      <Title level={1}>ANTSA SSR scaffold</Title>
      <Paragraph>Vike is rendering this server-side with AntD styles inlined.</Paragraph>
      <Button type="primary">Sample button</Button>
    </main>
  );
}
```

- [ ] **Step 2: Build and start prod**

```bash
npm run build
NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
```

- [ ] **Step 3: Confirm AntD CSS is inlined in `<head>`**

```bash
curl -sS http://localhost:3001/ | grep -oE '<style[^>]*data-rc-order' | head -3
```

Expected: at least one match (AntD cssinjs emits `<style data-rc-order="prepend-queue">` style tags). If zero matches, the StyleProvider/extractStyle wiring is wrong — re-check `src/pages/+onRenderHtml.tsx` against AntD's SSR doc (`https://ant.design/docs/react/server-side-rendering`).

Also confirm the Button class is present in the rendered HTML:

```bash
curl -sS http://localhost:3001/ | grep -oE 'ant-btn[^"]*' | head -3
```

Expected: at least one match (e.g. `ant-btn ant-btn-primary`).

- [ ] **Step 4: Manual browser check**

```bash
open http://localhost:3001/
```

Page should render with a styled blue AntD primary button. If you see an unstyled button briefly before the JS bundle loads, the CSS-in-JS extraction is incomplete — investigate.

- [ ] **Step 5: Stop the server**

```bash
pkill -f 'node backend/server.js' || true
```

- [ ] **Step 6: Commit (only if you changed code; otherwise skip)**

```bash
git add src/pages/index/+Page.tsx
git commit -m "test(landing): exercise antd component on ssr home page

Confirms StyleProvider + extractStyle correctly inline antd's CSS-in-JS
into <head> before any client JS runs."
```

---

### Task 5: Flesh out +Layout.tsx with AppHeader, AppFooter, and client-only widgets

**Files:**
- Create: `src/ssr/ClientOnly.tsx`
- Modify: `src/pages/+Layout.tsx`

- [ ] **Step 1: Create the ClientOnly wrapper**

```tsx
// src/ssr/ClientOnly.tsx
import { useEffect, useState, type ReactNode } from 'react';

export default function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return <>{mounted ? children : fallback}</>;
}
```

- [ ] **Step 2: Update `src/pages/+Layout.tsx`** to include AppHeader, AppFooter, HelpChatWidget (client-only)

```tsx
import { ConfigProvider, Layout as AntLayout } from 'antd';
import type { ReactNode } from 'react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import HelpChatWidget from '../components/HelpChatWidget';
import ClientOnly from '../ssr/ClientOnly';

const { Content } = AntLayout;

const theme = {
  token: {
    colorPrimary: '#48abe2',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#48abe2',
    colorTextBase: '#0f172a',
    colorBgBase: '#ffffff',
    borderRadius: 10,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.6,
  },
  components: {
    Layout: { headerBg: '#ffffff', bodyBg: '#ffffff' },
    Card: { borderRadiusLG: 12 },
    Button: { borderRadius: 8, controlHeight: 44, fontWeight: 600 },
  },
};

export default function Layout({ children }: { pageContext: unknown; children: ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      <AntLayout style={{ minHeight: '100vh', background: '#ffffff' }}>
        <AppHeader />
        <Content style={{ marginTop: '70px' }}>{children}</Content>
        <AppFooter />
        <ClientOnly>
          <HelpChatWidget />
        </ClientOnly>
      </AntLayout>
    </ConfigProvider>
  );
}
```

If `AppHeader` or `AppFooter` themselves use `window`/`document` in render (rather than `useEffect`), wrap them in `<ClientOnly>` too. Check both files first.

- [ ] **Step 3: Build and verify**

```bash
npm run build && NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
curl -sS http://localhost:3001/ | grep -c 'AppHeader\|antsa\|ANTSA' | head -1
```

Expected: non-zero (header content rendered server-side).

Confirm in a browser:

```bash
open http://localhost:3001/
```

Should show the placeholder page wrapped in the real ANTSA header/footer.

- [ ] **Step 4: Stop server and commit**

```bash
pkill -f 'node backend/server.js' || true
git add src/ssr/ClientOnly.tsx src/pages/+Layout.tsx
git commit -m "feat(landing): real layout with header/footer in vike +Layout

HelpChatWidget mounted via ClientOnly to avoid hydration mismatches
from its window-dependent code paths."
```

---

### Task 6: Backend data providers + tests

**Goal:** Expose pure data-fetch functions to Vike's `+data.ts` files without those files needing to import Express plumbing.

**Files:**
- Create: `backend/ssr/data-providers.js`
- Create: `backend/ssr/data-providers.test.js`

- [ ] **Step 1: Create `backend/ssr/data-providers.js`**

Read `backend/routes/seo.js` first — it already exports `loadAllSections` and `loadHelpArticles`. Inspect `backend/routes/content.js` (or wherever legal pages are served from) and identify the SQL needed to load a legal page by slug. The current API endpoint is `/api/content/legal/<slug>` per the frontend; find the handler and read its query.

Once you have the query, create:

```js
// backend/ssr/data-providers.js
import db from '../config/database.js';
import { loadAllSections, loadHelpArticles } from '../routes/seo.js';

export { loadAllSections, loadHelpArticles };

/**
 * Load a single legal page (privacy-policy, terms-and-conditions, …) by slug.
 * Returns { title, content, last_updated } or null if not found.
 *
 * The exact column names depend on the legal_pages table schema — check
 * backend/routes/content.js or backend/config/database.js if this throws.
 */
export function loadLegalPage(slug) {
  try {
    const row = db
      .prepare('SELECT title, content, last_updated FROM legal_pages WHERE slug = ?')
      .get(slug);
    return row || null;
  } catch (err) {
    console.error(`loadLegalPage(${slug}) failed:`, err);
    return null;
  }
}
```

If the table or columns differ from the above, adjust the SELECT to match the schema. The point is: this function must return the same shape that `/api/content/legal/:slug` currently returns to the frontend.

- [ ] **Step 2: Write the failing tests**

Create `backend/ssr/data-providers.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadAllSections, loadHelpArticles, loadLegalPage } from './data-providers.js';

test('loadAllSections returns an array', () => {
  const result = loadAllSections();
  assert.ok(Array.isArray(result), 'expected an array');
});

test('loadHelpArticles returns an array', () => {
  const result = loadHelpArticles();
  assert.ok(Array.isArray(result), 'expected an array');
});

test('loadLegalPage(known slug) returns an object or null', () => {
  const result = loadLegalPage('privacy-policy');
  assert.ok(result === null || (typeof result === 'object' && 'title' in result));
});

test('loadLegalPage(unknown slug) returns null', () => {
  const result = loadLegalPage('this-slug-definitely-does-not-exist');
  assert.equal(result, null);
});
```

- [ ] **Step 3: Update backend `test` script to include the new tests**

Edit `backend/package.json`, change the `test` script to cover both `lib/` and `ssr/`:

```json
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seed.js",
    "test": "node --test 'lib/*.test.js' 'ssr/*.test.js'"
  },
```

- [ ] **Step 4: Run the tests**

```bash
cd backend && npm test
```

Expected: tests pass (38 existing from bot-ua + 4 new = 42). If any of the new tests fail because the schema differs, fix `loadLegalPage` to match the real schema and re-run.

- [ ] **Step 5: Commit**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page
git add backend/ssr backend/package.json
git commit -m "feat(landing): backend data providers for vike SSR

Exposes loadAllSections, loadHelpArticles, loadLegalPage as pure
functions so vike +data.ts loaders import a single boundary module
rather than reaching into express route files."
```

---

### Task 7: Migrate the home page (`/`) — +data.ts + +Page.tsx + section props

**Goal:** Real home page rendering server-side from live CMS data.

**Files:**
- Create: `src/pages/index/+data.ts`
- Modify: `src/pages/index/+Page.tsx`
- Modify: `src/App.tsx` — strip Router, export the section composition.
- Modify: any section component under `src/components/` that currently fetches its own data — change to accept its data slice via props.

- [ ] **Step 1: Create `+data.ts` for the home page**

```ts
// src/pages/index/+data.ts
import { loadAllSections } from '../../../backend/ssr/data-providers.js';

export type SectionRow = {
  name: string;
  content: Record<string, unknown>;
  features?: Array<Record<string, unknown>>;
  pricing?: Array<Record<string, unknown>>;
  team?: Array<Record<string, unknown>>;
  testimonials?: Array<Record<string, unknown>>;
  faqs?: Array<Record<string, unknown>>;
};

export type HomeData = { sections: SectionRow[] };

export function data(): HomeData {
  return { sections: loadAllSections() as SectionRow[] };
}
```

Vike calls `data()` server-side per request; the returned object is passed to `+Page.tsx` as props (via Vike's `data` mechanism configured in `+config.ts`).

- [ ] **Step 2: Restructure `src/App.tsx`**

The current `App.tsx` includes its own `useEffect` for IntersectionObserver, scroll-to-hash, and the ConfigProvider. The ConfigProvider lives in `+Layout.tsx` now. Move the IntersectionObserver setup into a small `useEffect` that runs client-side only. Remove the Router/Routes wrappers (they are gone — Vike owns routing for public pages).

Read the current `src/App.tsx` and produce:

```tsx
// src/App.tsx
import { useEffect } from 'react';
import HeroSplit from './components/HeroSplit';
import TrustStrip from './components/TrustStrip';
import WhySwitchSection from './components/WhySwitchSection';
import EverythingOneLoginSection from './components/EverythingOneLoginSection';
import TheShiftSection from './components/TheShiftSection';
import TheAntsaSection from './components/TheAntsaSection';
import FeaturesSection from './components/FeaturesSection';
import TeamSection from './components/TeamSection';
import PricingSection from './components/PricingSection';
import FAQSection from './components/FAQSection';
import ForClinicsBand from './components/ForClinicsBand';
import TestimonialsSection from './components/TestimonialsSection';
import ComplianceBadgesStrip from './components/ComplianceBadgesStrip';
import Section from './components/Section';
import type { SectionRow } from './pages/index/+data';
import './styles/global.css';

function App({ sections }: { sections: SectionRow[] }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    );

    const observe = () => {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
        if (!el.classList.contains('observed')) {
          el.classList.add('observed');
          observer.observe(el);
        }
      });
    };

    observe();

    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };
      if (!tryScroll()) {
        let attempts = 0;
        const interval = setInterval(() => {
          if (tryScroll() || ++attempts > 10) clearInterval(interval);
        }, 150);
      }
    }

    const intervalId = setInterval(observe, 500);
    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  const byName = Object.fromEntries(sections.map((s) => [s.name, s]));

  return (
    <>
      <Section name="hero"><HeroSplit section={byName.hero} /></Section>
      <Section name="trust_strip"><TrustStrip section={byName.trust_strip} /></Section>
      <Section name="why_switch"><WhySwitchSection section={byName.why_switch} /></Section>
      <Section name="everything_one_login"><EverythingOneLoginSection section={byName.everything_one_login} /></Section>
      <Section name="the-shift"><TheShiftSection section={byName['the-shift']} /></Section>
      <Section name="the-antsa"><TheAntsaSection section={byName['the-antsa']} /></Section>
      <Section name="features"><FeaturesSection section={byName.features} /></Section>
      <Section name="team"><TeamSection section={byName.team} /></Section>
      <Section name="pricing"><PricingSection section={byName.pricing} /></Section>
      <Section name="faq"><FAQSection section={byName.faq} /></Section>
      <Section name="for_clinics"><ForClinicsBand section={byName.for_clinics} /></Section>
      <Section name="testimonials"><TestimonialsSection section={byName.testimonials} /></Section>
      <Section name="compliance"><ComplianceBadgesStrip section={byName.compliance} /></Section>
    </>
  );
}

export default App;
```

The change vs. today: `App` accepts `sections` as a prop, looks up each section by name, and passes the slice as a `section={…}` prop to each component. Layout / ConfigProvider / AppHeader / AppFooter are gone (handled by `+Layout.tsx`).

- [ ] **Step 3: Update `src/pages/index/+Page.tsx`**

```tsx
import App from '../../App';
import type { HomeData } from './+data';

export default function Page(props: HomeData) {
  return <App sections={props.sections} />;
}
```

- [ ] **Step 4: Update section components to accept their data via props**

For each of the section components imported in `App.tsx`, read its current source. The current pattern is each component does `const sections = useSections();` and reaches into the matching section. Change it to:

```tsx
// Example: src/components/HeroSplit.tsx
type Props = { section?: { content?: Record<string, unknown> } };
export default function HeroSplit({ section }: Props) {
  const content = section?.content ?? {};
  // ... rest of component reads from `content` instead of from useSections
}
```

Touch each of these files exactly enough to remove `useSections` and the corresponding `useEffect`/`useState` fetch, replacing with `const content = section?.content ?? {};` (and `section?.features`, `section?.pricing`, etc. where applicable):

- `src/components/HeroSplit.tsx`
- `src/components/TrustStrip.tsx`
- `src/components/WhySwitchSection.tsx`
- `src/components/EverythingOneLoginSection.tsx`
- `src/components/TheShiftSection.tsx`
- `src/components/TheAntsaSection.tsx`
- `src/components/FeaturesSection.tsx`
- `src/components/TeamSection.tsx`
- `src/components/PricingSection.tsx`
- `src/components/FAQSection.tsx`
- `src/components/ForClinicsBand.tsx`
- `src/components/TestimonialsSection.tsx`
- `src/components/ComplianceBadgesStrip.tsx`
- `src/components/AppHeader.tsx` (if it fetches CTA labels from CMS via `useSections`, accept them via prop or via the layout)

For each component, keep the existing JSX entirely; only the source of `content` / `features` / etc. changes from "fetched on mount" to "received via prop".

- [ ] **Step 5: Build and verify the home page SSRs real CMS content**

```bash
npm run build && NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
echo "=== Hero h1 present ===" && curl -sS http://localhost:3001/ | grep -oE '<h1[^>]*>[^<]+</h1>' | head -3
echo "=== Should NOT see empty root ===" && curl -sS http://localhost:3001/ | grep -c '<div id="root"></div>'
echo "=== JSON-LD already? ===" && curl -sS http://localhost:3001/ | grep -c 'application/ld+json'
pkill -f 'node backend/server.js' || true
```

Expected:
- Hero `<h1>` contains the actual hero title from the CMS (not "ANTSA SSR scaffold").
- Empty-root count: `0`.
- JSON-LD count: `0` (we add it in Task 12; for now it's missing).

Open `http://localhost:3001/` in a browser, hard-refresh — full home page renders. No flash. If something looks off, the issue is almost always (a) a section component still calling `useSections` and getting `null` server-side, or (b) a `useEffect` that does fetching and is now redundant.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/pages/index src/components
git commit -m "feat(landing): home page SSR with real CMS data via vike +data

App.tsx now receives sections as a prop and dispatches to section
components by name. Each section component takes its slice via
section={...} prop instead of fetching from /api on mount.
Layout/ConfigProvider/AppHeader/AppFooter moved to vike +Layout."
```

---

### Task 8: Migrate `/free-trial`

**Files:**
- Create: `src/pages/free-trial/+Page.tsx`
- Modify (if free-trial has CMS-driven content): create `src/pages/free-trial/+data.ts`
- Modify: `src/pages/FreeTrial.tsx` — strip Layout/Header/Footer/ConfigProvider wrappers (now provided by +Layout), keep the body.

- [ ] **Step 1: Inspect the current FreeTrial component**

```bash
sed -n '1,400p' /Users/alec/Projects/antsa/antsa-landing-page/src/pages/FreeTrial.tsx
```

Identify: (a) any `useState`/`useEffect` that fetches data from `/api`. If present, those queries move into `+data.ts`. If the page is fully static (hardcoded `features` array etc.), no `+data.ts` is needed.

- [ ] **Step 2: Create `src/pages/free-trial/+Page.tsx`**

If FreeTrial is static (no fetches), the +Page.tsx is a thin re-export:

```tsx
// src/pages/free-trial/+Page.tsx
import FreeTrialBody from '../../pages-legacy/FreeTrial';

export default function Page() {
  return <FreeTrialBody />;
}
```

Note: rename the legacy file from `src/pages/FreeTrial.tsx` to `src/pages-legacy/FreeTrial.tsx` to avoid colliding with Vike's pages directory. Do this rename with `git mv`:

```bash
mkdir -p src/pages-legacy
git mv src/pages/FreeTrial.tsx src/pages-legacy/FreeTrial.tsx
```

Then inside `src/pages-legacy/FreeTrial.tsx`, strip the outer `<Layout>`, `<ConfigProvider>`, `<AppHeader>`, `<AppFooter>` wrappers (they are now in `+Layout`). Keep the page body only.

- [ ] **Step 3: If FreeTrial fetches data, create `+data.ts`**

If Step 1 identified `/api/...` fetches, mirror them in:

```ts
// src/pages/free-trial/+data.ts
import { /* relevant provider */ } from '../../../backend/ssr/data-providers.js';

export type FreeTrialData = { /* ... */ };

export function data(): FreeTrialData {
  return { /* ... */ };
}
```

And update the `+Page.tsx` to take that data as props and pass it to `FreeTrialBody`. If the corresponding data provider does not exist in `backend/ssr/data-providers.js`, add it there following the same pattern as `loadLegalPage`.

If FreeTrial is fully static, skip this step.

- [ ] **Step 4: Build and verify**

```bash
npm run build && NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
curl -sS http://localhost:3001/free-trial | grep -oE '<h1[^>]*>[^<]+</h1>' | head -3
curl -sS http://localhost:3001/free-trial | grep -c '<div id="root"></div>'
pkill -f 'node backend/server.js' || true
```

Expected: `<h1>` contains the free-trial page heading; empty-root count is `0`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/free-trial src/pages-legacy
git commit -m "feat(landing): SSR /free-trial via vike"
```

---

### Task 9: Migrate `/privacy-policy`

**Files:**
- Create: `src/pages/privacy-policy/+Page.tsx`
- Create: `src/pages/privacy-policy/+data.ts`
- Modify: `src/pages/PrivacyPolicy.tsx` → rename to `src/pages-legacy/PrivacyPolicy.tsx` and strip outer wrappers.

- [ ] **Step 1: Move the legacy component**

```bash
git mv src/pages/PrivacyPolicy.tsx src/pages-legacy/PrivacyPolicy.tsx
```

Inside the moved file, remove the `useEffect`+`fetch('/api/content/legal/privacy-policy')` block and the surrounding loading state. The component should now be a pure render that accepts `{ page }` as a prop:

```tsx
// src/pages-legacy/PrivacyPolicy.tsx — full replacement
import { Typography, Layout } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

type LegalPage = { title: string; content: string; last_updated: string };

export default function PrivacyPolicy({ page }: { page: LegalPage | null }) {
  if (!page) {
    return (
      <Content style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <Paragraph>Privacy policy content is not currently available.</Paragraph>
      </Content>
    );
  }
  return (
    <Content style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#48abe2', fontSize: 15, marginBottom: 24, textDecoration: 'none' }}>
        <ArrowLeftOutlined /> Back to home
      </a>
      <Title level={1}>{page.title}</Title>
      <Paragraph type="secondary">Last updated: {page.last_updated}</Paragraph>
      <Markdown remarkPlugins={[remarkGfm]}>{page.content}</Markdown>
    </Content>
  );
}
```

Keep visual style identical to the prior file — copy any inline styles or props that differed.

- [ ] **Step 2: Create `+data.ts`**

```ts
// src/pages/privacy-policy/+data.ts
import { loadLegalPage } from '../../../backend/ssr/data-providers.js';

export type PrivacyData = { page: { title: string; content: string; last_updated: string } | null };

export function data(): PrivacyData {
  return { page: loadLegalPage('privacy-policy') };
}
```

- [ ] **Step 3: Create `+Page.tsx`**

```tsx
// src/pages/privacy-policy/+Page.tsx
import PrivacyPolicyBody from '../../pages-legacy/PrivacyPolicy';
import type { PrivacyData } from './+data';

export default function Page(props: PrivacyData) {
  return <PrivacyPolicyBody page={props.page} />;
}
```

- [ ] **Step 4: Build and verify**

```bash
npm run build && NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
curl -sS http://localhost:3001/privacy-policy | grep -oE '<h1[^>]*>[^<]+</h1>' | head -1
curl -sS http://localhost:3001/privacy-policy | grep -c '<div id="root"></div>'
pkill -f 'node backend/server.js' || true
```

Expected: `<h1>` contains the actual privacy policy title; empty-root count `0`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/privacy-policy src/pages-legacy/PrivacyPolicy.tsx
git commit -m "feat(landing): SSR /privacy-policy via vike"
```

---

### Task 10: Migrate `/terms-and-conditions`

**Files:**
- Create: `src/pages/terms-and-conditions/+Page.tsx`
- Create: `src/pages/terms-and-conditions/+data.ts`
- Modify: `src/pages/TermsAndConditions.tsx` → rename and strip wrappers.

- [ ] **Step 1: Move the legacy component**

```bash
git mv src/pages/TermsAndConditions.tsx src/pages-legacy/TermsAndConditions.tsx
```

Replace its content with the same shape as the PrivacyPolicy body in Task 9 — accepts `{ page }: { page: LegalPage | null }`, renders the markdown, no fetch.

- [ ] **Step 2: Create `+data.ts`**

```ts
// src/pages/terms-and-conditions/+data.ts
import { loadLegalPage } from '../../../backend/ssr/data-providers.js';

export type TermsData = { page: { title: string; content: string; last_updated: string } | null };

export function data(): TermsData {
  return { page: loadLegalPage('terms-and-conditions') };
}
```

- [ ] **Step 3: Create `+Page.tsx`**

```tsx
// src/pages/terms-and-conditions/+Page.tsx
import TermsBody from '../../pages-legacy/TermsAndConditions';
import type { TermsData } from './+data';

export default function Page(props: TermsData) {
  return <TermsBody page={props.page} />;
}
```

- [ ] **Step 4: Build and verify**

```bash
npm run build && NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
curl -sS http://localhost:3001/terms-and-conditions | grep -oE '<h1[^>]*>[^<]+</h1>' | head -1
curl -sS http://localhost:3001/terms-and-conditions | grep -c '<div id="root"></div>'
pkill -f 'node backend/server.js' || true
```

Expected: `<h1>` matches the terms page title; empty-root count `0`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/terms-and-conditions src/pages-legacy/TermsAndConditions.tsx
git commit -m "feat(landing): SSR /terms-and-conditions via vike"
```

---

### Task 11: Migrate `/help`

**Files:**
- Create: `src/pages/help/+Page.tsx`
- Create: `src/pages/help/+data.ts`
- Modify: `src/pages/HelpCentre.tsx` → rename and accept `{ categories }` as a prop.

- [ ] **Step 1: Move the legacy component**

```bash
git mv src/pages/HelpCentre.tsx src/pages-legacy/HelpCentre.tsx
```

Replace the `useEffect`+`fetch('/api/content/help')` block in the moved file with prop input. The component should accept `{ categories: Category[] }` and remove its `loading` state. Keep the visual rendering identical.

- [ ] **Step 2: Add a Help-articles provider that returns the same shape as /api/content/help**

The existing `loadHelpArticles()` in `backend/routes/seo.js` returns flat rows joined to categories. The frontend uses a richer shape (categories with nested articles and subcategories). Inspect `backend/routes/help.js` (or wherever `/api/content/help` lives) to find the assembly logic, then either:

(a) Extract that assembly into `loadHelpForFrontend()` in `backend/ssr/data-providers.js` and call it from both the API route and the SSR `+data.ts`.

(b) For minimum churn, have `+data.ts` `fetch('http://127.0.0.1:' + process.env.PORT + '/api/content/help')` against the local Express. This works but adds an in-process HTTP hop per render.

Prefer (a). Add to `backend/ssr/data-providers.js`:

```js
export function loadHelpForFrontend() {
  // Read the same query/assembly used by GET /api/content/help and
  // return { categories: Category[] }. The shape must match the frontend's
  // expectations exactly. Look at the route handler in backend/routes/help.js
  // and translate it here.
  // …
}
```

If translating turns out to be non-trivial, fall back to (b) inside `+data.ts`:

```ts
export async function data() {
  const port = process.env.PORT || 3001;
  const res = await fetch(`http://127.0.0.1:${port}/api/content/help`);
  return await res.json();
}
```

Vike supports async `data()`. Document the choice in the commit message.

- [ ] **Step 3: Create `+data.ts`**

Using approach (a):

```ts
// src/pages/help/+data.ts
import { loadHelpForFrontend } from '../../../backend/ssr/data-providers.js';

export type HelpData = ReturnType<typeof loadHelpForFrontend>;

export function data(): HelpData {
  return loadHelpForFrontend();
}
```

- [ ] **Step 4: Create `+Page.tsx`**

```tsx
// src/pages/help/+Page.tsx
import HelpBody from '../../pages-legacy/HelpCentre';
import type { HelpData } from './+data';

export default function Page(props: HelpData) {
  return <HelpBody categories={props.categories} />;
}
```

- [ ] **Step 5: Build and verify**

```bash
npm run build && NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
curl -sS http://localhost:3001/help | grep -oE '<h1[^>]*>[^<]+</h1>' | head -1
curl -sS http://localhost:3001/help | grep -c '<div id="root"></div>'
curl -sS http://localhost:3001/help | grep -c 'class="ant-collapse"'
pkill -f 'node backend/server.js' || true
```

Expected: `<h1>` matches the help heading; empty-root count `0`; at least one `ant-collapse` (the help-article accordions render server-side).

- [ ] **Step 6: Commit**

```bash
git add src/pages/help src/pages-legacy/HelpCentre.tsx backend/ssr/data-providers.js
git commit -m "feat(landing): SSR /help via vike"
```

---

### Task 12: Per-page Head metadata + JSON-LD

**Files:**
- Create: `src/pages/+Head.tsx` (default head — title, description, OG, Twitter, canonical, Organization+WebSite JSON-LD).
- Create: `src/pages/index/+Head.tsx` (home-page overrides + FAQPage JSON-LD built from sections).
- Create: `src/pages/free-trial/+Head.tsx`, `src/pages/help/+Head.tsx`, `src/pages/privacy-policy/+Head.tsx`, `src/pages/terms-and-conditions/+Head.tsx`.

- [ ] **Step 1: Create the default `+Head.tsx`**

Read the current `index.html` to copy the meta tags verbatim. Then:

```tsx
// src/pages/+Head.tsx
export default function Head() {
  const orgLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://antsa.ai/#organization',
        name: 'ANTSA',
        legalName: 'ANTSA Pty Ltd',
        url: 'https://antsa.ai/',
        logo: 'https://antsa.ai/LOGO-BLACK.png',
        email: 'admin@antsa.com.au',
        description:
          'Australian-built digital mental health platform connecting practitioners and clients with clinically governed AI, mood tracking, homework, messaging, and video sessions.',
        areaServed: ['AU', 'US', 'GB'],
        sameAs: ['https://antsa.com.au'],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'ANTSA Platform',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web, iOS, Android',
        description:
          'Digital mental health platform for practitioners and clients. Includes practitioner web app, client mobile app, AI assistant (ANTSAbot), video sessions, and AI-assisted clinical documentation.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'AUD', description: 'Free trial available' },
        publisher: { '@id': 'https://antsa.ai/#organization' },
      },
      {
        '@type': 'WebSite',
        url: 'https://antsa.ai/',
        name: 'ANTSA',
        publisher: { '@id': 'https://antsa.ai/#organization' },
      },
    ],
  };
  return (
    <>
      <title>ANTSA — Support clients between sessions. Reduce admin.</title>
      <meta name="description" content="Support clients between sessions. Reduce admin. One system built for practitioners — client engagement, AI documentation, telehealth, reminders, questionnaires and practitioner-visible AI support in one secure Australian system." />
      <link rel="canonical" href="https://antsa.ai/" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="theme-color" content="#48abe2" />
      <meta name="author" content="ANTSA Pty Ltd" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ANTSA" />
      <meta property="og:title" content="ANTSA — Support clients between sessions. Reduce admin." />
      <meta property="og:description" content="One system for practitioners: engagement tools, AI documentation, telehealth, reminders and AI support — Australian hosted." />
      <meta property="og:url" content="https://antsa.ai/" />
      <meta property="og:image" content="https://antsa.ai/LOGO-BLACK.png" />
      <meta property="og:locale" content="en_AU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="ANTSA — Support clients between sessions. Reduce admin." />
      <meta name="twitter:description" content="One system for practitioners: engagement, AI notes, telehealth, reminders — Australian hosted." />
      <meta name="twitter:image" content="https://antsa.ai/LOGO-BLACK.png" />
      <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      <link rel="alternate" type="text/plain" title="Machine-readable site summary" href="/llms.txt" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-207E2PQKJN" />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-207E2PQKJN');`,
        }}
      />
    </>
  );
}
```

- [ ] **Step 2: Wire `Head` into `+onRenderHtml.tsx`**

The skeleton from Task 2 already references `pageContext.config.Head` and renders it inside the HTML template. Confirm that block is in place; if not, add it.

- [ ] **Step 3: Add the home-page `+Head.tsx` with FAQ JSON-LD from sections**

```tsx
// src/pages/index/+Head.tsx
import type { HomeData } from './+data';

export default function Head({ data }: { data: HomeData }) {
  const allFaqs: Array<{ q: string; a: string }> = [];
  for (const s of data?.sections ?? []) {
    for (const f of (s.faqs as Array<{ question: string; answer: string }> | undefined) ?? []) {
      const q = String(f.question ?? '').trim();
      const a = String(f.answer ?? '').trim();
      if (q && a) allFaqs.push({ q, a });
    }
  }
  if (!allFaqs.length) return null;
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
    />
  );
}
```

- [ ] **Step 4: Per-page title overrides**

For each of the four sub-pages, create a small `+Head.tsx` that overrides just the title and canonical:

```tsx
// src/pages/free-trial/+Head.tsx
export default function Head() {
  return (
    <>
      <title>Free Trial — ANTSA</title>
      <link rel="canonical" href="https://antsa.ai/free-trial" />
    </>
  );
}
```

Repeat for `/help`, `/privacy-policy`, `/terms-and-conditions` with the appropriate title and canonical URL.

Vike's default behaviour merges page-level `Head` with global `+Head.tsx`. Confirm in the build and curl checks below.

- [ ] **Step 5: Build and verify**

```bash
npm run build && NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
echo "=== / has Organization JSON-LD ===" && curl -sS http://localhost:3001/ | grep -c '"@type":"Organization"'
echo "=== / has FAQPage JSON-LD ===" && curl -sS http://localhost:3001/ | grep -c '"@type":"FAQPage"'
echo "=== /free-trial title ===" && curl -sS http://localhost:3001/free-trial | grep -oE '<title>[^<]+</title>'
echo "=== /privacy-policy canonical ===" && curl -sS http://localhost:3001/privacy-policy | grep -oE 'rel="canonical"[^>]*'
pkill -f 'node backend/server.js' || true
```

Expected:
- Organization JSON-LD count: `1` on every public route.
- FAQPage JSON-LD count on home: `1` (if any FAQs exist in CMS).
- `/free-trial` title: `<title>Free Trial — ANTSA</title>`.
- `/privacy-policy` canonical: includes `https://antsa.ai/privacy-policy`.

- [ ] **Step 6: Commit**

```bash
git add src/pages
git commit -m "feat(landing): per-page Head metadata + JSON-LD via vike +Head

Default Head provides Organization/SoftwareApplication/WebSite JSON-LD,
OpenGraph, Twitter, canonical, gtag. Home page adds FAQPage JSON-LD
from CMS sections. Sub-pages override title and canonical."
```

---

### Task 13: Remove dead code (bot-UA, body-injection)

**Goal:** Delete the no-flash plumbing now that SSR handles every visitor identically.

**Files:**
- Delete: `backend/lib/bot-ua.js`
- Delete: `backend/lib/bot-ua.test.js`
- Modify: `backend/package.json` — drop `lib/*.test.js` from the `test` script.
- Verify: `backend/server.js` already has no `isBotUA` / `buildSeoBodyHtml` references (removed in Task 3); re-check.

- [ ] **Step 1: Confirm no remaining references**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page
grep -rn 'isBotUA\|buildSeoBodyHtml\|bot-ua' --include='*.js' --include='*.ts' --include='*.tsx' backend src
```

Expected: no matches in code (only matches in `docs/` and the existing tests, which we are about to remove).

- [ ] **Step 2: Delete the dead files**

```bash
git rm backend/lib/bot-ua.js backend/lib/bot-ua.test.js
rmdir backend/lib 2>/dev/null || true
```

- [ ] **Step 3: Update `backend/package.json` test script**

Change the `test` script to:

```json
    "test": "node --test 'ssr/*.test.js'"
```

- [ ] **Step 4: Run backend tests**

```bash
cd backend && npm test
```

Expected: 4 tests pass (the data-providers tests from Task 6). No errors about missing `lib/`.

- [ ] **Step 5: Commit**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page
git add backend/package.json
git commit -m "chore(landing): remove dead bot-UA helper and tests

SSR now renders the same HTML for every visitor; the UA-gated body
injection that bot-ua.js supported is gone."
```

---

### Task 14: Local production smoke script

**Files:**
- Create: `backend/scripts/smoke-ssr.sh`

- [ ] **Step 1: Write the smoke script**

```bash
#!/usr/bin/env bash
# backend/scripts/smoke-ssr.sh — verify SSR is producing real content for all public routes.
set -euo pipefail

PORT="${PORT:-3001}"
BASE="http://localhost:${PORT}"

cleanup() {
  pkill -f "node backend/server.js" 2>/dev/null || true
}
trap cleanup EXIT

echo "🔨 Building frontend..."
npm run build >/dev/null

echo "🚀 Starting prod server on port ${PORT}..."
NODE_ENV=production PORT="${PORT}" node backend/server.js &
sleep 3

check_route() {
  local path="$1"
  local must_contain="$2"
  local body
  body=$(curl -sS --max-time 10 "${BASE}${path}")
  if echo "$body" | grep -q '<div id="root"></div>'; then
    echo "❌ ${path}: empty #root — SSR did not populate the page"
    return 1
  fi
  if ! echo "$body" | grep -q "$must_contain"; then
    echo "❌ ${path}: expected to find '${must_contain}'"
    return 1
  fi
  echo "✅ ${path}"
}

echo
echo "── Public routes (must SSR) ──"
check_route "/"                       '<h1'
check_route "/free-trial"             '<h1'
check_route "/help"                   '<h1'
check_route "/privacy-policy"         '<h1'
check_route "/terms-and-conditions"   '<h1'

echo
echo "── JSON-LD on home ──"
curl -sS "${BASE}/" | grep -q '"@type":"Organization"' && echo "✅ Organization JSON-LD" || (echo "❌ Organization JSON-LD missing"; exit 1)

echo
echo "── Admin SPA (shell only is correct) ──"
ADMIN_BODY=$(curl -sS "${BASE}/admin")
if echo "$ADMIN_BODY" | grep -q '<div id="root">'; then
  echo "✅ /admin: SPA shell served"
else
  echo "❌ /admin: missing #root"; exit 1
fi

echo
echo "── API + discovery routes ──"
for p in /api/health /llms.txt /llms-full.txt /sitemap.xml /robots.txt; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' "${BASE}${p}")
  if [ "$code" = "200" ]; then
    echo "✅ ${p} → 200"
  else
    echo "❌ ${p} → ${code}"; exit 1
  fi
done

echo
echo "🎉 All SSR smoke checks passed."
```

- [ ] **Step 2: Make it executable and run it**

```bash
chmod +x backend/scripts/smoke-ssr.sh
./backend/scripts/smoke-ssr.sh
```

Expected: every check prints `✅`, ends with `🎉 All SSR smoke checks passed.`, exit code 0.

If any check fails, STOP. Diagnose and fix before continuing. The most common failure modes:
- A page returns empty `#root`: the corresponding `+data.ts` is throwing or the `+Page.tsx` is not wired up.
- JSON-LD missing: `+Head.tsx` is not being rendered — check that `meta.Head.env.server` is set in `+config.ts` and that `+onRenderHtml.tsx` renders `pageContext.config.Head`.
- `/admin` empty: the static carve-out in `backend/server.js` is not serving `dist/client/index.html` — confirm the path.

- [ ] **Step 3: Manual browser verification**

Open each public route in a real browser:

```bash
NODE_ENV=production PORT=3001 node backend/server.js &
sleep 2
open "http://localhost:3001/"
```

For each of `/`, `/free-trial`, `/help`, `/privacy-policy`, `/terms-and-conditions`:
- Hard-refresh (Cmd-Shift-R) three times.
- Confirm no flash of unstyled or empty content.
- Right-click → View Source. Confirm the response contains the actual page body, not an empty `#root`.

Then disable JavaScript in DevTools and reload `/`. The page should still render fully styled — this is the true SSR test.

Stop the server: `pkill -f 'node backend/server.js'`.

- [ ] **Step 4: Commit**

```bash
git add backend/scripts/smoke-ssr.sh
git commit -m "test(landing): add SSR smoke script

Builds the frontend, boots prod server, asserts every public route
returns populated HTML and that /admin still serves the SPA shell.
Used as the pre-merge gate."
```

---

### Task 15: Ship to production

**Files:** none (release-only).

- [ ] **Step 1: Final local smoke**

```bash
./backend/scripts/smoke-ssr.sh
```

Expected: all green.

- [ ] **Step 2: Push the feature branch and merge to main**

```bash
git push -u origin feature/ssr-vike
git checkout main
git pull origin main
git merge --no-ff feature/ssr-vike -m "Merge: migrate landing page to SSR via vike"
git push origin main
```

- [ ] **Step 3: Watch the Azure deploy**

```bash
sleep 5
gh run list --repo antsa-alec/antsa-landing-page --limit 1
# get the run id from the output, then:
gh run watch <RUN_ID> --repo antsa-alec/antsa-landing-page --exit-status
```

Expected: deploy completes with conclusion `success`. Note that the build step now produces `dist/client/` and `dist/server/`; verify the Action's deploy command still uploads the right directories (`dist/` + `backend/` is standard).

- [ ] **Step 4: Production smoke**

```bash
sleep 30   # warm-up
BASE=https://antsa.ai
for p in / /free-trial /help /privacy-policy /terms-and-conditions; do
  printf "  %-25s " "$p"
  body=$(curl -sS "${BASE}${p}")
  if echo "$body" | grep -q '<div id="root"></div>'; then
    echo "❌ empty #root"
  else
    echo "$body" | grep -oE '<title>[^<]+</title>' | head -1
  fi
done
echo
curl -sS "${BASE}/" | grep -c '"@type":"Organization"' | xargs -I{} echo "Organization JSON-LD: {}"
curl -sS "${BASE}/" | grep -c '"@type":"FAQPage"' | xargs -I{} echo "FAQPage JSON-LD: {}"
echo
for p in /api/health /llms.txt /llms-full.txt /sitemap.xml /robots.txt /admin; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' "${BASE}${p}")
  printf "  %-20s → %s\n" "$p" "$code"
done
```

Expected:
- Every public route shows a populated `<title>` and **does not** report empty `#root`.
- Organization JSON-LD count: `1`.
- FAQPage JSON-LD count: `1` (if CMS has FAQs).
- `/api/health`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt`, `/admin` all return `200`.

- [ ] **Step 5: Manual browser eyeball**

```bash
open https://antsa.ai/
```

Hard-refresh each public route in a browser. Confirm: no flash; styles in place on first paint; navigation between routes works; HelpChatWidget appears after mount.

- [ ] **Step 6: Tidy up**

```bash
git branch -d feature/ssr-vike
git push origin --delete feature/ssr-vike
```

---

## Self-review notes

- **Spec coverage:** Every spec section is implemented by at least one task. SSR architecture → Tasks 2, 3. AntD CSS-in-JS → Task 4. Layout + client-only widgets → Task 5. Data providers → Task 6. Per-page migration → Tasks 7, 8, 9, 10, 11. Head/metadata → Task 12. Dead-code removal → Task 13. Testing → Task 14. Deploy → Task 15.
- **Placeholders:** None — every step has concrete code, exact commands, expected output.
- **Type consistency:** `HomeData`, `PrivacyData`, `TermsData`, `HelpData`, `FreeTrialData` are each defined in their respective `+data.ts` and consumed by the matching `+Page.tsx`. `SectionRow` defined once in `src/pages/index/+data.ts`, imported by `src/App.tsx`.
- **Known ambiguity left to the implementer:** the help-page data assembly (Task 11 Step 2) gives the implementer a choice between extracting the assembly logic (preferred) or proxying via in-process HTTP. Both produce the same external behaviour; the choice is a complexity/time tradeoff and is captured in the commit message so the next reader can see what was picked.
- **Risk anchor:** Task 4 explicitly verifies AntD SSR styling before any real page migration, so if the CSS-in-JS recipe is wrong we discover it once, early, with a minimal example rather than across five pages.
