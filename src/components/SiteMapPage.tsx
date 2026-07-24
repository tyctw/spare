import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  ChartBar,
  Compass,
  Database,
  FileText,
  HeartHandshake,
  HelpCircle,
  History,
  Info,
  Library,
  List,
  Map,
  MessageSquareWarning,
  QrCode,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';

type SiteMapItem = {
  title: string;
  desc: string;
  href?: string;
  external?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

const categories: Array<{ title: string; desc: string; items: SiteMapItem[] }> = [
  {
    title: '核心分析',
    desc: '輸入會考成績、地區與條件後，用來取得落點結果與後續比較。',
    items: [
      { title: '首頁落點分析', desc: '輸入邀請碼、就學區、身分、學校類型與各科成績，產生推薦校科清單。', href: '/', icon: Compass, tone: 'bg-indigo-100 text-indigo-700' },
      { title: '搜尋學校與科別', desc: '不必先跑分析，也能查學校、科別、群別、縣市與校科代碼。', href: '/search', icon: Search, tone: 'bg-sky-100 text-sky-700' },
      { title: '模擬志願序', desc: '依就學區搜尋校科，加入清單後可調整排序並列印草稿。', href: '/mock-volunteer', icon: Target, tone: 'bg-amber-100 text-amber-700' },
      { title: '校科比較', desc: '在分析結果中加入多所學校，集中比較地區、類型、分數與備註。', href: '/', icon: List, tone: 'bg-violet-100 text-violet-700' },
      { title: '結果匯出', desc: '分析完成後可匯出 TXT、Excel、JSON 或列印結果。', href: '/', icon: FileText, tone: 'bg-emerald-100 text-emerald-700' },
    ],
  },
  {
    title: '選校與技職探索',
    desc: '幫助理解學校類型、技職群別與興趣測驗的輔助頁面。',
    items: [
      { title: 'Holland 興趣測驗', desc: '完成 30 題簡易測驗，取得 RIASEC 類型與推薦技職群別。', href: '/holland', icon: Sparkles, tone: 'bg-purple-100 text-purple-700' },
      { title: '技職群科百科', desc: '查 15 大技職群別、常見科別、特質、Holland 類型與未來進路。', href: '/vocational-encyclopedia', icon: BookOpen, tone: 'bg-emerald-100 text-emerald-700' },
      { title: '學校類型介紹', desc: '比較普通型高中、技術型高中、綜合型高中、單科型高中與五專。', href: '/school-types', icon: Building2, tone: 'bg-sky-100 text-sky-700' },
      { title: '策略建議', desc: '提供填志願、排序與判斷落點區間的提醒與策略方向。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-700' },
    ],
  },
  {
    title: '成績與資料參考',
    desc: '查看成績分級、歷年統計與各區計分方式等參考資訊。',
    items: [
      { title: '會考成績等級', desc: '整理 A/B/C、加號標示、年度答對題數與加權成績區間。', href: '/grade-level', icon: Award, tone: 'bg-rose-100 text-rose-700' },
      { title: '歷年會考統計', desc: '查看 114、115 年會考等級組合、比例與重點分布。', href: '/historical-stats', icon: BarChart3, tone: 'bg-indigo-100 text-indigo-700' },
      { title: '各區計分說明', desc: '在首頁選擇就學區後，可查看該區計分與採計規則摘要。', href: '/', icon: Info, tone: 'bg-slate-100 text-slate-700' },
      { title: '重要日期', desc: '查看升學時程與需要留意的關鍵日期。', href: '/important-dates', icon: CalendarDays, tone: 'bg-purple-100 text-purple-700' },
      { title: '資料來源', desc: '說明本站資料來源、更新依據與資料使用提醒。', href: '/', icon: Database, tone: 'bg-cyan-100 text-cyan-700' },
    ],
  },
  {
    title: '說明與站務',
    desc: '使用教學、網站資訊、政策文件與回饋入口。',
    items: [
      { title: '使用說明', desc: '一步步了解如何輸入資料、閱讀結果、匯出與後續操作。', href: '/instructions', icon: HelpCircle, tone: 'bg-blue-100 text-blue-700' },
      { title: '常見問答與名詞百科', desc: '快速理解會考、超額比序、志願序、序位、技高與五專等名詞。', href: '/faq-glossary', icon: BookOpen, tone: 'bg-sky-100 text-sky-700' },
      { title: '系統優點與關於我們', desc: '了解本站設計理念、資料處理原則與功能特色。', href: '/advantages', icon: HeartHandshake, tone: 'bg-indigo-100 text-indigo-700' },
      { title: '網站地圖', desc: '目前這一頁，彙整所有主要功能與頁面入口。', href: '/site-map', icon: Map, tone: 'bg-amber-100 text-amber-700' },
      { title: '更新日誌', desc: '查看版本更新、功能新增與調整紀錄。', href: '/changelog', icon: History, tone: 'bg-slate-100 text-slate-700' },
      { title: '評分與回饋', desc: '留下使用體驗、建議或問題回報。', href: '/', icon: Star, tone: 'bg-yellow-100 text-yellow-700' },
      { title: '錯誤回報', desc: '回報資料錯誤、功能異常或其他需要修正的內容。', href: '/', icon: MessageSquareWarning, tone: 'bg-red-100 text-red-700' },
      { title: '隱私權政策', desc: '說明本站如何處理資料、瀏覽器儲存與第三方服務。', href: '/privacy', icon: Database, tone: 'bg-emerald-100 text-emerald-700' },
      { title: '服務條款', desc: '說明使用限制、責任範圍與服務相關條款。', href: '/terms', icon: Shield, tone: 'bg-slate-100 text-slate-700' },
    ],
  },
  {
    title: '外部查詢',
    desc: '連到官方或外部平台的查詢與分享服務。',
    items: [
      { title: '會考成績查詢', desc: '連到官方會考成績查詢系統。', href: '/', icon: Search, tone: 'bg-fuchsia-100 text-fuchsia-700' },
      { title: '序位查詢', desc: '前往外部序位查詢服務。', href: 'https://tyctw.github.io/volunteer/', external: true, icon: ChartBar, tone: 'bg-orange-100 text-orange-700' },
      { title: '全國錄取分享', desc: '前往全國錄取結果分享平台。', href: 'https://tyctw.github.io/shared/', external: true, icon: Library, tone: 'bg-indigo-100 text-indigo-700' },
      { title: '全國序位分享', desc: '前往全國序位分享平台。', href: 'https://tyctw.github.io/score/', external: true, icon: List, tone: 'bg-emerald-100 text-emerald-700' },
      { title: 'QR Code 掃描', desc: '首頁可掃描邀請碼 QR Code，快速填入邀請碼。', href: '/', icon: QrCode, tone: 'bg-slate-100 text-slate-700' },
    ],
  },
];

export default function SiteMapPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return categories;

    return categories
      .map((category) => {
        const categoryMatches = [category.title, category.desc].some((text) =>
          text.toLowerCase().includes(keyword),
        );
        const items = categoryMatches
          ? category.items
          : category.items.filter((item) =>
              [item.title, item.desc, item.href || '', item.external ? '外部 external' : '站內 internal']
                .some((text) => text.toLowerCase().includes(keyword)),
            );

        return { ...category, items };
      })
      .filter((category) => category.items.length > 0);
  }, [searchTerm]);

  const resultCount = filteredCategories.reduce((sum, category) => sum + category.items.length, 0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
          >
            <ArrowLeft className="h-4 w-4" />
            回首頁
          </a>

          <div className="py-10">
            <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-100">
                <Map className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Site Map</p>
                <p className="text-sm font-black text-slate-700">全部功能與頁面總覽</p>
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">網站地圖</h1>
            <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">
              這裡整理本站所有主要功能、獨立頁面、彈窗工具與外部查詢入口，方便快速找到需要的功能。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="搜尋功能、頁面、說明或網址..."
                className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 py-3 pl-12 pr-4 text-base font-bold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-amber-300/40"
              />
            </div>
            <div className="flex items-center justify-between gap-3 lg:justify-end">
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-600">
                {resultCount} 個功能
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                >
                  清除
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredCategories.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-4 border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              <Search className="h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-2xl font-black text-slate-700">找不到符合的功能</h2>
              <p className="mt-2 text-sm font-bold">試著輸入較短的關鍵字，或清除搜尋後瀏覽全部網站地圖。</p>
            </div>
          ) : filteredCategories.map((category) => (
            <section key={category.title} className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-7">
              <div className="mb-5">
                <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">{category.title}</h2>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-600">{category.desc}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const href = item.external ? item.href : withBasePath(item.href || '/');

                  return (
                    <a
                      key={`${category.title}-${item.title}`}
                      href={href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noreferrer' : undefined}
                      className="group rounded-2xl border-2 border-slate-900 bg-slate-50 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:bg-white active:translate-y-0 active:shadow-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 ${item.tone}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black leading-tight text-slate-900">{item.title}</h3>
                            {item.external && (
                              <span className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-black text-slate-500">
                                外部
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
