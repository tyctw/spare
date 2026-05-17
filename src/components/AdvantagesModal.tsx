import React from 'react';
import { Target, BarChart3, Map, Smartphone, Calculator, Sparkles, Filter, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdvantagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdvantagesModal({ isOpen, onClose }: AdvantagesModalProps) {
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
          <div className="px-6 py-5 border-b-4 border-slate-900 flex items-center justify-between bg-indigo-400 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl border-4 border-slate-900 flex items-center justify-center -rotate-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <Sparkles className="w-6 h-6 text-indigo-500 fill-indigo-200" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">系統優勢解析</h2>
                <p className="text-slate-900 font-bold text-sm opacity-90">為何選擇我們的落點分析系統？</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1 */}
              <div className="bg-emerald-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform group">
                <div className="w-14 h-14 bg-emerald-400 rounded-2xl border-4 border-slate-900 flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <Target className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">高精準落點預測</h3>
                <p className="text-slate-700 font-bold leading-relaxed">
                  導入歷屆龐大落點數據庫，並加入<span className="text-emerald-700 bg-emerald-200 px-1 rounded-md mx-1">動態演算法</span>，即時對比最新招生名額與考題難易度，精準算出保守、實際與夢幻區間。
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-amber-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform group">
                <div className="w-14 h-14 bg-amber-400 rounded-2xl border-4 border-slate-900 flex items-center justify-center mb-4 group-hover:-rotate-6 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <BarChart3 className="w-7 h-7 text-slate-900" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">多元比序完整計分</h3>
                <p className="text-slate-700 font-bold leading-relaxed">
                  不再只有會考成績！系統完整包含<span className="text-amber-700 bg-amber-200 px-1 rounded-md mx-1">志願序、多元學習、多元表現</span>等超額比序項目，給您最真實的積分試算。
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-sky-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform group md:row-span-2">
                <div className="w-14 h-14 bg-sky-400 rounded-2xl border-4 border-slate-900 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <Map className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">跨區支援與在地化</h3>
                <p className="text-slate-700 font-bold leading-relaxed mb-4">
                  針對各就學區的特殊計分規則，我們提供量身定制的演算法，目前支援：
                </p>
                <div className="flex flex-wrap gap-2">
                  {['基北區', '桃連區', '中投區', '彰化區', '竹苗區', '嘉義區', '台南區', '高雄區', '更多考區持續新增...'].map(region => (
                    <span key={region} className="text-xs font-bold bg-white border-2 border-slate-900 px-2 py-1 rounded-lg text-slate-700 shadow-sm">
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-fuchsia-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform group">
                <div className="w-14 h-14 bg-fuchsia-400 rounded-2xl border-4 border-slate-900 flex items-center justify-center mb-4 group-hover:-rotate-12 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <Filter className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">客製化志願篩選</h3>
                <p className="text-slate-700 font-bold leading-relaxed">
                  可依據<span className="text-fuchsia-700 bg-fuchsia-200 px-1 rounded-md mx-1">公私立、普通科型、高職群科</span>進行多目標篩選，找尋出最符合您性向與興趣的完美校系。
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-rose-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-transform group md:col-span-2">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                  <div className="w-20 h-20 shrink-0 bg-rose-400 rounded-2xl border-4 border-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <Smartphone className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">行動優先 ✕ 注重隱私</h3>
                    <p className="text-slate-700 font-bold leading-relaxed mb-3">
                      採用響應式設計，手機平板也能流暢操作。操作介面直覺友善，不具備複雜繁瑣的註冊流程。此外，我們重度保護您的隱私，所有成績推估皆採<span className="text-rose-700 bg-rose-200 px-1 rounded-md mx-1">匿名演算</span>，絕不主動外洩使用者個資。
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-black text-rose-600">
                      <Lock className="w-4 h-4" /> 100% 資料安全防護
                    </div>
                  </div>
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
               我了解了 <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

