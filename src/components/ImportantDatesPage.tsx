import { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Info,
  ListFilter,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import {
  admissionPathways,
  getScheduleForPathway,
  scheduleNotes,
  schedulePdf,
  type AdmissionPathwayId,
} from '../lib/importantDates';

const highlights = [
  { date: '03/04–03/06', title: '會考報名', month: 3 },
  { date: '05/15–05/16', title: '國中教育會考', month: 5 },
  { date: '06/04', title: '會考成績查詢', month: 6 },
  { date: '06/18–06/24', title: '序位查詢、志願選填', month: 6 },
  { date: '07/06', title: '免試入學放榜', month: 7 },
  { date: '07/08', title: '免試入學報到', month: 7 },
];

const displayDate = (date: string) => date.replace(/（[一二三四五六日]）/g, '');

export default function ImportantDatesPage() {
  const [selectedPathway, setSelectedPathway] = useState<AdmissionPathwayId>('all');
  const visibleMonths = getScheduleForPathway(selectedPathway);
  const selectedLabel = admissionPathways.find((pathway) => pathway.id === selectedPathway)?.label ?? '全部管道';
  const eventCount = visibleMonths.reduce((total, group) => total + group.rows.reduce((sum, row) => sum + row.items.length, 0), 0);

  const selectPathway = (value: string) => {
    if (value === 'all' || admissionPathways.some((pathway) => pathway.id === value)) {
      setSelectedPathway(value as AdmissionPathwayId);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7fb] pb-16 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 sm:pt-9 lg:px-8">
        <a href={withBasePath('/')} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline">
          <ArrowLeft size={17} aria-hidden="true" />返回首頁
        </a>

        <header className="relative mt-5 overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-br from-[#e9edff] via-white to-[#fff9ec] px-6 py-9 sm:px-10 sm:py-12">
          <div className="relative z-10 max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/85 px-3.5 py-1.5 text-xs font-extrabold text-indigo-700">
              <CalendarDays size={15} aria-hidden="true" />116 學年度 · 西元 2027 年
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">重要日程</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">從會考報名、成績公布到志願選填與報到，依時間查看各入學管道的重要事項。</p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-500">以下日期皆為民國 116 年；跨月期間列於開始月份。實際辦理方式與截止時間，請以各管道招生簡章及最新公告為準。</p>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[36px] border-indigo-100/60" />
        </header>

        <section className="mt-9" aria-labelledby="important-highlights-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold tracking-[.12em] text-indigo-600">先掌握重要節點</p>
              <h2 id="important-highlights-heading" className="mt-1 text-2xl font-black tracking-tight sm:text-[28px]">會考與免試入學關鍵日期</h2>
            </div>
            <p className="text-sm text-slate-500">點選卡片可跳到所屬月份</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map(({ date, title, month }) => (
              <a key={title} href={`#month-${month}`} onClick={() => { setSelectedPathway('all'); window.setTimeout(() => document.getElementById(`month-${month}`)?.scrollIntoView(), 0); }} className="group flex min-h-[98px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(41,53,92,0.04)] transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-[0_12px_28px_rgba(41,53,92,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <span><strong className="block text-lg font-black text-indigo-700">{date}</strong><span className="mt-1 block text-sm font-bold text-slate-700">{title}</span></span>
                <ArrowUpRight size={19} aria-hidden="true" className="shrink-0 text-slate-400 transition group-hover:text-indigo-600" />
              </a>
            ))}
          </div>
        </section>

        <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1fr)_286px] lg:items-start">
          <div className="min-w-0">
            <section aria-labelledby="pathway-heading" className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(41,53,92,0.05)] sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-700"><ListFilter size={21} aria-hidden="true" /></span>
                  <h2 id="pathway-heading" className="mt-3 text-xl font-black">依入學管道查看</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">選擇管道後，下方只顯示相關日程。</p>
                </div>
                <a href={withBasePath(schedulePdf)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-extrabold text-indigo-800 transition hover:border-indigo-400 hover:bg-indigo-100">
                  <FileText size={18} aria-hidden="true" />完整日程表 PDF<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">（另開新分頁）</span>
                </a>
              </div>
              <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 flex-1">
                  <label htmlFor="schedule-pathway" className="block text-sm font-black text-slate-800">入學管道</label>
                  <div className="relative mt-2 max-w-md">
                    <select id="schedule-pathway" value={selectedPathway} onChange={(event) => selectPathway(event.target.value)} aria-controls="pathway-schedule" className="min-h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                      <option value="all">全部管道</option>
                      {admissionPathways.map((pathway) => <option key={pathway.id} value={pathway.id}>{pathway.label}</option>)}
                    </select>
                    <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <p role="status" className="shrink-0 text-sm font-bold text-indigo-700">{selectedLabel} · {eventCount} 項日程</p>
              </div>
              {selectedPathway !== 'all' && selectedPathway !== 'exam' && <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">此處列出原表中與該管道相關的事項；如需參加會考，也請查看「國中教育會考」的考試時程。</p>}
            </section>

            <div id="pathway-schedule" className="mt-6 space-y-5">
              {visibleMonths.length === 0 && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">目前沒有符合此管道的日程。</p>}
              {visibleMonths.map(({ month, rows }) => {
                const monthCount = rows.reduce((total, row) => total + row.items.length, 0);
                return (
                  <section key={month} id={`month-${month}`} aria-labelledby={`month-title-${month}`} className="scroll-mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(41,53,92,0.05)]">
                    <div className="flex items-center gap-4 border-b border-slate-100 bg-[#f9faff] px-5 py-5 sm:px-7">
                      <span aria-hidden="true" className="grid h-13 w-13 shrink-0 place-items-center rounded-2xl bg-indigo-600 text-xl font-black text-white">{String(month).padStart(2, '0')}</span>
                      <div>
                        <h2 id={`month-title-${month}`} className="text-xl font-black">116 年 {month} 月</h2>
                        <p className="mt-0.5 text-xs font-semibold text-slate-500">{monthCount} 項日程</p>
                      </div>
                    </div>
                    <div className="space-y-3 px-5 py-5 sm:px-7 sm:py-6">
                      {rows.map(({ date, items }) => (
                        <article key={date} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5 sm:px-5">
                          <h3 className="w-fit self-start rounded-lg bg-indigo-100 px-3 py-1 text-sm font-black leading-6 text-indigo-800">{displayDate(date)}</h3>
                          <ul className="min-w-0 space-y-2.5">
                            {items.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-slate-700 sm:text-[15px]"><span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" /><span className="min-w-0">{item}</span></li>)}
                          </ul>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[22px] border border-slate-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-base font-black"><CalendarDays size={19} aria-hidden="true" className="text-indigo-600" />快速查看月份</h2>
              <nav aria-label="跳至月份" className="mt-4 grid grid-cols-3 gap-2">
                {visibleMonths.map(({ month }) => <a key={month} href={`#month-${month}`} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">{month} 月</a>)}
              </nav>
            </section>
            <section className="rounded-[22px] border border-amber-200 bg-[#fffaf0] p-5">
              <h2 className="flex items-center gap-2 text-base font-black"><ClipboardCheck size={19} aria-hidden="true" className="text-amber-700" />選填與報到提醒</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">6 月 24 日是志願選填截止日；6 月 29 日是免試入學與特色招生考試分發入學報名截止日，兩者是不同程序。</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">原表未列每日受理或截止時刻，請依所屬就學區簡章及學校通知辦理。</p>
            </section>
            <section className="rounded-[22px] border border-slate-200 bg-white p-5">
              <h2 className="flex items-center gap-2 text-base font-black"><Info size={19} aria-hidden="true" className="text-indigo-600" />資料來源與備註</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">依教育部 115 年 9 月 11 日臺教授國部字第 1155404304 號函附件整理。</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-6 text-slate-600">{scheduleNotes.map((note) => <li key={note}>{note}</li>)}</ol>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
