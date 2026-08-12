import { useState } from 'react';
import { ArrowLeft, Building2, CalendarDays, ChevronDown, Flame, Megaphone, TicketCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';

export default function LatestNewsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setExpanded((current) => ({ ...current, [id]: !current[id] }));

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      <section className="overflow-hidden border-b-4 border-slate-900 bg-gradient-to-br from-amber-200 via-orange-100 to-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5">
            <ArrowLeft className="h-4 w-4" />返回首頁
          </a>
          <div className="mt-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-slate-900 px-4 py-2 text-xs font-black tracking-[.16em] text-white"><Megaphone className="h-4 w-4 text-amber-300" />LATEST NEWS・最新消息</div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">掌握網站最新動態</h1>
            <p className="mt-5 text-base font-bold leading-8 text-slate-700 sm:text-lg">資料更新、服務公告與合作資訊都會整理在這裡。</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <article className="relative overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0_#0f172a] sm:p-10">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-200 blur-2xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-rose-500 px-3 py-1.5 text-xs font-black text-white"><Flame className="h-4 w-4 fill-amber-300 text-amber-300" />HOT</span><span className="inline-flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-900"><CalendarDays className="h-4 w-4" />重要日程公告</span></div>
            <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">116 年國中教育會考考試日期訂於 5 月 15、16 日</h2>
            <p className="mt-6 max-w-3xl text-base font-bold leading-8 text-slate-700 sm:text-lg">依據教育部 115 年 7 月 6 日臺教授國部字第 1155502031 號函，116 年國中教育會考考試日期訂於 116 年 5 月 15、16 日（星期六、日）。</p>
            <button type="button" onClick={() => toggle('exam-date')} aria-expanded={Boolean(expanded['exam-date'])} className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5">{expanded['exam-date'] ? '收合完整內容' : '閱讀完整內容'}<ChevronDown className={`h-4 w-4 transition-transform ${expanded['exam-date'] ? 'rotate-180' : ''}`} /></button>
            {expanded['exam-date'] && <p className="mt-5 rounded-2xl border-2 border-slate-900 bg-amber-50 p-4 text-sm font-bold leading-7 text-slate-700">實際報名、成績公布、志願選填與分發時程，請持續以教育部及各就學區免試入學委員會的當年度正式公告為準。</p>}
          </div>
        </article>
        <article className="relative mt-8 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0_#0f172a] sm:p-10">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-200 blur-2xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-rose-500 px-3 py-1.5 text-xs font-black text-white"><Flame className="h-4 w-4 fill-amber-300 text-amber-300" />HOT</span><span className="inline-flex items-center gap-1.5 rounded-full border-2 border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-900"><CalendarDays className="h-4 w-4" />系統公告</span></div>
            <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl">116 學年度落點資料將陸續新增</h2>
            <p className="mt-6 max-w-3xl text-base font-bold leading-8 text-slate-700 sm:text-lg">我們正持續整理 116 學年度的落點資料，將依資料蒐集與核對進度陸續更新，協助學生與家長更早開始規劃升學方向。</p>
            <button type="button" onClick={() => toggle('admission-data')} aria-expanded={Boolean(expanded['admission-data'])} className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5">{expanded['admission-data'] ? '收合完整內容' : '閱讀完整內容'}<ChevronDown className={`h-4 w-4 transition-transform ${expanded['admission-data'] ? 'rotate-180' : ''}`} /></button>
            {expanded['admission-data'] && <><div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-slate-900 bg-sky-50 p-5"><Building2 className="h-7 w-7 text-sky-700" /><h3 className="mt-4 text-lg font-black">邀請教育夥伴提供資料</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-700">歡迎各高中職校方、補習班與我們聯繫，提供歷年錄取資料，共同讓資訊更完整。</p></div>
              <div className="rounded-2xl border-2 border-slate-900 bg-amber-50 p-5"><TicketCheck className="h-7 w-7 text-amber-700" /><h3 className="mt-4 text-lg font-black">提供專屬邀請碼</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-700">完成聯繫與資料確認後，我們將提供貴單位專屬邀請碼，供單位使用。</p></div>
            </div>
            <a href="mailto:tyctw.analyze@gmail.com?subject=116%20%E5%AD%B8%E5%B9%B4%E5%BA%A6%E8%B3%87%E6%96%99%E5%90%88%E4%BD%9C" className="mt-8 inline-flex items-center gap-2 rounded-2xl border-3 border-slate-900 bg-indigo-600 px-6 py-4 font-black text-white shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-indigo-500">聯絡我們提供資料 <ArrowLeft className="h-5 w-5 rotate-180" /></a></>}
          </div>
        </article>
      </section>
    </main>
  );
}
