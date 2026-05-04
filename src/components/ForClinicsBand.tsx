import { useEffect, useState } from 'react';
import { Typography, Button, Row, Col } from 'antd';
import { BankOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ForClinicsBand = () => {
  const [title, setTitle] = useState('For Clinics & Enterprises');
  const [subtitle, setSubtitle] = useState(
    'Need multi-practitioner access, reporting, integrations or enterprise rollout? ANTSA scales with your organisation.',
  );
  const [checklist, setChecklist] = useState<string[]>([
    'Role-based access',
    'Advanced reporting',
    'Integrations & API access',
    'Dedicated onboarding',
  ]);
  const [ctaLabel, setCtaLabel] = useState('Talk to Us');
  const [ctaHref, setCtaHref] = useState(
    'mailto:admin@antsa.com.au?subject=Enterprise%20ANTSA',
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/for_clinics')
      .then((res) => res.json())
      .then((data) => {
        const c = data.content || {};
        if (c.title) setTitle(c.title);
        if (c.subtitle) setSubtitle(c.subtitle);
        if (c.cta_label) setCtaLabel(c.cta_label);
        if (c.cta_href) setCtaHref(c.cta_href);
        if (Array.isArray(c.checklist)) setChecklist(c.checklist);
        else if (typeof c.checklist === 'string') {
          try {
            const p = JSON.parse(c.checklist);
            if (Array.isArray(p)) setChecklist(p);
          } catch {
            /* ignore */
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section id="for-clinics" style={{ padding: '56px 20px', background: '#e8f4fc' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} md={8}>
            <BankOutlined style={{ fontSize: 40, color: '#48abe2' }} aria-hidden />
            <Title level={3} style={{ color: '#0f172a', marginTop: 16, marginBottom: 12 }}>
              {title}
            </Title>
            <Paragraph style={{ color: '#475569', marginBottom: 0, fontSize: 15 }}>{subtitle}</Paragraph>
          </Col>
          <Col xs={24} md={10}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {checklist.map((line, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    marginBottom: 12,
                    color: '#0f172a',
                    fontWeight: 500,
                  }}
                >
                  <CheckOutlined style={{ color: '#48abe2', marginTop: 4 }} aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <Button type="default" size="large" href={ctaHref} style={{ borderColor: '#48abe2', color: '#48abe2', fontWeight: 600 }}>
              {ctaLabel}
            </Button>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default ForClinicsBand;
