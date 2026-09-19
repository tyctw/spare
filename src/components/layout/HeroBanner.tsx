import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function HeroBanner() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center px-2 pb-12 pt-8 text-center sm:pb-16 sm:pt-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-indigo-200 bg-white px-5 py-2.5 font-black text-indigo-700 shadow-sm"
        >
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <span className="tracking-wide">116學年度最新版上線</span>
        </motion.div>

        <h2 className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
          探索適合你的<br className="sm:hidden" />
          <span className="relative mt-2 inline-block sm:mt-0"><span className="relative z-10 text-indigo-600">未來理想校系</span><span className="absolute bottom-1 left-0 -z-10 h-4 w-full -rotate-1 rounded-sm bg-amber-300 sm:bottom-2 sm:h-6" /></span>
        </h2>

        <p className="mx-auto max-w-2xl text-lg font-bold leading-relaxed text-slate-600 sm:text-xl">我們致力於提供最精準的會考落點資訊，幫助每一位國中生發掘潛能，探索最適合的高中職校與職群發展方向。</p>
      </motion.div>
    </>
  );
}
