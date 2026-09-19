import React from 'react';
import { ArrowRight, CircleHelp, Search } from 'lucide-react';
import { withBasePath } from '../lib/routes';

export default function MissingFeatureCard() {
  return (
    <section className="rounded-3xl border-4 border-slate-900 bg-indigo-50 p-5 shadow-[4px_4px_0_#0f172a] sm:p-6" aria-labelledby="missing-feature-heading">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-slate-900 bg-white text-indigo-700"><Search className="h-5 w-5" /></span><div><h2 id="missing-feature-heading" className="text-xl font-black">沒有找到功能嗎？</h2><p className="mt-1 text-sm font-bold leading-6 text-slate-600">可使用全站搜尋，或查看使用協助與常見問題。</p></div></div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto"><a href={withBasePath('/site-map')} className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 sm:w-auto">搜尋網站功能<ArrowRight className="h-4 w-4" /></a><a href={withBasePath('/guide/help')} className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-slate-900 bg-indigo-600 px-3 py-2 text-sm font-black text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 sm:w-auto"><CircleHelp className="h-4 w-4" />使用協助</a></div>
      </div>
    </section>
  );
}
