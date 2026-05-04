import { useEffect, useState } from 'react';
import { Typography, Button, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface HeroContent {
  badge?: string;
  title?: string;
  title_highlights?: string | string[];
  description?: string;
  cta_primary?: string;
  cta_primary_url?: string;
  cta_secondary?: string;
  cta_secondary_url?: string;
  hero_desktop_image?: string;
  hero_mobile_image?: string;
}

const HighlightedText = ({ text, highlights }: { text: string; highlights: string[] }) => {
  if (!highlights?.length) return <>{text}</>;
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => {
        const isHighlight = highlights.some((h) => h.toLowerCase() === part.toLowerCase());
        if (isHighlight) {
          return (
            <span key={i} style={{ color: '#48abe2' }}>
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

/**
 * Hero — split layout matching practitioner landing mock (text left, product visuals right).
 */
const HeroSplit = () => {
  const [content, setContent] = useState<HeroContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/hero')
      .then((res) => res.json())
      .then((data) => {
        if (data.content) setContent(data.content);
      })
      .catch((err) => console.error('Failed to load hero content:', err))
      .finally(() => setLoading(false));
  }, []);

  const titleText =
    content.title ||
    'Support clients between sessions. Reduce admin. One system built for practitioners.';
  let titleHighlights: string[] = ['Reduce admin.'];
  try {
    if (content.title_highlights) {
      titleHighlights =
        typeof content.title_highlights === 'string'
          ? JSON.parse(content.title_highlights)
          : (content.title_highlights as string[]);
    }
  } catch {
    titleHighlights = ['Reduce admin.'];
  }
  const descriptionRaw =
    content.description ||
    'ANTSA combines client engagement tools, AI documentation, telehealth, reminders, questionnaires and practitioner-visible AI support in one secure Australian system.';
  const badge =
    content.badge || 'BUILT BY CLINICIANS. TRUSTED BY PRACTITIONERS';
  const ctaPrimary = content.cta_primary || 'Start Free Trial';
  const ctaPrimaryUrl = content.cta_primary_url || '/free-trial';
  const ctaSecondary = content.cta_secondary || 'Book a Demo';
  const ctaSecondaryUrl =
    content.cta_secondary_url ||
    'mailto:admin@antsa.com.au?subject=Book%20a%20Demo%20-%20ANTSA';
  const desktopImg = content.hero_desktop_image || '/landing/hero-dashboard.svg';
  const mobileImg = content.hero_mobile_image || '/landing/hero-phone.svg';

  if (loading) return null;

  return (
    <section
      id="hero"
      style={{
        padding: '120px 20px 48px',
        background: '#ffffff',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        <div>
          <div className="reveal" style={{ marginBottom: 8 }}>
            <span className="landing-eyebrow">{badge}</span>
          </div>
          <Title
            level={1}
            className="reveal"
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginTop: 16,
              marginBottom: 20,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            <HighlightedText text={titleText} highlights={titleHighlights} />
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: 'clamp(16px, 2vw, 18px)',
              color: '#475569',
              marginBottom: 28,
              lineHeight: 1.7,
              maxWidth: '560px',
            }}
          >
            {descriptionRaw}
          </Paragraph>
          <Space className="reveal" size="middle" wrap>
            <Button
              type="primary"
              size="large"
              href={ctaPrimaryUrl}
              style={{
                height: 52,
                padding: '0 28px',
                fontWeight: 700,
                background: '#48abe2',
                borderColor: '#48abe2',
              }}
            >
              {ctaPrimary}
            </Button>
            <Button
              size="large"
              icon={<CalendarOutlined />}
              href={ctaSecondaryUrl}
              style={{
                height: 52,
                padding: '0 24px',
                fontWeight: 600,
                borderColor: '#48abe2',
                color: '#48abe2',
              }}
            >
              {ctaSecondary}
            </Button>
          </Space>
        </div>

        <div className="reveal" style={{ position: 'relative', minHeight: 320 }}>
          <img
            src={desktopImg}
            alt="Mockup of the ANTSA practitioner dashboard showing client activity and summary statistics"
            style={{
              width: '100%',
              maxWidth: 560,
              height: 'auto',
              borderRadius: 12,
              boxShadow: '0 24px 48px rgba(15, 23, 42, 0.12)',
              border: '1px solid #e2e8f0',
            }}
          />
          <img
            src={mobileImg}
            alt="ANTSA client app interface showing daily check-in and tasks"
            style={{
              position: 'absolute',
              right: 0,
              bottom: -24,
              width: 'min(38%, 200px)',
              height: 'auto',
              borderRadius: 24,
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
              border: '4px solid #fff',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSplit;
