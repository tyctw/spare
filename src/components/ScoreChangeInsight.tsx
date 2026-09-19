import { useEffect, useState } from 'react';
import { ArrowRight, Crown, Lightbulb, Loader2, LockKeyhole, TrendingUp } from 'lucide-react';
import { callBackend } from '../lib/api';
import { getMembershipStatus } from '../lib/membership';
import { withBasePath } from '../lib/routes';

type SchoolChange = { name: string; district?: string | null; type?: string | null; group?: string | null; zone: string };
type ChangeResult = {
  label: string;
  before: { totalPoints: number; totalCredits: number | null; count: number };
  after: { totalPoints: number; totalCredits: number | null; count: number };
  added: SchoolChange[];
  removed: SchoolChange[];
};

type Props = { scores: Record<string, unknown>; region: string; vocationalGroups: string[] };
const zoneText: Record<string, string> = { reach: '夢幻區', target: '實際區', safe: '保守區' };

export default function ScoreChangeInsight({ scores, region, vocationalGroups }: Props) {
  const [member, setMember] = useState<boolean | null>(null);
  const [result, setResult] = useState<ChangeResult | null>(null);
  const [error, setError] = useState('');
  const [loadingScenario, setLoadingScenario] = useState('');

  useEffect(() => {
    let current = true;
    getMembershipStatus().then((status) => current && setMember(status.active)).catch(() => current && setMember(false));
    return () => { current = false; };
  }, []);

  const runScenario = async (scenario: 'english_next' | 'composition_next') => {
    setLoadingScenario(scenario);
    setError('');
    try {
      const response = await callBackend<ChangeResult>({
        action: 'analyzeScoreChange', scenario, region,
        scores: { chinese: scores.chinese, english: scores.english, math: scores.math, science: scores.science, social: scores.social, composition: Number(scores.composition) },
        filters: { schoolOwnership: scores.schoolOwnership, schoolType: scores.schoolType, vocationalGroups },
      });
      setResult(response);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '暫時無法完成一分改變分析。');
    } finally {
      setLoadingScenario('');
    }
  };

  const englishLabel = `英文 ${String(scores.english || '--')} → 下一級`;
  const compositionLabel = `作文 ${String(scores.composition || '--')} → ${Math.min(6, Number(scores.composition || 0) + 1)}`;

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border-2 border-slate-900 bg-white shadow-[4px_4px_0_#0f172a]" aria-labelledby="score-change-title">
      <div className="border-b-2 border-slate-900 bg-gradient-to-r from-violet-100 via-white to-amber-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="flex items-center gap-2 text-xs font-black tracking-[.14em] text-violet-700"><TrendingUp className="h-4 w-4" />MEMBER ANALYSIS</p><h2 id="score-change-title" className="mt-2 text-2xl font-black tracking-tight">一分改變分析</h2><p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600">試著把一項成績提高一級，看看依目前篩選條件可能新增或移出哪些校科。</p></div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-black text-violet-800"><Crown className="h-3.5 w-3.5 fill-amber-300 text-amber-700" />會員專屬</span>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        {member === null ? <div className="flex items-center gap-2 text-sm font-bold text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />正在確認會員資格…</div> : !member ? (
          <div className="rounded-xl border-2 border-violet-200 bg-violet-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5"><div><p className="font-black text-violet-950">英文 B 升到 B+，會多出哪些選擇？</p><p className="mt-1 text-sm font-bold leading-6 text-violet-900/80">會員可用自己的成績立即比較，查看完整的校科增減清單。</p></div><a href={withBasePath('/membership')} className="mt-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3 text-sm font-black text-slate-900 shadow-[2px_2px_0_#0f172a] sm:mt-0"><LockKeyhole className="h-4 w-4" />解鎖分析</a></div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => runScenario('english_next')} disabled={Boolean(loadingScenario)} className="flex items-center justify-between rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-left font-black transition hover:bg-violet-50 disabled:opacity-60"><span>{englishLabel}</span>{loadingScenario === 'english_next' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}</button><button type="button" onClick={() => runScenario('composition_next')} disabled={Boolean(loadingScenario)} className="flex items-center justify-between rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-left font-black transition hover:bg-amber-50 disabled:opacity-60"><span>{compositionLabel}</span>{loadingScenario === 'composition_next' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}</button></div>
            {result && <div className="mt-5 rounded-xl border-2 border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-black text-slate-900">{result.label}</h3><p className="text-sm font-bold text-slate-600">符合校科：{result.before.count} → {result.after.count} 所</p></div><div className="mt-4 grid gap-3 md:grid-cols-2"><ChangeList title="可能新增" schools={result.added} tone="emerald" empty="依目前資料與條件，沒有新增校科。" /><ChangeList title="可能移出" schools={result.removed} tone="rose" empty="依目前資料與條件，沒有移出校科。" /></div></div>}
            {error && <p role="alert" className="mt-4 rounded-xl border-2 border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-800">{error}</p>}
          </>
        )}
        <p className="mt-4 flex gap-2 text-xs font-bold leading-5 text-slate-500"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />此功能依本站歷年門檻資料與目前條件重新計算，僅供規劃參考，不代表錄取結果；志願序規則請仍以各就學區當年度簡章為準。</p>
      </div>
    </section>
  );
}

function ChangeList({ title, schools, tone, empty }: { title: string; schools: SchoolChange[]; tone: 'emerald' | 'rose'; empty: string }) {
  const style = tone === 'emerald' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900';
  return <section className={`rounded-xl border p-3 ${style}`}><h4 className="text-sm font-black">{title}（{schools.length}）</h4>{schools.length ? <ul className="mt-2 space-y-2">{schools.map((school) => <li key={`${school.name}-${school.district}-${school.type}`} className="rounded-lg bg-white/80 px-3 py-2 text-sm font-bold"><span>{school.name}</span><span className="ml-2 text-xs font-bold opacity-70">{school.type || school.group || school.district || zoneText[school.zone] || ''}</span></li>)}</ul> : <p className="mt-2 text-sm font-bold opacity-75">{empty}</p>}</section>;
}
