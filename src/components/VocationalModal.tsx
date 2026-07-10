import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle } from 'lucide-react';

const vocationalGroupsList = [
  { id: '機械群', label: '機械群', icon: '⚙️', holland: 'R / I' },
  { id: '動力機械群', label: '動力機械群', icon: '🚗', holland: 'R / I' },
  { id: '電機與電子群', label: '電機與電子群', icon: '⚡', holland: 'R / I / C' },
  { id: '化工群', label: '化工群', icon: '🧪', holland: 'I / R' },
  { id: '土木與建築群', label: '土木與建築群', icon: '🏗️', holland: 'R / I / A' },
  { id: '商業與管理群', label: '商業與管理群', icon: '💼', holland: 'E / C' },
  { id: '外語群', label: '外語群', icon: '🌍', holland: 'S / A / E' },
  { id: '設計群', label: '設計群', icon: '🎨', holland: 'A / R' },
  { id: '農業群', label: '農業群', icon: '🌱', holland: 'R / I' },
  { id: '食品群', label: '食品群', icon: '🍔', holland: 'R / I / A' },
  { id: '家政群', label: '家政群', icon: '🏠', holland: 'S / A / R' },
  { id: '餐旅群', label: '餐旅群', icon: '🏨', holland: 'S / E' },
  { id: '水產群', label: '水產群', icon: '🐟', holland: 'R / I' },
  { id: '海事群', label: '海事群', icon: '🚢', holland: 'R / E / C' },
  { id: '藝術群', label: '藝術群', icon: '🎭', holland: 'A' }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedGroups: string[];
  onChange: (groups: string[]) => void;
  onOpenHollandTest?: () => void;
}

export default function VocationalModal({ isOpen, onClose, selectedGroups, onChange, onOpenHollandTest }: Props) {
  const isAllSelected = selectedGroups.includes('all');

  const toggleGroup = (id: string) => {
    if (id === 'all') {
      onChange(['all']);
      return;
    }
    
    let newGroups = selectedGroups.filter(g => g !== 'all');
    if (newGroups.includes(id)) {
      newGroups = newGroups.filter(g => g !== id);
    } else {
      newGroups.push(id);
    }

    if (newGroups.length === 0 || newGroups.length === vocationalGroupsList.length) {
      onChange(['all']);
    } else {
      onChange(newGroups);
    }
  };

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
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-indigo-50">
              <h2 className="text-2xl font-black text-slate-900">選擇職業群別</h2>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors border-2 border-transparent hover:border-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 bg-amber-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className="text-xl">💡</span>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                  不知道怎麼選？透過「荷倫碼(Holland)性向特質測驗」，3分鐘就能測出最適合你的職群方向喔！
                </p>
              </div>
              <button 
                onClick={onOpenHollandTest}
                className="shrink-0 bg-amber-400 hover:bg-amber-300 text-amber-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none transition-all px-4 py-2 rounded-xl font-black text-sm whitespace-nowrap"
              >
                前往測驗 👉
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <button
                onClick={() => toggleGroup('all')}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                  isAllSelected ? 'bg-indigo-600 border-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:-translate-y-1'
                }`}
              >
                <CheckCircle className="w-8 h-8" />
                <span className="font-bold">全部選擇</span>
              </button>
              {vocationalGroupsList.map(group => {
                const isSelected = selectedGroups.includes(group.id) || isAllSelected;
                return (
                  <button
                    key={group.id}
                    onClick={() => toggleGroup(group.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                      isSelected && !isAllSelected ? 'bg-indigo-100 border-slate-900 text-indigo-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]' : 'bg-white border-slate-200 hover:border-indigo-400 hover:-translate-y-1'
                    } ${(isAllSelected && group.id !== 'all') && 'opacity-60 grayscale'}`}
                  >
                    <span className="text-3xl mb-1">{group.icon}</span>
                    <span className="font-bold text-slate-700">{group.label}</span>
                    <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 mt-auto">
                      {group.holland}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
               <button onClick={onClose} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:bg-indigo-500 hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none">
                 確認選擇
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
