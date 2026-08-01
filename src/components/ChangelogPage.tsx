import React from 'react';
import { ArrowLeft, Bug, Cpu, History, Rocket, Sparkles, Star } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';

const updatedAt = '2026 年 8 月 1 日';

const releases = [
  {
    version: 'v2.2', date: '2026-08-01', title: '資訊透明與行動版體驗優化', icon: Star, tone: 'emerald',
    summary: '強化重要規則的揭露方式，並調整手機版內容順序，讓使用者在需要付款、確認資料或閱讀聲明時，更容易找到應先了解的資訊。',
    sections: [
      { title: '透明揭露', items: ['小額支持頁新增售後服務、退款與取消政策的明確入口，付款前可先閱讀相關規則。', '免責聲明與支持資訊的重點內容改以更清楚的卡片呈現，減少關鍵提醒被忽略的情況。'] },
      { title: '手機版調整', items: ['重新安排小額支持頁的行動版資訊順序，將政策連結放在聯繫方式之後，閱讀流程更自然。', '調整免責聲明彈窗的窄螢幕排版，保留閱讀空間並避免裝飾元素擠壓標題。'] },
      { title: '介面細節', items: ['更新支持頁首的視覺徽章，讓支持、服務與政策資訊的辨識更一致。', '整理按鈕、連結與提示卡的層級，提升鍵盤操作與小螢幕點擊的可用性。'] },
    ],
  },
  {
    version: 'v2.1', date: '2026-05-16', title: '資料更新與穩定性提升', icon: Sparkles, tone: 'indigo',
    summary: '更新歷年錄取參考資料，改善成績輸入、分析流程與匯出內容的穩定性，讓查詢與比較更容易追溯。',
    sections: [
      { title: '資料更新', items: ['更新 113 學年度各就學區的歷史錄取參考資料，協助使用者觀察較新的分數趨勢。', '補充學校、科別與就學區資訊的說明，並持續以官方公告作為重要規則的核對依據。'] },
      { title: '分析體驗', items: ['改善成績與志願條件變更後的畫面回應，降低重複操作時出現不一致結果的機會。', '強化結果頁的風險提示與資料來源說明，提醒分析結果僅供升學規劃參考。'] },
      { title: '匯出與修正', items: ['整理報表中的成績、志願與免責說明區塊，讓分享或列印後的資訊更完整。', '修正部分裝置上彈窗捲動、按鈕狀態與文字換行的問題。'] },
    ],
  },
  {
    version: 'v2.0', date: '2026-05-10', title: '全新 Bento Grid 介面', icon: Rocket, tone: 'rose',
    summary: '以更清楚的卡片化資訊架構重新設計主要流程，讓從輸入條件、查看分析到挑選志願的步驟更容易掌握。',
    sections: [
      { title: '首頁與導覽', items: ['導入 Bento Grid 版面，將功能入口、重要日期、使用說明與常見問題分成可快速辨識的區塊。', '新增側邊導覽與網站地圖，讓使用者能在工具、說明頁與政策頁之間快速切換。'] },
      { title: '核心工具', items: ['整合會考成績、志願比較、歷年統計、策略建議與高中職百科等入口。', '擴充結果資料的檢視與匯出選項，支援較完整的分析摘要與使用提醒。'] },
      { title: '閱讀體驗', items: ['重新設計彈窗、提示卡與行動版導覽，讓小螢幕也能閱讀較長的說明內容。', '統一色彩、圖示、邊框與按鈕狀態，提升不同頁面之間的一致性。'] },
    ],
  },
  {
    version: 'v1.5', date: '2024-12-15', title: '歷史資料與比較功能擴充', icon: History, tone: 'amber',
    summary: '加入更完整的歷年統計與學校比較資訊，協助使用者在填寫志願前，同時參考分數區間、類別與地區條件。',
    sections: [
      { title: '歷年趨勢', items: ['提供歷年錄取參考資訊與年度切換，方便觀察同一校科的變化方向。', '在資料頁面補上來源與使用限制說明，避免將歷史資料直接視為當年度錄取保證。'] },
      { title: '學校比較', items: ['新增校科比較與篩選工具，協助整理多個候選志願的基本條件與特色。', '改善搜尋、排序與空白狀態提示，讓找不到資料時能更快調整查詢條件。'] },
      { title: '資料輸出', items: ['新增分析摘要的匯出內容，便於與家長、導師或輔導老師討論。', '匯出內容加入資料適用範圍與免責提醒，保留解讀結果所需的重要脈絡。'] },
    ],
  },
  {
    version: 'v1.1', date: '2024-08-20', title: '流程修正與使用引導', icon: Bug, tone: 'slate',
    summary: '針對早期使用回饋調整輸入流程與錯誤提示，讓第一次使用的學生與家長能更順利完成基本分析。',
    sections: [
      { title: '輸入檢查', items: ['補強成績、就學區與志願條件的格式檢查，並在資料不足時提供明確的補正提示。', '改善切換條件後的顯示狀態，降低舊結果殘留造成誤解的可能。'] },
      { title: '使用說明', items: ['新增操作指引、術語說明與重要日期頁面，協助使用者理解常見的招生與比序概念。', '於關鍵節點加入提醒：實際資格、名額、時程與規則仍應以當年度官方簡章為準。'] },
      { title: '問題修復', items: ['修正部分瀏覽器的版面溢出、按鈕點擊與捲動問題。', '優化較慢網路環境下的載入提示與錯誤回饋。'] },
    ],
  },
  {
    version: 'v1.0', date: '2024-05-01', title: '會考落點分析系統上線', icon: Cpu, tone: 'slate',
    summary: '建立以會考成績與就學區條件為核心的升學規劃工具，提供學生、家長與輔導工作者一個可快速查詢與比較的起點。',
    sections: [
      { title: '初始功能', items: ['提供基本成績輸入、落點參考、學校搜尋與志願規劃功能。', '建立高中職校科資料與就學區分類，協助從大量選項中縮小比較範圍。'] },
      { title: '使用原則', items: ['分析結果是依輸入條件與可用資料產生的參考資訊，不構成錄取、資格或名額保證。', '鼓勵使用者於重要決策前，回到招生主管機關、招生委員會或學校公告進行最終確認。'] },
      { title: '持續改善', items: ['建立回報問題與意見回饋管道，作為後續資料校對與功能調整的依據。', '承諾持續改善資料呈現、操作流程與無障礙閱讀體驗。'] },
    ],
  },
];

const toneClasses: Record<string, { bg: string; soft: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500', soft: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' }, indigo: { bg: 'bg-indigo-500', soft: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300' }, rose: { bg: 'bg-rose-500', soft: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' }, amber: { bg: 'bg-amber-500', soft: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' }, slate: { bg: 'bg-slate-500', soft: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300' },
};

export default function ChangelogPage() {
  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-indigo-50"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5"><ArrowLeft className="h-4 w-4" />返回首頁</a>
      <div className="py-10"><div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_#0f172a]"><div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-100"><History className="h-6 w-6 text-indigo-600" /></div><div><p className="text-xs font-black uppercase tracking-widest text-slate-500">Release Notes</p><p className="text-sm font-black text-slate-700">最後更新：{updatedAt}</p></div></div><h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">系統更新日誌</h1><p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">這裡整理會考落點分析系統的重要版本變更、功能新增、資料更新與修復紀錄。每個版本都補上完整說明，方便追蹤系統如何演進。</p></div>
    </div></section>
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8"><aside className={pageNavigationAsideClassName}><PageNavigation navClassName="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0_#0f172a]" itemLayoutClassName="space-y-2" items={releases.map((release) => ({ id: release.version, label: `${release.version} ${release.title}`, className: 'block rounded-xl' }))} /></aside><div className="relative space-y-6"><div className="absolute bottom-3 left-5 top-3 hidden w-1 rounded-full bg-slate-200 sm:block" />{releases.map((release) => { const Icon = release.icon; const tone = toneClasses[release.tone]; return <article key={release.version} id={release.version} className="relative scroll-mt-8 sm:pl-14"><div className={`absolute left-0 top-6 hidden h-11 w-11 items-center justify-center rounded-2xl border-4 border-slate-900 bg-white shadow-[2px_2px_0_#0f172a] sm:flex ${tone.soft} ${tone.text}`}><Icon className="h-6 w-6" /></div><div className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a] sm:p-8"><div className="flex flex-col gap-4 border-b-2 border-dashed border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="mb-3 flex flex-wrap items-center gap-2"><span className={`rounded-lg border-2 border-slate-900 px-2.5 py-1 text-xs font-black text-white shadow-[2px_2px_0_#0f172a] ${tone.bg}`}>{release.version}</span><span className="rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-500">{release.date}</span></div><h2 className="text-2xl font-black tracking-tight sm:text-3xl">{release.title}</h2><p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-slate-600 sm:text-base">{release.summary}</p></div><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 sm:hidden ${tone.soft} ${tone.text}`}><Icon className="h-6 w-6" /></div></div><div className="mt-6 grid gap-4 lg:grid-cols-3">{release.sections.map((section) => <section key={section.title} className={`rounded-2xl border-2 p-4 ${tone.border} ${tone.soft}`}><h3 className={`text-lg font-black ${tone.text}`}>{section.title}</h3><ul className="mt-3 space-y-3">{section.items.map((item) => <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-slate-700"><span className={`mt-2 h-2 w-2 shrink-0 rounded-full border border-slate-900 ${tone.bg}`} /><span>{item}</span></li>)}</ul></section>)}</div></div></article>; })}</div></section>
  </main>;
}
