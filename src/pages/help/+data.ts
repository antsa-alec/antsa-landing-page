import { loadHelpForFrontend, loadChromeData } from '../../../backend/ssr/data-providers.js';
import type { ChromeData } from '../chrome-data';

export type HelpData = ReturnType<typeof loadHelpForFrontend> & { chrome: ChromeData };

export function data(): HelpData {
  return {
    ...loadHelpForFrontend(),
    chrome: loadChromeData() as ChromeData,
  };
}
