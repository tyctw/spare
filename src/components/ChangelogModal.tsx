import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, Sparkles, Rocket, Cpu, Bug, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LOGS = [
  {
    version: 'v2.1',
    date: '2026-05-16',
    title: '全新主視覺與科系百科',
    icon: Star,
    color: 'emerald',
    changes: [
      '新增「職群/科系深入介紹百科」功能，提供學生更完善的群科資訊',
      '全新設計的響應式模塊化抽屜選單 (Drawer)，視覺層次更加豐富',
      '優化行動裝置上「選擇比較清單」的操作體驗，清空按鈕更易點擊',
      '重構系統底層元件，提升頁面切換與組件渲染效能'
    ]
  },
  {
    version: 'v2.0',
    date: '2026-05-10',
    title: 'New Bento Grid UI',
    icon: Sparkles,
    color: 'indigo',
    changes: [
      '全面導入 Bento Grid 模塊化設計，資訊閱讀更直覺',
      '新增多所學校加入比較分析清單功能（最多可同步比較 4 所）',
      '增強對各就學區最新計分規則的支援與動態校正',
      '提供多樣化資料匯出格式功能 (Excel, JSON, TXT)',
      '實作全新使用者登入驗證遮罩層，確保授權安全性'
    ]
  },
  {
    version: 'v1.5',
    date: '2024-12-15',
    title: '數據更新與穩定性提升',
    icon: Rocket,
    color: 'rose',
    changes: [
      '增強資料匯出功能的穩定性與 Excel 軟體相容度',
      '更新 113 年度各大就學區學校最低錄取標準參考數據庫',
      '優化會考各科成績的加權計算邏輯，提升預測準確度'
    ]
  },
  {
    version: 'v1.1',
    date: '2024-08-20',
    title: '問題修復與介面微調',
    icon: Bug,
    color: 'amber',
    changes: [
      '修正部份行動裝置在點擊下拉選單後導致頁面偏移的問題',
      '微調落點分析結果頁面的色彩對比度，提升無障礙閱讀體驗',
      '優化學校詳情對話框的過渡動畫流暢度'
    ]
  },
  {
    version: 'v1.0',
    date: '2024-05-01',
    title: '會考落點分析系統 正式上線',
    icon: Cpu,
    color: 'slate',
    changes: [
      '支援全國主要就學區的會考成績轉換與落點預測',
      '提供視覺化圖表與 PR 值區間建議',
      '建立基礎學校資料庫、類科對應與學制查詢功能'
    ]
  }
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-500 border-emerald-700 text-emerald-900',
  indigo: 'bg-indigo-500 border-indigo-700 text-indigo-900',
  rose: 'bg-rose-500 border-rose-700 text-rose-900',
  amber: 'bg-amber-500 border-amber-700 text-amber-900',
  slate: 'bg-slate-500 border-slate-700 text-slate-900',
};

const lightColorMap: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  rose: 'bg-rose-100 text-rose-700 border-rose-300',
  amber: 'bg-amber-100 text-amber-700 border-amber-300',
  slate: 'bg-slate-100 text-slate-700 border-slate-300',
};

export default function ChangelogModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
             className="relative w-full max-w-3xl bg-slate-50 rounded-[32px] shadow-2xl border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 sm:px-8 sm:py-6 border-b-4 border-slate-900 flex items-center justify-between bg-white z-10 shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 border-2 border-slate-900 rounded-2xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                     <History className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">系統更新日誌</h2>
                    <p className="text-sm font-bold text-slate-500 mt-1">版本演進與功能里程碑</p>
                  </div>
               </div>
               <button 
                  onClick={onClose} 
                  className="w-10 h-10 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center hover:bg-slate-100 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none shrink-0"
               >
                  <X className="w-5 h-5 text-slate-900" />
               </button>
            </div>

            {/* Timeline Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-slate-50 relative">
               {/* Timeline Line */}
               <div className="absolute left-[39px] sm:left-[47px] top-8 bottom-8 w-1 bg-slate-200 rounded-full" />

               <div className="space-y-10 relative">
                  {LOGS.map((log, index) => (
                    <div key={log.version} className="relative flex gap-4 sm:gap-6 group">
                       {/* Timeline Marker */}
                       <div className="relative z-10 flex flex-col items-center shrink-0">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 transition-transform bg-white z-10 ${lightColorMap[log.color]}`}>
                            <log.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                       </div>

                       {/* Content Content */}
                       <div className="flex-1 pt-1 pb-4">
                          <div className="bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-0.5 transition-all">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{log.title}</h3>
                                <div className="flex items-center gap-3">
                                   <span className={`px-2.5 py-1 rounded-lg border-2 border-slate-900 font-bold text-xs shadow-sm bg-white`}>
                                     {log.version}
                                   </span>
                                   <span className="text-sm font-bold text-slate-400 pr-1">{log.date}</span>
                                </div>
                             </div>
                             
                             <ul className="space-y-3">
                                {log.changes.map((change, i) => (
                                   <li key={i} className="flex items-start gap-3 text-slate-700 font-bold text-[15px] leading-relaxed">
                                      <span className={`w-2 h-2 rounded-full mt-2 shrink-0 border border-slate-900 ${colorMap[log.color].split(' ')[0]}`} />
                                      {change}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-4 bg-white border-t-4 border-slate-900 flex justify-center shrink-0 w-full sm:hidden">
                <button 
                  onClick={onClose} 
                  className="w-full py-3 bg-slate-900 text-white rounded-xl border-2 border-slate-900 font-black text-lg active:scale-95 transition-transform"
                >
                  關閉返回
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
