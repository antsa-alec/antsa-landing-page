import PrivacyPolicyBody from '../../pages-legacy/PrivacyPolicy';
import AntdProvider from '../../components/AntdProvider';
import type { PrivacyData } from './+data';

export default function Page(props: PrivacyData) {
  return (
    <AntdProvider>
      <PrivacyPolicyBody page={props.page} />
    </AntdProvider>
  );
}
