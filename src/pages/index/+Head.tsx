import type { HomeData } from './+data';
import { PageHead } from '../pageHead';
import FAQStructuredData from '../../components/FAQStructuredData';

const TITLE = 'ANTSA — Clinician-governed mental health platform for between-session care';
const DESCRIPTION =
  'ANTSA is a secure Australian mental health platform that keeps clinicians at the centre of care — AI Scribe, telehealth, homework, mood tracking, secure messaging and clinician-governed AI support, in one place.';

export default function Head({ data }: { data: HomeData }) {
  const section = data?.sections?.find((section) => section.name === 'faq');

  return (
    <PageHead title={TITLE} description={DESCRIPTION} path="/">
      {section && <FAQStructuredData section={section} preview />}
    </PageHead>
  );
}
