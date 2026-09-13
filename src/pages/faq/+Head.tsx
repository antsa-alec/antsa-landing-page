import FAQStructuredData from '../../components/FAQStructuredData';
import { getFAQContent } from '../../components/FAQSection';
import { PageHead } from '../pageHead';
import type { FAQData } from './+data';

export default function Head({ data }: { data: FAQData }) {
  const content = getFAQContent(data.section);
  return (
    <PageHead title={`${content.title} — ANTSA`} description={content.subtitle || 'Frequently asked questions about ANTSA.'} path="/faq">
      <FAQStructuredData section={data.section} />
    </PageHead>
  );
}
