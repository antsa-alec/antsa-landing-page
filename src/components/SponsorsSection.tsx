import { useEffect, useState } from 'react';
import { Typography, Row, Col } from 'antd';

const { Title } = Typography;

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

/**
 * SPONSORS SECTION - "Sponsored by" style
 * Clean, minimalist logo display
 */
const SponsorsSection = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/sponsors')
      .then((res) => res.json())
      .then((data) => {
        if (data.sponsors) {
          // Transform to match component interface
          const transformedSponsors = data.sponsors.map((sponsor: any) => ({
            id: String(sponsor.id),
            name: sponsor.name,
            logo: sponsor.logo_url || '',
            website: sponsor.website_url || '',
          }));
          setSponsors(transformedSponsors);
        }
      })
      .catch((err) => console.error('Failed to load sponsors:', err))
      .finally(() => setLoading(false));
  }, []);

  // Default sponsors if none loaded
  const defaultSponsors: Sponsor[] = [
    { id: '1', name: 'Microsoft Azure', logo: '/logos/azure.svg', website: 'https://azure.microsoft.com' },
    { id: '2', name: 'OpenAI', logo: '/logos/openai.svg', website: 'https://openai.com' },
    { id: '3', name: 'Stripe', logo: '/logos/stripe.svg', website: 'https://stripe.com' },
    { id: '4', name: 'Firebase', logo: '/logos/firebase.svg', website: 'https://firebase.google.com' },
  ];

  const displaySponsors = sponsors.length > 0 ? sponsors : defaultSponsors;

  if (loading) {
    return null;
  }

  return (
    <section
      id="sponsors"
      style={{
        background: '#ffffff',
        padding: '80px 20px',
        borderTop: '1px solid #f1f5f9',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Section Title */}
        <Title
          level={5}
          className="reveal"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#a855f7',
            marginBottom: '48px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          Sponsored by
        </Title>

        {/* Sponsor Logos */}
        <Row
          gutter={[60, 40]}
          justify="center"
          align="middle"
          className="reveal"
        >
          {displaySponsors.map((sponsor) => (
            <Col xs={12} sm={8} md={6} key={sponsor.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '60px',
                  opacity: 0.6,
                  transition: 'all 0.3s ease',
                  cursor: sponsor.website ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.6';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onClick={() => {
                  if (sponsor.website) {
                    window.open(sponsor.website, '_blank');
                  }
                }}
              >
                {sponsor.logo ? (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '50px',
                      objectFit: 'contain',
                      filter: 'grayscale(100%)',
                      transition: 'filter 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'grayscale(0%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'grayscale(100%)';
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#64748b',
                    }}
                  >
                    {sponsor.name}
                  </span>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default SponsorsSection;
