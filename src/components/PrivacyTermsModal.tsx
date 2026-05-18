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
                        <strong className="text-slate-900">不收集個人身份資訊：</strong> 本系統不會要求您輸入姓名、身分證字號、聯絡方式等可辨識個人的機敏資料。
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900">成績與志願：</strong> 您所輸入的會考成績、選填區域與偏好設定僅做為即時運算落點分析之用。相關數據僅會在您的瀏覽器中進行處理。
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900">去識別化分析：</strong> 為改進系統準確度及提供歷屆落點觀察，我們可能會收集去識別化的成績與最終落點資料做為統計基準，這些資料絕不會與特定使用者產生連結。
                      </p>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Cookie 與本地儲存 (Local Storage)</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    本系統可能使用瀏覽器的 Local Storage 或 Session Storage 功能，來暫存您輸入的成績或設定，以便您在重新整理頁面後無須重新輸入。您可以隨時清除瀏覽器快取來刪除這些資料。
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">第三方服務</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    本平台可能會包含連結至外部網站的資源，離開本網站後之行為及資料運用則適用該第三方網站的隱私權政策。
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-amber-50 rounded-2xl p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                    免責聲明與使用限制
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900 text-rose-600">僅供參考：</strong> 本系統提供的落點分析、預測結果及策略建議，係依據往年數據模型計算得出，<strong className="text-slate-900">結果僅提供同學與家長選填志願之參考，不代表絕對錄取保證</strong>。實際錄取結果仍依各招生委員會及各校之放榜為準。
                      </p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2 shrink-0"></div>
                      <p className="text-slate-700 font-bold leading-relaxed text-sm">
                        <strong className="text-slate-900">資料準確性：</strong> 若官方簡章、計分方式或超額比序規則臨時更動，我們將盡力更新系統，但不為資料之絕對準確性或即時性負責。
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">服務之變更與終止</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    我們保留隨時修改、暫停或永久終止本服務各項功能的權利。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">智慧財產權</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    本系統的設計、程式碼及內建之圖文素材等版權歸原創作者或其授權者所有。未經許可，禁止商業利用。
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
