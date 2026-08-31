import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Building2, Calculator, CalendarDays, CheckCircle2, Compass, Crown, ExternalLink, FileText, GraduationCap, HeartHandshake, HelpCircle, History, LineChart, Map, MapPin, Megaphone, Search, Shield, Sparkles, Target, UserRound } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import MissingFeatureCard from './MissingFeatureCard';

type Item = { title: string; desc: string; href: string; icon: React.ElementType; tone: string; external?: boolean; keywords: string };
type Category = { title: string; desc: string; items: Item[] };

const categories: Category[] = [
  { title: '先完成落點分析', desc: '第一次使用時，從這三個入口開始最快。', items: [
    { title: '開始落點分析', desc: '輸入邀請碼、就學區、偏好與會考成績，取得推薦校科。', href: '/', icon: Compass, tone: 'bg-indigo-100 text-indigo-700', keywords: '首頁 分析 成績 邀請碼 結果' },
    { title: '使用說明', desc: '用六個步驟完成資料輸入，並知道結果該怎麼看。', href: '/instructions', icon: HelpCircle, tone: 'bg-blue-100 text-blue-700', keywords: '教學 說明 步驟 怎麼用' },
    { title: '會考成績等級', desc: '確認 A、B、C 與標示、寫作級分的填寫方式。', href: '/grade-level', icon: GraduationCap, tone: 'bg-rose-100 text-rose-700', keywords: 'A++ A+ B++ 等級 標示 寫作' },
  ] },
  { title: '探索學校與方向', desc: '還沒決定想讀什麼？從學校類型、興趣與群科開始。', items: [
    { title: '搜尋學校與科別', desc: '依學校、科別、群別、縣市或校科代碼快速查找。', href: '/search', icon: Search, tone: 'bg-sky-100 text-sky-700', keywords: '搜尋 學校 科別 群別 縣市' },
    { title: '學校類型解析', desc: '比較普高、技高、綜高、單科型高中與五專的差異。', href: '/school-types', icon: Building2, tone: 'bg-sky-100 text-sky-700', keywords: '普高 技高 綜高 五專 高中 高職' },
    { title: '普通科與綜合高中，怎麼選？', desc: '了解普通科、綜合高中學程的差異，以及適合的探索方向。', href: '/general-comprehensive-high-school', icon: GraduationCap, tone: 'bg-violet-100 text-violet-700', keywords: '普通科 綜合高中 綜高 學程 高中 選擇' },
    { title: '高二「班群」是什麼？怎麼選？', desc: '認識自然、社會取向、數學 A／B 與 18 學群的規劃方式。', href: '/grade-11-pathways', icon: Compass, tone: 'bg-fuchsia-100 text-fuchsia-700', keywords: '高二 班群 自然組 社會組 數學A 數學B 18學群 分組' },
    { title: '技職群科百科', desc: '認識技職群別、常見科別、學習特質與未來進路。', href: '/vocational-encyclopedia', icon: BookOpen, tone: 'bg-emerald-100 text-emerald-700', keywords: '技職 群科 科別 專業 高職' },
    { title: 'Holland 興趣測驗', desc: '完成簡易興趣測驗，取得 RIASEC 類型與群科探索方向。', href: '/holland', icon: Sparkles, tone: 'bg-purple-100 text-purple-700', keywords: '興趣 測驗 holland RIASEC 性向' },
  ] },
  { title: '規劃與選填志願', desc: '有了方向後，用資料與工具把選項排成可執行的志願清單。', items: [
    { title: '模擬志願序', desc: '搜尋校科加入清單，自行調整順序並列印草稿。', href: '/mock-volunteer', icon: Target, tone: 'bg-amber-100 text-amber-700', keywords: '模擬 志願序 排序 選填' },
    { title: '填志願策略', desc: '了解夢幻、實際、保守志願的安排原則與常見提醒。', href: '/strategy', icon: CheckCircle2, tone: 'bg-orange-100 text-orange-700', keywords: '策略 夢幻 實際 保守 志願' },
    { title: '歷年會考統計', desc: '查看歷年等級組合與分布，理解成績的整體趨勢。', href: '/historical-stats', icon: LineChart, tone: 'bg-indigo-100 text-indigo-700', keywords: '歷年 統計 分布 成績 趨勢' },
    { title: '重要日期', desc: '整理招生與選填時程的關鍵日期；實際日期請以當年度公告為準。', href: '/important-dates', icon: CalendarDays, tone: 'bg-purple-100 text-purple-700', keywords: '日期 時程 報名 選填 放榜' },
  ] },
  { title: '會員與最新消息', desc: '查看網站公告，或管理你的免廣告會員資格。', items: [
    { title: '最新消息', desc: '查看系統公告、資料更新與重要考試資訊。', href: '/news', icon: Megaphone, tone: 'bg-rose-100 text-rose-700', keywords: '最新 消息 公告 更新 116 考試 日期' },
    { title: '會員免廣告', desc: '使用 LINE 登入確認資格，選擇免廣告方案。', href: '/membership', icon: Crown, tone: 'bg-violet-100 text-violet-700', keywords: '會員 免廣告 LINE 付款 月費 年費 方案' },
    { title: '我的會員帳號', desc: '查看目前方案、到期日與 LINE 登入狀態。', href: '/membership/account', icon: UserRound, tone: 'bg-emerald-100 text-emerald-700', keywords: '會員 帳號 到期 日 LINE 登入 免廣告' },
  ] },
  { title: '各就學區會考落點分析', desc: '查詢全國 15 個免試入學就學區的會考落點分析專頁，包含區域升學資訊、工具連結與常見問答。', items: [
    { title: '基北區', desc: '臺北市、新北市、基隆市的會考落點分析與志願選填。', href: '/area/keelung-taipei', icon: MapPin, tone: 'bg-indigo-100 text-indigo-700', keywords: '基北 台北 新北 基隆 落點 分析 會考' },
    { title: '桃連區', desc: '桃園市、連江縣的會考落點分析與志願選填。', href: '/area/taoyuan', icon: MapPin, tone: 'bg-emerald-100 text-emerald-700', keywords: '桃連 桃園 連江 落點 分析 會考' },
    { title: '竹苗區', desc: '新竹縣市、苗栗縣的會考落點分析與志願選填。', href: '/area/hsinchu-miaoli', icon: MapPin, tone: 'bg-fuchsia-100 text-fuchsia-700', keywords: '竹苗 新竹 苗栗 落點 分析 會考' },
    { title: '中投區', desc: '臺中市、南投縣的會考落點分析與志願選填。', href: '/area/taichung', icon: MapPin, tone: 'bg-amber-100 text-amber-700', keywords: '中投 台中 臺中 南投 落點 分析 會考' },
    { title: '彰化區', desc: '彰化縣的會考落點分析與志願選填。', href: '/area/changhua', icon: MapPin, tone: 'bg-rose-100 text-rose-700', keywords: '彰化 落點 分析 會考' },
    { title: '雲林區', desc: '雲林縣的會考落點分析與志願選填。', href: '/area/yunlin', icon: MapPin, tone: 'bg-lime-100 text-lime-700', keywords: '雲林 落點 分析 會考' },
    { title: '嘉義區', desc: '嘉義縣市的會考落點分析與志願選填。', href: '/area/chiayi', icon: MapPin, tone: 'bg-teal-100 text-teal-700', keywords: '嘉義 落點 分析 會考' },
    { title: '臺南區', desc: '臺南市的會考落點分析與志願選填。', href: '/area/tainan', icon: MapPin, tone: 'bg-sky-100 text-sky-700', keywords: '台南 臺南 落點 分析 會考' },
    { title: '高雄區', desc: '高雄市的會考落點分析與志願選填。', href: '/area/kaohsiung', icon: MapPin, tone: 'bg-orange-100 text-orange-700', keywords: '高雄 落點 分析 會考' },
    { title: '屏東區', desc: '屏東縣的會考落點分析與志願選填。', href: '/area/pingtung', icon: MapPin, tone: 'bg-yellow-100 text-yellow-700', keywords: '屏東 落點 分析 會考' },
    { title: '宜蘭區', desc: '宜蘭縣的會考落點分析與志願選填。', href: '/area/yilan', icon: MapPin, tone: 'bg-cyan-100 text-cyan-700', keywords: '宜蘭 落點 分析 會考' },
    { title: '花蓮區', desc: '花蓮縣的會考落點分析與志願選填。', href: '/area/hualien', icon: MapPin, tone: 'bg-green-100 text-green-700', keywords: '花蓮 落點 分析 會考' },
    { title: '臺東區', desc: '臺東縣的會考落點分析與志願選填。', href: '/area/taitung', icon: MapPin, tone: 'bg-pink-100 text-pink-700', keywords: '台東 臺東 落點 分析 會考' },
    { title: '澎湖區', desc: '澎湖縣的會考落點分析與志願選填。', href: '/area/penghu', icon: MapPin, tone: 'bg-blue-100 text-blue-700', keywords: '澎湖 落點 分析 會考' },
    { title: '金門區', desc: '金門縣的會考落點分析與志願選填。', href: '/area/kinmen', icon: MapPin, tone: 'bg-stone-100 text-stone-700', keywords: '金門 落點 分析 會考' },
  ] },
  { title: '各區計分規則', desc: '查看一般免試入學的超額比序架構、會考換算與官方簡章入口；正式規定請以當年度公告為準。', items: [
    { title: '基北區計分規則', desc: '基隆、臺北、新北的超額比序與會考換算。', href: '/scoring-rules/taipei', icon: Calculator, tone: 'bg-indigo-100 text-indigo-700', keywords: '基北 基隆 台北 臺北 新北 計分 規則 超額比序' },
    { title: '桃連區計分規則', desc: '桃園、連江的超額比序與會考換算。', href: '/scoring-rules/taoyuan', icon: Calculator, tone: 'bg-emerald-100 text-emerald-700', keywords: '桃連 桃園 連江 計分 規則 超額比序' },
    { title: '中投區計分規則', desc: '臺中、南投的超額比序與會考換算。', href: '/scoring-rules/central', icon: Calculator, tone: 'bg-amber-100 text-amber-700', keywords: '中投 台中 臺中 南投 計分 規則 超額比序' },
    { title: '彰化區計分規則', desc: '彰化的超額比序與會考換算。', href: '/scoring-rules/changhua', icon: Calculator, tone: 'bg-rose-100 text-rose-700', keywords: '彰化 計分 規則 超額比序' },
    { title: '嘉義區計分規則', desc: '嘉義縣市的超額比序與會考換算。', href: '/scoring-rules/chiayi', icon: Calculator, tone: 'bg-teal-100 text-teal-700', keywords: '嘉義 計分 規則 超額比序' },
    { title: '臺南區計分規則', desc: '臺南的超額比序與會考換算。', href: '/scoring-rules/tainan', icon: Calculator, tone: 'bg-sky-100 text-sky-700', keywords: '台南 臺南 計分 規則 超額比序' },
    { title: '高雄區計分規則', desc: '高雄的超額比序與會考換算。', href: '/scoring-rules/kaohsiung', icon: Calculator, tone: 'bg-orange-100 text-orange-700', keywords: '高雄 計分 規則 超額比序' },
    { title: '竹苗區計分規則', desc: '新竹、苗栗的超額比序與會考換算。', href: '/scoring-rules/hsinchu', icon: Calculator, tone: 'bg-fuchsia-100 text-fuchsia-700', keywords: '竹苗 新竹 苗栗 計分 規則 超額比序' },
    { title: '五專優先免試計分規則', desc: '查看五專優先免試入學的積分項目與同分比序參考。', href: '/five-year-college-rules', icon: GraduationCap, tone: 'bg-emerald-100 text-emerald-700', keywords: '五專 優先免試 聯合免試 積分 志願序 比序' },
  ] },
  { title: '說明、資料與網站資訊', desc: '查名詞、了解資料限制，或查看網站相關資訊。', items: [
    { title: '常見問答與名詞百科', desc: '快速理解會考、超額比序、序位、志願序與五專等名詞。', href: '/faq-glossary', icon: HelpCircle, tone: 'bg-cyan-100 text-cyan-700', keywords: 'FAQ 名詞 超額比序 序位 問答' },
    { title: '系統優點與關於我們', desc: '了解本站設計理念、資料使用原則與功能定位。', href: '/advantages', icon: HeartHandshake, tone: 'bg-indigo-100 text-indigo-700', keywords: '關於 系統 優點 理念' },
    { title: '更新日誌', desc: '查看功能新增、調整與修正紀錄。', href: '/changelog', icon: History, tone: 'bg-slate-100 text-slate-700', keywords: '更新 版本 日誌 修正' },
    { title: '隱私權政策', desc: '了解本站處理輸入資料與瀏覽資訊的原則。', href: '/privacy', icon: Shield, tone: 'bg-emerald-100 text-emerald-700', keywords: '隱私 個資 資料 政策' },
    { title: '服務條款', desc: '閱讀服務使用範圍、責任限制與相關規範。', href: '/terms', icon: FileText, tone: 'bg-slate-100 text-slate-700', keywords: '條款 規範 服務' },
    { title: '免責聲明', desc: '了解分析結果的使用限制與選填前必做確認。', href: '/disclaimer', icon: Shield, tone: 'bg-amber-100 text-amber-700', keywords: '免責 聲明 分析 限制 錄取 保證' },
  ] },
  { title: '外部查詢資源', desc: '這些連結會開啟外部網站，資料與規則請以該網站公告為準。', items: [
    { title: '序位查詢', desc: '前往外部序位查詢服務。', href: 'https://tyctw.github.io/volunteer/', icon: BarChart3, tone: 'bg-orange-100 text-orange-700', external: true, keywords: '外部 序位 查詢' },
    { title: '全國錄取分享', desc: '前往全國錄取結果分享平台。', href: 'https://tyctw.github.io/shared/', icon: Map, tone: 'bg-indigo-100 text-indigo-700', external: true, keywords: '外部 錄取 分享 結果' },
    { title: '全國序位分享', desc: '前往全國序位分享平台。', href: 'https://tyctw.github.io/score/', icon: BarChart3, tone: 'bg-emerald-100 text-emerald-700', external: true, keywords: '外部 序位 分享 成績' },
  ] },
];

const quickLinks = categories.slice(0, 3).flatMap((category) => category.items).filter((item) => ['開始落點分析', '搜尋學校與科別', '模擬志願序'].includes(item.title));

const searchAliases: Record<string, string> = {
  '/': '首頁 總覽 升學 高中 職校',
  '/search': '學校 高中 高職 綜高 職科 科別 查詢 搜尋',
  '/mock-volunteer': '志願 志願序 模擬 選填',
  '/strategy': '策略 填志願 選填 志願序',
  '/grade-level': '會考 成績 等級 A++ A+ B++ 寫作',
  '/important-dates': '日期 時程 報名 放榜 會考',
  '/news': '最新 消息 公告 資料 更新',
  '/membership': '會員 免廣告 LINE 付款 月費 年費',
  '/membership/account': '會員 帳號 資格 到期 LINE 登入',
  '/area/keelung-taipei': '基北 台北 新北 基隆 落點 分析 會考 志願',
  '/area/taoyuan': '桃連 桃園 連江 落點 分析 會考 志願',
  '/area/hsinchu-miaoli': '竹苗 新竹 苗栗 落點 分析 會考 志願',
  '/area/taichung': '中投 台中 臺中 南投 落點 分析 會考 志願',
  '/area/changhua': '彰化 落點 分析 會考 志願',
  '/area/yunlin': '雲林 落點 分析 會考 志願',
  '/area/chiayi': '嘉義 落點 分析 會考 志願',
  '/area/tainan': '台南 臺南 落點 分析 會考 志願',
  '/area/kaohsiung': '高雄 落點 分析 會考 志願',
  '/area/pingtung': '屏東 落點 分析 會考 志願',
  '/area/yilan': '宜蘭 落點 分析 會考 志願',
  '/area/hualien': '花蓮 落點 分析 會考 志願',
  '/area/taitung': '台東 臺東 落點 分析 會考 志願',
  '/area/penghu': '澎湖 落點 分析 會考 志願',
  '/area/kinmen': '金門 落點 分析 會考 志願',
  '/scoring-rules/taipei': '基北 台北 新北 基隆 免試 比序 積分 會考',
  '/scoring-rules/taoyuan': '桃連 桃園 連江 免試 比序 積分 會考',
  '/scoring-rules/central': '中投 台中 免試 比序 積分 會考',
  '/scoring-rules/changhua': '彰化 免試 比序 積分 會考',
  '/scoring-rules/chiayi': '嘉義 免試 比序 積分 會考',
  '/scoring-rules/tainan': '台南 臺南 免試 比序 積分 會考',
  '/scoring-rules/kaohsiung': '高雄 免試 比序 積分 會考',
  '/scoring-rules/hsinchu': '竹苗 新竹 苗栗 免試 比序 積分 會考',
  '/five-year-college-rules': '五專 優先免試 聯合免試 比序 積分',
};

const normalizeSearch = (value: string) => value
  .normalize('NFKC')
  .toLowerCase()
  .replace(/[臺台]/g, '台')
  .replace(/\s+/g, ' ')
  .trim();

export default function SiteMapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = useMemo(() => {
    const tokens = normalizeSearch(searchTerm).split(' ').filter(Boolean);
    if (!tokens.length) return categories;
    return categories.map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const content = normalizeSearch(`${category.title} ${category.desc} ${item.title} ${item.desc} ${item.keywords} ${searchAliases[item.href] ?? ''}`);
        return tokens.every((token) => content.includes(token));
      }),
    })).filter((category) => category.items.length > 0);
  }, [searchTerm]);
  const count = filtered.reduce((total, category) => total + category.items.length, 0);

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-amber-50"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><ArrowLeft className="h-4 w-4" />返回首頁</a><div className="py-10"><div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-100"><Map className="h-6 w-6 text-amber-700" /></div><div><p className="text-xs font-black uppercase tracking-widest text-slate-500">Site Map</p><p className="text-sm font-black text-slate-700">從需求找到正確工具</p></div></div><h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">網站地圖</h1><p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">不知道下一步該做什麼？先從「開始落點分析」完成基本資料；想探索方向，就看學校類型、群科或興趣測驗；準備選填時，再使用策略與模擬志願序。</p></div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"><section className="rounded-2xl border-4 border-slate-900 bg-slate-900 p-5 text-white shadow-[5px_5px_0px_0px_rgba(245,158,11,1)] sm:p-6"><p className="text-xs font-black tracking-widest text-amber-200">快速開始</p><h2 className="mt-2 text-2xl font-black">你現在最需要哪一個？</h2><div className="mt-5 grid gap-3 md:grid-cols-3">{quickLinks.map((item) => { const Icon = item.icon; return <a key={item.title} href={withBasePath(item.href)} className="group rounded-xl border-2 border-white bg-white p-4 text-slate-900 transition hover:-translate-y-0.5"><Icon className="h-6 w-6 text-amber-700" /><h3 className="mt-3 text-lg font-black">{item.title}</h3><p className="mt-1 text-sm font-bold leading-6 text-slate-600">{item.desc}</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-amber-700">前往工具 <ArrowRight className="h-4 w-4 group-hover:translate-x-1" /></span></a>; })}</div></section>
      <div className="mt-7 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="搜尋功能、頁面或關鍵字，例如：五專、序位、匯出…" className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 py-3 pl-12 pr-4 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-amber-300/40" /></div><div className="flex items-center justify-between gap-3 lg:justify-end"><span className="rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-600">找到 {count} 個功能</span>{searchTerm && <button type="button" onClick={() => setSearchTerm('')} className="rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black">清除</button>}</div></div></div>
      <div className="mt-7 grid gap-6">{filtered.length === 0 ? <div className="rounded-2xl border-4 border-dashed border-slate-300 bg-white p-10 text-center"><Search className="mx-auto h-12 w-12 text-slate-300" /><h2 className="mt-4 text-2xl font-black text-slate-700">找不到相關功能</h2><p className="mt-2 text-sm font-bold text-slate-500">試著改用較短的關鍵字，或清除搜尋後查看完整地圖。</p></div> : filtered.map((category) => <section key={category.title} className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-7"><div className="mb-5"><h2 className="text-2xl font-black sm:text-3xl">{category.title}</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-600">{category.desc}</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{category.items.map((item) => { const Icon = item.icon; const href = item.external ? item.href : withBasePath(item.href); return <a key={item.title} href={href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} className="group rounded-2xl border-2 border-slate-900 bg-slate-50 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:shadow-none"><div className="flex items-start gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 ${item.tone}`}><Icon className="h-5 w-5" /></div><div><div className="flex items-center gap-2"><h3 className="text-lg font-black leading-tight">{item.title}</h3>{item.external && <ExternalLink className="h-4 w-4 text-slate-400" />}</div><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{item.desc}</p></div></div></a>; })}</div></section>)}<MissingFeatureCard /></div>
    </section>
  </main>;
}
