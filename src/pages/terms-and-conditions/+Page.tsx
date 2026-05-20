import TermsBody from '../../pages-legacy/TermsAndConditions';
import type { TermsData } from './+data';

export default function Page(props: TermsData) {
  return <TermsBody page={props.page} />;
}
