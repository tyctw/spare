import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  Award,
  Building2,
  Calculator,
  Check,
  ClipboardList,
  Database,
  Download,
  ExternalLink,
  FileText,
  Filter,
  FilterX,
  Flame,
  History,
  Layers,
  LayoutGrid,
  Lightbulb,
  List,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Table2,
  X,
} from 'lucide-react';
import ExportModal from './ExportModal';
import Footer from './layout/Footer';
import { ALL_REGIONS } from './RegionModal';
import { withBasePath } from '../lib/routes';
import { getComparisonSchools, saveComparisonSchools } from '../lib/comparisonStorage';
import { formatSchoolOwnership, getSchoolOwnershipKey } from '../lib/schoolDisplay';
import { getCreditsGap, getPointsGap } from '../lib/admissionComparison';
import './results-page.css';
import {
  AdmissionAnalysisDialog,
  EmphasizedAnalysisText,
  formatHistoricalCredits,
  getAnalysisAccent,
  getHistoricalTrend,
  HistoricalScoresDialog,
  historicalScoresPendingText,
  normalizeHistoricalScores,
  regionTone,
  scoreItems,
  SchoolDetailDialog,
  zoneMeta,
} from './ResultsDialogs';

const RESULTS_STORAGE_KEY = 'tw-admission-analysis-results';

export default function ResultsPage() {
  const stored = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(RESULTS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const [filterText, setFilterText] = useState('');
  const [filterZone, setFilterZone] = useState('all');
  const [filterOwnership, setFilterOwnership] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [schoolView, setSchoolView] = useState<'cards' | 'table'>('cards');
  const [comparisonSchools, setComparisonSchools] = useState<any[]>(getComparisonSchools);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [historicalScoreSchool, setHistoricalScoreSchool] = useState<any | null>(null);
  const [analysisSchool, setAnalysisSchool] = useState<any | null>(null);
  const [detailSchool, setDetailSchool] = useState<any | null>(null);

  React.useEffect(() => {
    if (!stored?.results) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stored]);

  if (!stored?.results) {
    return (
      <main className="results-empty-page min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
          <div className="results-empty-icon mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-slate-900 bg-amber-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black">尚未產生分析結果</h1>
          <p className="mt-3 text-sm font-bold leading-relaxed text-slate-600">
            請先回到落點分析首頁完成成績與條件設定，系統產生結果後會自動進入這個獨立報告頁。
          </p>
          <a
            href={withBasePath('/')}
            className="results-empty-back mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
          >
            <ArrowLeft className="h-4 w-4" />
            回到落點分析
          </a>
        </div>
      </main>
    );
  }

  const { scores, results } = stored;
  const vocationalGroups = Array.isArray(stored.vocationalGroups) ? stored.vocationalGroups : [];
  const eligibleSchools = Array.isArray(results.eligibleSchools) ? results.eligibleSchools : [];
  const zoneCounts = {
    reach: Number(results.analysisReport?.zoneCounts?.reach) || 0,
    target: Number(results.analysisReport?.zoneCounts?.target) || 0,
    safe: Number(results.analysisReport?.zoneCounts?.safe) || 0,
  };
  const zoneTotal = zoneCounts.reach + zoneCounts.target + zoneCounts.safe;
  const regionName = ALL_REGIONS.find((region) => region.id === scores?.region)?.name || scores?.region || '未選擇';
  const schoolTypeLabel = scores?.schoolType === 'all' ? '全部類型' : scores?.schoolType || '全部類型';
  const ownershipLabel =
    scores?.schoolOwnership === 'all' ? '公私立皆可' : scores?.schoolOwnership === 'public' ? '公立' : '私立';
  const isAllVocationalGroups = vocationalGroups.length === 1 && vocationalGroups[0] === 'all';

  const filteredSchools = eligibleSchools
    .filter((school: any) => {
      const matchText =
        !filterText ||
        school.name?.includes(filterText) ||
        school.type?.includes(filterText) ||
        school.group?.includes(filterText);
      const matchZone = filterZone === 'all' || school.zone === filterZone;
      const matchOwnership = filterOwnership === 'all' || getSchoolOwnershipKey(school.ownership) === filterOwnership;
      const matchType =
        filterType === 'all' ||
        (filterType === 'general' && school.type === '普通科') ||
        (filterType === 'vocational' && school.type !== '普通科');
      return matchText && matchZone && matchOwnership && matchType;
    })
    .sort((a: any, b: any) => {
      const zoneOrder: Record<string, number> = { reach: 0, target: 1, safe: 2 };
      return (
        (zoneOrder[a.zone] ?? 99) - (zoneOrder[b.zone] ?? 99) ||
        (a.zone === 'reach' && b.zone === 'reach'
          ? getPointsGap(b) - getPointsGap(a) || getCreditsGap(b) - getCreditsGap(a)
          : getPointsGap(a) - getPointsGap(b)) ||
        (b.points ?? 0) - (a.points ?? 0)
      );
    });

  const hasActiveFilters = filterText !== '' || filterZone !== 'all' || filterOwnership !== 'all' || filterType !== 'all';

  const clearFilters = () => {
    setFilterText('');
    setFilterZone('all');
    setFilterOwnership('all');
    setFilterType('all');
  };

  const toggleComparison = (school: any) => {
    setComparisonSchools((prev) => {
      const exists = prev.find((item) => item.name === school.name);
      if (exists) {
        const next = prev.filter((item) => item.name !== school.name);
        saveComparisonSchools(next);
        return next;
      }
      const next = [...prev, { ...school, region: regionName }];
      saveComparisonSchools(next);
      return next;
    });
  };

  const handleExport = async (type: 'txt' | 'excel' | 'json' | 'print') => {
    const payload = { scores, results, identity: scores?.identity, vocationalGroups };
    const { exportExcel, exportJson, exportTxt, printResults } = await import('../lib/exportUtils');
    switch (type) {
      case 'txt':
        exportTxt(payload, regionName);
        break;
      case 'excel':
        await exportExcel(payload, regionName);
        break;
      case 'json':
        exportJson(payload);
        break;
      case 'print':
        printResults(payload, regionName);
        break;
    }
  };

  return (
    <div className="results-page min-h-screen bg-slate-50 text-slate-900">
      <main className="results-main mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="results-toolbar mb-6 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <a href={withBasePath('/')} className="results-back inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-950 hover:shadow-[5px_5px_0_#0f172a] active:translate-y-0 active:shadow-none">
              <ArrowLeft className="h-4 w-4" />
              回到落點分析
            </a>
          </div>
          <button type="button" onClick={() => setIsExportOpen(true)} className="results-export inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-100 px-4 py-2.5 text-sm font-black text-emerald-800 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-emerald-200 hover:shadow-[5px_5px_0_#0f172a] active:translate-y-0 active:shadow-none"><Download className="h-4 w-4" />匯出結果</button>
          <div className="results-tools fixed bottom-5 right-5 z-40">
            <button type="button" onClick={() => setIsToolsOpen((open) => !open)} aria-expanded={isToolsOpen} aria-controls="results-tools-menu" aria-label={comparisonSchools.length ? `開啟更多工具，目前有 ${comparisonSchools.length} 所加入比較清單` : '開啟更多工具'} title="更多工具" className="results-tools-trigger relative grid h-12 w-12 place-items-center rounded-2xl border-2 border-slate-900 bg-amber-300 text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-200 active:translate-y-0"><Layers className="h-5 w-5" />{comparisonSchools.length > 0 && <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-slate-900 bg-rose-500 px-1 text-[10px] font-black text-white">{comparisonSchools.length > 99 ? '99+' : comparisonSchools.length}</span>}</button>
            {isToolsOpen && <div id="results-tools-menu" className="results-tools-menu absolute bottom-full right-0 mb-3 w-60 rounded-2xl border-2 border-slate-900 bg-white p-2.5"><div className="grid grid-cols-3 gap-2">
              <a href={withBasePath('/compare')} className="relative flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-violet-200 bg-violet-50 p-2 text-center text-[11px] font-black leading-4 text-violet-900 transition hover:-translate-y-0.5 hover:bg-violet-100"><List className="h-5 w-5 text-violet-700" />比較清單{comparisonSchools.length > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">{comparisonSchools.length > 99 ? '99+' : comparisonSchools.length}</span>}</a>
              <button type="button" onClick={() => { setIsToolsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-amber-200 bg-amber-50 p-2 text-center text-[11px] font-black leading-4 text-amber-900 transition hover:-translate-y-0.5 hover:bg-amber-100"><ArrowUp className="h-5 w-5 text-amber-700" />回到上方</button>
              <button type="button" onClick={() => { setIsToolsOpen(false); setIsExportOpen(true); }} className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-center text-[11px] font-black leading-4 text-emerald-900 transition hover:-translate-y-0.5 hover:bg-emerald-100"><Download className="h-5 w-5 text-emerald-700" />匯出結果</button>
              <a href={withBasePath('/strategy')} className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-orange-200 bg-orange-50 p-2 text-center text-[11px] font-black leading-4 text-orange-900 transition hover:-translate-y-0.5 hover:bg-orange-100"><Target className="h-5 w-5 text-orange-700" />選填攻略</a>
              <a href={withBasePath('/school-types')} className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-sky-200 bg-sky-50 p-2 text-center text-[11px] font-black leading-4 text-sky-900 transition hover:-translate-y-0.5 hover:bg-sky-100"><Building2 className="h-5 w-5 text-sky-700" />學校類型</a>
              <a href={withBasePath('/mock-volunteer')} className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border border-rose-200 bg-rose-50 p-2 text-center text-[11px] font-black leading-4 text-rose-900 transition hover:-translate-y-0.5 hover:bg-rose-100"><ClipboardList className="h-5 w-5 text-rose-700" />模擬選填</a>
            </div></div>}
          </div>
        </div>

        <section className="results-hero overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="results-hero-copy bg-slate-900 p-6 text-white sm:p-8 lg:p-10">
              <div className="results-hero-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black">
                <Sparkles className="h-4 w-4 text-amber-300" />
                智能落點分析
              </div>
              <h1 className="results-hero-title text-3xl font-black leading-tight sm:text-5xl">分析結果報告</h1>
              <p className="results-hero-description mt-4 max-w-2xl text-base font-bold leading-relaxed text-slate-200">
                {results.analysisReport?.analysisSummary || '系統已完成本次落點分析，請依下方摘要與學校清單進行檢視。'}
              </p>
            </div>

            <div className="results-hero-stats bg-amber-50 p-6 sm:p-8 lg:p-10">
              <div className="results-summary-heading">本次分析摘要</div>
              <div className="results-summary-overview">
                <div>
                  <span>分析區域</span>
                  <strong>{regionName}</strong>
                </div>
                <div>
                  <span>推薦學校</span>
                  <strong>{eligibleSchools.length}<small>所</small></strong>
                </div>
              </div>
              <div className="results-stat-grid results-score-stat-grid grid grid-cols-2 gap-3">
                <div className="results-stat results-stat-points rounded-2xl border-2 border-slate-900 bg-indigo-600 p-5 text-white">
                  <div className="results-score-stat-label"><Calculator aria-hidden="true" className="h-5 w-5" /><span>總積分</span></div>
                  <div className="mt-1 text-4xl font-black">{results.totalPoints ?? '無'}</div>
                </div>
                <div className="results-stat results-stat-credits rounded-2xl border-2 border-slate-900 bg-white p-5">
                  <div className="results-score-stat-label"><Award aria-hidden="true" className="h-5 w-5" /><span>總積點</span></div>
                  <div className="mt-1 text-4xl font-black">{results.totalCredits ?? '無'}</div>
                </div>
              </div>
              <div className="results-zone-section">
                <div className="results-zone-section-heading"><span>落點區間分布</span><span>共 {zoneTotal} 所</span></div>
                {zoneTotal > 0 && (
                  <div className="results-zone-bar" role="img" aria-label={`夢幻區 ${zoneCounts.reach} 所，實際區 ${zoneCounts.target} 所，保守區 ${zoneCounts.safe} 所`}>
                    {(['reach', 'target', 'safe'] as const).map((zone) => <span key={zone} data-zone={zone} style={{ width: `${(zoneCounts[zone] / zoneTotal) * 100}%` }} />)}
                  </div>
                )}
                <div className="results-zone-grid grid grid-cols-3 gap-2 sm:gap-3" aria-label="落點區間數量">
                  {(['reach', 'target', 'safe'] as const).map((zone) => {
                    const meta = zoneMeta[zone];
                    return (
                      <div key={zone} data-zone={zone} className="results-zone">
                        <div className="results-zone-label"><span className="results-zone-dot" aria-hidden="true" />{meta.label}</div>
                        <div>{zoneCounts[zone]}<small>所</small></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {results.analysisReport?.suggestion && (
            <details className="results-hero-strategy" id="results-hero-strategy">
              <summary>
                <span className="results-hero-strategy-icon"><Lightbulb aria-hidden="true" className="h-5 w-5" /></span>
                <span className="results-hero-strategy-label"><small>依本次分析</small><strong>策略建議</strong></span>
                <span className="results-hero-strategy-toggle"><span className="results-hero-strategy-closed">展開閱讀</span><span className="results-hero-strategy-open">收合建議</span><ArrowUp aria-hidden="true" className="h-4 w-4" /></span>
              </summary>
              <p>{results.analysisReport.suggestion}</p>
            </details>
          )}
        </section>

        <a href={withBasePath('/score-change')} className="results-summary-score-change" aria-label="前往一級變化試算，比較成績增減一級後的志願變化">
          <span className="results-summary-score-change-icon"><Sparkles aria-hidden="true" className="h-5 w-5" /></span>
          <span className="results-summary-score-change-copy"><small>一級變化工具</small><strong>成績差一級，志願會怎麼變？</strong><span>比較新增、離開與跨落點區的校科</span></span>
          <span className="results-summary-score-change-action">立即試算 <ArrowUp aria-hidden="true" className="h-4 w-4 rotate-45" /></span>
        </a>

        <section className="results-content mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="results-sidebar space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            <div className="results-side-panel rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-500">
                <Award className="h-4 w-4" />
                本次成績
              </div>
              <div className="results-score-grid grid grid-cols-3 gap-2">
                {scoreItems.map((item) => (
                  <div key={item.key} className="results-score-cell rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="text-[11px] font-black text-slate-500">{item.label}</div>
                    <div className="mt-1 text-lg font-black text-slate-900">{scores?.[item.key] || '未填'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-side-panel rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-500">
                <Filter className="h-4 w-4" />
                本次條件
              </div>
              <div className="space-y-3 text-sm font-bold">
                <div className="flex justify-between gap-3"><span className="text-slate-500">學校屬性</span><span>{ownershipLabel}</span></div>
                <div className="flex justify-between gap-3"><span className="text-slate-500">學校類型</span><span>{schoolTypeLabel}</span></div>
                {scores?.schoolType === '職業類科' && (
                  <div className="border-t-2 border-dashed border-slate-200 pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Layers className="h-4 w-4 text-emerald-600" />
                        <span>職群篩選</span>
                      </div>
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-[11px] font-black text-indigo-800">
                        {isAllVocationalGroups ? '不限制職群' : `已選 ${vocationalGroups.length} 個`}
                      </span>
                    </div>
                    {isAllVocationalGroups ? (
                      <p className="mt-2 text-xs font-bold text-slate-600">全部職群皆納入分析。</p>
                    ) : (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {vocationalGroups.map((group: string) => (
                          <span key={group} className="inline-flex max-w-[140px] items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-800">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                            <span className="truncate">{group}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {(results.scoringMethod || results.analysisReport?.scoringExplanation) && (
              <div className="results-side-panel rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500">
                  <Layers className="h-4 w-4" />
                  計分方式
                </div>
                <p className="text-sm font-bold leading-relaxed text-slate-700">
                  {results.scoringMethod || results.analysisReport.scoringExplanation}
                </p>
              </div>
            )}
          </aside>

          <section id="recommended-schools" className="results-list-panel rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-6">
            <div className="results-list-header mb-5 space-y-4">
              <div className="results-list-heading-row">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-black">
                    <Building2 className="h-6 w-6 text-indigo-600" />
                    學校推薦清單
                  </h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">依照落點區間與條件篩選後顯示，共有 {filteredSchools.length} 所學校。</p>
                </div>
              </div>
              <div className="results-filter-panel w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    aria-label="搜尋學校、類科或群別"
                    value={filterText}
                    onChange={(event) => setFilterText(event.target.value)}
                    placeholder="搜尋學校、類科或群別"
                    className={`results-search w-full rounded-xl border-2 border-slate-200 bg-white py-2 pl-9 text-sm font-bold outline-none focus:border-slate-900 ${hasActiveFilters ? 'pr-12 sm:pr-28' : 'pr-3'}`}
                  />
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      aria-label="清除所有篩選條件"
                      title="清除篩選"
                      className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-black text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
                    >
                      <X className="h-4 w-4" />
                      <span className="hidden sm:inline">清除篩選</span>
                    </button>
                  )}
                </div>
                <div className="results-filters mt-2 grid grid-cols-2 gap-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
                <select aria-label="依落點區間篩選" value={filterZone} onChange={(event) => setFilterZone(event.target.value)} className="results-filter-select col-span-2 min-w-0 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900 xl:col-span-1">
                  <option value="all">全部區間</option>
                  <option value="reach">夢幻區</option>
                  <option value="target">實際區</option>
                  <option value="safe">保守區</option>
                </select>
                <select aria-label="依學校屬性篩選" value={filterOwnership} onChange={(event) => setFilterOwnership(event.target.value)} className="results-filter-select min-w-0 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900">
                  <option value="all">公/私立不拘</option>
                  <option value="public">公立</option>
                  <option value="private">私立</option>
                </select>
                <select aria-label="依學校類型篩選" value={filterType} onChange={(event) => setFilterType(event.target.value)} className="results-filter-select min-w-0 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900">
                  <option value="all">全部類型</option>
                  <option value="general">普通科</option>
                  <option value="vocational">職業類科</option>
                </select>
                <div className="results-view-toggle col-span-2 grid w-full grid-cols-2 gap-1 rounded-xl border-2 border-slate-200 bg-white p-1 xl:col-span-1" role="group" aria-label="推薦清單顯示方式">
                  <button
                    type="button"
                    onClick={() => setSchoolView('cards')}
                    aria-pressed={schoolView === 'cards'}
                    aria-label="切換為卡片顯示"
                    title="卡片顯示"
                    className={`results-view-button inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-black transition-colors ${schoolView === 'cards' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-transparent bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>卡片</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchoolView('table')}
                    aria-pressed={schoolView === 'table'}
                    aria-label="切換為表格顯示"
                    title="表格顯示"
                    className={`results-view-button inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-black transition-colors ${schoolView === 'table' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-transparent bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <Table2 className="h-4 w-4" />
                    <span>表格</span>
                  </button>
                </div>
                </div>
              </div>
            </div>

            <p className="sr-only" role="status" aria-live="polite">
              目前共有 {filteredSchools.length} 所符合篩選條件的學校。
            </p>
            {filteredSchools.length === 0 ? (
              <div className="results-empty-filter rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center font-black text-slate-500">
                <p>目前篩選條件下沒有符合的學校。</p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="results-clear mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-rose-300 bg-rose-50 px-5 py-3 text-sm font-black text-rose-700 shadow-[3px_3px_0px_0px_rgba(251,113,133,0.45)] transition-all hover:-translate-y-0.5 hover:bg-rose-100 hover:shadow-[5px_5px_0px_0px_rgba(251,113,133,0.45)] active:translate-y-0 active:shadow-none"
                  >
                    <FilterX className="h-4 w-4" strokeWidth={3} />
                    清除篩選
                  </button>
                )}
              </div>
            ) : schoolView === 'cards' ? (
              <div className="results-cards grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                {filteredSchools.map((school: any, index: number) => {
                  const meta = zoneMeta[school.zone] || zoneMeta.target;
                  const ZoneIcon = meta.icon;
                  const ownership = formatSchoolOwnership(school.ownership || 'public');
                  const historicalScores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 4);
                  const latestHistoricalScore = historicalScores[0];
                  const historicalTrend = getHistoricalTrend(historicalScores);
                  const isCompared = comparisonSchools.some((item) => item.name === school.name);
                  const schoolDistrictName = school.district || ALL_REGIONS.find((region) => region.id === (school.region || scores?.region))?.name || school.region || regionName;
                  const groupLabel = school.group || school.type || '普通科';
                  const schoolMapQuery = school.name;
                  const analysisAccent = getAnalysisAccent(school.zone);

                  return (
                    <article key={`${school.name}-${index}`} data-compared={isCompared} className={`results-school-card relative p-5 rounded-2xl border-2 transition-all group overflow-hidden flex flex-col gap-4 h-full ${isCompared ? 'bg-indigo-50 border-indigo-500 shadow-[4px_4px_0px_0px_rgba(99,102,241,1)]' : 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]'}`}>
                      <div className={`absolute -right-2 -bottom-4 text-8xl font-black opacity-[0.03] select-none pointer-events-none transition-opacity group-hover:opacity-10 ${index < 3 ? 'text-amber-600' : 'text-slate-900'}`}>{index + 1}</div>
                      <div className="results-school-heading">
                        <div className="results-school-heading-top">
                          <div className={`results-school-rank w-12 h-12 shrink-0 rounded-2xl border-2 border-slate-900 flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${index < 3 ? 'bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>
                            {index + 1}
                          </div>
                          {school.zone && (
                            <span data-zone={school.zone} className="results-school-zone-badge">
                              <ZoneIcon aria-hidden="true" className="h-3.5 w-3.5" />
                              {meta.label}
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-xl text-slate-900 leading-tight">{school.name}</h4>
                      </div>
                      <div className="results-school-meta text-sm font-bold text-slate-600">
                        <div className="results-school-meta-tags">
                          <span>{ownership}</span>
                          <a href={withBasePath(`/vocational-encyclopedia?group=${encodeURIComponent(groupLabel)}`)} className="results-school-group-tag" aria-label={`查看${groupLabel}介紹`} title={`查看${groupLabel}介紹`}><Layers aria-hidden="true" className="h-3.5 w-3.5" /><span>{groupLabel}</span><ExternalLink aria-hidden="true" className="h-3 w-3" /></a>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolMapQuery)}`} target="_blank" rel="noreferrer" aria-label={`在地圖搜尋學校 ${school.name}`} title={`在地圖搜尋 ${school.name}`} className="results-school-district-tag"><MapPin aria-hidden="true" className="h-3.5 w-3.5" /><span>{schoolDistrictName}</span><ExternalLink aria-hidden="true" className="h-3 w-3" /></a>
                        </div>
                      </div>

                      <div
                        data-zone={school.zone}
                        className="results-analysis-preview w-full text-left"
                      >
                        <div className="results-analysis-heading"><span className="results-analysis-icon"><Lightbulb aria-hidden="true" className="h-4 w-4" /></span><span>落點判讀</span></div>
                        <p className="results-analysis-excerpt">
                          <EmphasizedAnalysisText text={school.analysisNote || '目前未提供落點判讀。'} tone={analysisAccent.split(' ')[1]} />
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setHistoricalScoreSchool(school)}
                        className={`results-history-preview rounded-2xl border-2 border-slate-900 px-3.5 py-3.5 text-left shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all ${historicalScores.length > 0 ? 'bg-amber-50' : 'bg-slate-50'}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-white flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] shrink-0">
                              {historicalScores.length > 0 ? (
                                <History className="w-4 h-4 text-amber-700" />
                              ) : (
                                <Database className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-black text-slate-900">歷年錄取成績</div>
                              <div className="text-[11px] font-bold text-slate-600 truncate">
                                {historicalScores.length > 0 ? (
                                  <>
                                    最新 {latestHistoricalScore?.year || '--'} 積分 {latestHistoricalScore?.points ?? '--'}
                                    {` / 積點 ${formatHistoricalCredits(latestHistoricalScore?.credits)}`}
                                  </>
                                ) : (
                                  historicalScoresPendingText
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {historicalScores.length > 0 ? (
                              <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-black ${historicalTrend.tone}`}>
                                {historicalTrend.label}
                              </span>
                            ) : (
                              <span className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">
                                資料整理中
                              </span>
                            )}
                            <span className="text-[10px] font-black text-amber-700">查看詳情</span>
                          </div>
                        </div>
                      </button>

                      <div className="results-school-actions flex gap-2.5">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleComparison(school);
                          }}
                          aria-pressed={isCompared}
                          aria-label={`${isCompared ? '從比較清單移除' : '加入比較清單'}：${school.name}`}
                          className={`results-compare-action flex-1 py-2.5 px-2 rounded-xl border-2 border-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            isCompared
                              ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-indigo-500'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                          }`}
                        >
                          {isCompared ? <Check className="w-4 h-4" /> : <List className="w-4 h-4" />}
                          {isCompared ? '已加入比較' : '加入比較'}
                        </button>
                        <button type="button" onClick={() => setAnalysisSchool(school)} aria-label={`查看 ${school.name} 的完整落點分析`} className="results-analysis-action flex-1 rounded-xl px-3 py-2.5 text-sm font-black">查看完整分析 <span aria-hidden="true">→</span></button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="results-table-section space-y-3">
                <div className="results-table-hint flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800">
                  <Lightbulb className="h-4 w-4 shrink-0" />
                  點擊整列，即可查看完整資訊與歷年錄取成績。
                </div>
                <div className="results-table-wrap overflow-hidden rounded-xl border-2 border-slate-200">
                <table className="results-table w-full table-fixed border-collapse text-left">
                  <caption className="sr-only">依篩選條件顯示的學校推薦清單</caption>
                  <thead className="bg-slate-100 text-[11px] font-black text-slate-600 sm:text-xs">
                    <tr className="border-b-2 border-slate-200">
                      <th className="w-12 px-2 py-3 text-center sm:w-16 sm:px-3">排序</th>
                      <th className="px-2 py-3 sm:px-3">學校</th>
                      <th className="w-20 px-2 py-3 text-center sm:w-28 sm:px-3">落點<span className="hidden sm:inline">區間</span></th>
                      <th className="w-24 px-2 py-3 text-right sm:w-32 sm:px-3">比較</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100 bg-white">
                    {filteredSchools.map((school: any, index: number) => {
                      const isCompared = comparisonSchools.some((item) => item.name === school.name);
                      const zoneLabel = school.zone === 'reach' ? '夢幻區' : school.zone === 'safe' ? '保守區' : '實際區';
                      const zoneTone = school.zone === 'reach' ? 'border-rose-300 bg-rose-100 text-rose-800' : school.zone === 'safe' ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : 'border-sky-300 bg-sky-100 text-sky-800';

                      return (
                        <tr
                          key={`${school.name}-${index}`}
                          tabIndex={0}
                          onClick={() => setDetailSchool(school)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              setDetailSchool(school);
                            }
                          }}
                          className={`results-table-row cursor-pointer transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-indigo-600 ${isCompared ? 'bg-indigo-50' : 'bg-white hover:bg-indigo-50/60'}`}
                        >
                          <td className="px-2 py-3 text-center align-middle text-sm font-black text-slate-500 sm:px-3">{index + 1}</td>
                          <td className="p-0 align-middle">
                            <span className="block h-full w-full break-words px-2 py-3 text-left text-sm font-black leading-snug text-slate-900 underline decoration-slate-300 underline-offset-4 sm:px-3 sm:text-base">{school.name}</span>
                          </td>
                          <td className="px-2 py-3 text-center align-middle sm:px-3"><span className={`inline-flex rounded-lg border px-1.5 py-1 text-[11px] font-black sm:px-2 sm:text-xs ${zoneTone}`}>{zoneLabel}</span></td>
                          <td className="px-2 py-3 align-middle sm:px-3">
                            <div className="flex justify-end"><button type="button" onClick={(event) => { event.stopPropagation(); toggleComparison(school); }} aria-pressed={isCompared} aria-label={`${isCompared ? '從比較清單移除' : '加入比較清單'}：${school.name}`} className={`results-table-compare whitespace-nowrap rounded-lg border-2 border-slate-900 px-2 py-1.5 text-[11px] font-black sm:px-2.5 sm:text-xs ${isCompared ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>{isCompared ? '已加入比較' : '加入比較'}</button></div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </section>
        </section>

      </main>

      <Footer />

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} onExport={handleExport} />
      <AdmissionAnalysisDialog school={analysisSchool} region={scores?.region} grades={scores} onClose={() => setAnalysisSchool(null)} />
      <SchoolDetailDialog
        school={detailSchool}
        regionName={regionName}
        onClose={() => setDetailSchool(null)}
        onHistorical={(school) => {
          setHistoricalScoreSchool(school);
        }}
        onAnalysis={(school) => {
          setAnalysisSchool(school);
        }}
        isCompared={comparisonSchools.some((item) => item.name === detailSchool?.name)}
        onToggleComparison={(school) => {
          toggleComparison(school);
        }}
      />
      <HistoricalScoresDialog school={historicalScoreSchool} onClose={() => setHistoricalScoreSchool(null)} />
    </div>
  );
}
