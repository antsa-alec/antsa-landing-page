import type { ReactNode } from 'react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import HelpChatWidget from '../components/HelpChatWidget';
import ClientOnly from '../ssr/ClientOnly';
import type { ChromeData } from './chrome-data';

/**
 * Global chrome. Deliberately AntD-free so the marketing homepage doesn't ship
 * AntD (~530 KB) — the legacy content pages wrap themselves in AntdProvider
 * instead (colocated to their own route chunks).
 */
type LayoutPageContext = {
  data?: { chrome?: ChromeData };
  urlPathname?: string;
};

export default function Layout({
  pageContext,
  children,
}: {
  pageContext: unknown;
  children: ReactNode;
}) {
  const ctx = (pageContext ?? {}) as LayoutPageContext;
  const chrome = ctx.data?.chrome;
  const urlPathname = ctx.urlPathname ?? '/';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      <AppHeader chrome={chrome} urlPathname={urlPathname} />
      <main style={{ marginTop: 65, flex: 1 }}>{children}</main>
      <AppFooter chrome={chrome} />
      <ClientOnly>
        <HelpChatWidget />
      </ClientOnly>
    </div>
  );
}
