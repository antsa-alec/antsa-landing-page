import { Typography, Button, Row, Col } from 'antd';
import { BankOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

type ForClinicsProps = {
  section?: {
    content?: {
      title?: string;
      subtitle?: string;
      cta_label?: string;
      cta_href?: string;
      checklist?: string[] | string;
    };
  };
};

const ForClinicsBand = ({ section }: ForClinicsProps) => {
  const c = section?.content ?? {};
  const title = c.title || 'For Clinics & Enterprises';
  const subtitle =
    c.subtitle ||
    'Need multi-practitioner access, reporting, integrations or enterprise rollout? ANTSA scales with your organisation.';
  const ctaLabel = c.cta_label || 'Talk to Us';
  const ctaHref = c.cta_href || 'mailto:admin@antsa.com.au?subject=Enterprise%20ANTSA';
  let checklist: string[] = [
    'Role-based access',
    'Advanced reporting',
    'Integrations & API access',
    'Dedicated onboarding',
  ];
  if (Array.isArray(c.checklist)) {
    checklist = c.checklist;
  } else if (typeof c.checklist === 'string') {
    try {
      const parsed = JSON.parse(c.checklist);
      if (Array.isArray(parsed)) checklist = parsed;
    } catch {
      /* ignore */
    }
  }

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
