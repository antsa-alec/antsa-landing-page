import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Fires a GA4 page_view event whenever the React Router location changes.
 * Must be used inside a <BrowserRouter> (or equivalent) context.
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', 'page_view', {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location]);
}
