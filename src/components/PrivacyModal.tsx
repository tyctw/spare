import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, X, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
                <Database className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">隱私權政策</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-white">
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
                      <strong className="text-slate-900">不收集個人身份資訊：</strong> 本系統不會要求您輸入真實姓名、身分證字號、聯絡電話、詳細居住地址等可直接辨識個人的機敏資料。
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-slate-700 font-bold leading-relaxed text-sm">
                      <strong className="text-slate-900">成績與志願偏好：</strong> 您所輸入的會考各科成績、選填熱區、就讀意願與偏好設定等，僅做為本系統即時運算落點分析、排序演算法、與策略建議之用。多數運算過程將在您的個人裝置與瀏覽器中進行。
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-slate-700 font-bold leading-relaxed text-sm">
                      <strong className="text-slate-900">去識別化與統計分析：</strong> 為改進系統模型準確度、提供歷屆落點觀察趨勢，我們可能會收集並儲存完全去識別化的成績與最終落點資料，做為大數據統計基準。此類資料無法且絕不會與特定使用者產生任何連結。
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-slate-700 font-bold leading-relaxed text-sm">
                      <strong className="text-slate-900">使用行為與分析：</strong> 為了提升使用者體驗，我們可能使用第三方分析工具（如 Google Analytics 等）來蒐集去識別化的瀏覽數據、設備資訊與互動點擊紀錄，幫助我們優化平台介面設計。
                    </p>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">資料儲存與傳輸安全</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    本平台採用標準的加密傳輸協定（如 SSL/TLS）來保護資料交換的安全性。儘管我們實施了商業上合理的防護措施，但網際網路傳輸無法保證百分之百安全，使用者仍須理解並自行承擔網路傳輸的潛在風險。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Cookie 與本地儲存 (Local Storage)</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    本系統會使用瀏覽器的 Local Storage 或 Session Storage 功能，來單獨暫存您的邀請碼授權狀態、輸入成績及偏好設定，以便您在一定時間內或重新整理頁面後無須反覆驗證輸入。這些暫存資料會儲存在您的個人裝置上，您可以隨時操作清除瀏覽器快取來將其移除。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">兒童與青少年隱私保護</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-4">
                    本平台主要面向學生與家長，我們高度重視未成年人的隱私。我們強烈建議未成年學生在您的家長或法定代理人陪同與同意下存取與使用本服務。若家長發現任何未經授權的個人識別資料被意外收集，請盡速聯繫我們進行刪除。
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">第三方網站連結與服務</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed">
                    本平台可能會包含連結至外部合作夥伴或官方教育單位的網站資源，當您點擊該連結離開本網站後之所有行為及資料運用，應適用且受限於該第三方網站的隱私權政策與服務規範，本系統不對其資料處理方式負責。
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
              我同意
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
