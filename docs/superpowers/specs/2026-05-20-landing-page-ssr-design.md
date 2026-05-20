# Landing Page SSR Migration — Design

**Date:** 2026-05-20
**Goal:** Migrate antsa-landing-page from a Vite SPA (with UA-gated SEO body injection as a stopgap) to true Server-Side Rendering, so every visitor and every scraper receives identical, fully populated HTML on first response. No visual or CMS changes. Single deploy, ship E2E to production.

---

## Background

Today the public marketing site is a Vite + React 18 + AntD + react-router-dom SPA served from an Express backend on Azure App Service (Windows / iisnode). The `app.get('*')` handler in `backend/server.js` injects a server-built `<main>` body into `<div id="root">` only for bot User-Agents (GPTBot, ClaudeBot, search engines, link previewers). Human visitors receive an empty shell that React then mounts into. This works but is a pragmatic pattern, not a standard — it requires a UA allowlist, doesn't help humans on slow connections, and runs two divergent rendering paths.

True SSR replaces that with a single rendering path: the server renders the full React tree to HTML using live CMS data on every request, the client hydrates the existing DOM, and there is no scenario where a visitor sees an empty `#root`.

## Goals

1. Every public route returns fully populated HTML on first response.
2. Visual output, CMS content model, admin panel, and `/api/*` surface area are unchanged.
3. Content freshness is request-time — CMS edits visible on the very next page load.
4. Single Node process; deploys via the existing Azure App Service GitHub Action.
5. Ship end-to-end to production in one PR. No staging slot, no phased rollout.

## Non-goals

- No design/visual changes.
- No CMS schema changes.
- No replacement of AntD, react-router-dom, Express, or SQLite.
- No move off Azure App Service.
- No SSR for `/admin/*` (remains a client-rendered SPA behind auth).
- No ISR, no edge rendering, no CDN introduction. Pure request-time SSR from the origin.

## Constraints

- **Stack:** Vite 6, React 18, TypeScript, AntD 5 (CSS-in-JS), react-router-dom 6, Express 4, better-sqlite3, Node 18+.
- **Deploy target:** Azure App Service Windows, iisnode entrypoint at `backend/server.js`, persistent SQLite at `/home/data/content.db`.
- **Routes to SSR:** `/`, `/free-trial`, `/help`, `/privacy-policy`, `/terms-and-conditions`.
- **Routes that stay client-only:** `/admin/*`.
- **Routes that stay as-is:** `/api/*`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt`.

## Architecture

Single Express process. Vike (Vite SSR framework) is mounted as Express middleware. Request flow:

```
Request → Express
           │
           ├── /api/*                          → existing routes (auth, content, contact, …) unchanged
           ├── /llms.txt /llms-full.txt
           │   /sitemap.xml /robots.txt        → existing seo.js routes unchanged
           │
           ├── /admin/*                        → serve dist/index.html (current SPA shell behaviour)
           │
           └── everything else                 → Vike SSR middleware
                                                    ↓
                                                +data.ts loader runs on server (SQLite)
                                                    ↓
                                                renderToString(<App data />) with AntD style extract
                                                    ↓
                                                full HTML with hydration data + extracted CSS in <head>
                                                    ↓
                                                client receives populated DOM → hydrateRoot
```

### Why Vike

- Drop-in over the existing Vite project — keeps every config, plugin, alias, AntD setup.
- Framework-agnostic enough to coexist with react-router-dom (we use Vike's filesystem routes for the public pages; the admin SPA keeps its own internal Router).
- Mounts as Express middleware — fits the existing single-process iisnode deploy without restructuring.
- Mature TypeScript support, well-defined per-page `+data.ts` / `+Page.tsx` / `+Head.tsx` files.
- Smaller surface area than Next.js for this scope.

## File structure

### New files

```
src/
├── pages/
│   ├── +config.ts                        Vike global config (clientRouting: true, hydrationCanBeAborted)
│   ├── +Layout.tsx                       Top-level shell: <ConfigProvider> (AntD theme),
│   │                                     <AppHeader>, <Outlet>, <AppFooter>, <HelpChatWidget>
│   ├── +onRenderHtml.tsx                 Server entry. renderToString with AntD <StyleProvider>
│   │                                     and extractStyle() injection into <head>.
│   ├── +onRenderClient.tsx               Client entry. hydrateRoot.
│   ├── +Head.tsx                         Per-app default head metadata (title, OG, canonical, schema.org JSON-LD)
│   │
│   ├── index/
│   │   ├── +Page.tsx                     Composes the existing section components for the home page
│   │   └── +data.ts                      Calls loadAllSections() server-side, returns typed data
│   │
│   ├── free-trial/
│   │   ├── +Page.tsx                     Wraps current FreeTrial.tsx body
│   │   └── +data.ts                      Loads any free-trial-specific CMS slices
│   │
│   ├── help/
│   │   ├── +Page.tsx                     Wraps current HelpCentre.tsx body
│   │   └── +data.ts                      Calls loadHelpArticles() server-side
│   │
│   ├── privacy-policy/
│   │   ├── +Page.tsx                     Wraps current PrivacyPolicy.tsx body
│   │   └── +data.ts                      Loads the privacy-policy content slice
│   │
│   └── terms-and-conditions/
│       ├── +Page.tsx                     Wraps current TermsAndConditions.tsx body
│       └── +data.ts                      Loads the terms-and-conditions content slice
│
└── ssr/
    └── client-only.tsx                   <ClientOnly> wrapper for HelpChatWidget, gtag, scroll observers
```

```
backend/
├── ssr/
│   └── data-providers.js                 Thin re-exports of loadAllSections, loadHelpArticles, etc.,
│                                         so frontend +data.ts files import from one place
│                                         and have no direct dependency on Express modules.
```

### Modified files

- `backend/server.js` — mount Vike middleware before the catch-all; remove the `buildSeoBodyHtml` injection branch from `app.get('*')`; keep the `/admin/*` static-shell behaviour by serving the Vite-built admin shell directly.
- `src/App.tsx` — strip the surrounding `<BrowserRouter><Routes>...</Routes></BrowserRouter>` (those now live in Vike pages). What remains is the home-page section composition.
- `src/main.tsx` — deleted or reduced to a no-op; Vike's `+onRenderClient.tsx` is the new client entry.
- `src/hooks/useSections.ts` — kept only if any client-only widget still needs it; section components now receive their data as props from the page-level `+data.ts`. Likely unused after migration; deleted if so.
- `index.html` — replaced by Vike's HTML template via `+onRenderHtml.tsx` (or kept as a minimal base depending on Vike version). Head content moves into `+Head.tsx`. The exact shape is settled during implementation, not design.
- `vite.config.ts` — add the `vike/plugin` import + plugin entry. Keep all existing config (aliases, React plugin).
- `package.json` — add `vike`. Build command per Vike's documented integration with Vite is `vite build` (Vike registers itself as a plugin); confirmed during the implementation's first build step.
- `tsconfig.app.json` — include the new `src/pages/` tree.

### Deleted files (after migration is green)

- The body-injection path in `backend/server.js` (the bot UA branch of the catch-all).
- `backend/lib/bot-ua.js` and `backend/lib/bot-ua.test.js` — no longer called from anywhere. Removed in the same PR.

### Untouched files

- All `backend/routes/*.js` except `server.js`.
- All `backend/middleware/*.js`, `backend/config/database.js`, `backend/scripts/*`.
- All AntD/SCSS/CSS files.
- All section components under `src/components/` — only their props shape changes (receive data via props), not their visual output.
- `staticwebapp.config.json`, `web.config`, `startup.sh`, `dev.sh`.
- `.github/workflows/azure-deploy.yml` — same build artefact (dist + backend), same deploy command.

## Data flow

### Server side, per request to a public route (example: `GET /help`)

1. iisnode dispatches to `backend/server.js`.
2. Express middleware chain runs (CORS, body parsers, /api routes don't match, /admin doesn't match, /llms.txt etc. don't match).
3. Vike middleware matches `pages/help/+Page.tsx`.
4. Vike calls `pages/help/+data.ts`. That function calls `loadHelpArticles()` from `backend/ssr/data-providers.js` (which re-exports from `backend/routes/seo.js`). Returns a typed payload.
5. Vike calls `pages/+onRenderHtml.tsx`. The renderer:
   - Wraps the React tree in AntD's `<StyleProvider cache={cache}>`.
   - Calls `renderToString(<PageShell data={data}/>)`.
   - Calls `extractStyle(cache, true)` to get the AntD CSS.
   - Emits HTML with:
     - `<head>` containing meta tags, OG, canonical, JSON-LD (Organization, SoftwareApplication, WebSite, FAQPage), and the extracted AntD CSS.
     - `<body><div id="root">${appHtml}</div>`
     - A `<script>` block carrying `data` as JSON for client hydration.
     - A Vite client bundle `<script type="module">` tag.
6. Express returns 200 with `Content-Type: text/html; charset=utf-8`, `Cache-Control: no-store` (live data; we re-render every request).

### Client side

1. Browser parses HTML, paints content immediately (no blank `#root` ever).
2. Vite client bundle loads.
3. `+onRenderClient.tsx` runs `hydrateRoot(rootEl, <PageShell data={initialData}/>)`. React attaches event listeners to the existing DOM. No node swap.
4. `useEffect`-bound client behaviours mount: `IntersectionObserver` reveal animations, `HelpChatWidget`, `usePageTracking` (gtag), scroll-to-hash.
5. Client-side navigation to another Vike route runs the target page's `+data.ts` via a `fetch` against Vike's data endpoint, then renders the new page client-side. (Vike's `clientRouting: true`.)

### Admin route (`/admin/*`)

1. iisnode → Express → matches `/admin/*` rule before Vike middleware.
2. Express sends `dist/index.html` (or whatever the admin build produces). Same as today.
3. Admin SPA boots, its internal Router takes over.

### API routes, SEO discovery routes, static assets

Unchanged from today.

## Error handling

| Failure mode | Behaviour |
|---|---|
| `+data.ts` throws | Vike's error handling catches it, returns a 500 with an error page; we install a custom `+onRenderHtml` error path that renders a minimal styled error page so we never serve a blank body. `console.error` writes to Azure log stream. |
| `renderToString` throws (e.g. a component crash) | Same as above — error page, log, 500. |
| Hydration mismatch on client | React logs a warning and re-renders client-side. We treat any mismatch as a bug to fix during dev. Known mismatch sources are guarded: any `Date.now()`/random call in render is removed; any `typeof window` check is moved to `useEffect`. |
| DB read fails inside `+data.ts` | The data provider returns a documented empty shape (mirrors today's `useSections` catch path). Page renders with empty section content rather than a 500. |
| Vike middleware crash / unhandled | Express error handler catches, returns 500 with a minimal HTML page. Already in place. |
| `/admin/*` after migration | Unaffected — different route handler. |

## AntD SSR specifics

AntD 5 uses CSS-in-JS (`@ant-design/cssinjs`). Without SSR handling, server-rendered pages have no styles on first paint and the FOUC returns. Recipe (per AntD docs):

```tsx
// pages/+onRenderHtml.tsx
import { createCache, StyleProvider, extractStyle } from '@ant-design/cssinjs';

const cache = createCache();
const appHtml = renderToString(
  <StyleProvider cache={cache}>
    <PageShell data={data}/>
  </StyleProvider>,
);
const styleText = extractStyle(cache, true); // strips inner duplicates
// inject styleText into <head>
```

This is a well-trodden pattern. The plan covers verifying it in the local smoke before deploy.

## Client-only behaviours

These cannot run server-side. They are wrapped in a `<ClientOnly>` helper or moved to `useEffect`:

- `IntersectionObserver` reveal-on-scroll (currently in `App.tsx`).
- `HelpChatWidget` (uses `window`, sockets/fetch to /api).
- `usePageTracking` (gtag).
- Scroll-to-hash on initial load (currently in `App.tsx`).

`<ClientOnly>` returns `null` during SSR and renders its children on the client after mount. Used sparingly — most section components can render purely from props on the server.

## Testing

### Unit

- Existing `backend/` tests (`bot-ua.test.js`) are removed along with the helper.
- New: `backend/ssr/data-providers.test.js` — confirms each re-export returns the documented shape. `node --test`-based, no new deps.

### Integration smoke (local)

A bash script `backend/scripts/smoke-ssr.sh` that:

1. Builds the frontend (`npm run build`).
2. Boots the server in prod mode in the background.
3. For each of `/`, `/free-trial`, `/help`, `/privacy-policy`, `/terms-and-conditions`:
   - Asserts response contains the hero `<h1>` text for the home page, or the page's known heading for sub-pages.
   - Asserts response does NOT contain `<div id="root"></div>` (empty).
   - Asserts response contains `<script type="application/ld+json">`.
4. For `/admin`: asserts response is the SPA shell (empty `#root` is correct here).
5. For `/api/health`: 200.
6. For `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt`: 200.
7. Kills the server.
8. Non-zero exit on any assertion failure.

This script is the gate before the production push.

### Manual

- Open each public route in a browser, hard-refresh three times. Confirm no flash on any.
- View-source on `/` — confirm full HTML, hero text, JSON-LD in head.
- DevTools → Disable JavaScript → reload — confirm the page still renders fully (the new acid test).
- Resize, navigate via in-page links (hash anchors), confirm client routing works.

### Production smoke (post-deploy)

Same curl-based assertions as the local smoke, against `https://antsa.ai`. Pasted into the PR before merging the next change.

## Deploy & cutover

- **Branch:** `feature/ssr-vike`.
- **PR:** single PR, all migration in one go (frontend pages + backend wiring + dead-code removal).
- **Pipeline:** existing `.github/workflows/azure-deploy.yml` builds and deploys on push to `main`. No pipeline changes required (build artefact shape is the same — `dist/` plus `backend/`).
- **Cutover:** merge to main → Action runs → Azure App Service deploys → ~2 min later, prod is on SSR. Run the production smoke script. Eyeball each route in a browser.
- **Rollback:** revert the merge commit and push. Azure Action redeploys the previous build. SQLite content is untouched.
- **Dead code:** the bot-UA helper and the `buildSeoBodyHtml` injection path are removed in the same PR. Search-result confidence: those exports are only referenced from `backend/server.js`.

## Open questions resolved during brainstorming

1. **Freshness model** → True SSR (per-request render). ISR / SSG rejected.
2. **Framework** → Vike on top of the existing Vite project. Next.js / Astro rejected (too much churn for too little marginal benefit, AntD friction with RSC).
3. **Scope** → SSR the 5 public routes only. `/admin/*` stays a client-rendered SPA.
4. **Ops complexity** → Single Express process, single deploy target, no new infrastructure (no CDN, no separate render server, no edge).

## Risks

| Risk | Mitigation |
|---|---|
| AntD CSS-in-JS SSR is fiddly; missing it = FOUC returns | Local smoke explicitly checks for inline `<style>` in the served HTML and the manual no-JS test confirms styled rendering. |
| Hydration mismatches from client-only effects | All `window`-touching code moved to `useEffect` or `<ClientOnly>`; React's hydration warnings treated as build-blockers during dev. |
| Vike + react-router-dom coexistence (admin keeps Router, Vike owns public routing) | The admin route is matched at Express level before Vike sees it; Vike never touches `/admin/*`. The two routers don't share state. |
| `+data.ts` server import accidentally bundling SQLite / Express into client code | `data-providers.js` is the boundary. Vike treats `+data.ts` as server-only. Vite's SSR-only import semantics enforce this at build time; any leak shows up as a build error. |
| Deploy slot churn — Azure cold start after deploy | Existing behaviour, no change. SSR cold start is comparable to current shell-then-mount cold start. |
| Single big-bang PR is harder to review | Acceptable given the scope is well-defined and the production smoke catches any regression before merge. The plan keeps tasks small even if the merge is unified. |

## Success criteria

1. `curl https://antsa.ai/` (no UA) returns HTML containing the hero `<h1>` text and section content. `<div id="root">` is non-empty.
2. Same for `/free-trial`, `/help`, `/privacy-policy`, `/terms-and-conditions`.
3. Hard-refresh in a browser shows no flash on any public route.
4. Disabling JavaScript and reloading still renders the full page.
5. `/admin/*` continues to work (login, save, navigate).
6. `/api/*`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt` continue to return 200 with their expected payloads.
7. The bot-UA injection code is gone from `backend/server.js`; `backend/lib/bot-ua.js` is deleted.
