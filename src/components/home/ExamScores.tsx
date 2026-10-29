import { memo, useState, type ComponentType, type MutableRefObject } from 'react';
import { Activity, BookOpen, Calculator, ChevronRight, History, Languages, Map, PenTool, User } from 'lucide-react';
import { motion } from 'motion/react';
import { withBasePath } from '../../lib/routes';
import { REGION_SCORING_DATA } from '../RegionScoringModal';

export type ScoreKey = 'chinese' | 'english' | 'math' | 'science' | 'social' | 'composition';
export type ScoreValues = Record<ScoreKey, string>;
export type ScoreSetters = Partial<Record<ScoreKey, (value: string) => void>>;

export const emptyScores = (): ScoreValues => ({
  chinese: '',
  english: '',
  math: '',
  science: '',
  social: '',
  composition: '',
});

const gradeOptions = [
  { value: 'A++', label: 'A++ (精熟)' },
  { value: 'A+', label: 'A+ (精熟)' },
  { value: 'A', label: 'A (精熟)' },
  { value: 'B++', label: 'B++ (基礎)' },
  { value: 'B+', label: 'B+ (基礎)' },
  { value: 'B', label: 'B (基礎)' },
  { value: 'C', label: 'C (待加強)' },
];

const subjects: Array<{
  id: Exclude<ScoreKey, 'composition'>;
  label: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgBorder: string;
  theme: string;
}> = [
  { id: 'chinese', label: '國文', icon: BookOpen, color: 'text-rose-600', bgBorder: 'bg-rose-50 border-rose-300 focus:ring-rose-400 focus:border-rose-400 hover:border-rose-400', theme: 'bg-white' },
  { id: 'english', label: '英文', icon: Languages, color: 'text-amber-600', bgBorder: 'bg-amber-50 border-amber-300 focus:ring-amber-400 focus:border-amber-400 hover:border-amber-400', theme: 'bg-white' },
  { id: 'math', label: '數學', icon: Calculator, color: 'text-blue-600', bgBorder: 'bg-blue-50 border-blue-300 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400', theme: 'bg-white' },
  { id: 'science', label: '自然', icon: Activity, color: 'text-emerald-600', bgBorder: 'bg-white border-slate-300 focus:ring-slate-300 focus:border-slate-500 hover:border-slate-400', theme: 'bg-white' },
  { id: 'social', label: '社會', icon: Map, color: 'text-purple-600', bgBorder: 'bg-purple-50 border-purple-300 focus:ring-purple-400 focus:border-purple-400 hover:border-purple-400', theme: 'bg-white' },
];

function subjectPoints(region: string, grade: string) {
  const scoreData = REGION_SCORING_DATA[region];
  if (!scoreData?.examDetail) return null;
  if (['tainan', 'hsinchu'].includes(region)) {
    if (grade.startsWith('A')) return '6分';
    if (grade.startsWith('B')) return '4分';
    if (grade === 'C') return '2分';
    return null;
  }
  return scoreData.examDetail.find((detail: { level: string; score: string }) => detail.level === grade)?.score ?? null;
}

function compositionPoints(region: string, raw: string) {
  const comp = parseInt(raw, 10);
  switch (region) {
    case 'taipei':
      if (comp === 6) return '1分';
      if (comp === 5) return '0.8分';
      if (comp === 4) return '0.6分';
      if (comp === 3) return '0.4分';
      if (comp === 2) return '0.2分';
      if (comp === 1) return '0.1分';
      return '0分';
    case 'taoyuan':
      if (comp >= 4) return '3分';
      if (comp >= 2) return '2分';
      if (comp === 1) return '1分';
      return '0分';
    case 'central':
      return `${comp}點`;
    case 'kaohsiung':
      return `${comp}級分 (優先比序)`;
    case 'chiayi':
      if (comp >= 5) return '2分';
      if (comp >= 3) return '1.5分';
      if (comp >= 1) return '1分';
      return '0分';
    default:
      return '同分比序用';
  }
}

const SubjectScore = memo(function SubjectScore({
  id, label, icon: Icon, color, bgBorder, theme, region, scoresRef, settersRef,
}: {
  id: Exclude<ScoreKey, 'composition'>;
  label: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgBorder: string;
  theme: string;
  region: string;
  scoresRef: MutableRefObject<ScoreValues>;
  settersRef: MutableRefObject<ScoreSetters>;
}) {
  const [value, setValue] = useState(() => scoresRef.current[id]);
  scoresRef.current[id] = value;
  settersRef.current[id] = setValue;
  const scoreText = region && value ? subjectPoints(region, value) : null;

  return (
    <div className={`relative group ${theme} border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col gap-3`}>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <label htmlFor={`score-${id}`} className="text-base sm:text-lg font-black text-slate-700 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 bg-slate-50">
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
          </div>
          {label}
        </label>
        <div className="relative w-full max-w-[180px] sm:max-w-[200px]">
          <select
            id={`score-${id}`}
            required
            className={`w-full px-2 sm:px-4 py-2 sm:py-3 rounded-xl border-2 font-black text-sm sm:text-lg appearance-none outline-none focus:outline-none focus:ring-4 transition-all cursor-pointer ${bgBorder}`}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            <option value="" disabled>-- 選擇等級 --</option>
            {gradeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none rotate-90" />
        </div>
      </div>
      {scoreText && (
        <div className="flex items-center justify-between mt-1 pt-3.5 border-t-[3px] border-dashed border-slate-200/80 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            就學區換算積分
          </span>
          <span className="shrink-0 text-base font-black tracking-tight text-slate-900 sm:text-lg">{scoreText}</span>
        </div>
      )}
    </div>
  );
});

const CompositionScore = memo(function CompositionScore({
  region, scoresRef, settersRef,
}: {
  region: string;
  scoresRef: MutableRefObject<ScoreValues>;
  settersRef: MutableRefObject<ScoreSetters>;
}) {
  const [value, setValue] = useState(() => scoresRef.current.composition);
  scoresRef.current.composition = value;
  settersRef.current.composition = setValue;
  const compScore = region && value ? compositionPoints(region, value) : null;

  return (
    <div className="relative group bg-slate-900 border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <label htmlFor="score-composition" className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-amber-400/50 flex items-center justify-center shrink-0 bg-slate-800">
            <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </div>
          寫作
        </label>
        <div className="relative w-full max-w-[180px] sm:max-w-[200px]">
          <select
            id="score-composition"
            required
            className="w-full px-2 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-slate-700 bg-slate-800 text-amber-400 font-black text-sm sm:text-lg appearance-none outline-none focus:outline-none focus:ring-4 focus:ring-amber-400/50 hover:border-amber-500/50 transition-all cursor-pointer"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            <option value="" disabled>-- 選擇級分 --</option>
            {[6, 5, 4, 3, 2, 1, 0].map((score) => (
              <option key={score} value={score}>{score} 級分</option>
            ))}
          </select>
          <ChevronRight className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-500/50 pointer-events-none rotate-90" />
        </div>
      </div>
      {compScore && (
        <div className="flex items-center justify-between mt-1 pt-3.5 border-t-[3px] border-dashed border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-xs sm:text-sm font-bold text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            就學區換算積分
          </span>
          <span className="shrink-0 text-base font-black tracking-tight text-amber-400 sm:text-lg">{compScore}</span>
        </div>
      )}
    </div>
  );
});

export function applyScoreValues(scoresRef: MutableRefObject<ScoreValues>, settersRef: MutableRefObject<ScoreSetters>, patch: Partial<ScoreValues>) {
  (Object.keys(patch) as ScoreKey[]).forEach((key) => {
    const value = patch[key];
    if (value === undefined) return;
    scoresRef.current[key] = value;
    settersRef.current[key]?.(value);
  });
}

export default function ExamScores({
  region, scoresRef, settersRef, savedScoreRecords, isScoreAccountLoggedIn, onImportClick, onLogin,
}: {
  region: string;
  scoresRef: MutableRefObject<ScoreValues>;
  settersRef: MutableRefObject<ScoreSetters>;
  savedScoreRecords: unknown[];
  isScoreAccountLoggedIn: boolean | null;
  onImportClick: () => void;
  onLogin: () => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="home-scores-panel p-6 sm:p-8 bg-sky-100 border-[1.5px] border-slate-900 rounded-3xl shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2 text-slate-900 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-indigo-100">
              <Calculator className="w-4 h-4 text-indigo-600" />
            </span>{' '}
            會考成績
          </h2>
          <p className="text-sm font-bold text-slate-600">填入成績，找出適合志願。</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          {savedScoreRecords.length > 0 && (
            <button type="button" onClick={onImportClick} className="home-score-action home-score-action-primary">
              <History className="h-4 w-4" />
              帶入已儲存成績
            </button>
          )}
          {savedScoreRecords.length === 0 && isScoreAccountLoggedIn !== true && (
            <button type="button" onClick={onLogin} className="home-score-action">
              <User className="h-4 w-4" />
              登入後儲存、帶入成績
            </button>
          )}
          {savedScoreRecords.length === 0 && isScoreAccountLoggedIn === true && (
            <button type="button" onClick={() => { window.location.assign(withBasePath('/score-records')); }} className="home-score-action">
              <History className="h-4 w-4" />
              前往儲存成績
            </button>
          )}
        </div>
      </div>
      <div className="home-subject-grid flex flex-col gap-3 sm:gap-4">
        {subjects.map((subject) => (
          <SubjectScore key={subject.id} {...subject} region={region} scoresRef={scoresRef} settersRef={settersRef} />
        ))}
        <CompositionScore region={region} scoresRef={scoresRef} settersRef={settersRef} />
      </div>
    </motion.section>
  );
}
