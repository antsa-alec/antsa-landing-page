import type { ComponentType, CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Typography, Card } from 'antd';
import * as AntIcons from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Item {
  id?: number;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

const DEFAULT_WHY: Item[] = [
  {
    title: 'Less Admin',
    description:
      'AI scribe, automated session summaries, and structured templates cut documentation time so you can focus on clients.',
    icon: 'FileTextOutlined',
    color: '#48abe2',
  },
  {
    title: 'Better Client Engagement',
    description:
      'Homework, journaling, messaging, and ANTSAbot keep clients connected between sessions — all visible to you.',
    icon: 'TeamOutlined',
    color: '#10b981',
  },
  {
    title: 'Fewer Subscriptions',
    description: 'Telehealth, forms, mood tracking, and notes in one login instead of stitching tools together.',
    icon: 'AppstoreOutlined',
    color: '#8b5cf6',
  },
  {
    title: 'Stay In The Loop',
    description: 'See between-session activity, mood trends, and alerts so nothing important is missed.',
    icon: 'EyeOutlined',
    color: '#f59e0b',
  },
  {
    title: 'Secure & Compliant',
    description:
      'Australian hosting, clinical governance, and privacy-aligned design built for health professionals.',
    icon: 'SafetyOutlined',
    color: '#06b6d4',
  },
];

const WhySwitchSection = () => {
  const [badge, setBadge] = useState('WHY PRACTITIONERS SWITCH TO ANTSA');
  const [title, setTitle] = useState('Why practitioners switch');
  const [subtitle, setSubtitle] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/why_switch')
      .then((res) => res.json())
      .then((data) => {
        const c = data.content || {};
        if (c.badge) setBadge(c.badge);
        if (c.title) setTitle(c.title);
        if (c.subtitle) setSubtitle(c.subtitle);
        const list = data.content?.items || [];
        if (Array.isArray(list) && list.length) setItems(list);
        else setItems(DEFAULT_WHY);
      })
      .catch(() => {
        setItems(DEFAULT_WHY);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section
      id="why-switch"
      style={{ padding: '72px 20px', background: '#f8fafc' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="landing-eyebrow">{badge}</span>
        </div>
        <Title
          level={2}
          className="reveal"
          style={{
            textAlign: 'center',
            fontWeight: 800,
            color: '#0f172a',
            marginTop: 12,
            marginBottom: subtitle ? 12 : 32,
            fontSize: 'clamp(22px, 3vw, 32px)',
          }}
        >
          {title}
        </Title>
        {subtitle ? (
          <Paragraph
            className="reveal"
            style={{ textAlign: 'center', color: '#64748b', marginBottom: 40, fontSize: 16 }}
          >
            {subtitle}
          </Paragraph>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            justifyContent: 'center',
          }}
        >
          {items.map((item, idx) => {
            const Icon =
              (AntIcons as unknown as Record<string, ComponentType<{ style?: CSSProperties }>>)[item.icon] ||
              AntIcons.StarOutlined;
            return (
              <div
                key={item.id ?? idx}
                style={{ flex: '1 1 200px', maxWidth: 320, minWidth: 180 }}
              >
                <Card
                  className="reveal"
                  bordered={false}
                  style={{
                    height: '100%',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 2px rgba(15,23,42,0.06)',
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: item.color ? `${item.color}18` : '#e0f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Icon style={{ fontSize: 22, color: item.color || '#48abe2' }} />
                  </div>
                  <Title level={4} style={{ marginTop: 0, color: '#0f172a', fontSize: 17 }}>
                    {item.title}
                  </Title>
                  <Paragraph style={{ color: '#475569', marginBottom: 0, whiteSpace: 'pre-line' }}>
                    {item.description}
                  </Paragraph>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySwitchSection;
