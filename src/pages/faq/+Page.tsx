import FAQSection from '../../components/FAQSection';
import type { FAQData } from './+data';

export default function Page({ section }: FAQData) {
  return <FAQSection section={section} standalone />;
}
