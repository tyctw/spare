import React from 'react';
import { Info, KeyRound, MapPin, Calculator, Award, ArrowRight, Play, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
           initial={{ opacity: 0 }} 
           animate={{ opacity: 1 }} 
           exit={{ opacity: 0 }}
           className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
           onClick={onClose}
        />
        
        <motion.div
           initial={{ scale: 0.95, opacity: 0, y: 20 }} 
           animate={{ scale: 1, opacity: 1, y: 0 }} 
           exit={{ scale: 0.95, opacity: 0, y: 20 }}
           className="relative w-full max-w-4xl bg-slate-50 rounded-[32px] shadow-2xl border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b-4 border-slate-900 flex items-center justify-between bg-blue-400 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl border-4 border-slate-900 flex items-center justify-center -rotate-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <BookOpen className="w-6 h-6 text-blue-500 fill-blue-200" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">系統使用指南</h2>
                <p className="text-slate-900 font-bold text-sm opacity-90">簡單4步驟，快速掌握落點分析</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <svg className="w-5 h-5 text-slate-900 text-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
            <div className="space-y-6">
              
              {/* Step 1 */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 bg-sky-50 border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] items-start group hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-sky-200/50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <div className="w-16 h-16 bg-sky-300 text-slate-900 rounded-2xl flex items-center justify-center font-black text-3xl flex-shrink-0 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3 group-hover:-rotate-12 transition-transform relative z-10">1</div>
                <div className="relative z-10">
                  <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3 mb-2">
                    <KeyRound className="w-7 h-7 text-sky-600 bg-sky-100 p-1 rounded-lg" /> 
                    獲取系統授權碼
                  </h3>
                  <p className="text-slate-700 font-bold mt-2 text-base leading-relaxed">
                    首頁點擊上方「<span className="text-sky-800 bg-sky-200 px-2 py-0.5 rounded text-sm">取得邀請碼</span>」快速填寫表單，即可免費獲取最新的分析權限，開啟所有進階演算法與功能。
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 bg-rose-50 border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] items-start group hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <div className="w-16 h-16 bg-rose-300 text-slate-900 rounded-2xl flex items-center justify-center font-black text-3xl flex-shrink-0 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-3 group-hover:rotate-12 transition-transform relative z-10">2</div>
                <div className="relative z-10">
                  <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3 mb-2">
                    <MapPin className="w-7 h-7 text-rose-600 bg-rose-100 p-1 rounded-lg" /> 
                    設定地區與偏好
                  </h3>
                  <p className="text-slate-700 font-bold mt-2 text-base leading-relaxed">
                    點擊「<span className="text-rose-800 bg-rose-200 px-2 py-0.5 rounded text-sm">選擇就學區</span>」並設定您理想的學校屬性（公立/私立）與類型（高中/高職），幫助系統鎖定您的目標。
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 bg-emerald-50 border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] items-start group hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-emerald-200/50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <div className="w-16 h-16 bg-emerald-300 text-slate-900 rounded-2xl flex items-center justify-center font-black text-3xl flex-shrink-0 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3 group-hover:-rotate-12 transition-transform relative z-10">3</div>
                <div className="relative z-10">
                  <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3 mb-2">
                    <Calculator className="w-7 h-7 text-emerald-600 bg-emerald-100 p-1 rounded-lg" /> 
                    輸入會考成績
                  </h3>
                  <p className="text-slate-700 font-bold mt-2 text-base leading-relaxed">
                    如實輸入您的國、英、數、自、社各科等級（<span className="text-emerald-800 bg-emerald-200 px-1 rounded text-sm">A++</span> ~ <span className="text-emerald-800 bg-emerald-200 px-1 rounded text-sm">C</span>），以及作文級分（0 ~ 6級），引擎即刻開始試算完整積分。
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col sm:flex-row gap-6 p-6 bg-purple-50 border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] items-start group hover:-translate-y-1 transition-transform relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-purple-200/50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                <div className="w-16 h-16 bg-purple-300 text-slate-900 rounded-2xl flex items-center justify-center font-black text-3xl flex-shrink-0 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-3 group-hover:rotate-12 transition-transform relative z-10">4</div>
                <div className="relative z-10">
                  <h3 className="font-black text-2xl text-slate-900 flex items-center gap-3 mb-2">
                    <Award className="w-7 h-7 text-purple-600 bg-purple-100 p-1 rounded-lg" /> 
                    檢視與匯出報告
                  </h3>
                  <p className="text-slate-700 font-bold mt-2 text-base leading-relaxed">
                    查看生成的學校落點分佈。您可以將猶豫不決的學校加入「比較清單」，或將完整報告下載保存（支援 <span className="font-black">JSON / Excel / TXT</span>）。
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t-4 border-slate-900 bg-slate-50 shrink-0 flex justify-end">
            <button
               onClick={onClose}
               className="px-6 py-3 rounded-xl font-black bg-slate-900 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all flex items-center gap-2"
            >
               開始使用 <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
