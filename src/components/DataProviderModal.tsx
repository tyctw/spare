import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, AlertTriangle, Users, BookOpen } from 'lucide-react';

interface DataProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataProviderModal({ isOpen, onClose }: DataProviderModalProps) {
  if (!isOpen) return null;

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
          className="relative w-full max-w-lg bg-slate-50 border-4 border-slate-900 rounded-3xl shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b-4 border-slate-900 flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-100 border-2 border-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  提供歷屆數據聯繫
                </h2>
                <p className="text-sm font-bold text-slate-500 mt-1">請確認您的身分</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 border-2 border-transparent hover:border-slate-900 rounded-xl transition-all"
            >
              <X className="w-6 h-6 text-slate-600 hover:text-slate-900" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            <div className="bg-rose-50 border-4 border-slate-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                <AlertTriangle className="w-32 h-32 text-rose-900" />
              </div>
              <h3 className="font-black text-xl text-rose-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6" /> 注意事項
              </h3>
              <p className="text-slate-800 font-bold text-base leading-relaxed mb-3">
                此聯繫信箱 <strong className="text-rose-600">僅提供給各高中職校方、補教機構</strong> 聯繫合作及提供歷年錄取數據使用。
              </p>
              <div className="bg-white border-2 border-rose-200 rounded-xl p-3">
                <p className="text-rose-600 font-black text-sm flex items-center gap-2">
                  <X className="w-5 h-5 shrink-0" />
                  學生或家長請勿來信索取歷屆成績或邀請碼。
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-black text-slate-900 text-lg flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-indigo-600" /> 我了解並確認我是：
              </h4>
              <a
                href="mailto:tyctw.analyze@gmail.com"
                onClick={onClose}
                className="w-full text-center px-6 py-4 bg-indigo-500 border-4 border-slate-900 font-black text-white text-lg rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-indigo-400 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
              >
                校方 / 補教機構代表，前往來信
              </a>
              <button
                onClick={onClose}
                className="w-full text-center px-6 py-4 bg-slate-100 border-4 border-slate-900 font-black text-slate-700 text-lg rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
              >
                我是學生或家長，返回首頁
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
