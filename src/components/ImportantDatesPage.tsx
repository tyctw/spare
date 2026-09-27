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

  const openHighlightMonth = (month: number) => {
    setSelectedPathway('all');
    window.setTimeout(() => document.getElementById(`month-${month}`)?.scrollIntoView(), 0);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] pb-16 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pt-7 sm:px-6 sm:pt-9">
        <a href={withBasePath('/')} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline">
          <ArrowLeft size={17} aria-hidden="true" />返回首頁
        </a>

        <header className="relative mt-4 overflow-hidden rounded-[28px] bg-[#283468] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-extrabold text-indigo-100">
              <CalendarDays size={15} aria-hidden="true" />116 學年度 · 西元 2027 年
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">重要日程</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-indigo-50 sm:text-lg">會考、入學報名、志願選填與報到，依月份整理成一份清楚的升學時間表。</p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-indigo-200">以下日期皆為民國 116 年；跨月期間列於開始月份。實際時程仍以各管道簡章及最新公告為準。</p>
          </div>
          <CalendarDays size={260} strokeWidth={.7} aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-12 hidden rotate-[-12deg] text-white/10 md:block" />
        </header>

        <section aria-labelledby="highlight-heading" className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[.12em] text-indigo-600">先記住這些日期</p>
              <h2 id="highlight-heading" className="mt-1 text-2xl font-black tracking-tight sm:text-[28px]">六個關鍵節點</h2>
            </div>
            <p className="text-sm text-slate-500">點選日期可跳至該月份</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {highlights.map(({ date, title, month }) => (
              <a key={title} href={`#month-${month}`} onClick={() => openHighlightMonth(month)} className="group flex min-h-[92px] flex-col justify-between rounded-2xl border border-slate-200 border-l-4 border-l-indigo-500 bg-white p-4 shadow-[0_7px_22px_rgba(31,42,85,0.04)] transition hover:-translate-y-0.5 hover:border-indigo-300 hover:border-l-indigo-600 hover:shadow-[0_12px_26px_rgba(31,42,85,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <strong className="text-base font-black text-indigo-700">{date}</strong>
                <span className="mt-2 text-sm font-bold leading-5 text-slate-700">{title}</span>
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="pathway-heading" className="mt-9 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_32px_rgba(31,42,85,0.05)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 id="pathway-heading" className="flex items-center gap-2 text-lg font-black"><ListFilter size={20} aria-hidden="true" className="text-indigo-600" />選擇入學管道</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">切換後只顯示該管道相關的日程。</p>
            </div>
            <a href={withBasePath(schedulePdf)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-extrabold text-indigo-800 transition hover:bg-indigo-100">
              <FileText size={18} aria-hidden="true" />完整日程表 PDF<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">（另開新分頁）</span>
            </a>
          </div>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative w-full max-w-lg">
              <label htmlFor="schedule-pathway" className="sr-only">入學管道</label>
              <select id="schedule-pathway" value={selectedPathway} onChange={(event) => selectPathway(event.target.value)} aria-controls="pathway-schedule" className="min-h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100">
                <option value="all">全部管道</option>
                {admissionPathways.map((pathway) => <option key={pathway.id} value={pathway.id}>{pathway.label}</option>)}
              </select>
              <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
            <p role="status" className="shrink-0 text-sm font-extrabold text-indigo-700">{selectedLabel} · {eventCount} 項日程</p>
          </div>
          {selectedPathway !== 'all' && selectedPathway !== 'exam' && <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm leading-6 text-indigo-900">此處列出原表中與該管道相關的事項；如需參加會考，也請查看「國中教育會考」的考試時程。</p>}
        </section>

        <nav aria-label="跳至月份" className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {visibleMonths.map(({ month }) => (
            <a key={month} href={`#month-${month}`} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
              {month} 月
            </a>
          ))}
        </nav>

        <div id="pathway-schedule" className="mt-3 space-y-6">
          {visibleMonths.length === 0 && <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">目前沒有符合此管道的日程。</p>}
          {visibleMonths.map(({ month, rows }) => {
            const monthCount = rows.reduce((total, row) => total + row.items.length, 0);
            return (
              <section key={month} id={`month-${month}`} aria-labelledby={`month-title-${month}`} className="scroll-mt-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_32px_rgba(31,42,85,0.05)]">
                <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-7">
                  <h2 id={`month-title-${month}`} className="text-xl font-black">116 年 {month} 月</h2>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{monthCount} 項</span>
                </div>
                <div>
                  {rows.map(({ date, items }) => (
                    <article key={date} className="grid border-t-2 border-slate-200 sm:grid-cols-[180px_minmax(0,1fr)]">
                      <h3 className="flex items-center bg-indigo-50 px-5 py-3 text-sm font-black leading-6 text-indigo-800 sm:px-7 sm:py-5">{displayDate(date)}</h3>
                      <ul className="min-w-0 space-y-2.5 px-5 py-4 sm:px-7 sm:py-5">
                        {items.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-slate-700 sm:text-[15px]"><span aria-hidden="true" className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" /><span className="min-w-0">{item}</span></li>)}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section aria-label="日程使用提醒" className="mt-9 grid gap-4 md:grid-cols-2">
          <div className="rounded-[22px] border border-amber-200 bg-[#fffaf0] p-6">
            <h2 className="flex items-center gap-2 text-lg font-black"><ClipboardCheck size={20} aria-hidden="true" className="text-amber-700" />選填與報名別混淆</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">6 月 24 日是志願選填截止日；6 月 29 日是免試入學與特色招生考試分發入學報名截止日，兩者是不同程序。</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">原表未列每日受理或截止時刻，請依所屬就學區簡章及學校通知辦理。</p>
          </div>
          <div className="rounded-[22px] border border-slate-200 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-black"><Info size={20} aria-hidden="true" className="text-indigo-600" />資料來源與備註</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">依教育部 115 年 9 月 11 日臺教授國部字第 1155404304 號函附件整理。</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-6 text-slate-600">{scheduleNotes.map((note) => <li key={note}>{note}</li>)}</ol>
          </div>
        </section>
      </div>
    </main>
  );
}
