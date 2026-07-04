import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';

/**
 * AntD theme provider — used ONLY by the legacy content pages (/free-trial,
 * /help, /privacy-policy, /terms-and-conditions) so AntD + its theme code-split
 * into those route chunks. The marketing homepage no longer imports AntD, which
 * keeps ~530 KB off the critical path (Core Web Vitals / INP).
 */
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
    fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontSize: 16,
    lineHeight: 1.6,
  },
  components: {
    Layout: { headerBg: '#ffffff', bodyBg: '#ffffff' },
    Card: { borderRadiusLG: 12 },
    Button: { borderRadius: 8, controlHeight: 44, fontWeight: 600 },
  },
};

export default function AntdProvider({ children }: { children: ReactNode }) {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
