import { ConfigProvider, Layout as AntLayout } from 'antd';
import type { ReactNode } from 'react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import HelpChatWidget from '../components/HelpChatWidget';
import ClientOnly from '../ssr/ClientOnly';
import type { ChromeData } from './chrome-data';

const { Content } = AntLayout;

const theme = {
  token: {
    colorPrimary: '#48abe2',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#48abe2',
    colorTextBase: '#0f1622',
    colorBgBase: '#ffffff',
    borderRadius: 10,
    fontFamily:
      "'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontSize: 16,
    lineHeight: 1.6,
  },
  components: {
    Layout: { headerBg: '#ffffff', bodyBg: '#ffffff' },
    Card: { borderRadiusLG: 12 },
    Button: { borderRadius: 8, controlHeight: 44, fontWeight: 600 },
  },
};

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
    <ConfigProvider theme={theme}>
      <AntLayout style={{ minHeight: '100vh', background: '#ffffff' }}>
        <AppHeader chrome={chrome} urlPathname={urlPathname} />
        <Content style={{ marginTop: '65px' }}>{children}</Content>
        <AppFooter chrome={chrome} />
        <ClientOnly>
          <HelpChatWidget />
        </ClientOnly>
      </AntLayout>
    </ConfigProvider>
  );
}
