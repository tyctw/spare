import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function HeroBanner() {
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
          <span className="tracking-wide">116學年度最新版上線</span>
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
    </>
  );
}
