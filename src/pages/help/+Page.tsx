import HelpBody from '../../pages-legacy/HelpCentre';
import AntdProvider from '../../components/AntdProvider';
import type { HelpData } from './+data';

export default function Page(props: HelpData) {
  return (
    <AntdProvider>
      <HelpBody categories={props.categories} />
    </AntdProvider>
  );
}
