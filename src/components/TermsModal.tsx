import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, AlertTriangle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
          <div className="bg-slate-50 p-6 sm:p-8 relative border-b-4 border-slate-900 shrink-0">
            <button
               onClick={onClose}
               className="absolute top-6 right-6 p-2 hover:bg-slate-200 text-slate-900 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 text-slate-900 pr-12">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                <Shield className="w-6 h-6 text-indigo-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">服務條款</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-white">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-amber-50 rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  免責聲明與核心風險
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                    <p className="text-slate-700 font-bold leading-relaxed text-sm">
                      <strong className="text-slate-900 text-rose-600">結果僅供參考，不具絕對性：</strong> 本系統所提供的所有落點分析、預測結果、序位區間評估及相關之選填策略建議，皆係依據往年歷史數據模型、累計人數區間與演算法推演計算得出。<strong className="text-slate-900 border-b-2 border-rose-400">所有結果均僅提供同學與家長作為選填志願之「輔助參考工具」，絕不代表任何形式之錄取保證。</strong> 考生之最終實際錄取結果，仍須以各區招生委員會及各報考學校官方所發布之正式放榜公告為準。我們概不對您因依賴本系統結果所作出的任何選校決策及最終落榜結果負責。
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                    <p className="text-slate-700 font-bold leading-relaxed text-sm">
                      <strong className="text-slate-900">資料異動與準確性風險：</strong> 各項招生數據、學區超額比序規則、加權計分方式或各校核定名額，皆可能因教育主管機關之臨時決策而有所更動。我們將盡最大努力更新系統資料與參數，但不對本系統所提供之任何資料其絕對性、完整性與即時性作任何明示或默示之擔保。
                    </p>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">一、 使用者行為規範</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    <li>您同意在遵守當地法律規範前提下合法使用本服務，並承諾絕不透過自動化機器人爬蟲程式（如 Bots、Spiders）干擾、破壞或大量抓取本網站與伺服器之任何公開或非公開數據。</li>
                    <li>邀請碼與驗證機制（如有）為系統防護之一環，由本平台授權發放，嚴禁轉售、濫用或以任何不正當手段繞過系統驗證。違者本平台有權立即鎖定或封鎖您的連線IP與使用權益。</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">二、 系統可用性與中斷</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    我們致力於提供穩定的網路服務，但本網站可能因系統維護、軟硬體更新、突發網路故障、天災或不可抗力因素導致服務中斷、延遲或暫時無法使用。我們不保證服務100%全天候無中斷運作，若因中斷致使您在選填志願期間受到影響或遭受任何損害，本平台不負損害賠償責任。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">三、 服務之變更與終止</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    為了因應營運需求或教育政策變動，我們保留「在未預先通知之情況下，隨時修改、暫停、限制或完全永久終止本服務各項功能、分析模組」的絕對權利。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">四、 智慧財產權聲明</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    本系統所包含之所有版面設計、視覺元素、程式碼架構、演算法邏輯及附隨之圖文影音素材等，相關智慧財產權與著作權皆歸屬於本平台原創作者或其授權者所有。未經我們以書面授權許可，嚴禁任何人以任何形式重製、改作、散布、逆向工程或將其用於其他商業營利與非營利用途。
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">五、 條款修訂與法規遵循</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed">
                    我們可能不定時更新與修訂本「隱私權與服務條款」。修訂後的版本若發布於本網站上即屬生效。您的繼續使用將被視為您已閱讀、理解並完全同意接受修訂後之條款約束。本條款之解釋與適用，若未定明者，悉依中華民國相關法律辦理。
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-slate-50 p-6 border-t-4 border-slate-900 shrink-0">
            <button
               onClick={onClose}
               className="w-full py-4 bg-slate-900 text-white rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:bg-slate-800 active:translate-y-1 active:shadow-none transition-all font-black text-lg"
            >
              我知道了
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
