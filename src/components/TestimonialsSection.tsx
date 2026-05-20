import { useState, useEffect } from 'react';
import { Typography, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

const API_BASE_URL = '/api';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [badge, setBadge] = useState('TRUSTED BY PRACTITIONERS');
  const [sectionTitle, setSectionTitle] = useState('Trusted by practitioners');
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/section/testimonials`);
        const data = await response.json();
        if (ignore || !response.ok) return;
        if (data.content?.badge) setBadge(data.content.badge);
        if (data.content?.title) setSectionTitle(data.content.title);
        if (data.content?.items?.length) {
          setTestimonials(data.content.items);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: '#94a3b8' }}>
        Loading…
      </div>
    );
  }

  if (testimonials.length === 0) return null;

  const t = testimonials[Math.min(index, testimonials.length - 1)];

  return (
    <section
      id="testimonials"
      style={{
        padding: '80px 20px 100px',
        background: '#ffffff',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div className="landing-eyebrow reveal">{badge}</div>
        <Typography.Title
          level={2}
          className="reveal"
          style={{
            color: '#0f172a',
            fontWeight: 800,
            fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
            marginTop: 12,
            marginBottom: 40,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {sectionTitle}
        </Typography.Title>

        <figure className="reveal" style={{ margin: 0, padding: '0 12px' }}>
          <blockquote
            style={{
              fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)',
              lineHeight: 1.6,
              color: '#334155',
              fontStyle: 'italic',
              margin: '0 0 24px',
            }}
          >
            <Paragraph style={{ margin: 0, color: 'inherit' }}>&ldquo;{t.content}&rdquo;</Paragraph>
          </blockquote>
          <figcaption>
            <Text strong style={{ color: '#0f172a', fontSize: 16 }}>
              — {t.name}
              {t.role ? `, ${t.role}` : ''}
            </Text>
          </figcaption>
        </figure>

        {testimonials.length > 1 ? (
          <div
            style={{
              marginTop: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
            }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              aria-label="Previous testimonial"
            />
            <div style={{ display: 'flex', gap: 6 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    border: 'none',
                    padding: 0,
                    background: i === index ? '#48abe2' : '#cbd5e1',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
            <Button
              type="text"
              shape="circle"
              icon={<RightOutlined />}
              onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
              aria-label="Next testimonial"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default TestimonialsSection;
