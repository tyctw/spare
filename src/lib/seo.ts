import { appBasePath } from './routes';
import { getNewsArticle } from './news';
import { getAreaBySlug } from '../components/AreaPage';

// Per-region metadata for /scoring-rules/:id pages
const SCORING_RULES_META: Record<string, { title: string; description: string; cityKeywords: string }> = {
  taipei: {
    title: '基北區超額比序計分規則｜臺北市、新北市、基隆市免試入學',
    description: '整理 115 學年度基北區（臺北市、新北市、基隆市）免試入學超額比序項目：志願序、多元學習表現與國中教育會考積分換算，最高 108 分；正式規則以簡章為準。',
    cityKeywords: '基北區, 臺北市, 新北市, 基隆市',
  },
  taoyuan: {
    title: '桃連區超額比序計分規則｜桃園市、連江縣免試入學',
    description: '整理 115 學年度桃連區（桃園市、連江縣）免試入學超額比序項目：適性輔導、多元學習表現與國中教育會考積分換算，合計 100 分；正式規則以簡章為準。',
    cityKeywords: '桃連區, 桃園市, 連江縣, 馬祖',
  },
  hsinchu: {
    title: '竹苗區超額比序計分規則｜新竹縣市、苗栗縣免試入學',
    description: '整理 115 學年度竹苗區（新竹縣市、苗栗縣）免試入學超額比序項目：均衡發展、多元學習表現與國中教育會考積分換算，合計 100 分；正式規則以簡章為準。',
    cityKeywords: '竹苗區, 新竹縣, 新竹市, 苗栗縣',
  },
  central: {
    title: '中投區超額比序計分規則｜臺中市、南投縣免試入學',
    description: '整理 115 學年度中投區（臺中市、南投縣）免試入學超額比序項目：志願序、多元學習表現、會考成績與扶助弱勢積分換算；正式規則以簡章為準。',
    cityKeywords: '中投區, 臺中市, 南投縣',
  },
  changhua: {
    title: '彰化區超額比序計分規則｜彰化縣免試入學',
    description: '整理 115 學年度彰化區（彰化縣）免試入學超額比序項目與積分換算規則，協助國中生規劃會考升學志願；正式規則以官方簡章為準。',
    cityKeywords: '彰化區, 彰化縣',
  },
  chiayi: {
    title: '嘉義區超額比序計分規則｜嘉義市、嘉義縣免試入學',
    description: '整理 115 學年度嘉義區（嘉義市、嘉義縣）免試入學超額比序項目與會考積分換算，總分 82 分；正式規則以官方簡章為準。',
    cityKeywords: '嘉義區, 嘉義市, 嘉義縣',
  },
  tainan: {
    title: '臺南區超額比序計分規則｜臺南市免試入學',
    description: '整理 115 學年度臺南區（臺南市）免試入學超額比序項目與積分換算規則，協助國中生規劃會考升學志願；正式規則以官方簡章為準。',
    cityKeywords: '臺南區, 台南區, 臺南市',
  },
  kaohsiung: {
    title: '高雄區超額比序計分規則｜高雄市免試入學',
    description: '整理 115 學年度高雄區（高雄市）免試入學超額比序項目與積分換算規則，協助國中生規劃會考升學志願；正式規則以官方簡章為準。',
    cityKeywords: '高雄區, 高雄市',
  },
};

const siteUrl = 'https://tyctw.github.io/spare';
const siteName = '全國會考落點分析';
const defaultDescription = '你的會考成績，能選哪些高中職？輸入成績與就學區，免費查看落點、探索五專選擇，志願選填更有方向。';

type PageMeta = {
  title: string;
  description: string;
  noindex?: boolean;
};

const pageMetadata: Record<string, PageMeta> = {
  '/': {
    title: '免費會考落點分析｜你的成績，能選哪些高中職？',
    description: defaultDescription,
  },
  '/advantages': {
    title: '關於我們｜全國會考落點分析',
    description: '認識全國會考落點分析如何整理升學資訊，協助國中生與家長規劃高中職、五專志願。',
  },
  '/five-year-college-rules': {
    title: '五專優先免試計分規則｜全國會考落點分析',
    description: '了解五專優先免試入學的積分項目、志願序與同分比序規則，協助規劃適合自己的升學選擇。',
  },
  '/grade-level': {
    title: '會考等級對照表｜答對題數與積分說明',
    description: '查詢國中教育會考各科等級、標示與答對題數對照，快速了解會考成績的判讀方式。',
  },
  '/guide/find': {
    title: '我要查資料｜學校、科別與升學資訊｜全國會考落點分析',
    description: '從學校、科別、群科、學制與歷年資料開始，整理會考升學規劃所需的資訊。',
  },
  '/guide/choose': {
    title: '我要選志願｜會考志願選填工具說明｜全國會考落點分析',
    description: '依成績、興趣與志願順序整理選填方向，使用落點分析與模擬志願序完成規劃。',
  },
  '/guide/plan': {
    title: '我要規劃升學｜探索興趣與升學時程｜全國會考落點分析',
    description: '整合興趣探索、學校類型、重要時程與升學方向，協助學生安排下一步。',
  },
  '/guide/member': {
    title: '會員與資源｜會員方案與升學工具｜全國會考落點分析',
    description: '查看會員資格、免廣告方案與延伸升學資源，持續完成個人升學規劃。',
  },
  '/guide/help': {
    title: '使用協助｜會考落點分析操作說明｜全國會考落點分析',
    description: '查找功能使用說明、常見問題、平台規範與更新資訊，快速取得操作協助。',
  },
  '/grade-11-pathways': {
    title: '高二班群怎麼選？｜全國會考落點分析',
    description: '認識高二班群、自然與社會取向、數學 A／B 及 18 學群，規劃自己的高中學習路徑。',
  },
  '/general-comprehensive-high-school': {
    title: '普通科與綜合高中怎麼選？｜全國會考落點分析',
    description: '比較普通科與綜合高中的課程與探索方向，協助學生選擇適合自己的高中學程。',
  },
  '/faq-glossary': {
    title: '會考常見問答與名詞百科｜全國會考落點分析',
    description: '快速認識會考、免試入學、超額比序、志願序、個別序位、技高與五專等常見升學名詞。',
  },
  '/historical-stats': {
    title: '歷年會考統計資料｜成績趨勢與級距',
    description: '彙整歷年國中教育會考統計資料與級距資訊，協助考生與家長掌握成績分布及升學趨勢。',
  },
  '/important-dates': {
    title: '會考與免試入學重要日程｜升學時程整理',
    description: '整理國中教育會考、成績查詢與免試入學志願選填的重要時間點；實際日期請以官方公告為準。',
  },
  '/news': {
    title: '最新消息｜全國會考落點分析',
    description: '查看本站資料更新、系統公告與教育合作資訊。',
  },
  '/instructions': {
    title: '落點分析使用說明｜會考志願選填指南',
    description: '了解如何輸入會考成績、選擇就學區並閱讀落點分析結果，完成志願選填前的規劃。',
  },
  '/mock-volunteer': {
    title: '模擬志願選填｜高中職與五專志願序規劃',
    description: '依照會考成績與就學區建立模擬志願選填清單，整理高中職與五專校系的志願順序。',
  },
  '/search': {
    title: '高中職、五專學校與科別搜尋｜全國會考落點分析',
    description: '搜尋各就學區高中職、五專與科別資訊，作為會考落點分析及志願選填的參考。',
  },
  '/site-map': {
    title: '網站地圖｜全國會考落點分析',
    description: '瀏覽全國會考落點分析的所有功能與升學資訊頁面，快速找到需要的工具與說明。',
  },
  '/support': {
    title: '小額支持｜升學選校工具',
    description: '支持我們持續維護升學資訊、優化選校工具，讓核心服務免費開放給學生與家長使用。',
  },
  '/support/failed': {
    title: '付款未完成｜小額支持',
    description: '小額支持付款未完成時的重新付款與客服協助說明。',
    noindex: true,
  },
  '/support/success': {
    title: '付款完成｜小額支持',
    description: '感謝支持全國會考落點分析。',
    noindex: true,
  },
  '/after-sales-service': {
    title: '售後服務｜升學選校工具',
    description: '小額支持的售後服務、交易聯絡與付款爭議處理說明。',
  },
  '/refund-cancellation-policy': {
    title: '退款與取消政策｜升學選校工具',
    description: '小額支持的取消、退款申請、原付款方式退回及交易爭議處理政策。',
  },
  '/holland': {
    title: '荷倫碼性向測驗｜探索適合的職群科系',
    description: '透過荷倫碼性向測驗認識個人興趣特質，探索適合的技職群科與升學方向。',
  },
  '/school-types': {
    title: '學校類型解析｜普通高中、技高與五專怎麼選',
    description: '比較普通型高中、技術型高中與五專的特色，協助學生依興趣與升學規劃選擇學校類型。',
  },
  '/strategy': {
    title: '會考志願選填攻略｜落點分析與志願序策略',
    description: '說明會考志願選填原則、個別序位與志願區間策略，協助考生做好免試入學規劃。',
  },
  '/vocational-encyclopedia': {
    title: '職群科系百科｜技職群科與升學方向',
    description: '認識技職教育各職群與科系特色，探索興趣、能力與未來升學方向的連結。',
  },
  '/privacy': {
    title: '隱私權政策｜全國會考落點分析',
    description: '全國會考落點分析的隱私權政策與資料使用說明。',
  },
  '/terms': {
    title: '服務條款｜全國會考落點分析',
    description: '全國會考落點分析的服務條款與使用注意事項。',
  },
  '/results': {
    title: '落點分析結果｜全國會考落點分析',
    description: defaultDescription,
    noindex: true,
  },
};

const setMetaContent = (selector: string, content: string) => {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  if (element) element.content = content;
};

export const applyPageSeo = (path: string) => {
  const newsArticleId = path.match(/^\/news\/(\d+)$/)?.[1];
  const newsArticle = getNewsArticle(newsArticleId);
  const scoringRulesRegionId = path.match(/^\/scoring-rules\/([a-z-]+)$/)?.[1];
  const scoringRulesMeta = scoringRulesRegionId ? SCORING_RULES_META[scoringRulesRegionId] : null;
  const areaSlug = path.match(/^\/area\/([a-z-]+)$/)?.[1];
  const areaData = areaSlug ? getAreaBySlug(areaSlug) : null;
  const metadata = newsArticle
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
  setMetaContent('meta[name="robots"]', metadata.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setMetaContent('meta[name="googlebot"]', metadata.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
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
