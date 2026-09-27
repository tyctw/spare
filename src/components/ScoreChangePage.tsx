import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BookOpenCheck, Check,
  Crown, Lightbulb, Loader2, LockKeyhole, RotateCcw, TrendingUp,
} from 'lucide-react';
import { callBackend } from '../lib/api';
import { getMembershipStatus } from '../lib/membership';
import { withBasePath } from '../lib/routes';

const RESULTS_STORAGE_KEY = 'tw-admission-analysis-results';
const subjects = [
  { id: 'chinese', label: '國文' }, { id: 'english', label: '英文' }, { id: 'math', label: '數學' },
  { id: 'science', label: '自然' }, { id: 'social', label: '社會' }, { id: 'composition', label: '作文' },
] as const;
type Subject = typeof subjects[number]['id'];
type SchoolChange = { name: string; district?: string | null; type?: string | null; group?: string | null; zone: string };
type ZoneChange = SchoolChange & { fromZone: string; toZone: string };
type ChangeResult = {
  label: string;
  before: { totalPoints: number; totalCredits: number | null; count: number };
  after: { totalPoints: number; totalCredits: number | null; count: number };
  added: SchoolChange[];
  removed: SchoolChange[];
  zoneChanges: ZoneChange[];
};
type HistoryItem = ChangeResult & { id: string };
const zoneText: Record<string, string> = { reach: '夢幻區', target: '實際區', safe: '保守區' };
const focusClass = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600';

function readStoredResult() {
  try {
    const raw = sessionStorage.getItem(RESULTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ScoreChangePage() {
  const stored = useMemo(readStoredResult, []);
  const [member, setMember] = useState<boolean | null>(null);
  const [result, setResult] = useState<ChangeResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let current = true;
    getMembershipStatus()
      .then((status) => { if (current) setMember(status.active); })
      .catch(() => { if (current) setMember(false); });
    return () => { current = false; };
  }, []);

  useEffect(() => {
    if (result) resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  if (!stored?.results || !stored?.scores) return <EmptyState />;

  const scores = stored.scores as Record<string, unknown>;
  const vocationalGroups = Array.isArray(stored.vocationalGroups) ? stored.vocationalGroups : [];
  const isScenarioLocked = Boolean(result);
  const eligibleCount = stored.results.eligibleSchools?.length || 0;

  const runScenario = async (subject: Subject, direction: 'increase' | 'decrease') => {
    const requestKey = subject + '-' + direction;
    setLoading(requestKey);
    setError('');
    try {
      const response = await callBackend<ChangeResult>({
        action: 'analyzeScoreChange',
        subject,
        direction,
        region: String(scores.region || ''),
        scores: {
          chinese: scores.chinese, english: scores.english, math: scores.math,
          science: scores.science, social: scores.social, composition: Number(scores.composition),
        },
        filters: { schoolOwnership: scores.schoolOwnership, schoolType: scores.schoolType, vocationalGroups },
      });
      setResult(response);
      setHistory((items) => [
        { ...response, id: subject + '-' + direction + '-' + Date.now() },
        ...items.filter((item) => item.label !== response.label),
      ].slice(0, 6));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '暫時無法完成一分改變分析。');
    } finally {
      setLoading('');
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-6 text-slate-900 sm:px-6 sm:py-9">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href={withBasePath('/results')} className={'inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 ' + focusClass}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />回到分析結果
          </a>
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-2 text-xs font-bold text-indigo-800">
            <Crown className="h-4 w-4" aria-hidden="true" />會員專屬工具
          </span>
        </div>

        <header className="mt-5 overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-[linear-gradient(120deg,#ffffff_0%,#f2efff_68%,#e9f2ff_100%)] p-6 shadow-[0_16px_40px_-26px_rgba(60,49,130,0.4)] sm:p-9">
          <p className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700"><TrendingUp className="h-4 w-4" aria-hidden="true" />成績情境分析</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">一分改變分析</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">以你這次的成績與篩選條件為基準，試著調整一科，看看符合校科與落點區間如何變化。</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-indigo-800">
            <span className="rounded-lg bg-white/80 px-3 py-2">一次調整一科</span>
            <span className="rounded-lg bg-white/80 px-3 py-2">沿用本次篩選條件</span>
          </div>
        </header>

        {member === null ? <LoadingState /> : !member ? <LockedState /> : (
          <div className="mt-7 grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
            <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="score-change-baseline">
                <p className="text-xs font-bold text-indigo-700">本次分析基準</p>
                <h2 id="score-change-baseline" className="mt-1 text-lg font-black">目前成績</h2>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="rounded-xl bg-slate-50 px-2 py-3 text-center">
                      <p className="text-xs font-bold text-slate-500">{subject.label}</p>
                      <p className="mt-1 text-lg font-black text-slate-900">{String(scores[subject.id] ?? '—')}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm text-slate-600">目前符合校科</span>
                  <strong className="text-xl font-black text-indigo-700">{eligibleCount} <span className="text-xs">所</span></strong>
                </div>
              </section>
              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                <h2 className="flex items-center gap-2 font-black"><Lightbulb className="h-4 w-4" aria-hidden="true" />怎麼看結果？</h2>
                <p className="mt-2">「可能新增」代表依目前資料重新計算後進入清單，並不保證錄取。</p>
              </section>
            </aside>

            <div className="min-w-0">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="score-change-select">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-indigo-700">選擇情境</p>
                    <h2 id="score-change-select" className="mt-1 text-2xl font-black">調整一科成績</h2>
                    <p className="mt-2 text-sm text-slate-600">選擇提高或降低一級，系統會重新比較你的校科清單。</p>
                  </div>
                  {isScenarioLocked && (
                    <button type="button" onClick={() => { setResult(null); setError(''); }} className={'inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50 ' + focusClass}>
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />重新選擇
                    </button>
                  )}
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {subjects.map((subject) => {
                    const compositionScore = Number(scores.composition);
                    const grade = String(scores[subject.id] || '');
                    const canIncrease = subject.id === 'composition' ? compositionScore < 6 : grade !== 'A++';
                    const canDecrease = subject.id === 'composition' ? compositionScore > 0 : grade !== 'C';
                    return (
                      <article key={subject.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-black">{subject.label}</h3>
                          <span className="text-xs font-bold text-slate-500">目前 {String(scores[subject.id] ?? '—')}</span>
                        </div>
                        <div className={'mt-4 grid gap-2 ' + (canIncrease && canDecrease ? 'grid-cols-2' : 'grid-cols-1')}>
                          {canIncrease && <ScenarioButton label="提高一級" icon={<ArrowUp className="h-4 w-4" />} tone="up" loading={loading === subject.id + '-increase'} disabled={Boolean(loading) || isScenarioLocked} onClick={() => runScenario(subject.id, 'increase')} />}
                          {canDecrease && <ScenarioButton label="降低一級" icon={<ArrowDown className="h-4 w-4" />} tone="down" loading={loading === subject.id + '-decrease'} disabled={Boolean(loading) || isScenarioLocked} onClick={() => runScenario(subject.id, 'decrease')} />}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-800">{error}</p>}
              <div ref={resultRef} className="scroll-mt-6">
                {result ? <ResultPanel result={result} /> : <section className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-white px-6 py-12 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><TrendingUp className="h-6 w-6" aria-hidden="true" /></span>
                  <h2 className="mt-4 text-xl font-black">從一個科目開始</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">選擇上方任一個情境，查看符合校科與落點區間的前後差異。</p>
                </section>}
              </div>

              {history.length > 0 && (
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="score-change-history">
                  <div className="flex items-center justify-between gap-3">
                    <h2 id="score-change-history" className="text-lg font-black">本次比較紀錄</h2>
                    <button type="button" onClick={() => setHistory([])} className={'inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 ' + focusClass}><RotateCcw className="h-4 w-4" aria-hidden="true" />清除</button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {history.map((item) => (
                      <button type="button" key={item.id} onClick={() => setResult(item)} aria-pressed={result?.label === item.label} className={'rounded-xl border p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50 ' + (result?.label === item.label ? 'border-indigo-400 bg-indigo-50 ' : 'border-slate-200 bg-slate-50 ') + focusClass}>
                        <span className="block font-black text-slate-900">{item.label}</span>
                        <span className="mt-1 block text-xs font-bold text-slate-600">{item.before.count} → {item.after.count} 所符合</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        <Notes />
      </div>
    </main>
  );
}

function ScenarioButton({ label, icon, tone, loading, disabled, onClick }: {
  label: string; icon: ReactNode; tone: 'up' | 'down'; loading: boolean; disabled: boolean; onClick: () => void;
}) {
  const toneClass = tone === 'up'
    ? 'border-indigo-200 bg-indigo-50 text-indigo-800 hover:border-indigo-400 hover:bg-indigo-100'
    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100';
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={'inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ' + toneClass + ' ' + focusClass}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}{label}
    </button>
  );
}

function ResultPanel({ result }: { result: ChangeResult }) {
  const delta = result.after.count - result.before.count;
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="score-change-result">
      <header className="border-b border-slate-200 bg-indigo-50/60 p-5 sm:p-6">
        <p className="text-xs font-bold text-indigo-700">情境分析結果</p>
        <h2 id="score-change-result" className="mt-1 text-2xl font-black text-slate-900">{result.label}</h2>
        <p className="mt-2 text-sm text-slate-600">比較調整前後的符合校科，掌握清單與落點區間的變化。</p>
      </header>
      <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
        <Metric label="調整前符合" value={String(result.before.count)} suffix="所" />
        <Metric label="調整後符合" value={String(result.after.count)} suffix="所" />
        <Metric label="清單變化" value={delta > 0 ? '+' + delta : String(delta)} suffix="所" tone={delta < 0 ? 'down' : 'up'} />
      </div>
      <div className="mx-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200 py-4 text-sm text-slate-600 sm:mx-6">
        <p>總積分 <strong className="font-black text-slate-900">{result.before.totalPoints} → {result.after.totalPoints}</strong></p>
        {result.before.totalCredits !== null && result.after.totalCredits !== null && (
          <p>總積點 <strong className="font-black text-slate-900">{result.before.totalCredits} → {result.after.totalCredits}</strong></p>
        )}
      </div>
      <div className="grid gap-4 border-t border-slate-200 p-5 md:grid-cols-2 sm:p-6">
        <ChangeList title="可能新增的校科" schools={result.added} tone="up" empty="依目前資料與條件，沒有新增校科。" showZone />
        <ChangeList title="可能移出的校科" schools={result.removed} tone="down" empty="依目前資料與條件，沒有移出校科。" />
      </div>
      <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-6"><ZoneChangeList changes={result.zoneChanges} /></div>
    </section>
  );
}

function Metric({ label, value, suffix, tone = 'neutral' }: { label: string; value: string; suffix: string; tone?: 'neutral' | 'up' | 'down' }) {
  const toneClass = tone === 'down' ? 'text-rose-700' : tone === 'up' ? 'text-indigo-700' : 'text-slate-900';
  return <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"><p className="text-xs font-bold text-slate-600">{label}</p><p className={'mt-1 text-3xl font-black ' + toneClass}>{value} <span className="text-sm font-bold text-slate-500">{suffix}</span></p></div>;
}

function ChangeList({ title, schools, tone, empty, showZone = false }: {
  title: string; schools: SchoolChange[]; tone: 'up' | 'down'; empty: string; showZone?: boolean;
}) {
  const toneClass = tone === 'up' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800';
  return (
    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-slate-900">{title}</h3>
        <span className={'rounded-lg px-2.5 py-1 text-xs font-black ' + toneClass}>{schools.length} 所</span>
      </div>
      {schools.length ? <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
        {schools.map((school, index) => {
          const details = [school.district, school.type, school.group].filter(Boolean).join('・');
          return <li key={school.name + '-' + index} className="rounded-lg bg-slate-50 px-3 py-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0"><p className="text-sm font-bold text-slate-900">{school.name}</p>{details && <p className="mt-1 text-xs text-slate-500">{details}</p>}</div>
              {showZone && <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700">{zoneText[school.zone] || school.zone}</span>}
            </div>
          </li>;
        })}
      </ul> : <p className="mt-4 text-sm text-slate-600">{empty}</p>}
    </section>
  );
}

function ZoneChangeList({ changes }: { changes: ZoneChange[] }) {
  return (
    <section>
      <h3 className="font-black text-slate-900">落點區間變化 <span className="ml-1 text-sm text-slate-500">({changes.length})</span></h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">同一校科仍在清單內，但參考區間已改變。</p>
      {changes.length ? <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {changes.map((school, index) => <li key={school.name + '-' + index} className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-sm font-bold text-slate-900">{school.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">{zoneText[school.fromZone] || school.fromZone}</span>
            <ArrowRight className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            <span className="rounded-md bg-indigo-100 px-2 py-1 text-indigo-800">{zoneText[school.toZone] || school.toZone}</span>
          </div>
        </li>)}
      </ul> : <p className="mt-4 text-sm text-slate-600">這次變動沒有讓既有校科改變落點區間。</p>}
    </section>
  );
}

function Notes() {
  const notes = [
    { title: '資料基礎', text: '依本站已收錄的歷年門檻與你本次篩選條件重新計算。' },
    { title: '未納入項目', text: '不包含其他考生選填、名額異動、特殊資格與完整超額比序。' },
    { title: '最後確認', text: '正式選填前，務必回到當年度招生簡章與官方系統確認。' },
  ];
  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="score-change-notes-title">
    <div className="flex items-center gap-2 text-indigo-700"><BookOpenCheck className="h-5 w-5" aria-hidden="true" /><h2 id="score-change-notes-title" className="text-lg font-black text-slate-900">分析使用提醒</h2></div>
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      {notes.map((note) => <div key={note.title} className="border-t border-slate-200 pt-3"><h3 className="text-sm font-black text-slate-800">{note.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{note.text}</p></div>)}
    </div>
  </section>;
}

function LoadingState() {
  return <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-600" aria-live="polite"><Loader2 className="mx-auto h-6 w-6 animate-spin text-indigo-600" aria-hidden="true" /><p className="mt-3">正在確認會員資格…</p></section>;
}

function LockedState() {
  return <section className="mt-7 overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
    <div className="bg-indigo-50/70 p-6 sm:p-8">
      <span className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700"><LockKeyhole className="h-4 w-4" aria-hidden="true" />會員功能</span>
      <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">一科改變，看看選擇如何變化</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">會員可逐科模擬提高或降低一級，查看符合校科的增減與落點區間變化。</p>
      <a href={withBasePath('/membership')} className={'mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 ' + focusClass}><Crown className="h-4 w-4" aria-hidden="true" />查看會員方案<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
    </div>
    <div className="grid gap-3 p-5 sm:grid-cols-3">
      {['六科情境皆可選', '沿用本次分析條件', '列出校科與區間變動'].map((feature) => <div key={feature} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700"><Check className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" />{feature}</div>)}
    </div>
  </section>;
}

function EmptyState() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-4 py-10 text-slate-900"><section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><TrendingUp className="h-7 w-7" aria-hidden="true" /></span><h1 className="mt-5 text-2xl font-black">先完成一次落點分析</h1><p className="mt-3 text-sm leading-7 text-slate-600">一分改變分析會以你最近一次的成績、考區與篩選條件作為基準。</p><a href={withBasePath('/')} className={'mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 ' + focusClass}><ArrowLeft className="h-4 w-4" aria-hidden="true" />開始落點分析</a></section></main>;
}
