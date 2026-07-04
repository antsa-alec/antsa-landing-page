# ANTSA landing — SEO audit & uplift plan (2026)

Scope: `antsa.ai` marketing site (Vike SSR React on Express/Azure; routes `/`, `/free-trial`,
`/help`, `/privacy-policy`, `/terms-and-conditions`). Goal: optimise for Google, Bing/other
engines, and LLM answer-engines (ChatGPT, Perplexity, Copilot, Google AI Overviews).
Audit run 2026-07-04 against live prod + the codebase. Research current as of mid-2026.

## TL;DR verdict

The site is **already ahead of most on the technical layer**: true SSR (Googlebot **and**
GPTBot get full HTML — verified live), dynamic `robots.txt`/`sitemap.xml`/`llms.txt`, clean
semantic markup, and solid JSON-LD. The uplift is mostly **correctness fixes + performance +
content/reputation**, not a rebuild.

Biggest levers, in order: (1) fix per-page `<head>` duplication + soft-500s (indexation
correctness), (2) get AntD off the marketing bundle (Core Web Vitals / INP), (3) real `lastmod`
+ IndexNow (fast recrawl → Bing → ChatGPT/Copilot), (4) answer-first content + E-E-A-T /
clinical-governance signals (YMYL), (5) off-site reputation (the real ceiling on AI citations).

Do **not** chase: hreflang (single marketing domain — N/A yet), FAQ/HowTo/sitelinks-searchbox
rich results (all deprecated), self-authored Review/AggregateRating schema (ineligible +
manual-action risk), or heavy `llms.txt` investment (near-zero crawler adoption in 2026).

---

## Current-state scorecard

| Area | Status | Notes |
|------|--------|-------|
| SSR / crawlable HTML | ✅ Good | `curl -A GPTBot https://antsa.ai/` returns full 214 KB HTML incl. h1/body/FAQ. AI crawlers don't run JS — this is the #1 GEO requirement and we pass it. |
| robots.txt | ✅ OK | Allow `/`, disallow `/admin` + `/api/`, sitemap + llms.txt referenced. Allow-all already permits every AI bot (good for citations). |
| sitemap.xml | ⚠️ Faked `lastmod` | Every URL `lastmod = build date`. Google learns to distrust it. |
| llms.txt / llms-full.txt | ⚠️ Stale | References dead sections (`why_switch`, `everything_one_login`, `for_clinics`) + old page title. Cheap to keep, but currently misleading. |
| Per-page `<head>` | ❌ P0 bug | Sub-pages ship **2 `<title>` + 2 conflicting canonicals** (home + self) — Vike `+Head` is cumulative. Home page is clean. |
| 404 handling | ❌ P0 bug | Unknown paths return **HTTP 500** (should be 404). Soft-error, wasted crawl budget. |
| Structured data | ✅ Good, minor gaps | Home has Organization, SoftwareApplication+Offer, WebSite, FAQPage. No self-serving ratings (correct). Missing accurate `dateModified`. |
| Core Web Vitals | ⚠️ At risk (INP/LCP) | ~530 KB AntD JS chunk shipped to a 5-page marketing site. Images are unsized PNGs. |
| International (AU/US/UK) | ✅ Fine as-is | Marketing is one domain; `{country}.antsa.ai` is the app. hreflang N/A until per-locale marketing URLs exist. |
| Security headers | ⚠️ Minor | No HSTS header. |
| AI-referral measurement | ❌ Missing | No GA4 AI-channel config; not in Bing Webmaster Tools. |
| Off-site reputation | ❌ Gap | Little third-party presence (G2/Capterra/Reddit/PR) — the real ceiling on ChatGPT/Perplexity citations for B2B SaaS. |

---

## P0 — Indexation correctness (do first; small, high-impact code fixes)

### P0-1 — Fix cumulative `+Head` (duplicate/conflicting title + canonical on sub-pages)
Vike's `+Head` is cumulative: `src/pages/+Head.tsx` renders on **every** page in addition to each
page's own `+Head`, so `/free-trial`, `/help`, `/privacy-policy`, `/terms` each ship the homepage
`<title>` + homepage `<link canonical>` **and** their own → Google can collapse them into the
homepage as duplicates.
- **Fix:** move page-specific `title`/`description`/`canonical`/`og:url`/`og:title` out of the
  global `+Head` into each page's `+Head` (derive canonical from `pageContext.urlOriginal`). Keep
  only truly-global tags in `src/pages/+Head.tsx` (favicon, fonts, theme-color, GA4, Org/WebSite
  JSON-LD). The home page's title/canonical move into `src/pages/index/+Head.tsx`.
- **Why:** conflicting canonicals + duplicate titles are the single biggest live indexation risk.
- **Effort:** M. **Source:** https://vike.dev/Head · https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

### P0-2 — Return a real 404 for unknown routes (currently 500)
`https://antsa.ai/anything-unknown` → HTTP 500. Add a Vike `_error`/404 page (or catch in the
Express `*` handler) that renders a not-found page with a real **404** status (and `noindex`).
- **Why:** soft-errors waste crawl budget and can misclassify valid pages; 500s look like site
  instability to crawlers.
- **Effort:** S–M. **Source:** https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

### P0-3 — Emit real `lastmod` in sitemap.xml
`backend/routes/seo.js` `buildSitemapXml()` sets `lastmod = new Date()` for every URL. Pull the
real `updated_at` from the CMS rows (per section/route; for `/help` use the newest article edit).
- **Why:** accurate `lastmod` drives recrawl of changed pages; a constant "today" trains crawlers
  to ignore it. Also feeds AI freshness signals.
- **Effort:** S. **Source:** https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

### P0-4 — Refresh `llms.txt` / `llms-full.txt` to the new IA
`buildLlmsTxt()` hardcodes highlights for sections that no longer exist and uses the old page
title. Regenerate from the current sections (hero, features, security, team, pricing, faq, …).
- **Why:** it's already shipped and currently misdescribes the site; cheap correctness fix.
  (Don't invest beyond correctness — see "Deprioritise" below.)
- **Effort:** S. **Source:** https://www.aeo.press/ai/the-state-of-llms-txt-in-2026

---

## P1 — Core Web Vitals / performance

### P1-1 — Get AntD off the marketing routes (biggest INP + LCP win)
The home page ships a **~530 KB** JS chunk (AntD, pulled in by `AppHeader` Drawer/Button,
`AppFooter` `message`, `HelpChatWidget`). INP is the most-failed Core Web Vital in 2026 and a
single large chunk is a hydration/long-task bomb.
- **Fix (in priority order):** (a) replace the few AntD usages in chrome with plain HTML/CSS (the
  redesign already uses `dc-*` helper classes — the header/footer barely need AntD); (b) if some
  widget must stay, `React.lazy()` + dynamic `import()` so AntD ships only on demand;
  (c) `ClientOnly`-load `HelpChatWidget` (already done) and defer its AntD.
- **Why:** web.dev targets ≤~100 KB per script for good INP; 530 KB blocks the main thread during
  hydration. Thresholds: LCP ≤2.5 s, INP <200 ms, CLS <0.1 (75th percentile).
- **Effort:** L. **Source:** https://web.dev/articles/optimize-long-tasks · https://developers.google.com/search/docs/appearance/core-web-vitals

### P1-2 — Image optimisation (LCP + CLS)
Product screenshots (`public/landing/*.png`, 90–350 KB) have no `width`/`height` and no loading hints.
- **Fix:** add explicit `width`/`height` (or `aspect-ratio`) to every `<img>`; `loading="eager"` +
  `fetchpriority="high"` on the hero LCP image, `loading="lazy"` below the fold; convert to WebP
  (optionally AVIF) via `<picture>` with PNG fallback; add `srcset`/`sizes` for mobile.
- **Why:** images drive LCP on ~76 % of mobile pages; unsized images cause CLS; lazy-loading the
  hero (a common mistake) delays LCP.
- **Effort:** M. **Source:** https://www.corewebvitals.io/pagespeed/optimize-images-for-core-web-vitals · https://web.dev/articles/lcp

---

## P1 — Structured data & freshness

### P1-3 — Add accurate `dateModified` + visible "Last updated" where relevant
Add `dateModified` to JSON-LD (and a visible date on `/help` articles, privacy/terms), backed by
real `Last-Modified` HTTP headers.
- **Why:** AI answer engines weight recency (Perplexity re-searches every query; ChatGPT Search
  refreshes on 24–72 h). Also a classic-search quality signal.
- **Effort:** S–M. **Source:** https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

### P1-4 — Keep current schema; do NOT add self-serving ratings
Keep Organization + SoftwareApplication (with `offers`, **no** `aggregateRating`). Keep FAQPage
**only** where content is genuinely Q&A (no rich-result reward since May 2026, but helps AI
extraction). Add `BreadcrumbList` only if nested content (e.g. per-article `/help/<slug>`) is added.
- **Why:** self-authored Review/AggregateRating on your own product is **ineligible** for stars and
  risks a manual action. Add `Product`+`AggregateRating` **only** with legitimate third-party review
  data (G2/Capterra) — see P2-4.
- **Effort:** S. **Source:** https://developers.google.com/search/docs/appearance/structured-data/review-snippet

---

## P1 — Bing / AI reach + measurement

### P1-5 — Add IndexNow
Generate a 32–64 hex key, host `https://antsa.ai/<key>.txt`, and `POST https://api.indexnow.org/IndexNow`
`{host,key,keyLocation,urlList}` from the admin "publish" path in `seo.js` (highest value on
help-article publish/edit).
- **Why:** one ping fans out to Bing + participating engines; changed pages recrawl in minutes.
  ChatGPT Search retrieves via Bing (~87 % of ChatGPT citations match Bing top organic), so
  Bing-index speed ≈ ChatGPT-answer eligibility. (Google ignores IndexNow — keep submitting the
  sitemap to GSC.)
- **Effort:** M. **Source:** https://www.bing.com/indexnow/getstarted

### P1-6 — Register Bing Webmaster Tools + stand up AI-referral measurement
Add the site to Bing Webmaster Tools (import from GSC), submit the sitemap, enable the **AI
Performance** report. In GA4, add a custom channel-group regex for AI referrers (`chatgpt.com`,
`perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com`, `you.com`).
- **Why:** BWT AI Performance is the only first-party view of which pages Copilot/Bing-AI cite;
  GA4's auto "AI Assistant" channel is only partial. Can't optimise what you can't see.
- **Effort:** S (mostly console setup). **Source:** https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview

### P1-7 — (Optional) make the AI-crawler policy explicit in robots.txt
Current `Allow: /` already permits all AI bots (fine for citations). If you want intentional
control, explicitly **allow** retrieval/citation bots (`OAI-SearchBot`, `ChatGPT-User`,
`PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User`, `Bingbot`, `Applebot`) and
decide on training bots (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`). For a small B2B brand
wanting recall, **leave training allowed** unless there's an IP reason.
- **Why:** blocking `GPTBot` (training) does NOT block ChatGPT citations (those come from
  `OAI-SearchBot`/`ChatGPT-User`). Retrieval bots are the non-negotiable allow.
- **Effort:** S. **Source:** https://nohacks.co/blog/ai-user-agents-landscape-2026

---

## P1/P2 — Content, E-E-A-T & answer-engine optimisation (GEO)

### P1-8 — "Answer-first" content + depth (YMYL health)
Lead each section with a direct 2–4 sentence answer under a descriptive H2 phrased as the question
a clinician would ask ("Is ANTSA's client data clinician-governed?"). Add substantive people-first
sections (how it works, who it's for, data security/privacy, outcomes/evidence). Add statistics,
named expert/clinician quotes, and cited sources.
- **Why:** answer engines cite self-contained passages that directly answer a query; the Princeton
  GEO study found citations + stats + quotes lift AI visibility 30–40 %. Thin marketing copy is the
  main Helpful-Content vulnerability, and health is judged hardest.
- **Effort:** M–L (content). **Source:** https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142

### P1-9 — Surface E-E-A-T / clinical-governance trust signals
Add a real **clinical governance / advisory page** naming the clinicians behind ANTSA with
credentials + AHPRA (AU) registrations, linked from footer + homepage. Named author bios on any
advice content (not "Admin"). Clear org identity (legal entity, ABN, address, contact) — most
already in JSON-LD; surface it visibly too.
- **Why:** for YMYL/health Google weights Trust hardest and first-hand Experience is the current
  differentiator. "Clinician-governed" is a genuine E-E-A-T asset — make it explicit, not implied.
- **Effort:** M. **Source:** https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### P2-1 — Comparison tables + lists for machine extraction
Add an "ANTSA vs [category / point solutions]" comparison table and a features/security matrix.
- **Why:** structured-content density (tables/lists) is disproportionately pulled into AI answers.
- **Effort:** M. **Source:** https://solcrys.com/ai-answer-citations/

---

## P2 — Off-site & longer-horizon (the real citation ceiling)

- **P2-2 — Build third-party presence:** G2, Capterra, relevant health/clinical directories, Reddit,
  earned PR. For B2B SaaS, ChatGPT leans on third-party consensus (Reddit/G2/Capterra) **over** your
  own site. This likely moves AI citations more than any on-site tweak.
  Source: https://www.leapd.ai/blog/ai-visibility/how-chatgpt-google-ai-overviews-and-perplexity-source-information-in-2026
- **P2-3 — Entity/brand consistency:** one canonical one-sentence description of ANTSA everywhere
  (site, LinkedIn, directories, `Organization.description`).
- **P2-4 — Original, hard-to-replicate material:** benchmarks, proprietary/clinical data, a named
  framework — durable citation magnets that fit the clinician-governed authority angle. Once you
  have legitimate third-party ratings, then (and only then) add `Product`+`AggregateRating`.
- **P2-5 — HSTS + header hardening:** add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  (subdomains matters — app runs on `{country}.antsa.ai`).
- **P2-6 — Help-centre URL granularity:** if help articles are worth ranking/AI-citing individually,
  give each a `/help/<slug>` URL in the sitemap with real `lastmod`; else keep `/help` but track its
  `lastmod` to the newest article. Move to a sitemap index if URLs exceed a few hundred.
- **P2-7 — Delete/repair stale `staticwebapp.config.json`:** it rewrites 404→`/index.html` with
  `statusCode 200` (a soft-404 factory). Inert on App Service today, but remove so a future Static
  Web Apps deploy can't regress.

---

## Deprioritise / don't do

- **hreflang** — N/A (single marketing domain). If/when you build region marketing pages, use
  `antsa.ai/us` `antsa.ai/uk` **subfolders** (not subdomains), with self-canonical + reciprocal
  hreflang + `x-default`.
- **FAQ / HowTo / sitelinks-searchbox rich results** — all deprecated; keep FAQPage JSON-LD only for
  AI extraction, expect no SERP stars.
- **Self-authored Review/AggregateRating schema** — ineligible + manual-action risk.
- **Heavy llms.txt investment** — near-zero crawler adoption in 2026 (only IDE assistants fetch it);
  keep it correct, invest the effort in SSR + structure + reputation instead.
- **`MedicalOrganization`/`MedicalBusiness` schema** — ANTSA is software, not a care provider;
  mismatched typing is a quality risk. Stick with Organization + SoftwareApplication.

---

## Suggested execution order

1. **P0 quick wins (1 PR):** head-dedup, real 404, real `lastmod`, `llms.txt` refresh.
2. **P1 performance:** AntD off marketing routes; image `width`/`height` + eager/lazy + WebP.
3. **P1 reach:** IndexNow + Bing Webmaster + GA4 AI channel.
4. **P1 schema/freshness:** `dateModified`; keep schema clean.
5. **P1/P2 content:** answer-first rewrite + clinical-governance page + comparison tables.
6. **P2 off-site:** G2/Capterra/Reddit/PR, entity consistency, original research; HSTS.
