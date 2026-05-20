# Landing Page No-Flash (UA-Gated SEO Body) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the flash of SEO text that appears before the React SPA mounts on antsa.ai, while preserving the original goal of serving full content to non-JS LLM scrapers (GPTBot, ClaudeBot, PerplexityBot, etc.).

**Architecture:** Switch from unconditional body-injection in `backend/server.js` to **User-Agent-gated dynamic rendering**. Bot UAs continue to receive the injected SEO body (current behaviour). All other clients receive the clean shell with no body injection — React mounts into an empty `#root`, so there is nothing to flash-replace. FAQ JSON-LD in `<head>` remains universal (it's invisible and high-signal for crawlers). `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt`, and existing `<head>` metadata are unchanged.

**Tech Stack:** Node 18+, Express 4, ES modules, built-in `node:test` runner (no new deps).

**Files touched:**
- Create: `backend/lib/bot-ua.js` — pure helper exporting `isBotUA(userAgent)` plus the regex constant.
- Create: `backend/lib/bot-ua.test.js` — `node:test` unit tests.
- Modify: `backend/server.js:108-130` — branch the catch-all handler on `isBotUA(req.get('user-agent'))`.
- Modify: `backend/package.json:7-11` — add `"test": "node --test lib/"` script.

---

### Task 1: Bot User-Agent detector + tests

**Files:**
- Create: `backend/lib/bot-ua.js`
- Create: `backend/lib/bot-ua.test.js`
- Modify: `backend/package.json`

- [ ] **Step 1: Add test script to backend package.json**

Edit `backend/package.json`, replace the `"scripts"` block:

```json
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node scripts/seed.js",
    "test": "node --test lib/"
  },
```

- [ ] **Step 2: Write the failing tests**

Create `backend/lib/bot-ua.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBotUA } from './bot-ua.js';

const BOT_UAS = [
  // LLM / AI scrapers — primary motivation
  'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot',
  'Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)',
  'Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)',
  'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
  'Mozilla/5.0 (compatible; Claude-Web/1.0; +https://www.anthropic.com)',
  'anthropic-ai',
  'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
  'Mozilla/5.0 (compatible; Perplexity-User/1.0)',
  'Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)',
  'Mozilla/5.0 (compatible; CCBot/2.0; +https://commoncrawl.org/faq/)',
  'Mozilla/5.0 (compatible; Google-Extended)',
  'Mozilla/5.0 (compatible; meta-externalagent/1.1)',
  'Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)',
  'Mozilla/5.0 (compatible; Amazonbot/0.1)',
  // Search engines
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 (compatible; DuckDuckBot/1.1; +http://duckduckgo.com/duckduckbot.html)',
  'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
  'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
  // Link previewers / social
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Mozilla/5.0 (compatible; Twitterbot/1.0)',
  'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
  'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
  'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
  'WhatsApp/2.23.20.0',
  'TelegramBot (like TwitterBot)',
  'Mozilla/5.0 (compatible; archive.org_bot +http://www.archive.org/details/archive.org_bot)',
];

const HUMAN_UAS = [
  // Real browsers — must NOT be treated as bots
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
];

for (const ua of BOT_UAS) {
  test(`bot: ${ua.slice(0, 60)}`, () => {
    assert.equal(isBotUA(ua), true);
  });
}

for (const ua of HUMAN_UAS) {
  test(`human: ${ua.slice(0, 60)}`, () => {
    assert.equal(isBotUA(ua), false);
  });
}

test('empty / missing UA -> not a bot (browsers always send one; absence is curl/health-check)', () => {
  assert.equal(isBotUA(undefined), false);
  assert.equal(isBotUA(null), false);
  assert.equal(isBotUA(''), false);
});

test('case-insensitive match', () => {
  assert.equal(isBotUA('gptbot'), true);
  assert.equal(isBotUA('CLAUDEBOT'), true);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run from `backend/`:

```bash
cd backend && npm test
```

Expected: all tests fail with `Cannot find module './bot-ua.js'` (or similar import error).

- [ ] **Step 4: Implement bot-ua.js**

Create `backend/lib/bot-ua.js`:

```js
// Single regex matched case-insensitively against the User-Agent.
// Token list curated for the bots that (a) do not execute JS and (b) we
// actively want to serve the SEO body to: LLM scrapers, search engines,
// link previewers, and archivers.
//
// Update notes:
// - When a new AI scraper appears, add its UA token here.
// - Bots that DO execute JS (e.g. modern Googlebot) are still included —
//   serving them the pre-injected body is cheap and removes a render hop.
const BOT_UA_RE = new RegExp(
  [
    // LLM / AI training & retrieval
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Bytespider',
    'CCBot',
    'Google-Extended',
    'meta-externalagent',
    'Amazonbot',
    'Applebot',
    'YouBot',
    'cohere-ai',
    'Diffbot',
    // Search engines
    'Googlebot',
    'bingbot',
    'DuckDuckBot',
    'YandexBot',
    'Baiduspider',
    'Sogou',
    'Exabot',
    // Social / link previewers
    'facebookexternalhit',
    'Facebot',
    'Twitterbot',
    'LinkedInBot',
    'Slackbot',
    'Discordbot',
    'TelegramBot',
    'WhatsApp',
    'SkypeUriPreview',
    'Embedly',
    // Archivers / monitoring
    'archive\\.org_bot',
    'ia_archiver',
    'Pingdom',
    // Generic fallthroughs — last so specific names rank in logs
    'bot',
    'crawler',
    'spider',
  ].join('|'),
  'i',
);

export function isBotUA(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') return false;
  return BOT_UA_RE.test(userAgent);
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd backend && npm test
```

Expected: all tests pass, summary shows `pass` count matching `BOT_UAS.length + HUMAN_UAS.length + 2`.

- [ ] **Step 6: Commit**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page
git add backend/lib/bot-ua.js backend/lib/bot-ua.test.js backend/package.json
git commit -m "feat(landing): add bot User-Agent detector

Pure helper + node:test unit tests for the upcoming UA-gated SEO body
injection. No behavioural change yet."
```

---

### Task 2: Gate SEO body injection on bot UA

**Files:**
- Modify: `backend/server.js:15` (import) and `backend/server.js:108-130` (handler).

- [ ] **Step 1: Import the detector**

Edit `backend/server.js`, line 15, replace:

```js
import seoRoutes, { buildSeoBodyHtml, buildFaqJsonLd, loadAllSections, loadHelpArticles } from './routes/seo.js';
```

with:

```js
import seoRoutes, { buildSeoBodyHtml, buildFaqJsonLd, loadAllSections, loadHelpArticles } from './routes/seo.js';
import { isBotUA } from './lib/bot-ua.js';
```

- [ ] **Step 2: Replace the catch-all handler**

Edit `backend/server.js`, replace the `app.get('*', ...)` block (lines ~108-130) with:

```js
  // Catch-all SPA handler.
  //
  // Humans get the clean shell — React mounts into an empty #root, so there is
  // nothing for it to flash-replace. (That replace was the visible "FOUC" on
  // antsa.ai.)
  //
  // Bots that read raw HTML (LLM scrapers like GPTBot/ClaudeBot, search
  // engines, link previewers) get the injected SEO body. This preserves the
  // original goal of giving non-JS scrapers full marketing content without
  // requiring them to execute the SPA.
  //
  // FAQ JSON-LD is injected for everyone — it lives in <head>, is invisible,
  // and helps any crawler that does parse it (Google rich results, etc.).
  app.get('*', (req, res) => {
    try {
      const sections = loadAllSections();
      const faqLd = buildFaqJsonLd(sections);
      const isBot = isBotUA(req.get('user-agent'));

      let html = getShell();

      if (isBot) {
        const helpArticles = loadHelpArticles();
        const bodyHtml = buildSeoBodyHtml(sections, helpArticles);
        html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
      }

      if (faqLd) {
        const faqScript = `<script type="application/ld+json">${JSON.stringify(faqLd)}</script>`;
        html = html.replace('</head>', `${faqScript}</head>`);
      }

      res.set('Content-Type', 'text/html; charset=utf-8');
      // Bot vs human variants must not share a cache entry.
      res.set('Vary', 'User-Agent');
      res.set('Cache-Control', 'public, max-age=300');
      res.send(html);
    } catch (err) {
      console.error('SSR injection failed, serving plain shell:', err);
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
```

- [ ] **Step 3: Build the frontend and start the backend in prod mode**

From repo root:

```bash
npm run build
cd backend && NODE_ENV=production PORT=3001 node server.js &
sleep 2
```

Expected: `🚀 Server running on port 3001` in logs.

- [ ] **Step 4: Verify bot UA still gets the SEO body**

```bash
curl -sS -H 'User-Agent: GPTBot/1.2 (+https://openai.com/gptbot)' http://localhost:3001/ \
  | grep -c '<main>'
```

Expected: `1` (the `<main>` block from `buildSeoBodyHtml` is present).

Also confirm Vary header:

```bash
curl -sSI -H 'User-Agent: GPTBot/1.2' http://localhost:3001/ | grep -i '^vary:'
```

Expected: `Vary: User-Agent`.

- [ ] **Step 5: Verify human UA gets a clean #root**

```bash
curl -sS -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15' \
  http://localhost:3001/ \
  | grep -o '<div id="root">[^<]*</div>'
```

Expected: `<div id="root"></div>` exactly (empty).

- [ ] **Step 6: Verify FAQ JSON-LD is present for both**

```bash
for UA in 'GPTBot/1.2' 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15'; do
  echo "--- UA: $UA ---"
  curl -sS -H "User-Agent: $UA" http://localhost:3001/ | grep -c '"@type":"FAQPage"'
done
```

Expected: both print `1`.

- [ ] **Step 7: Verify /llms.txt, /llms-full.txt, /sitemap.xml, /robots.txt still work**

```bash
for path in /llms.txt /llms-full.txt /sitemap.xml /robots.txt; do
  echo "--- $path ---"
  curl -sSI "http://localhost:3001$path" | head -1
done
```

Expected: all `HTTP/1.1 200 OK`.

- [ ] **Step 8: Open the site in a real browser and confirm no flash**

```bash
open http://localhost:3001/
```

Expected behaviour:
1. Page loads with a brief blank/header area, then the styled hero renders.
2. **No** visible burst of raw unstyled text before the hero appears.
3. Hard-refresh (Cmd-Shift-R) three times to rule out cache. Each load: no flash.
4. Navigate to `/free-trial`, `/help`, `/privacy-policy`, `/terms-and-conditions` — each loads clean, no flash.
5. Open DevTools Network tab, reload `/`, view the document response — confirm `<div id="root"></div>` is empty in the raw HTML.

If a flash is still visible, STOP and investigate before continuing. Likely causes: stale `dist/` build, browser cache, or another inline script writing to `#root` before React mounts.

- [ ] **Step 9: Stop the backend**

```bash
kill %1 2>/dev/null || pkill -f 'node server.js'
```

- [ ] **Step 10: Commit**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page
git add backend/server.js
git commit -m "fix(landing): gate SEO body injection on bot User-Agent

Humans now receive the clean Vite shell and React mounts into an empty
#root, eliminating the flash of raw SEO text that was visible on every
load. Bot UAs (GPTBot, ClaudeBot, Googlebot, PerplexityBot, link
previewers, etc.) continue to receive the full pre-injected body so
non-JS scrapers still get the marketing content. FAQ JSON-LD remains in
<head> for all clients. Vary: User-Agent added so bot and human
variants don't collide in shared caches."
```

---

### Task 3: Ship to production

**Files:** none — release-only.

- [ ] **Step 1: Push to main**

```bash
cd /Users/alec/Projects/antsa/antsa-landing-page
git push origin main
```

Expected: push succeeds. The Azure Static Web Apps / App Service deploy pipeline that handles this repo picks up the change.

- [ ] **Step 2: Wait for deploy and smoke-test production**

After the deploy reports success (check the Azure portal or whatever CI surface this repo uses), wait ~60s for warmup, then:

```bash
# Bot path — must contain the injected body
curl -sS -H 'User-Agent: GPTBot/1.2 (+https://openai.com/gptbot)' https://antsa.ai/ \
  | grep -c '<main>'

# Human path — must show empty #root
curl -sS -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15' \
  https://antsa.ai/ \
  | grep -o '<div id="root">[^<]*</div>'

# Vary header
curl -sSI -H 'User-Agent: GPTBot/1.2' https://antsa.ai/ | grep -i '^vary:'

# LLM channels
for path in /llms.txt /llms-full.txt /sitemap.xml /robots.txt; do
  echo "--- $path ---"
  curl -sSI "https://antsa.ai$path" | head -1
done
```

Expected:
- bot path → `1`
- human path → `<div id="root"></div>`
- vary header → `Vary: User-Agent`
- all four crawl channels → `HTTP/1.1 200 OK` (or 200 OK via 2.0)

- [ ] **Step 3: Open production in a browser and confirm no flash**

```bash
open https://antsa.ai/
```

Hard-refresh three times. Expected: no flash of raw text on any load. Repeat on a mobile UA via Chrome DevTools device emulation.

- [ ] **Step 4: Sanity-check Search Console + GSC URL inspection (optional, recommended)**

In Google Search Console, run **URL Inspection → Test live URL** on `https://antsa.ai/`. Confirm rendered HTML still contains the hero text (Googlebot executes JS, so it sees the React-rendered DOM regardless of body injection).

If GSC reports missing content: revisit Task 2 — Googlebot was being matched by `isBotUA` and got the bot path, so this is unlikely, but worth confirming.

---

## Self-review notes

- **Spec coverage:** Original ask was (a) fix the flash and (b) preserve LLM-scrape access. Task 2 fixes the flash for non-bot UAs; Task 2 + the `buildSeoBodyHtml` branch preserves bot access. Task 3 ships to prod. Covered.
- **Placeholders:** none — every step has exact commands, code, and expected output.
- **Type consistency:** `isBotUA` signature `(string | null | undefined) => boolean` matches between definition and call site.
- **Risk:** UA list drift — mitigated by the broad `bot|crawler|spider` fallthrough tokens and by retaining `/llms.txt` + `/llms-full.txt` as canonical LLM channels for anything that slips through.
