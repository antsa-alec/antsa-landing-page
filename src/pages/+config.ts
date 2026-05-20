import type { Config } from 'vike/types';

export default {
  clientRouting: true,
  hydrationCanBeAborted: true,
  passToClient: ['pageProps', 'data'],
  meta: {
    Head: { env: { server: true } },
    data: { env: { server: true } },
    Layout: {
      env: { server: true, client: true },
    },
  },
} satisfies Config;
