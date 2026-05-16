import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Building2, Map, Compass, Anchor, Mountain, Cpu, AlertCircle } from 'lucide-react';

export const ALL_REGIONS = [
  { id: 'taoyuan', name: '桃連區', desc: '130+ 高中', icon: Building2, active: true, color: 'bg-emerald-400' },
  { id: 'taipei', name: '基北區', desc: '110+ 高中', icon: Map, active: true, color: 'bg-indigo-400' },
  { id: 'central', name: '中投區', desc: '80+ 高中', icon: Mountain, active: true, color: 'bg-amber-400' },
  { id: 'changhua', name: '彰化區', desc: '80+ 高中', icon: MapPin, active: true, color: 'bg-rose-400' },
  { id: 'tainan', name: '台南區', desc: '75+ 高中', icon: Compass, active: true, color: 'bg-sky-400' },
  { id: 'kaohsiung', name: '高雄區', desc: '90+ 高中', icon: Anchor, active: true, color: 'bg-orange-400' },
  { id: 'hsinchu', name: '竹苗區', desc: '70+ 高中', icon: Cpu, active: true, color: 'bg-fuchsia-400' },
  { id: 'yunlin', name: '雲林區', desc: '籌備中', icon: AlertCircle, active: false, color: 'bg-slate-400' }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
  onSelect: (regionId: string) => void;
}

export default function RegionModal({ isOpen, onClose, selectedRegion, onSelect }: Props) {
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
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b-4 border-slate-900 bg-amber-300 relative overflow-hidden shrink-0">
               <div className="absolute right-0 top-0 opacity-10 transform translate-x-8 -translate-y-8">
                 <MapPin className="w-48 h-48" />
               </div>
               <div className="flex justify-between items-start relative z-10 w-full">
                 <div className="pr-4">
                   <h2 className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center gap-3">
                     <MapPin className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={3} /> 選擇就學區
                   </h2>
                   <p className="text-amber-900 font-bold mt-2 text-base sm:text-lg">系統將根據您選擇的區域進行大數據精準分析</p>
                 </div>
                 <button onClick={onClose} className="p-2 bg-white/50 hover:bg-white rounded-xl transition-colors border-2 border-transparent hover:border-slate-900 shrink-0">
                   <X className="w-6 h-6 text-slate-900" />
                 </button>
               </div>
            </div>
            
            {/* Content */}
            <div className="p-6 sm:p-8 bg-slate-50 flex-1 overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ALL_REGIONS.map((region) => {
                     const isSelected = selectedRegion === region.id;
                     const RegionIcon = region.icon;
                     
                     return (
                       <button
                         key={region.id}
                         disabled={!region.active}
                         onClick={() => {
                            onSelect(region.id);
                            onClose();
                         }}
                         className={`relative group p-6 rounded-2xl border-4 text-left transition-all overflow-hidden block w-full ${
                           isSelected 
                             ? 'border-indigo-600 bg-indigo-50 shadow-[6px_6px_0px_0px_rgba(79,70,229,1)]' 
                             : region.active 
                               ? 'border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]' 
                               : 'border-slate-300 bg-slate-100 opacity-60 cursor-not-allowed'
                         }`}
                       >
                         {/* Decoration background element */}
                         {region.active && !isSelected && (
                             <div className={`absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-20 transition-opacity transform translate-x-8 -translate-y-8 rounded-full ${region.color}`} />
                         )}
                         
                         {isSelected && (
                           <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-600 rounded-full border-2 border-white flex flex-shrink-0 items-center justify-center text-white shadow-sm">
                             <div className="w-2.5 h-2.5 bg-white rounded-full" />
                           </div>
                         )}

                         <div className="flex items-center gap-4 mb-3">
                           <div className={`w-14 h-14 shrink-0 rounded-xl border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
                             isSelected ? 'bg-indigo-600 text-white' : region.active ? region.color + ' text-slate-900' : 'bg-slate-300 text-slate-500'
                           }`}>
                             <RegionIcon className="w-7 h-7" strokeWidth={2.5} />
                           </div>
                           <div className="flex-1">
                             <h3 className="text-xl font-black text-slate-900">{region.name}</h3>
                             {!region.active && (
                               <span className="inline-block mt-0.5 text-xs font-bold leading-none bg-slate-200 text-slate-600 px-2 py-1 rounded-md border border-slate-300">建置中</span>
                             )}
                           </div>
                         </div>
                         <p className={`font-bold ${isSelected ? 'text-indigo-800' : 'text-slate-600'}`}>{region.desc}</p>
                       </button>
                     );
                  })}
               </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 bg-white border-t-4 border-slate-900 flex justify-between items-center sm:flex-row flex-col gap-4 shrink-0">
              <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-700" />
                目前支援這 {ALL_REGIONS.filter(r => r.active).length} 大就學區，其他陸續開放中
              </span>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
