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
import ComparisonModal from './ComparisonModal';
import Footer from './layout/Footer';
import { ALL_REGIONS } from './RegionModal';
import { exportExcel, exportJson, exportTxt, printResults } from '../lib/exportUtils';
import { withBasePath } from '../lib/routes';
import { formatSchoolOwnership, getSchoolOwnershipKey } from '../lib/schoolDisplay';
import { useModalHistory } from '../hooks/useModalHistory';

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
  if (diff > 0) return { label: `較前一年積分 +${diff}`, tone: 'border-rose-200 bg-rose-50 text-rose-700' };
  if (diff < 0) return { label: `較前一年積分 ${diff}`, tone: 'border-emerald-200 bg-emerald-50 text-emerald-700' };

  const latestCredits = Number(latest.credits);
  const previousCredits = Number(previous.credits);
  if (!Number.isFinite(latestCredits) || !Number.isFinite(previousCredits)) {
    return { label: '積分與前一年相同', tone: 'border-slate-200 bg-slate-100 text-slate-600' };
  }

  const creditDiff = Math.round((latestCredits - previousCredits) * 10) / 10;
  if (creditDiff > 0) return { label: `較前一年積點 +${creditDiff}`, tone: 'border-rose-200 bg-rose-50 text-rose-700' };
  if (creditDiff < 0) return { label: `較前一年積點 ${creditDiff}`, tone: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
  return { label: '較前一年不變', tone: 'border-sky-200 bg-sky-50 text-sky-700' };
};

/** 判斷是否有歷年資料可計算趨勢（至少兩年）。 */
const hasTrendData = (scores: any[]) =>
  scores.length >= 2 &&
  Number.isFinite(scores[0]?.numericPoints) &&
  Number.isFinite(scores[1]?.numericPoints);

const zoneMeta: Record<string, { label: string; icon: React.ElementType; tone: string; badge: string }> = {
  reach: { label: '夢幻區', icon: Flame, tone: 'text-rose-700 bg-rose-50 border-rose-200', badge: 'bg-rose-500' },
  target: { label: '實際區', icon: Target, tone: 'text-sky-700 bg-sky-50 border-sky-200', badge: 'bg-sky-500' },
  safe: { label: '保守區', icon: ShieldCheck, tone: 'text-emerald-700 bg-emerald-50 border-emerald-200', badge: 'bg-emerald-500' },
};

const regionTone = 'border-violet-300 bg-violet-100 text-violet-800';

const scoreItems = [
  { key: 'chinese', label: '國文' },
  { key: 'english', label: '英文' },
  { key: 'math', label: '數學' },
  { key: 'science', label: '自然' },
  { key: 'social', label: '社會' },
  { key: 'composition', label: '作文' },
];

const getPointsGap = (school: any) => Math.abs(school.scoreDiff ?? school.pointsDiff ?? school.distanceScore ?? 0);
const getCreditsGap = (school: any) => Math.abs(school.creditDiff ?? school.creditsDiff ?? 0);

function AutoFitSingleLine({ text }: { text: string }) {
  const textRef = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    const element = textRef.current;
    const container = element?.parentElement;
    if (!element || !container) return;

    const fitText = () => {
      element.style.fontSize = '14px';
      const availableWidth = container.clientWidth;
      const requiredWidth = element.scrollWidth;
      const size = requiredWidth > availableWidth
        ? Math.max(5, Math.floor((14 * availableWidth / requiredWidth) * 10) / 10)
        : 14;
      element.style.fontSize = `${size}px`;
    };

    fitText();
    const observer = new ResizeObserver(fitText);
    observer.observe(container);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div className="w-full overflow-hidden text-center leading-tight">
      <span ref={textRef} className="inline-block whitespace-nowrap font-black tracking-tight">{text}</span>
    </div>
  );
}

function HistoricalScoresDialog({ school, onClose }: { school: any | null; onClose: () => void }) {
  const isOpen = !!school;
  const handleClose = useModalHistory('HistoricalScores', isOpen, onClose);

  if (!isOpen) return null;

  const scores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 6);
  const latest = scores[0];

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-label="關閉歷年錄取成績"
        onClick={handleClose}
      />
      <section role="dialog" aria-modal="true" aria-labelledby="historical-scores-title" className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <header className="flex items-start justify-between gap-4 border-b-4 border-slate-900 bg-amber-300 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-3 border-slate-900 bg-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:h-12 sm:w-12">
              <History className="h-6 w-6 text-amber-700" strokeWidth={3} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-amber-900">歷年錄取資料</div>
              <h2 id="historical-scores-title" className="mt-1 break-words text-xl font-black leading-tight text-slate-900 sm:text-2xl">{school.name}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
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

              <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-5">
                <div className="border-b-2 border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-100">
                      <History className="h-5 w-5 text-amber-700" strokeWidth={3} />
                    </div>
                    <div>
                      <div className="font-black text-slate-900">歷年分數趨勢</div>
                      <p className="mt-0.5 text-[11px] font-bold text-slate-500">由新到舊排列，數字旁顯示與前一年差異</p>
                    </div>
                  </div>
                </div>

                <div className="relative mt-5 space-y-4 before:absolute before:bottom-5 before:left-[22px] before:top-5 before:w-0.5 before:bg-slate-200">
                  {scores.map((item: any, index: number) => {
                    const point = Number(item.points);
                    const previousPoint = Number(scores[index + 1]?.points);
                    const hasPrevious = Number.isFinite(point) && Number.isFinite(previousPoint);
                    const credit = Number(item.credits);
                    const previousCredit = Number(scores[index + 1]?.credits);
                    const hasCreditsComparison = Number.isFinite(credit) && Number.isFinite(previousCredit);
                    const pointDifference = hasPrevious ? Math.round((point - previousPoint) * 10) / 10 : null;
                    const creditDifference = hasCreditsComparison ? Math.round((credit - previousCredit) * 10) / 10 : null;
                    const isLatest = index === 0;
                    const formatDifference = (difference: number | null) => {
                      if (difference === null) return '—';
                      if (difference === 0) return '持平';
                      return `${difference > 0 ? '↑ +' : '↓ '}${difference}`;
                    };
                    const differenceTone = (difference: number | null) =>
                      difference === null || difference === 0
                        ? 'text-slate-500'
                        : difference > 0
                          ? 'text-rose-600'
                          : 'text-emerald-600';
                    const historicalTone = index % 3 === 1
                      ? { card: 'border-sky-200 bg-sky-50', dot: 'bg-sky-400', value: 'bg-white/85' }
                      : index % 3 === 2
                        ? { card: 'border-violet-200 bg-violet-50', dot: 'bg-violet-400', value: 'bg-white/85' }
                        : { card: 'border-emerald-200 bg-emerald-50', dot: 'bg-emerald-400', value: 'bg-white/85' };

                    return (
                      <div key={`${item.year}-${item.points}-${item.credits ?? 'none'}-${item.note ?? ''}`} className="relative flex gap-3">
                        <div className="relative z-10 flex w-11 shrink-0 flex-col items-center pt-3">
                          <span className={`h-4 w-4 rounded-full border-[3px] border-white ${isLatest ? 'bg-amber-500 ring-2 ring-amber-300' : historicalTone.dot}`} />
                        </div>
                        <div className={`min-w-0 flex-1 rounded-xl border-2 p-3.5 ${isLatest ? 'border-amber-400 bg-amber-50' : historicalTone.card}`}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-black text-slate-900">{item.year}</span>
                              {isLatest && <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black text-amber-950">最新</span>}
                            </div>
                            {hasPrevious && <span className="text-[10px] font-bold text-slate-400">與前一年比較</span>}
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className={`rounded-lg px-3 py-2.5 ${isLatest ? 'bg-white/80' : historicalTone.value}`}>
                              <div className="text-[11px] font-black text-slate-500">積分</div>
                              <div className="mt-1 flex items-end justify-between gap-2">
                                <span className="text-2xl font-black leading-none text-slate-900">{item.points ?? '--'}</span>
                                <span className={`text-xs font-black ${differenceTone(pointDifference)}`}>{formatDifference(pointDifference)}</span>
                              </div>
                            </div>
                            <div className={`rounded-lg px-3 py-2.5 ${isLatest ? 'bg-white/80' : historicalTone.value}`}>
                              <div className="text-[11px] font-black text-slate-500">積點</div>
                              <div className="mt-1 flex items-end justify-between gap-2">
                                <span className="text-2xl font-black leading-none text-slate-900">{formatHistoricalCredits(item.credits)}</span>
                                <span className={`text-xs font-black ${differenceTone(creditDifference)}`}>{formatDifference(creditDifference)}</span>
                              </div>
                            </div>
                          </div>
                          {item.note && <p className="mt-3 border-t border-dashed border-slate-200 pt-2.5 text-xs font-bold leading-relaxed text-slate-600"><span className="mr-1 font-black text-slate-800">備註：</span>{item.note}</p>}
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

function AdmissionAnalysisDialog({ school, onClose }: { school: any | null; onClose: () => void }) {
  const isOpen = !!school;
  const handleClose = useModalHistory('AdmissionAnalysis', isOpen, onClose);

  if (!isOpen) return null;

  const zone = zoneMeta[school.zone] || zoneMeta.target;
  const ZoneIcon = zone.icon;
  const scoreDiff = Number(school.scoreDiff ?? school.pointsDiff);
  const referencePoints = Number(school.points);
  const studentPoints = Number.isFinite(scoreDiff) && Number.isFinite(referencePoints)
    ? Math.round((referencePoints + scoreDiff) * 10) / 10
    : null;
  const creditDiff = school.creditDiff === null || school.creditDiff === undefined ? null : Number(school.creditDiff);
  const referenceCredits = school.credits === null || school.credits === undefined ? null : Number(school.credits);
  const studentCredits = creditDiff !== null && Number.isFinite(creditDiff) && referenceCredits !== null && Number.isFinite(referenceCredits)
    ? Math.round((referenceCredits + creditDiff) * 10) / 10
    : null;
  const unmetSubjects = Array.isArray(school.unmetRequirements) ? school.unmetRequirements : [];
  const historicalScores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 5);
  const latestHistoricalScore = historicalScores[0];

  const scoreComparison = !Number.isFinite(scoreDiff)
    ? '目前缺少積分差資料。'
    : scoreDiff > 0
      ? `高於參考門檻 ${scoreDiff} 分`
      : scoreDiff < 0
        ? `低於參考門檻 ${Math.abs(scoreDiff)} 分`
        : '與參考門檻相同';
  const creditComparison = creditDiff === null || !Number.isFinite(creditDiff)
    ? '未提供積點參考資料'
    : creditDiff > 0
      ? `高於參考值 ${creditDiff} 點`
      : creditDiff < 0
        ? `低於參考值 ${Math.abs(creditDiff)} 點`
        : '與參考值相同';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="關閉完整落點判讀" onClick={handleClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="admission-analysis-title" className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <header className="flex items-start justify-between gap-4 border-b-4 border-slate-900 bg-indigo-100 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <Sparkles className="h-5 w-5 text-indigo-700" strokeWidth={3} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-indigo-900">學校完整資訊</div>
              <h2 id="admission-analysis-title" className="mt-1 break-words text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{school.name}</h2>
            </div>
          </div>
          <button type="button" onClick={handleClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" aria-label="關閉"><X className="h-5 w-5" /></button>
        </header>

        <div className="space-y-5 p-5 sm:p-6">
          <section className={`rounded-2xl border-2 p-4 ${zone.tone}`}>
            <div className="flex items-center gap-2"><ZoneIcon className="h-5 w-5" strokeWidth={3} /><span className="text-sm font-black">{zone.label}</span></div>
            <p className="mt-2 text-base font-black leading-7 text-slate-900">{school.analysisNote || '目前未提供額外判讀。'}</p>
          </section>

          <section className="rounded-2xl border-2 border-slate-200 bg-white p-4">
            <h3 className="text-base font-black text-slate-900">成績與參考門檻</h3>
            <div className="mt-3 overflow-hidden rounded-xl border-2 border-slate-200">
              <table className="w-full table-fixed border-collapse text-center text-sm">
                <thead className="bg-slate-50 text-xs font-black text-slate-500"><tr><th className="w-1/3 border-r-2 border-slate-200 px-2 py-2.5">項目</th><th className="w-1/3 border-r-2 border-slate-200 px-2 py-2.5">你的成績</th><th className="w-1/3 px-2 py-2.5">與參考值比較</th></tr></thead>
                <tbody className="font-bold text-slate-800">
                  <tr className="border-t-2 border-slate-200"><td className="border-r-2 border-slate-200 px-2 py-3 font-black">總積分</td><td className="border-r-2 border-slate-200 px-2 py-3">{studentPoints ?? '--'} <span className="text-xs text-slate-500">（參考 {Number.isFinite(referencePoints) ? referencePoints : '--'}）</span></td><td className="px-2 py-3">{scoreComparison}</td></tr>
                  <tr className="border-t-2 border-slate-200"><td className="border-r-2 border-slate-200 px-2 py-3 font-black">積點／同分比序</td><td className="border-r-2 border-slate-200 px-2 py-3">{studentCredits ?? '--'} <span className="text-xs text-slate-500">（參考 {referenceCredits ?? '--'}）</span></td><td className="px-2 py-3">{creditComparison}</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
            <h3 className="text-base font-black text-amber-950">科目歷年參考</h3>
            {unmetSubjects.length > 0 ? <p className="mt-2 text-sm font-bold leading-7 text-amber-950">{unmetSubjects.join('、')}低於本校系的歷年錄取參考。這不是填寫資格限制，但代表同分競爭時的風險較高，已納入夢幻區判讀。</p> : <p className="mt-2 text-sm font-bold leading-7 text-amber-950">目前各科表現未低於系統設定的歷年錄取參考；實際結果仍會受超額比序與志願分布影響。</p>}
          </section>

          <section className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-900">歷年資料與判讀提醒</h3>
            <ul className="mt-2 space-y-2 text-sm font-bold leading-6 text-slate-700">
              <li>• 可供參考 {historicalScores.length} 年歷年資料{latestHistoricalScore ? `；最新為 ${latestHistoricalScore.year} 年，積分 ${latestHistoricalScore.points}${latestHistoricalScore.credits !== null && latestHistoricalScore.credits !== undefined ? `／積點 ${latestHistoricalScore.credits}` : ''}。` : '，目前尚無可顯示的歷年成績。'}</li>
              <li>• {creditDiff === 0 && scoreDiff === 0 ? '總積分與積點皆相同時，仍須依當年度超額比序、作文與志願分布判斷。' : '本結果為歷年資料的落點推估；招生名額、志願分布與當年度規則都可能使結果變動。'}</li>
              <li>• 正式選填前，請以當年度招生簡章與個別序位區間為準。</li>
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
}

function SchoolDetailDialog({ school, regionName, onClose, onHistorical, isCompared, onToggleComparison }: {
  school: any | null;
  regionName: string;
  onClose: () => void;
  onHistorical: (school: any) => void;
  isCompared: boolean;
  onToggleComparison: (school: any) => void;
}) {
  const isOpen = !!school;
  const handleClose = useModalHistory('SchoolDetail', isOpen, onClose);

  if (!isOpen) return null;

  const ownership = formatSchoolOwnership(school.ownership || 'public');
  const schoolDistrictName = school.district || ALL_REGIONS.find((region) => region.id === school.region)?.name || school.region || regionName;
  const zoneLabel = school.zone === 'reach' ? '夢幻區' : school.zone === 'safe' ? '保守區' : '實際區';
  const zoneTone = school.zone === 'reach' ? 'border-rose-300 bg-rose-100 text-rose-800' : school.zone === 'safe' ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : 'border-sky-300 bg-sky-100 text-sky-800';
  const historicalScores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 4);
  const latestHistoricalScore = historicalScores[0];
  const historicalTrend = getHistoricalTrend(historicalScores);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="關閉完整落點判讀" onClick={handleClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="school-detail-title" className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <header className="flex items-start justify-between gap-4 border-b-4 border-slate-900 bg-indigo-100 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <Building2 className="h-5 w-5 text-indigo-700" strokeWidth={3} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-indigo-900">學校完整資訊</div>
              <h2 id="school-detail-title" className="mt-1 break-words text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{school.name}</h2>
            </div>
          </div>
          <button type="button" onClick={handleClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" aria-label="關閉"><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="overflow-hidden rounded-xl border-2 border-slate-200">
            <table className="w-full table-fixed border-collapse text-center">
              <thead className="bg-slate-50 text-[11px] font-black text-slate-500 sm:text-xs">
                <tr className="border-b-2 border-slate-200">
                  <th className="border-r-2 border-slate-200 py-2.5 px-2 w-1/4">落點區間</th>
                  <th className="border-r-2 border-slate-200 py-2.5 px-2 w-1/4">屬性</th>
                  <th className="border-r-2 border-slate-200 py-2.5 px-2 w-1/4">群別</th>
                  <th className="py-2.5 px-2 w-1/4">地區</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className={`border-r-2 border-slate-200 py-3 px-2 sm:px-3 ${zoneTone}`}>
                    <AutoFitSingleLine text={zoneLabel} />
                  </td>
                  <td className="border-r-2 border-slate-200 py-3 px-2 sm:px-3 text-slate-700">
                    <AutoFitSingleLine text={ownership} />
                  </td>
                  <td className="border-r-2 border-slate-200 py-3 px-2 sm:px-3 text-slate-700">
                    <AutoFitSingleLine text={school.group || school.type || '普通科'} />
                  </td>
                  <td className="py-3 px-2 sm:px-3 text-slate-700">
                    <AutoFitSingleLine text={schoolDistrictName} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4">
            <div className="flex items-center gap-1.5 text-sm font-black text-indigo-800">
              落點判讀
            </div>
            <p className="mt-2 text-sm font-bold leading-relaxed text-indigo-950">
              {school.analysisNote || '目前未提供額外判讀。'}
            </p>
          </div>

          {/* 歷年成績：與卡片相同的全寬卡片按鈕樣式 */}
          <button
            type="button"
            onClick={() => onHistorical(school)}
            className={`w-full rounded-2xl border-2 border-slate-900 px-3.5 py-3.5 text-left shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none ${historicalScores.length > 0 ? 'bg-amber-50' : 'bg-slate-50'}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                  {historicalScores.length > 0 ? (
                    <History className="h-4 w-4 text-amber-700" />
                  ) : (
                    <Database className="h-4 w-4 text-slate-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-slate-900">歷年錄取成績</div>
                  <div className="truncate text-[11px] font-bold text-slate-600">
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
              <div className="flex shrink-0 flex-col items-end gap-1">
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

          {/* 學校地圖 + 加入比較並排 */}
          <div className="grid grid-cols-2 gap-2">
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`} target="_blank" rel="noreferrer" className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl border-2 border-slate-900 bg-emerald-50 px-2 py-3 text-xs font-black text-emerald-800 transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none sm:gap-2 sm:px-3 sm:text-sm"><MapPin className="h-4 w-4 shrink-0" />學校地圖</a>
            <button
              type="button"
              onClick={() => onToggleComparison(school)}
              aria-pressed={isCompared}
              aria-label={`${isCompared ? '從比較清單移除' : '加入比較清單'}：${school.name}`}
              className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl border-2 border-slate-900 px-2 py-3 text-xs font-black transition-all sm:gap-2 sm:px-3 sm:text-sm ${
                isCompared
                  ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-indigo-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none'
              }`}
            >
              {isCompared ? <Check className="h-4 w-4 shrink-0" /> : <List className="h-4 w-4 shrink-0" />}
              {isCompared ? '已加入比較' : '加入比較'}
            </button>
          </div>
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
  const [schoolView, setSchoolView] = useState<'cards' | 'table'>('cards');
  const [comparisonSchools, setComparisonSchools] = useState<any[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
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
      if (exists) return prev.filter((item) => item.name !== school.name);
      if (prev.length >= 4) {
        alert('最多只能比較 4 所學校');
        return prev;
      }
      return [...prev, { ...school, region: regionName }];
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
            <button
              type="button"
              onClick={() => setIsComparisonOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-center text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:px-4"
            >
              <List className="h-4 w-4" />
              比較清單 ({comparisonSchools.length})
            </button>
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
                        className="group w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:translate-y-0"
                        aria-label={`查看 ${school.name} 的完整落點判讀`}
                      >
                        <div>
                          <p className="text-[15px] font-black leading-7 text-slate-900">
                            {school.analysisNote || '目前未提供落點判讀。'}
                          </p>
                          <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-3">
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
      <AdmissionAnalysisDialog school={analysisSchool} onClose={() => setAnalysisSchool(null)} />
      <SchoolDetailDialog
        school={detailSchool}
        regionName={regionName}
        onClose={() => setDetailSchool(null)}
        onHistorical={(school) => {
          setHistoricalScoreSchool(school);
        }}
        isCompared={comparisonSchools.some((item) => item.name === detailSchool?.name)}
        onToggleComparison={(school) => {
          toggleComparison(school);
        }}
      />
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
