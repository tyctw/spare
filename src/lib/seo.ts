import { pageMetadata, SCORING_RULES_META } from './seoMetadata';
import { appBasePath } from './routes';
import { getNewsArticle } from './news';
import { getAreaBySlug } from './areaData';
import { getDepartmentFromPath } from './vocationalDepartments';

const siteUrl = 'https://tyctw.github.io/spare';
const siteName = '全國會考落點分析';
const setMetaContent = (selector: string, content: string) => {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
};

export const applyPageSeo = (path: string) => {
  const departmentSegment = path.match(/^\/departments\/([^/]+)$/)?.[1];
  const department = departmentSegment ? getDepartmentFromPath(departmentSegment) : undefined;
  const newsArticleId = path.match(/^\/news\/(\d+)$/)?.[1];
  const newsArticle = getNewsArticle(newsArticleId);
  const scoringRulesRegionId = path.match(/^\/scoring-rules\/([a-z-]+)$/)?.[1];
  const scoringRulesMeta = scoringRulesRegionId ? SCORING_RULES_META[scoringRulesRegionId] : null;
  const areaSlug = path.match(/^\/area\/([a-z-]+)$/)?.[1];
  const areaData = areaSlug ? getAreaBySlug(areaSlug) : null;
  const isSharedReport = /^\/shared\/[0-9a-f-]+$/i.test(path);
  const metadata = isSharedReport
    ? { title: '已分享的志願規劃｜全國會考落點分析', description: '此連結包含使用者分享的個人規劃資料。', noindex: true, nofollow: true }
    : department
    ? { title: `${department.name}介紹｜${department.group}科別探索`, description: `${department.intro}查看${department.name}的實作方向、選校核對與相關科別。` }
    : departmentSegment
    ? { title: '找不到科別｜全國會考落點分析', description: '返回科別總覽，重新搜尋技術型高中科別。', noindex: true }
    : newsArticle
    ? { title: `${newsArticle.title}｜全國會考落點分析`, description: newsArticle.summary }
    : scoringRulesMeta
    ? { title: scoringRulesMeta.title, description: scoringRulesMeta.description }
    : path.startsWith('/scoring-rules/')
    ? { title: '各就學區超額比序計分規則｜全國會考落點分析', description: '整理各就學區免試入學超額比序項目、會考換算與官方簡章入口；正式規則以當學年度公告為準。' }
    : areaData
    ? { title: `${areaData.name}會考落點分析｜${areaData.cities}免試入學志願選填`, description: areaData.description }
    : path.startsWith('/area/')
    ? { title: '各就學區會考落點分析｜全國會考落點分析', description: '查詢全國 15 個免試入學就學區的會考落點分析與志願選填資訊。' }
    : pageMetadata[path] || pageMetadata['/'];
  const pageUrl = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;
  const canonicalUrl = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;

  document.title = metadata.title;
  document.documentElement.lang = 'zh-Hant-TW';
  setMetaContent('meta[name="description"]', metadata.description);
  if (areaData) {
    setMetaContent('meta[name="keywords"]', areaData.keywords.join(', '));
  } else if (scoringRulesMeta && scoringRulesRegionId) {
    setMetaContent('meta[name="keywords"]', `超額比序, 免試入學, 會考, ${scoringRulesMeta.cityKeywords}, 志願選填, 計分規則`);
  }
  const robots = metadata.noindex
    ? `noindex, ${metadata.nofollow ? 'nofollow' : 'follow'}`
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  setMetaContent('meta[name="robots"]', robots);
  setMetaContent('meta[name="googlebot"]', metadata.noindex ? robots : 'index, follow, max-image-preview:large');
  setMetaContent('meta[property="og:title"]', metadata.title);
  setMetaContent('meta[property="og:description"]', metadata.description);
  setMetaContent('meta[property="og:url"]', pageUrl);
  setMetaContent('meta[name="twitter:title"]', metadata.title);
  setMetaContent('meta[name="twitter:description"]', metadata.description);
  setMetaContent('meta[name="twitter:url"]', pageUrl);

  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = canonicalUrl;

  document.getElementById('news-article-structured-data')?.remove();
  if (newsArticle) {
    const structuredData = document.createElement('script');
    structuredData.id = 'news-article-structured-data';
    structuredData.type = 'application/ld+json';
    structuredData.text = JSON.stringify({ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: newsArticle.title, description: newsArticle.summary, datePublished: newsArticle.publishedAt, dateModified: newsArticle.publishedAt, mainEntityOfPage: canonicalUrl, publisher: { '@type': 'Organization', name: siteName, url: siteUrl } });
    document.head.appendChild(structuredData);
  }

  document.getElementById('scoring-rules-structured-data')?.remove();
  if (scoringRulesMeta && scoringRulesRegionId) {
    const regionStructuredData = document.createElement('script');
    regionStructuredData.id = 'scoring-rules-structured-data';
    regionStructuredData.type = 'application/ld+json';
    regionStructuredData.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': '首頁', 'item': `${siteUrl}/` },
            { '@type': 'ListItem', 'position': 2, 'name': '各區比序規則', 'item': `${siteUrl}/scoring-rules/taipei` },
            { '@type': 'ListItem', 'position': 3, 'name': scoringRulesMeta.title.split('｜')[0], 'item': canonicalUrl },
          ],
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          'url': canonicalUrl,
          'name': scoringRulesMeta.title,
          'description': scoringRulesMeta.description,
          'inLanguage': 'zh-Hant-TW',
          'keywords': `超額比序, 免試入學, 會考, ${scoringRulesMeta.cityKeywords}, 志願選填, 計分規則`,
          'isPartOf': { '@id': `${siteUrl}/#website` },
          'publisher': { '@type': 'Organization', 'name': siteName, 'url': `${siteUrl}/` },
        },
      ],
    });
    document.head.appendChild(regionStructuredData);
  }

  document.getElementById('area-page-structured-data')?.remove();
  if (areaData) {
    const areaStructuredData = document.createElement('script');
    areaStructuredData.id = 'area-page-structured-data';
    areaStructuredData.type = 'application/ld+json';
    areaStructuredData.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': '首頁', 'item': `${siteUrl}/` },
            { '@type': 'ListItem', 'position': 2, 'name': `${areaData.name}會考落點分析`, 'item': canonicalUrl },
          ],
        },
        {
          '@type': 'FAQPage',
          'mainEntity': areaData.faqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.q,
            'acceptedAnswer': { '@type': 'Answer', 'text': faq.a },
          })),
        },
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          'url': canonicalUrl,
          'name': `${areaData.name}會考落點分析`,
          'description': areaData.description,
          'inLanguage': 'zh-Hant-TW',
          'keywords': areaData.keywords.join(', '),
          'isPartOf': { '@id': `${siteUrl}/#website` },
          'publisher': { '@type': 'Organization', 'name': siteName, 'url': `${siteUrl}/` },
        },
      ],
    });
    document.head.appendChild(areaStructuredData);
  }

  // The app lives below /spare/ on GitHub Pages. This keeps future deployments
  // from accidentally emitting root-relative canonical URLs.
  if (appBasePath !== '/spare/') {
    console.warn(`SEO canonical URL is configured for /spare/, but BASE_URL is ${appBasePath}`);
  }
};
