import type { HomeData } from './+data';
import { PageHead } from '../pageHead';

const TITLE = 'ANTSA — Clinician-governed mental health platform for between-session care';
const DESCRIPTION =
  'ANTSA is a secure Australian mental health platform that keeps clinicians at the centre of care — AI Scribe, telehealth, homework, mood tracking, secure messaging and clinician-governed AI support, in one place.';

export default function Head({ data }: { data: HomeData }) {
  const allFaqs: Array<{ q: string; a: string }> = [];
  for (const s of data?.sections ?? []) {
    for (const f of (s.faqs as Array<{ question: string; answer: string }> | undefined) ?? []) {
      const q = String(f.question ?? '').trim();
      const a = String(f.answer ?? '').trim();
      if (q && a) allFaqs.push({ q, a });
    }
  }
  const faqLd = allFaqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allFaqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    : null;

  return (
    <PageHead title={TITLE} description={DESCRIPTION} path="/">
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
    </PageHead>
  );
}
