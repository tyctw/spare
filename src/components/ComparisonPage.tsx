import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpDown, Check, Download, ExternalLink, Info, Layers3, MapPin, Plus, Printer, RotateCcw, Search, SlidersHorizontal, Trash2, X } from 'lucide-react';
import Footer from './layout/Footer';
import { withBasePath } from '../lib/routes';
import { formatSchoolOwnership } from '../lib/schoolDisplay';
import { getComparisonSchools, saveComparisonSchools } from '../lib/comparisonStorage';
import { formatHistoricalCredits, normalizeHistoricalScores } from './ResultsDialogs';
import './strategy-page.css';
import './comparison-page.css';

const comparisonFields = [
  { id: 'region', label: '就學區' },
  { id: 'type', label: '學校類型' },
  { id: 'ownership', label: '公立／私立' },
  { id: 'group', label: '特色及群別' },
  { id: 'historicalScores', label: '歷年成績' },
  { id: 'admissionQuota', label: '招生名額' },
  { id: 'map', label: '學校地圖' },
] as const;

type ComparisonField = typeof comparisonFields[number]['id'];
type School = Record<string, any>;
type SortBy = 'added' | 'name' | 'region' | 'type' | 'quota';
const COMPARISON_FIELDS_STORAGE_KEY = 'tw-admission-analysis-comparison-fields';
const defaultVisibleFields = comparisonFields.map(({ id }) => id);

function getVisibleFields(): ComparisonField[] {
  try {
    const stored = sessionStorage.getItem(COMPARISON_FIELDS_STORAGE_KEY);
    const fields = stored ? JSON.parse(stored) : defaultVisibleFields;
    const valid = Array.isArray(fields) ? fields.filter((field): field is ComparisonField => comparisonFields.some(({ id }) => id === field)) : defaultVisibleFields;
    return valid.length ? valid : defaultVisibleFields;
  } catch {
    return defaultVisibleFields;
  }
}

function HistoricalScores({ school }: { school: School }) {
  const scores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 4);
  if (!scores.length) return <span className="text-sm text-slate-400">資料建置中</span>;
  return <div className="flex flex-wrap gap-1.5">{scores.map((item: any) => <span key={`${item.year}-${item.points}-${item.credits}`} className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-slate-700"><span className="mr-1 text-amber-800">{item.year}</span>{item.points} 分／{formatHistoricalCredits(item.credits)} 點</span>)}</div>;
}

function ComparisonValue({ field, school }: { field: ComparisonField; school: School }) {
  if (field === 'historicalScores') return <HistoricalScores school={school} />;
  if (field === 'admissionQuota') return <div className="flex flex-wrap items-center gap-2">{school.admissionQuota == null ? <span className="text-slate-400">尚未公告</span> : <strong className="font-bold text-indigo-700">{school.admissionQuota} 名</strong>}{school.admissionQuotaSourceUrl && <a href={school.admissionQuotaSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 underline underline-offset-2 hover:text-indigo-900">官方公告<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>}</div>;
  if (field === 'map') return <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-indigo-700 underline underline-offset-4 hover:text-indigo-900"><MapPin className="h-4 w-4" aria-hidden="true" />查看學校位置<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>;
  if (field === 'ownership') return <>{formatSchoolOwnership(school.ownership) || '未提供'}</>;
  if (field === 'group') return <>{school.group || '未提供'}</>;
  return <>{school[field] || '未提供'}</>;
}

function ComparisonMatrix({ schools, fields, onRemove }: { schools: School[]; fields: ComparisonField[]; onRemove: (name: string) => void }) {
  return <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_16px_50px_-35px_rgba(15,23,42,.5)] lg:block" role="region" aria-label="學校逐項比較表" tabIndex={0}>
    <table className="w-full border-separate border-spacing-0 text-left text-sm">
      <thead><tr><th scope="col" className="sticky left-0 z-20 min-w-[11rem] border-b border-r border-slate-200 bg-slate-50 p-5 align-bottom text-slate-500"><span className="text-xs font-bold tracking-widest">比較項目</span></th>{schools.map((school, index) => <th key={school.name} scope="col" className="min-w-[15rem] max-w-[19rem] border-b border-r border-slate-200 bg-white p-5 align-top last:border-r-0"><div className="flex items-start justify-between gap-2"><span className="text-xs font-bold text-indigo-600">選項 {String(index + 1).padStart(2, '0')}</span><button type="button" onClick={() => onRemove(school.name)} aria-label={`移除 ${school.name}`} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"><Trash2 className="h-4 w-4" aria-hidden="true" /></button></div><span className="mt-2 block text-lg font-black leading-snug text-slate-900">{school.name}</span></th>)}</tr></thead>
      <tbody>{fields.map((field, rowIndex) => <tr key={field}><th scope="row" className={`sticky left-0 z-10 border-b border-r border-slate-200 p-5 font-bold text-slate-600 ${rowIndex % 2 ? 'bg-white' : 'bg-slate-50'}`}>{comparisonFields.find((item) => item.id === field)?.label}</th>{schools.map((school) => <td key={school.name} className={`max-w-[19rem] border-b border-r border-slate-100 p-5 align-top leading-6 text-slate-700 last:border-r-0 ${rowIndex % 2 ? 'bg-white' : 'bg-slate-50/50'}`}><ComparisonValue field={field} school={school} /></td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function ComparisonCard({ school, index, fields, onRemove }: { school: School; index: number; fields: ComparisonField[]; onRemove: (name: string) => void }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_15px_35px_-30px_rgba(15,23,42,.5)] sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-widest text-indigo-600">選項 {String(index + 1).padStart(2, '0')}</p><h3 className="mt-2 text-xl font-black leading-snug">{school.name}</h3></div><button type="button" onClick={() => onRemove(school.name)} aria-label={`移除 ${school.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"><Trash2 className="h-4 w-4" aria-hidden="true" /></button></div><dl className="mt-5 divide-y divide-slate-100 border-t border-slate-100">{fields.map((field) => <div key={field} className="grid gap-1 py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-3"><dt className="text-xs font-bold text-slate-500">{comparisonFields.find((item) => item.id === field)?.label}</dt><dd className="min-w-0 text-sm leading-6 text-slate-700"><ComparisonValue field={field} school={school} /></dd></div>)}</dl></article>;
}

export default function ComparisonPage() {
  const [schools, setSchools] = useState<School[]>(getComparisonSchools);
  const [visibleFields, setVisibleFields] = useState<ComparisonField[]>(getVisibleFields);
  const [isFieldSettingsOpen, setIsFieldSettingsOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortBy>('added');

  const removeSchool = (name: string) => setSchools((current) => {
    const next = current.filter((school) => school.name !== name);
    saveComparisonSchools(next);
    return next;
  });
  const clearSchools = () => { saveComparisonSchools([]); setSchools([]); setIsClearConfirmOpen(false); };
  const updateVisibleFields = (nextFields: ComparisonField[]) => {
    setVisibleFields(nextFields);
    sessionStorage.setItem(COMPARISON_FIELDS_STORAGE_KEY, JSON.stringify(nextFields));
  };
  const toggleVisibleField = (field: ComparisonField) => {
    if (visibleFields.includes(field)) {
      if (visibleFields.length === 1) return;
      updateVisibleFields(visibleFields.filter((item) => item !== field));
    } else updateVisibleFields([...visibleFields, field]);
  };
  const filterOptions = useMemo(() => ({
    types: Array.from(new Set(schools.map((school) => school.type).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant')),
    ownerships: Array.from(new Set(schools.map((school) => formatSchoolOwnership(school.ownership)).filter(Boolean))).sort((a, b) => String(a).localeCompare(String(b), 'zh-Hant')),
  }), [schools]);
  const filteredSchools = useMemo(() => schools
    .map((school, index) => ({ school, index }))
    .filter(({ school }) => {
      const text = `${school.name || ''} ${school.region || ''} ${school.type || ''} ${school.group || ''}`.toLowerCase();
      return (!searchTerm.trim() || text.includes(searchTerm.trim().toLowerCase()))
        && (typeFilter === 'all' || school.type === typeFilter)
        && (ownershipFilter === 'all' || formatSchoolOwnership(school.ownership) === ownershipFilter);
    })
    .sort((left, right) => {
      if (sortBy === 'name') return String(left.school.name || '').localeCompare(String(right.school.name || ''), 'zh-Hant');
      if (sortBy === 'region') return String(left.school.region || '').localeCompare(String(right.school.region || ''), 'zh-Hant');
      if (sortBy === 'type') return String(left.school.type || '').localeCompare(String(right.school.type || ''), 'zh-Hant');
      if (sortBy === 'quota') return (Number(right.school.admissionQuota) || -1) - (Number(left.school.admissionQuota) || -1);
      return left.index - right.index;
    })
    .map(({ school }) => school), [schools, searchTerm, typeFilter, ownershipFilter, sortBy]);
  const hasFilters = Boolean(searchTerm || typeFilter !== 'all' || ownershipFilter !== 'all' || sortBy !== 'added');
  const clearFilters = () => { setSearchTerm(''); setTypeFilter('all'); setOwnershipFilter('all'); setSortBy('added'); };
  const exportComparison = async () => {
    const { exportComparisonExcel } = await import('../lib/exportUtils');
    await exportComparisonExcel({ schools: filteredSchools, visibleFields });
  };
  const printCurrentComparison = async () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('無法開啟列印視窗，請檢查是否被瀏覽器阻擋。'); return; }
    const { printComparison } = await import('../lib/exportUtils');
    printComparison({ schools: filteredSchools, visibleFields }, printWindow);
  };

  return <div className="strategy-page comparison-page"><main>
    <section className="strategy-hero">
      <div className="strategy-shell">
        <a href={withBasePath('/results')} className="strategy-back"><ArrowLeft size={16} />回到分析結果</a>
        <div className="strategy-hero-grid">
          <div>
            <p className="strategy-kicker"><Layers3 size={17} />升學選擇工具</p>
            <h1>分析結果比較</h1>
            <p className="strategy-lead">把有興趣的校科放在一起，對照地區、類型、歷年成績與招生名額，找出值得深入了解的選擇。</p>
            <div className="strategy-hero-actions">
              <a href={schools.length ? '#compare-list' : withBasePath('/results')} className="strategy-primary">{schools.length ? '開始比較' : '前往分析結果'}<ArrowRight size={17} /></a>
              {schools.length > 0 && <a href={withBasePath('/results')} className="strategy-secondary">繼續加入學校</a>}
            </div>
          </div>
          <aside className="strategy-hero-note" aria-label="比較清單摘要">
            <span className="strategy-note-icon"><Layers3 size={23} /></span>
            <p>目前的比較清單</p>
            <h2>已加入 {schools.length} 所校科</h2>
            <span>{schools.length ? `可選擇要顯示的 ${visibleFields.length} 個比較項目，再用搜尋與排序聚焦想看的選項。` : '從分析結果加入想比較的校科，再回到這裡逐項查看差異。'}</span>
          </aside>
        </div>
      </div>
    </section>
    <div className="comparison-layout strategy-shell">
      <div className="strategy-content">

    {!schools.length ? <section id="compare-empty" className="strategy-section comparison-empty"><div className="comparison-empty-icon"><Layers3 className="h-7 w-7" aria-hidden="true" /></div><div className="strategy-heading"><p>先建立清單</p><h2>還沒有加入比較的校科</h2><span>到分析結果選擇想比較的學校，點選「加入比較」，就能在這裡逐項查看差異。</span></div><a href={withBasePath('/results')} className="strategy-primary"><Plus className="h-4 w-4" aria-hidden="true" />前往分析結果<ArrowRight className="h-4 w-4" aria-hidden="true" /></a></section> : <>
      <section id="compare-list" aria-label="比較清單操作" className="strategy-section comparison-panel"><div className="flex flex-wrap items-center justify-between gap-4"><div className="strategy-heading"><p>先整理候選選項</p><h2>你的比較清單</h2><span>選擇要顯示的項目，再逐欄比較候選校科。</span></div><div className="flex flex-wrap gap-2"><a href={withBasePath('/results')} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"><Plus className="h-4 w-4" aria-hidden="true" />新增學校</a><button type="button" onClick={() => setIsFieldSettingsOpen((open) => !open)} aria-expanded={isFieldSettingsOpen} aria-controls="comparison-field-settings" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />顯示項目</button><button type="button" onClick={() => setIsClearConfirmOpen((open) => !open)} aria-expanded={isClearConfirmOpen} aria-controls="comparison-clear-confirm" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"><Trash2 className="h-4 w-4" aria-hidden="true" />清空清單</button></div></div>
        {isFieldSettingsOpen && <div id="comparison-field-settings" className="mt-5 border-t border-slate-100 pt-5"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold">選擇要比較的項目 <span className="font-normal text-slate-500">（至少保留一項）</span></p><button type="button" onClick={() => updateVisibleFields(defaultVisibleFields)} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline"><RotateCcw className="h-4 w-4" aria-hidden="true" />全部顯示</button></div><div className="mt-3 flex flex-wrap gap-2">{comparisonFields.map((field) => <label key={field.id} className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${visibleFields.includes(field.id) ? 'border-indigo-200 bg-indigo-50 text-indigo-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}><input type="checkbox" checked={visibleFields.includes(field.id)} onChange={() => toggleVisibleField(field.id)} className="h-4 w-4 accent-indigo-600" />{field.label}</label>)}</div></div>}
        {isClearConfirmOpen && <div id="comparison-clear-confirm" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-rose-50 p-4 text-sm"><p className="font-semibold text-rose-900">確定要移除全部 {schools.length} 所學校？</p><div className="flex gap-2"><button type="button" onClick={() => setIsClearConfirmOpen(false)} className="rounded-lg border border-rose-200 bg-white px-3 py-2 font-semibold text-slate-700">取消</button><button type="button" onClick={clearSchools} className="rounded-lg bg-rose-700 px-3 py-2 font-bold text-white hover:bg-rose-800"><Check className="mr-1 inline h-4 w-4" aria-hidden="true" />確認清空</button></div></div>}
      </section>

      <section id="compare-filters" aria-label="搜尋、篩選與排序比較清單" className="strategy-section comparison-panel"><div className="strategy-heading"><p>聚焦想看的學校</p><h2>搜尋與篩選</h2><span>依校名、類型或就學區縮小清單，再調整排列順序。</span></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1fr)_10rem_9rem_11rem]"><label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600"><Search className="h-3.5 w-3.5" aria-hidden="true" />搜尋學校</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="校名、群別或就學區" className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">學校類型</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"><option value="all">全部類型</option>{filterOptions.types.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">公私立</span><select value={ownershipFilter} onChange={(event) => setOwnershipFilter(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"><option value="all">全部</option>{filterOptions.ownerships.map((ownership) => <option key={ownership} value={ownership}>{ownership}</option>)}</select></label><label className="block"><span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600"><ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />排序</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortBy)} className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"><option value="added">加入順序</option><option value="name">校名</option><option value="region">就學區</option><option value="type">學校類型</option><option value="quota">招生名額</option></select></label></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><div className="flex items-center gap-3"><p aria-live="polite" className="text-sm text-slate-600">顯示 <strong className="text-indigo-700">{filteredSchools.length}</strong>／{schools.length} 所</p>{hasFilters && <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline"><X className="h-4 w-4" aria-hidden="true" />清除條件</button>}</div><div className="flex flex-wrap gap-2"><button type="button" onClick={exportComparison} disabled={!filteredSchools.length} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><Download className="h-4 w-4" aria-hidden="true" />匯出 Excel</button><button type="button" onClick={printCurrentComparison} disabled={!filteredSchools.length} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><Printer className="h-4 w-4" aria-hidden="true" />列印比較表</button></div></div></section>

      {filteredSchools.length ? <section id="compare-results" aria-labelledby="comparison-results-title" className="strategy-section"><div className="mb-4 flex flex-wrap items-end justify-between gap-2"><div><p className="text-xs font-bold tracking-widest text-indigo-600">逐項比較</p><h2 id="comparison-results-title" className="mt-1 text-2xl font-black">看清每個選項的差異</h2></div><p className="hidden text-sm text-slate-500 lg:block">比較項目固定在左側，可橫向查看所有學校。</p></div><ComparisonMatrix schools={filteredSchools} fields={visibleFields} onRemove={removeSchool} /><div className="grid gap-4 lg:hidden">{filteredSchools.map((school, index) => <ComparisonCard key={school.name} school={school} index={index} fields={visibleFields} onRemove={removeSchool} />)}</div></section> : <section id="compare-results" className="strategy-section comparison-empty"><Search className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" /><h2 className="mt-3 text-xl font-black">找不到符合條件的學校</h2><p className="mt-2 text-sm text-slate-600">可以換個關鍵字，或清除篩選條件再查看。</p><button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">清除條件</button></section>}
      <section id="compare-notes" className="strategy-section comparison-note"><Info className="h-5 w-5 shrink-0" aria-hidden="true" /><div><h2>資料判讀提醒</h2><p>歷年成績與招生名額僅供比較，實際招生條件、名額與錄取結果請以當年度官方公告為準。</p></div></section>
    </>}
      </div>
    </div>
  </main><Footer /></div>;
}
