import { useEffect, useState } from 'react';
import { Typography, Row, Col, Space, Button } from 'antd';
import { LinkedinOutlined } from '@ant-design/icons';

import photoSallyAnne from '../assets/team-sally-anne.png';
import photoKiera from '../assets/team-kiera.png';
import photoAmber from '../assets/team-amber.png';
import photoBen from '../assets/team-ben.png';

const { Title, Paragraph } = Typography;

// Map team member names to their bundled photo imports
const teamPhotos: Record<string, string> = {
  'Sally-Anne McCormack': photoSallyAnne,
  'Kiera Macdonald': photoKiera,
  'Amber Macdonald': photoAmber,
  'Ben Smith': photoBen,
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url?: string;
  socials?: {
    platform: string;
    url: string;
  }[];
}

/**
 * TEAM SECTION - Circular photo cards with LinkedIn buttons
 */
const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/section/team')
      .then((res) => res.json())
      .then((data) => {
        if (data.content && data.content.members) {
          setMembers(data.content.members);
        }
      })
      .catch((err) => console.error('Failed to load team:', err))
      .finally(() => setLoading(false));
  }, []);

  const defaultMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sally-Anne McCormack',
      role: 'Founder & CEO, Clinical Psychologist',
      bio: 'Founder and CEO of ANTSA. A clinical psychologist with extensive experience in mental health practice, driving the vision for clinician-governed digital care infrastructure.',
      image_url: photoSallyAnne,
      socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/sally-anne-mccormack/' }],
    },
    {
      id: '2',
      name: 'Kiera Macdonald',
      role: 'CCO, Clinical Psychologist',
      bio: 'Chief Clinical Officer bringing clinical psychology expertise to ensure ANTSA maintains the highest standards of clinical governance and evidence-based practice.',
      image_url: photoKiera,
      socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/kiera-macdonald/' }],
    },
    {
      id: '3',
      name: 'Amber Macdonald',
      role: 'CGO, Senior Scientist / Lawyer',
      bio: 'Chief Governance Officer combining scientific research and legal expertise to ensure ANTSA meets regulatory requirements and professional standards.',
      image_url: photoAmber,
      socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/amber-macdonald/' }],
    },
    {
      id: '4',
      name: 'Ben Smith',
      role: 'CTO, AI Engineer',
      bio: "Chief Technology Officer leading the technical architecture and AI systems that power ANTSA's practitioner-governed digital care platform.",
      image_url: photoBen,
      socials: [],
    },
  ];

  const displayMembers = members.length > 0 ? members : defaultMembers;

  if (loading) return null;

  return (
    <section
      id="team"
      style={{
        background: '#ffffff',
        padding: '120px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Title
            level={5}
            className="reveal"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#48abe2',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            OUR TEAM
          </Title>
          <Title
            level={2}
            className="reveal"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '24px',
              letterSpacing: '-0.02em',
            }}
          >
            Meet the{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              experts
            </span>{' '}
            behind ANTSA.
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '900px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            ANTSA is a female-owned Australian company founded by a clinical psychologist and built with her two daughters. Together, the team brings deep clinical insight, strong governance, and practical experience in digital health, designing infrastructure that scales without losing clinical accountability.
          </Paragraph>
        </div>

        {/* Team Members Grid - 4 columns */}
        <Row gutter={[32, 48]} justify="center">
          {displayMembers.map((member, index) => (
            <Col xs={24} sm={12} lg={6} key={member.id}>
              <div
                className="reveal"
                style={{
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Circular Photo / Placeholder - clickable to LinkedIn */}
                {(() => {
                  const linkedIn = member.socials?.find(s => s.platform === 'linkedin');
                  const photoSrc = member.image_url || teamPhotos[member.name];
                  const photoEl = (
                    <div
                      style={{
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        background: photoSrc
                          ? `url(${photoSrc}) center/cover`
                          : 'linear-gradient(135deg, #48abe2 0%, #7ec8ed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        border: '4px solid #f1f5f9',
                        boxShadow: '0 8px 24px rgba(72, 171, 226, 0.15)',
                        cursor: linkedIn ? 'pointer' : 'default',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (linkedIn) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 12px 32px rgba(72, 171, 226, 0.25)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(72, 171, 226, 0.15)';
                      }}
                    >
                      {!photoSrc && (
                        <span
                          style={{
                            color: '#ffffff',
                            fontSize: '48px',
                            fontWeight: 700,
                          }}
                        >
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      )}
                    </div>
                  );
                  return linkedIn ? (
                    <a href={linkedIn.url} target="_blank" rel="noopener noreferrer">
                      {photoEl}
                    </a>
                  ) : photoEl;
                })()}

                {/* Name */}
                <Title
                  level={4}
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: '4px',
                  }}
                >
                  {member.name}
                </Title>

                {/* Role */}
                <Paragraph
                  style={{
                    fontSize: '14px',
                    color: '#48abe2',
                    fontWeight: 600,
                    marginBottom: '12px',
                  }}
                >
                  {member.role}
                </Paragraph>

                {/* Bio */}
                <Paragraph
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    marginBottom: '16px',
                    lineHeight: 1.6,
                  }}
                >
                  {member.bio}
                </Paragraph>

                {/* LinkedIn Button */}
                {member.socials && member.socials.length > 0 && (
                  <Space>
                    {member.socials.map((social, idx) => (
                      social.platform === 'linkedin' && (
                        <Button
                          key={idx}
                          type="default"
                          size="small"
                          icon={<LinkedinOutlined />}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            borderRadius: '8px',
                            borderColor: '#e2e8f0',
                            color: '#0a66c2',
                            fontWeight: 500,
                            fontSize: '13px',
                          }}
                        >
                          LinkedIn
                        </Button>
                      )
                    ))}
                  </Space>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TeamSection;
