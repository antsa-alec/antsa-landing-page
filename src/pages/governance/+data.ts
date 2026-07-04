import { loadChromeData } from '../../../backend/ssr/data-providers.js';
import type { ChromeData } from '../chrome-data';

export type GovernanceData = { chrome: ChromeData };

export function data(): GovernanceData {
  return { chrome: loadChromeData() as ChromeData };
}
