import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X, Send, Loader2 } from 'lucide-react';
import { callBackend } from '../lib/api';

interface ReportErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportErrorModal({ isOpen, onClose }: ReportErrorModalProps) {
  const [type, setType] = useState('school_data');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('請輸入問題描述');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await callBackend({
        action: 'reportError',
        payload: {
          type,
          description,
          email
        }
      });

      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      setError('回報傳送失敗，請檢查網路連線或稍後再試。'); 
      console.error('Report error failed:', err); 
    }
  };

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
          className="relative w-full max-w-lg bg-white rounded-[32px] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-rose-400 p-6 sm:p-8 relative border-b-4 border-slate-900 shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-slate-900 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 text-slate-900 mb-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rotate-3">
                <AlertCircle className="w-6 h-6 text-rose-500" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">資料錯誤回報</h2>
            </div>
            <p className="text-slate-900 font-bold opacity-80 mt-2">
              如果您發現有缺漏的學校或錯誤的資料，請協助我們進行修正，讓系統更準確！
            </p>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-slate-50">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-20 h-20 bg-emerald-100 border-4 border-emerald-500 text-emerald-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] mb-6">
                  <Send className="w-10 h-10 ml-1" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">回報已送出！</h3>
                <p className="text-slate-600 font-bold mb-8">感謝您的回饋，我們會盡快查證並更新系統資料。</p>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-slate-900 text-white font-black text-lg rounded-2xl border-4 border-slate-900 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all"
                >
                  確認並關閉
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2">錯誤類型</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                  >
                    <option value="school_data">學校/科系資料錯誤</option>
                    <option value="missing_school">學校/科系遺漏</option>
                    <option value="score_calc">計分方式錯誤</option>
                    <option value="system_bug">系統功能異常</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2">問題描述 <span className="text-rose-500">*</span></label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="請描述您發現的問題（例如：某某高中少了資訊科、計算分數和簡章不同...等等）"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all resize-none h-32"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-900 mb-2">您的電子郵件 (選填)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="如果您希望我們後續與您聯繫，請留下 Email"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-rose-100 text-rose-700 font-bold text-sm border-2 border-rose-300 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-black text-lg rounded-2xl border-4 border-slate-900 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(225,29,72,1)] active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" /> 傳送中...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> 送出回報
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
