import { useState } from 'react';

/**
 * The homepage preview and full FAQ page share the same live CMS content.
 */

type FAQ = { id: string; question: string; answer: string };

export type FAQContent = {
  content?: Record<string, unknown>;
  faqs?: Array<Record<string, unknown>>;
};

type FAQProps = { section?: FAQContent; preview?: boolean; standalone?: boolean };

export const FAQ_PREVIEW_COUNT = 3;

const DEFAULT_FAQS: FAQ[] = [
  { id: '1', question: 'Is ANTSA a replacement for therapy?', answer: 'No. ANTSA® is a clinical support platform that helps extend structured care between sessions. It does not replace therapy, diagnose conditions, make clinical decisions or operate independently of practitioner oversight.' },
  { id: '2', question: 'Is ANTSAbot optional?', answer: 'Yes. ANTSAbot is completely optional. Clinicians decide whether it is appropriate for each client, and clients are asked to consent before using it. ANTSA® can still be used for AI Scribe, telehealth, homework, mood tracking, resources, secure messaging and other clinical workflow tools without ANTSAbot.' },
  { id: '3', question: 'Will ANTSA replace clinicians?', answer: 'No. ANTSA® is built to bring clinicians into digital care, not remove them. It supports your clinical workflow and helps clients stay engaged between sessions, while clinical decisions and responsibility remain with you.' },
  { id: '4', question: 'Does ANTSAbot give independent advice?', answer: 'No. ANTSAbot supports reflection, psychoeducation and engagement within a clinician-governed platform. It does not diagnose, provide independent therapy, create treatment plans or give medical advice.' },
  { id: '5', question: 'How is ANTSA different from a consumer AI tool?', answer: 'ANTSA® is clinician-governed. Tools such as ANTSAbot are assigned by the practitioner, reviewable by the clinician and used within a governance framework, unlike consumer tools that operate without clinical oversight.' },
  { id: '6', question: 'Is client data used to train AI models?', answer: 'No. Client data is not used to train AI models. Privacy and security are core to how ANTSA® is designed.' },
  { id: '7', question: 'Is client data secure?', answer: 'Yes. ANTSA® is hosted on Australian servers and designed with privacy, encryption, two-factor authentication and consent-based sharing. It is aligned with the Australian Privacy Principles, HIPAA and GDPR, with ISO 27001 certification in progress.' },
];

export function getFAQContent(section?: FAQContent, preview = false) {
  const rawFaqs = section?.faqs;
  const faqs: FAQ[] = Array.isArray(rawFaqs)
    ? rawFaqs.map((item, i) => ({
        id: String((item.id as string | number | undefined) ?? i),
        question: String(item.question ?? ''),
        answer: String(item.answer ?? ''),
      }))
    : DEFAULT_FAQS;

  return {
    title: String(section?.content?.title ?? 'Common questions'),
    subtitle: String(section?.content?.subtitle ?? ''),
    badge: String(section?.content?.badge ?? 'FAQ'),
    faqs: preview ? faqs.slice(0, FAQ_PREVIEW_COUNT) : faqs,
  };
}

export default function FAQSection({ section, preview = false, standalone = false }: FAQProps) {
  const { title, subtitle, badge, faqs } = getFAQContent(section, preview);
  const Heading = standalone ? 'h1' : 'h2';

  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ background: '#fff', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
          <div className="dc-eyebrow" style={{ marginBottom: 12 }}>{badge}</div>
          <Heading className="dc-h2">{title}</Heading>
          {subtitle && <p style={{ color: '#5B6472', marginTop: 16 }}>{subtitle}</p>}
        </div>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {faqs.map((f, i) => {
            const isOpen = i === open;
            return (
              <div key={f.id} style={{ background: '#fff', border: '1px solid #E6E9EE', borderRadius: 14, marginBottom: 12, overflow: 'hidden' }}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${f.id}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    border: 0,
                    background: 'none',
                    color: 'inherit',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    padding: '18px 22px',
                    fontWeight: 600,
                    fontSize: 17,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <span>{f.question}</span>
                  <span
                    style={{
                      color: '#8B95A3',
                      flexShrink: 0,
                      display: 'inline-flex',
                      transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <div id={`faq-answer-${f.id}`} hidden={!isOpen} style={{ padding: '0 22px 20px', fontSize: 16, color: '#5B6472', lineHeight: 1.6 }}>{f.answer}</div>
              </div>
            );
          })}
          {preview && (
            <div style={{ marginTop: 28, textAlign: 'center' }}>
              <a href="/faq" className="dc-btn dc-btn-secondary">View all frequently asked questions</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
