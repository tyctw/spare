import React from 'react';
import { Compass, ArrowRight, Database, Shield, Mail, Copyright } from 'lucide-react';

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

export default function Footer({ onPrivacyClick, onTermsClick }: FooterProps) {
  return (
    <footer className="mt-24 w-full px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[3rem] border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col">
          
          {/* Top Section */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row justify-between items-center xl:items-start gap-12 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-100 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-60"></div>

            <div className="flex flex-col items-center xl:items-start text-center xl:text-left gap-6 max-w-lg relative z-10 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="bg-indigo-600 p-4 rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform duration-300">
                  <Compass className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-1">TW全國會考</h2>
                  <div className="inline-block bg-amber-200 px-3 py-1 rounded-lg border-2 border-slate-900 shadow-sm">
                      <h3 className="text-sm sm:text-base font-black tracking-widest text-slate-800 uppercase">落點分析系統</h3>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center justify-center xl:justify-start gap-2 px-4 py-2.5 bg-white rounded-full border-2 border-slate-200 w-fit shadow-sm">
                <div className="relative flex h-3 w-3 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </div>
                <span className="text-slate-600 font-bold text-xs sm:text-sm">非政府官方機構 · 運算僅供參考</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:flex gap-3 sm:gap-4 w-full xl:w-auto relative z-10">
              <button 
                onClick={onPrivacyClick}
                className="group flex-1 xl:flex-none flex flex-col items-center xl:items-start p-4 sm:p-6 bg-white border-4 border-slate-900 rounded-3xl sm:rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all outline-none"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 border-2 border-slate-900 rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Database className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <span className="font-black text-slate-900 text-base sm:text-lg xl:text-xl mb-1 text-center xl:text-left">隱私權政策</span>
                <span className="text-xs sm:text-sm font-bold text-slate-500 flex items-center justify-center xl:justify-start gap-1 group-hover:text-emerald-600 transition-colors w-full">
                  資料授權 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
                </span>
              </button>

              <button 
                onClick={onTermsClick}
                className="group flex-1 xl:flex-none flex flex-col items-center xl:items-start p-4 sm:p-6 bg-white border-4 border-slate-900 rounded-3xl sm:rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all outline-none"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 border-2 border-slate-900 rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <span className="font-black text-slate-900 text-base sm:text-lg xl:text-xl mb-1 text-center xl:text-left">服務條款</span>
                <span className="text-xs sm:text-sm font-bold text-slate-500 flex items-center justify-center xl:justify-start gap-1 group-hover:text-indigo-600 transition-colors w-full">
                  使用規範 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
                </span>
              </button>

              <a 
                href="mailto:tyctw.analyze@gmail.com" 
                className="col-span-2 group flex-1 xl:flex-none flex flex-col items-center xl:items-start p-4 sm:p-6 bg-slate-900 border-4 border-slate-900 rounded-3xl sm:rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] active:translate-y-0 active:shadow-none transition-all text-white outline-none"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 border-2 border-slate-700 rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                </div>
                <span className="font-black text-white text-base sm:text-lg xl:text-xl mb-1 text-center xl:text-left">聯絡我們信箱</span>
                <span className="text-xs sm:text-sm font-bold text-slate-400 group-hover:text-indigo-300 transition-colors break-all text-center xl:text-left w-full">
                  tyctw.analyze@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Copyright Section */}
          <div className="bg-amber-400 border-t-4 border-slate-900 p-4 sm:p-6 flex flex-row items-center justify-between gap-2 sm:gap-4 overflow-hidden relative">
            <div className="flex items-center gap-1.5 sm:gap-2 z-10 bg-amber-400">
              <Copyright className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 shrink-0" />
              <span className="font-black text-slate-900 text-sm sm:text-lg xl:text-xl tracking-tight leading-none pt-0.5">COPYRIGHT {new Date().getFullYear()}</span>
            </div>
            <div className="z-10 text-right bg-amber-400">
              <span className="font-black text-slate-900 text-[10px] sm:text-sm xl:text-base border-b-2 border-slate-900/30 pb-0.5">ALL RIGHTS RESERVED.</span>
            </div>
            {/* Marquee text in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden whitespace-nowrap z-0">
              <span className="text-5xl font-black text-slate-900 tracking-tighter uppercase px-4 select-none">
                TW會考落點分析 TW會考落點分析 TW會考落點分析 TW會考落點分析 TW會考落點分析 TW會考落點分析 TW會考落點分析
              </span>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
