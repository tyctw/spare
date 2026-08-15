import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Building2, Check, Cpu, Landmark, MapPin, MapPinned, Mountain,
  ShipWheel, Sunrise, Sun, TreePine, Waves, Wheat,
} from 'lucide-react';

export const ALL_REGIONS = [
  { id: 'taipei', name: '基北區', desc: '臺北市、新北市、基隆市', icon: Building2, active: true, tone: 'indigo' },
  { id: 'taoyuan', name: '桃連區', desc: '桃園市、連江縣', icon: MapPinned, active: true, tone: 'emerald' },
  { id: 'hsinchu', name: '竹苗區', desc: '新竹縣市、苗栗縣', icon: Cpu, active: true, tone: 'fuchsia' },
  { id: 'central', name: '中投區', desc: '臺中市、南投縣', icon: Mountain, active: true, tone: 'amber' },
  { id: 'changhua', name: '彰化區', desc: '彰化縣', icon: Wheat, active: true, tone: 'rose' },
  { id: 'tainan', name: '臺南區', desc: '臺南市', icon: Landmark, active: true, tone: 'sky' },
  { id: 'kaohsiung', name: '高雄區', desc: '高雄市', icon: ShipWheel, active: true, tone: 'orange' },
  { id: 'yunlin', name: '雲林區', desc: '雲林縣', icon: Wheat, active: false, tone: 'slate' },
  { id: 'chiayi', name: '嘉義區', desc: '嘉義縣市', icon: TreePine, active: false, tone: 'slate' },
  { id: 'pingtung', name: '屏東區', desc: '屏東縣', icon: Sun, active: false, tone: 'slate' },
  { id: 'yilan', name: '宜蘭區', desc: '宜蘭縣', icon: Waves, active: false, tone: 'slate' },
  { id: 'taitung', name: '臺東區', desc: '臺東縣', icon: Sunrise, active: false, tone: 'slate' },
];

const toneClasses: Record<string, { icon: string; selected: string; wash: string; dot: string }> = {
  indigo: { icon: 'bg-indigo-500 text-white', selected: 'border-slate-900 bg-indigo-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-indigo-300', wash: 'from-indigo-100 to-white', dot: 'bg-indigo-500' },
  emerald: { icon: 'bg-emerald-500 text-white', selected: 'border-slate-900 bg-emerald-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-emerald-300', wash: 'from-emerald-100 to-white', dot: 'bg-emerald-500' },
  fuchsia: { icon: 'bg-fuchsia-500 text-white', selected: 'border-slate-900 bg-fuchsia-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-fuchsia-300', wash: 'from-fuchsia-100 to-white', dot: 'bg-fuchsia-500' },
  amber: { icon: 'bg-amber-400 text-slate-900', selected: 'border-slate-900 bg-amber-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-amber-300', wash: 'from-amber-100 to-white', dot: 'bg-amber-500' },
  rose: { icon: 'bg-rose-500 text-white', selected: 'border-slate-900 bg-rose-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-rose-300', wash: 'from-rose-100 to-white', dot: 'bg-rose-500' },
  sky: { icon: 'bg-sky-500 text-white', selected: 'border-slate-900 bg-sky-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-sky-300', wash: 'from-sky-100 to-white', dot: 'bg-sky-500' },
  orange: { icon: 'bg-orange-500 text-white', selected: 'border-slate-900 bg-orange-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-orange-300', wash: 'from-orange-100 to-white', dot: 'bg-orange-500' },
  slate: { icon: 'bg-slate-200 text-slate-400', selected: '', wash: 'from-slate-100 to-white', dot: 'bg-slate-300' },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
  onSelect: (regionId: string) => void;
}

export default function RegionModal({ isOpen, onClose, selectedRegion, onSelect }: Props) {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const availableRegions = ALL_REGIONS.filter((region) => region.active);
  const upcomingRegions = ALL_REGIONS.filter((region) => !region.active);
  const selectedRegionName = ALL_REGIONS.find((region) => region.id === selectedRegion)?.name;

  React.useEffect(() => {
    if (!isOpen) return undefined;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 18 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 18 }}
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-sky-50 shadow-[5px_5px_0_#0f172a]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="region-modal-title"
          >
            <header className="relative shrink-0 overflow-hidden border-b-4 border-slate-900 bg-gradient-to-br from-white via-sky-50 to-amber-50 px-5 py-5 text-slate-900 sm:px-8 sm:py-7">
              <MapPin aria-hidden="true" className="absolute -right-7 -top-8 h-40 w-40 text-sky-300/35" strokeWidth={1.5} />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <h2 id="region-modal-title" className="flex items-center gap-2.5 text-2xl font-black tracking-tight sm:text-4xl"><MapPin aria-hidden="true" className="h-7 w-7 text-sky-600 sm:h-9 sm:w-9" />選擇分析區域</h2>
                </div>
                <button ref={closeButtonRef} onClick={onClose} aria-label="關閉選擇就學區視窗" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-slate-900 bg-white text-slate-600 shadow-[2px_2px_0_#0f172a] transition hover:bg-sky-100 hover:text-sky-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-600"><X aria-hidden="true" className="h-5 w-5" /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-white/65 p-4 sm:p-6 custom-scrollbar">
              <div className="mb-5 rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.14em] text-slate-500">目前分析區域</p>
                    <p className="mt-1 text-lg font-black text-slate-900">{selectedRegionName || '請選擇下方區域'}</p>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-xl border-2 border-slate-900 bg-amber-300"><MapPinned aria-hidden="true" className="h-5 w-5" strokeWidth={2.8} /></div>
                </div>
              </div>
              <section aria-labelledby="available-regions-heading">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h3 id="available-regions-heading" className="text-sm font-black text-slate-900">選擇可分析的就學區</h3>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">{availableRegions.length} 個已開放</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {availableRegions.map((region) => {
                  const isSelected = selectedRegion === region.id;
                  const RegionIcon = region.icon;
                  const tone = toneClasses[region.tone];
                  return (
                    <button
                      key={region.id}
                      disabled={!region.active}
                      onClick={() => { onSelect(region.id); onClose(); }}
                      aria-pressed={isSelected}
                      aria-label={`${region.name}，${region.desc}${region.active ? isSelected ? '，目前已選取' : '，可選擇' : '，尚未開放'}`}
                      className={`group relative min-h-[166px] overflow-hidden rounded-2xl border-[3px] p-4 text-left transition-all ${
                        isSelected ? tone.selected : region.active ? 'border-slate-900 bg-white shadow-[3px_3px_0_#0f172a] hover:-translate-y-1 hover:shadow-[5px_5px_0_#0f172a] focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-600' : 'cursor-not-allowed border-slate-300 bg-slate-50 opacity-65'
                      }`}
                    >
                      {!region.active && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_9px,#94a3b8_9px,#94a3b8_11px)]" />}
                      <div className={`absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${tone.wash}`} />
                      <div className="relative flex items-start justify-between">
                        <div aria-hidden="true" className={`grid h-12 w-12 place-items-center rounded-2xl border-2 border-white shadow-[0_3px_10px_rgba(15,23,42,0.14)] ${tone.icon}`}><RegionIcon className="h-6 w-6" strokeWidth={2.5} /></div>
                        {isSelected && <span aria-label="已選取" className="grid h-6 w-6 place-items-center rounded-full bg-sky-600 text-white"><Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} /></span>}
                      </div>
                      <div className="relative mt-5">
                        <h3 className="text-base font-black text-slate-900">{region.name}</h3>
                        <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">{region.desc}</p>
                        {!region.active && <span className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-slate-200 px-2 py-1 text-[9px] font-black tracking-wider text-slate-500"><span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />籌備中</span>}
                      </div>
                    </button>
                  );
                })}
                </div>
              </section>
              <section aria-labelledby="upcoming-regions-heading" className="mt-7 border-t-2 border-dashed border-slate-300 pt-5">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h3 id="upcoming-regions-heading" className="text-sm font-black text-slate-500">尚未開放的區域</h3>
                  <span className="text-[10px] font-bold text-slate-400">目前無法選擇</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {upcomingRegions.map((region) => {
                  const RegionIcon = region.icon;
                  return (
                    <div key={region.id} aria-label={`${region.name}，尚未開放`} className="relative min-h-[126px] overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 opacity-75">
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_9px,#94a3b8_9px,#94a3b8_11px)]" />
                      <div className="relative flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl border-2 border-slate-200 bg-white text-slate-400"><RegionIcon className="h-5 w-5" /></div><span className="rounded-md bg-slate-200 px-2 py-1 text-[9px] font-black tracking-wider text-slate-500">籌備中</span></div>
                      <div className="relative mt-4"><h4 className="text-sm font-black text-slate-500">{region.name}</h4><p className="mt-1 text-[11px] font-bold text-slate-400">{region.desc}</p></div>
                    </div>
                  );
                })}
                </div>
              </section>
            </div>

            <footer className="flex shrink-0 items-center gap-2 border-t-4 border-slate-900 bg-sky-50 px-5 py-4 text-xs font-bold text-slate-500 sm:px-8"><span className="h-2 w-2 rounded-full bg-emerald-500" />已選擇的區域會套用相對應的計分與比序規則。</footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
