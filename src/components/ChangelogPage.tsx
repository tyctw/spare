import React from 'react';
import { ArrowLeft, Bug, Cpu, FileText, History, Rocket, Sparkles, Star } from 'lucide-react';
import { withBasePath } from '../lib/routes';

const updatedAt = '2026 年 5 月 16 日';

const releases = [
  {
    version: 'v2.1',
    date: '2026-05-16',
    title: '科系百科與操作體驗升級',
    icon: Star,
    tone: 'emerald',
    summary: '補強技職探索內容，並改善抽屜選單、行動裝置操作與底層元件穩定性。',
    sections: [
      {
        title: '新增內容',
        items: [
          '新增職群與科系深入介紹百科，提供群科特色、學習內容、適合特質與未來進路等資訊，協助學生在落點分析之外理解實際學習方向。',
          '補強技職相關說明，讓使用者能從學校、職群與科系三個角度交叉檢視志願選擇。',
        ],
      },
      {
        title: '介面調整',
        items: [
          '重新整理模組化抽屜選單，將學校資訊、策略工具、系統指南與外部資源分區收納，降低首頁資訊壓力。',
          '優化行動裝置上的比較清單操作，讓新增、查看與清空學校比較項目時更容易點擊。',
        ],
      },
      {
        title: '系統維護',
        items: [
          '重構部分共用元件與狀態流程，降低頁面切換與彈窗開關時的渲染負擔。',
          '調整資料顯示細節，讓不同螢幕尺寸下的文字、卡片與按鈕排列更穩定。',
        ],
      },
    ],
  },
  {
    version: 'v2.0',
    date: '2026-05-10',
    title: 'New Bento Grid UI',
    icon: Sparkles,
    tone: 'indigo',
    summary: '導入 Bento Grid 首頁架構，加入多校比較、資料匯出與登入驗證等核心功能。',
    sections: [
      {
        title: '新版介面',
        items: [
          '全面導入 Bento Grid 模組化版面，將查詢表單、分析工具、外部資源與輔助資訊重新分層，提升資訊掃描效率。',
          '重新設計首頁視覺層級，讓主要操作區、結果區與提示區更清楚分離。',
        ],
      },
      {
        title: '功能新增',
        items: [
          '新增多所學校加入比較清單功能，最多可同步比較 4 所學校，方便使用者檢視錄取門檻、地區與學校條件差異。',
          '新增 Excel、JSON、TXT 等資料匯出格式，方便使用者保存分析結果、分享討論或做進一步整理。',
          '實作使用者登入驗證遮罩層，強化授權流程並降低未授權使用風險。',
        ],
      },
      {
        title: '規則支援',
        items: [
          '增強對各就學區計分規則的支援，讓不同區域的成績換算與落點推估更貼近實際情境。',
          '整理篩選條件與結果欄位，讓學制、類科、地區與公私立條件能更一致地套用到結果列表。',
        ],
      },
    ],
  },
  {
    version: 'v1.5',
    date: '2024-12-15',
    title: '數據更新與穩定性提升',
    icon: Rocket,
    tone: 'rose',
    summary: '更新歷史錄取參考資料，並改善匯出功能與成績計算穩定性。',
    sections: [
      {
        title: '資料更新',
        items: [
          '更新 113 年度各大就學區學校最低錄取標準參考資料，讓分析結果能反映較新的歷史趨勢。',
          '整理學校資料庫中的類科、學制與區域資訊，降低重複、遺漏或欄位不一致造成的查詢落差。',
        ],
      },
      {
        title: '匯出改善',
        items: [
          '增強資料匯出功能的穩定性，改善 Excel 軟體相容度與欄位順序，讓使用者保存結果時更完整。',
          '調整匯出文字格式，讓分析來源、查詢條件與結果資料更容易閱讀與分享。',
        ],
      },
      {
        title: '計算調整',
        items: [
          '優化會考各科成績加權計算邏輯，改善特殊輸入條件下的預測準確度。',
          '修正部分邊界條件，避免缺漏資料或非預期輸入造成結果顯示異常。',
        ],
      },
    ],
  },
  {
    version: 'v1.1',
    date: '2024-08-20',
    title: '問題修復與介面微調',
    icon: Bug,
    tone: 'amber',
    summary: '修正行動裝置操作問題，並改善結果頁的閱讀性與互動流暢度。',
    sections: [
      {
        title: '問題修復',
        items: [
          '修正部分行動裝置在點擊下拉選單後導致頁面偏移的問題，降低查詢流程中斷的情況。',
          '修正學校詳情對話框在部分裝置上開關不順或內容滾動不穩的情形。',
        ],
      },
      {
        title: '視覺微調',
        items: [
          '微調落點分析結果頁面的色彩對比與欄位間距，提升長時間閱讀時的辨識度。',
          '調整卡片陰影、邊框與按鈕狀態，讓操作回饋更一致。',
        ],
      },
      {
        title: '體驗改善',
        items: [
          '優化結果列表與學校詳情之間的切換流程，讓使用者能更快回到原本查看的位置。',
          '降低部分元件重複渲染造成的卡頓感，改善低階裝置上的使用體驗。',
        ],
      },
    ],
  },
  {
    version: 'v1.0',
    date: '2024-05-01',
    title: '會考落點分析系統正式上線',
    icon: Cpu,
    tone: 'slate',
    summary: '建立核心落點分析流程，支援主要就學區成績換算、PR 參考與學校資料查詢。',
    sections: [
      {
        title: '核心功能',
        items: [
          '支援全國主要就學區的會考成績輸入、條件篩選與落點預測，提供學生初步整理志願方向的工具。',
          '提供學校資料查詢、類科對應與學制篩選，協助使用者快速縮小符合條件的學校範圍。',
        ],
      },
      {
        title: '分析呈現',
        items: [
          '建立 PR 值區間與錄取門檻參考呈現，讓使用者能以視覺化方式理解不同學校的相對位置。',
          '整理結果卡片資訊，包含學校名稱、地區、類科、分數與相關條件，方便比較與討論。',
        ],
      },
      {
        title: '基礎架構',
        items: [
          '建立初版學校資料庫與前端查詢流程，作為後續志願模擬、多校比較與匯出功能的基礎。',
          '完成基本響應式版面，讓桌機與行動裝置都能使用主要分析功能。',
        ],
      },
    ],
  },
];

const toneClasses: Record<string, { bg: string; soft: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500', soft: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300' },
  indigo: { bg: 'bg-indigo-500', soft: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300' },
  rose: { bg: 'bg-rose-500', soft: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300' },
  amber: { bg: 'bg-amber-500', soft: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' },
  slate: { bg: 'bg-slate-500', soft: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-300' },
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>

          <div className="py-10">
            <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-100">
                <History className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Release Notes</p>
                <p className="text-sm font-black text-slate-700">最後更新：{updatedAt}</p>
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">系統更新日誌</h1>
            <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">
              這裡整理會考落點分析系統的重要版本變更、功能新增、資料更新與修復紀錄。每個版本都補上完整說明，方便追蹤系統如何演進。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500">
              <FileText className="h-4 w-4" />
              版本
            </div>
            <div className="space-y-2">
              {releases.map((release) => (
                <a
                  key={release.version}
                  href={`#${release.version}`}
                  className="block rounded-xl px-3 py-2 text-sm font-black text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {release.version} {release.title}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <div className="relative space-y-6">
          <div className="absolute left-5 top-3 bottom-3 hidden w-1 rounded-full bg-slate-200 sm:block" />

          {releases.map((release) => {
            const Icon = release.icon;
            const tone = toneClasses[release.tone];

            return (
              <article key={release.version} id={release.version} className="relative scroll-mt-8 sm:pl-14">
                <div className={`absolute left-0 top-6 hidden h-11 w-11 items-center justify-center rounded-2xl border-4 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:flex ${tone.soft} ${tone.text}`}>
                  <Icon className="h-6 w-6" />
                </div>

                <div className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8">
                  <div className="flex flex-col gap-4 border-b-2 border-dashed border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-lg border-2 border-slate-900 px-2.5 py-1 text-xs font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${tone.bg}`}>
                          {release.version}
                        </span>
                        <span className="rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-500">
                          {release.date}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{release.title}</h2>
                      <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-slate-600 sm:text-base">
                        {release.summary}
                      </p>
                    </div>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 ${tone.soft} ${tone.text} sm:hidden`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    {release.sections.map((section) => (
                      <section key={section.title} className={`rounded-2xl border-2 ${tone.border} ${tone.soft} p-4`}>
                        <h3 className={`text-lg font-black ${tone.text}`}>{section.title}</h3>
                        <ul className="mt-3 space-y-3">
                          {section.items.map((item) => (
                            <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-slate-700">
                              <span className={`mt-2 h-2 w-2 shrink-0 rounded-full border border-slate-900 ${tone.bg}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
