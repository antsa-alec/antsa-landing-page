import HelpBody from '../../pages-legacy/HelpCentre';
import type { HelpData } from './+data';

export default function Page(props: HelpData) {
  return <HelpBody categories={props.categories} />;
}
