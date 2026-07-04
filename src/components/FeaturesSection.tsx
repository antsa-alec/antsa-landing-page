import { useEffect, useState } from 'react';

/**
 * SEE ANTSA IN ACTION — "One login for your whole practice".
 * Left = cross-fading product screenshots; right = a clickable, auto-rotating
 * list. Active item expands its description and tints its row.
 *
 * CMS-driven: reads section.content.items (feature_items) and falls back to the
 * approved 9-tool set. Each item → { title, description, image_url, color? }.
 */

type FeatureItem = {
  id?: string | number;
  title?: string;
  description?: string;
  image_url?: string;
  color?: string;
};

type Props = { section?: { content?: { items?: FeatureItem[] } } };

const PALETTE = [
  { accent: '#48ABE2', tint: '#DCE9FB' },
  { accent: '#1F9D8B', tint: '#D6EFEA' },
  { accent: '#E0922C', tint: '#FAEBD3' },
  { accent: '#7C6CE0', tint: '#E6E2FA' },
  { accent: '#E0567F', tint: '#FAE0E8' },
  { accent: '#2BB0C4', tint: '#D6EFF4' },
];

const DEFAULT_ITEMS: FeatureItem[] = [
  { title: 'AI Scribe', description: 'Transcribes and summarises sessions so you finish notes faster, and review every word.', image_url: '/landing/client-detail-sessions-notes.png' },
  { title: 'Client messaging', description: 'Secure, in-platform messaging that keeps client communication in one place.', image_url: '/landing/client-detail-overview.png' },
  { title: 'AI assistant', description: 'A practitioner-side assistant that helps you draft, summarise and stay organised.', image_url: '/landing/dashboard.png' },
  { title: 'Homework & tasks', description: 'Assign tasks, journals and activities clients can complete between sessions.', image_url: '/landing/templates.png' },
  { title: 'Psychometrics', description: 'Send validated measures with automatic scoring for intake, review and monitoring.', image_url: '/landing/clients-list.png' },
  { title: 'Mood & engagement', description: 'See mood trends and engagement at a glance, without chasing reports.', image_url: '/landing/client-detail-overview.png' },
  { title: 'Telehealth', description: 'Built-in secure video, working alongside the AI Scribe. No separate platform.', image_url: '/landing/calendar.png' },
  { title: 'ANTSAbot', description: 'Optional, clinician-governed AI support for reflection and psychoeducation between sessions.', image_url: '/landing/mobile-sign-in.png' },
  { title: 'Mobile app', description: 'Clients access their tasks, mood check-ins and resources from a simple mobile app.', image_url: '/landing/mobile-sign-in.png' },
];

/** Intrinsic pixel dimensions per screenshot, so each <img> carries a correct
 * aspect ratio (CLS-safe). Desktop captures are 1440×900; the mobile screen is
 * portrait. Falls back to the desktop ratio for CMS-supplied URLs. */
const IMG_DIMENSIONS: Record<string, { w: number; h: number }> = {
  '/landing/dashboard.png': { w: 1440, h: 900 },
  '/landing/client-detail-sessions-notes.png': { w: 1440, h: 900 },
  '/landing/client-detail-overview.png': { w: 1440, h: 900 },
  '/landing/templates.png': { w: 1440, h: 900 },
  '/landing/clients-list.png': { w: 1440, h: 900 },
  '/landing/calendar.png': { w: 1440, h: 900 },
  '/landing/mobile-sign-in.png': { w: 1170, h: 1992 },
};
const dimsFor = (url?: string) => IMG_DIMENSIONS[url || ''] ?? { w: 1440, h: 900 };

export default function FeaturesSection({ section }: Props) {
  const items = section?.content?.items?.length ? section.content.items : DEFAULT_ITEMS;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const n = items.length;
    if (n <= 1) return;
    const id = setInterval(() => setActive((p) => (p + 1) % n), 3000);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <section id="features" style={{ background: '#fff', padding: '88px 0' }}>
      <div className="dc-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 44 }}>
          <div className="dc-eyebrow" style={{ marginBottom: 12 }}>See ANTSA in action</div>
          <h2 className="dc-h2" style={{ marginBottom: 14 }}>
            <span className="hl">One login</span> for your whole practice
          </h2>
          <p className="dc-lead" style={{ maxWidth: 640 }}>
            The core tools you use to support and monitor clients, during sessions and between them.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Screenshot stack */}
          <div
            style={{
              flex: '1.3 1 320px',
              minWidth: 320,
              background: '#F6F7F9',
              border: '1px solid #E6E9EE',
              borderRadius: 18,
              padding: 14,
              boxShadow: '0 18px 48px rgba(15,22,34,.08)',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: 520 }}>
              {items.map((it, i) => {
                const src = it.image_url || DEFAULT_ITEMS[i % DEFAULT_ITEMS.length].image_url;
                const dims = dimsFor(src);
                return (
                  <img
                    key={it.id ?? i}
                    src={src}
                    alt={it.title || ''}
                    width={dims.w}
                    height={dims.h}
                    loading="lazy"
                    decoding="async"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      opacity: i === active ? 1 : 0,
                      zIndex: i === active ? 2 : 1,
                      transition: 'opacity .6s ease',
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Clickable list */}
          <div style={{ flex: '1 1 280px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {items.map((it, i) => {
              const pc = PALETTE[i % PALETTE.length];
              const isActive = i === active;
              return (
                <div key={it.id ?? i} onClick={() => setActive(i)} style={{ borderRadius: 12, cursor: 'pointer' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 13,
                      alignItems: 'flex-start',
                      padding: '11px 14px',
                      borderRadius: 12,
                      background: isActive ? pc.tint : 'transparent',
                      borderLeft: `3px solid ${isActive ? pc.accent : 'transparent'}`,
                      transition: 'background .3s ease, border-color .3s ease',
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: 999, marginTop: 6, flexShrink: 0, background: it.color || pc.accent }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: isActive ? '#0F1622' : '#5B6472' }}>{it.title}</div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#5B6472',
                          lineHeight: 1.5,
                          maxHeight: isActive ? 90 : 0,
                          marginTop: isActive ? 4 : 0,
                          overflow: 'hidden',
                          transition: 'max-height .35s ease, margin .35s ease',
                        }}
                      >
                        {it.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
