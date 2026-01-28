/**
 * SPONSORS SECTION - LOGO STRIP
 * Features: Horizontal logo strip with auto-scroll animation, grayscale with hover effect
 */

import { useEffect, useState } from 'react';
import { Row, Col, Typography, Spin } from 'antd';

const { Title, Paragraph } = Typography;

// Using relative URL so Vite proxy can handle the request
const API_BASE_URL = '/api';

interface Sponsor {
  id: number;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  order_index: number;
}

interface SectionContent {
  title?: string;
  subtitle?: string;
}

const SponsorsSection = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sectionContent, setSectionContent] = useState<SectionContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchSponsors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/content/sponsors`);
        const data = await response.json();
        
        if (!ignore && response.ok) {
          setSponsors(data.sponsors || []);
          setSectionContent(data.sectionContent || {});
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching sponsors:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSponsors();

    return () => {
      ignore = true;
    };
  }, []);

  // Don't render section if no sponsors
  if (!loading && sponsors.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        background: '#f7fafc',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  const title = sectionContent.title || 'Trusted By';
  const subtitle = sectionContent.subtitle || 'Leading mental health organizations';

  // Duplicate sponsors for seamless infinite scroll
  const displaySponsors = [...sponsors, ...sponsors];

  return (
    <div 
      id="sponsors"
      style={{ 
        padding: '60px 20px',
        background: '#f7fafc',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Section Header */}
      <Row justify="center" style={{ marginBottom: '40px' }}>
        <Col xs={22} sm={20} md={18} lg={14}>
          <div className="reveal" style={{ textAlign: 'center' }}>
            <Title 
              level={4} 
              style={{ 
                color: '#4a5568',
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {title}
            </Title>
            {subtitle && (
              <Paragraph 
                style={{ 
                  color: '#718096',
                  fontSize: '0.95rem',
                  marginBottom: 0,
                }}
              >
                {subtitle}
              </Paragraph>
            )}
          </div>
        </Col>
      </Row>

      {/* Logo Carousel */}
      <div 
        className="sponsors-track"
        style={{
          display: 'flex',
          gap: '60px',
          animation: 'scroll 30s linear infinite',
          width: 'fit-content',
        }}
      >
        {displaySponsors.map((sponsor, index) => (
          <div
            key={`${sponsor.id}-${index}`}
            className="sponsor-logo"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '150px',
              height: '60px',
              cursor: sponsor.website_url ? 'pointer' : 'default',
              transition: 'all 0.3s ease',
            }}
            onClick={() => {
              if (sponsor.website_url) {
                window.open(sponsor.website_url, '_blank');
              }
            }}
          >
            {sponsor.logo_url ? (
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                style={{
                  maxHeight: '50px',
                  maxWidth: '150px',
                  objectFit: 'contain',
                  filter: 'grayscale(100%)',
                  opacity: 0.6,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(100%)';
                  e.currentTarget.style.opacity = '0.6';
                }}
              />
            ) : (
              <div
                style={{
                  padding: '12px 24px',
                  background: 'rgba(72, 171, 226, 0.1)',
                  borderRadius: '8px',
                  color: '#4a5568',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  filter: 'grayscale(100%)',
                  opacity: 0.7,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%)';
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.background = 'rgba(72, 171, 226, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(100%)';
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.background = 'rgba(72, 171, 226, 0.1)';
                }}
              >
                {sponsor.name}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gradient overlays for smooth fade effect */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to right, #f7fafc 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to left, #f7fafc 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* CSS for scrolling animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .sponsors-track:hover {
          animation-play-state: paused;
        }

        .sponsor-logo:hover img,
        .sponsor-logo:hover > div {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default SponsorsSection;
