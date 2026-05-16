import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function InfoModal({ isOpen, onClose, title, icon, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                {icon} {title}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border-2 border-transparent hover:border-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto font-medium text-slate-700 space-y-4">
              {children}
            </div>
            <div className="p-4 border-t border-slate-200 bg-white items-center flex justify-end">
              <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-800 transition-all active:translate-y-1 active:shadow-none">
                 關閉
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
