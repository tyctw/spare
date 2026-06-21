import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, X, AlertCircle, TrendingUp, ListChecks, Link as LinkIcon } from 'lucide-react';

interface StrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StrategyModal({ isOpen, onClose }: StrategyModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
          className="relative w-full max-w-2xl bg-white rounded-[32px] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-amber-400 p-6 sm:p-8 relative border-b-4 border-slate-900 shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-slate-900 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 text-slate-900 mb-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-3">
                <Target className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">志願選填攻略</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-slate-50 space-y-8">
            
            {/* 四大叮嚀 */}
            <div className="bg-white rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-indigo-500" />
                選填四大叮嚀
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded-lg text-sm h-fit whitespace-nowrap border-2 border-indigo-200">叮嚀 1</div>
                  <p className="text-slate-700 font-bold leading-relaxed pt-0.5">透過個別序位知道學生在全市的超額比序總分排名。</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded-lg text-sm h-fit whitespace-nowrap border-2 border-indigo-200">叮嚀 2</div>
                  <p className="text-slate-700 font-bold leading-relaxed pt-0.5">在各項總分及選填校科志願相同前提下，個別序位可以看出錄取優先順序。</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded-lg text-sm h-fit whitespace-nowrap border-2 border-rose-200">叮嚀 3</div>
                  <p className="text-slate-700 font-bold leading-relaxed pt-0.5">個別序位較適用於「前段同分志願」的學校比較參考。</p>
                </li>
                <li className="flex gap-3">
                  <div className="bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded-lg text-sm h-fit whitespace-nowrap border-2 border-rose-200">叮嚀 4</div>
                  <p className="text-slate-700 font-black leading-relaxed text-rose-600 pt-0.5">選填最高原則：確保「志願序積分」不被扣分！ <span className="text-slate-700 font-bold">(依各區規定，善用同群連續填)</span></p>
                </li>
              </ul>
            </div>

            {/* 什麼是個別序位 */}
            <div className="bg-sky-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
              <h3 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-sky-600" />
                什麼是「個別序位」？
              </h3>
              <p className="text-slate-700 font-bold leading-relaxed mb-4">
                「個別序位」是自己考區參加會考學生中，扣除掉已經錄取報到的學生 (包含特招甄選、直升、優免、完免、安置、技優甄審及實用技能班等人)，再以本區超額比序順序排序之後的序位區間供落點參考。
              </p>
              <a href="https://tyctw.github.io/score/" target="_blank" rel="noreferrer" className="flex items-center justify-center sm:justify-start gap-2 text-sky-700 bg-sky-200 hover:bg-sky-300 px-4 py-3 rounded-xl font-black transition-colors border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none">
                <LinkIcon className="w-5 h-5" />
                參考歷屆考生分享的資訊對照
              </a>
            </div>

            {/* 志願區間策略 */}
            <div className="bg-emerald-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-emerald-600" />
                志願區間策略 (不扣分配置法)
              </h3>
              <p className="text-slate-700 font-bold leading-relaxed mb-4">
                在<span className="text-rose-600 font-black underline decoration-rose-300 decoration-4 underline-offset-2">「不被扣志願序積分」</span>的群組範圍內，建議將志願依照順序分成「夢幻」、「實際」、「保守」三大區：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <div className="text-rose-600 font-black mb-1">前段志願序</div>
                  <div className="text-lg font-black text-slate-900 mb-2">夢幻區</div>
                  <p className="text-sm font-bold text-slate-600">可填自己想要就讀的夢幻學校，即便落榜也不會影響同群組分數。</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <div className="text-sky-600 font-black mb-1">中段志願序</div>
                  <div className="text-lg font-black text-slate-900 mb-2">實際區</div>
                  <p className="text-sm font-bold text-slate-600">可參考去年錄取狀況後務實填寫，是主要的錄取落點。</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <div className="text-emerald-600 font-black mb-1">後段志願序</div>
                  <div className="text-lg font-black text-slate-900 mb-2">保守區</div>
                  <p className="text-sm font-bold text-slate-600">在同群組扣分邊緣前，一定要填上有把握的保底學校。</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-900">
                <ul className="space-y-3 text-slate-700 font-bold text-sm leading-relaxed list-disc list-inside">
                  <li className="text-rose-600">各就學區的志願序計分與群組規定不同（例如：部分考區前 3 或前 5 志願同分），請務必依據您所在考區的規則，確保主力志願落在「不扣分」的群組內。</li>
                  <li>雖然不一定要填滿所有志願，但還是建議盡量填滿，以免高分落榜喔！</li>
                  <li>普通型高中、技術型高中可以混合填選在不同志願序。</li>
                  <li>選填技術型高中或普通型高中附設職業類科學校，可填選同校多個類科，其志願序連續填寫時視為同一志願，積分相同（極有利於不扣分策略）。</li>
                </ul>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
