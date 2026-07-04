import type { ReactNode } from 'react';
import photoSallyAnne from '../assets/team-sally-anne.png';
import photoKiera from '../assets/team-kiera.png';
import photoAmber from '../assets/team-amber.png';
import photoBen from '../assets/team-ben.png';

/**
 * TEAM — "Meet the people behind ANTSA". 4-up cards with round photo, optional
 * credential badge slot, role, bio and social chips.
 * CMS-driven: reads section.content.members (team_members + socials); falls back
 * to the approved design set with bundled photos.
 */

type Social = { platform: string; url: string };
type TeamMember = {
  id?: string | number;
  name: string;
  role: string;
  bio: string;
  image_url?: string;
  badge_url?: string;
  socials?: Social[];
};

type TeamProps = { section?: { content?: { members?: TeamMember[] } } };

const teamPhotos: Record<string, string> = {
  'Sally-Anne McCormack': photoSallyAnne,
  'Kiera Macdonald': photoKiera,
  'Amber Macdonald': photoAmber,
  'Ben Smith': photoBen,
};

/** Intrinsic pixel dimensions of the bundled team photos (all 1:1 square), so
 * each <img> carries a correct aspect ratio (CLS-safe). Falls back to 480×480
 * for CMS-supplied members. */
const photoDimensions: Record<string, { w: number; h: number }> = {
  'Sally-Anne McCormack': { w: 480, h: 480 },
  'Kiera Macdonald': { w: 480, h: 480 },
  'Amber Macdonald': { w: 428, h: 428 },
  'Ben Smith': { w: 480, h: 480 },
};

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Sally-Anne McCormack',
    role: 'Founder & CEO\nClinical Psychologist',
    bio: 'Sally-Anne saw the between-session gap in her own clinical practice. After 20 years as a psychologist, she built the platform she wished had existed for clinicians and clients to make between-session care more visible, structured and clinically governed.',
    socials: [
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/sallyannemccormack/' },
      { platform: 'website', url: 'https://www.sally-annemccormack.com.au/' },
    ],
  },
  {
    id: '2',
    name: 'Kiera Macdonald',
    role: 'CCO, Chief Clinical Officer\nPsychologist (Clinical Registrar)',
    bio: 'Kiera knows what it looks like when a client arrives having had no support since last session. She helps shape ANTSA® through a strong clinical lens, ensuring the platform remains ethical, practical and grounded in real therapeutic work.',
    socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/kiera-macdonald-9a8b5b364/' }],
  },
  {
    id: '3',
    name: 'Amber Macdonald',
    role: 'CGO, Chief Governance Officer\nSenior Scientist / Lawyer',
    bio: 'Most platforms think about governance after the fact. Amber built it in from the start. Her background in science and law means ANTSA® is designed to withstand scrutiny before it reaches a client.',
    socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/in/amber--macdonald/' }],
  },
  {
    id: '4',
    name: 'Ben Smith',
    role: 'CTO, Chief Technology Officer\nAI Engineer',
    bio: "Ben leads ANTSA's technical architecture and AI systems. He joined because he believed in what clinician-governed AI could do. His work reflects a strong commitment to building technology that is safe, practical and clinically useful.",
    socials: [{ platform: 'linkedin', url: 'https://www.linkedin.com/company/antsa-mentalhealth/' }],
  },
];

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const socialConfig = (platform: string): { icon: ReactNode; label: string } => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return { icon: <LinkedInIcon />, label: 'LinkedIn' };
    case 'website':
      return { icon: <GlobeIcon />, label: 'Website' };
    default:
      return { icon: <GlobeIcon />, label: platform };
  }
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function TeamSection({ section }: TeamProps) {
  const members = section?.content?.members?.length ? section.content.members : DEFAULT_MEMBERS;

  return (
    <section id="team" style={{ background: '#F3F7FC', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(26px, 6.2vw, 38px)', lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 18px' }}>
            Meet the <span style={{ color: '#48ABE2' }}>people</span> behind ANTSA
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: '#5B6472', maxWidth: 760, margin: 0 }}>
            ANTSA® is a female-owned Australian company founded by a clinical psychologist and built with her two daughters.
            The team brings clinical, governance, legal, scientific and technical expertise to one shared goal. Keeping
            clinicians at the centre of digital mental health care.
          </p>
        </div>

        <div className="dc-grid-4" style={{ gap: 24, alignItems: 'stretch' }}>
          {members.map((m) => {
            const photo = m.image_url || teamPhotos[m.name];
            const dims = photoDimensions[m.name] ?? { w: 480, h: 480 };
            const linkedin = m.socials?.find((s) => s.platform.toLowerCase() === 'linkedin')?.url;
            const photoInner = (
              <div style={{ width: 120, height: 120, borderRadius: 999, overflow: 'hidden', border: '3px solid #C9DEF6', margin: '0 auto', background: '#48ABE2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photo ? (
                  <img src={photo} alt={m.name} width={dims.w} height={dims.h} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: 34 }}>{initials(m.name)}</span>
                )}
              </div>
            );
            return (
              <div
                key={m.id ?? m.name}
                className="dc-card"
                style={{ padding: '28px 22px', display: 'flex', flexDirection: 'column', textAlign: 'center' }}
              >
                {linkedin ? (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ display: 'block', margin: '0 auto' }}>
                    {photoInner}
                  </a>
                ) : (
                  photoInner
                )}
                <div style={{ height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '14px 0 10px' }}>
                  {m.badge_url ? (
                    <img src={m.badge_url} alt="" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
                  ) : null}
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 4px' }}>{m.name}</h4>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#48ABE2', marginBottom: 14, minHeight: 36, whiteSpace: 'pre-line' }}>
                  {m.role}
                </div>
                <p style={{ fontSize: 13.5, color: '#5B6472', lineHeight: 1.55, margin: '0 0 18px', flex: 1 }}>{m.bio}</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 'auto' }}>
                  {(m.socials ?? []).map((s) => {
                    const cfg = socialConfig(s.platform);
                    return (
                      <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="dc-chip">
                        {cfg.icon} {cfg.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
