export type ConsentCategory = 'analytics' | 'advertising' | 'functional';

export type TrackerRegisterEntry = {
  id: string;
  platform: string;
  technology: string;
  provider: string;
  recipients: string;
  purpose: string;
  category: ConsentCategory | 'essential';
  storage: string;
  duration: string;
  trigger: string;
};

/**
 * Current marketing-site register produced from live traffic and source review
 * on 13 August 2026. CookiePolicy renders it directly; update it whenever a tag
 * or SDK is added, removed, or reconfigured. The cross-platform audit status is
 * reported separately below because native/app technologies are not cookies.
 */
export const TRACKER_REGISTER: TrackerRegisterEntry[] = [
  {
    id: 'antsa-consent-preferences',
    platform: 'Marketing site',
    technology: 'ANTSA consent preferences',
    provider: 'ANTSA Pty Ltd',
    recipients: 'ANTSA only',
    purpose: 'Remember the visitor’s choice and retain a retrievable consent history.',
    category: 'essential',
    storage: 'Local storage: antsa-cookie-consent and antsa-consent-visitor-id',
    duration: '12 months',
    trigger: 'Created only after the visitor makes a choice.',
  },
  {
    id: 'google-analytics-4',
    platform: 'Marketing site',
    technology: 'Google Analytics 4 tag (gtag.js, _ga and _ga_<measurement-id>)',
    provider: 'Google Ireland Limited / Google LLC',
    recipients: 'Google Ireland Limited and Google LLC',
    purpose: 'Measure aggregate page visits and site performance. Advertising signals and personalisation are disabled.',
    category: 'analytics',
    storage: 'First-party analytics cookies _ga and _ga_<measurement-id>',
    duration: 'Up to 2 years',
    trigger: 'Loaded only after Analytics is actively accepted.',
  },
  {
    id: 'azure-arr-affinity',
    platform: 'Marketing site',
    technology: 'ARRAffinity and ARRAffinitySameSite cookies',
    provider: 'Microsoft Azure',
    recipients: 'Microsoft Corporation as ANTSA’s hosting subprocessor',
    purpose: 'Route requests consistently to the Azure server instance that serves the site.',
    category: 'essential',
    storage: 'First-party HTTP cookies',
    duration: 'Session',
    trigger: 'Set by essential hosting infrastructure.',
  },
];

export const AUDIT_SCOPE = [
  {
    platform: 'Marketing site',
    result: 'Live clean-browser audit complete. GA4 is the only optional tag; no Meta, LinkedIn, Google Ads or TikTok advertising pixel was found.',
  },
  {
    platform: 'Client mobile app',
    result: 'Source and production dependency audit found no analytics, advertising or session-replay SDK. Firebase notifications and embedded media require Functional consent. A clean-install physical-device traffic audit remains required.',
  },
  {
    platform: 'Clinician platform',
    result: 'AU production login audit found no advertising tag, session replay or passive third-party request. Authenticated clinical journeys remain in the live audit scope.',
  },
  {
    platform: 'Internal administration platform',
    result: 'AU production login audit found no advertising tag, session replay or passive third-party request. Authenticated administration journeys remain in the live audit scope.',
  },
];

export const CONSENT_BANNER_VERSION = '2026-08-13.1';
export const GOOGLE_ANALYTICS_ID = 'G-207E2PQKJN';
