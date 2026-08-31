import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, Clock3, KeyRound, ShieldCheck, X } from 'lucide-react';

interface AuthFailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = ['開啟邀請碼表單', '取得最新邀請碼', '回到這裡貼上使用'];

export default function AuthFailModal({ isOpen, onClose }: AuthFailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-sm" aria-label="關閉獲取邀請碼視窗" onClick={onClose} />
          <motion.section initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 18 }} role="dialog" aria-modal="true" aria-labelledby="invitation-code-title" className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[5px_5px_0_#0f172a]">
            <header className="relative overflow-hidden border-b-2 border-slate-900 bg-indigo-600 p-6 text-white">
              <div aria-hidden="true" className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[18px] border-indigo-400" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-slate-900 bg-amber-300 text-slate-900 shadow-[2px_2px_0_#0f172a]"><KeyRound className="h-5 w-5" /></span><div><p className="text-[11px] font-black tracking-[0.16em] text-indigo-200">INVITATION CODE</p><h2 id="invitation-code-title" className="mt-1 text-2xl font-black">取得最新邀請碼</h2></div></div>
                <button type="button" onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-900 transition hover:bg-slate-100" aria-label="關閉"><X className="h-5 w-5" /></button>
              </div>
            </header>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><p className="font-black text-rose-800">目前邀請碼無效或已過期</p><p className="mt-1 text-sm font-bold leading-6 text-rose-700/80">重新取得最新邀請碼後，即可繼續使用完整落點分析。</p></div>

              <ol className="space-y-3">{steps.map((step, index) => <li key={step} className="flex items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-700">{index + 1}</span><span className="text-sm font-bold text-slate-700">{step}</span>{index < steps.length - 1 && <span className="ml-auto h-px w-8 bg-slate-200" />}</li>)}</ol>

              <a href="https://tyctw.github.io/form/" target="_blank" rel="noreferrer" className="group flex w-full items-center justify-between rounded-2xl border-2 border-slate-900 bg-amber-300 px-5 py-4 text-left text-slate-900 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-[4px_4px_0_#0f172a] active:translate-y-0 active:shadow-none">
                <span><span className="block text-base font-black">前往填寫表單</span><span className="mt-0.5 block text-xs font-bold text-slate-700">於新分頁取得最新邀請碼</span></span><span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white transition-transform group-hover:translate-x-0.5"><ArrowRight className="h-5 w-5" /></span>
              </a>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" /><p className="text-sm font-bold leading-6 text-slate-600">邀請碼每小時更新一次，請使用最新取得的代碼。</p></div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500"><ShieldCheck className="h-4 w-4 text-emerald-600" />邀請碼僅用於本次使用資格驗證<Check className="h-4 w-4 text-emerald-600" /></div>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
