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
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
  );
}
