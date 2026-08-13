import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { CONSENT_BANNER_VERSION, GOOGLE_ANALYTICS_ID } from './tracker-register';

type Categories = { analytics: boolean; advertising: boolean; functional: boolean };
type ConsentChoice = 'accept_all' | 'reject_all' | 'save_preferences' | 'withdraw';
type StoredConsent = {
  version: string;
  decidedAt: string;
  expiresAt: string;
  categories: Categories;
};
type ConsentEvent = {
  eventId: string;
  visitorId: string;
  timestamp: string;
  choice: ConsentChoice;
  categories: Categories;
  bannerVersion: string;
};

const CONSENT_KEY = 'antsa-cookie-consent';
const VISITOR_KEY = 'antsa-consent-visitor-id';
const PENDING_KEY = 'antsa-consent-pending-events';
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const NONE: Categories = { analytics: false, advertising: false, functional: false };
const ALL: Categories = { analytics: true, advertising: true, functional: true };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag: ((...args: unknown[]) => void) | undefined;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function readStoredConsent(): StoredConsent | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null') as StoredConsent | null;
    if (!parsed?.categories || !parsed.expiresAt || Date.parse(parsed.expiresAt) <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function getVisitorId(): string {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const next = randomId();
  localStorage.setItem(VISITOR_KEY, next);
  return next;
}

function readPendingEvents(): ConsentEvent[] {
  try {
    const value = JSON.parse(localStorage.getItem(PENDING_KEY) ?? '[]') as unknown;
    return Array.isArray(value) ? (value as ConsentEvent[]) : [];
  } catch {
    return [];
  }
}

async function flushPendingEvents(): Promise<void> {
  const pending = readPendingEvents();
  for (const event of pending) {
    try {
      const response = await fetch('/api/consent-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true,
      });
      if (!response.ok) break;
      const remaining = readPendingEvents().filter((candidate) => candidate.eventId !== event.eventId);
      localStorage.setItem(PENDING_KEY, JSON.stringify(remaining));
    } catch {
      break;
    }
  }
}

function queueConsentEvent(choice: ConsentChoice, categories: Categories): void {
  const event: ConsentEvent = {
    eventId: randomId(),
    visitorId: getVisitorId(),
    timestamp: new Date().toISOString(),
    choice,
    categories,
    bannerVersion: CONSENT_BANNER_VERSION,
  };
  localStorage.setItem(PENDING_KEY, JSON.stringify([...readPendingEvents(), event]));
  void flushPendingEvents();
}

function deleteAnalyticsCookies(): void {
  document.cookie.split(';').forEach((rawCookie) => {
    const name = rawCookie.split('=')[0]?.trim();
    if (!name || (name !== '_ga' && !name.startsWith('_ga_'))) return;
    for (const domain of ['', `; domain=${location.hostname}`, '; domain=.antsa.ai']) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax; Secure`;
    }
  });
}

function disableAnalytics(): void {
  window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = true;
  deleteAnalyticsCookies();
  document.querySelector(`script[data-antsa-analytics="${GOOGLE_ANALYTICS_ID}"]`)?.remove();
  window.dataLayer = [];
  delete window.gtag;
}

function enableAnalytics(): void {
  if (document.querySelector(`script[data-antsa-analytics="${GOOGLE_ANALYTICS_ID}"]`)) return;
  window[`ga-disable-${GOOGLE_ANALYTICS_ID}`] = false;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', GOOGLE_ANALYTICS_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
    cookie_flags: 'SameSite=Lax;Secure',
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ANALYTICS_ID)}`;
  script.dataset.antsaAnalytics = GOOGLE_ANALYTICS_ID;
  document.head.appendChild(script);
}

function persistConsent(categories: Categories): StoredConsent {
  const now = new Date();
  const consent: StoredConsent = {
    version: CONSENT_BANNER_VERSION,
    decidedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + YEAR_MS).toISOString(),
    categories,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  return consent;
}

const buttonStyle = (primary: boolean): CSSProperties => ({
  minHeight: 44,
  flex: '1 1 150px',
  borderRadius: 10,
  border: '1px solid #2E96D4',
  background: primary ? '#2E96D4' : '#ffffff',
  color: primary ? '#ffffff' : '#145A83',
  fontWeight: 700,
  fontSize: 14,
  padding: '10px 18px',
  cursor: 'pointer',
});

export default function ConsentManager() {
  const [consent, setConsent] = useState<StoredConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [customising, setCustomising] = useState(false);
  const [draft, setDraft] = useState<Categories>(NONE);
  const hasOptionalConsent = useMemo(
    () => Boolean(consent && Object.values(consent.categories).some(Boolean)),
    [consent],
  );

  useEffect(() => {
    const stored = readStoredConsent();
    setConsent(stored);
    setDraft(stored?.categories ?? NONE);
    setOpen(!stored);
    setReady(true);
    if (stored?.categories.analytics) enableAnalytics();
    else disableAnalytics();
    void flushPendingEvents();
  }, []);

  const choose = (categories: Categories, choice: ConsentChoice) => {
    const next = persistConsent(categories);
    setConsent(next);
    setDraft(categories);
    setOpen(false);
    setCustomising(false);
    if (categories.analytics) enableAnalytics();
    else disableAnalytics();
    queueConsentEvent(choice, categories);
  };

  if (!ready) return null;

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-choices-title"
          style={{
            position: 'fixed',
            zIndex: 10000,
            left: 16,
            right: 16,
            bottom: 16,
            maxWidth: 720,
            margin: '0 auto',
            padding: 24,
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid #C9D8E8',
            boxShadow: '0 18px 60px rgba(15, 22, 34, .24)',
            color: '#0F1622',
          }}
        >
          <h2 id="privacy-choices-title" style={{ margin: '0 0 10px', fontSize: 22 }}>Your privacy choices</h2>
          <p style={{ margin: '0 0 16px', color: '#4D5A69', lineHeight: 1.55, fontSize: 14 }}>
            With permission, we load the Google Analytics tracking tag to measure visits. Google receives usage data.
            We do not use Meta, LinkedIn, Google Ads or TikTok advertising pixels. Rejecting is as easy as accepting,
            and doing nothing loads no optional third-party service. Read our <a href="/cookie-policy">cookie and tracking policy</a>.
          </p>

          {customising && (
            <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
              {([
                ['analytics', 'Analytics', 'Google Analytics aggregate page measurement.'],
                ['advertising', 'Advertising', 'No advertising pixels are currently installed.'],
                ['functional', 'Functional', 'No optional functional third party is currently installed.'],
              ] as const).map(([key, label, description]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #DCE5EE', borderRadius: 10, padding: 12 }}>
                  <input
                    type="checkbox"
                    checked={draft[key]}
                    onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.checked }))}
                    style={{ width: 20, height: 20 }}
                  />
                  <span><strong>{label}</strong><br /><span style={{ color: '#5B6472', fontSize: 13 }}>{description}</span></span>
                </label>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => choose(ALL, 'accept_all')} style={buttonStyle(true)}>Accept all</button>
            <button type="button" onClick={() => choose(NONE, 'reject_all')} style={buttonStyle(true)}>Reject all</button>
            {customising ? (
              <button type="button" onClick={() => choose(draft, 'save_preferences')} style={buttonStyle(false)}>Save choices</button>
            ) : (
              <button type="button" onClick={() => setCustomising(true)} style={buttonStyle(false)}>Choose categories</button>
            )}
          </div>
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => {
            if (hasOptionalConsent) choose(NONE, 'withdraw');
            else setOpen(true);
          }}
          style={{
            position: 'fixed',
            zIndex: 9999,
            right: 14,
            bottom: 14,
            minHeight: 40,
            borderRadius: 999,
            border: '1px solid #C9D8E8',
            background: '#ffffff',
            color: '#145A83',
            padding: '8px 14px',
            fontWeight: 700,
            fontSize: 12,
            boxShadow: '0 5px 18px rgba(15, 22, 34, .16)',
            cursor: 'pointer',
          }}
        >
          {hasOptionalConsent ? 'Withdraw optional consent' : 'Privacy choices'}
        </button>
      )}
    </>
  );
}
