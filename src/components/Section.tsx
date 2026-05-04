import type { ReactNode } from 'react';
import { useSections } from '../hooks/useSections';

/**
 * Section gate — renders children only if the named CMS section is enabled.
 * Must be used to wrap every top-level section so admins can hide entire
 * sections via the Sections panel without redeploying.
 */
const Section = ({ name, children }: { name: string; children: ReactNode }) => {
  const { isVisible } = useSections();
  if (!isVisible(name)) return null;
  return <>{children}</>;
};

export default Section;
