import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Target, Award, BrainCircuit, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
}

export default function QuantumLoadingOverlay({ isOpen }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

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
