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
  'five-year-college-rules',
  'grade-level',
  'grade-11-pathways',
  'general-comprehensive-high-school',
  'faq-glossary',
  'historical-stats',
  'important-dates',
  'instructions',
  'mock-volunteer',
  'search',
  'holland',
  'school-types',
  'scoring-rules/taipei',
  'scoring-rules/taoyuan',
  'scoring-rules/hsinchu',
  'scoring-rules/central',
  'scoring-rules/changhua',
  'scoring-rules/tainan',
  'scoring-rules/kaohsiung',
  'scoring-rules/chiayi',
  'area/keelung-taipei',
  'area/taoyuan',
  'area/hsinchu-miaoli',
  'area/taichung',
  'area/changhua',
  'area/yunlin',
  'area/chiayi',
  'area/tainan',
  'area/kaohsiung',
  'area/pingtung',
  'area/yilan',
  'area/hualien',
  'area/taitung',
  'area/penghu',
  'area/kinmen',
  'strategy',
  'support',
  'support/failed',
  'support/success',
  // The analysis page restores its data from sessionStorage, but it still
  // needs a physical entry point on GitHub Pages to avoid a route-level 404.
  'results',
  // Personal, session-backed tools are deliberately noindex, but still need
  // physical entries so bookmarked in-app routes never return a GitHub 404.
  'compare',
  'membership/account',
  'membership',
  'membership/success',
  'after-sales-service',
  'refund-cancellation-policy',
  'vocational-encyclopedia',
  'site-map',
  'privacy',
  'terms',
  'changelog',
  'report-error',
  'guide/find',
  'guide/choose',
  'guide/plan',
  'guide/member',
  'guide/help',
  'news',
  'news/001',
  'news/002',
  'news/003',
];

const staticNoindexRoutes = new Set([
  'results',
  'compare',
  'membership/account',
  'membership/success',
  'support/failed',
  'support/success',
]);

const staticPageMetadata: Record<string, { title: string; description: string }> = {
  membership: {
    title: '會員方案｜免廣告與升學工具｜全國會考落點分析',
    description: '以 LINE 登入確認會員資格，選擇免廣告方案並持續使用會考落點分析與升學規劃工具。',
  },
  changelog: {
    title: '更新紀錄｜全國會考落點分析',
    description: '查看全國會考落點分析的功能更新、資料調整與服務改善紀錄。',
  },
  'report-error': {
    title: '資料問題回報｜全國會考落點分析',
    description: '回報學校資料、功能操作或升學資訊問題，協助我們持續改善服務品質。',
  },
  disclaimer: {
    title: '免責聲明｜全國會考落點分析',
    description: '說明會考落點分析結果的資料來源、使用範圍與正式招生資訊的確認方式。',
  },
};

const escapeHtmlAttribute = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

function staticRouteHtml(indexHtml: string, route: string) {
  const metadata = staticPageMetadata[route];
  let html = indexHtml;

  if (metadata) {
    const title = escapeHtmlAttribute(metadata.title);
    const description = escapeHtmlAttribute(metadata.description);
    const canonical = `https://tyctw.github.io/spare/${route}`;
    html = html
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${description}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${title}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${description}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${canonical}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*("\s*\/?>)/, `$1${title}$2`)
      .replace(/(<meta name="twitter:description" content=")[^"]*("\s*\/?>)/, `$1${description}$2`)
      .replace(/(<meta name="twitter:url" content=")[^"]*("\s*\/?>)/, `$1${canonical}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${canonical}$2`);
  }

  if (!staticNoindexRoutes.has(route)) return html;

  // Crawlers can inspect a static entry before React has replaced its metadata.
  // Put the noindex directive into the generated HTML as well as runtime SEO.
  return html
    .replace(/(<meta name="robots" content=")[^"]*("\s*\/?>)/, '$1noindex, nofollow$2')
    .replace(/(<meta name="googlebot" content=")[^"]*("\s*\/?>)/, '$1noindex, nofollow$2');
}

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

    const indexHtml = fs.readFileSync(indexFile, 'utf8');
    for (const route of seoRoutes) {
      const routeDir = path.join(outputDir, route);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, 'index.html'), staticRouteHtml(indexHtml, route));
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
    base: '/spare/',
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
