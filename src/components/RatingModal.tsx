import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Star } from 'lucide-react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RatingModal({ isOpen, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (localStorage.getItem('hasRatedApplet') === 'true') {
        setHasRated(true);
      }
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    
    try {
      const payload = {
        rating,
        feedback: '', // Removed feedback area
        timestamp: new Date().toISOString()
      };
      
      const clientInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href
      };
      
      await fetch('https://script.google.com/macros/s/AKfycbxAR0tyczm3-HDjdub3R-Xy1uoZ4T42Athz8VkJN5bk4gcO_GyVmyOiOBV0BCMEPKpeYg/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ action: 'submitFeedback', payload, clientInfo })
      });
      setSubmitted(true);
      localStorage.setItem('hasRatedApplet', 'true');
      setTimeout(() => {
        onClose();
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
        }, 500);
      }, 2000);
    } catch (e) {
      console.error(e);
      setSubmitting(false);
      // fallback even if fetch fails to just visually show success
      setSubmitted(true);
      localStorage.setItem('hasRatedApplet', 'true');
      setTimeout(() => {
        onClose();
        setTimeout(() => {
            setSubmitted(false);
            setRating(0);
        }, 500);
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={!submitting && !submitted ? onClose : undefined}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 flex flex-col items-center text-center overflow-hidden"
          >
            {/* Background glowing orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-300/30 blur-[60px] rounded-full pointer-events-none" />

            {!submitting && !submitted && (
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500 z-10"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="relative z-10 w-full">
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center py-6 gap-5"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-40 animate-pulse" />
                    <div className="relative w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center border-4 border-emerald-400 shadow-[4px_4px_0px_0px_rgba(52,211,153,1)]">
                      <Check className="w-10 h-10" strokeWidth={3} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">感謝您的評分！</h3>
                    <p className="text-slate-500 font-bold">您的支持是我們進步的最大動力</p>
                  </div>
                </motion.div>
              ) : hasRated ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center py-6 gap-5"
                >
                  <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center border-4 border-amber-300">
                    <Star className="w-10 h-10 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">您已經評分過囉！</h3>
                    <p className="text-slate-500 font-bold">感謝您的支持與回饋</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-white transition-all bg-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none hover:bg-slate-800"
                  >
                    關閉
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center border-4 border-amber-300 shadow-[4px_4px_0px_0px_rgba(252,211,77,1)] mb-6 -rotate-6">
                    <Star className="w-8 h-8 fill-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">您喜歡這個系統嗎？</h3>
                  <p className="text-slate-500 font-bold mb-8 text-sm">點擊星星為我們打分</p>

                  <div className="flex gap-2 justify-center mb-6">
                    {[1, 2, 3, 4, 5].map(star => (
                      <motion.button 
                        key={star} 
                        type="button"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        disabled={submitting}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9, rotate: -5 }}
                        className="relative focus:outline-none transition-colors"
                      >
                        <Star 
                          className={`w-12 h-12 transition-all duration-300 ${
                            (hoveredRating || rating) >= star 
                              ? 'fill-amber-400 text-amber-500 drop-shadow-[0_4px_8px_rgba(251,191,36,0.5)]' 
                              : 'fill-slate-100 text-slate-300'
                          }`} 
                          strokeWidth={1.5}
                        />
                      </motion.button>
                    ))}
                  </div>

                  {!submitting && (
                    <div className="flex w-full gap-3 mt-4">
                      <button 
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                      >
                        取消
                      </button>
                      <button 
                        onClick={handleSubmit}
                        disabled={rating === 0}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all ${
                          rating === 0 
                            ? 'bg-slate-300 cursor-not-allowed' 
                            : 'bg-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none hover:bg-slate-800'
                        }`}
                      >
                        送出評分
                      </button>
                    </div>
                  )}
                  
                  {submitting && (
                     <motion.p 
                       initial={{ opacity: 0 }} 
                       animate={{ opacity: 1 }} 
                       className="text-amber-600 font-bold mt-4 animate-pulse"
                     >
                       傳送中...
                     </motion.p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
