import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone build for the React-Router admin SPA (index.html + src/main.tsx,
// whose routes include /admin/*).
//
// The primary `vite build` uses the vike() plugin and emits ONLY the SSR
// marketing bundle (dist/client + dist/server) — it does NOT build this SPA.
// When vike was added, the admin SPA silently stopped being built, so the
// deployed /admin shell referenced a bundle that no longer existed (404 →
// blank admin). Build the SPA here, into dist/client with emptyOutDir:false so
// the vike output is preserved. Its hashed assets then live under
// dist/client/assets/* and are served by the server's
// express.static(dist/client) mount at /assets/*, and the /admin carve-out in
// backend/server.js serves dist/client/index.html.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    emptyOutDir: false,
  },
})
