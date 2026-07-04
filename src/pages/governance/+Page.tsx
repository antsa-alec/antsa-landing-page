import type { ReactNode } from 'react';

/**
 * CLINICAL GOVERNANCE — a dedicated E-E-A-T / trust page (YMYL health).
 * Content is limited to independently-verifiable facts and ANTSA's own stated
 * model + posture (using ANTSA's hedged wording); no unverified award, "world's
 * first", "ISO-certified" or teammate-credential claims. Answer-first structure
 * (question H2 + direct opening answer) also aids AI answer engines.
 */

const Check = ({ color = '#1F9D8B' }: { color?: string }) => (
  <span style={{ color, flexShrink: 0, display: 'inline-flex', marginTop: 2 }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const Li = ({ children, color }: { children: ReactNode; color?: string }) => (
  <li style={{ display: 'flex', gap: 12, fontSize: 16, lineHeight: 1.55, color: '#22272F' }}>
    <Check color={color} /> <span>{children}</span>
  </li>
);

const SectionHead = ({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead: ReactNode }) => (
  <>
    {eyebrow && <div className="dc-eyebrow" style={{ marginBottom: 12 }}>{eyebrow}</div>}
    <h2 className="dc-h2" style={{ marginBottom: 16 }}>{title}</h2>
    <p className="dc-lead" style={{ maxWidth: 760, marginBottom: 28 }}>{lead}</p>
  </>
);

const securityPoints = [
  ['Australian-hosted', 'ANTSA states its servers are located within Australia.'],
  ['Encrypted', 'Encrypted storage and transfer of data.'],
  ['Two-factor authentication', 'Extra protection for practitioner accounts.'],
  ['Privacy-aligned', 'Stated alignment with the Australian Privacy Principles and AHPRA regulations.'],
  ['HIPAA & GDPR aligned', 'Designed to align with leading international privacy frameworks.'],
  ['ISO 27001 in progress', 'ISO 27001 certification is currently in progress (not yet certified).'],
  ['Not used to train AI', 'ANTSA states client data is not used to train AI models.'],
];

export default function Page() {
  return (
    <>
      {/* Intro */}
      <section style={{ background: '#EEF4FB', padding: 'clamp(56px, 9vw, 88px) 0', borderBottom: '1px solid #E6E9EE' }}>
        <div className="dc-container">
          <div className="dc-eyebrow" style={{ marginBottom: 16 }}>Clinical governance</div>
          <h1 style={{ fontSize: 'clamp(30px, 7vw, 44px)', lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.02em', color: '#0F1622', margin: '0 0 20px', maxWidth: 860 }}>
            Mental health care belongs in <span style={{ color: '#48ABE2' }}>clinician hands</span>
          </h1>
          <p style={{ fontSize: 'clamp(17px, 2.4vw, 19px)', lineHeight: 1.6, color: '#5B6472', margin: 0, maxWidth: 720 }}>
            ANTSA® is built so that every tool — including our optional AI support — sits inside your clinical system,
            under your oversight, never outside it. A tool for your practice, never a replacement for your judgement.
          </p>
        </div>
      </section>

      {/* Who builds ANTSA */}
      <section style={{ background: '#fff', padding: 'clamp(56px, 9vw, 88px) 0' }}>
        <div className="dc-container">
          <SectionHead
            eyebrow="Who builds ANTSA"
            title="Who is behind the platform?"
            lead={
              <>
                ANTSA is built by <strong>ANTSA Pty Ltd</strong>, a female-founded Australian company
                (ABN&nbsp;77&nbsp;664&nbsp;161&nbsp;237), established in 2022 and based in Victoria. It was founded by a
                practising clinical psychologist, and its team spans clinical psychology, governance and law, science,
                and AI engineering.
              </>
            }
          />
          <div className="dc-card" style={{ padding: 'clamp(22px, 4vw, 32px)', maxWidth: 820 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>Sally-Anne McCormack</h3>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#48ABE2', marginBottom: 14 }}>Founder &amp; CEO · Clinical Psychologist</div>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#5B6472', margin: 0 }}>
              Sally-Anne is an AHPRA-endorsed Clinical Psychologist and a member of the Australian Psychological Society
              (MAPS), with more than 20 years' experience across children, adolescents, adults and families, and a long
              track record as an author and mental-health commentator. She built ANTSA to make between-session care more
              visible, structured and clinically governed — the platform she wished had existed in her own practice.
            </p>
          </div>
          <p style={{ fontSize: 14, color: '#8B95A3', marginTop: 16, maxWidth: 820 }}>
            Meet the wider team on the{' '}
            <a href="/#team" className="dc-link" style={{ color: '#48ABE2', fontWeight: 500 }}>homepage</a>.
          </p>
        </div>
      </section>

      {/* ANTSAbot governance */}
      <section style={{ background: '#F3F7FC', padding: 'clamp(56px, 9vw, 88px) 0' }}>
        <div className="dc-container">
          <SectionHead
            eyebrow="Clinician-governed AI"
            title="How is ANTSAbot governed?"
            lead={
              <>
                ANTSAbot is <strong>optional and clinician-governed</strong>. A client only uses it if you assign it, they
                consent to it, and you can review or switch it off at any time. It sits within your clinical record, not
                outside your oversight.
              </>
            }
          />
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', minWidth: 280 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', color: '#0F1622' }}>How it is controlled</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Li>Assigned by the practitioner</Li>
                <Li>Consent-based — clients opt in</Li>
                <Li>Part of the clinical record</Li>
                <Li>Reviewable and adjustable by you</Li>
                <Li>Can be turned off at any time</Li>
              </ul>
            </div>
            <div style={{ flex: '1 1 300px', minWidth: 280 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px', color: '#0F1622' }}>What it does — and doesn&apos;t</h4>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#5B6472', margin: '0 0 12px' }}>
                ANTSAbot supports reflection, psychoeducation and engagement between sessions.
              </p>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#5B6472', margin: 0 }}>
                It does <strong>not</strong> diagnose, replace therapy, create treatment plans, give independent clinical
                advice, or operate as a crisis service. Your clients are already using AI — ANTSAbot is the one their
                clinician assigns and reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data protection */}
      <section style={{ background: '#fff', padding: 'clamp(56px, 9vw, 88px) 0' }}>
        <div className="dc-container">
          <SectionHead
            eyebrow="Security & privacy"
            title="How is client data protected?"
            lead={
              <>
                Client information is designed to stay inside a controlled clinical platform. ANTSA states the following
                security and privacy posture:
              </>
            }
          />
          <div className="dc-grid-3" style={{ gap: 16 }}>
            {securityPoints.map(([title, desc]) => (
              <div key={title} style={{ background: '#F3F7FC', border: '1px solid #E6E9EE', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <Check color="#48ABE2" />
                  <div style={{ fontSize: 15.5, fontWeight: 600, color: '#0F1622' }}>{title}</div>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#5B6472', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13.5, color: '#8B95A3', marginTop: 18, maxWidth: 760, fontStyle: 'italic' }}>
            These reflect ANTSA's stated posture. &ldquo;Aligned&rdquo; indicates alignment with a framework rather than
            formal certification; ISO&nbsp;27001 certification is in progress.
          </p>
        </div>
      </section>

      {/* What ANTSA is not */}
      <section style={{ background: '#FBF7EE', borderTop: '1px solid #EFE6D2', borderBottom: '1px solid #EFE6D2', padding: 'clamp(40px, 7vw, 64px) 0' }}>
        <div className="dc-container" style={{ maxWidth: 920 }}>
          <h2 style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: 700, letterSpacing: '-0.01em', color: '#5E5232', margin: '0 0 14px' }}>
            What ANTSA is not
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.65, color: '#7A6A45', margin: 0 }}>
            ANTSA® is a digital mental health platform designed to support clinicians and clients. It does not replace
            professional judgement, diagnosis, treatment, crisis care or emergency support. ANTSAbot does not provide
            independent therapy or medical advice. ANTSA® is not a crisis service — if you or someone else is in immediate
            danger, call 000 in Australia or contact a crisis support service.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#EAF2FB', padding: 'clamp(48px, 8vw, 64px) 0' }}>
        <div className="dc-container" style={{ textAlign: 'center', maxWidth: 640 }}>
          <h2 className="dc-h2" style={{ marginBottom: 12 }}>Questions about governance or clinical safety?</h2>
          <p className="dc-lead" style={{ margin: '0 auto 28px' }}>
            We&apos;re happy to walk clinicians and organisations through how ANTSA keeps oversight with you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a className="dc-btn dc-btn-primary" href="mailto:admin@antsa.com.au">Talk to us</a>
            <a className="dc-btn dc-btn-secondary" href="/">Back to home</a>
          </div>
        </div>
      </section>
    </>
  );
}
