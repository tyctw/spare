import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileJson, FileText, FileSpreadsheet, Printer, Download } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: 'txt' | 'excel' | 'json' | 'print') => void;
}

export default function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
          >
            {/* Header */}
            <div className="p-6 bg-emerald-400 border-b-4 border-slate-900 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-20 -translate-y-1/4 translate-x-1/4">
                <Download className="w-32 h-32 text-slate-900" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                    <Download className="w-6 h-6 text-slate-900" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">匯出報告</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="w-10 h-10 bg-white rounded-xl border-4 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-100 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-0 active:shadow-none"
                >
                  <X className="w-5 h-5 text-slate-900" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 bg-slate-50">
              <p className="text-sm font-bold text-slate-600 mb-6">選擇您需要的格式來下載完整的落點分析報告：</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { onExport('excel'); onClose(); }}
                  className="group flex flex-col items-center gap-3 p-6 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-0 active:shadow-none"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-slate-900">EXCEL</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Spreadsheet</div>
                  </div>
                </button>

                <button
                  onClick={() => { onExport('json'); onClose(); }}
                  className="group flex flex-col items-center gap-3 p-6 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-0 active:shadow-none"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileJson className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-slate-900">JSON</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Data Object</div>
                  </div>
                </button>
                
                <button
                  onClick={() => { onExport('txt'); onClose(); }}
                  className="group flex flex-col items-center gap-3 p-6 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-0 active:shadow-none"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-slate-900">TXT</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Plain Text</div>
                  </div>
                </button>

                <button
                  onClick={() => { onExport('print'); onClose(); }}
                  className="group flex flex-col items-center gap-3 p-6 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-0 active:shadow-none"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Printer className="w-6 h-6 text-slate-600" />
                  </div>
                  <div className="text-center">
                    <div className="font-black text-slate-900">PRINT</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Print Preview</div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
