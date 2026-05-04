import { useEffect, useState } from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

interface Tile {
  id?: number;
  title: string;
  description: string;
  image_url?: string | null;
}

/**
 * Fallback tiles — real product PNGs captured via the Playwright harness.
 * Live values come from CMS (`feature_items` for `everything_one_login`).
 */
const DEFAULT_TILES: Tile[] = [
  {
    title: 'Practitioner dashboard',
    description: 'See clients, sessions, messages, and tasks at a glance.',
    image_url: '/landing/dashboard.png',
  },
  {
    title: 'Client records',
    description: 'Structured engagement and clinical context in one place.',
    image_url: '/landing/clients-list.png',
  },
  {
    title: 'Telehealth',
    description: 'Schedule and run secure video sessions from your calendar.',
    image_url: '/landing/calendar.png',
  },
  {
    title: 'AI scribe & notes',
    description: 'Reusable templates and AI summaries for faster documentation.',
    image_url: '/landing/templates.png',
  },
  {
    title: 'Client overview',
    description: 'Mood, tasks, sessions, and snapshot at a glance.',
    image_url: '/landing/client-detail-overview.png',
  },
];

const EverythingOneLoginSection = () => {
  const [badge, setBadge] = useState('EVERYTHING IN ONE LOGIN');
  const [title, setTitle] = useState('Your whole practice stack, unified');
  const [subtitle, setSubtitle] = useState('');
  const [items, setItems] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/everything_one_login')
      .then((res) => res.json())
      .then((data) => {
        const c = data.content || {};
        if (c.badge) setBadge(c.badge);
        if (c.title) setTitle(c.title);
        if (c.subtitle) setSubtitle(c.subtitle);
        const list = data.content?.items || [];
        if (Array.isArray(list) && list.length) setItems(list);
        else setItems(DEFAULT_TILES);
      })
      .catch(() => setItems(DEFAULT_TILES))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section id="everything-one-login" style={{ padding: '72px 20px', background: '#ffffff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 0 }}>
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
            marginBottom: subtitle ? 12 : 36,
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
          {items.map((item, idx) => (
            <div key={item.id ?? idx} style={{ flex: '1 1 180px', maxWidth: 280, minWidth: 160 }}>
              <Card
                className="reveal"
                bordered={false}
                cover={
                  item.image_url ? (
                    <div
                      style={{
                        aspectRatio: '16 / 10',
                        background: '#f8fafc',
                        overflow: 'hidden',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <img
                        alt={`${item.title} — ${item.description}`}
                        src={item.image_url}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top left',
                          display: 'block',
                        }}
                      />
                    </div>
                  ) : null
                }
                bodyStyle={{ padding: 18 }}
                style={{
                  borderRadius: 14,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  height: '100%',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                }}
              >
                <Title level={5} style={{ marginTop: 0, color: '#0f172a', fontSize: 15 }}>
                  {item.title}
                </Title>
                <Paragraph style={{ color: '#64748b', marginBottom: 0, fontSize: 13 }}>
                  {item.description}
                </Paragraph>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EverythingOneLoginSection;
