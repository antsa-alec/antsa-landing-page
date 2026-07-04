/**
 * Error-page head — noindex so 404/500 pages never get indexed, and a
 * self-referencing title. Page-specific tags live here (see +Head dedup note in
 * docs/seo-audit-and-uplift-2026.md); the global +Head no longer emits title/canonical.
 */
export default function Head() {
  return (
    <>
      <title>Page not found — ANTSA</title>
      <meta name="robots" content="noindex, follow" />
    </>
  );
}
