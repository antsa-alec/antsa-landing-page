import type { ReactNode } from 'react';

/**
 * Per-page head tags. The global `+Head.tsx` deliberately emits NO
 * title/description/canonical/og:url so that Vike's cumulative Head doesn't ship
 * duplicate/conflicting tags on sub-pages. Each page's `+Head` renders this with
 * its own values (+ any page-specific JSON-LD as children).
 */
const ORIGIN = 'https://antsa.ai';

export function PageHead({
  title,
  description,
  path,
  children,
}: {
  title: string;
  description: string;
  path: string;
  children?: ReactNode;
}) {
  const url = `${ORIGIN}${path}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {children}
    </>
  );
}
