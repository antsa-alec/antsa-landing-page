/**
 * Shape of the global "chrome" data (AppHeader + AppFooter) returned by every
 * page's +data.ts and consumed by +Layout.tsx.
 *
 * Piping this through pageContext (rather than fetching client-side in
 * useEffect) ensures the SSR HTML and the client's first render produce
 * identical output, eliminating hydration mismatches.
 */
export type HeaderConfig = {
  signup_url?: string;
  signup_label?: string;
  signin_url?: string;
  signin_label?: string;
  demo_url?: string;
  demo_label?: string;
};

export type FooterContent = {
  copyright?: string;
  description?: string;
};

export type SocialLink = {
  id: string | number;
  platform: string;
  url: string;
};

export type FooterLink = {
  id: string | number;
  label: string;
  url: string;
};

export type ChromeData = {
  header: HeaderConfig | null;
  footer: FooterContent | null;
  socialLinks: SocialLink[];
  footerLinks: FooterLink[];
};
