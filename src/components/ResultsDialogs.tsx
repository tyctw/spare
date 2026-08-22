import React from 'react';
import { Award, Building2, Check, Database, Flame, History, List, MapPin, ShieldCheck, Sparkles, Target, X } from 'lucide-react';
import { ALL_REGIONS } from './RegionModal';
import { formatSchoolOwnership } from '../lib/schoolDisplay';
import { useModalHistory } from '../hooks/useModalHistory';
import { getAdmissionComparison } from '../lib/admissionComparison';

export const normalizeHistoricalScores = (scores: any[] = []) =>
  scores
    .filter((item) => item && item.points !== null && item.points !== undefined)
    .map((item) => ({
      ...item,
      year: String(item.year || '年份'),
      numericYear: Number.parseInt(String(item.year || '').replace(/\D/g, ''), 10),
      numericPoints: Number(item.points),
    }))
    .sort((a, b) => (Number.isFinite(b.numericYear) ? b.numericYear : 0) - (Number.isFinite(a.numericYear) ? a.numericYear : 0));

export const historicalScoresPendingText = '資料整理中';

export const formatHistoricalCredits = (credits: any) =>
  credits !== null && credits !== undefined && credits !== '' ? credits : '無';

export const getHistoricalTrend = (scores: any[]) => {
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

export const zoneMeta: Record<string, { label: string; icon: React.ElementType; tone: string; badge: string }> = {
  reach: { label: '夢幻區', icon: Flame, tone: 'text-rose-700 bg-rose-50 border-rose-200', badge: 'bg-rose-500' },
  target: { label: '實際區', icon: Target, tone: 'text-sky-700 bg-sky-50 border-sky-200', badge: 'bg-sky-500' },
  safe: { label: '保守區', icon: ShieldCheck, tone: 'text-emerald-700 bg-emerald-50 border-emerald-200', badge: 'bg-emerald-500' },
};

export const regionTone = 'border-violet-300 bg-violet-100 text-violet-800';

export const scoreItems = [
  { key: 'chinese', label: '國文' },
  { key: 'english', label: '英文' },
  { key: 'math', label: '數學' },
  { key: 'science', label: '自然' },
  { key: 'social', label: '社會' },
  { key: 'composition', label: '作文' },
];

type ScoreRange = { min: number; max: number };

// These ranges mirror the scoring maps used by the analysis backend.  They are
// deliberately fixed per admission region, so a small difference between a
// student and a school reference cannot make the ruler look disproportionately
// large.
const OFFICIAL_SCORE_RANGES: Record<string, { points: ScoreRange; credits?: ScoreRange }> = {
  taoyuan: { points: { min: 10, max: 33 }, credits: { min: 5, max: 35 } },
  taipei: { points: { min: 5, max: 36 } },
  central: { points: { min: 10, max: 30 }, credits: { min: 15, max: 111 } },
  changhua: { points: { min: 15, max: 45 } },
  tainan: { points: { min: 5, max: 36 } },
  kaohsiung: { points: { min: 10, max: 30 }, credits: { min: 5, max: 35 } },
  hsinchu: { points: { min: 10, max: 30 }, credits: { min: 5, max: 35 } },
  chiayi: { points: { min: 5, max: 27 }, credits: { min: 5, max: 45 } },
};

const getOfficialScoreRange = (region: string | undefined, kind: 'points' | 'credits'): ScoreRange | null =>
  OFFICIAL_SCORE_RANGES[region || '']?.[kind] || null;

export function AutoFitSingleLine({ text }: { text: string }) {
  const textRef = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    const element = textRef.current;
    const container = element?.parentElement;
    if (!element || !container) return;

    const fitText = () => {
      // 群別最長會到六個中文字；先按字數給出易讀的基準字級，
      // 再針對較窄的卡片欄位微調，確保內容不會換行或被裁切。
      const characterCount = Array.from(text).length;
      const baseSize = characterCount >= 6 ? 11 : characterCount === 5 ? 12 : 14;
      const minSize = characterCount >= 6 ? 9.5 : 10;
      element.style.fontSize = `${baseSize}px`;
      const availableWidth = container.clientWidth;
      const requiredWidth = element.scrollWidth;
      const size = requiredWidth > availableWidth
        ? Math.max(minSize, Math.floor((baseSize * availableWidth / requiredWidth) * 10) / 10)
        : baseSize;
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

export function HistoricalScoresDialog({ school, onClose }: { school: any | null; onClose: () => void }) {
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

function ThresholdRuler({ label, studentValue, referenceValue, comparison, unit, range }: {
  label: string;
  studentValue: number | null;
  referenceValue: number | null;
  comparison: string;
  unit: string;
  range: ScoreRange | null;
}) {
  const hasValues = studentValue !== null && referenceValue !== null && Number.isFinite(studentValue) && Number.isFinite(referenceValue);
  const difference = hasValues ? studentValue - referenceValue : 0;
  const lower = range?.min ?? 0;
  const upper = range?.max ?? 1;
  const span = upper - lower || 1;
  const position = (value: number) => `${Math.min(100, Math.max(0, ((value - lower) / span) * 100))}%`;
  const overlap = hasValues && Math.abs(difference) < 0.001;

  return (
    <div className="rounded-2xl bg-[#fbf2ed] px-4 py-4 sm:px-5">
      <div className="flex items-center justify-between gap-3"><h4 className="text-base font-black text-slate-800">{label}</h4>{hasValues && <span className="shrink-0 rounded-xl bg-[#d94708] px-3 py-1.5 text-xs font-black text-white">參考門檻 {referenceValue}{unit}</span>}</div>
      {hasValues ? (
        <>
          <div className="relative mt-4 h-7">
            <div className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 rounded-full bg-[#e9e3e5]" />
            <div className="absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-full bg-[#bea3e8]" style={{ width: position(studentValue) }} />
            <span className="absolute top-1/2 h-7 -translate-x-1/2 -translate-y-1/2 border-l-[3px] border-dashed border-[#d94708]" style={{ left: position(referenceValue) }} aria-label="參考門檻" />
            <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#172d81] shadow-[0_1px_3px_rgba(23,45,129,0.35)]" style={{ left: position(studentValue) }} aria-label={overlap ? '成績與參考門檻相同' : '你的成績'} />
          </div>
          <div className={`mt-2 flex items-center gap-3 text-sm font-bold text-slate-600 ${overlap ? 'justify-start' : 'justify-between'}`}><span>參考門檻 <strong className="text-slate-900">{referenceValue}{unit}</strong></span>{!overlap && <span className="text-[#172d81]">你的成績 <strong>{studentValue}{unit}</strong></span>}</div>
          <p className="mt-2 text-xs font-bold text-slate-600">{comparison}</p>
        </>
      ) : <p className="mt-3 text-sm font-bold text-slate-500">尚無足夠資料繪製比較圖。</p>}
    </div>
  );
}

const SUBJECT_REFERENCE_ITEMS = [
  { key: 'chinese', label: '國文' },
  { key: 'english', label: '英文' },
  { key: 'math', label: '數學' },
  { key: 'science', label: '自然' },
  { key: 'social', label: '社會' },
];

const GRADE_VALUES: Record<string, number> = { 'A++': 9, 'A+': 8, A: 7, 'B++': 6, 'B+': 5, B: 4, C: 3 };
const GRADE_LABELS: Record<number, string> = { 9: 'A++', 8: 'A+', 7: 'A', 6: 'B++', 5: 'B+', 4: 'B', 3: 'C' };

function SubjectReferenceTable({ school, grades }: { school: any; grades?: Record<string, any> }) {
  const { creditsDifference, shouldCompareSubjects } = getAdmissionComparison(school);

  if (!shouldCompareSubjects) {
    return <p className="mt-2 text-sm font-bold leading-7 text-amber-950">總積分{creditsDifference !== null ? '與積點' : ''}尚未相同，不須比較單科成績。</p>;
  }

  const rows = SUBJECT_REFERENCE_ITEMS.map((item) => {
    const reference = Number(school.minRequirements?.[item.key]);
    const studentGrade = String(grades?.[item.key] || '');
    const student = GRADE_VALUES[studentGrade];
    const hasReference = Number.isFinite(reference) && reference > 0;
    const hasStudent = Number.isFinite(student);
    const isMet = hasReference && hasStudent ? student >= reference : null;
    const position = (value: number) => `${Math.min(94, Math.max(6, ((value - 3) / 6) * 88 + 6))}%`;

    return { ...item, reference, studentGrade, student, hasReference, hasStudent, isMet, position };
  });
  const availableRows = rows.filter((row) => row.hasReference);

  if (availableRows.length === 0) {
    return <p className="mt-2 text-sm font-bold leading-7 text-amber-950">此校系目前未提供各科歷年參考資料。</p>;
  }

  return (
    <div className="mt-3 overflow-hidden rounded-xl border-2 border-amber-200 bg-white">
      <table className="w-full table-fixed text-left text-xs sm:text-sm">
        <thead className="bg-amber-100 text-amber-950">
          <tr>
            <th className="w-[16%] border-r-2 border-amber-200 px-2 py-2.5 font-black sm:px-3">科目</th>
            <th className="w-[20%] whitespace-nowrap border-r-2 border-amber-200 px-1 py-2.5 text-[11px] font-black sm:px-3 sm:text-sm">你的成績</th>
            <th className="w-[48%] border-r-2 border-amber-200 px-2 py-2.5 font-black sm:px-3">歷年參考對照</th>
            <th className="w-[16%] px-1 py-2.5 text-left text-[10px] font-black sm:px-3 sm:text-xs">判讀</th>
          </tr>
        </thead>
        <tbody>
          {availableRows.map((row) => (
            <tr key={row.key} className="border-t-2 border-amber-200">
              <td className="border-r-2 border-amber-200 px-2 py-3 font-black text-slate-800 sm:px-3">{row.label}</td>
              <td className="border-r-2 border-amber-200 px-2 py-3 font-black text-slate-800 sm:px-3">{row.studentGrade || '—'}</td>
              <td className="border-r-2 border-amber-200 px-2 py-3 sm:px-3">
                <div className="relative h-4">
                  <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-100" />
                  <div className="absolute left-[6%] right-[6%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-violet-200" />
                  <span className="absolute top-1/2 h-5 -translate-x-1/2 -translate-y-1/2 border-l-[3px] border-violet-600" style={{ left: row.position(row.reference) }} aria-label={`歷年參考 ${GRADE_LABELS[row.reference] || row.reference}`} />
                  {row.hasStudent && <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-indigo-800 shadow-[0_1px_3px_rgba(30,27,75,0.45)]" style={{ left: row.position(row.student) }} aria-label={`你的成績 ${row.studentGrade}`} />}
                </div>
                <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-500"><span>C</span><span>參考 {GRADE_LABELS[row.reference] || row.reference}</span><span>A++</span></div>
              </td>
              <td className={`px-2 py-3 text-left font-black sm:px-3 ${row.isMet === false ? 'text-rose-600' : 'text-emerald-700'}`}>{row.isMet === false ? '未達標' : row.isMet ? '達標' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-amber-100 px-3 py-2 text-[10px] font-bold text-slate-500"><span><i className="mr-1 inline-block h-3 border-l-[3px] border-violet-600 align-middle" />歷年參考</span><span><i className="mr-1 inline-block h-3 w-3 rounded-full border-2 border-white bg-indigo-800 align-middle" />你的成績</span></div>
    </div>
  );
}

export function AdmissionAnalysisDialog({ school, region, grades, onClose }: { school: any | null; region?: string; grades?: Record<string, any>; onClose: () => void }) {
  const isOpen = !!school;
  const handleClose = useModalHistory('AdmissionAnalysis', isOpen, onClose);

  if (!isOpen) return null;

  const zone = zoneMeta[school.zone] || zoneMeta.target;
  const ZoneIcon = zone.icon;
  const { pointsDifference: scoreDiff, creditsDifference: creditDiff, shouldCompareSubjects } = getAdmissionComparison(school);
  const referencePoints = Number(school.points);
  const studentPoints = scoreDiff !== null && Number.isFinite(referencePoints)
    ? Math.round((referencePoints + scoreDiff) * 10) / 10
    : null;
  const referenceCredits = school.credits === null || school.credits === undefined ? null : Number(school.credits);
  const studentCredits = creditDiff !== null && referenceCredits !== null && Number.isFinite(referenceCredits)
    ? Math.round((referenceCredits + creditDiff) * 10) / 10
    : null;
  const unmetSubjects = Array.isArray(school.unmetRequirements) ? school.unmetRequirements : [];
  const pointsRange = getOfficialScoreRange(region || school.region, 'points');
  const creditsRange = getOfficialScoreRange(region || school.region, 'credits');

  const scoreComparison = scoreDiff === null
    ? '目前缺少積分差資料。'
    : scoreDiff > 0
      ? `高於參考門檻 ${scoreDiff} 分`
      : scoreDiff < 0
        ? `低於參考門檻 ${Math.abs(scoreDiff)} 分`
        : '與參考門檻相同';
  const creditComparison = creditDiff === null
    ? '未提供積點參考資料'
    : creditDiff > 0
      ? `高於參考值 ${creditDiff} 點`
      : creditDiff < 0
      ? `低於參考值 ${Math.abs(creditDiff)} 點`
        : '與參考值相同';
  const scoreGapLabel = scoreDiff === null ? '—' : scoreDiff === 0 ? '相同' : `${scoreDiff > 0 ? '+' : ''}${scoreDiff} 分`;
  const creditGapLabel = creditDiff === null ? '不適用' : creditDiff === 0 ? '相同' : `${creditDiff > 0 ? '+' : ''}${creditDiff} 點`;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="關閉完整落點判讀" onClick={handleClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="admission-analysis-title" className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b-4 border-slate-900 bg-teal-700 p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-teal-200/70 bg-white/10 text-white">
              <Sparkles className="h-5 w-5" strokeWidth={3} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black tracking-[0.12em] text-teal-100">完整落點判讀</div>
              <h2 id="admission-analysis-title" className="mt-1 break-words text-2xl font-black leading-tight text-white sm:text-3xl">{school.name}</h2>
            </div>
          </div>
          <button type="button" onClick={handleClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-4 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" aria-label="關閉"><X className="h-5 w-5" /></button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          <section className={`rounded-2xl border-2 p-4 ${zone.tone}`}>
            <div className="flex items-center gap-2"><ZoneIcon className="h-5 w-5" strokeWidth={3} /><span className="text-sm font-black">{zone.label}</span></div>
            <p className="mt-2 text-base font-black leading-7 text-slate-900">{school.analysisNote || '目前未提供額外判讀。'}</p>
          </section>

          <section className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-900">差距摘要</h3>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl border-2 border-indigo-200 bg-white px-2.5 py-3 sm:px-3">
                <div className="text-[10px] font-black text-slate-500">積分差</div>
                <div className={`mt-1 text-sm font-black sm:text-base ${scoreDiff < 0 ? 'text-rose-600' : scoreDiff > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>{scoreGapLabel}</div>
              </div>
              <div className="rounded-xl border-2 border-emerald-200 bg-white px-2.5 py-3 sm:px-3">
                <div className="text-[10px] font-black text-slate-500">積點差</div>
                <div className={`mt-1 text-sm font-black sm:text-base ${creditDiff !== null && creditDiff < 0 ? 'text-rose-600' : creditDiff !== null && creditDiff > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>{creditGapLabel}</div>
              </div>
              <div className="rounded-xl border-2 border-amber-200 bg-white px-2.5 py-3 sm:px-3">
                <div className="text-[10px] font-black text-slate-500">單科比較</div>
                <div className={`mt-1 text-sm font-black sm:text-base ${shouldCompareSubjects ? 'text-amber-700' : 'text-slate-700'}`}>{shouldCompareSubjects ? '需要比較' : '不須比較'}</div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border-2 border-slate-200 bg-white p-4">
            <h3 className="text-base font-black text-slate-900">成績與參考門檻</h3>
            <div className="mt-3 space-y-3">
              <ThresholdRuler label="總積分" studentValue={studentPoints} referenceValue={Number.isFinite(referencePoints) ? referencePoints : null} comparison={scoreComparison} unit="分" range={pointsRange} />
              <ThresholdRuler label="積點／同分比序" studentValue={studentCredits} referenceValue={referenceCredits} comparison={creditComparison} unit="點" range={creditsRange} />
            </div>
          </section>

          <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
            <h3 className="text-base font-black text-amber-950">科目歷年參考</h3>
            <SubjectReferenceTable school={school} grades={grades} />
            {unmetSubjects.length > 0 && <p className="mt-3 text-xs font-bold leading-6 text-amber-950">{unmetSubjects.join('、')}低於本校系的歷年錄取參考；這不是填寫資格限制，但同分競爭時的風險較高。</p>}
          </section>

          <section className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-900">判讀提醒</h3>
            <ul className="mt-2 space-y-2 text-sm font-bold leading-6 text-slate-700">
              <li>• {creditDiff === 0 && scoreDiff === 0 ? '總積分與積點皆相同時，仍須依當年度超額比序、作文與志願分布判斷。' : '本結果為落點推估；招生名額、志願分布與當年度規則都可能使結果變動。'}</li>
              <li>• 正式選填前，請以當年度招生簡章與個別序位區間為準。</li>
            </ul>
          </section>

        </div>
      </section>
    </div>
  );
}

export function EmphasizedAnalysisText({ text, tone }: { text: string; tone: string }) {
  return <>{text.split(/(\d+(?:\.\d+)?\s*[分點])/g).map((part, index) => /\d+(?:\.\d+)?\s*[分點]/.test(part) ? <span key={index} className={`mx-0.5 text-lg font-black ${tone}`}>{part}</span> : part)}</>;
}

export const getAnalysisAccent = (zone: string | undefined) =>
  zone === 'reach' ? 'border-l-rose-500 text-rose-700' : zone === 'safe' ? 'border-l-emerald-500 text-emerald-700' : 'border-l-sky-500 text-sky-700';

export function SchoolDetailDialog({ school, regionName, onClose, onHistorical, onAnalysis, isCompared, onToggleComparison }: {
  school: any | null;
  regionName: string;
  onClose: () => void;
  onHistorical: (school: any) => void;
  onAnalysis: (school: any) => void;
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
  const analysisAccent = getAnalysisAccent(school.zone);
  const historicalScores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 4);
  const latestHistoricalScore = historicalScores[0];
  const historicalTrend = getHistoricalTrend(historicalScores);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" aria-label="關閉完整落點判讀" onClick={handleClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="school-detail-title" className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b-4 border-slate-900 bg-indigo-100 p-5 shadow-[0_3px_0_rgba(15,23,42,0.14)] sm:p-6">
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
          <button
            type="button"
            onClick={() => onAnalysis(school)}
            aria-label={`查看 ${school.name} 的完整落點判讀`}
            className={`group w-full rounded-2xl border-2 border-slate-200 border-l-[6px] bg-white px-4 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-[0_8px_20px_rgba(15,23,42,0.10)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:translate-y-0 sm:px-5 ${analysisAccent.split(' ')[0]}`}
          >
            <div className="text-sm font-black text-slate-500">
              落點判讀
            </div>
            <p className="mt-1 text-base font-black leading-6 text-slate-950">
              <EmphasizedAnalysisText text={school.analysisNote || '目前未提供額外判讀。'} tone={analysisAccent.split(' ')[1]} />
            </p>
            <div className="mt-1 flex justify-end border-t border-slate-100 pt-1">
              <span className="flex items-center text-sm font-black text-slate-600 transition-colors group-hover:text-slate-950">查看完整判讀 <span className="ml-2 text-lg leading-none">→</span></span>
            </div>
          </button>

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
