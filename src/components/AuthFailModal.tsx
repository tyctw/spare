import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound, AlertCircle, BookOpen, ExternalLink } from 'lucide-react';

interface AuthFailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthFailModal({ isOpen, onClose }: AuthFailModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
          >
            {/* Header */}
            <div className="p-6 bg-rose-400 border-b-4 border-slate-900 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-20 -translate-y-1/4 translate-x-1/4">
                <KeyRound className="w-32 h-32 text-slate-900" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                    <KeyRound className="w-6 h-6 text-slate-900" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">獲取邀請碼</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 bg-white rounded-xl border-4 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-100 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-0 active:shadow-none"
                >
                  <X className="w-5 h-5 text-slate-900" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-slate-50 space-y-6">
              
              <div className="bg-white border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-5 rounded-2xl flex items-start gap-4 transform rotate-1">
                <div className="w-10 h-10 bg-rose-100 rounded-xl border-2 border-slate-900 flex items-center justify-center flex-shrink-0 -rotate-3 mt-1 text-rose-600">
                  <AlertCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 mb-1">邀請碼無效或已過期</h3>
                  <p className="text-slate-600 font-bold text-sm">請重新獲取最新的邀請碼。系統保護機制已啟動，先前的授權已失效。</p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <a 
                  href="https://forms.gle/R1fXvtiu4kPEYL5E6" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="group flex flex-col items-center justify-center gap-2 bg-indigo-400 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-2xl p-6 transition-all hover:bg-indigo-300 hover:-translate-y-1 active:translate-y-0 active:shadow-none -rotate-1 relative overflow-hidden"
                >
                  <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
                    <ExternalLink className="w-32 h-32 text-slate-900" />
                  </div>
                  <div className="w-16 h-16 bg-white rounded-full border-4 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] mb-2 group-hover:scale-110 transition-transform relative z-10">
                    <BookOpen className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div className="font-black text-xl text-slate-900 relative z-10">填寫表單獲取邀請碼</div>
                  <div className="font-bold text-xs bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-wider relative z-10">點擊前往</div>
                </a>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                <span className="text-xl leading-none block pt-0.5">💡</span>
                <p className="text-amber-800 font-bold text-sm leading-relaxed">
                  提示：邀請碼每小時更新一次，請確保使用最新的邀請碼進行驗證。
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
