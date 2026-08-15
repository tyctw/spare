import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, CircleAlert, FileSearch, ShieldAlert, Sparkles, X } from 'lucide-react';
import { withBasePath } from '../lib/routes';

interface Props { isOpen: boolean; onClose: () => void; }

const notices = [
  { number: '01', title: '不是錄取保證', text: '推薦校科與落點區間僅供規劃參考，不代表一定錄取。', icon: ShieldAlert, tone: 'bg-rose-100 text-rose-700' },
  { number: '02', title: '結果每年都可能變動', text: '名額、報名人數、比序規則與政策，都可能影響實際分發結果。', icon: Sparkles, tone: 'bg-amber-100 text-amber-700' },
];

export default function DisclaimerModal({ isOpen, onClose }: Props) {
  return <AnimatePresence>{isOpen && <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 sm:p-6">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" />
    <motion.section initial={{ scale: 0.95, opacity: 0, y: 18 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 18 }} transition={{ type: 'spring', damping: 24, stiffness: 280 }} role="dialog" aria-modal="true" aria-labelledby="disclaimer-modal-title" className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0_#0f172a]">
      <header className="relative shrink-0 overflow-hidden border-b-4 border-slate-900 bg-[#eef3ff] px-5 py-5 sm:px-7 sm:py-6">
        <div aria-hidden="true" className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[18px] border-indigo-200/70" />
        <div aria-hidden="true" className="absolute right-14 top-10 h-4 w-4 rounded-full bg-rose-400" />
        <div className="relative flex items-start justify-between gap-4"><div className="flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-rose-500 text-white shadow-[3px_3px_0_#0f172a]"><CircleAlert className="h-6 w-6" /></div><div><p className="text-[10px] font-black tracking-[0.18em] text-indigo-700">READ BEFORE YOU START</p><h2 id="disclaimer-modal-title" className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">使用前的重要提醒</h2></div></div><button type="button" onClick={onClose} aria-label="關閉免責聲明" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0 active:shadow-none"><X className="h-5 w-5" /></button></div>
      </header>
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#f8f9fd] p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">{notices.map((notice) => { const Icon = notice.icon; return <article key={notice.title} className="relative overflow-hidden rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a]"><span aria-hidden="true" className="absolute right-3 top-2 text-4xl font-black leading-none text-slate-100">{notice.number}</span><div className={`relative inline-flex rounded-xl border-2 border-slate-900 p-2 ${notice.tone}`}><Icon className="h-5 w-5" /></div><h3 className="relative mt-3 text-base font-black text-slate-900">{notice.title}</h3><p className="relative mt-1 text-sm font-bold leading-6 text-slate-600">{notice.text}</p></article>; })}</div>
        <section className="mt-4 flex gap-3 rounded-2xl border-2 border-slate-900 bg-sky-50 p-4"><FileSearch className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" /><div><p className="text-sm font-black text-slate-800">填志願前，請再確認一次</p><p className="mt-1 text-sm font-bold leading-6 text-slate-600">核對就學區、成績與報名資格；不確定時，請查閱當學年度招生簡章或詢問學校輔導老師。</p></div></section>
        <a href={withBasePath('/disclaimer')} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-indigo-700 underline decoration-2 underline-offset-4 transition hover:text-indigo-900">閱讀完整免責聲明 <ArrowRight className="h-4 w-4" /></a>
      </div>
      <footer className="shrink-0 border-t-4 border-slate-900 bg-white p-4 sm:px-6 sm:py-5"><button type="button" onClick={onClose} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-rose-500 px-5 py-3.5 text-sm font-black text-white shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-[6px_6px_0_#0f172a] active:translate-y-0 active:shadow-none"><Check className="h-5 w-5" />我已了解，繼續使用</button></footer>
    </motion.section>
  </div>}</AnimatePresence>;
}
