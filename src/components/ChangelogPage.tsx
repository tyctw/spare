import React from 'react';
import { ArrowLeft, BadgeCheck, BookOpenCheck, History, Rocket, Search, Sparkles, Wrench } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';

type Release = {
  version: string;
  date: string;
  title: string;
  summary: string;
  icon: React.ElementType;
  tone: 'emerald' | 'indigo' | 'amber' | 'slate';
  sections: { title: string; items: string[] }[];
};

const updatedAt = '2026-08-15';

const releases: Release[] = [
  {
    version: 'v2.6', date: '2026-08-15', title: '分類導覽、新聞文章與行動選單優化', icon: Sparkles, tone: 'indigo',
    summary: '新增五個分類說明頁與可收錄的獨立新聞文章頁，並持續調整桌機、平板與手機的導覽、搜尋及互動細節。',
    sections: [
      { title: '分類與搜尋', items: ['新增「我要查資料、我要選志願、我要規劃升學、會員與資源、使用協助」五個分類說明頁，桌機主選單可直接前往閱讀完整功能介紹。', '分類說明頁與網站地圖加入「沒有找到功能嗎？」入口，提供網站功能搜尋與使用協助。', '五個分類說明頁新增獨立 SEO 標題、描述、canonical 與 sitemap 收錄。'] },
      { title: '最新消息', items: ['最新消息改為獨立文章頁，使用文章編號網址並提供發布日期、內文段落、資料提醒與 NewsArticle 結構化資料。', '新增「預告 117 學年度竹苗區高級中等學校免試入學比序項目採計方式」新聞文章，整理公告與比序採計重點。', '新聞文章網址已加入 sitemap，方便搜尋引擎收錄。'] },
      { title: '導覽與體驗', items: ['優化桌機懸浮選單、手機與平板漢堡選單的切換規則，避免兩種選單同時顯示。', '補強全站搜尋、彈窗與導覽的鍵盤操作、焦點提示與顯示層級。', '首頁廣告延後至互動或 5 秒後載入；其他頁面維持立即開始載入流程。'] },
    ],
  },
  {
    version: 'v2.5', date: '2026-08-12', title: '會員免廣告與登入流程更新', icon: BadgeCheck, tone: 'emerald',
    summary: '新增會員免廣告服務與 LINE 身分確認流程；有效會員可享有更少干擾、跨裝置恢復資格，以及更順暢的落點分析操作。',
    sections: [
      { title: '會員權益', items: ['新增月費與年費免廣告方案；會員資格有效期間，查校、比對與規劃頁面不會載入 Google 廣告或 Offerwall。', '有效會員登入 LINE 後，填妥成績即可直接開始落點分析，不需再輸入系統授權碼。', '方案採一次付款，到期前不會自動續扣。'] },
      { title: '會員帳號', items: ['新增會員帳號頁，可查看目前資格、有效期限與購買紀錄。', 'LINE 登入用於確認與恢復會員資格；可在會員頁登出目前裝置的網站登入工作階段。', '支援在符合條件時提出帳號刪除，避免誤刪仍在有效期間的會員帳號。'] },
      { title: '安全與體驗', items: ['會員資格改由伺服器端驗證 LINE 身分與已完成付款紀錄，不採用瀏覽器可複製的會員憑證。', '登入工作階段採短期 HttpOnly Cookie；登出或工作階段到期後，頁面會恢復一般使用者的廣告與授權碼流程。', '新增會員、售後服務、退款與取消政策、隱私權與服務條款等說明頁面。'] },
    ],
  },
  {
    version: 'v2.4', date: '2026-08-10', title: '分析結果與成績評估介面優化', icon: Sparkles, tone: 'indigo',
    summary: '更新分析結果清單的檢視方式與篩選操作，並調整會考成績換算資訊的呈現，讓閱讀與操作更直覺。',
    sections: [
      { title: '分析結果', items: ['新增卡片與表格檢視切換；表格可直接點擊整列查看學校完整資訊。', '優化手機、平板與桌面版的篩選、清除篩選及推薦清單排版。'] },
      { title: '成績評估', items: ['調整就學區換算積分的顯示格式，清楚區分積分與積點資訊。', '改善寫作級分與同分比序資訊的色彩對比，降低閱讀負擔。'] },
      { title: '易用性', items: ['補強表格、篩選器與彈窗的無障礙標示與鍵盤操作。'] },
    ],
  },
  {
    version: 'v2.3', date: '2026-08-06', title: '各區計分規則與網站導覽全面更新', icon: Sparkles, tone: 'emerald',
    summary: '新增各招生區域的獨立計分規則頁，將原本彈窗保留為會考速覽，完整比序、採計上限與注意事項改由規則頁清楚呈現。',
    sections: [
      { title: '各區計分規則', items: ['新增基北、桃連、中投、彰化、臺南、高雄、竹苗等區域的完整計分對照表，並提供五專優先免試入學規則頁。', '基北區更新為 115 學年度、111 學年度後入學學生適用版本：均衡學習最高 24 分、服務學習最高 12 分。', '竹苗區同步收錄 117 學年度預告採計方式，並明確標示為預告內容，避免與 115 學年度規則混用。'] },
      { title: '閱讀與操作體驗', items: ['計分方式彈窗調整為會考成績換算速覽，加入前往完整規則頁的按鈕。', '規則頁表格支援手機橫向滑動提示、固定第一欄與更合適的手機字級。', '各區規則頁新增推薦閱讀及「核對官方完整簡章」連結，方便延伸查閱。'] },
      { title: '網站地圖與搜尋', items: ['網站地圖新增各區計分規則及五專規則入口。', '搜尋支援多關鍵字篩選、常用別名，以及「臺／台」字詞視為相同，例如可搜尋「高雄 會考」、「基北」或「五專」。'] },
    ],
  },
  {
    version: 'v2.2', date: '2026-08-01', title: '升學資訊架構與內容頁優化', icon: BookOpenCheck, tone: 'indigo',
    summary: '持續整理升學資訊頁面，讓學生可從學校查詢、志願模擬、會考成績到策略說明之間更順暢地切換。',
    sections: [
      { title: '資訊整合', items: ['強化學校類型、技職百科、綜合高中與高二升學路徑等內容入口。', '補充重要時程、歷年統計與常見問題頁面的導覽關聯。'] },
      { title: '頁面一致性', items: ['統一資訊頁的返回首頁、側邊導覽與卡片閱讀版型。', '改善行動裝置上的間距、按鈕與內容層級。'] },
    ],
  },
  {
    version: 'v2.1', date: '2026-05-16', title: '志願規劃工具改善', icon: Rocket, tone: 'amber',
    summary: '優化志願模擬與升學策略相關內容，協助使用者依成績、興趣與校系方向規劃下一步。',
    sections: [
      { title: '志願規劃', items: ['改善模擬志願序的操作流程與結果閱讀。', '整理填志願策略與會考等級說明，降低資訊理解門檻。'] },
      { title: '資料提醒', items: ['在重要資訊頁補充採計條件與年度差異提醒。', '提醒使用者送件前仍須以當學年度官方簡章及招生系統公告為準。'] },
    ],
  },
  {
    version: 'v2.0', date: '2026-05-10', title: '介面改版與導覽重整', icon: History, tone: 'slate',
    summary: '改版資訊頁的視覺層級與導覽方式，讓常用功能、升學工具與說明內容更容易找到。',
    sections: [
      { title: '版面設計', items: ['導入卡片式資訊呈現與更明確的標題層級。', '優化桌機與手機的響應式版面。'] },
      { title: '導覽', items: ['重新整理主要功能入口與相關閱讀連結。', '增加頁面內快速跳轉，縮短查找資訊的時間。'] },
    ],
  },
  {
    version: 'v1.0', date: '2024-05-01', title: '服務正式推出', icon: Wrench, tone: 'slate',
    summary: '建立升學資訊、學校查詢與志願規劃的基礎服務。',
    sections: [
      { title: '核心功能', items: ['提供升學資訊整理、學校探索與會考等級說明。', '提供志願規劃與相關輔助工具。'] },
    ],
  },
];

const toneClasses = {
  emerald: { badge: 'bg-emerald-500', soft: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  indigo: { badge: 'bg-indigo-500', soft: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  amber: { badge: 'bg-amber-500', soft: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  slate: { badge: 'bg-slate-600', soft: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export default function ChangelogPage() {
  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-indigo-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5"><ArrowLeft className="h-4 w-4" />返回首頁</a>
        <div className="py-10">
          <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_#0f172a]"><div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-100"><History className="h-6 w-6 text-indigo-600" /></div><div><p className="text-xs font-black uppercase tracking-widest text-slate-500">Release Notes</p><p className="text-sm font-black text-slate-700">最後更新：{updatedAt}</p></div></div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">系統更新日誌</h1>
          <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">記錄服務的重要功能、資料與介面調整。計分與招生規則會依使用者提供資料與官方公告持續更新；實際申請請以當學年度官方簡章為準。</p>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className={pageNavigationAsideClassName}><PageNavigation navClassName="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0_#0f172a]" itemLayoutClassName="space-y-2" items={releases.map((release) => ({ id: release.version, label: `${release.version}｜${release.title}`, className: 'block rounded-xl' }))} /></aside>
      <div className="relative space-y-6"><div className="absolute bottom-3 left-5 top-3 hidden w-1 rounded-full bg-slate-200 sm:block" />
        {releases.map((release) => { const Icon = release.icon; const tone = toneClasses[release.tone]; return <article key={release.version} id={release.version} className="relative scroll-mt-8 sm:pl-14"><div className={`absolute left-0 top-6 hidden h-11 w-11 items-center justify-center rounded-2xl border-4 border-slate-900 bg-white shadow-[2px_2px_0_#0f172a] sm:flex ${tone.soft} ${tone.text}`}><Icon className="h-6 w-6" /></div><div className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a] sm:p-8"><div className="border-b-2 border-dashed border-slate-200 pb-5"><div className="mb-3 flex flex-wrap items-center gap-2"><span className={`rounded-lg border-2 border-slate-900 px-2.5 py-1 text-xs font-black text-white shadow-[2px_2px_0_#0f172a] ${tone.badge}`}>{release.version}</span><span className="rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-500">{release.date}</span></div><h2 className="text-2xl font-black tracking-tight sm:text-3xl">{release.title}</h2><p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-slate-600 sm:text-base">{release.summary}</p></div><div className="mt-6 grid gap-4 lg:grid-cols-3">{release.sections.map((section) => <section key={section.title} className={`rounded-2xl border-2 p-4 ${tone.border} ${tone.soft}`}><h3 className={`text-lg font-black ${tone.text}`}>{section.title}</h3><ul className="mt-3 space-y-3">{section.items.map((item) => <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-slate-700"><span className={`mt-2 h-2 w-2 shrink-0 rounded-full border border-slate-900 ${tone.badge}`} /><span>{item}</span></li>)}</ul></section>)}</div></div></article>; })}
      </div>
    </section>
  </main>;
}
