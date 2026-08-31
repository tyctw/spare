import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  Award,
  Building2,
  Calculator,
  Check,
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
import { exportExcel, exportJson, exportTxt, printResults } from '../lib/exportUtils';
import { withBasePath } from '../lib/routes';
import { getComparisonSchools, saveComparisonSchools } from '../lib/comparisonStorage';
import { formatSchoolOwnership, getSchoolOwnershipKey } from '../lib/schoolDisplay';
import { getCreditsGap, getPointsGap } from '../lib/admissionComparison';
import {
  AdmissionAnalysisDialog,
  AutoFitSingleLine,
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
  const [historicalScoreSchool, setHistoricalScoreSchool] = useState<any | null>(null);
  const [analysisSchool, setAnalysisSchool] = useState<any | null>(null);
  const [detailSchool, setDetailSchool] = useState<any | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    if (!stored?.results) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stored]);

  React.useEffect(() => {
    const updateScrollTopVisibility = () => setShowScrollTop(window.scrollY > 320);
    updateScrollTopVisibility();
    window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollTopVisibility);
  }, []);

  if (!stored?.results) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-slate-900 bg-amber-300 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black">尚未產生分析結果</h1>
          <p className="mt-3 text-sm font-bold leading-relaxed text-slate-600">
            請先回到落點分析首頁完成成績與條件設定，系統產生結果後會自動進入這個獨立報告頁。
          </p>
          <a
            href={withBasePath('/')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 text-sm font-black text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            回到落點分析
          </a>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <a
              href={withBasePath('/compare')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-center text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:px-4"
            >
              <List className="h-4 w-4" />
              比較清單 ({comparisonSchools.length})
            </a>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-100 px-3 py-2 text-center text-sm font-black text-emerald-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:px-4"
            >
              <Download className="h-4 w-4" />
              匯出結果
            </button>
            <a
              href={withBasePath('/strategy')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-100 px-3 py-2 text-center text-sm font-black text-amber-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:px-4"
            >
              <Target className="h-4 w-4" />
              志願選填攻略
            </a>
            <a
              href={withBasePath('/school-types')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-100 px-3 py-2 text-center text-sm font-black text-sky-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:px-4"
            >
              <Building2 className="h-4 w-4" />
              學校類型解析
            </a>
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-slate-900 p-6 text-white sm:p-8 lg:p-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black">
                <Sparkles className="h-4 w-4 text-amber-300" />
                智能落點分析
              </div>
              <h1 className="text-3xl font-black leading-tight sm:text-5xl">分析結果報告</h1>
              <p className="mt-4 max-w-2xl text-base font-bold leading-relaxed text-slate-200">
                {results.analysisReport?.analysisSummary || '系統已完成本次落點分析，請依下方摘要與學校清單進行檢視。'}
              </p>
              {results.analysisReport?.suggestion && (
                <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-amber-200">
                    <Lightbulb className="h-5 w-5" />
                    策略建議
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-white">{results.analysisReport.suggestion}</p>
                </div>
              )}
            </div>

            <div className="grid content-between gap-5 bg-amber-50 p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className="text-xs font-black text-slate-500">分析區域</div>
                  <div className="mt-1 text-xl font-black">{regionName}</div>
                </div>
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className="text-xs font-black text-slate-500">推薦學校</div>
                  <div className="mt-1 text-xl font-black">{results.eligibleSchools?.length || 0} 所</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border-2 border-slate-900 bg-indigo-600 p-5 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <Calculator className="mb-3 h-6 w-6" />
                  <div className="text-xs font-black text-indigo-100">總積分</div>
                  <div className="mt-1 text-4xl font-black">{results.totalPoints || '無'}</div>
                </div>
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <Award className="mb-3 h-6 w-6 text-emerald-600" />
                  <div className="text-xs font-black text-slate-500">總積點</div>
                  <div className="mt-1 text-4xl font-black text-emerald-600">{results.totalCredits || '無'}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(['reach', 'target', 'safe'] as const).map((zone) => {
                  const meta = zoneMeta[zone];
                  const Icon = meta.icon;
                  return (
                    <div key={zone} className={`rounded-2xl border-2 p-3 sm:p-4 ${meta.tone}`}>
                      <Icon className="mb-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <div className="text-[11px] font-black sm:text-xs">{meta.label}</div>
                      <div className="text-2xl font-black sm:text-3xl">{results.analysisReport?.zoneCounts?.[zone] || 0}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-2 custom-scrollbar">
            <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="mb-4 flex items-center gap-2 text-sm font-black text-slate-500">
                <Award className="h-4 w-4" />
                本次成績
              </div>
              <div className="grid grid-cols-3 gap-2">
                {scoreItems.map((item) => (
                  <div key={item.key} className="rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="text-[11px] font-black text-slate-500">{item.label}</div>
                    <div className="mt-1 text-lg font-black text-slate-900">{scores?.[item.key] || '未填'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
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
              <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
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

          <section className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-6">
            <div className="mb-5 space-y-4">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-black">
                  <Building2 className="h-6 w-6 text-indigo-600" />
                  學校推薦清單
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">依照落點區間與條件篩選後顯示。</p>
              </div>
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    aria-label="搜尋學校、類科或群別"
                    value={filterText}
                    onChange={(event) => setFilterText(event.target.value)}
                    placeholder="搜尋學校、類科或群別"
                    className={`w-full rounded-xl border-2 border-slate-200 bg-white py-2 pl-9 text-sm font-bold outline-none focus:border-slate-900 ${hasActiveFilters ? 'pr-12 sm:pr-28' : 'pr-3'}`}
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
                <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto]">
                <select aria-label="依落點區間篩選" value={filterZone} onChange={(event) => setFilterZone(event.target.value)} className="col-span-2 min-w-0 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900 xl:col-span-1">
                  <option value="all">全部區間</option>
                  <option value="reach">夢幻區</option>
                  <option value="target">實際區</option>
                  <option value="safe">保守區</option>
                </select>
                <select aria-label="依學校屬性篩選" value={filterOwnership} onChange={(event) => setFilterOwnership(event.target.value)} className="min-w-0 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900">
                  <option value="all">公/私立不拘</option>
                  <option value="public">公立</option>
                  <option value="private">私立</option>
                </select>
                <select aria-label="依學校類型篩選" value={filterType} onChange={(event) => setFilterType(event.target.value)} className="min-w-0 rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900">
                  <option value="all">全部類型</option>
                  <option value="general">普通科</option>
                  <option value="vocational">職業類科</option>
                </select>
                <div className="col-span-2 grid w-full grid-cols-2 gap-1 rounded-xl border-2 border-slate-200 bg-white p-1 xl:col-span-1" role="group" aria-label="推薦清單顯示方式">
                  <button
                    type="button"
                    onClick={() => setSchoolView('cards')}
                    aria-pressed={schoolView === 'cards'}
                    aria-label="切換為卡片顯示"
                    title="卡片顯示"
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-black transition-colors ${schoolView === 'cards' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-transparent bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
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
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-black transition-colors ${schoolView === 'table' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-transparent bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
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
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center font-black text-slate-500">
                <p>目前篩選條件下沒有符合的學校。</p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-rose-300 bg-rose-50 px-5 py-3 text-sm font-black text-rose-700 shadow-[3px_3px_0px_0px_rgba(251,113,133,0.45)] transition-all hover:-translate-y-0.5 hover:bg-rose-100 hover:shadow-[5px_5px_0px_0px_rgba(251,113,133,0.45)] active:translate-y-0 active:shadow-none"
                  >
                    <FilterX className="h-4 w-4" strokeWidth={3} />
                    清除篩選
                  </button>
                )}
              </div>
            ) : schoolView === 'cards' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
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
                  const analysisAccent = getAnalysisAccent(school.zone);

                  return (
                    <article key={`${school.name}-${index}`} className={`relative p-5 rounded-2xl border-2 transition-all group overflow-hidden flex flex-col gap-4 h-full ${isCompared ? 'bg-indigo-50 border-indigo-500 shadow-[4px_4px_0px_0px_rgba(99,102,241,1)]' : 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]'}`}>
                      <div className={`absolute -right-2 -bottom-4 text-8xl font-black opacity-[0.03] select-none pointer-events-none transition-opacity group-hover:opacity-10 ${index < 3 ? 'text-amber-600' : 'text-slate-900'}`}>{index + 1}</div>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 shrink-0 rounded-2xl border-2 border-slate-900 flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${index < 3 ? 'bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-xl text-slate-900 leading-tight">{school.name}</h4>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-stretch gap-2">
                        {school.zone && (
                          <div className={`flex min-w-0 flex-col items-center justify-center px-2.5 py-2.5 rounded-xl border-2 ${school.zone === 'reach' ? 'bg-rose-100 text-rose-800 border-rose-300' : school.zone === 'target' ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'}`}>
                            <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">落點區間</span>
                            <div className="text-center text-sm font-black leading-tight">
                              {school.zone === 'reach' ? '夢幻區' : school.zone === 'target' ? '實際區' : '保守區'}
                            </div>
                          </div>
                        )}
                        <div className="flex min-w-0 flex-col items-center justify-center px-2.5 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700">
                          <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">屬性</span>
                          <div className="text-center text-sm font-black leading-tight">
                            {ownership}
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700">
                          <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">群別</span>
                          <AutoFitSingleLine text={groupLabel} />
                        </div>
                        <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700">
                          <span className="mb-0.5 whitespace-nowrap text-[10px] font-black uppercase opacity-70">地區</span>
                          <div className="text-center text-sm font-black leading-tight">
                            <span>{schoolDistrictName}</span>
                          </div>
                        </div>
                      </div>


                      <button
                        type="button"
                        onClick={() => setAnalysisSchool(school)}
                        className={`group w-full rounded-2xl border-2 border-slate-200 border-l-[6px] bg-white px-3.5 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:translate-y-0 ${analysisAccent.split(' ')[0]}`}
                        aria-label={`查看 ${school.name} 的完整落點判讀`}
                      >
                        <div>
                          <div className="mb-0.5 text-[11px] font-black tracking-[0.14em] text-slate-500">落點判讀</div>
                          <p className="text-sm font-black leading-6 text-slate-900">
                            <EmphasizedAnalysisText text={school.analysisNote || '目前未提供落點判讀。'} tone={analysisAccent.split(' ')[1]} />
                          </p>
                          <div className="mt-1.5 flex items-center justify-end border-t border-slate-100 pt-1.5">
                            <span className="text-xs font-black text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-slate-950">查看完整判讀 <span className="ml-1.5 text-base leading-none">→</span></span>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHistoricalScoreSchool(school)}
                        className={`rounded-2xl border-2 border-slate-900 px-3.5 py-3.5 text-left shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all ${historicalScores.length > 0 ? 'bg-amber-50' : 'bg-slate-50'}`}
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

                      <div className="flex gap-2.5">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="flex-[2] py-2.5 px-2 rounded-xl border-2 border-slate-900 font-bold text-sm flex items-center justify-center gap-1.5 transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                        >
                          <MapPin className="w-4 h-4" /> 學校地圖
                        </a>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleComparison(school);
                          }}
                          aria-pressed={isCompared}
                          aria-label={`${isCompared ? '從比較清單移除' : '加入比較清單'}：${school.name}`}
                          className={`flex-[3] py-2.5 px-2 rounded-xl border-2 border-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            isCompared
                              ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-indigo-500'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                          }`}
                        >
                          {isCompared ? <Check className="w-4 h-4" /> : <List className="w-4 h-4" />}
                          {isCompared ? '已加入比較' : '加入比較'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800">
                  <Lightbulb className="h-4 w-4 shrink-0" />
                  點擊整列，即可查看完整資訊與歷年錄取成績。
                </div>
                <div className="overflow-hidden rounded-xl border-2 border-slate-200">
                <table className="w-full table-fixed border-collapse text-left">
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
                          className={`cursor-pointer transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-indigo-600 ${isCompared ? 'bg-indigo-50' : 'bg-white hover:bg-indigo-50/60'}`}
                        >
                          <td className="px-2 py-3 text-center align-middle text-sm font-black text-slate-500 sm:px-3">{index + 1}</td>
                          <td className="p-0 align-middle">
                            <span className="block h-full w-full break-words px-2 py-3 text-left text-sm font-black leading-snug text-slate-900 underline decoration-slate-300 underline-offset-4 sm:px-3 sm:text-base">{school.name}</span>
                          </td>
                          <td className="px-2 py-3 text-center align-middle sm:px-3"><span className={`inline-flex rounded-lg border px-1.5 py-1 text-[11px] font-black sm:px-2 sm:text-xs ${zoneTone}`}>{zoneLabel}</span></td>
                          <td className="px-2 py-3 align-middle sm:px-3">
                            <div className="flex justify-end"><button type="button" onClick={(event) => { event.stopPropagation(); toggleComparison(school); }} aria-pressed={isCompared} aria-label={`${isCompared ? '從比較清單移除' : '加入比較清單'}：${school.name}`} className={`whitespace-nowrap rounded-lg border-2 border-slate-900 px-2 py-1.5 text-[11px] font-black sm:px-2.5 sm:text-xs ${isCompared ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>{isCompared ? '已加入比較' : '加入比較'}</button></div>
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

      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
          aria-label="回到頁面最上方"
          title="回到頁面最上方"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

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
