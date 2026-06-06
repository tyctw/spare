import React from 'react';
import { KeyRound, Share2, Menu } from 'lucide-react';

interface AppHeaderProps {
  isScrolled: boolean;
  onShareClick: () => void;
  onMenuClick: () => void;
}

export default function AppHeader({ isScrolled, onShareClick, onMenuClick }: AppHeaderProps) {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300 ${isScrolled ? 'p-2 sm:p-2' : 'p-4 sm:p-6'}`}>
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <header className={`bg-white/90 backdrop-blur-md rounded-3xl flex items-center justify-between transition-all duration-300 will-change-transform ${isScrolled ? 'border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-2 sm:p-3' : 'border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-3 sm:p-4 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]'}`}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`bg-indigo-600 border-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-6 transform origin-bottom-left hover:rotate-0 transition-all ${isScrolled ? 'w-10 h-10 sm:w-10 sm:h-10 rounded-xl border-2 sm:text-xl' : 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-4 sm:text-3xl'}`}>
              會
            </div>
            <div className="flex flex-col">
              <h1 className={`font-black text-slate-900 tracking-tight leading-none uppercase transition-all ${isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-3xl'}`}>會考落點分析</h1>
              <span className={`font-bold text-slate-500 hidden sm:block mt-1 transition-all ${isScrolled ? 'text-[10px] sm:text-[10px] h-0 opacity-0 overflow-hidden' : 'text-[10px] sm:text-xs h-auto opacity-100'}`}>115 年最新各區數據分析平台</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://tyctw.github.io/form/"
              target="_blank"
              rel="noreferrer"
              className={`flex items-center justify-center gap-2 bg-amber-400 text-slate-900 border-slate-900 font-black transition hover:bg-amber-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'px-3 h-10 sm:h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'px-4 sm:px-5 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'}`}
            >
              <KeyRound className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
              <span className={`hidden md:inline uppercase tracking-wide ${isScrolled ? 'text-xs' : ''}`}>取得邀請碼</span>
            </a>
            <button
              onClick={onShareClick}
              className={`bg-emerald-200 flex items-center justify-center border-slate-900 transition hover:bg-emerald-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'w-10 h-10 sm:w-10 sm:h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'}`}
            >
              <Share2 className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
            </button>
            <button
              onClick={onMenuClick}
              className={`bg-sky-200 flex items-center justify-center border-slate-900 transition hover:bg-sky-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'w-10 h-10 sm:w-10 sm:h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'}`}
            >
              <Menu className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
            </button>
          </div>
        </header>
      </div>
    </div>
  );
}
