import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Building2, Check, Cpu, Landmark, MapPin, MapPinned, Mountain,
  ShipWheel, Sunrise, Sun, TreePine, Waves, Wheat,
} from 'lucide-react';

export const ALL_REGIONS = [
  { id: 'taipei', name: '基北區', desc: '臺北市、新北市、基隆市', icon: Building2, active: true, tone: 'north' },
  { id: 'taoyuan', name: '桃連區', desc: '桃園市、連江縣', icon: MapPinned, active: true, tone: 'north' },
  { id: 'hsinchu', name: '竹苗區', desc: '新竹縣市、苗栗縣', icon: Cpu, active: true, tone: 'north' },
  { id: 'central', name: '中投區', desc: '臺中市、南投縣', icon: Mountain, active: true, tone: 'central' },
  { id: 'changhua', name: '彰化區', desc: '彰化縣', icon: Wheat, active: true, tone: 'central' },
  { id: 'tainan', name: '臺南區', desc: '臺南市', icon: Landmark, active: true, tone: 'south' },
  { id: 'kaohsiung', name: '高雄區', desc: '高雄市', icon: ShipWheel, active: true, tone: 'south' },
  { id: 'yunlin', name: '雲林區', desc: '雲林縣', icon: Wheat, active: false, tone: 'central' },
  { id: 'chiayi', name: '嘉義區', desc: '嘉義縣市', icon: TreePine, active: true, tone: 'south' },
  { id: 'pingtung', name: '屏東區', desc: '屏東縣', icon: Sun, active: false, tone: 'south' },
  { id: 'yilan', name: '宜蘭區', desc: '宜蘭縣', icon: Waves, active: false, tone: 'east' },
  { id: 'taitung', name: '臺東區', desc: '臺東縣', icon: Sunrise, active: false, tone: 'east' },
];

const toneClasses: Record<string, { icon: string; selected: string; wash: string; dot: string }> = {
  north: { icon: 'bg-sky-500 text-white', selected: 'border-slate-900 bg-sky-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-sky-300', wash: 'from-sky-200 to-sky-100', dot: 'bg-sky-500' },
  central: { icon: 'bg-amber-400 text-slate-900', selected: 'border-slate-900 bg-amber-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-amber-300', wash: 'from-amber-200 to-amber-100', dot: 'bg-amber-500' },
  south: { icon: 'bg-rose-500 text-white', selected: 'border-slate-900 bg-rose-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-rose-300', wash: 'from-rose-200 to-rose-100', dot: 'bg-rose-500' },
  east: { icon: 'bg-teal-500 text-white', selected: 'border-slate-900 bg-teal-50 shadow-[5px_5px_0_#0f172a] ring-2 ring-teal-300', wash: 'from-teal-200 to-teal-100', dot: 'bg-teal-500' },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
  onSelect: (regionId: string) => void;
}

export default function RegionModal({ isOpen, onClose, selectedRegion, onSelect }: Props) {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const availableRegions = ALL_REGIONS.filter((region) => region.active);
  const upcomingRegions = ALL_REGIONS.filter((region) => !region.active);
  const selectedRegionName = ALL_REGIONS.find((region) => region.id === selectedRegion)?.name;

  React.useEffect(() => {
    if (!isOpen) return undefined;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute('disabled') && element.getClientRects().length > 0);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
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
            aria-describedby="region-modal-description"
            ref={dialogRef}
          >
            <header className="relative shrink-0 overflow-hidden border-b-4 border-slate-900 bg-gradient-to-br from-white via-sky-50 to-amber-50 px-5 py-5 text-slate-900 sm:px-8 sm:py-7">
              <MapPin aria-hidden="true" className="absolute -right-7 -top-8 h-40 w-40 text-sky-300/35" strokeWidth={1.5} />
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 id="region-modal-title" className="flex items-center gap-2.5 text-[1.65rem] font-black tracking-tight sm:text-[2.7rem]"><MapPin aria-hidden="true" className="h-7 w-7 text-sky-600 sm:h-9 sm:w-9" />選擇分析區域</h2>
                </div>
                <button ref={closeButtonRef} onClick={onClose} aria-label="關閉選擇就學區視窗" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-slate-900 bg-white text-slate-600 shadow-[2px_2px_0_#0f172a] transition hover:bg-sky-100 hover:text-sky-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-600"><X aria-hidden="true" className="h-5 w-5" /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-white/65 p-4 sm:p-6 custom-scrollbar">
              <section aria-labelledby="available-regions-heading">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="min-w-0">
                    <h3 id="available-regions-heading" className="text-base font-black text-slate-900 sm:text-lg">目前有 {availableRegions.length} 個可選區域</h3>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">目前選擇：{selectedRegionName || '未選擇'}</span>
                  </div>
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
                      className={`group relative overflow-hidden rounded-[1.85rem] border-2 bg-white text-center transition-all focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                        isSelected ? 'border-slate-900 ring-[3px] ring-sky-600 shadow-[0_8px_22px_rgba(15,23,42,0.18)]' : region.active ? 'border-slate-400 shadow-[0_4px_16px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:border-slate-600 hover:shadow-[0_10px_24px_rgba(15,23,42,0.16)]' : 'border-slate-400 cursor-not-allowed opacity-65'
                      }`}
                    >
                      <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${tone.wash} sm:h-32`} aria-hidden="true" />
                      <div className="relative flex h-28 items-center justify-center px-4 sm:h-32">
                        <RegionIcon aria-hidden="true" className="absolute top-4 h-5 w-5 text-slate-700/75 sm:h-6 sm:w-6" strokeWidth={2.8} />
                        <h3 className="relative mt-7 whitespace-nowrap text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{region.name}</h3>
                        {isSelected && <span aria-label="已選取" className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-white shadow-sm"><Check aria-hidden="true" className="h-4 w-4" strokeWidth={3} /></span>}
                      </div>
                      <div className="bg-white px-4 pb-2 pt-2 sm:pb-3 sm:pt-3">
                        <p className="flex min-h-8 items-center justify-center text-center text-[11px] font-bold leading-4 text-slate-500 sm:text-xs">{region.desc}</p>
                      </div>
                    </button>
                  );
                })}
                </div>
              </section>
              <section aria-labelledby="upcoming-regions-heading" className="mt-7 pt-2">
                <div className="mb-3 flex flex-col items-center gap-1.5 px-1">
                  <div className="flex w-full items-center gap-3">
                    <span aria-hidden="true" className="flex-1 border-t-2 border-dashed border-slate-300" />
                    <h3 id="upcoming-regions-heading" className="shrink-0 text-sm font-black text-slate-500">尚未開放的區域</h3>
                    <span aria-hidden="true" className="flex-1 border-t-2 border-dashed border-slate-300" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">目前無法選擇</span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {upcomingRegions.map((region) => {
                  return (
                    <div key={region.id} aria-label={`${region.name}，尚未開放`} aria-disabled="true" className="relative overflow-hidden rounded-[1.85rem] border-2 border-slate-400 bg-white opacity-70 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
                      <div className="absolute inset-x-0 top-0 h-28 bg-slate-200 sm:h-32" aria-hidden="true" />
                      <div className="relative flex h-28 items-center justify-center px-4 sm:h-32">
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_10px,#94a3b8_10px,#94a3b8_12px)]" />
                        <h4 className="relative whitespace-nowrap text-3xl font-semibold tracking-tight text-slate-500 sm:text-4xl">{region.name}</h4>
                        <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-black tracking-wider text-slate-500">籌備中</span>
                      </div>
                      <p className="flex min-h-8 items-center justify-center px-4 pb-2 pt-2 text-center text-[11px] font-bold leading-4 text-slate-400 sm:pb-3 sm:pt-3 sm:text-xs">{region.desc}</p>
                    </div>
                  );
                })}
                </div>
              </section>
            </div>

            <footer id="region-modal-description" className="flex shrink-0 items-center gap-2 border-t-4 border-slate-900 bg-sky-50 px-5 py-4 text-xs font-bold text-slate-500 sm:px-8"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />系統會自動套用該區的計分方式與比序規則。</footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
