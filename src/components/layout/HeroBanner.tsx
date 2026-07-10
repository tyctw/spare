import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Info } from 'lucide-react';

interface HeroBannerProps {
  onDataProviderClick: () => void;
}

export default function HeroBanner({ onDataProviderClick }: HeroBannerProps) {
  return (
    <>
      {/* NEW HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pt-8 pb-12 sm:pt-12 sm:pb-16 flex flex-col items-center justify-center text-center px-2"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-black rounded-full mb-8 border-2 border-indigo-200 shadow-sm"
        >
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="tracking-wide">115學年度最新版上線</span>
        </motion.div>
        
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          探索適合你的<br className="sm:hidden" />
          <span className="relative inline-block mt-2 sm:mt-0">
             <span className="relative z-10 text-indigo-600">未來理想校系</span>
             <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-4 sm:h-6 bg-amber-300 -z-10 -rotate-1 rounded-sm"></span>
          </span>
        </h2>
        
        <p className="text-slate-600 font-bold text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          我們致力於提供最精準的會考落點資訊，幫助每一位國中生發掘潛能，探索最適合的高中職校與職群發展方向。
        </p>
      </motion.div>

      {/* Announcement Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-indigo-100 border-4 border-slate-900 rounded-[2rem] p-5 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden mb-8"
      >
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
          <Info className="w-32 h-32 text-indigo-900" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start md:items-center">
          <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl border-4 border-slate-900 flex flex-shrink-0 items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-6 hover:rotate-0 transition-transform">
             <Info className="w-7 h-7" />
          </div>
          <div className="flex-1">
             <h3 className="font-black text-xl text-slate-900 mb-1.5 flex items-center gap-2">
               系統公告 <span className="bg-rose-500 text-white text-[10px] uppercase px-2 py-1 rounded-full animate-pulse border-2 border-slate-900">HOT</span>
             </h3>
             <p className="font-bold text-slate-700 text-sm sm:text-base leading-relaxed">
               115 學年度最新落點資料將於「公布個人序位區間」後進行全面更新。<br className="hidden lg:block"/>
               <span className="text-indigo-800">歡迎各高中職校方、補教機構與我們聯繫，提供歷年錄取數據並申請專屬邀請碼！</span>
             </p>
          </div>
          <button onClick={onDataProviderClick} className="w-full md:w-auto text-center px-6 py-3 bg-white border-4 border-slate-900 font-black text-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all whitespace-nowrap">
            提供歷屆數據
          </button>
        </div>
      </motion.div>
    </>
  );
}
