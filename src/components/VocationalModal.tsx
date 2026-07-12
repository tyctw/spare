import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Briefcase, Brain, Sparkles } from 'lucide-react';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-4 border-slate-900 bg-white shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]"
          >
            <div className="relative shrink-0 overflow-hidden border-b-4 border-slate-900 bg-amber-300 p-6 sm:p-8">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10">
                <Briefcase className="h-48 w-48" />
              </div>
              <div className="relative z-10 flex w-full items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-3 text-3xl font-black text-slate-900 sm:text-4xl">
                    <Briefcase className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={3} />
                    選擇職業群別
                  </h2>
                </div>
                <button onClick={onClose} className="shrink-0 rounded-xl border-2 border-transparent bg-white/50 p-2 transition-colors hover:border-slate-900 hover:bg-white">
                  <X className="h-6 w-6 text-slate-900" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 custom-scrollbar sm:p-8">
              <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-200 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <Brain className="h-5 w-5 text-amber-800" />
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-slate-700">
                    不知道怎麼選？透過「荷倫碼(Holland)性向特質測驗」，3 分鐘就能找出適合的職群方向。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenHollandTest}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-400 px-4 py-2 text-sm font-black text-amber-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:bg-amber-300 active:translate-y-0 active:shadow-none"
                >
                  <Sparkles className="h-4 w-4" />
                  前往測驗
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <button
                  onClick={() => toggleGroup('all')}
                  className={`group relative flex min-h-[148px] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-4 p-4 text-center transition-all ${
                    isAllSelected
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)]'
                      : 'border-slate-900 bg-white text-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]'
                  }`}
                >
                  {isAllSelected && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-sm">
                      <div className="h-2.5 w-2.5 rounded-full bg-white" />
                    </div>
                  )}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${isAllSelected ? 'bg-indigo-600 text-white' : 'bg-amber-300 text-slate-900'}`}>
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <span className="text-lg font-black">全部選擇</span>
                  <span className="text-xs font-bold text-slate-500">不限制職群</span>
                </button>

                {vocationalGroupsList.map(group => {
                  const isSelected = selectedGroups.includes(group.id) || isAllSelected;
                  return (
                    <button
                      key={group.id}
                      onClick={() => toggleGroup(group.id)}
                      className={`group relative flex min-h-[148px] w-full flex-col items-center gap-2 overflow-hidden rounded-2xl border-4 p-4 text-center transition-all ${
                        isSelected && !isAllSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)]'
                          : 'border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]'
                      } ${isAllSelected ? 'opacity-60 grayscale' : ''}`}
                    >
                      {!isAllSelected && isSelected && (
                        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-sm">
                          <div className="h-2.5 w-2.5 rounded-full bg-white" />
                        </div>
                      )}
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 border-slate-900 text-3xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${isSelected && !isAllSelected ? 'bg-indigo-600' : 'bg-emerald-300'}`}>
                        <span aria-hidden="true">{group.icon}</span>
                      </div>
                      <span className="font-black leading-tight text-slate-900">{group.label}</span>
                      <span className={`mt-auto rounded-md border px-2 py-0.5 text-[10px] font-black ${isSelected && !isAllSelected ? 'border-indigo-200 bg-white text-indigo-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                        Holland {group.holland}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t-4 border-slate-900 bg-white p-6 sm:flex-row">
              <span className="text-sm font-bold text-slate-500">
                {isAllSelected ? '目前不限制職業群別' : `已選擇 ${selectedGroups.length} 個職業群別`}
              </span>
              <button onClick={onClose} className="w-full rounded-xl border-2 border-slate-900 bg-indigo-600 px-8 py-3 font-black text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-1 hover:bg-indigo-500 active:translate-y-0 active:shadow-none sm:w-auto">
                確認選擇
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
