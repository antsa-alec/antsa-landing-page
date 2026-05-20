import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vike()],
  // SSR data providers under backend/ pull in `better-sqlite3` (a native addon).
  // Keep that module — and the backend code that uses it — out of the Vite SSR
  // bundle so the server requires them straight from node_modules at runtime.
  ssr: {
    // Treat the backend SSR providers (and their native deps) as external so the
    // bundled server entry resolves them from disk at runtime — Vite/Rollup can't
    // serialize the `better-sqlite3` native addon and rewriting `__filename`
    // would corrupt it. We resolve via a relative path from dist/server/entries.
    external: ['better-sqlite3', 'express'],
    noExternal: [],
  },
  resolve: {
    alias: [
      // When the bundle is emitted to dist/server/entries/, it still imports
      // '../../../backend/ssr/data-providers.js' — make sure that path stays
      // intact in the build (don't rewrite it into the bundle).
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_PORT 
          ? `http://localhost:${process.env.VITE_BACKEND_PORT}`
          : 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

