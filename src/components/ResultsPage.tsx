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
  Flame,
  History,
  Layers,
  Library,
  Lightbulb,
  List,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import ExportModal from './ExportModal';
import ComparisonModal from './ComparisonModal';
import Footer from './layout/Footer';
import { ALL_REGIONS } from './RegionModal';
import { exportExcel, exportJson, exportTxt, printResults } from '../lib/exportUtils';
import { withBasePath } from '../lib/routes';
import { formatSchoolOwnership, getSchoolOwnershipKey } from '../lib/schoolDisplay';

const RESULTS_STORAGE_KEY = 'tw-admission-analysis-results';

const normalizeHistoricalScores = (scores: any[] = []) =>
  scores
    .filter((item) => item && item.points !== null && item.points !== undefined)
    .map((item) => ({
      ...item,
      year: String(item.year || '年份'),
      numericYear: Number.parseInt(String(item.year || '').replace(/\D/g, ''), 10),
      numericPoints: Number(item.points),
    }))
    .sort((a, b) => (Number.isFinite(b.numericYear) ? b.numericYear : 0) - (Number.isFinite(a.numericYear) ? a.numericYear : 0));

const historicalScoresPendingText = '資料整理中';

const formatHistoricalCredits = (credits: any) =>
  credits !== null && credits !== undefined && credits !== '' ? credits : '無';

const getHistoricalTrend = (scores: any[]) => {
  const [latest, previous] = scores;
  if (!latest || !previous || !Number.isFinite(latest.numericPoints) || !Number.isFinite(previous.numericPoints)) {
    return { label: '資料整理中', tone: 'border-slate-200 bg-slate-100 text-slate-500' };
  }
  const diff = Math.round((latest.numericPoints - previous.numericPoints) * 10) / 10;
  if (diff > 0) return { label: `較前一年 +${diff}`, tone: 'border-rose-200 bg-rose-50 text-rose-700' };
  if (diff < 0) return { label: `較前一年 ${diff}`, tone: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
  return { label: '與前一年相同', tone: 'border-sky-200 bg-sky-50 text-sky-700' };
};

const zoneMeta: Record<string, { label: string; icon: React.ElementType; tone: string; badge: string }> = {
  reach: { label: '夢幻區', icon: Flame, tone: 'text-rose-700 bg-rose-50 border-rose-200', badge: 'bg-rose-500' },
  target: { label: '落點區', icon: Target, tone: 'text-sky-700 bg-sky-50 border-sky-200', badge: 'bg-sky-500' },
  safe: { label: '安全區', icon: ShieldCheck, tone: 'text-emerald-700 bg-emerald-50 border-emerald-200', badge: 'bg-emerald-500' },
};

const scoreItems = [
  { key: 'chinese', label: '國文' },
  { key: 'english', label: '英文' },
  { key: 'math', label: '數學' },
  { key: 'science', label: '自然' },
  { key: 'social', label: '社會' },
  { key: 'composition', label: '作文' },
];

function HistoricalScoresDialog({ school, onClose }: { school: any | null; onClose: () => void }) {
  if (!school) return null;

  const scores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 6);
  const latest = scores[0];
  const trend = getHistoricalTrend(scores);
  const maxPoint = Math.max(...scores.map((item: any) => Number(item.points) || 0), 1);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-label="關閉歷年錄取成績"
        onClick={onClose}
      />
      <section className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <header className="flex items-start justify-between gap-4 border-b-4 border-slate-900 bg-amber-300 p-5 sm:p-6">
          <div className="min-w-0">
            <div className="text-xs font-black text-amber-900">歷年錄取資料</div>
            <h2 className="mt-1 break-words text-xl font-black leading-tight text-slate-900 sm:text-2xl">{school.name}</h2>
            <span className={`mt-3 inline-flex rounded-lg border px-2.5 py-1 text-xs font-black ${scores.length > 0 ? trend.tone : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
              {scores.length > 0 ? trend.label : historicalScoresPendingText}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:bg-slate-100 active:translate-y-0.5 active:shadow-none"
            aria-label="關閉"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto bg-slate-50 p-5 sm:p-6">
          {scores.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-white p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                <Database className="h-7 w-7 text-amber-700" />
              </div>
              <div className="text-xl font-black text-slate-900">{historicalScoresPendingText}</div>
              <p className="mt-2 text-sm font-bold text-slate-500">目前尚未提供此校科的歷年錄取分數。</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className="text-[11px] font-black text-slate-500">{latest?.year || '--'} 積分</div>
                  <div className="mt-1 text-4xl font-black leading-none text-slate-900">{latest?.points ?? '--'}</div>
                </div>
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className="text-[11px] font-black text-slate-500">{latest?.year || '--'} 積點</div>
                  <div className="mt-1 text-4xl font-black leading-none text-slate-900">{formatHistoricalCredits(latest?.credits)}</div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="font-black text-slate-900">歷年分數趨勢</div>
                  <div className="text-[11px] font-bold text-slate-500">積分 / 積點</div>
                </div>
                <div className="space-y-3">
                  {scores.map((item: any) => {
                    const width = `${Math.max(14, Math.round(((Number(item.points) || 0) / maxPoint) * 100))}%`;
                    return (
                      <div key={`${item.year}-${item.points}-${item.credits ?? 'none'}`} className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
                        <div className="text-sm font-black text-slate-500">{item.year}</div>
                        <div className="h-4 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-400" style={{ width }} />
                        </div>
                        <div className="whitespace-nowrap text-xs font-black text-slate-800 sm:text-sm">
                          {item.points ?? '--'} / {formatHistoricalCredits(item.credits)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

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
  const [comparisonSchools, setComparisonSchools] = useState<any[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [historicalScoreSchool, setHistoricalScoreSchool] = useState<any | null>(null);

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

  const { scores, results, vocationalGroups = [] } = stored;
  const regionName = ALL_REGIONS.find((region) => region.id === scores?.region)?.name || scores?.region || '未選擇';
  const schoolTypeLabel = scores?.schoolType === 'all' ? '全部類型' : scores?.schoolType || '全部類型';
  const ownershipLabel =
    scores?.schoolOwnership === 'all' ? '公私立皆可' : scores?.schoolOwnership === 'public' ? '公立' : '私立';

  const filteredSchools = (results.eligibleSchools || [])
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
        Math.abs(a.scoreDiff ?? a.pointsDiff ?? a.distanceScore ?? 0) -
          Math.abs(b.scoreDiff ?? b.pointsDiff ?? b.distanceScore ?? 0) ||
        (b.points ?? 0) - (a.points ?? 0)
      );
    });

  const toggleComparison = (school: any) => {
    setComparisonSchools((prev) => {
      const exists = prev.find((item) => item.name === school.name);
      if (exists) return prev.filter((item) => item.name !== school.name);
      if (prev.length >= 4) {
        alert('最多只能比較 4 所學校');
        return prev;
      }
      return [...prev, { ...school, region: regionName }];
    });
  };

  const handleExport = (type: 'txt' | 'excel' | 'json' | 'print') => {
    const payload = { scores, results, identity: scores?.identity, vocationalGroups };
    switch (type) {
      case 'txt':
        exportTxt(payload, regionName);
        break;
      case 'excel':
        exportExcel(payload, regionName);
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
          <div className="flex flex-wrap gap-2">
            <a
              href={withBasePath('/school-types')}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-100 px-4 py-2 text-sm font-black text-sky-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <Building2 className="h-4 w-4" />
              學校類型解析
            </a>
            <button
              type="button"
              onClick={() => setIsComparisonOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <List className="h-4 w-4" />
              比較清單 ({comparisonSchools.length})
            </button>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <Download className="h-4 w-4" />
              匯出結果
            </button>
            <a
              href={withBasePath('/strategy')}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-100 px-4 py-2 text-sm font-black text-amber-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <Target className="h-4 w-4" />
              志願選填攻略
            </a>
          </div>
        </div>

        <section className="overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-slate-900 p-6 text-white sm:p-8 lg:p-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black">
                <Sparkles className="h-4 w-4 text-amber-300" />
                AI 智能落點分析
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
              <div className="grid gap-3 sm:grid-cols-3">
                {(['reach', 'target', 'safe'] as const).map((zone) => {
                  const meta = zoneMeta[zone];
                  const Icon = meta.icon;
                  return (
                    <div key={zone} className={`rounded-2xl border-2 p-4 ${meta.tone}`}>
                      <Icon className="mb-2 h-5 w-5" />
                      <div className="text-xs font-black">{meta.label}</div>
                      <div className="text-3xl font-black">{results.analysisReport?.zoneCounts?.[zone] || 0}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
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
                {vocationalGroups.length > 0 && !(vocationalGroups.length === 1 && vocationalGroups[0] === 'all') && (
                  <div>
                    <div className="mb-2 text-slate-500">職群</div>
                    <div className="flex flex-wrap gap-1">
                      {vocationalGroups.map((group: string) => (
                        <span key={group} className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700">{group}</span>
                      ))}
                    </div>
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
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-black">
                  <Building2 className="h-6 w-6 text-indigo-600" />
                  學校推薦清單
                </h2>
                <p className="mt-1 text-sm font-bold text-slate-500">依照落點區間與條件篩選後顯示。</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={filterText}
                    onChange={(event) => setFilterText(event.target.value)}
                    placeholder="搜尋學校、類科或群別"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white py-2 pl-9 pr-3 text-sm font-bold outline-none focus:border-slate-900"
                  />
                </div>
                <select value={filterZone} onChange={(event) => setFilterZone(event.target.value)} className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900">
                  <option value="all">全部區間</option>
                  <option value="reach">夢幻區</option>
                  <option value="target">落點區</option>
                  <option value="safe">安全區</option>
                </select>
                <select value={filterOwnership} onChange={(event) => setFilterOwnership(event.target.value)} className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900">
                  <option value="all">全部屬性</option>
                  <option value="public">公立</option>
                  <option value="private">私立</option>
                </select>
                <select value={filterType} onChange={(event) => setFilterType(event.target.value)} className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-slate-900">
                  <option value="all">全部類型</option>
                  <option value="general">普通科</option>
                  <option value="vocational">職業類科</option>
                </select>
              </div>
            </div>

            {filteredSchools.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center font-black text-slate-500">
                目前篩選條件下沒有符合的學校。
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                {filteredSchools.map((school: any, index: number) => {
                  const meta = zoneMeta[school.zone] || zoneMeta.target;
                  const ZoneIcon = meta.icon;
                  const ownership = formatSchoolOwnership(school.ownership || 'public');
                  const ownershipKey = getSchoolOwnershipKey(school.ownership);
                  const ownershipColor = ownershipKey === 'private' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-sky-100 text-sky-800 border-sky-300';
                  const OwnershipIcon = ownershipKey === 'private' ? Building2 : Library;
                  const historicalScores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 4);
                  const latestHistoricalScore = historicalScores[0];
                  const historicalTrend = getHistoricalTrend(historicalScores);
                  const isCompared = comparisonSchools.some((item) => item.name === school.name);
                  const schoolDistrictName = school.district || ALL_REGIONS.find((region) => region.id === (school.region || scores?.region))?.name || school.region || regionName;

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
                              {school.zone === 'reach' ? '夢幻區' : school.zone === 'target' ? '落點區' : '安全區'}
                            </div>
                          </div>
                        )}
                        <div className={`flex min-w-0 flex-col items-center justify-center px-2.5 py-2.5 rounded-xl border-2 ${ownershipColor}`}>
                          <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">屬性</span>
                          <div className="flex min-w-0 items-center justify-center gap-1 text-center text-sm font-black leading-tight">
                            <OwnershipIcon className="w-3.5 h-3.5" /> {ownership}
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border-2 border-emerald-300 bg-emerald-100 px-2.5 py-2.5 text-emerald-800">
                          <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">群別</span>
                          <div className="text-center text-sm font-black leading-tight">
                            {school.group || school.type || '普通科'}
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-col items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-2.5 py-2.5 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                          <span className="text-[10px] font-black uppercase text-slate-500 mb-0.5 whitespace-nowrap">地區</span>
                          <div className="text-center text-sm font-black leading-tight">
                            <span className="text-slate-700">{schoolDistrictName}</span>
                          </div>
                        </div>
                      </div>


                      {school.analysisNote && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                          <div className="text-xs font-black text-slate-500">落點判讀</div>
                          <p className="mt-1 text-sm font-bold leading-relaxed text-slate-700">{school.analysisNote}</p>
                          {school.creditDiff !== null && school.creditDiff !== undefined && school.scoreDiff === 0 && (
                            <p className="mt-1 text-xs font-black text-emerald-700">
                              同分積點差 {school.creditDiff > 0 ? '+' : ''}{school.creditDiff}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-auto grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setHistoricalScoreSchool(school)}
                          className={`min-h-[4.5rem] rounded-xl border-2 border-slate-900 px-2.5 py-2.5 text-center text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none ${historicalScores.length > 0 ? 'bg-amber-50 text-amber-800' : 'bg-slate-50 text-slate-700'}`}
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            {historicalScores.length > 0 ? <History className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                            歷年成績
                          </span>
                          <span className="mt-1 block truncate text-[11px] font-bold text-slate-600">
                            {historicalScores.length > 0
                              ? `${latestHistoricalScore?.year || '--'} 積分 ${latestHistoricalScore?.points ?? '--'} / 積點 ${formatHistoricalCredits(latestHistoricalScore?.credits)}`
                              : historicalScoresPendingText}
                          </span>
                        </button>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(`${school.name} 學校介紹`)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl border-2 border-slate-900 bg-sky-50 px-2.5 py-2.5 text-center text-sm font-black text-sky-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:bg-sky-100 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            <ExternalLink className="h-4 w-4" />
                            學校介紹
                          </span>
                          <span className="mt-1 block text-[11px] font-bold text-slate-600">搜尋校網資訊</span>
                        </a>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-50 px-2.5 py-2.5 text-center text-sm font-black text-emerald-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            學校地圖
                          </span>
                          <span className="mt-1 block text-[11px] font-bold text-slate-600">查看位置</span>
                        </a>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleComparison(school);
                          }}
                          className={`flex min-h-[4.5rem] flex-col items-center justify-center rounded-xl border-2 border-slate-900 px-2.5 py-2.5 text-center text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all ${
                            isCompared
                              ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                              : 'bg-slate-100 text-slate-700 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none'
                          }`}
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            {isCompared ? <Check className="h-4 w-4" /> : <List className="h-4 w-4" />}
                            {isCompared ? '已加入比較' : '加入比較'}
                          </span>
                          <span className={`mt-1 block text-[11px] font-bold ${isCompared ? 'text-indigo-100' : 'text-slate-600'}`}>比較校科</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </main>

      <Footer />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
        aria-label="回到頁面最上方"
        title="回到頁面最上方"
      >
        <ArrowUp className="h-6 w-6" />
      </button>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} onExport={handleExport} />
      <HistoricalScoresDialog school={historicalScoreSchool} onClose={() => setHistoricalScoreSchool(null)} />
      <ComparisonModal
        schools={comparisonSchools}
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onRemove={(name) => setComparisonSchools((prev) => prev.filter((school) => school.name !== name))}
        onClear={() => setComparisonSchools([])}
      />
    </div>
  );
}
