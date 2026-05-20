import { ConfigProvider, Layout as AntLayout } from 'antd';
import type { ReactNode } from 'react';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import HelpChatWidget from '../components/HelpChatWidget';
import ClientOnly from '../ssr/ClientOnly';

const { Content } = AntLayout;

const theme = {
  token: {
    colorPrimary: '#48abe2',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#48abe2',
    colorTextBase: '#0f172a',
    colorBgBase: '#ffffff',
    borderRadius: 10,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 16,
    lineHeight: 1.6,
  },
  components: {
    Layout: { headerBg: '#ffffff', bodyBg: '#ffffff' },
    Card: { borderRadiusLG: 12 },
    Button: { borderRadius: 8, controlHeight: 44, fontWeight: 600 },
  },
};

export default function Layout({ children }: { pageContext: unknown; children: ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      <AntLayout style={{ minHeight: '100vh', background: '#ffffff' }}>
        <AppHeader />
        <Content style={{ marginTop: '70px' }}>{children}</Content>
        <AppFooter />
        <ClientOnly>
          <HelpChatWidget />
        </ClientOnly>
      </AntLayout>
    </ConfigProvider>
  );
}
