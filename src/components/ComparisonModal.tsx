import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Trash2, List } from 'lucide-react';
import { formatSchoolOwnership } from '../lib/schoolDisplay';
import { useModalHistory } from '../hooks/useModalHistory';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  schools: any[];
  onRemove: (name: string) => void;
  onClear: () => void;
}

const normalizeHistoricalScores = (scores: any[] = []) =>
  scores
    .filter((item) => item && item.points !== null && item.points !== undefined)
    .map((item) => ({
      ...item,
      year: String(item.year || '歷年'),
      numericYear: Number.parseInt(String(item.year || '').replace(/\D/g, ''), 10),
    }))
    .sort((a, b) => (Number.isFinite(b.numericYear) ? b.numericYear : 0) - (Number.isFinite(a.numericYear) ? a.numericYear : 0))
    .slice(0, 4);

const formatHistoricalCredits = (credits: any) =>
  credits !== null && credits !== undefined && credits !== '' ? credits : '無';

const HistoricalScoresCell = ({ school }: { school: any }) => {
  const scores = normalizeHistoricalScores(school.historicalScores || []);
  if (!scores.length) {
    return (
      <span className="inline-flex rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-500">
        資料建置中
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {scores.map((item: any) => (
        <span
          key={`${item.year}-${item.points}-${item.credits ?? 'none'}`}
          className="inline-flex flex-col rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 leading-tight"
        >
          <span className="text-[10px] font-black text-amber-700">{item.year}</span>
          <span className="text-xs font-black text-slate-800">
            積分 {item.points} / 積點 {formatHistoricalCredits(item.credits)}
          </span>
        </span>
      ))}
    </div>
  );
};

export default function ComparisonModal({ isOpen, onClose, schools, onRemove, onClear }: Props) {
  const handleClose = useModalHistory('Comparison', isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative h-[100dvh] w-full max-w-6xl bg-slate-100 border-0 sm:h-auto sm:max-h-[90vh] sm:rounded-[2rem] sm:border-4 border-slate-900 overflow-hidden shadow-none sm:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col"
          >
            <div className="relative shrink-0 overflow-hidden border-b-4 border-slate-900 bg-indigo-50 p-4 sm:p-6">
              <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full border-[18px] border-indigo-200/60" />
              <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-sky-200/60 blur-2xl" />
              <List className="pointer-events-none absolute -right-1 bottom-[-2.25rem] h-36 w-36 text-indigo-900/5" />
              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-start">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0_#0f172a] sm:h-14 sm:w-14">
                      <List className="h-5 w-5 text-indigo-600 sm:h-7 sm:w-7" />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-indigo-200 bg-indigo-100/80 px-2 py-0.5 text-[10px] font-black tracking-[0.16em] text-indigo-700">ANALYSIS COMPARISON</span>
                        <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-black text-slate-600">已選 {schools.length} 所</span>
                      </div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-3xl">分析結果比較</h2>
                    </div>
                  </div>
                  <button onClick={handleClose} aria-label="關閉比較清單" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[3px_3px_0_#0f172a] transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-[4px_4px_0_#0f172a] active:translate-y-0 active:shadow-none sm:hidden">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-end gap-3">
                  {schools.length > 0 && (
                    <button onClick={onClear} className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black text-rose-600 shadow-[3px_3px_0_#0f172a] transition-all hover:-translate-y-0.5 hover:bg-rose-50 hover:shadow-[4px_4px_0_#0f172a] active:translate-y-0 active:shadow-none sm:flex-none">
                      <Trash2 className="h-4 w-4" /> <span>清空全部</span>
                    </button>
                  )}
                  <button onClick={handleClose} aria-label="關閉比較清單" className="hidden h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[3px_3px_0_#0f172a] transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-[4px_4px_0_#0f172a] active:translate-y-0 active:shadow-none sm:flex">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-100 p-3 sm:p-6 overflow-y-auto w-full custom-scrollbar">
              {schools.length === 0 ? (
                <div className="text-center py-24 bg-white border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-3xl mx-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full border-4 border-slate-900 flex items-center justify-center mx-auto mb-4">
                    <List className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-xl font-black text-slate-900">目前尚無比較學校</p>
                  <p className="text-sm font-bold text-slate-500 mt-2">請先在分析結果中勾選加入比較清單</p>
                </div>
              ) : (
                <div className="relative overflow-x-auto rounded-2xl sm:rounded-3xl border-4 border-slate-900 bg-slate-200 p-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] mx-0 sm:mx-1 overscroll-x-contain">
                  <div className="sticky left-0 z-20 w-max rounded-br-xl border-b-2 border-r-2 border-slate-900 bg-amber-200 px-2 py-1 text-[10px] font-black text-slate-900 sm:hidden">
                    ← 左右滑動比較 →
                  </div>
                  <table className="w-full min-w-[760px] border-separate border-spacing-2 text-left [&_tbody_tr]:border-0 [&_tbody_td]:rounded-xl [&_tbody_td]:border-2 [&_tbody_td]:border-slate-200 [&_tbody_td]:bg-white [&_tbody_td]:px-4 [&_tbody_td]:py-3 [&_tbody_td]:align-middle [&_tbody_td:first-child]:!border-slate-900 [&_tbody_td:first-child]:!bg-slate-900 [&_tbody_td:first-child]:text-xs [&_tbody_td:first-child]:uppercase [&_tbody_td:first-child]:tracking-wide [&_tbody_td:first-child]:!text-white">
                    <thead>
                      <tr className="text-white">
                        <th className="w-[168px] rounded-xl border-2 border-slate-900 bg-slate-900 p-4 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[2px_2px_0_#0f172a]">學校(科系)</th>
                        {schools.map((s, i) => (
                          <th key={s.name} className={`min-w-[205px] rounded-xl border-2 border-slate-900 p-4 font-black relative shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${i % 2 === 0 ? 'bg-indigo-700' : 'bg-slate-800'}`}>
                            <div className="mb-1 text-[10px] font-black tracking-[0.16em] text-amber-300">OPTION {String(i + 1).padStart(2, '0')}</div>
                            <div className="pr-8 leading-snug">{s.name}</div>
                            <button 
                              onClick={() => onRemove(s.name)} 
                              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-white shadow-md transition-transform hover:scale-110 hover:bg-rose-600"
                            >
                              <X className="w-3 h-3 stroke-[3]" />
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm md:text-base">
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">就學區</td>
                        {schools.map((s, i) => <td key={s.name} className={`p-5 font-bold border-r border-slate-200 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>{s.region || '未知'}</td>)}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">學校類型</td>
                        {schools.map((s, i) => <td key={s.name} className={`p-5 font-bold border-r border-slate-200 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>{s.type || '未知'}</td>)}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">地理位置</td>
                        {schools.map((s, i) => (
                          <td key={s.name} className={`p-5 font-bold border-r border-slate-200 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 w-fit"
                            >
                              <ExternalLink className="w-4 h-4" /> <span>學校地圖</span>
                            </a>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">公立 / 私立</td>
                        {schools.map((s, i) => (
                          <td key={s.name} className={`p-5 font-bold text-slate-700 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>
                            {formatSchoolOwnership(s.ownership)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">特色及群別</td>
                        {schools.map((s, i) => <td key={s.name} className={`p-5 font-bold border-r border-slate-200 text-slate-700 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>{s.group || '-'}</td>)}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">
                          歷年成績
                        </td>
                        {schools.map((s, i) => (
                          <td key={s.name} className={`p-5 font-bold border-r border-slate-200 text-slate-700 leading-relaxed ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>
                            <HistoricalScoresCell school={s} />
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-5 font-black bg-slate-50 border-r border-slate-200 text-slate-900">招生名額（一般生）</td>
                        {schools.map((s, i) => (
                          <td key={s.name} className={`p-4 border-r border-slate-200 ${i % 2 === 0 ? 'bg-indigo-50/30' : 'bg-transparent'}`}>
                            {s.admissionQuota === null || s.admissionQuota === undefined ? (
                              <span className="text-slate-400">尚未公告</span>
                            ) : (
                              <div className="min-w-[132px] rounded-xl border-2 border-indigo-200 bg-white p-3 shadow-[2px_2px_0px_0px_rgba(99,102,241,0.18)]">
                                <span className="text-lg font-black text-indigo-700">{s.admissionQuota} 名</span>
                                {s.admissionQuotaSourceUrl && (
                                  <a href={s.admissionQuotaSourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1.5 text-[11px] font-black text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800">
                                    <ExternalLink className="h-3 w-3" />官方公告
                                  </a>
                                )}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
