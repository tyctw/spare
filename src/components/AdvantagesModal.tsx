import React from 'react';
import { Sparkles, Activity, Check, Star } from 'lucide-react';
import { InfoModal } from './InfoModals';

interface AdvantagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdvantagesModal({ isOpen, onClose }: AdvantagesModalProps) {
  return (
    <InfoModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="系統優點"
      icon={<Star className="w-8 h-8 text-amber-500" />}
    >
      <div className="space-y-6">
        <div className="bg-indigo-300 p-6 rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left transition-all">
          <div className="w-16 h-16 shrink-0 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center -rotate-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-1">高精準模型</h2>
            <p className="text-slate-900 font-bold leading-relaxed">全新智慧演算引擎上線，提供最高精準度的落點預測與分析結果。</p>
          </div>
        </div>

        <div className="bg-lime-300 p-6 rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left transition-all">
          <div className="w-16 h-16 shrink-0 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <Activity className="w-8 h-8 text-lime-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-1">最佳決策引擎</h2>
            <p className="text-slate-900 font-bold leading-relaxed">您升學規劃的最強後盾，綜整各項數據指標，成為最佳決策依據。</p>
          </div>
        </div>

        <div className="bg-amber-300 p-6 rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left transition-all">
          <div className="w-16 h-16 shrink-0 bg-white rounded-2xl border-4 border-slate-900 flex items-center justify-center -rotate-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <Check className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-1">個人化篩選</h2>
            <p className="text-slate-900 font-bold leading-relaxed">輸入您的會考成績與偏好，系統即刻為您比對出最合適的理想高中。</p>
          </div>
        </div>
      </div>
    </InfoModal>
  );
}
