import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Send, Sparkles, Star, X } from 'lucide-react';
import { callBackend } from '../lib/api';

interface RatingModalProps { isOpen: boolean; onClose: () => void; }

const ratingLabels = ['', '還需要加油', '有待改善', '還不錯', '很有幫助', '非常滿意'];

export default function RatingModal({ isOpen, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    setHasRated(localStorage.getItem('hasRatedApplet') === 'true');
    setError('');
    setHoveredRating(0);
  }, [isOpen]);

  const closeAndReset = () => {
    onClose();
    window.setTimeout(() => { setSubmitted(false); setRating(0); setSubmitting(false); }, 300);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    setError('');
    try {
      await callBackend({
        action: 'submitFeedback',
        payload: { rating, feedback: '', timestamp: new Date().toISOString() },
        clientInfo: { userAgent: navigator.userAgent, language: navigator.language, screenResolution: `${window.screen.width}x${window.screen.height}`, viewport: `${window.innerWidth}x${window.innerHeight}`, url: window.location.href },
      });
      localStorage.setItem('hasRatedApplet', 'true');
      setSubmitted(true);
      window.setTimeout(closeAndReset, 2200);
    } catch (submissionError) {
      console.error(submissionError);
      setError('評分傳送失敗，請檢查網路連線後再試一次。');
      setSubmitting(false);
    }
  };

  const activeRating = hoveredRating || rating;

  return <AnimatePresence>{isOpen && <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={!submitting && !submitted ? closeAndReset : undefined} className="absolute inset-0 bg-slate-950/55 backdrop-blur-md" />
    <motion.section initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} role="dialog" aria-modal="true" aria-labelledby="rating-title" className="relative w-full max-w-lg overflow-hidden rounded-[30px] border-4 border-slate-900 bg-[#fffdf8] shadow-[4px_4px_0_#0f172a]">
      <header className="relative overflow-hidden border-b-4 border-slate-900 bg-amber-300 px-5 py-5 sm:px-7"><div aria-hidden="true" className="absolute -right-5 -top-7 rotate-12 text-amber-100/70"><Star className="h-32 w-32 fill-current" /></div><div className="relative flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white shadow-[3px_3px_0_#0f172a]"><Sparkles className="h-6 w-6 text-amber-600" /></div><div><p className="text-[10px] font-black tracking-[0.18em] text-amber-900">YOUR VOICE MATTERS</p><h2 id="rating-title" className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">評分與回饋</h2></div></div>{!submitting && !submitted && <button type="button" onClick={closeAndReset} aria-label="關閉評分與回饋" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0_#0f172a] transition hover:bg-slate-100 active:translate-y-0.5 active:shadow-none"><X className="h-5 w-5" /></button>}</div></header>
      <div className="p-5 sm:p-7">{submitted ? <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-72 flex-col items-center justify-center text-center"><div className="flex h-20 w-20 items-center justify-center rounded-[28px] border-4 border-slate-900 bg-emerald-300 shadow-[5px_5px_0_#0f172a]"><Check className="h-10 w-10" strokeWidth={3} /></div><h3 className="mt-6 text-2xl font-black text-slate-900">感謝您的回饋！</h3><p className="mt-2 max-w-xs text-sm font-bold leading-6 text-slate-600">您的評分會幫助我們持續改善工具與使用體驗。</p></motion.div> : hasRated ? <div className="flex min-h-72 flex-col items-center justify-center text-center"><div className="flex h-20 w-20 items-center justify-center rounded-[28px] border-4 border-slate-900 bg-indigo-100 shadow-[5px_5px_0_#0f172a]"><Star className="h-10 w-10 fill-amber-400 text-amber-500" /></div><h3 className="mt-6 text-2xl font-black text-slate-900">您已留下評分</h3><p className="mt-2 max-w-xs text-sm font-bold leading-6 text-slate-600">謝謝您的支持；我們會持續讓系統更好用。</p><button type="button" onClick={closeAndReset} className="mt-7 rounded-xl border-2 border-slate-900 bg-slate-900 px-7 py-3 text-sm font-black text-white shadow-[3px_3px_0_#fbbf24] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">關閉</button></div> : <div><p className="text-center text-sm font-bold leading-6 text-slate-600">花幾秒告訴我們你的使用感受，讓下一次的分析更貼近你的需要。</p><div className="mt-6 rounded-2xl border-2 border-slate-900 bg-white p-5 text-center shadow-[3px_3px_0_#0f172a]"><p className="text-sm font-black text-slate-900">這次使用體驗如何？</p><div className="mt-4 flex justify-center gap-1.5" role="radiogroup" aria-label="評分"><>{[1, 2, 3, 4, 5].map((star) => <motion.button key={star} type="button" role="radio" aria-checked={rating === star} aria-label={`${star} 星：${ratingLabels[star]}`} onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} onFocus={() => setHoveredRating(star)} onBlur={() => setHoveredRating(0)} onClick={() => setRating(star)} whileHover={{ scale: 1.16, rotate: 5 }} whileTap={{ scale: 0.92 }} className="rounded-lg p-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"><Star className={`h-10 w-10 transition ${activeRating >= star ? 'fill-amber-400 text-amber-500 drop-shadow-[0_3px_0_#92400e]' : 'fill-slate-100 text-slate-300'}`} strokeWidth={2} /></motion.button>)}</></div><p className="mt-3 h-5 text-sm font-black text-amber-700">{activeRating ? ratingLabels[activeRating] : '請選擇 1 至 5 星'}</p></div>{error && <p role="alert" className="mt-4 rounded-xl border-2 border-rose-300 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}<div className="mt-5 flex gap-3"><button type="button" onClick={closeAndReset} className="flex-1 rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100">稍後再說</button><button type="button" onClick={handleSubmit} disabled={rating === 0 || submitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0_#fbbf24] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:shadow-none">{submitting ? '傳送中…' : <><Send className="h-4 w-4" />送出評分</>}</button></div></div>}</div>
    </motion.section>
  </div>}</AnimatePresence>;
}
