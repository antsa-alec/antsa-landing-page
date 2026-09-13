import { getFAQContent } from './FAQSection';
import type { FAQContent } from './FAQSection';

export default function FAQStructuredData({ section, preview = false }: { section?: FAQContent; preview?: boolean }) {
  const faqs = getFAQContent(section, preview).faqs.filter((faq) => faq.question && faq.answer);
  if (!faqs.length) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />;
}
