import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Info,
  Layers,
  Table2,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';

type YearKey = '115' | '114';

const levelDescriptions = [
  { mark: 'A++', level: '精熟', desc: '精熟，且答對題數前 25%', meaning: '具備深入概念與高階思考能力', tone: 'indigo' },
  { mark: 'A+', level: '精熟', desc: '精熟，且答對題數 26%~50%', meaning: '具備深入概念', tone: 'indigo' },
  { mark: 'A', level: '精熟', desc: '精熟', meaning: '具備該學科完整概念', tone: 'indigo' },
  { mark: 'B++', level: '基礎', desc: '基礎，且答對題數前 25%', meaning: '具備部分基礎', tone: 'emerald' },
  { mark: 'B+', level: '基礎', desc: '基礎，且答對題數 26%~50%', meaning: '具備部分基礎', tone: 'emerald' },
  { mark: 'B', level: '基礎', desc: '基礎', meaning: '具備基本學科知識', tone: 'emerald' },
  { mark: 'C', level: '待加強', desc: '待加強', meaning: '尚未具備基礎學科知識', tone: 'rose' },
];

const yearlyTables: Record<YearKey, Array<Record<string, string>>> = {
  '115': [
    { level: '精熟', mark: 'A++', chinese: '答對 40-42 題', social: '答對 52-54 題', science: '答對 47-50 題', english: '98.14-100.00', math: '91.60-100.00' },
    { level: '精熟', mark: 'A+', chinese: '答對 39 題', social: '答對 51 題', science: '答對 46 題', english: '96.28-98.13', math: '85.70-91.59' },
    { level: '精熟', mark: 'A', chinese: '答對 36-38 題', social: '答對 48-50 題', science: '答對 43-45 題', english: '90.70-96.27', math: '77.10-85.69' },
    { level: '基礎', mark: 'B++', chinese: '答對 32-35 題', social: '答對 41-47 題', science: '答對 36-42 題', english: '82.30-90.69', math: '68.70-77.09' },
    { level: '基礎', mark: 'B+', chinese: '答對 28-31 題', social: '答對 34-40 題', science: '答對 29-35 題', english: '69.28-82.29', math: '59.40-68.69' },
    { level: '基礎', mark: 'B', chinese: '答對 17-27 題', social: '答對 20-33 題', science: '答對 19-28 題', english: '38.43-69.27', math: '39.00-59.39' },
    { level: '待加強', mark: 'C', chinese: '答對 0-16 題', social: '答對 0-19 題', science: '答對 0-18 題', english: '00.00-38.42', math: '00.00-38.99' },
  ],
  '114': [
    { level: '精熟', mark: 'A++', chinese: '答對 40-42 題', social: '答對 52-54 題', science: '答對 48-50 題', english: '98.14-100.00', math: '93.20-100.00' },
    { level: '精熟', mark: 'A+', chinese: '答對 38-39 題', social: '答對 51 題', science: '答對 46-47 題', english: '95.33-98.13', math: '85.70-93.19' },
    { level: '精熟', mark: 'A', chinese: '答對 36-37 題', social: '答對 48-50 題', science: '答對 43-45 題', english: '90.70-95.32', math: '76.20-85.69' },
    { level: '基礎', mark: 'B++', chinese: '答對 32-35 題', social: '答對 41-47 題', science: '答對 36-42 題', english: '82.21-90.69', math: '67.10-76.19' },
    { level: '基礎', mark: 'B+', chinese: '答對 28-31 題', social: '答對 35-40 題', science: '答對 29-35 題', english: '71.05-83.20', math: '59.40-67.09' },
    { level: '基礎', mark: 'B', chinese: '答對 18-27 題', social: '答對 21-34 題', science: '答對 18-28 題', english: '38.43-71.04', math: '40.60-59.39' },
    { level: '待加強', mark: 'C', chinese: '答對 0-17 題', social: '答對 0-20 題', science: '答對 0-17 題', english: '00.00-38.42', math: '00.00-40.59' },
  ],
};

const markTone = (mark: string) => {
  if (mark.startsWith('A')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (mark.startsWith('B')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
};

export default function GradeLevelPage() {
  const [activeYear, setActiveYear] = useState<YearKey>('115');
  const rows = yearlyTables[activeYear];
  const summary = useMemo(
    () => [
      { label: '精熟標示', value: 'A++ / A+ / A', tone: 'bg-indigo-100 text-indigo-800' },
      { label: '基礎標示', value: 'B++ / B+ / B', tone: 'bg-emerald-100 text-emerald-800' },
      { label: '待加強', value: 'C', tone: 'bg-rose-100 text-rose-800' },
    ],
    [],
  );

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-rose-50">
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-rose-100">
                  <Award className="h-6 w-6 text-rose-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase text-slate-500">Exam Grade Reference</p>
                  <p className="text-sm font-black text-slate-700">會考等級、標示與答對題數</p>
                </div>
              </div>
              <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">等級對照表</h1>
              <p className="mt-4 max-w-3xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">
                將原本彈窗裡的資料重新整理成獨立頁面：先看 A/B/C 與標示意義，再切換年度查各科答對題數與英文、數學加權成績區間。
              </p>
            </div>

            <div className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-rose-700" />
                <h2 className="text-lg font-black">閱讀方式</h2>
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                A++、A+、B++、B+ 是同一等級內的標示，用來更細分答對題數或加權成績區間；實際招生計分仍需搭配各就學區規則。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className={pageNavigationAsideClassName}>
          <PageNavigation
            items={[
              { id: 'overview', label: '等級摘要' },
              { id: 'description', label: '標示說明' },
              { id: 'table', label: '年度對照表' },
              { id: 'notes', label: '補充提醒' },
            ]}
          />
        </aside>

        <div className="min-w-0 space-y-8">
          <section id="overview" className="scroll-mt-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {summary.map((item) => (
                <article key={item.label} className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className={`inline-flex rounded-lg border-2 border-slate-900 px-2.5 py-1 text-xs font-black ${item.tone}`}>{item.label}</div>
                  <div className="mt-4 text-2xl font-black text-slate-900">{item.value}</div>
                </article>
              ))}
            </div>
          </section>

          <section id="description" className="scroll-mt-8">
            <div className="mb-5">
              <h2 className="text-2xl font-black sm:text-3xl">等級與標示說明</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                先用卡片掌握每個標示的意義，再往下查各年度各科的題數區間。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {levelDescriptions.map((item) => (
                <article key={item.mark} className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`rounded-lg border-2 px-3 py-2 text-2xl font-black ${markTone(item.mark)}`}>{item.mark}</div>
                    <div className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-black text-white">{item.level}</div>
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-900">{item.desc}</h3>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-600">{item.meaning}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="table" className="scroll-mt-8 rounded-lg border-4 border-slate-900 bg-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-rose-100 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Table2 className="h-6 w-6 text-rose-700" />
                    <h2 className="text-2xl font-black">{activeYear} 年答對題數對照</h2>
                  </div>
                  <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                    表格可左右滑動；第一欄固定顯示成績等級，方便在小螢幕對照。
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg border-2 border-slate-900 bg-white p-2">
                  {(['115', '114'] as YearKey[]).map((year) => (
                    <button
                      key={year}
                      onClick={() => setActiveYear(year)}
                      className={`rounded-lg px-5 py-2 text-sm font-black transition-all ${
                        activeYear === year ? 'bg-rose-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {year} 年
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="sticky left-0 z-10 bg-slate-900 px-4 py-3 font-black">成績等級</th>
                    <th className="px-4 py-3 font-black">標示</th>
                    <th className="px-4 py-3 font-black">國文</th>
                    <th className="px-4 py-3 font-black">社會</th>
                    <th className="px-4 py-3 font-black">自然</th>
                    <th className="px-4 py-3 font-black">英文加權成績</th>
                    <th className="px-4 py-3 font-black">數學加權成績</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.mark} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="sticky left-0 z-10 border-r-2 border-slate-200 bg-inherit px-4 py-3 font-black text-slate-900">{row.level}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex min-w-14 justify-center rounded-lg border px-2.5 py-1 font-black ${markTone(row.mark)}`}>{row.mark}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">{row.chinese}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{row.social}</td>
                      <td className="px-4 py-3 font-bold text-slate-700">{row.science}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{row.english}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{row.math}</td>
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
                <h2 className="text-2xl font-black sm:text-3xl">補充提醒</h2>
                <div className="mt-4 grid gap-3 text-sm font-bold leading-7 text-slate-800 md:grid-cols-3">
                  <p className="rounded-lg border-2 border-slate-900 bg-white p-4"><CheckCircle2 className="mb-2 h-5 w-5 text-emerald-700" />答對題數區間每年可能不同，請以當年度公告為準。</p>
                  <p className="rounded-lg border-2 border-slate-900 bg-white p-4"><Layers className="mb-2 h-5 w-5 text-indigo-700" />英文與數學使用加權成績區間，不是單純答對題數。</p>
                  <p className="rounded-lg border-2 border-slate-900 bg-white p-4"><Award className="mb-2 h-5 w-5 text-rose-700" />若要試算落點，請回首頁選擇就學區並輸入完整五科與作文成績。</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
