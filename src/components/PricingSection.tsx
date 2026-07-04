import { useEffect, useState } from 'react';

/**
 * PRICING — "One platform, simple pricing". Three tiers.
 * CMS + live Stripe: SSR seeds from section.content.plans; the client refreshes
 * the Solo price from /api/stripe/pricing. Priced (featured) plan renders the
 * Solo layout with two CTAs; unpriced plans render a "Contact us" card.
 */

type PricingPlan = {
  id?: string | number;
  name: string;
  price: string;
  period?: string;
  features: string[];
  featured?: boolean;
  cta_text?: string;
  cta_url?: string;
};

type PricingProps = { section?: { content?: { plans?: PricingPlan[] } } };

const hasPrice = (p: PricingPlan) => !!p.price && /^\$\d/.test(p.price);

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'solo',
    name: 'Solo practitioner',
    price: '$99',
    period: '/ month',
    featured: true,
    features: [
      'Full platform access',
      'Clinician-overseen AI chatbot',
      'Practitioner AI assistant',
      'AI Scribe & templates',
      'Telehealth & session summaries',
      'Mood & distress tracking',
      'Secure messaging',
      'Homework task assignment',
      'Psychoeducation library',
      'Automated reminders',
      'Psychometric measures',
    ],
    cta_url: 'https://au.antsa.ai/sign-in',
  },
  {
    id: 'clinic',
    name: 'Clinic / practice',
    price: '',
    period: 'Volume pricing for teams',
    features: [
      'Everything in solo practitioner',
      'Reduced per-licence pricing',
      'Multi-practitioner management',
      'Practice-level reporting',
      'Encrypted practitioner communication',
      'Real-time reporting of practitioner usage',
    ],
    cta_url: 'mailto:admin@antsa.com.au',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '',
    period: 'For organisations at scale',
    features: [
      'Everything in clinic / practice',
      'Custom integrations',
      'Dedicated support',
      'Service-level agreements',
      'Custom deployment options',
    ],
    cta_url: 'mailto:admin@antsa.com.au',
  },
];

/** Subtitle shown under an unpriced plan name. */
const subtitleFor = (p: PricingPlan) => {
  if (p.period && !p.period.startsWith('/')) return p.period;
  const n = p.name.toLowerCase();
  if (n.includes('clinic') || n.includes('practice')) return 'Volume pricing for teams';
  if (n.includes('enterprise')) return 'For organisations at scale';
  return 'Talk to us about pricing';
};

const Check = ({ color }: { color: string }) => (
  <span style={{ color, flexShrink: 0, display: 'inline-flex' }}>
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export default function PricingSection({ section }: PricingProps) {
  const seed = Array.isArray(section?.content?.plans) && section!.content!.plans!.length
    ? (section!.content!.plans as PricingPlan[])
    : DEFAULT_PLANS;
  const [plans, setPlans] = useState<PricingPlan[]>(seed);

  useEffect(() => {
    fetch('/api/stripe/pricing')
      .then((res) => {
        if (!res.ok) throw new Error('Stripe unavailable');
        return res.json();
      })
      .then((data) => {
        if (data.plans && data.plans.length > 0) setPlans(data.plans);
      })
      .catch((err) => console.error('Failed to load pricing:', err));
  }, []);

  const displayPlans = plans.length ? plans : DEFAULT_PLANS;

  return (
    <section id="pricing" style={{ background: '#F3F7FC', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
          <div className="dc-eyebrow" style={{ marginBottom: 12 }}>Pricing</div>
          <h2 className="dc-h2" style={{ marginBottom: 14 }}>
            <span className="hl">One</span> platform, <span className="hl">simple</span> pricing
          </h2>
          <p className="dc-lead" style={{ maxWidth: 580 }}>
            No confusing add-ons. No multiple subscriptions. Clinical workflow and between-session support in one place.
          </p>
        </div>

        <div className="dc-grid-3" style={{ gap: 20, alignItems: 'start' }}>
          {displayPlans.map((p) => {
            const priced = hasPrice(p);
            return (
              <div
                key={p.id ?? p.name}
                style={{
                  background: '#fff',
                  border: priced ? '2px solid #48ABE2' : '1px solid #E6E9EE',
                  borderRadius: 22,
                  padding: '34px 30px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: priced ? '0 8px 28px rgba(72,171,226,.12)' : '0 4px 16px rgba(15,22,34,.04)',
                }}
              >
                {!!p.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -13,
                      left: 30,
                      background: '#48ABE2',
                      color: '#fff',
                      padding: '5px 14px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Most popular
                  </div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>{p.name}</h3>

                {priced ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 22, minHeight: 66 }}>
                    <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.02em' }}>{p.price}</span>
                    <span style={{ fontSize: 17, color: '#8B95A3' }}>{p.period || '/ month'}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 15, color: '#8B95A3', marginBottom: 22, minHeight: 66, display: 'flex', alignItems: 'center' }}>
                    {subtitleFor(p)}
                  </div>
                )}

                {priced ? (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 24, minHeight: 50 }}>
                    <a
                      className="dc-btn dc-btn-primary dc-btn-sm"
                      style={{ flex: 1, padding: '13px 8px' }}
                      href={p.cta_url || 'https://au.antsa.ai/sign-in'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Start now
                    </a>
                    <a
                      className="dc-btn dc-btn-outline dc-btn-sm"
                      style={{ flex: 1, padding: '13px 8px' }}
                      href="https://antsa.ai/free-trial"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Start free trial
                    </a>
                  </div>
                ) : (
                  <a
                    className="dc-btn dc-btn-secondary"
                    style={{ marginBottom: 24, minHeight: 50 }}
                    href={p.cta_url || 'mailto:admin@antsa.com.au'}
                  >
                    <MailIcon /> Contact us
                  </a>
                )}

                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {(p.features ?? []).map((f, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, fontSize: 15, color: '#22272F' }}>
                      <Check color={priced ? '#2EAD6F' : '#48ABE2'} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
