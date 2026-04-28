import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  // Single-page app with no client-side router — disable Vite's SPA fallback
  // so missing /assets/* requests return real 404s and Image.onerror fires.
  appType: 'mpa',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
  server: {
    port: 3001,
    open: false,
    strictPort: true,
  },
});
