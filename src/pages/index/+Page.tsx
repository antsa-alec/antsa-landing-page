import App from '../../App';
import type { HomeData } from './+data';

export default function Page(props: HomeData) {
  return <App sections={props.sections ?? []} />;
}
