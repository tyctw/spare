import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, AlertCircle, AlertTriangle, BookA, HeartHandshake, EyeOff, Gavel, FileLock2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DisclaimerModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
             role="dialog"
             aria-modal="true"
             aria-label="免責聲明"
             className="relative w-full max-w-4xl bg-slate-50 rounded-[32px] shadow-2xl border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b-4 border-slate-900 flex items-center justify-between bg-amber-400 z-10 shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border-4 border-slate-900 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-6 scale-110">
                     <Shield className="w-6 h-6 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">免責聲明</h2>
                    <p className="text-sm font-bold text-slate-800 mt-1">使用本系統前，請詳閱以下重要須知</p>
                  </div>
               </div>
               <button 
                  type="button"
                  onClick={onClose} 
                  aria-label="關閉免責聲明"
                  className="w-10 h-10 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center hover:bg-slate-100 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none shrink-0"
               >
                  <X className="w-5 h-5 text-slate-900" />
               </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-[#fdfbf7] relative">
               
               {/* Hero Banner */}
               <div className="bg-amber-300 p-6 sm:p-8 rounded-[32px] border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8 relative overflow-hidden group hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-shadow">
                  {/* Decorative BG */}
                  <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12 group-hover:rotate-45 transition-transform duration-700 pointer-events-none">
                     <AlertTriangle className="w-48 h-48 text-amber-600" />
                  </div>
                  
                  <div className="w-16 h-16 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative z-10 rotate-3">
                     <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="relative z-10">
                     <h3 className="font-black text-2xl sm:text-3xl text-slate-900 mb-2">本系統結果僅供參考</h3>
                     <p className="text-slate-900 font-bold text-base sm:text-lg leading-relaxed">
                        本落點分析系統基於歷年錄取數據、各就學區超額比序規則及演算法模型進行推估，<span className="bg-white px-2 py-0.5 rounded border border-slate-900 font-black">不代表最終實際錄取的保證或絕對依據</span>。
                     </p>
                  </div>
               </div>

               {/* Details Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  
                  {/* Card 1 */}
                  <div className="p-6 bg-white border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-rose-100 rounded-xl border-2 border-slate-900 flex items-center justify-center -rotate-3">
                           <BookA className="w-5 h-5 text-rose-600" />
                        </div>
                        <h4 className="font-black text-xl text-slate-900">非官方授權數據</h4>
                     </div>
                     <p className="text-[15px] font-bold text-slate-600 leading-relaxed">
                        系統所載之最低錄取分數、PR區間及序位資料，多為網路封閉社群、學校公開資訊或歷屆學生回報所蒐集與整理。因缺乏官方統一公布的精確資料，故無可避免存有誤差。
                     </p>
                  </div>

                  {/* Card 2 */}
                  <div className="p-6 bg-white border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl border-2 border-slate-900 flex items-center justify-center rotate-3">
                           <Gavel className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-black text-xl text-slate-900">政策與名額變動風險</h4>
                     </div>
                     <p className="text-[15px] font-bold text-slate-600 leading-relaxed">
                        當年度各高中職學校招生名額之調整、科系之增減、以及各就學區免試入學計分基準或政策的變化，均會大幅影響實際的錄取分數與序位門檻。
                     </p>
                  </div>

                  {/* Card 3 */}
                  <div className="p-6 bg-white border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl border-2 border-slate-900 flex items-center justify-center -rotate-6">
                           <EyeOff className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h4 className="font-black text-xl text-slate-900">不保證其正確性與即時性</h4>
                     </div>
                     <p className="text-[15px] font-bold text-slate-600 leading-relaxed">
                        本開發團隊與營運者已盡力確保系統運算的正確性與資料的即時更新，但仍不對資訊內容之正確性、完整性、即時性做出任何明示或默示的擔保。
                     </p>
                  </div>

                  {/* Card 4 */}
                  <div className="p-6 bg-white border-4 border-slate-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl border-2 border-slate-900 flex items-center justify-center rotate-6">
                           <FileLock2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h4 className="font-black text-xl text-slate-900">隱私與資料蒐集須知</h4>
                     </div>
                     <p className="text-[15px] font-bold text-slate-600 leading-relaxed">
                        為優化系統演算法，使用者所輸入之成績大數據可能作為去識別化之統計分析使用。本系統絕不主動蒐集可直接識別個人身分之敏感資料，請安心使用。
                     </p>
                  </div>

               </div>

               {/* Bottom Note */}
               <div className="mt-8 p-6 bg-slate-900 rounded-3xl border-4 border-slate-900 text-white flex gap-4 items-start relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-full opacity-50 z-0"></div>
                  <div className="p-2 bg-amber-400 rounded-lg border-2 border-slate-900 relative z-10 shrink-0 mt-1">
                     <HeartHandshake className="w-5 h-5 text-slate-900" />
                  </div>
                  <div className="relative z-10">
                     <h4 className="font-black text-lg text-amber-400 mb-2">最終決策建議</h4>
                     <p className="text-slate-300 font-bold text-sm sm:text-base leading-relaxed">
                        填寫志願是人生重要階段，請將本系統作為「篩選參考工具」之一。我們強烈建議您應諮詢學校輔導老師意見，並綜合考量學生的<span className="text-white bg-slate-700 px-1 rounded mx-1">性向、興趣與通勤距離</span>，以做出最合適的就學決定。
                     </p>
                  </div>
               </div>

            </div>

             <div className="p-4 sm:p-6 bg-white border-t-4 border-slate-900 flex justify-end shrink-0 w-full gap-4 items-center">
                <span className="text-sm font-bold text-slate-400 hidden sm:inline-block">點擊按鈕表示您已充分理解並同意以上條款。</span>
                <button 
                  type="button"
                  onClick={onClose} 
                  className="w-full sm:w-auto px-10 py-3 sm:py-4 bg-slate-900 text-white rounded-2xl border-4 border-slate-900 font-black text-lg hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(245,158,11,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(245,158,11,1)] transition-all flex items-center justify-center gap-2"
                >
                  <CheckIcon /> 我已了解並同意
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}
