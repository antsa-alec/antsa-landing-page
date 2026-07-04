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
  return (
    <>
      <title>ANTSA — Clinician-governed mental health platform for between-session care</title>
      <meta
        name="description"
        content="ANTSA is a secure Australian mental health platform that keeps clinicians at the centre of care — AI Scribe, telehealth, homework, mood tracking, secure messaging and clinician-governed AI support, in one place."
      />
      <link rel="canonical" href="https://antsa.ai/" />
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
      <meta name="keywords" content="mental health platform, AI scribe, telehealth, clinician-governed AI, between-session care, psychology software, Australia" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ANTSA" />
      <meta property="og:title" content="ANTSA — Mental health care belongs in clinician hands" />
      <meta
        property="og:description"
        content="A secure Australian platform that helps clinicians reduce admin, support clients between sessions, and keep clinical oversight — with optional clinician-governed AI."
      />
      <meta property="og:url" content="https://antsa.ai/" />
      <meta property="og:image" content="https://antsa.ai/LOGO-BLACK.png" />
      <meta property="og:locale" content="en_AU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="ANTSA — Mental health care belongs in clinician hands" />
      <meta
        name="twitter:description"
        content="A secure Australian platform for clinician-governed, between-session mental health care."
      />
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
