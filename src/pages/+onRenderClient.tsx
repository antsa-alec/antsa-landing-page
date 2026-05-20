import { hydrateRoot, createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import type { OnRenderClientAsync } from 'vike/types';
import Layout from './+Layout';

let root: ReturnType<typeof hydrateRoot> | ReturnType<typeof createRoot> | null = null;

const onRenderClient: OnRenderClientAsync = async (pageContext) => {
  const { Page, data } = pageContext;
  if (!Page) throw new Error('No Page component provided by Vike');

  // Cast Page to a typed component — Vike types it as `{}` in 0.4.x
  const PageComponent = Page as ComponentType<Record<string, unknown>>;

  const container = document.getElementById('root');
  if (!container) throw new Error('#root not found');

  const tree = (
    <Layout pageContext={pageContext}>
      <PageComponent {...((data as Record<string, unknown>) ?? {})} />
    </Layout>
  );

  if (pageContext.isHydration) {
    root = hydrateRoot(container, tree);
  } else {
    if (!root) root = createRoot(container);
    root.render(tree);
  }
};

export default onRenderClient;
