import React, { useState } from 'react';
import { ArrowLeft, CalendarDays, ChevronDown, ExternalLink, FileText, Info } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { admissionPathways, getScheduleForPathway, scheduleNotes, schedulePdf, type AdmissionPathwayId } from '../lib/importantDates';

const highlights = [
  ['03/04–03/06', '會考報名'],
  ['05/15–05/16', '國中教育會考'],
  ['06/04', '會考成績查詢'],
  ['06/18–06/24', '免試入學序位查詢、志願選填'],
  ['07/06', '免試入學放榜'],
  ['07/08', '免試入學報到'],
];

export default function ImportantDatesPage() {
  const [selectedPathway, setSelectedPathway] = useState<AdmissionPathwayId>('all');
  const [pathwaysExpanded, setPathwaysExpanded] = useState(false);
  const visibleMonths = getScheduleForPathway(selectedPathway);
  const selectedLabel = admissionPathways.find(pathway => pathway.id === selectedPathway)?.label ?? '全部管道';
  const eventCount = visibleMonths.reduce((total, group) => total + group.rows.reduce((sum, row) => sum + row.items.length, 0), 0);
  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a]">
            <ArrowLeft className="h-4 w-4" />回首頁
          </a>
          <div className="py-10">
            <p className="mb-4 flex items-center gap-2 text-sm font-black text-purple-800"><CalendarDays className="h-5 w-5" />116 學年度 · 民國 116 年（西元 2027 年）</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">重要日程</h1>
            <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700">國中教育會考及全國高級中等學校與專科學校五年制適性入學，完整整理 2 至 7 月各管道的報名、測驗、選填、放榜、報到與放棄錄取資格日程。</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">依教育部 115 年 9 月 11 日臺教授國部字第 1155404304 號函附件整理。以下日期皆為民國 116 年；跨月期間列於開始月份。</p>
          </div>
          <section aria-labelledby="key-dates" className="pb-8">
            <h2 id="key-dates" className="mb-4 text-xl font-black">會考與免試入學關鍵節點</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map(([date, title]) => <div key={title} className="rounded-xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a]"><p className="text-xl font-black text-purple-800">{date}</p><p className="mt-2 text-sm font-bold">{title}</p></div>)}
            </div>
          </section>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8">
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="pathway-heading" className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0_#0f172a] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="pathway-heading" className="min-w-0 text-2xl font-black">
                <button type="button" aria-expanded={pathwaysExpanded} aria-controls="pathway-options" onClick={() => setPathwaysExpanded(expanded => !expanded)} className="flex min-h-11 items-center gap-3 rounded-lg text-left hover:text-purple-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700">
                  <span>依入學管道查看<span className="mt-1 block text-xs font-bold text-slate-500">{pathwaysExpanded ? '收合管道選項' : '點擊展開完整管道'}</span></span>
                  <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 transition-transform ${pathwaysExpanded ? 'rotate-180' : ''}`} />
                </button>
              </h2>
              <a href={withBasePath(schedulePdf)} target="_blank" rel="noreferrer" className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-purple-800 bg-purple-50 px-4 py-3 text-sm font-black text-purple-900 shadow-[3px_3px_0_#6b21a8] transition-colors hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700 sm:w-auto">
                <FileText aria-hidden="true" className="h-5 w-5 shrink-0" />
                查看完整日程表 PDF
                <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="sr-only">（另開新分頁）</span>
              </a>
            </div>
            <div id="pathway-options" hidden={!pathwaysExpanded}>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-600">選擇管道，依日期查看報名、測驗、放榜、報到與放棄錄取資格等事項。共同辦理的事項會保留在各相關管道中。</p>
            <div role="group" aria-label="選擇入學管道" className="mt-5 flex flex-wrap gap-2">
              {[{ id: 'all' as const, label: '全部管道' }, ...admissionPathways].map(pathway => (
                <button key={pathway.id} type="button" aria-pressed={selectedPathway === pathway.id} aria-controls="pathway-schedule" onClick={() => setSelectedPathway(pathway.id)} className={`rounded-xl border-2 border-slate-900 px-3 py-2 text-sm font-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700 ${selectedPathway === pathway.id ? 'bg-purple-700 text-white shadow-[2px_2px_0_#0f172a]' : 'bg-white text-slate-700 hover:bg-purple-50'}`}>{pathway.label}</button>
              ))}
            </div>
            </div>
            <p role="status" className="mt-5 text-sm font-black text-purple-800">{selectedLabel} · 共 {eventCount} 項日程</p>
            {selectedPathway !== 'all' && selectedPathway !== 'exam' && <p className="mt-2 text-sm leading-7 text-slate-600">以下列出此管道在原表中的事項；如需參加會考，可切換「國中教育會考」查看考試時程。各管道資格及原表未列出的程序，請依招生簡章確認。</p>}
          </section>
          <div id="pathway-schedule" className="space-y-6">
          {visibleMonths.map(({ month, rows }) => (
            <section key={month} id={`month-${month}`} aria-labelledby={`month-title-${month}`} className="scroll-mt-24 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0_#0f172a] sm:p-6">
              <h2 id={`month-title-${month}`} className="mb-5 text-2xl font-black">116 年 {month} 月</h2>
              <div className="divide-y-2 divide-slate-200">
                {rows.map(({ date, items }) => (
                  <article key={date} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="mb-3 text-base font-black text-purple-800">{date}</h3>
                    <ul className="list-disc space-y-2 pl-5 text-sm font-bold leading-7 text-slate-700 sm:text-base">
                      {items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ))}
          </div>
        </div>
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-2xl border-4 border-slate-900 bg-amber-200 p-5 shadow-[5px_5px_0_#0f172a]">
            <h2 className="flex items-center gap-2 text-xl font-black"><Info className="h-6 w-6 shrink-0" />原表備註</h2>
            <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm font-bold leading-7">{scheduleNotes.map(note => <li key={note}>{note}</li>)}</ol>
          </section>
          <section className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0_#0f172a]">
            <h2 className="text-xl font-black">選填與報到提醒</h2>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-700">志願選填截止日為 6 月 24 日，免試入學及特色招生考試分發入學報名截止日為 6 月 29 日，兩者為不同程序。請依所屬就學區簡章及學校通知完成。</p>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-700">原表未列每日受理或截止時刻。報名、報到及放棄錄取資格的辦理方式與確切時間，請查閱各管道簡章與最新公告。</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
