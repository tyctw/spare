import { appBasePath } from './routes';

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
  '/grade-level': {
    title: '會考等級對照表｜答對題數與積分說明',
    description: '查詢國中教育會考各科等級、標示與答對題數對照，快速了解會考成績的判讀方式。',
  },
  '/historical-stats': {
    title: '歷年會考統計資料｜成績趨勢與級距',
    description: '彙整歷年國中教育會考統計資料與級距資訊，協助考生與家長掌握成績分布及升學趨勢。',
  },
  '/important-dates': {
    title: '會考與免試入學重要日程｜升學時程整理',
    description: '整理國中教育會考、成績查詢與免試入學志願選填的重要時間點；實際日期請以官方公告為準。',
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
  const metadata = pageMetadata[path] || pageMetadata['/'];
  const pageUrl = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;
  const canonicalUrl = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;

  document.title = metadata.title;
  document.documentElement.lang = 'zh-Hant-TW';
  setMetaContent('meta[name="description"]', metadata.description);
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

  // The app lives below /spare/ on GitHub Pages. This keeps future deployments
  // from accidentally emitting root-relative canonical URLs.
  if (appBasePath !== '/spare/') {
    console.warn(`SEO canonical URL is configured for /spare/, but BASE_URL is ${appBasePath}`);
  }
};
