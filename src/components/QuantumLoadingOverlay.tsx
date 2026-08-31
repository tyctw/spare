import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Target, Award, BrainCircuit, Activity, Lightbulb } from 'lucide-react';

interface Props {
  isOpen: boolean;
}

const strategyTips = [
  '志願排序技巧：先列出想讀的校系，再分成挑戰、適中與安全三個層級。',
  '結果較接近時，不只看積分，也要查看各就學區的超額比序規則。',
  '篩選學校時，可一起評估科別特色、通勤距離與自己的興趣。',
  '建議先加入多所學校比較，再決定志願順序，避免只看單一校系。',
  '最後送出前，記得以招生簡章與學校公告確認最新招生資訊。',
  '保守志願也要選自己願意就讀的校科，不要只為了提高錄取機會。',
  '志願序可先依真實意願排，再檢查每一層是否都有合適的選項。',
  '招生名額與比序規則每年可能調整，歷年資料適合作為參考，不是保證。',
  '若同時考慮五專與高中職，請分開整理兩條升學管道的時程與規則。',
  '選校前可先和家人討論交通、住宿與未來學習方向，減少後續調整。',
];

export default function QuantumLoadingOverlay({ isOpen }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  const steps = [
    { text: "啟動落點分析引擎...", icon: BrainCircuit, color: "bg-amber-400" },
    { text: "載入歷年錄取數據庫...", icon: Activity, color: "bg-sky-400" },
    { text: "交叉比對志願與成績...", icon: Calculator, color: "bg-indigo-400" },
    { text: "計算安全與夢幻校系...", icon: Target, color: "bg-rose-400" },
    { text: "生成最終分析報告...", icon: Award, color: "bg-emerald-400" }
  ];
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStep(step => (step + 1) % steps.length);
    }, 1100);

    return () => {
      clearInterval(stepInterval);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentTip(Math.floor(Math.random() * strategyTips.length));
    const tipInterval = window.setInterval(() => {
      setCurrentTip((current) => {
        let next = Math.floor(Math.random() * strategyTips.length);
        if (strategyTips.length > 1 && next === current) next = (next + 1) % strategyTips.length;
        return next;
      });
    }, 2600);

    return () => window.clearInterval(tipInterval);
  }, [isOpen]);

  const ActiveIcon = steps[currentStep].icon;
  const activeColor = steps[currentStep].color;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }} 
            className="w-full max-w-lg bg-white p-8 md:p-10 rounded-3xl border-4 border-slate-900 shadow-[16px_16px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center relative overflow-hidden"
          >
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f172a 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
             
             <div className="relative z-10 w-full flex justify-between items-end mb-8">
               <div>
                 <h2 className="text-3xl font-black text-slate-900 leading-tight">分析中<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>...</motion.span></h2>
                 <p className="text-slate-500 font-bold mt-1">系統正在為您精算最佳落點</p>
               </div>
               
               <div className="relative">
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                   className={`absolute -inset-2 border-4 border-dashed ${activeColor.replace('bg-', 'border-')} rounded-full opacity-50`}
                 />
                 <motion.div 
                   key={currentStep}
                   initial={{ rotate: -180, scale: 0 }}
                   animate={{ rotate: 0, scale: 1 }}
                   transition={{ type: "spring", stiffness: 260, damping: 20 }}
                   className={`w-16 h-16 rounded-2xl border-4 border-slate-900 flex justify-center items-center relative z-10 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${activeColor}`}
                 >
                   <ActiveIcon className="w-8 h-8 text-slate-900" strokeWidth={2.5} />
                 </motion.div>
               </div>
             </div>

             {/* Progress Box */}
             <div className="relative z-10 w-full bg-slate-50 border-4 border-slate-900 rounded-2xl p-4 mb-8 text-left">
               <div className="flex items-center mb-3">
                 <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                   <motion.div
                     animate={{ scale: [1, 1.2, 1] }}
                     transition={{ repeat: Infinity, duration: 1 }}
                     className={`w-2 h-2 rounded-full border border-slate-900 ${activeColor}`}
                   />
                   {steps[currentStep].text}
                 </span>
               </div>
               <div
                 className="w-full h-8 bg-white rounded-xl border-4 border-slate-900 p-0.5 overflow-hidden"
                 role="progressbar"
                 aria-label="正在進行落點分析"
               >
                 <motion.div
                   className="h-full w-1/3 bg-indigo-500 rounded-lg border-x-4 border-slate-900 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]"
                   animate={{ x: ['-120%', '320%'] }}
                   transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                 />
               </div>
               <div className="mt-3 text-center text-xs font-black tracking-widest text-slate-500">
                 系統持續運算中，請稍候
               </div>
             </div>

             <div className="relative z-10 mb-6 flex w-full items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-left">
               <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
               <div className="min-w-0"><p className="text-[11px] font-black tracking-[0.14em] text-amber-700">選填志願技巧</p><AnimatePresence mode="wait"><motion.p key={currentTip} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1 text-sm font-bold leading-5 text-amber-950">{strategyTips[currentTip]}</motion.p></AnimatePresence></div>
             </div>

             {/* Analysis status */}
             <div className="relative z-10 w-full grid grid-cols-2 gap-4">
               <div className="bg-emerald-50 border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center text-center">
                 <div className="text-sm font-black text-slate-600 mb-1">校系資料</div>
                 <div className="text-lg font-black text-emerald-600 border-b-4 border-emerald-200 pb-1 w-full">持續比對中</div>
               </div>
               <div className="bg-rose-50 border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center text-center">
                 <div className="text-sm font-black text-slate-600 mb-1">分析建議</div>
                 <div className="text-lg font-black text-rose-600 border-b-4 border-rose-200 pb-1 w-full">整理產生中</div>
               </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
