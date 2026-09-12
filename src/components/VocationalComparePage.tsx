import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, Briefcase, Compass, Plus, X } from 'lucide-react';
import { groups } from '../lib/vocationalGroups';
import { withBasePath } from '../lib/routes';

const dimensions = [
  { id: 'learning', label: '學什麼', icon: BookOpen, description: '先看看每天接觸的課程，哪一種學習讓你更想投入？', fields: [['主要學習內容', 'learning'], ['常見相關科別', 'majors']] },
  { id: 'future', label: '往哪裡走', icon: Briefcase, description: '比較升學與職涯的可能方向，選擇可以隨學習經驗繼續調整。', fields: [['升學延伸方向', 'furtherStudy'], ['可能職涯方向', 'careers']] },
  { id: 'interest', label: '適合我嗎', icon: Compass, description: '從興趣與願意培養的能力出發，想想自己是否喜歡這樣的學習過程。', fields: [['適合培養的特質', 'traits'], ['Holland 興趣提醒', 'hollandDesc'], ['選擇前，先問自己', 'selectionTip']] },
] as const;
const colors = ['bg-emerald-100', 'bg-sky-100', 'bg-amber-100'];

export default function VocationalComparePage() {
  const [ids, setIds] = useState<string[]>(() => Array.from(new Set(new URLSearchParams(window.location.search).getAll('group'))).filter((id) => groups.some((g) => g.id === id)).slice(0, 3));
  const [dimension, setDimension] = useState<(typeof dimensions)[number]['id']>('learning');
  const active = dimensions.find((item) => item.id === dimension)!;
  const selected = ids.map((id) => groups.find((group) => group.id === id)!);
  useEffect(() => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('group', id));
    window.history.replaceState(null, '', `${withBasePath('/vocational-compare')}${params.size ? `?${params}` : ''}`);
  }, [ids]);
  const toggle = (id: string) => setIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);
  return <main className="min-h-screen bg-[#f8faf8] text-slate-900">
    <header className="border-b-2 border-slate-900 bg-amber-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <a href={withBasePath('/vocational-encyclopedia')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold shadow-[2px_2px_0_#0f172a] transition hover:bg-amber-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"><ArrowLeft className="h-4 w-4" />回職群科系百科</a>
        <div className="py-8 sm:py-10"><p className="text-sm font-bold tracking-widest text-emerald-800">探索選擇 · 比較方向</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">把感興趣的職群，放在一起看。</h1><p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">不用一次決定未來。挑選 2～3 個職群，從課程、出路與興趣三個面向，找到值得深入了解的方向。</p></div>
      </div>
    </header>
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-8">
      <section aria-labelledby="choose-heading" className="rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[2px_2px_0_#0f172a] sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="choose-heading" className="text-xl font-black">01 選擇比較職群</h2><button type="button" disabled={!ids.length} onClick={() => setIds([])} className="text-sm font-bold underline underline-offset-4 disabled:opacity-40">全部清空</button></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">{[0, 1, 2].map((index) => <div key={index} className={`flex min-h-20 items-center justify-between gap-2 rounded-xl border border-slate-900 p-4 ${selected[index] ? colors[index] : 'border-dashed bg-slate-50'}`}>{selected[index] ? <><span className="font-black"><span className="mr-2 text-2xl">{selected[index].icon}</span>{selected[index].id}</span><button type="button" onClick={() => toggle(selected[index].id)} aria-label={`移除${selected[index].id}`} className="rounded-lg p-2 hover:bg-white/70"><X className="h-4 w-4" /></button></> : <span className="flex items-center gap-2 text-sm text-slate-500"><Plus className="h-4 w-4" />{index === 2 ? '可再加入一個職群' : '從下方選擇職群'}</span>}</div>)}</div>
        <fieldset className="mt-5"><legend className="sr-only">選擇最多三個職群</legend><div className="flex flex-wrap gap-2">{groups.map((group) => <label key={group.id} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${ids.includes(group.id) ? 'border-slate-900 bg-emerald-100' : 'border-slate-200'} ${ids.length === 3 && !ids.includes(group.id) ? 'opacity-40' : 'cursor-pointer hover:border-slate-900'}`}><input type="checkbox" checked={ids.includes(group.id)} disabled={ids.length === 3 && !ids.includes(group.id)} onChange={() => toggle(group.id)} className="accent-emerald-700" />{group.id}</label>)}</div></fieldset>
        <p role="status" className="mt-4 text-sm text-slate-600">已選 {ids.length} / 3 個{ids.length === 3 ? '；先移除一個，就能替換其他職群。' : ids.length < 2 ? '；再選擇職群即可開始比較。' : '；可以開始比較，也可再選一個。'}</p>
      </section>
      <section aria-labelledby="compare-heading">
        <h2 id="compare-heading" className="text-xl font-black">02 換個角度，看見差異</h2>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="比較面向">{dimensions.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={dimension === id} onClick={() => setDimension(id)} className={`inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 px-5 py-3 text-sm font-bold ${dimension === id ? 'bg-slate-900 text-white shadow-[2px_2px_0_#94a3b8]' : 'bg-white hover:bg-amber-50'}`}><Icon className="h-4 w-4" />{label}</button>)}</div>
        <p className="mt-4 text-sm leading-7 text-slate-600">{active.description}</p>
        {selected.length < 2 ? <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-14 text-center"><Compass className="mx-auto h-10 w-10 text-emerald-700" /><h3 className="mt-4 text-lg font-bold">先挑兩個想了解的方向</h3><p className="mt-2 text-sm text-slate-500">比較內容會依照你選擇的職群與面向呈現。</p></div> : <div role="region" aria-label={`${active.label}比較內容，可左右捲動`} tabIndex={0} className="mt-6 overflow-x-auto pb-3 focus-visible:outline-offset-4">
          <div className="grid gap-x-4" style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(270px, 1fr))` }}>
            {selected.map((group, index) => <div key={group.id} className={`rounded-t-2xl border-2 border-b-0 border-slate-900 p-5 ${colors[index]}`}><p className="text-xs font-bold text-slate-600">比較方向 {index + 1}</p><h3 className="mt-2 text-2xl font-black">{group.icon} {group.id}</h3><p className="mt-3 text-sm leading-7">{group.summary}</p>{dimension === 'interest' && <span className="mt-3 inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-bold">Holland {group.holland}</span>}</div>)}
            {active.fields.map(([label, key]) => selected.map((group) => <section key={`${group.id}-${key}`} className="border-x-2 border-slate-900 bg-white px-5 py-5"><h4 className="border-t border-slate-200 pt-4 text-sm font-black text-emerald-800">{label}</h4>{Array.isArray(group[key]) ? <ul className="mt-3 space-y-2">{(group[key] as string[]).map((item) => <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6">{item}</li>)}</ul> : <p className="mt-3 text-sm leading-7 text-slate-700">{group[key]}</p>}</section>))}
            {selected.map((group) => <div key={group.id} className="space-y-3 rounded-b-2xl border-2 border-t-0 border-slate-900 bg-white p-5 shadow-[2px_2px_0_#0f172a]"><a className="flex items-center justify-between rounded-lg border border-slate-900 bg-amber-100 px-3 py-2 text-sm font-bold hover:bg-amber-200" href={withBasePath(`/search?${new URLSearchParams({ group: group.id })}`)}>查看開設學校<ArrowUpRight className="h-4 w-4" /></a><a className="block text-center text-sm font-bold underline underline-offset-4" href={withBasePath(`/vocational-encyclopedia?${new URLSearchParams({ group: group.id })}`)}>深入了解{group.id}</a></div>)}
          </div>
        </div>}
      </section>
      <aside className="rounded-xl border border-slate-900 bg-amber-50 p-5 text-sm leading-7 text-slate-700"><strong>下一步，回到真實的學習生活。</strong> 想想哪些課程是你願意持續練習的，再比較學校設備、通勤與招生資訊。Holland 代碼只作為探索興趣的線索；科別與招生情況以各校當年度簡章為準。</aside>
    </div>
  </main>;
}
