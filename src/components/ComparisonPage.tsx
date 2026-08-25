import { ArrowLeft, ExternalLink, List, MapPin, Plus, Trash2 } from 'lucide-react';
import Footer from './layout/Footer';
import { withBasePath } from '../lib/routes';
import { formatSchoolOwnership } from '../lib/schoolDisplay';
import { getComparisonSchools, saveComparisonSchools } from '../lib/comparisonStorage';
import { formatHistoricalCredits, normalizeHistoricalScores } from './ResultsDialogs';
import React from 'react';

const comparisonRows = [
  { label: '就學區', getValue: (school: any) => school.region || '未提供' },
  { label: '學校類型', getValue: (school: any) => school.type || '未提供' },
  { label: '公立／私立', getValue: (school: any) => formatSchoolOwnership(school.ownership) },
  { label: '特色及群別', getValue: (school: any) => school.group || '—' },
];

function HistoricalScores({ school }: { school: any }) {
  const scores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 4);
  if (!scores.length) return <span className="text-sm font-bold text-slate-400">資料建置中</span>;

  return <div className="flex flex-wrap gap-1.5">{scores.map((item: any) => <span key={`${item.year}-${item.points}-${item.credits}`} className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-black text-slate-800"><span className="mr-1 text-amber-700">{item.year}</span> {item.points} 分／{formatHistoricalCredits(item.credits)} 點</span>)}</div>;
}

function SchoolComparisonCard({ school, index, onRemove }: { school: any; index: number; onRemove: () => void }) {
  return <article className="overflow-hidden rounded-[1.75rem] border-4 border-slate-900 bg-white shadow-[6px_6px_0_#0f172a]">
    <header className={`relative border-b-4 border-slate-900 p-5 text-white ${index % 2 === 0 ? 'bg-indigo-600' : 'bg-slate-800'}`}>
      <p className="text-[10px] font-black tracking-[0.18em] text-amber-300">比較選項 {String(index + 1).padStart(2, '0')}</p>
      <h2 className="mt-2 pr-9 text-xl font-black leading-tight">{school.name}</h2>
      <button onClick={onRemove} aria-label={`移除 ${school.name}`} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border-2 border-slate-900 bg-rose-400 text-slate-900 shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5"><Trash2 className="h-4 w-4" /></button>
    </header>
    <div className="p-5">
      <dl className="space-y-3">
        {comparisonRows.map((row) => <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-3 border-b-2 border-slate-100 pb-3 text-sm"><dt className="font-black text-slate-500">{row.label}</dt><dd className="font-bold text-slate-800">{row.getValue(school)}</dd></div>)}
        <div className="border-b-2 border-slate-100 pb-3"><dt className="mb-2 text-sm font-black text-slate-500">歷年成績</dt><dd><HistoricalScores school={school} /></dd></div>
        <div><dt className="mb-2 text-sm font-black text-slate-500">招生名額（一般生）</dt><dd className="flex flex-wrap items-center gap-3">{school.admissionQuota === null || school.admissionQuota === undefined ? <span className="text-sm font-bold text-slate-400">尚未公告</span> : <span className="rounded-xl border-2 border-indigo-200 bg-indigo-50 px-3 py-1.5 text-base font-black text-indigo-700">{school.admissionQuota} 名</span>}{school.admissionQuotaSourceUrl && <a href={school.admissionQuotaSourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 underline underline-offset-4"><ExternalLink className="h-3.5 w-3.5" />官方公告</a>}</dd></div>
      </dl>
      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-100 px-4 py-2.5 text-sm font-black text-emerald-800 shadow-[2px_2px_0_#0f172a]"><MapPin className="h-4 w-4" />查看學校地圖 <ExternalLink className="h-3.5 w-3.5" /></a>
    </div>
  </article>;
}

export default function ComparisonPage() {
  const [schools, setSchools] = React.useState<any[]>(getComparisonSchools);
  const removeSchool = (name: string) => setSchools((current) => {
    const next = current.filter((school) => school.name !== name);
    saveComparisonSchools(next);
    return next;
  });
  const clearSchools = () => { saveComparisonSchools([]); setSchools([]); };

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <a href={withBasePath('/results')} className="inline-flex items-center gap-2 text-sm font-black text-slate-600 transition hover:text-slate-900"><ArrowLeft className="h-4 w-4" />回到分析結果</a>
      <section className="relative mt-5 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[8px_8px_0_#0f172a] sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[18px] border-indigo-400" />
        <div className="pointer-events-none absolute bottom-0 right-24 h-28 w-28 rounded-full bg-amber-300/50 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-black tracking-[0.18em]"><List className="h-3.5 w-3.5 text-amber-300" />SCHOOL COMPARISON</div><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">分析結果比較</h1><p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-indigo-100 sm:text-base">把候選學校放在同一個畫面，依入學條件、群別、歷年成績與招生名額，找出最適合下一步研究的選項。</p></div><div className="rounded-2xl border-2 border-slate-900 bg-amber-300 px-4 py-3 text-center text-slate-900 shadow-[3px_3px_0_#0f172a]"><p className="text-[10px] font-black tracking-widest">已選學校</p><p className="text-2xl font-black">{schools.length} <span className="text-sm">／ 4 所</span></p></div></div>
      </section>
      {schools.length ? <>
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a] sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-bold text-slate-600">可回到結果頁繼續加入學校；最多比較 4 所。</p><div className="flex gap-2"><a href={withBasePath('/results')} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-100 px-4 py-2 text-sm font-black text-sky-800"><Plus className="h-4 w-4" />新增學校</a><button onClick={clearSchools} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-rose-100 px-4 py-2 text-sm font-black text-rose-700"><Trash2 className="h-4 w-4" />清空</button></div></div>
        <div className="mt-7 grid gap-6 md:grid-cols-2">{schools.map((school, index) => <SchoolComparisonCard key={school.name} school={school} index={index} onRemove={() => removeSchool(school.name)} />)}</div>
      </> : <section className="mt-7 rounded-[2rem] border-4 border-dashed border-slate-300 bg-white px-6 py-20 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 border-slate-900 bg-amber-300 shadow-[3px_3px_0_#0f172a]"><List className="h-8 w-8" /></div><h2 className="mt-5 text-2xl font-black">比較清單目前是空的</h2><p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-slate-500">回到分析結果，從你有興趣的校科選擇「加入比較」，再回來逐一閱讀。</p><a href={withBasePath('/results')} className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0_#0f172a]"><Plus className="h-4 w-4" />前往分析結果</a></section>}
    </main>
    <Footer />
  </div>;
}
