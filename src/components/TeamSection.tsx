import { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Space } from 'antd';
import { LinkedinOutlined, TwitterOutlined, GithubOutlined, GlobalOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

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
 * TEAM SECTION - Our Team
 * Displays team members with social links
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

  // Default team members if none loaded
  const defaultMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Clinical Director',
      bio: 'Clinical psychologist with 15+ years experience in digital mental health.',
      image_url: '',
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Experienced engineer passionate about building secure healthcare technology.',
      image_url: '',
    },
    {
      id: '3',
      name: 'Dr. Emily Roberts',
      role: 'Head of Clinical Innovation',
      bio: 'Specialist in evidence-based therapy and AI-assisted clinical practice.',
      image_url: '',
    },
  ];

  const displayMembers = members.length > 0 ? members : defaultMembers;

  if (loading) {
    return null;
  }

  // Render social icon based on platform
  const renderSocialIcon = (platform: string) => {
    const iconStyle = { fontSize: '18px', color: '#64748b' };
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <LinkedinOutlined style={iconStyle} />;
      case 'twitter':
        return <TwitterOutlined style={iconStyle} />;
      case 'github':
        return <GithubOutlined style={iconStyle} />;
      default:
        return <GlobalOutlined style={iconStyle} />;
    }
  };

  return (
    <section
      id="team"
      style={{
        background: '#ffffff',
        padding: '120px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <Title
            level={5}
            className="reveal"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#3b82f6',
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
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              experts
            </span>{' '}
            behind ANTSA
          </Title>
          <Paragraph
            className="reveal"
            style={{
              fontSize: '18px',
              color: '#64748b',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Our team combines clinical expertise with cutting-edge technology to deliver safe, practitioner-controlled mental health solutions.
          </Paragraph>
        </div>

        {/* Team Members Grid */}
        <Row gutter={[32, 32]}>
          {displayMembers.map((member, index) => (
            <Col xs={24} sm={12} lg={8} key={member.id}>
              <Card
                className="reveal"
                style={{
                  height: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  background: '#ffffff',
                  transition: 'all 0.3s ease',
                  transitionDelay: `${index * 100}ms`,
                  overflow: 'hidden',
                }}
                bodyStyle={{ padding: 0 }}
                bordered={false}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Member Image */}
                <div
                  style={{
                    width: '100%',
                    height: '280px',
                    background: member.image_url
                      ? `url(${member.image_url}) center/cover`
                      : 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!member.image_url && (
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '48px',
                        fontWeight: 700,
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div style={{ padding: '24px' }}>
                  <Title
                    level={4}
                    style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '4px',
                    }}
                  >
                    {member.name}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: '14px',
                      color: '#3b82f6',
                      fontWeight: 600,
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {member.role}
                  </Paragraph>
                  <Paragraph
                    style={{
                      fontSize: '15px',
                      color: '#64748b',
                      marginBottom: '20px',
                      lineHeight: 1.6,
                    }}
                  >
                    {member.bio}
                  </Paragraph>

                  {/* Social Links */}
                  {member.socials && member.socials.length > 0 && (
                    <Space size="middle">
                      {member.socials.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#f8fafc',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#3b82f6';
                            const icon = e.currentTarget.querySelector('span');
                            if (icon) (icon as HTMLElement).style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f8fafc';
                            const icon = e.currentTarget.querySelector('span');
                            if (icon) (icon as HTMLElement).style.color = '#64748b';
                          }}
                        >
                          {renderSocialIcon(social.platform)}
                        </a>
                      ))}
                    </Space>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default TeamSection;
