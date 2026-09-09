import { useState } from 'react';
import { compareVolunteerChoices, type VolunteerVersion, type VersionChoice } from '../lib/volunteerVersions';

export default function VolunteerVersionHistory({ versions, choices, busy = false, onSave, onRestore }: {
  versions: VolunteerVersion[]; choices: VersionChoice[]; busy?: boolean;
  onSave?: (note: string) => void; onRestore: (version: VolunteerVersion) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [target, setTarget] = useState('current');
  const [note, setNote] = useState('');
  const [confirming, setConfirming] = useState<number | null>(null);
  const version = versions.find(v => v.version === selected);
  const targetVersion = versions.find(v => String(v.version) === target);
  const diff = version ? compareVolunteerChoices(version.choices, targetVersion?.choices || choices) : null;
  return <section className="my-5 rounded-2xl border-2 border-slate-900 bg-white p-5 text-slate-900">
    <h3 className="text-xl font-black">志願版本比較與還原</h3>
    <p className="mt-2 text-sm leading-6">選擇兩個版本，比較新增、刪除與順位變動。還原會另存新版本，不會刪除歷史。</p>
    {onSave && <div className="mt-3 flex flex-wrap gap-2"><input aria-label="版本說明" maxLength={120} value={note} onChange={e => setNote(e.target.value)} placeholder="例如：和家長討論後" className="min-w-0 flex-1 rounded-lg border p-2" /><button disabled={busy} onClick={() => onSave(note.trim())} className="rounded-lg bg-indigo-600 p-2 font-bold text-white disabled:opacity-40">保存目前版本</button></div>}
    {!versions.length ? <p className="mt-3 text-sm">尚無保存版本。</p> : <>
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><label>比較起點<select className="mt-1 w-full rounded-lg border p-2" value={selected ?? ''} onChange={e => { setSelected(Number(e.target.value)); setConfirming(null); }}><option value="" disabled>選擇歷史版本</option>{versions.map(v => <option key={v.version} value={v.version}>第 {v.version} 版 · {v.note || '志願清單'} · {new Date(v.created_at).toLocaleString('zh-TW')}</option>)}</select></label>
      <label>比較終點<select className="mt-1 w-full rounded-lg border p-2" value={target} onChange={e => setTarget(e.target.value)}><option value="current">目前清單</option>{versions.map(v => <option key={v.version} value={v.version}>第 {v.version} 版 · {v.note || '志願清單'}</option>)}</select></label></div>
      {version && diff && <div className="mt-4 space-y-3"><p className="text-sm">第 {version.version} 版 · {version.actor_name} · {new Date(version.created_at).toLocaleString('zh-TW')} · {version.note}</p>
        <p className="font-bold">新增 {diff.added.length} 項／刪除 {diff.removed.length} 項／順位變動 {diff.moved.length} 項</p>
        <ul className="max-h-64 space-y-2 overflow-auto text-sm">{diff.added.map(x => <li key={'a'+x.key} className="text-emerald-800">新增：{x.choice.name} {x.choice.deptName} {x.choice.shift}（第 {x.rank} 志願）</li>)}{diff.removed.map(x => <li key={'r'+x.key} className="text-rose-800">刪除：{x.choice.name} {x.choice.deptName} {x.choice.shift}（原第 {x.rank} 志願）</li>)}{diff.moved.map(x => <li key={'m'+x.key}>順位：{x.choice.name} {x.choice.deptName} {x.choice.shift}（{x.from} → {x.rank}）</li>)}</ul>
        {!diff.added.length && !diff.removed.length && !diff.moved.length && <p>校科選項與順序相同。</p>}
        <details><summary className="cursor-pointer font-bold">查看第 {version.version} 版完整清單（{version.choices.length} 項）</summary><ol className="mt-2 list-inside list-decimal text-sm">{version.choices.map((c,i) => <li key={i}>{c.name} {c.deptName} {c.shift}</li>)}</ol></details>
        {confirming === version.version ? <div className="rounded-lg bg-amber-50 p-3"><p>將以第 {version.version} 版的 {version.choices.length} 個志願取代目前清單，並新增還原紀錄。</p><button disabled={busy} onClick={() => { onRestore(version); setConfirming(null); }} className="mt-2 rounded-lg bg-amber-300 p-2 font-bold disabled:opacity-40">確認還原</button><button onClick={() => setConfirming(null)} className="ml-3 p-2">取消</button></div> : <button disabled={busy} onClick={() => setConfirming(version.version)} className="rounded-lg border-2 border-slate-900 px-3 py-2 font-bold disabled:opacity-40">還原第 {version.version} 版</button>}
      </div>}
    </>}
  </section>;
}
