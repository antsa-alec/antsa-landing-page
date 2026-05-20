import { loadHelpForFrontend } from '../../../backend/ssr/data-providers.js';

export type HelpData = ReturnType<typeof loadHelpForFrontend>;

export function data(): HelpData {
  return loadHelpForFrontend();
}
