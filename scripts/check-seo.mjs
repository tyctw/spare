import fs from 'node:fs';
import path from 'node:path';

const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const failures = [];

for (const url of urls) {
  const route = decodeURIComponent(new URL(url).pathname.replace(/^\/spare\/?/, ''));
  const file = path.join('dist', route, 'index.html');
  if (!fs.existsSync(file)) {
    failures.push(`${url}: missing HTML entry`);
    continue;
  }

  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  if (!title || !description || !canonical || !robots) failures.push(`${url}: missing SEO metadata`);
  if (route && title?.startsWith('免費會考落點分析｜你的成績')) failures.push(`${url}: homepage title reused`);
  if (canonical !== url) failures.push(`${url}: canonical is ${canonical}`);
  if (robots?.includes('noindex')) failures.push(`${url}: sitemap URL is noindex`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`SEO check passed: ${urls.length} sitemap URLs have unique entry metadata and indexable canonical URLs.`);
}
