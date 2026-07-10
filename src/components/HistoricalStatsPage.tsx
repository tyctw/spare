import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Info,
  PenTool,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { table114, table115 } from './HistoricalStatsModal';

type YearKey = '115' | '114';

const yearlyData: Record<YearKey, string[][]> = {
  '115': table115,
  '114': table114,
};

const toNumber = (value: string) => Number(value.replace(/,/g, '')) || 0;

const getSummary = (rows: string[][]) => {
  const total = rows.reduce((sum, row) => sum + toNumber(row[1]), 0);
  const fiveA = rows.find((row) => row[0] === '5A0B0C');
  const zeroA = rows.find((row) => row[0] === '0A5B0C');
  const threeAPlusTotal = rows
    .filter((row) => Number(row[0][0]) >= 3)
    .reduce((sum, row) => sum + toNumber(row[1]), 0);

  return {
    total,
    fiveACount: fiveA ? toNumber(fiveA[1]) : 0,
    fiveARate: fiveA?.[2] || '0%',
    zeroACount: zeroA ? toNumber(zeroA[1]) : 0,
    zeroARate: zeroA?.[2] || '0%',
    threeAPlusCount: threeAPlusTotal,
    threeAPlusRate: total ? `${((threeAPlusTotal / total) * 100).toFixed(2)}%` : '0%',
  };
};

const formatNumber = (value: number) => value.toLocaleString('zh-TW');

const tableHeaders = [
  '等級組合',
  '人數',
  '占比',
  '作文 6 級分',
  '6 級分組內占比',
  '6 級分全體占比',
  '作文 5 級分',
  '5 級分組內占比',
  '5 級分全體占比',
  '作文 4 級分',
  '4 級分組內占比',
  '4 級分全體占比',
  '作文 3 級以下',
  '3 級以下組內占比',
  '3 級以下全體占比',
];

const focusRows = ['5A0B0C', '4A1B0C', '3A2B0C', '2A3B0C', '1A4B0C', '0A5B0C'];

export default function HistoricalStatsPage() {
  const [activeYear, setActiveYear] = useState<YearKey>('115');
  const rows = yearlyData[activeYear];
  const currentSummary = useMemo(() => getSummary(rows), [rows]);
  const previousSummary = useMemo(() => getSummary(activeYear === '115' ? table114 : table115), [activeYear]);
  const fiveADiff = currentSummary.fiveACount - previousSummary.fiveACount;
  const focusData = rows.filter((row) => focusRows.includes(row[0]));

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>

          <div className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-3 rounded-lg border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:px-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-indigo-100">
                  <BarChart3 className="h-6 w-6 text-indigo-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase text-slate-500">Exam Statistics</p>
                  <p className="text-sm font-black text-slate-700">會考等級與作文級分分布</p>
                </div>
              </div>
              <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">歷年會考統計資料</h1>
              <p className="mt-4 max-w-3xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">
                重新整理 114、115 學年度會考等級組合與作文級分分布，方便快速比較高分群、中段群與基礎群的人數變化。
              </p>
            </div>

            <div className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-indigo-700" />
                <h2 className="text-lg font-black">資料閱讀方式</h2>
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                A/B/C 代表五科整體等級組合；作文欄位則拆出 6、5、4 與 3 級以下的人數與比例。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <nav className="rounded-lg border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500">
              <FileText className="h-4 w-4" />
              頁面導覽
            </div>
            <div className="grid gap-2">
              <a className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100" href="#overview">年度總覽</a>
              <a className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100" href="#focus">重點組合</a>
              <a className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100" href="#table">完整表格</a>
              <a className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100" href="#notes">判讀提醒</a>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 space-y-8">
          <section id="overview" className="scroll-mt-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">年度總覽</h2>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                  切換年度後，下方摘要與表格會同步更新。
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-lg border-2 border-slate-900 bg-white p-2">
                {(['115', '114'] as YearKey[]).map((year) => (
                  <button
                    key={year}
                    onClick={() => setActiveYear(year)}
                    className={`rounded-lg px-5 py-2 text-sm font-black transition-all ${
                      activeYear === year ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {year} 學年度
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard title="統計總人數" value={formatNumber(currentSummary.total)} note={`${activeYear} 學年度`} tone="slate" />
              <SummaryCard title="5A0B0C" value={formatNumber(currentSummary.fiveACount)} note={`全體占比 ${currentSummary.fiveARate}`} tone="indigo" />
              <SummaryCard title="3A 以上合計" value={formatNumber(currentSummary.threeAPlusCount)} note={`全體占比 ${currentSummary.threeAPlusRate}`} tone="emerald" />
              <SummaryCard title="0A5B0C" value={formatNumber(currentSummary.zeroACount)} note={`全體占比 ${currentSummary.zeroARate}`} tone="amber" />
            </div>

            <div className="mt-5 rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3">
                {fiveADiff >= 0 ? <TrendingUp className="h-6 w-6 text-rose-600" /> : <TrendingDown className="h-6 w-6 text-emerald-600" />}
                <h3 className="text-xl font-black">年度差異提示</h3>
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                目前選擇的 {activeYear} 學年度 5A0B0C 人數比對照年度
                <span className={`mx-1 font-black ${fiveADiff >= 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {fiveADiff >= 0 ? '增加' : '減少'} {formatNumber(Math.abs(fiveADiff))} 人
                </span>
                。判讀落點時，建議同時觀察作文級分分布與各就學區招生條件。
              </p>
            </div>
          </section>

          <section id="focus" className="scroll-mt-8">
            <div className="mb-5">
              <h2 className="text-2xl font-black sm:text-3xl">重點組合</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                先看常用分群，可以比完整表格更快抓到年度分布輪廓。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {focusData.map((row) => (
                <article key={row[0]} className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-black text-slate-500">等級組合</div>
                      <h3 className="mt-1 text-2xl font-black text-indigo-700">{row[0]}</h3>
                    </div>
                    <div className="rounded-lg border-2 border-slate-900 bg-indigo-50 px-3 py-2 text-right">
                      <div className="text-xs font-black text-slate-500">全體占比</div>
                      <div className="text-lg font-black">{row[2]}</div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <StatLine label="人數" value={row[1]} />
                    <StatLine label="作文 6 級分" value={row[3]} />
                    <StatLine label="作文 5 級分" value={row[6]} />
                    <StatLine label="作文 4 級分" value={row[9]} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="table" className="scroll-mt-8 rounded-lg border-4 border-slate-900 bg-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-indigo-100 p-5">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-indigo-700" />
                <h2 className="text-2xl font-black">{activeYear} 學年度完整表格</h2>
              </div>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                表格可左右滑動；第一欄固定顯示等級組合，方便對照各作文級分欄位。
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th
                        key={header}
                        className={`px-3 py-3 font-black ${index === 0 ? 'sticky left-0 z-10 bg-slate-900' : ''}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={row[0]} className={`border-b border-slate-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${row[0]}-${cellIndex}`}
                          className={`px-3 py-3 font-bold text-slate-700 ${cellIndex === 0 ? 'sticky left-0 z-10 border-r-2 border-slate-200 bg-inherit font-black text-slate-900' : 'text-right'}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="notes" className="scroll-mt-8 rounded-lg border-4 border-slate-900 bg-amber-300 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-7">
            <div className="flex items-start gap-4">
              <BookOpen className="mt-1 h-7 w-7 shrink-0 text-slate-900" />
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">判讀提醒</h2>
                <div className="mt-4 grid gap-3 text-sm font-bold leading-7 text-slate-800 md:grid-cols-3">
                  <p className="rounded-lg border-2 border-slate-900 bg-white p-4">統計資料適合觀察整體分布，不等於單一學校錄取門檻。</p>
                  <p className="rounded-lg border-2 border-slate-900 bg-white p-4">作文級分會影響部分區域的超額比序，不能只看 A/B/C 組合。</p>
                  <p className="rounded-lg border-2 border-slate-900 bg-white p-4">正式志願選填仍應以簡章、招生委員會與學校公告為準。</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SummaryCard({ title, value, note, tone }: { title: string; value: string; note: string; tone: 'slate' | 'indigo' | 'emerald' | 'amber' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    emerald: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
  };

  return (
    <article className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
      <div className={`inline-flex rounded-lg border-2 border-slate-900 px-2.5 py-1 text-xs font-black ${tones[tone]}`}>{title}</div>
      <div className="mt-4 text-3xl font-black text-slate-900">{value}</div>
      <div className="mt-2 text-sm font-bold text-slate-500">{note}</div>
    </article>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <div className="text-xs font-black text-slate-500">{label}</div>
      <div className="mt-1 font-black text-slate-900">{value}</div>
    </div>
  );
}
