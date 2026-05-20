import { loadChromeData } from '../../../backend/ssr/data-providers.js';
import type { ChromeData } from '../chrome-data';

export type FreeTrialData = { chrome: ChromeData };

export function data(): FreeTrialData {
  return { chrome: loadChromeData() as ChromeData };
}
