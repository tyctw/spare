import { ArrowRight, ArrowUpRight, CircleHelp, ExternalLink, Search } from 'lucide-react';
import PageBreadcrumb from './PageBreadcrumb';
import { menuCategories, type MenuItem } from './layout/NavigationDrawer';
import { withBasePath } from '../lib/routes';
import type { CategoryOverviewId } from '../lib/categoryOverview';
import './category-overview-page.css';

type Section = { title: string; description: string; itemIds: string[]; compact?: boolean };
type Overview = {
  title: string;
  eyebrow: string;
  intro: string;
  featuredId: string;
  featuredLabel: string;
  featuredDescription: string;
  steps: string[];
  sections: Section[];
};

const pageContent: Record<CategoryOverviewId, Overview> = {
  choose: {
    title: '成績與志願', eyebrow: '從成績走向選擇',
    intro: '先看懂會考成績，再用落點資料整理候選校科，最後排出自己願意就讀的志願順序。',
    featuredId: 'home', featuredLabel: '開始落點分析', featuredDescription: '輸入成績與就學區，先取得可以討論的校科清單。',
    steps: ['確認正式成績與標示', '用分析結果建立候選清單', '比較條件後調整志願順序'],
    sections: [
      { title: '先掌握成績', description: '官方查詢、個人成績紀錄與歷年分布，從這裡開始。', itemIds: ['scoreInquiry', 'scoreRecords', 'historicalStats'] },
      { title: '把選項排成志願', description: '了解排序原則，再用模擬清單反覆調整。', itemIds: ['strategy', 'mockVolunteer'] },
    ],
  },
  find: {
    title: '學校與科別', eyebrow: '從好奇走向了解',
    intro: '先找到實際開設的學校與科別，再看學制、學習內容與相近職群的差異。',
    featuredId: 'search', featuredLabel: '搜尋學校與科別', featuredDescription: '用校名、科別或地區開始，快速縮小探索範圍。',
    steps: ['搜尋感興趣的學校或科別', '讀懂學制與課程差異', '比較相近職群與實際生活條件'],
    sections: [
      { title: '先認識學校類型', description: '普通型高中、技高、綜高與五專，學習方式各有不同。', itemIds: ['schoolTypes', 'generalComprehensive'] },
      { title: '深入探索技職方向', description: '從職群總覽到每一個科別，再把感興趣的方向並排看。', itemIds: ['vocational', 'departments', 'vocationalCompare'] },
    ],
  },
  scoring: {
    title: '計分與比序', eyebrow: '先看規則，再做判斷',
    intro: '會考等級、就學區積分與同分比序是不同層次的資訊。先選報名管道，再核對適用規則。',
    featuredId: 'gradeLevel', featuredLabel: '先看積分換算', featuredDescription: '釐清會考等級、標示、積分和積點各代表什麼。',
    steps: ['確認就學區或五專管道', '讀懂採計項目與比序順序', '以當年度官方簡章核對'],
    sections: [
      { title: '各就學區計分規則', description: '依要報名的就學區找規則；不同區域的積分與比序不能直接套用。', itemIds: ['scoringTaipei', 'scoringTaoyuan', 'scoringHsinchu', 'scoringCentral', 'scoringChanghua', 'scoringChiayi', 'scoringTainan', 'scoringKaohsiung'], compact: true },
      { title: '五專招生管道', description: '五專優先免試有獨立的採計與比序方式。', itemIds: ['fiveYearCollegeRules'] },
    ],
  },
  plan: {
    title: '升學規劃', eyebrow: '把方向放回自己的生活',
    intro: '興趣、課程、通勤與時間安排都會影響選擇。用這些工具把想法整理成可以討論的規劃。',
    featuredId: 'holland', featuredLabel: '從興趣開始探索', featuredDescription: '透過 Holland 測驗找到值得繼續了解的學習方向。',
    steps: ['整理自己的興趣與限制', '認識高中職後的可能路徑', '追蹤重要日程並定期修正'],
    sections: [
      { title: '檢視學習與生活', description: '把班群、未來進路，以及每天的通勤與費用一起看。', itemIds: ['lifeFeasibility', 'grade11Pathways', 'futurePathways'] },
      { title: '掌握時間與新資訊', description: '先記下關鍵日期，再留意資料更新與公告。', itemIds: ['importantDates', 'news'] },
    ],
  },
  member: {
    title: '會員與資源', eyebrow: '管理資料，延伸探索',
    intro: '集中查看會員狀態、分享資料的管理方式，以及本站提供的外部平台入口。',
    featuredId: 'membershipAccount', featuredLabel: '查看我的會員帳號', featuredDescription: '確認登入狀態、目前方案與到期資訊。',
    steps: ['先確認會員與登入狀態', '按需要管理分享和個人資料', '使用相關平台補充升學資訊'],
    sections: [
      { title: '會員與資料管理', description: '查看方案，以及你分享出去的連結和資料。', itemIds: ['membership', 'privacyCenter'] },
      { title: '延伸平台與社群', description: '這些連結會在新分頁開啟；請留意各平台自己的資料與使用說明。', itemIds: ['officialLine', 'officialVolunteer', 'shared', 'score'] },
    ],
  },
  help: {
    title: '說明與支援', eyebrow: '遇到問題，從這裡找答案',
    intro: '查操作步驟、名詞說明與網站規範；發現資料錯誤時，也有回報入口。',
    featuredId: 'instructions', featuredLabel: '閱讀使用說明', featuredDescription: '第一次使用，先依步驟了解主要功能。',
    steps: ['先找對應功能的說明', '用問答或網站地圖補充查找', '需要時回報具體問題'],
    sections: [
      { title: '使用協助', description: '找名詞、頁面或回報資料問題。', itemIds: ['faqGlossary', 'site-map', 'reportError', 'rating'] },
      { title: '平台資訊與規範', description: '了解網站特色、更新紀錄及使用規範。', itemIds: ['advantages', 'changelog', 'support', 'disclaimer', 'privacy', 'terms'] },
    ],
  },
};

const itemsById = new Map(menuCategories.flatMap((category) => category.items.map((item) => [item.id, item] as const)));
const getItem = (id: string) => itemsById.get(id);
const actionHref = (item: MenuItem) => item.action.type === 'route' ? withBasePath(item.action.href) : item.action.type === 'external' ? item.action.href : withBasePath('/');

function FeatureLink({ item, label, description }: { item: MenuItem; label: string; description: string }) {
  const Icon = item.icon;
  const external = item.action.type === 'external';
  return <a className="category-overview-feature" href={actionHref(item)} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
    <span className="category-overview-feature-icon"><Icon aria-hidden="true" /></span>
    <span className="category-overview-feature-copy"><small>推薦先用</small><strong>{label}</strong><span>{description}</span></span>
    <span className="category-overview-feature-arrow">{external ? <ExternalLink aria-hidden="true" /> : <ArrowUpRight aria-hidden="true" />}</span>
  </a>;
}

function ToolLink({ item, compact }: { item: MenuItem; compact?: boolean }) {
  const Icon = item.icon;
  const external = item.action.type === 'external';
  const modal = item.action.type === 'modal';
  return <a className={`category-overview-tool${compact ? ' category-overview-tool-compact' : ''}`} href={actionHref(item)} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
    <span className="category-overview-tool-icon"><Icon aria-hidden="true" /></span>
    <span className="category-overview-tool-copy"><strong>{item.label}</strong><span>{item.description}</span>{modal && <small>前往首頁開啟</small>}</span>
    {external ? <ExternalLink className="category-overview-tool-arrow" aria-hidden="true" /> : <ArrowRight className="category-overview-tool-arrow" aria-hidden="true" />}
  </a>;
}

export default function CategoryOverviewPage({ categoryId }: { categoryId: CategoryOverviewId }) {
  const page = pageContent[categoryId];
  const featured = getItem(page.featuredId)!;

  return <main className="category-overview-page" data-category={categoryId}>
    <div className="category-overview-shell"><PageBreadcrumb title={page.title} /></div>
    <header className="category-overview-hero"><div className="category-overview-shell category-overview-hero-grid">
      <div className="category-overview-hero-copy"><p className="category-overview-eyebrow">探索指南 <span>/</span> {page.eyebrow}</p><h1>{page.title}</h1><p className="category-overview-lead">{page.intro}</p><a className="category-overview-start" href={actionHref(featured)}>{page.featuredLabel}<ArrowRight size={18} aria-hidden="true" /></a></div>
      <div className="category-overview-sequence"><span>建議怎麼開始</span><ol>{page.steps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, '0')}</b><span>{step}</span></li>)}</ol></div>
    </div></header>

    <div className="category-overview-shell category-overview-content">
      <section className="category-overview-start-section" aria-labelledby="category-start-heading"><div className="category-overview-heading"><p>START HERE</p><h2 id="category-start-heading">先從這裡開始</h2></div><FeatureLink item={featured} label={page.featuredLabel} description={page.featuredDescription} /></section>
      {page.sections.map((section, index) => <section className="category-overview-section" key={section.title} aria-labelledby={`category-section-${index}`}><div className="category-overview-section-heading"><div><p>{String(index + 1).padStart(2, '0')} / EXPLORE</p><h2 id={`category-section-${index}`}>{section.title}</h2><span>{section.description}</span></div><small>{section.itemIds.length} 個入口</small></div><div className={`category-overview-tools${section.compact ? ' category-overview-tools-compact' : ''}`}>{section.itemIds.map((id) => { const item = getItem(id); return item ? <ToolLink key={id} item={item} compact={section.compact} /> : null; })}</div></section>)}
      <aside className="category-overview-help"><div><span className="category-overview-help-icon"><Search aria-hidden="true" /></span><div><p>找不到需要的內容？</p><h2>從網站地圖繼續找</h2><span>也可以查看操作說明與常見問答。</span></div></div><a href={withBasePath('/site-map')}>查看所有頁面<ArrowRight size={17} aria-hidden="true" /></a><a className="category-overview-help-secondary" href={withBasePath('/guide/help')}>使用協助<CircleHelp size={17} aria-hidden="true" /></a></aside>
    </div>
  </main>;
}
