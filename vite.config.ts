import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// GitHub Pages serves a 404 response for client-side routes unless each route
// has an index.html. Publish static entry points for every public SEO page so
// the URLs listed in sitemap.xml can be fetched and indexed successfully.
const seoRoutes = [
  'advantages',
  'disclaimer',
  'grade-level',
  'faq-glossary',
  'historical-stats',
  'important-dates',
  'instructions',
  'mock-volunteer',
  'search',
  'holland',
  'school-types',
  'strategy',
  'support',
  'support/failed',
  'support/success',
  'membership',
  'membership/success',
  'after-sales-service',
  'refund-cancellation-policy',
  'vocational-encyclopedia',
  'site-map',
  'privacy',
  'terms',
];

const staticRouteEntries = () => ({
  name: 'static-route-entries',
  // `closeBundle` can run before Vite has written the client output in CI.
  // Generate route entries only after the output directory is available.
  writeBundle(outputOptions: { dir?: string }) {
    const outputDir = outputOptions.dir || path.resolve(__dirname, 'dist');
    const indexFile = path.join(outputDir, 'index.html');

    if (!fs.existsSync(indexFile)) {
      throw new Error(`Static route entry source was not generated: ${indexFile}`);
    }

    for (const route of seoRoutes) {
      const routeDir = path.join(outputDir, route);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.copyFileSync(indexFile, path.join(routeDir, 'index.html'));
    }
  },
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), staticRouteEntries()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    // GitHub Pages serves this project below /spare/. Cloudflare Pages serves
    // it from the domain root, so set VITE_BASE_PATH=/ in its build settings.
    base: env.VITE_BASE_PATH || '/spare/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
