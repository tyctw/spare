import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, BookOpen, Layers, Target, Compass, X } from 'lucide-react';
import { InfoModal } from './InfoModals';
import { printSchoolTypes } from '../lib/exportUtils';

interface SchoolTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SchoolTypesModal({ isOpen, onClose }: SchoolTypesModalProps) {
  const [activeTab, setActiveTab] = useState<'types' | 'vs'>('types');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[32px] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-sky-400 p-6 sm:p-8 relative border-b-4 border-slate-900 shrink-0">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-slate-900 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pr-12">
              <div className="flex items-center gap-4 text-slate-900">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                  <GraduationCap className="w-6 h-6 text-sky-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">學校類型解析</h2>
              </div>
              <button 
                onClick={() => printSchoolTypes()}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] font-bold text-sm flex items-center gap-2 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] active:translate-y-0 active:shadow-none transition-all"
              >
                <Target className="w-4 h-4" /> 匯出/列印
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-900/10 rounded-2xl">
              <button
                onClick={() => setActiveTab('types')}
                className={`flex-1 py-2 sm:py-3 px-4 rounded-xl font-black text-sm sm:text-base transition-all ${
                  activeTab === 'types' 
                    ? 'bg-white text-slate-900 shadow-sm border-2 border-slate-900' 
                    : 'text-slate-800 hover:bg-white/50 border-2 border-transparent'
                }`}
              >
                中等教育四種類型
              </button>
              <button
                onClick={() => setActiveTab('vs')}
                className={`flex-1 py-2 sm:py-3 px-4 rounded-xl font-black text-sm sm:text-base transition-all ${
                  activeTab === 'vs' 
                    ? 'bg-white text-slate-900 shadow-sm border-2 border-slate-900' 
                    : 'text-slate-800 hover:bg-white/50 border-2 border-transparent'
                }`}
              >
                高中 vs 高職
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-slate-50">
            {activeTab === 'types' ? (
              <div className="space-y-8">
                {/* 綜合比較表 */}
                <div className="bg-white rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                    <Layers className="w-6 h-6 text-indigo-500" />
                    綜合比較表
                  </h3>
                  <div className="overflow-x-auto custom-scrollbar pb-2">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 whitespace-nowrap">類型</th>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 whitespace-nowrap">就讀年份</th>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 min-w-[200px]">課程特色</th>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 min-w-[150px]">適合學生</th>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 min-w-[150px]">畢業出路</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold">
                        <tr className="hover:bg-slate-50 border-b border-slate-200">
                          <td className="py-4 px-4 text-emerald-600 font-black">普通型高中</td>
                          <td className="py-4 px-4">3</td>
                          <td className="py-4 px-4 text-slate-600">學科為主，重視通識與基礎學科</td>
                          <td className="py-4 px-4 text-slate-700">想升大學、探索學術領域</td>
                          <td className="py-4 px-4 text-indigo-600">大學（含科技大學）</td>
                        </tr>
                        <tr className="hover:bg-slate-50 border-b border-slate-200">
                          <td className="py-4 px-4 text-sky-600 font-black">綜合型高中</td>
                          <td className="py-4 px-4">3</td>
                          <td className="py-4 px-4 text-slate-600">學科＋專業技能＋實習</td>
                          <td className="py-4 px-4 text-slate-700">對專業技能有興趣</td>
                          <td className="py-4 px-4 text-indigo-600">就業、科技大學、專科（二專）</td>
                        </tr>
                        <tr className="hover:bg-slate-50 border-b border-slate-200">
                          <td className="py-4 px-4 text-amber-600 font-black">技術型高中</td>
                          <td className="py-4 px-4">3</td>
                          <td className="py-4 px-4 text-slate-600">普通＋技術並行，提供探索</td>
                          <td className="py-4 px-4 text-slate-700">尚未確定方向，希望邊學邊試</td>
                          <td className="py-4 px-4 text-indigo-600">大學（含科技大學）、專科、就業</td>
                        </tr>
                        <tr className="hover:bg-slate-50 border-b border-slate-200">
                          <td className="py-4 px-4 text-rose-600 font-black">單科型高中</td>
                          <td className="py-4 px-4">3</td>
                          <td className="py-4 px-4 text-slate-600">專注特定領域（體育、藝術、科學）</td>
                          <td className="py-4 px-4 text-slate-700">有明確專長或天賦</td>
                          <td className="py-4 px-4 text-indigo-600">升讀相關科系或專長發展</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-4 px-4 text-purple-600 font-black">五專</td>
                          <td className="py-4 px-4">5</td>
                          <td className="py-4 px-4 text-slate-600">五年一貫，專業銜接完整</td>
                          <td className="py-4 px-4 text-slate-700">已確定專業興趣</td>
                          <td className="py-4 px-4 text-indigo-600">就業、二技、大學、研究所</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 普通型高中 */}
                  <div className="bg-emerald-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-100 rounded-xl border-2 border-slate-900">
                        <BookOpen className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900">普通型高中</h4>
                    </div>
                    <div className="space-y-3 font-bold text-slate-700">
                      <p><span className="text-emerald-700 mr-2">就讀年份:</span>需要讀3年</p>
                      <p className="border-t-2 border-emerald-200/50 pt-3"><span className="text-emerald-700 block mb-1">課程特色:</span>以學科課程為主（國文、英文、數學、自然、社會），並搭配通識教育與多元選修。</p>
                      <p className="border-t-2 border-emerald-200/50 pt-3"><span className="text-emerald-700 block mb-1">培養方向:</span>重視基礎學科能力、人文關懷與社會參與。</p>
                      <p className="border-t-2 border-emerald-200/50 pt-3"><span className="text-emerald-700 block mb-1">適合學生:</span>想持續探索學術領域，未來以升學為主。</p>
                      <p className="border-t-2 border-emerald-200/50 pt-3"><span className="text-emerald-700 block mb-1">畢業出路:</span>以升讀大學（含科技大學）為主要方向。</p>
                    </div>
                  </div>

                  {/* 綜合型高中 */}
                  <div className="bg-sky-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-sky-100 rounded-xl border-2 border-slate-900">
                        <Compass className="w-6 h-6 text-sky-600" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900">綜合型高中</h4>
                    </div>
                    <div className="space-y-3 font-bold text-slate-700">
                      <p><span className="text-sky-700 mr-2">就讀年份:</span>需要讀3年</p>
                      <p className="border-t-2 border-sky-200/50 pt-3"><span className="text-sky-700 block mb-1">課程特色:</span>融合普通型與技術型課程，學生可依興趣選修，逐步找到方向。</p>
                      <p className="border-t-2 border-sky-200/50 pt-3"><span className="text-sky-700 block mb-1">培養方向:</span>兼顧學術與技能，提供探索的空間。</p>
                      <p className="border-t-2 border-sky-200/50 pt-3"><span className="text-sky-700 block mb-1">適合學生:</span>希望邊學邊探索，尚未確定未來發展方向。</p>
                      <p className="border-t-2 border-sky-200/50 pt-3"><span className="text-sky-700 block mb-1">畢業出路:</span>可依選課方向，升讀大學（含科技大學）、專科，或選擇就業。</p>
                    </div>
                  </div>

                  {/* 技術型高中 */}
                  <div className="bg-amber-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-xl border-2 border-slate-900">
                        <Target className="w-6 h-6 text-amber-600" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900">技術型高中</h4>
                    </div>
                    <div className="space-y-3 font-bold text-slate-700">
                      <p><span className="text-amber-700 mr-2">就讀年份:</span>需要讀3年</p>
                      <p className="border-t-2 border-amber-200/50 pt-3"><span className="text-amber-700 block mb-1">課程特色:</span>兼顧普通科目與專業技能課程，並設有實習。</p>
                      <p className="border-t-2 border-amber-200/50 pt-3"><span className="text-amber-700 block mb-1">培養方向:</span>強調專業技能、實務操作與科技應用。</p>
                      <p className="border-t-2 border-amber-200/50 pt-3"><span className="text-amber-700 block mb-1">適合學生:</span>對技術或專業領域有興趣，想兼顧升學與就業彈性。</p>
                      <p className="border-t-2 border-amber-200/50 pt-3"><span className="text-amber-700 block mb-1">畢業出路:</span>可直接就業，或繼續升學至科技大學、專科（二專）。</p>
                    </div>
                  </div>

                  {/* 單科型高中 */}
                  <div className="bg-rose-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-rose-100 rounded-xl border-2 border-slate-900">
                        <GraduationCap className="w-6 h-6 text-rose-600" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900">單科型高中</h4>
                    </div>
                    <div className="space-y-3 font-bold text-slate-700">
                      <p><span className="text-rose-700 mr-2">就讀年份:</span>需要讀3年</p>
                      <p className="border-t-2 border-rose-200/50 pt-3"><span className="text-rose-700 block mb-1">課程特色:</span>專注於特定領域（如體育、藝術或科學），課程集中深入。</p>
                      <p className="border-t-2 border-rose-200/50 pt-3"><span className="text-rose-700 block mb-1">培養方向:</span>發展學生在專長領域的潛能，強化專業訓練。</p>
                      <p className="border-t-2 border-rose-200/50 pt-3"><span className="text-rose-700 block mb-1">適合學生:</span>對特定領域有明確興趣或天賦，想進一步專精。</p>
                      <p className="border-t-2 border-rose-200/50 pt-3"><span className="text-rose-700 block mb-1">畢業出路:</span>持續升學至相關科系，或直接投身專長領域。</p>
                    </div>
                  </div>
                  
                  {/* 五專 */}
                  <div className="md:col-span-2 bg-purple-50 rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-xl border-2 border-slate-900">
                        <Layers className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900">五專（五年制專科學校）</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 font-bold text-slate-700">
                      <div>
                        <p><span className="text-purple-700 block mb-1">學制與定位:</span>學制為五年一貫（前3年相當於高中職，後2年為專科後段）。屬於「技專教育體系」，與高中職並列，是國中畢業後的另一種升學選擇。</p>
                        <p className="border-t-2 border-purple-200/50 pt-3 mt-3"><span className="text-purple-700 block mb-1">招生方式:</span>採全國五專聯合招生，分為：一、優免（優先免試入學）；二、聯免（聯合免試入學）；三、完免（完全免試入學）。</p>
                        <p className="border-t-2 border-purple-200/50 pt-3 mt-3"><span className="text-purple-700 block mb-1">課程特色:</span>前段兼顧普通科目與專業基礎；後段強化專業知能與實習。畢業可取得<strong>副學士學位</strong>。</p>
                      </div>
                      <div className="sm:border-l-2 sm:border-purple-200/50 sm:pl-8">
                        <div><span className="text-purple-700 block mb-1">適合學生:</span><ul className="list-disc list-inside space-y-1 ml-1 text-slate-600"><li>已確立專業興趣，想提早進入專業領域學習。</li><li>希望縮短專業訓練歷程，及早培養職能。</li></ul></div>
                        <div className="border-t-2 border-purple-200/50 pt-3 mt-3"><span className="text-purple-700 block mb-1">畢業出路:</span><ul className="list-disc list-inside space-y-1 ml-1 text-slate-600"><li>就業：直接進入相關專業領域。</li><li>升學：可銜接二技、大學轉學，甚至研究所。</li></ul></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 高中與高職學程差異 */}
                <div className="bg-white rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                    高中與高職學程差異
                  </h3>
                  <div className="overflow-x-auto custom-scrollbar pb-2">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-500 w-1/4">學程制度</th>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 w-3/8 text-lg">高中</th>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 w-3/8 text-lg">高職</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold">
                        <tr className="border-b border-slate-200">
                          <td className="py-4 px-4 text-slate-700 font-black whitespace-nowrap">課程內容</td>
                          <td className="py-4 px-4 text-slate-600 align-top">
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-0.5">▶</span>
                                <span>以學術研究為導向，注重學術研究基礎知識課程（如國文、英文、數學等）</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-indigo-500 mt-0.5">▶</span>
                                <span>依各高中設立不同的特色學程班群</span>
                              </li>
                            </ul>
                          </td>
                          <td className="py-4 px-4 text-slate-600 align-top">
                            <ul className="space-y-2">
                              <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">▶</span>
                                <span>以專門技術為導向，注重實務技術方面的實作課程（如實務專題、實習課程等）</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-0.5">▶</span>
                                <span>一共分成15個專業學群科別</span>
                              </li>
                            </ul>
                          </td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="py-4 px-4 text-slate-700 font-black whitespace-nowrap">考試類型</td>
                          <td className="py-4 px-4 text-slate-900">學測、分科</td>
                          <td className="py-4 px-4 text-slate-900">學測、統測</td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4 text-slate-700 font-black whitespace-nowrap">考試科目</td>
                          <td className="py-4 px-4 text-slate-600 align-top">
                            <ul className="space-y-4">
                              <li>
                                <div className="text-indigo-600 font-black mb-1">▶學測:(依各校系規定科目採計)</div>
                                國文、英文、數學、社會、自然
                              </li>
                              <li>
                                <div className="text-indigo-600 font-black mb-1">▶分科:(依各校系規定科目採計)</div>
                                數學甲、物理、化學、生物、歷史、地理、公民
                              </li>
                            </ul>
                          </td>
                          <td className="py-4 px-4 text-slate-600 align-top">
                            <ul className="space-y-4">
                              <li>
                                <div className="text-amber-600 font-black mb-1">▶學測:(依各校系規定科目採計)</div>
                                國文、英文、數學、社會、自然
                              </li>
                              <li>
                                <div className="text-amber-600 font-black mb-1">▶統測:(共分20個群別)</div>
                                國文、英文、數學、專業科目(一)、專業科目(二)
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* 高中與高職升學差異 */}
                <div className="bg-white rounded-3xl p-6 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-indigo-500" />
                    高中與高職升學差異
                  </h3>
                  <div className="overflow-x-auto custom-scrollbar pb-2">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-500 w-1/4">升學制度</th>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 w-3/8 text-lg">高中</th>
                          <th className="border-b-4 border-slate-900 py-3 px-4 font-black text-slate-900 w-3/8 text-lg">高職</th>
                        </tr>
                      </thead>
                      <tbody className="font-bold">
                        <tr className="border-b border-slate-200">
                          <td className="py-4 px-4 text-indigo-700 font-black whitespace-nowrap text-lg">大學</td>
                          <td className="py-4 px-4 text-slate-700 align-top leading-relaxed">
                            <ol className="list-decimal list-inside space-y-1 ml-1">
                              <li>特殊選才</li>
                              <li>繁星推薦</li>
                              <li>申請入學</li>
                              <li>考試分發</li>
                            </ol>
                          </td>
                          <td className="py-4 px-4 text-slate-700 align-top leading-relaxed">
                            <ol className="list-decimal list-inside space-y-1 ml-1">
                              <li>特殊選才</li>
                              <li>申請入學</li>
                              <li>考試分發</li>
                            </ol>
                          </td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="py-4 px-4 text-amber-700 font-black whitespace-nowrap text-lg">四技二專</td>
                          <td className="py-4 px-4 text-slate-700 align-top leading-relaxed">
                            <ol className="list-decimal list-inside space-y-1 ml-1">
                              <li>特殊選才</li>
                              <li>四技申請入學</li>
                              <li>技優保送</li>
                              <li>技優甄審</li>
                            </ol>
                          </td>
                          <td className="py-4 px-4 text-slate-700 align-top leading-relaxed">
                            <ol className="list-decimal list-inside space-y-1 ml-1">
                              <li>特殊選才</li>
                              <li>技職繁星</li>
                              <li>四技甄選</li>
                              <li>統測分發</li>
                              <li>技優保送</li>
                              <li>技優甄審</li>
                            </ol>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
