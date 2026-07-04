import TermsBody from '../../pages-legacy/TermsAndConditions';
import AntdProvider from '../../components/AntdProvider';
import type { TermsData } from './+data';

export default function Page(props: TermsData) {
  return (
    <AntdProvider>
      <TermsBody page={props.page} />
    </AntdProvider>
  );
}
