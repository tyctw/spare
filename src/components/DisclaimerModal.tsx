import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, FileCheck2, FileSearch, FileWarning, ShieldAlert, Sparkles, X } from 'lucide-react';
import { withBasePath } from '../lib/routes';

interface Props { isOpen: boolean; onClose: () => void; }

const notices = [
  { title: '不是錄取保證', text: '推薦校科與落點區間僅供規劃參考，不代表一定錄取。', icon: ShieldAlert, tone: 'bg-rose-100 text-rose-700 border-rose-300' },
  { title: '每年結果會改變', text: '名額、報名人數、比序與政策都可能改變實際分發結果。', icon: Sparkles, tone: 'bg-amber-100 text-amber-700 border-amber-300' },
];

export default function DisclaimerModal({ isOpen, onClose }: Props) {
  return <AnimatePresence>{isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
    <motion.section initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} role="dialog" aria-modal="true" aria-labelledby="disclaimer-modal-title" className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[32px] border-4 border-slate-900 bg-white shadow-[8px_8px_0_#0f172a]">
      <header className="relative shrink-0 overflow-hidden border-b-4 border-slate-900 bg-amber-300 px-5 py-4 sm:px-7 sm:py-5"><div className="pointer-events-none absolute right-0 top-0 -translate-y-8 translate-x-8 opacity-10"><FileCheck2 className="h-40 w-40 text-slate-900" strokeWidth={2.5} /></div><div className="relative flex items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0_#0f172a]"><FileWarning className="h-6 w-6 text-amber-700" /></div><div><p className="text-[10px] font-black tracking-[0.16em] text-amber-900">ADMISSION COMPASS</p><h2 id="disclaimer-modal-title" className="mt-0.5 text-2xl font-black text-slate-900 sm:text-3xl">免責聲明</h2></div></div><button type="button" onClick={onClose} aria-label="關閉免責聲明" className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0_#0f172a] transition hover:bg-slate-100 active:translate-y-0.5 active:shadow-none"><X className="h-4 w-4" /></button></div></header>
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-[#fdfbf7] p-4 sm:p-6"><div className="grid gap-3 sm:grid-cols-2">{notices.map((notice) => { const Icon = notice.icon; return <article key={notice.title} className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[2px_2px_0_#0f172a]"><div className={`inline-flex rounded-xl border-2 p-2 ${notice.tone}`}><Icon className="h-5 w-5" /></div><h3 className="mt-3 text-base font-black text-slate-900">{notice.title}</h3><p className="mt-1 text-sm font-bold leading-6 text-slate-600">{notice.text}</p></article>; })}</div><div className="mt-4 flex gap-3 rounded-2xl border-2 border-slate-900 bg-sky-50 p-4"><FileSearch className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" /><p className="text-sm font-bold leading-7 text-slate-700">填志願前，請再核對就學區、成績與報名資格；不確定時應查閱招生簡章，或詢問學校輔導老師。</p></div><a href={withBasePath('/disclaimer')} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-indigo-700 underline decoration-2 underline-offset-4 hover:text-indigo-900">閱讀完整聲明 <ArrowRight className="h-4 w-4" /></a></div>
      <footer className="shrink-0 border-t-4 border-slate-900 bg-white p-4 sm:px-6"><div className="flex justify-end"><button type="button" onClick={onClose} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0_#fbbf24] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:w-auto"><Check className="h-4 w-4" />我已了解，繼續使用</button></div></footer>
    </motion.section>
  </div>}</AnimatePresence>;
}
