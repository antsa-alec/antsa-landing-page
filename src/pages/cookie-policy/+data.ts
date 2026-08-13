import { loadChromeData } from '../../../backend/ssr/data-providers.js';
import type { ChromeData } from '../chrome-data';

export type CookiePolicyData = { chrome: ChromeData };

export function data(): CookiePolicyData {
  return { chrome: loadChromeData() as ChromeData };
}
