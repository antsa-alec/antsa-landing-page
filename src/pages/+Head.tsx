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
    { '@type': 'WebSite', url: 'https://antsa.ai/', name: 'ANTSA', publisher: { '@id': 'https://antsa.ai/#organization' } },
  ],
};

export default function Head() {
  return (
    <>
      <title>ANTSA — Support clients between sessions. Reduce admin.</title>
      <meta
        name="description"
        content="Support clients between sessions. Reduce admin. One system built for practitioners — client engagement, AI documentation, telehealth, reminders, questionnaires and practitioner-visible AI support in one secure Australian system."
      />
      <link rel="canonical" href="https://antsa.ai/" />
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <meta name="theme-color" content="#48abe2" />
      <meta name="author" content="ANTSA Pty Ltd" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ANTSA" />
      <meta property="og:title" content="ANTSA — Support clients between sessions. Reduce admin." />
      <meta
        property="og:description"
        content="One system for practitioners: engagement tools, AI documentation, telehealth, reminders and AI support — Australian hosted."
      />
      <meta property="og:url" content="https://antsa.ai/" />
      <meta property="og:image" content="https://antsa.ai/LOGO-BLACK.png" />
      <meta property="og:locale" content="en_AU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="ANTSA — Support clients between sessions. Reduce admin." />
      <meta
        name="twitter:description"
        content="One system for practitioners: engagement, AI notes, telehealth, reminders — Australian hosted."
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
