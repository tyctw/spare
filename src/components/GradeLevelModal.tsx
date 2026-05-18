import React, { useState } from 'react';
import { Award, AlertCircle } from 'lucide-react';
import { InfoModal } from './InfoModals';

interface GradeLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GradeLevelModal({ isOpen, onClose }: GradeLevelModalProps) {
  const [activeTab, setActiveTab] = useState<'description' | '115' | '114'>('description');

  return (
    <InfoModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="等級與答對題數對照表"
      icon={<Award className="w-8 h-8 text-rose-500" />}
    >
      <div className="flex overflow-x-auto whitespace-nowrap bg-slate-100 p-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] mb-6 gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 min-w-max py-2 px-4 rounded-lg font-black text-sm transition-all ${
            activeTab === 'description'
              ? 'bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200 border-2 border-transparent'
          }`}
        >
          等級說明
        </button>
        <button
          onClick={() => setActiveTab('115')}
          className={`flex-1 min-w-max py-2 px-4 rounded-lg font-black text-sm transition-all ${
            activeTab === '115'
              ? 'bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200 border-2 border-transparent'
          }`}
        >
          115 年對照表
        </button>
        <button
          onClick={() => setActiveTab('114')}
          className={`flex-1 min-w-max py-2 px-4 rounded-lg font-black text-sm transition-all ${
            activeTab === '114'
              ? 'bg-white text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200 border-2 border-transparent'
          }`}
        >
          114 年對照表
        </button>
      </div>

      {activeTab === 'description' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="overflow-x-auto rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 border-r border-slate-700">等級/標示</th>
                  <th className="p-3 border-r border-slate-700">說明</th>
                  <th className="p-3">代表意義</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-slate-200">
                  <td className="p-3 font-black text-indigo-600 border-r border-slate-200">A++</td>
                  <td className="p-3 font-bold border-r border-slate-200">精熟，且答對題數前 25%</td>
                  <td className="p-3 text-sm text-slate-600 text-left">具備深入概念與高階思考能力</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-3 font-black text-indigo-600 border-r border-slate-200">A+</td>
                  <td className="p-3 font-bold border-r border-slate-200">精熟，且答對題數 26%~50%</td>
                  <td className="p-3 text-sm text-slate-600 text-left">具備深入概念</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-3 font-black text-indigo-600 border-r border-slate-200">A</td>
                  <td className="p-3 font-bold border-r border-slate-200">精熟</td>
                  <td className="p-3 text-sm text-slate-600 text-left">具備該學科完整概念</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-3 font-black text-emerald-600 border-r border-slate-200">B++</td>
                  <td className="p-3 font-bold border-r border-slate-200">基礎，且答對題數前 25%</td>
                  <td className="p-3 text-sm text-slate-600 text-left">具備部分基礎</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-3 font-black text-emerald-600 border-r border-slate-200">B+</td>
                  <td className="p-3 font-bold border-r border-slate-200">基礎，且答對題數 26%~50%</td>
                  <td className="p-3 text-sm text-slate-600 text-left">具備部分基礎</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-3 font-black text-emerald-600 border-r border-slate-200">B</td>
                  <td className="p-3 font-bold border-r border-slate-200">基礎</td>
                  <td className="p-3 text-sm text-slate-600 text-left">具備基本學科知識</td>
                </tr>
                <tr>
                  <td className="p-3 font-black text-rose-600 border-r border-slate-200">C</td>
                  <td className="p-3 font-bold border-r border-slate-200">待加強</td>
                  <td className="p-3 text-sm text-slate-600 text-left">尚未具備基礎學科知識</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === '115' && (
        <div className="py-8 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-6">
            <span className="text-3xl">🗓️</span>
          </div>
          <h3 className="font-black text-xl text-slate-900">目前尚未公布</h3>
          <p className="text-sm font-bold text-slate-500">
            教育局尚未公布 115 年會考各科答對題數對照表。<br />系統將在官方公布後進行資料更新。
          </p>
        </div>
      )}

      {activeTab === '114' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div>
            <div className="overflow-x-auto rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <table className="w-full text-center border-collapse whitespace-nowrap text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-3 border-r border-slate-700">成績等級</th>
                    <th className="p-3 border-r border-slate-700">標示</th>
                    <th className="p-3 border-r border-slate-700">國文</th>
                    <th className="p-3 border-r border-slate-700">社會</th>
                    <th className="p-3 border-r border-slate-700">自然</th>
                    <th className="p-3 border-r border-slate-700">英文(加權成績)</th>
                    <th className="p-3">數學(加權成績)</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-slate-200">
                    <td className="p-3 font-bold border-r border-slate-200" rowSpan={3}>精熟</td>
                    <td className="p-3 font-black text-indigo-600 border-r border-slate-200">A++</td>
                    <td className="p-3 border-r border-slate-200">答對 40-42 題</td>
                    <td className="p-3 border-r border-slate-200">答對 52-54 題</td>
                    <td className="p-3 border-r border-slate-200">答對 48-50 題</td>
                    <td className="p-3 border-r border-slate-200 font-mono">98.14-100.00</td>
                    <td className="p-3 font-mono">93.20-100.00</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-3 font-black text-indigo-600 border-r border-slate-200">A+</td>
                    <td className="p-3 border-r border-slate-200">答對 38-39 題</td>
                    <td className="p-3 border-r border-slate-200">答對 51 題</td>
                    <td className="p-3 border-r border-slate-200">答對 46-47 題</td>
                    <td className="p-3 border-r border-slate-200 font-mono">95.33-98.13</td>
                    <td className="p-3 font-mono">85.70-93.19</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-3 font-black text-indigo-600 border-r border-slate-200">A</td>
                    <td className="p-3 border-r border-slate-200">答對 36-37 題</td>
                    <td className="p-3 border-r border-slate-200">答對 48-50 題</td>
                    <td className="p-3 border-r border-slate-200">答對 43-45 題</td>
                    <td className="p-3 border-r border-slate-200 font-mono">90.70-95.32</td>
                    <td className="p-3 font-mono">76.20-85.69</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-3 font-bold border-r border-slate-200" rowSpan={3}>基礎</td>
                    <td className="p-3 font-black text-emerald-600 border-r border-slate-200">B++</td>
                    <td className="p-3 border-r border-slate-200">答對 32-35 題</td>
                    <td className="p-3 border-r border-slate-200">答對 41-47 題</td>
                    <td className="p-3 border-r border-slate-200">答對 36-42 題</td>
                    <td className="p-3 border-r border-slate-200 font-mono">82.21-90.69</td>
                    <td className="p-3 font-mono">67.10-76.19</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-3 font-black text-emerald-600 border-r border-slate-200">B+</td>
                    <td className="p-3 border-r border-slate-200">答對 28-31 題</td>
                    <td className="p-3 border-r border-slate-200">答對 35-40 題</td>
                    <td className="p-3 border-r border-slate-200">答對 29-35 題</td>
                    <td className="p-3 border-r border-slate-200 font-mono">71.05-83.20</td>
                    <td className="p-3 font-mono">59.40-67.09</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-3 font-black text-emerald-600 border-r border-slate-200">B</td>
                    <td className="p-3 border-r border-slate-200">答對 18-27 題</td>
                    <td className="p-3 border-r border-slate-200">答對 21-34 題</td>
                    <td className="p-3 border-r border-slate-200">答對 18-28 題</td>
                    <td className="p-3 border-r border-slate-200 font-mono">38.43-71.04</td>
                    <td className="p-3 font-mono">40.60-59.39</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold border-r border-slate-200">待加強</td>
                    <td className="p-3 font-black text-rose-600 border-r border-slate-200">C</td>
                    <td className="p-3 border-r border-slate-200">答對 0-17 題</td>
                    <td className="p-3 border-r border-slate-200">答對 0-20 題</td>
                    <td className="p-3 border-r border-slate-200">答對 0-17 題</td>
                    <td className="p-3 border-r border-slate-200 font-mono">00.00-38.42</td>
                    <td className="p-3 font-mono">00.00-40.59</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </InfoModal>
  );
}
