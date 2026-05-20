import PrivacyPolicyBody from '../../pages-legacy/PrivacyPolicy';
import type { PrivacyData } from './+data';

export default function Page(props: PrivacyData) {
  return <PrivacyPolicyBody page={props.page} />;
}
