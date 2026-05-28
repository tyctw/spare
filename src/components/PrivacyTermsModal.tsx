import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, CheckCircle2, AlertTriangle, Database } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyTermsModal({ isOpen, onClose }: PrivacyTermsModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

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
            <div className="flex items-center gap-4 text-slate-900 mb-6 pr-12">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                <Shield className="w-6 h-6 text-indigo-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">隱私權與服務條款</h2>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-slate-200 p-1 rounded-xl border-2 border-slate-900 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)]">
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm sm:text-base transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300'
                }`}
              >
                隱私權政策
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm sm:text-base transition-all ${
                  activeTab === 'terms'
                    ? 'bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-300'
                }`}
              >
                服務條款
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-white">
            {activeTab === 'privacy' ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Database className="w-6 h-6 text-emerald-600" />
                    資料收集與使用
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900">不收集個人身份資訊：</strong> 本系統不會要求您輸入姓名、身分證字號、聯絡方式或確切地址等可直接辨識個人的機敏資料。本服務之設計即以最小化資料收集為原則。
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900">成績與志願：</strong> 您所輸入的會考成績（包括各科等級標示、作文分數）、選填區與偏好設定僅做為即時運算落點分析及積分試算之用，且均為匿名化資料，主要於您的瀏覽器中進行運算。
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900">去識別化分析：</strong> 為改進系統準確度及提供歷屆落點大數據觀察，我們可能會自動收集完全去識別化的成績分布、區域選擇及志願選填趨勢，做為統計基礎。這些資料絕不會、且無法與特定使用者產生任何關聯。
                      </p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Cookie 與本地儲存 (Local Storage)</h4>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                    本系統會使用瀏覽器的 Local Storage / Session Storage 及相關快取技術，暫存您本次或過往的設定參數及分析結果，以提供流暢的使用者體驗（如：重新整理頁面後無須重新輸入成績）。您可隨時透過瀏覽器設定清除這些快取，這將會重置您於本站的儲存狀態。我們絕對不會將這些技術用於追蹤您在其他第三方網站的活動。
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">資訊安全與資料保護</h4>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                    我們會採取合理的技術及安全措施保護數據與運算環境安全。然而，網際網路上的資料傳輸或儲存均無法保證100%安全，因此我們無法確保或擔保您傳送給我們資訊的絕對安全性。因本站未收集實名個人資料，發生個資外洩之風險極低。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">第三方服務與連結</h4>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                    本平台可能會使用第三方分析工具（如 Google Analytics 等）來分析網站流量與改善使用體驗。此外，若有外部連結至其他網站，當您離開本服務後，其資料運用及隱私權保護則適用該第三方網站的政策，我們對外部網站之行為概不負責。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">隱私權政策變更</h4>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                    本網站保留不定期修改隱私權政策之權利。當政策有重大變更時，我們將於網站上公告。在變更後持續使用本系統，即表示您已閱讀、理解並同意接受修改後的各項條款。
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-amber-50 rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    免責聲明與絕對限制
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900 text-rose-600">僅供參考，不具絕對性：</strong> 本系統所產出的任何落點分析、預估錄取區間、志願積分試算及排位建議，均是依據往年歷史數據、各區比序規則及統計演算法推估而來，<strong className="text-slate-900 border-b-2 border-rose-300">所有的結果皆僅作為同學與家長選填志願之參考，絕對不代表任何學校之錄取保證。</strong>使用者最終錄取與否，統依各區免試入學委員會及招生主辦單位公告之正式放榜結果為準。
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900">不負責任何升學損失：</strong> 考生及其家長在做出最終志願選填決策前，應多方參考班級導師、輔導室或官方簡章意見。因依賴本系統結果而產生的任何升學決策後果（含未獲錄取、高分低就等），本網站、開發團隊皆不負任何法律或賠償責任。
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900">資料準確性聲明：</strong> 各區之超額比序規則、積分計算法及招生名額可能隨官方政策每年變動。我們會盡最大努力核對公開資訊以更新資料庫，但無法擔保完全無誤或即時同步，實際規範一律以官方簡章為準。
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">使用者行為準則</h4>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                    您同意不利用本服務進行任何違法、侵權或破壞性之行為，包含但不限於：運用自動化程式（Bot、爬蟲程式）大量擷取系統資料、試圖破解或繞過系統各項安全與防護措施、傳輸含有惡意程式碼之資料，或以任何可能損害、癱瘓服務系統的方式使用本網站。違者我們有權立即終止提供服務並追究責任。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">服務之變更、暫停與終止</h4>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                    基於系統維護、功能升級或不可抗力之因素，我們保留隨時修改、暫停或永久終止本系統部份或全部功能的權利，且無須事先個別通知使用者。因服務中斷或終止所造成之不便，我們不負任何補償責任。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">智慧財產權聲明</h4>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                    本系統的所有內容，包括但不限於網站架構、程式碼、視覺設計、文字內容、演算法及資料庫編排，其智慧財產權與相關權利均為本網站開發團隊及授權者所有。未經事前之書面協議與許可，嚴禁以任何形式進行商業利用、重製、公開傳輸、改作或散布。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">準據法與管轄法院</h4>
                  <p className="text-slate-700 font-medium text-sm leading-relaxed mb-4">
                    本服務條款的解釋、補充及適用，均以中華民國法律為準據法。若因使用本系統而產生任何爭議，雙方應先以誠信原則協商解決；如協商不成而須涉訟，同意以臺灣臺北地方法院為第一審管轄法院。
                  </p>
                </div>
              </div>
            )}
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
