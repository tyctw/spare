import React from 'react';
import { ArrowRight, Compass, Copyright, Heart, Mail, Map, ShieldCheck } from 'lucide-react';
import { withBasePath } from '../../lib/routes';

const links = [
  { label: '小額支持', href: '/support', icon: Heart },
  { label: '服務條款', href: '/terms', icon: ShieldCheck },
  { label: '網站地圖', href: '/site-map', icon: Map },
];

export default function Footer() {
  return <footer className="mt-12 w-full border-t-4 border-slate-900">
    <div className="w-full bg-white">
      <div className="grid gap-7 p-6 sm:p-8 lg:grid-cols-[1.2fr_.8fr] lg:items-stretch">
        <section className="relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-[#f5f7ff] p-4 shadow-[3px_3px_0_#0f172a] sm:p-5">
          <div aria-hidden="true" className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[18px] border-indigo-200/70" />
          <div className="relative flex items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-indigo-700 shadow-[3px_3px_0_#0f172a]"><Compass className="h-6 w-6" /></div><div><p className="text-[10px] font-black tracking-[0.18em] text-indigo-700">ADMISSION COMPASS</p><h2 className="mt-0.5 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">TW 全國會考落點分析</h2></div></div>
          <p className="relative mt-3 max-w-xl border-l-4 border-indigo-400 pl-3 text-sm font-bold leading-6 text-slate-700">把複雜的升學資訊整理得更清楚，陪你一步步找到適合自己的選擇。</p>
          <p className="relative mt-3 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-xs font-black text-slate-600"><ShieldCheck className="h-3.5 w-3.5 text-indigo-700" />非政府官方機構・分析結果僅供參考</p>
        </section>
        <section className="flex h-full flex-col rounded-2xl border-2 border-slate-900 bg-indigo-50 p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-indigo-700 shadow-[2px_2px_0_#0f172a]"><Mail className="h-5 w-5" /></div><p className="text-sm font-black text-slate-900">需要協助嗎？</p></div><a href="mailto:tyctw.analyze@gmail.com" className="group mt-4 flex items-center justify-between gap-3 rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-indigo-700 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0f172a] active:translate-y-0 active:shadow-none lg:mt-auto"><span className="min-w-0 break-all text-sm font-black">tyctw.analyze@gmail.com</span><ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" /></a></section>
      </div>
      <nav className="grid grid-cols-3 border-y-2 border-slate-900">{links.map(({ label, href, icon: Icon }) => <a key={href} href={withBasePath(href)} className="group flex items-center justify-center border-r-2 border-slate-900 px-2 py-3 text-center text-xs font-black text-slate-900 transition last:border-r-0 hover:bg-amber-100 sm:justify-between sm:px-5 sm:py-4 sm:text-sm"><span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap sm:gap-2"><Icon className="h-4 w-4 shrink-0 text-indigo-700" />{label}</span><ArrowRight className="hidden h-4 w-4 transition group-hover:translate-x-1 sm:block" /></a>)}</nav>
      <div className="relative flex items-center justify-between gap-3 overflow-hidden border-t-2 border-slate-900 bg-amber-400 px-5 py-3 text-slate-900"><div className="relative z-10 flex items-center gap-2"><Copyright className="h-4 w-4 shrink-0" /><span className="text-xs font-black sm:text-sm">COPYRIGHT {new Date().getFullYear()}</span></div><a href={withBasePath('/privacy')} className="relative z-10 text-right text-[10px] font-black underline decoration-slate-900/30 underline-offset-4 sm:text-xs">隱私權政策</a><div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden whitespace-nowrap opacity-20"><span className="px-4 text-3xl font-black tracking-tighter">TW 會考落點分析　TW 會考落點分析　TW 會考落點分析　TW 會考落點分析</span></div></div>
    </div>
  </footer>;
}
