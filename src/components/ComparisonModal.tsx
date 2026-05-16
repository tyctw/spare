import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Trash2, List } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  schools: any[];
  onRemove: (name: string) => void;
  onClear: () => void;
}

export default function ComparisonModal({ isOpen, onClose, schools, onRemove, onClear }: Props) {
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
            className="relative w-full max-w-5xl bg-slate-50 rounded-[2rem] border-4 border-slate-900 overflow-hidden shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] max-h-[90vh] flex flex-col"
          >
            <div className="p-6 bg-indigo-400 border-b-4 border-slate-900 relative overflow-hidden shrink-0">
              <div className="absolute right-0 top-0 opacity-20 -translate-y-1/4 translate-x-1/4">
                <List className="w-32 h-32 text-slate-900" />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between relative z-10 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                      <List className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">選擇比較清單</h2>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="sm:hidden w-10 h-10 bg-white rounded-xl border-4 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all"
                  >
                    <X className="w-5 h-5 text-slate-900" />
                  </button>
                </div>
                <div className="flex justify-end items-center gap-3">
                  {schools.length > 0 && (
                    <button 
                      onClick={onClear} 
                      className="flex-1 sm:flex-none justify-center px-4 py-2 bg-rose-400 text-slate-900 font-black text-sm rounded-xl border-4 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-[0px_0px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> <span>清空全部</span>
                    </button>
                  )}
                  <button 
                    onClick={onClose} 
                    className="hidden sm:flex w-10 h-10 bg-white rounded-xl border-4 border-slate-900 items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-100 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-y-0 active:shadow-none"
                  >
                    <X className="w-5 h-5 text-slate-900" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto w-full custom-scrollbar">
              {schools.length === 0 ? (
                <div className="text-center py-24 bg-white border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-3xl mx-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full border-4 border-slate-900 flex items-center justify-center mx-auto mb-4 -rotate-6">
                    <List className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-xl font-black text-slate-900">目前尚無比較學校</p>
                  <p className="text-sm font-bold text-slate-500 mt-2">請先在分析結果中勾選加入比較清單</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white mx-1">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="p-5 font-black border-r border-slate-700 w-1/4">比較維度</th>
                        {schools.map((s, i) => (
                          <th key={s.name} className={`p-5 font-black border-r border-slate-700 min-w-[200px] relative ${i % 2 === 0 ? 'bg-indigo-900' : 'bg-slate-800'}`}>
                            <div className="pr-8">{s.name}</div>
                            <button 
                              onClick={() => onRemove(s.name)} 
                              className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 bg-rose-500 text-white rounded-full border-2 border-white flex items-center justify-center hover:bg-rose-600 hover:scale-110 transition-transform shadow-md"
                            >
                              <X className="w-3 h-3 stroke-[3]" />
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white text-sm md:text-base">
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">就學區</td>
                        {schools.map((s, i) => <td key={s.name} className={`p-5 font-bold border-r border-slate-200 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>{s.region || '未知'}</td>)}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">學校類型</td>
                        {schools.map((s, i) => <td key={s.name} className={`p-5 font-bold border-r border-slate-200 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>{s.type || '未知'}</td>)}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">公立 / 私立</td>
                        {schools.map((s, i) => (
                          <td key={s.name} className={`p-5 font-bold border-r border-slate-200 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>
                            <span className={`px-2 py-1 rounded-md border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] ${s.ownership === '公立' ? 'bg-sky-200' : 'bg-amber-200'}`}>
                              {s.ownership || '未知'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">特色及群別</td>
                        {schools.map((s, i) => <td key={s.name} className={`p-5 font-bold border-r border-slate-200 text-slate-700 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>{s.group || '-'}</td>)}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">錄取門檻</td>
                        {schools.map((s, i) => <td key={s.name} className={`p-5 font-black border-r border-slate-200 text-rose-600 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>{s.minScore || s.points || s.score || '無資料'}</td>)}
                      </tr>
                      <tr className="">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">學校名額與特招</td>
                        {schools.map((s, i) => <td key={s.name} className={`p-5 font-bold border-r border-slate-200 text-slate-600 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>{s.notes || s.special || '-'}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
