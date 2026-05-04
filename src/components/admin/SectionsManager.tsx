import { useEffect, useState } from 'react';
import { Card, Switch, message, Spin, Alert, Typography, Button, Space, InputNumber } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { AuthContextType } from '../../pages/Admin';

const { Title, Paragraph, Text } = Typography;

type SectionRow = {
  name: string;
  enabled: boolean;
  order_index: number;
};

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  trust_strip: 'Trust strip',
  why_switch: 'Why Practitioners Switch',
  everything_one_login: 'Everything in One Login',
  'the-shift': 'The Shift',
  'the-antsa': 'The ANTSA',
  features: 'Features',
  team: 'Team',
  pricing: 'Pricing',
  faq: 'FAQ',
  for_clinics: 'For Clinics band',
  testimonials: 'Testimonials',
  compliance: 'Compliance badges',
  footer: 'Footer',
};

const SectionsManager = ({ auth }: { auth: AuthContextType }) => {
  const [rows, setRows] = useState<SectionRow[] | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = async () => {
    setRows(null);
    try {
      const r = await fetch('/api/content/sections-meta');
      const d = await r.json();
      setRows(d.sections ?? []);
    } catch (e: any) {
      message.error('Failed to load sections');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const patch = async (name: string, body: Partial<SectionRow>) => {
    setSavingKey(name);
    try {
      const r = await fetch(`/api/content/sections/${encodeURIComponent(name)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(await r.text());
      message.success('Saved');
    } catch (e: any) {
      message.error(`Save failed: ${e.message}`);
    } finally {
      setSavingKey(null);
      await load();
    }
  };

  if (rows === null) return <Spin />;

  return (
    <div>
      <Title level={3} style={{ marginTop: 0 }}>
        Sections
      </Title>
      <Paragraph type="secondary">
        Toggle a section off to hide it on the live homepage immediately. Reorder via the
        order column. Edits take effect on the next page load.
      </Paragraph>

      <Alert
        showIcon
        type="info"
        message="Server-side rendered (SSR) HTML respects these toggles too — disabled sections won't appear in /llms-full.txt or for crawlers."
        style={{ marginBottom: 16 }}
      />

      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ReloadOutlined />} onClick={load}>
          Refresh
        </Button>
      </Space>

      <Card bordered>
        {rows.map((s, idx) => (
          <div
            key={s.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 120px 100px',
              alignItems: 'center',
              gap: 16,
              padding: '12px 0',
              borderTop: idx === 0 ? 'none' : '1px solid #f0f0f0',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{SECTION_LABELS[s.name] ?? s.name}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {s.name}
              </Text>
            </div>
            <Text type="secondary">order</Text>
            <InputNumber
              size="small"
              min={1}
              value={s.order_index}
              onChange={(v) =>
                typeof v === 'number' && v !== s.order_index
                  ? patch(s.name, { order_index: v })
                  : undefined
              }
              disabled={savingKey === s.name}
              style={{ width: 100 }}
            />
            <Switch
              checked={s.enabled}
              loading={savingKey === s.name}
              onChange={(v) => patch(s.name, { enabled: v })}
              checkedChildren="Visible"
              unCheckedChildren="Hidden"
            />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default SectionsManager;
