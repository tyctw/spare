import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChartBar, Info, GraduationCap, PenTool } from 'lucide-react';

interface HistoricalStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const table115 = [
  ["5A0B0C", "16293", "9.04%", "712", "4.37%", "0.40%", "8097", "49.70%", "4.49%", "7166", "43.98%", "3.98%", "318", "1.95%", "0.18%"],
  ["4A1B0C", "9801", "5.44%", "159", "1.62%", "0.09%", "3702", "37.77%", "2.05%", "5575", "56.88%", "3.09%", "365", "3.72%", "0.20%"],
  ["4A0B1C", "31", "0.02%", "0", "0.00%", "0.00%", "4", "12.90%", "0.00%", "21", "67.74%", "0.01%", "6", "19.35%", "0.00%"],
  ["3A2B0C", "9940", "5.52%", "121", "1.22%", "0.07%", "3098", "31.17%", "1.72%", "6197", "62.34%", "3.44%", "524", "5.27%", "0.29%"],
  ["3A1B1C", "89", "0.05%", "0", "0.00%", "0.00%", "5", "5.62%", "0.00%", "59", "66.29%", "0.03%", "25", "28.09%", "0.01%"],
  ["3A0B2C", "1", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%", "1", "100.00%", "0.00%", "0", "0.00%", "0.00%"],
  ["2A3B0C", "12694", "7.05%", "88", "0.69%", "0.05%", "3401", "26.79%", "1.89%", "8317", "65.52%", "4.62%", "888", "7.00%", "0.49%"],
  ["2A2B1C", "361", "0.20%", "2", "0.55%", "0.00%", "58", "16.07%", "0.03%", "221", "61.22%", "0.12%", "80", "22.16%", "0.04%"],
  ["2A1B2C", "6", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%", "5", "83.33%", "0.00%", "1", "16.67%", "0.00%"],
  ["2A0B3C", "2", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%", "2", "100.00%", "0.00%"],
  ["1A4B0C", "20332", "11.28%", "89", "0.44%", "0.05%", "4114", "20.23%", "2.28%", "14010", "68.91%", "7.78%", "2119", "10.42%", "1.18%"],
  ["1A3B1C", "2010", "1.12%", "2", "0.10%", "0.00%", "236", "11.74%", "0.13%", "1236", "61.49%", "0.69%", "536", "26.67%", "0.30%"],
  ["1A2B2C", "318", "0.18%", "0", "0.00%", "0.00%", "28", "8.81%", "0.02%", "166", "52.20%", "0.09%", "124", "38.99%", "0.07%"],
  ["1A1B3C", "119", "0.07%", "1", "0.84%", "0.00%", "7", "5.88%", "0.00%", "45", "37.82%", "0.02%", "66", "55.46%", "0.04%"],
  ["1A0B4C", "90", "0.05%", "0", "0.00%", "0.00%", "1", "1.11%", "0.00%", "10", "11.11%", "0.01%", "79", "87.78%", "0.04%"],
  ["0A5B0C", "40598", "22.53%", "69", "0.17%", "0.04%", "5249", "12.93%", "2.91%", "29129", "71.75%", "16.17%", "6151", "15.15%", "3.41%"],
  ["0A4B1C", "20952", "11.63%", "12", "0.06%", "0.01%", "1479", "7.06%", "0.82%", "13500", "64.43%", "7.49%", "5961", "28.45%", "3.31%"],
  ["0A3B2C", "14524", "8.06%", "4", "0.03%", "0.00%", "696", "4.79%", "0.39%", "8457", "58.23%", "4.69%", "5367", "36.95%", "2.98%"],
  ["0A2B3C", "11567", "6.42%", "2", "0.02%", "0.00%", "327", "2.83%", "0.18%", "5817", "50.29%", "3.23%", "5421", "46.87%", "3.01%"],
  ["0A1B4C", "9962", "5.53%", "0", "0.00%", "0.00%", "153", "1.54%", "0.08%", "3736", "37.50%", "2.07%", "6073", "60.96%", "3.37%"],
  ["0A0B5C", "10490", "5.82%", "0", "0.00%", "0.00%", "40", "0.38%", "0.02%", "2171", "20.70%", "1.20%", "8279", "78.92%", "4.59%"],
];

export const table114 = [
  ["5A0B0C", "16547", "9.59%", "541", "3.27%", "0.31%", "7921", "47.87%", "4.59%", "7798", "47.13%", "4.52%", "287", "1.73%", "0.17%"],
  ["4A1B0C", "9553", "5.54%", "134", "1.40%", "0.08%", "3401", "35.60%", "1.97%", "5705", "59.72%", "3.31%", "313", "3.28%", "0.18%"],
  ["4A0B1C", "23", "0.01%", "0", "0.00%", "0.00%", "1", "4.35%", "0.00%", "20", "86.96%", "0.01%", "2", "8.70%", "0.00%"],
  ["3A2B0C", "9922", "5.75%", "88", "0.89%", "0.05%", "3044", "30.68%", "1.76%", "6342", "63.92%", "3.68%", "448", "4.52%", "0.26%"],
  ["3A1B1C", "69", "0.04%", "0", "0.00%", "0.00%", "10", "14.49%", "0.01%", "46", "66.67%", "0.03%", "13", "18.84%", "0.01%"],
  ["3A0B2C", "0", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%"],
  ["2A3B0C", "12237", "7.09%", "68", "0.56%", "0.04%", "3092", "25.27%", "1.79%", "8319", "67.98%", "4.82%", "758", "6.19%", "0.44%"],
  ["2A2B1C", "318", "0.18%", "1", "0.31%", "0.00%", "44", "13.84%", "0.03%", "206", "64.78%", "0.12%", "67", "21.07%", "0.04%"],
  ["2A1B2C", "7", "0.00%", "0", "0.00%", "0.00%", "2", "28.57%", "0.00%", "5", "71.43%", "0.00%", "0", "0.00%", "0.00%"],
  ["2A0B3C", "0", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%", "0", "0.00%", "0.00%"],
  ["1A4B0C", "19528", "11.32%", "64", "0.33%", "0.04%", "3642", "18.65%", "2.11%", "14052", "71.96%", "8.15%", "1770", "9.06%", "1.03%"],
  ["1A3B1C", "1958", "1.14%", "1", "0.05%", "0.00%", "242", "12.36%", "0.14%", "1308", "66.80%", "0.76%", "407", "20.79%", "0.24%"],
  ["1A2B2C", "293", "0.17%", "2", "0.68%", "0.00%", "31", "10.58%", "0.02%", "173", "59.04%", "0.10%", "87", "29.69%", "0.05%"],
  ["1A1B3C", "84", "0.05%", "0", "0.00%", "0.00%", "8", "9.52%", "0.00%", "33", "39.29%", "0.02%", "43", "51.19%", "0.02%"],
  ["1A0B4C", "86", "0.05%", "0", "0.00%", "0.00%", "1", "1.16%", "0.00%", "16", "18.60%", "0.01%", "69", "80.23%", "0.04%"],
  ["0A5B0C", "38479", "22.31%", "51", "0.13%", "0.03%", "4562", "11.86%", "2.64%", "28692", "74.57%", "16.63%", "5174", "13.45%", "3.00%"],
  ["0A4B1C", "19710", "11.43%", "13", "0.07%", "0.01%", "1291", "6.55%", "0.75%", "13441", "68.19%", "7.79%", "4965", "25.19%", "2.88%"],
  ["0A3B2C", "13987", "8.11%", "5", "0.04%", "0.00%", "623", "4.45%", "0.36%", "8705", "62.24%", "5.05%", "4654", "33.27%", "2.70%"],
  ["0A2B3C", "10724", "6.22%", "2", "0.02%", "0.00%", "309", "2.88%", "0.18%", "5893", "54.95%", "3.42%", "4520", "42.15%", "2.62%"],
  ["0A1B4C", "8957", "5.19%", "0", "0.00%", "0.00%", "121", "1.35%", "0.07%", "3751", "41.88%", "2.17%", "5085", "56.77%", "2.95%"],
  ["0A0B5C", "9999", "5.80%", "1", "0.01%", "0.00%", "48", "0.48%", "0.03%", "2510", "25.10%", "1.46%", "7440", "74.41%", "4.31%"],
];

const RowComponent = ({ row, index }: { row: string[], index: number, key?: React.Key }) => {
  return (
    <tr className={`border-b-2 border-slate-200 hover:bg-indigo-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
      <td className="px-3 py-2 font-black text-slate-800 border-r-2 border-slate-200 whitespace-nowrap sticky left-0 z-10 w-24" style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
        {row[0]}
      </td>
      <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-right">{row[1]}</td>
      <td className="px-3 py-2 text-indigo-700 font-bold border-r-4 border-slate-300 whitespace-nowrap text-right">{row[2]}</td>
      
      {/* 6級分 */}
      <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-right">{row[3]}</td>
      <td className="px-3 py-2 text-slate-500 text-xs whitespace-nowrap text-right">{row[4]}</td>
      <td className="px-3 py-2 font-bold text-amber-600 border-r-2 border-slate-200 whitespace-nowrap text-right">{row[5]}</td>
      
      {/* 5級分 */}
      <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-right">{row[6]}</td>
      <td className="px-3 py-2 text-slate-500 text-xs whitespace-nowrap text-right">{row[7]}</td>
      <td className="px-3 py-2 font-bold text-amber-600 border-r-2 border-slate-200 whitespace-nowrap text-right">{row[8]}</td>
      
      {/* 4級分 */}
      <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-right">{row[9]}</td>
      <td className="px-3 py-2 text-slate-500 text-xs whitespace-nowrap text-right">{row[10]}</td>
      <td className="px-3 py-2 font-bold text-amber-600 border-r-2 border-slate-200 whitespace-nowrap text-right">{row[11]}</td>
      
      {/* 3級分以下 */}
      <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-right">{row[12]}</td>
      <td className="px-3 py-2 text-slate-500 text-xs whitespace-nowrap text-right">{row[13]}</td>
      <td className="px-3 py-2 font-bold text-amber-600 whitespace-nowrap text-right">{row[14]}</td>
    </tr>
  );
};

export default function HistoricalStatsModal({ isOpen, onClose }: HistoricalStatsModalProps) {
  const [activeTab, setActiveTab] = useState<'115' | '114'>('115');

  if (!isOpen) return null;

  const currentData = activeTab === '115' ? table115 : table114;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          className="relative w-full max-w-6xl max-h-[90vh] bg-slate-50 border-4 border-slate-900 rounded-3xl shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b-4 border-slate-900 flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 border-2 border-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <ChartBar className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  歷年會考統計資料
                </h2>
                <p className="text-sm sm:text-base font-bold text-slate-500 mt-1">各等級類別暨寫作測驗級分人數百分比</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 border-2 border-transparent hover:border-slate-900 rounded-xl transition-all"
            >
              <X className="w-6 h-6 text-slate-600 hover:text-slate-900" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('115')}
                className={`flex-1 py-3 px-4 rounded-2xl border-4 font-black transition-all ${activeTab === '115' ? 'bg-indigo-400 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-slate-900 translate-y-0 text-xl' : 'bg-white border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 text-lg'}`}
              >
                115 學年度
              </button>
              <button 
                onClick={() => setActiveTab('114')}
                className={`flex-1 py-3 px-4 rounded-2xl border-4 font-black transition-all ${activeTab === '114' ? 'bg-indigo-400 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-slate-900 translate-y-0 text-xl' : 'bg-white border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 text-lg'}`}
              >
                114 學年度
              </button>
            </div>

            {/* Analysis card */}
            <div className="bg-sky-50 border-4 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <h3 className="font-black text-xl text-slate-900 mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-sky-600" /> 兩年成績綜合分析與解析
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-slate-900 rounded-xl p-4">
                  <h4 className="font-black text-lg text-indigo-700 mb-2 border-b-2 border-indigo-100 pb-2">頂尖群體 (5A與4A) 競爭加劇</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-2">
                    115年 5A0B0C 考生為 16,293 人 (9.04%)，較 114年 16,547 人 (9.59%) 微幅下降。然而，在最頂尖的 5A 群體中，寫作達到滿分六級分的人數從 114年的 541人 增加至 115年的 712人。
                  </p>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed">
                    這顯示雖然 5A 總人數略減，但最前端考生的<strong>寫作能力顯著提升</strong>，前三志願的競爭在「寫作級分」與「A++個數」上恐更顯激烈。
                  </p>
                </div>
                
                <div className="bg-white border-2 border-slate-900 rounded-xl p-4">
                  <h4 className="font-black text-lg text-emerald-700 mb-2 border-b-2 border-emerald-100 pb-2">中段班板塊穩定 (3A至1A)</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-2">
                    3A 與 2A 考生的總體比例在兩年間變動不大，且多數考生的寫作級分落在四級分（此區間達 60%~70% 的考生皆為四級分）。
                  </p>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed">
                    對於落在這區間的考生，若能將<strong>寫作提升至五級分</strong>，將具有極強的同分超額比序優勢，是未來學弟妹應重視的投資點。
                  </p>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-xl p-4">
                  <h4 className="font-black text-lg text-rose-700 mb-2 border-b-2 border-rose-100 pb-2">基礎等級 (0A) 佔比最大</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-2">
                    0A5B0C 的考生在 115 年達到 40,598 人 (22.53%)，相較 114 年 (22.31%) 微升。整體 0A 總人數超過全體半數。
                  </p>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed">
                    顯示多數考生的學習仍以基礎能力為主，公立高職與社區高中的錄取落點預估將十分密集，<strong>選填志願的策略與適性</strong>將比單純看分數影響更深。
                  </p>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-xl p-4">
                  <h4 className="font-black text-lg text-amber-700 mb-2 border-b-2 border-amber-100 pb-2">寫作測驗表現趨勢</h4>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed mb-2">
                    雖然頂尖考生的六級分人數增加，但整體來看，獲得三級分以下的比例也維持在一定數字 (多落於 0A~1A 區段)，呈現強弱兩極化。
                  </p>
                  <p className="text-slate-700 font-bold text-sm leading-relaxed">
                    未來會考除了學科測驗外，文字表達與論述能力已成為<strong>拉開分數差距的絕對關鍵</strong>，平時應加強閱讀理解與邏輯寫作訓練。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-slate-900 rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-indigo-100 border-b-4 border-slate-900">
                    <tr>
                      <th rowSpan={2} className="px-4 py-3 border-r-2 border-slate-900 font-black text-slate-900 text-center sticky left-0 z-20 whitespace-nowrap" style={{ backgroundColor: '#e0e7ff' }}>
                        <div className="flex items-center justify-center gap-2">
                          <GraduationCap className="w-5 h-5" /> 類別
                        </div>
                      </th>
                      <th colSpan={2} className="px-3 py-2 border-r-4 border-slate-900 font-black text-slate-900 text-center bg-indigo-200">
                        總體情況
                      </th>
                      <th colSpan={3} className="px-3 py-2 border-r-4 border-slate-900 font-black text-slate-900 text-center bg-purple-200">
                        <div className="flex items-center justify-center gap-1"><PenTool className="w-4 h-4" /> 六級分</div>
                      </th>
                      <th colSpan={3} className="px-3 py-2 border-r-4 border-slate-900 font-black text-slate-900 text-center bg-sky-200">
                        <div className="flex items-center justify-center gap-1"><PenTool className="w-4 h-4" /> 五級分</div>
                      </th>
                      <th colSpan={3} className="px-3 py-2 border-r-4 border-slate-900 font-black text-slate-900 text-center bg-emerald-200">
                        <div className="flex items-center justify-center gap-1"><PenTool className="w-4 h-4" /> 四級分</div>
                      </th>
                      <th colSpan={3} className="px-3 py-2 font-black text-slate-900 text-center bg-rose-200">
                        <div className="flex items-center justify-center gap-1"><PenTool className="w-4 h-4" /> 三級分以下</div>
                      </th>
                    </tr>
                    <tr className="bg-indigo-50 border-b-2 border-slate-900 text-xs text-center border-t-2 border-t-slate-300">
                      {/* Overall */}
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap">人數</th>
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-4 border-slate-900 whitespace-nowrap">百分比</th>
                      
                      {/* 6 */}
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap bg-purple-100">人數</th>
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap bg-purple-100">占同類%</th>
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-4 border-slate-900 whitespace-nowrap bg-purple-100">占總%</th>
                      
                      {/* 5 */}
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap bg-sky-100">人數</th>
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap bg-sky-100">占同類%</th>
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-4 border-slate-900 whitespace-nowrap bg-sky-100">占總%</th>
                      
                      {/* 4 */}
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap bg-emerald-100">人數</th>
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap bg-emerald-100">占同類%</th>
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-4 border-slate-900 whitespace-nowrap bg-emerald-100">占總%</th>

                      {/* 3 below */}
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap bg-rose-100">人數</th>
                      <th className="px-2 py-2 font-bold text-slate-700 border-r-2 border-slate-200 whitespace-nowrap bg-rose-100">占同類%</th>
                      <th className="px-2 py-2 font-bold text-slate-700 whitespace-nowrap bg-rose-100">占總%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row, i) => (
                      <RowComponent key={i} row={row} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-amber-50 border-4 border-slate-900 rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Info className="w-16 h-16 text-amber-900" />
              </div>
              <h3 className="font-black text-xl text-slate-900 mb-3 flex items-center gap-2">
                <Info className="w-6 h-6 text-amber-600" /> 統計表備註
              </h3>
              <div className="space-y-2 text-sm sm:text-base font-bold text-slate-600">
                <p>1. 表格中之 A、B、C 分別表示精熟、基礎及待加強等級。例如：5A0B0C 表示國文、英語、數學、社會、自然五科皆為精熟等級之類別。</p>
                <p>2. 考生寫作測驗成績歸類為六級分、五級分、四級分與三級分以下。</p>
                <p>3. 各類別暨寫作測驗級分人數百分比係以各科皆為有效人數計算（即扣除任一科缺考、重大違規、免參加英語（聽力）考試及使用點字試題本等應試情況之考生）。</p>
                <div className="mt-4 p-3 bg-white border-2 border-slate-900 rounded-xl inline-block shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  {activeTab === '115' ? (
                    <span className="text-amber-700">115學年度有效人數：<strong className="text-xl">180,180</strong> 人</span>
                  ) : (
                    <span className="text-amber-700">114學年度有效人數包含於統計基數內，數據來源為國中教育會考全國試務會。</span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
