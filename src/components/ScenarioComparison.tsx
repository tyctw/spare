import React, { useMemo, useState } from 'react';
import { Crown, Loader2, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';

const subjects = [
  ['chinese', '國文'], ['english', '英文'], ['math', '數學'], ['science', '自然'], ['social', '社會'],
] as const;
const grades = ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C'];
const schoolId = (school: any) => `${school.name || ''}|${school.type || ''}|${school.group || ''}`;

type Props = { scores: Record<string, any>; results: any; region: string; filters: Record<string, unknown> };

export default function ScenarioComparison({ scores, results, region, filters }: Props) {
  const [scenario, setScenario] = useState(() => ({ ...scores, composition: String(scores.composition ?? '') }));
  const [simulated, setSimulated] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [membersOnly, setMembersOnly] = useState(false);
  const changed = useMemo(() => subjects.some(([key]) => scenario[key] !== scores[key]) || String(scenario.composition) !== String(scores.composition), [scenario, scores]);
  const originalSchools = Array.isArray(results.eligibleSchools) ? results.eligibleSchools : [];
  const scenarioSchools = Array.isArray(simulated?.eligibleSchools) ? simulated.eligibleSchools : [];
  const originalMap = new Map<string, any>(originalSchools.map((school: any) => [schoolId(school), school]));
  const scenarioMap = new Map<string, any>(scenarioSchools.map((school: any) => [schoolId(school), school]));
  const gained = scenarioSchools.filter((school: any) => !originalMap.has(schoolId(school)));
  const lost = originalSchools.filter((school: any) => !scenarioMap.has(schoolId(school)));
  const moved = scenarioSchools.filter((school: any) => originalMap.has(schoolId(school)) && originalMap.get(schoolId(school)).zone !== school.zone);

  const run = async () => {
    setLoading(true);
    setMembersOnly(false);
    try {
      const response = await callBackend<{ active: boolean; results?: any }>({
        action: 'simulateScores', region, filters,
        scores: { ...scenario, composition: Number(scenario.composition) },
      });
      if (!response.active) { setMembersOnly(true); return; }
      setSimulated(response.results);
    } catch { window.alert('情境試算暫時無法完成，請稍後再試。'); }
    finally { setLoading(false); }
  };

  return <section className="mt-6 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-violet-50 shadow-[6px_6px_0_#161b35]">
    <div className="border-b-4 border-slate-900 bg-violet-600 p-5 text-white sm:p-6"><div className="flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-slate-900 bg-amber-300 text-slate-900"><Sparkles className="h-6 w-6" /></div><div><p className="text-xs font-black tracking-[.14em] text-violet-100">MEMBERSHIP FEATURE</p><h2 className="mt-1 text-2xl font-black">情境式結果比較</h2><p className="mt-1 text-sm font-bold text-violet-100">調整假設成績，看看可能多了哪些選項；不會覆蓋原始分析結果。</p></div></div></div>
    <div className="p-5 sm:p-6"><div className="grid gap-3 sm:grid-cols-3">{subjects.map(([key, label]) => <label key={key} className="rounded-xl border-2 border-violet-200 bg-white p-3"><span className="text-xs font-black text-slate-600">{label}</span><select value={scenario[key] || ''} onChange={(event) => setScenario((current) => ({ ...current, [key]: event.target.value }))} className="mt-1.5 w-full rounded-lg border-2 border-slate-900 bg-white px-2 py-2 text-sm font-black">{grades.map((grade) => <option key={grade} value={grade}>{grade}</option>)}</select></label>)}<label className="rounded-xl border-2 border-violet-200 bg-white p-3"><span className="text-xs font-black text-slate-600">作文</span><select value={scenario.composition} onChange={(event) => setScenario((current) => ({ ...current, composition: event.target.value }))} className="mt-1.5 w-full rounded-lg border-2 border-slate-900 bg-white px-2 py-2 text-sm font-black">{[0, 1, 2, 3, 4, 5, 6].map((score) => <option key={score} value={score}>{score} 級分</option>)}</select></label></div>
      {membersOnly ? <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4"><p className="text-sm font-black text-amber-900"><Crown className="mr-1 inline h-4 w-4" />此功能限有效會員使用。</p><a href={withBasePath('/membership')} className="rounded-lg border-2 border-slate-900 bg-violet-600 px-3 py-2 text-xs font-black text-white">查看會員方案</a></div> : <button type="button" disabled={!changed || loading} onClick={() => void run()} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-2.5 text-sm font-black text-slate-900 shadow-[3px_3px_0_#161b35] disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{loading ? '正在重新試算…' : changed ? '比較這個情境' : '請先調整成績'}</button>}
      {simulated && <div className="mt-6 rounded-2xl border-2 border-slate-900 bg-white p-4 sm:p-5"><div className="grid gap-3 sm:grid-cols-3"><Metric label="情境總積分" value={simulated.totalPoints} /><Metric label="推薦校科" value={`${scenarioSchools.length} 所`} /><Metric label="與原結果差異" value={`${Number(simulated.totalPoints) - Number(results.totalPoints || 0) >= 0 ? '+' : ''}${Number(simulated.totalPoints) - Number(results.totalPoints || 0)}`} /></div><div className="mt-5 grid gap-4 lg:grid-cols-3"><ChangeList title="新出現的選項" items={gained} icon={<TrendingUp className="h-4 w-4 text-emerald-700" />} empty="沒有新增選項" /><ChangeList title="不再符合的選項" items={lost} icon={<TrendingDown className="h-4 w-4 text-rose-700" />} empty="沒有移除選項" /><ChangeList title="落點區間變動" items={moved.map((school: any) => ({ ...school, before: originalMap.get(schoolId(school))?.zone }))} icon={<Sparkles className="h-4 w-4 text-violet-700" />} empty="沒有區間變動" /></div></div>}</div>
  </section>;
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3"><p className="text-xs font-black text-slate-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>; }
function ChangeList({ title, items, icon, empty }: { title: string; items: any[]; icon: React.ReactNode; empty: string }) { return <div className="rounded-xl border-2 border-slate-200 p-3"><div className="flex items-center gap-2 text-sm font-black">{icon}{title}<span className="ml-auto text-xs text-slate-500">{items.length}</span></div><div className="mt-3 space-y-2">{items.length ? items.slice(0, 6).map((school: any) => <div key={schoolId(school)} className="rounded-lg bg-slate-50 px-2.5 py-2 text-xs font-black text-slate-700">{school.name}{school.before && <span className="ml-1 text-slate-400">{school.before} → {school.zone}</span>}</div>) : <p className="text-xs font-bold text-slate-400">{empty}</p>}{items.length > 6 && <p className="text-xs font-bold text-slate-400">另有 {items.length - 6} 項</p>}</div></div>; }
