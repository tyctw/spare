const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, 'public', 'sitemap.xml');
const TODAY = new Date().toISOString().split('T')[0];

const AUTO_UPDATE_PATTERNS = [
  /\/spare\/area\//,
  /\/spare\/scoring-rules\//,
];

let xml = fs.readFileSync(SITEMAP_PATH, 'utf-8');

xml = xml.replace(/<url>[\s\S]*?<\/url>/g, function(urlBlock) {
  var locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/);
  if (!locMatch) return urlBlock;
  var loc = locMatch[1];
  var shouldUpdate = AUTO_UPDATE_PATTERNS.some(function(p) { return p.test(loc); });
  if (!shouldUpdate) return urlBlock;
  if (urlBlock.indexOf('<lastmod>') !== -1) {
    return urlBlock.replace(/<lastmod>.*?<\/lastmod>/, '<lastmod>' + TODAY + '</lastmod>');
  }
  return urlBlock.replace(/(<loc>.*?<\/loc>)/, '\<lastmod>' + TODAY + '</lastmod>');
});

fs.writeFileSync(SITEMAP_PATH, xml, 'utf-8');
console.log('sitemap.xml lastmod updated to ' + TODAY + ' for area & scoring-rules pages.');
