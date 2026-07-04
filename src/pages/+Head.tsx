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
        'Clinician-governed digital mental health platform supporting the whole therapy journey — AI Scribe, telehealth, homework, mood tracking, secure messaging and optional clinician-governed AI support.',
      areaServed: ['AU', 'US', 'GB'],
      sameAs: [
        'https://www.linkedin.com/company/antsa-mentalhealth/',
        'https://www.instagram.com/antsa.app/',
        'https://www.facebook.com/ANTSAforProfessionals',
      ],
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
    { '@type': 'WebSite', url: 'https://antsa.ai/', name: 'ANTSA', publisher: { '@id': 'https://antsa.ai/#organization' } },
  ],
};

export default function Head() {
  // NOTE: page-specific tags (title, description, canonical, og:title/description/url,
  // twitter:title/description) are intentionally NOT emitted here — Vike's Head is
  // cumulative, so each page's own +Head (via PageHead) provides them to avoid
  // duplicate/conflicting tags on sub-pages. Only truly-global brand/analytics tags live here.
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" href="/favicon.svg" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <meta name="theme-color" content="#48abe2" />
      <meta name="author" content="ANTSA Pty Ltd" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ANTSA" />
      <meta property="og:image" content="https://antsa.ai/LOGO-BLACK.png" />
      <meta property="og:locale" content="en_AU" />
      <meta name="twitter:card" content="summary_large_image" />
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
