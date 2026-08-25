import { ArrowLeft, ArrowUpDown, Download, ExternalLink, List, MapPin, Plus, Printer, RotateCcw, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import Footer from './layout/Footer';
import { withBasePath } from '../lib/routes';
import { formatSchoolOwnership } from '../lib/schoolDisplay';
import { getComparisonSchools, saveComparisonSchools } from '../lib/comparisonStorage';
import { formatHistoricalCredits, normalizeHistoricalScores } from './ResultsDialogs';
import React from 'react';

const comparisonRows = [
  { id: 'region', label: '就學區', getValue: (school: any) => school.region || '未提供' },
  { id: 'type', label: '學校類型', getValue: (school: any) => school.type || '未提供' },
  { id: 'ownership', label: '公立／私立', getValue: (school: any) => formatSchoolOwnership(school.ownership) },
  { id: 'group', label: '特色及群別', getValue: (school: any) => school.group || '—' },
] as const;

const comparisonFields = [
  ...comparisonRows.map(({ id, label }) => ({ id, label })),
  { id: 'historicalScores', label: '歷年成績' },
  { id: 'admissionQuota', label: '招生名額' },
  { id: 'map', label: '學校地圖' },
] as const;

type ComparisonField = typeof comparisonFields[number]['id'];

const COMPARISON_FIELDS_STORAGE_KEY = 'tw-admission-analysis-comparison-fields';
const defaultVisibleFields = comparisonFields.map(({ id }) => id);

const getVisibleFields = (): ComparisonField[] => {
  try {
    const stored = sessionStorage.getItem(COMPARISON_FIELDS_STORAGE_KEY);
    const fields = stored ? JSON.parse(stored) : defaultVisibleFields;
    const validFields = Array.isArray(fields)
      ? fields.filter((field): field is ComparisonField => comparisonFields.some(({ id }) => id === field))
      : defaultVisibleFields;
    return validFields.length ? validFields : defaultVisibleFields;
  } catch {
    return defaultVisibleFields;
  }
};

function HistoricalScores({ school }: { school: any }) {
  const scores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 4);
  if (!scores.length) return <span className="text-sm font-bold text-slate-400">資料建置中</span>;

  return <div className="flex flex-wrap gap-1.5">{scores.map((item: any) => <span key={`${item.year}-${item.points}-${item.credits}`} className="rounded-lg border border-amber-300 bg-amber-50 px-2 py-1 text-[11px] font-black text-slate-800"><span className="mr-1 text-amber-700">{item.year}</span> {item.points} 分／{formatHistoricalCredits(item.credits)} 點</span>)}</div>;
}

function SchoolComparisonCard({ school, index, onRemove, visibleFields }: { school: any; index: number; onRemove: () => void; visibleFields: ComparisonField[] }) {
  const isVisible = (field: ComparisonField) => visibleFields.includes(field);
  return <article className="overflow-hidden rounded-[1.75rem] border-4 border-slate-900 bg-white shadow-[6px_6px_0_#0f172a]">
    <header className={`relative border-b-4 border-slate-900 p-5 text-white ${index % 2 === 0 ? 'bg-indigo-600' : 'bg-slate-800'}`}>
      <p className="text-[10px] font-black tracking-[0.18em] text-amber-300">比較選項 {String(index + 1).padStart(2, '0')}</p>
      <h2 className="mt-2 pr-9 text-xl font-black leading-tight">{school.name}</h2>
      <button onClick={onRemove} aria-label={`移除 ${school.name}`} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border-2 border-slate-900 bg-rose-400 text-slate-900 shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5"><Trash2 className="h-4 w-4" /></button>
    </header>
    <div className="p-5">
      {visibleFields.length ? <><dl className="space-y-3">
        {comparisonRows.filter((row) => isVisible(row.id)).map((row) => <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-3 border-b-2 border-slate-100 pb-3 text-sm"><dt className="font-black text-slate-500">{row.label}</dt><dd className="font-bold text-slate-800">{row.getValue(school)}</dd></div>)}
        {isVisible('historicalScores') && <div className="border-b-2 border-slate-100 pb-3"><dt className="mb-2 text-sm font-black text-slate-500">歷年成績</dt><dd><HistoricalScores school={school} /></dd></div>}
        {isVisible('admissionQuota') && <div><dt className="mb-2 text-sm font-black text-slate-500">招生名額（一般生）</dt><dd className="flex flex-wrap items-center gap-3">{school.admissionQuota === null || school.admissionQuota === undefined ? <span className="text-sm font-bold text-slate-400">尚未公告</span> : <span className="rounded-xl border-2 border-indigo-200 bg-indigo-50 px-3 py-1.5 text-base font-black text-indigo-700">{school.admissionQuota} 名</span>}{school.admissionQuotaSourceUrl && <a href={school.admissionQuotaSourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 underline underline-offset-4"><ExternalLink className="h-3.5 w-3.5" />官方公告</a>}</dd></div>}
      </dl>
      {isVisible('map') && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-100 px-4 py-2.5 text-sm font-black text-emerald-800 shadow-[2px_2px_0_#0f172a]"><MapPin className="h-4 w-4" />查看學校地圖 <ExternalLink className="h-3.5 w-3.5" /></a>}</> : <p className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm font-bold text-slate-500">請在「顯示欄位」至少選擇一項資料。</p>}
    </div>
  </article>;
}

export default function ComparisonPage() {
  const [schools, setSchools] = React.useState<any[]>(getComparisonSchools);
  const [visibleFields, setVisibleFields] = React.useState<ComparisonField[]>(getVisibleFields);
  const [isFieldSettingsOpen, setIsFieldSettingsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [ownershipFilter, setOwnershipFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'added' | 'name' | 'region' | 'type' | 'quota'>('added');
  const removeSchool = (name: string) => setSchools((current) => {
    const next = current.filter((school) => school.name !== name);
    saveComparisonSchools(next);
    return next;
  });
  const clearSchools = () => { saveComparisonSchools([]); setSchools([]); };
  const updateVisibleFields = (nextFields: ComparisonField[]) => {
    setVisibleFields(nextFields);
    sessionStorage.setItem(COMPARISON_FIELDS_STORAGE_KEY, JSON.stringify(nextFields));
  };
  const toggleVisibleField = (field: ComparisonField) => {
    if (visibleFields.includes(field)) {
      if (visibleFields.length === 1) return;
      updateVisibleFields(visibleFields.filter((item) => item !== field));
      return;
    }
    updateVisibleFields([...visibleFields, field]);
  };
  const filterOptions = React.useMemo(() => ({
    types: Array.from(new Set(schools.map((school) => school.type).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant')),
    ownerships: Array.from(new Set(schools.map((school) => formatSchoolOwnership(school.ownership)).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant')),
  }), [schools]);
  const filteredSchools = React.useMemo(() => schools
    .filter((school) => {
      const searchableText = `${school.name || ''} ${school.region || ''} ${school.type || ''} ${school.group || ''}`.toLowerCase();
      return (!searchTerm || searchableText.includes(searchTerm.trim().toLowerCase()))
        && (typeFilter === 'all' || school.type === typeFilter)
        && (ownershipFilter === 'all' || formatSchoolOwnership(school.ownership) === ownershipFilter);
    })
    .map((school, index) => ({ school, index }))
    .sort((left, right) => {
      if (sortBy === 'name') return String(left.school.name || '').localeCompare(String(right.school.name || ''), 'zh-Hant');
      if (sortBy === 'region') return String(left.school.region || '').localeCompare(String(right.school.region || ''), 'zh-Hant');
      if (sortBy === 'type') return String(left.school.type || '').localeCompare(String(right.school.type || ''), 'zh-Hant');
      if (sortBy === 'quota') return (Number(right.school.admissionQuota) || -1) - (Number(left.school.admissionQuota) || -1);
      return left.index - right.index;
    })
    .map(({ school }) => school), [schools, searchTerm, typeFilter, ownershipFilter, sortBy]);
  const hasFilters = Boolean(searchTerm || typeFilter !== 'all' || ownershipFilter !== 'all' || sortBy !== 'added');
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setOwnershipFilter('all');
    setSortBy('added');
  };
  const exportComparison = async () => {
    const { exportComparisonExcel } = await import('../lib/exportUtils');
    await exportComparisonExcel({ schools: filteredSchools, visibleFields });
  };
  const printCurrentComparison = async () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('無法開啟列印視窗，請檢查是否被瀏覽器阻擋。');
      return;
    }
    const { printComparison } = await import('../lib/exportUtils');
    printComparison({ schools: filteredSchools, visibleFields }, printWindow);
  };

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <main className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <a href={withBasePath('/results')} className="inline-flex items-center gap-2 text-sm font-black text-slate-600 transition hover:text-slate-900"><ArrowLeft className="h-4 w-4" />回到分析結果</a>
      <section className="relative mt-5 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[8px_8px_0_#0f172a] sm:p-9 xl:p-10">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[18px] border-indigo-400" />
        <div className="pointer-events-none absolute bottom-0 right-24 h-28 w-28 rounded-full bg-amber-300/50 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[10px] font-black tracking-[0.18em]"><List className="h-3.5 w-3.5 text-amber-300" />SCHOOL COMPARISON</div><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl xl:text-6xl">分析結果比較</h1><p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-indigo-100 sm:text-base">把候選學校放在同一個畫面，依入學條件、群別、歷年成績與招生名額，找出最適合下一步研究的選項。</p></div><div className="rounded-2xl border-2 border-slate-900 bg-amber-300 px-5 py-4 text-center text-slate-900 shadow-[3px_3px_0_#0f172a]"><p className="text-[10px] font-black tracking-widest">已選學校</p><p className="text-3xl font-black">{schools.length} <span className="text-sm">所</span></p></div></div>
      </section>
      {schools.length ? <>
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a] lg:flex-row lg:items-center lg:justify-between"><p className="text-sm font-bold text-slate-600">可回到結果頁，將需要研究的校科持續加入清單。</p><div className="relative grid w-full grid-cols-2 gap-2 lg:w-auto lg:flex"><button type="button" onClick={() => setIsFieldSettingsOpen((open) => !open)} aria-expanded={isFieldSettingsOpen} className="col-span-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-100 px-4 py-2.5 text-sm font-black text-amber-800 lg:w-auto"><SlidersHorizontal className="h-4 w-4" />顯示欄位（{visibleFields.length}）</button><a href={withBasePath('/results')} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-100 px-3 py-2.5 text-sm font-black text-sky-800 lg:w-auto lg:px-4"><Plus className="h-4 w-4" />新增學校</a><button onClick={clearSchools} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-rose-100 px-3 py-2.5 text-sm font-black text-rose-700 lg:w-auto lg:px-4"><Trash2 className="h-4 w-4" />清空</button>{isFieldSettingsOpen && <div className="absolute left-0 right-0 top-full z-30 mt-2 rounded-2xl border-2 border-slate-900 bg-slate-50 p-3 shadow-[4px_4px_0_#0f172a] lg:left-auto lg:w-[26rem]"><div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs font-black text-slate-600">至少保留一個欄位</p><button type="button" onClick={() => updateVisibleFields(defaultVisibleFields)} className="inline-flex items-center gap-1 text-xs font-black text-indigo-700 underline underline-offset-4"><RotateCcw className="h-3.5 w-3.5" />全部顯示</button></div><div className="grid grid-cols-2 gap-2">{comparisonFields.map((field) => <label key={field.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-black text-slate-700"><input type="checkbox" checked={visibleFields.includes(field.id)} onChange={() => toggleVisibleField(field.id)} className="h-4 w-4 accent-indigo-600" />{field.label}</label>)}</div></div>}</div></div>
        <section className="mt-6 rounded-2xl border-2 border-slate-900 bg-slate-100 p-4 shadow-[3px_3px_0_#0f172a]" aria-label="搜尋、篩選與排序比較清單"><div className="grid gap-3 lg:grid-cols-[minmax(20rem,1fr)_10rem_8rem_12rem] lg:items-end"><label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-xs font-black text-slate-600"><Search className="h-3.5 w-3.5" />搜尋學校</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="校名、群別、類型或就學區" className="w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-bold outline-none placeholder:text-slate-400 focus:border-indigo-600" /></label><label className="block"><span className="mb-1.5 text-xs font-black text-slate-600">類型</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-indigo-600"><option value="all">全部</option>{filterOptions.types.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label className="block"><span className="mb-1.5 text-xs font-black text-slate-600">公私立</span><select value={ownershipFilter} onChange={(event) => setOwnershipFilter(event.target.value)} className="w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-indigo-600"><option value="all">全部</option>{filterOptions.ownerships.map((ownership) => <option key={ownership} value={ownership}>{ownership}</option>)}</select></label><label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-xs font-black text-slate-600"><ArrowUpDown className="h-3.5 w-3.5" />排序</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-bold outline-none focus:border-indigo-600"><option value="added">加入順序</option><option value="name">校名</option><option value="region">就學區</option><option value="type">學校類型</option><option value="quota">招生名額（多→少）</option></select></label></div><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs font-black text-slate-600">顯示 <span className="text-indigo-700">{filteredSchools.length}</span> ／ {schools.length} 所</p><div className="grid grid-cols-2 gap-2 sm:flex">{hasFilters && <button type="button" onClick={clearFilters} className="inline-flex items-center justify-center gap-1 rounded-lg border-2 border-slate-300 bg-white px-2 py-2 text-xs font-black text-slate-600 hover:text-slate-900"><X className="h-3.5 w-3.5" />清除條件</button>}<button type="button" onClick={exportComparison} disabled={!filteredSchools.length} className="inline-flex items-center justify-center gap-1 rounded-lg border-2 border-slate-900 bg-emerald-100 px-2 py-2 text-xs font-black text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"><Download className="h-3.5 w-3.5" />匯出 Excel</button><button type="button" onClick={printCurrentComparison} disabled={!filteredSchools.length} className="inline-flex items-center justify-center gap-1 rounded-lg border-2 border-slate-900 bg-white px-2 py-2 text-xs font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><Printer className="h-3.5 w-3.5" />列印比較表</button></div></div></section>
        {filteredSchools.length ? <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filteredSchools.map((school, index) => <SchoolComparisonCard key={school.name} school={school} index={index} visibleFields={visibleFields} onRemove={() => removeSchool(school.name)} />)}</div> : <section className="mt-7 rounded-3xl border-4 border-dashed border-slate-300 bg-white px-6 py-14 text-center"><Search className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-3 text-xl font-black">找不到符合的學校</h2><p className="mt-2 text-sm font-bold text-slate-500">試試減少篩選條件或換一個搜尋關鍵字。</p><button type="button" onClick={clearFilters} className="mt-5 rounded-xl border-2 border-slate-900 bg-amber-100 px-4 py-2 text-sm font-black shadow-[2px_2px_0_#0f172a]">清除條件</button></section>}
      </> : <section className="mt-7 rounded-[2rem] border-4 border-dashed border-slate-300 bg-white px-6 py-20 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border-2 border-slate-900 bg-amber-300 shadow-[3px_3px_0_#0f172a]"><List className="h-8 w-8" /></div><h2 className="mt-5 text-2xl font-black">比較清單目前是空的</h2><p className="mx-auto mt-2 max-w-md text-sm font-bold leading-6 text-slate-500">回到分析結果，從你有興趣的校科選擇「加入比較」，再回來逐一閱讀。</p><a href={withBasePath('/results')} className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0_#0f172a]"><Plus className="h-4 w-4" />前往分析結果</a></section>}
    </main>
    <Footer />
  </div>;
}
