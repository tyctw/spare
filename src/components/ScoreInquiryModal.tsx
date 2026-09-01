import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ExternalLink, AlertCircle } from 'lucide-react';

interface ScoreInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScoreInquiryModal({ isOpen, onClose }: ScoreInquiryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border-4 border-slate-900 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
        >
          <header className="relative shrink-0 overflow-hidden border-b-4 border-slate-900 bg-fuchsia-100 p-6 sm:p-8"><div className="pointer-events-none absolute right-0 top-0 -translate-y-8 translate-x-8 opacity-10"><Search className="h-40 w-40 text-fuchsia-900" strokeWidth={2.5} /></div><div className="relative flex items-start justify-between gap-4"><h2 id="score-inquiry-modal-title" className="flex items-center gap-3 text-3xl font-black text-slate-900 sm:text-4xl"><Search className="h-8 w-8 text-fuchsia-600 sm:h-10 sm:w-10" strokeWidth={3} />會考成績查詢</h2><button onClick={onClose} aria-label="關閉會考成績查詢" className="shrink-0 rounded-xl border-2 border-transparent bg-white/50 p-2 transition-colors hover:border-slate-900 hover:bg-white"><X className="h-6 w-6 text-slate-900" /></button></div></header>

          <div className="p-6 space-y-4">
            
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
              <div className="text-sm font-bold leading-relaxed">
                因查詢人數眾多，為維持系統穩定，試務會提供兩個分流網站，請擇一查詢。若連線緩慢請耐心等候或切換另一網站。
              </div>
            </div>

            <a
              href="https://score_n.rcpet.edu.tw/Login.aspx"
              target="_blank"
              rel="noreferrer"
              className="group relative w-full flex items-center justify-between p-4 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
            >
              <div className="flex flex-col">
                <span className="font-black text-lg text-slate-900">成績查詢網站 1</span>
                <span className="text-sm text-slate-500 font-bold">score_n.rcpet.edu.tw</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-fuchsia-100 group-hover:text-fuchsia-600 transition-colors">
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-fuchsia-600" />
              </div>
            </a>

            <a
              href="https://score_s.rcpet.edu.tw/Login.aspx"
              target="_blank"
              rel="noreferrer"
              className="group relative w-full flex items-center justify-between p-4 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
            >
              <div className="flex flex-col">
                <span className="font-black text-lg text-slate-900">成績查詢網站 2</span>
                <span className="text-sm text-slate-500 font-bold">score_s.rcpet.edu.tw</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-fuchsia-100 group-hover:text-fuchsia-600 transition-colors">
                <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-fuchsia-600" />
              </div>
            </a>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
