import { useState } from 'react';
import { Typography, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

type TestimonialsProps = {
  section?: {
    content?: { badge?: string; title?: string; items?: Testimonial[] };
  };
};

const TestimonialsSection = ({ section }: TestimonialsProps) => {
  const c = section?.content ?? {};
  const badge = c.badge || 'TRUSTED BY PRACTITIONERS';
  const sectionTitle = c.title || 'Trusted by practitioners';
  const testimonials: Testimonial[] = Array.isArray(c.items) ? c.items : [];
  const [index, setIndex] = useState(0);

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
