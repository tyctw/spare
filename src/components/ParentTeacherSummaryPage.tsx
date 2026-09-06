import { useMemo, useState } from 'react';
import { ArrowLeft, Clipboard, Printer, RefreshCw, Share2 } from 'lucide-react';
import { withBasePath } from '../lib/routes';

const readJson = (key: string, storage: Storage) => {
  try { const raw = storage.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
};
const text = (value: unknown, fallback = '未填寫') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
const regionNames: Record<string, string> = { taipei: '基北區', yilan: '宜蘭區', taoyuan: '桃連區', hsinchu: '竹苗區', central: '中投區', changhua: '彰化區', yunlin: '雲林區', chiayi: '嘉義區', tainan: '臺南區', kaohsiung: '高雄區', pingtung: '屏東區', hualien: '花蓮區', taitung: '臺東區', penghu: '澎湖區', kinmen: '金門區' };

export default function ParentTeacherSummaryPage() {
  const [revision, setRevision] = useState(0);
  const [meeting, setMeeting] = useState({ student: '', className: '', date: new Date().toISOString().slice(0, 10), goal: '', conclusion: '' });
  const data = useMemo(() => {
    const analysis = readJson('tw-admission-analysis-results', window.sessionStorage);
    const volunteer = readJson('tw-admission-volunteer-draft', window.localStorage);
    const life = readJson('tw-admission-life-feasibility', window.localStorage);
    return { analysis, volunteer, life };
  }, [revision]);
  const results = data.analysis?.results;
  const scores = data.analysis?.scores;
  const regionName = regionNames[scores?.region] || text(scores?.region);
  const schools = Array.isArray(data.volunteer?.choices) ? data.volunteer.choices.slice(0, 12) : [];
  const lifeCandidates = Array.isArray(data.life?.candidates) ? data.life.candidates.slice(0, 2) : [];
  const hasContent = Boolean(results || schools.length || lifeCandidates.length);

  const copySummary = async () => {
    const lines = [
      '親師討論摘要',
      `討論日期：${meeting.date}`,
      `討論目標：${text(meeting.goal, '尚未填寫')}`,
      results ? `分析區域：${regionName}；推薦校科：${Array.isArray(results.eligibleSchools) ? results.eligibleSchools.length : 0} 所` : '尚未帶入落點分析結果',
      schools.length ? `志願草稿：${schools.map((item: any, index: number) => `${index + 1}.${text(item.name)} ${text(item.deptName, '')}`).join('；')}` : '尚未建立志願草稿',
      lifeCandidates.length ? `生活條件比較：${lifeCandidates.map((item: any) => `${text(item.name)}（單程 ${item.commute || 0} 分鐘、每月約 ${item.cost || 0} 元）`).join('；')}` : '尚未填寫生活條件比較',
      `結論與下一步：${text(meeting.conclusion, '尚未填寫')}`,
      '提醒：本摘要僅供討論；正式招生資格、志願與時程請以當年度官方公告及系統為準。',
    ];
    try { await navigator.clipboard.writeText(lines.join('\n')); } catch { window.prompt('請複製以下內容', lines.join('\n')); }
  };

  return <main className="min-h-screen bg-slate-100 text-slate-900 print:bg-white">
    <style>{`@page { size:A4; margin:11mm; } @media print { .no-print { display:none !important; } .print-card { box-shadow:none !important; break-inside:avoid; } body { background:#fff !important; } input,textarea { border-color:#0f172a !important; } }`}</style>
    <div className="no-print border-b-2 border-slate-900 bg-white"><div className="mx-auto max-w-6xl px-4 py-4 sm:px-6"><a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black"><ArrowLeft className="h-4 w-4" />回到落點分析</a></div></div>
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <section className="print-card overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#0f172a]">
        <header className="border-b-2 border-slate-900 bg-amber-50 p-5 sm:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:justify-between"><div className="max-w-3xl"><p className="text-xs font-black tracking-[.16em] text-amber-800">STUDENT · FAMILY · TEACHER</p><h1 className="mt-2 text-3xl font-black sm:text-5xl">親師討論摘要</h1><p className="mt-3 text-sm font-bold leading-7 text-slate-700">把這次的落點分析、志願草稿與生活條件放在同一張表。它幫助對話，不替你決定志願。</p></div><div className="no-print flex flex-wrap gap-2"><button type="button" onClick={() => setRevision((value) => value + 1)} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black"><RefreshCw className="h-4 w-4" />重新讀取</button><button type="button" onClick={copySummary} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black"><Share2 className="h-4 w-4" />複製重點</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-3 py-2 text-sm font-black text-white"><Printer className="h-4 w-4" />列印／另存 PDF</button></div></div></header>
        <div className="p-5 sm:p-8">
          {!hasContent && <section className="no-print rounded-2xl border-2 border-amber-400 bg-amber-50 p-4"><div className="flex gap-3"><Clipboard className="h-5 w-5 shrink-0 text-amber-800" /><div><h2 className="font-black">還沒有可整理的資料</h2><p className="mt-1 text-sm font-bold leading-6 text-slate-700">先完成落點分析、建立模擬志願，或填寫生活條件比較單；回到本頁按「重新讀取」即可帶入。</p></div></div><div className="mt-3 flex flex-wrap gap-2"><a className="rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black" href={withBasePath('/')}>開始落點分析</a><a className="rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black" href={withBasePath('/mock-volunteer')}>建立志願草稿</a><a className="rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black" href={withBasePath('/life-feasibility')}>填生活比較單</a></div></section>}
          <section className="print-card rounded-2xl border-2 border-slate-900 bg-slate-50 p-4 sm:p-5"><h2 className="text-xl font-black">這次要談什麼？</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field label="學生姓名" value={meeting.student} onChange={(student) => setMeeting({ ...meeting, student })} /><Field label="班級／座號" value={meeting.className} onChange={(className) => setMeeting({ ...meeting, className })} /><label className="text-sm font-black">討論日期<input type="date" value={meeting.date} onChange={(event) => setMeeting({ ...meeting, date: event.target.value })} className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 font-bold" /></label><Field label="本次討論目標" value={meeting.goal} placeholder="例如：先縮小三個選項" onChange={(goal) => setMeeting({ ...meeting, goal })} /></div></section>
          <section className="print-card mt-5 rounded-2xl border-2 border-slate-900 bg-indigo-50 p-4 sm:p-5"><p className="text-xs font-black tracking-[.15em] text-indigo-700">01 · 落點分析</p><h2 className="mt-1 text-2xl font-black">本次分析重點</h2>{results ? <><div className="mt-4 grid gap-3 sm:grid-cols-4"><Metric label="分析區域" value={regionName} /><Metric label="總積分" value={String(results.totalPoints ?? '未提供')} /><Metric label="總積點" value={String(results.totalCredits ?? '未提供')} /><Metric label="推薦校科" value={`${Array.isArray(results.eligibleSchools) ? results.eligibleSchools.length : 0} 所`} /></div><p className="mt-4 rounded-xl bg-white p-3 text-sm font-bold leading-6 text-slate-700">{text(results.analysisReport?.analysisSummary, '系統已完成本次分析，請搭配下方志願與生活條件一起討論。')}</p>{results.analysisReport?.suggestion && <p className="mt-3 text-sm font-black leading-6 text-indigo-900">建議：{results.analysisReport.suggestion}</p>}</> : <Empty label="尚未帶入本次落點分析。" link="/" action="完成落點分析" />}</section>
          <section className="print-card mt-5 rounded-2xl border-2 border-slate-900 bg-sky-50 p-4 sm:p-5"><p className="text-xs font-black tracking-[.15em] text-sky-700">02 · 志願草稿</p><h2 className="mt-1 text-2xl font-black">目前想保留的校科</h2>{schools.length ? <div className="mt-4 overflow-hidden rounded-xl border-2 border-slate-900 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-900 text-white"><tr><th className="w-12 px-3 py-2">序</th><th className="px-3 py-2">學校／科別</th><th className="px-3 py-2">群科</th><th className="px-3 py-2">地區</th></tr></thead><tbody>{schools.map((item: any, index: number) => <tr key={`${item.code}-${item.deptCode}-${index}`} className="border-t border-slate-200 font-bold"><td className="px-3 py-2">{index + 1}</td><td className="px-3 py-2">{text(item.name)}<span className="block text-xs text-slate-500">{text(item.deptName, '科別待確認')}</span></td><td className="px-3 py-2">{text(item.groupName || item.levelInfo)}</td><td className="px-3 py-2">{text(item.county)}</td></tr>)}</tbody></table></div> : <Empty label="尚未建立志願草稿。" link="/mock-volunteer" action="建立志願草稿" />}</section>
          <section className="print-card mt-5 rounded-2xl border-2 border-slate-900 bg-emerald-50 p-4 sm:p-5"><p className="text-xs font-black tracking-[.15em] text-emerald-800">03 · 生活條件</p><h2 className="mt-1 text-2xl font-black">每天能不能穩定上學？</h2>{lifeCandidates.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">{lifeCandidates.map((item: any, index: number) => <article key={index} className="rounded-xl border-2 border-slate-900 bg-white p-4"><p className="text-xs font-black text-emerald-800">選項 {index === 0 ? 'A' : 'B'}</p><h3 className="mt-1 text-lg font-black">{text(item.name, `候選校科 ${index + 1}`)}</h3><dl className="mt-3 grid grid-cols-3 gap-2 text-sm"><div><dt className="text-slate-500">單程</dt><dd className="font-black">{item.commute || 0} 分</dd></div><div><dt className="text-slate-500">轉乘</dt><dd className="font-black">{item.transfers || 0} 次</dd></div><div><dt className="text-slate-500">每月</dt><dd className="font-black">{item.cost || 0} 元</dd></div></dl><p className="mt-3 border-t border-slate-200 pt-3 text-sm font-bold text-slate-700">待確認：{text(item.notes, '尚未填寫')}</p></article>)}</div> : <Empty label="尚未填寫生活條件比較。" link="/life-feasibility" action="填寫比較單" />}</section>
          <section className="print-card mt-5 rounded-2xl border-2 border-slate-900 bg-rose-50 p-4 sm:p-5"><p className="text-xs font-black tracking-[.15em] text-rose-700">04 · 結論與下一步</p><h2 className="mt-1 text-2xl font-black">今天先決定要確認什麼</h2><textarea value={meeting.conclusion} onChange={(event) => setMeeting({ ...meeting, conclusion: event.target.value })} className="mt-4 min-h-32 w-full rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-bold leading-6" placeholder="例如：本週先確認 A 校末班車與科別課程；下週再和導師討論志願排序。" /><p className="mt-4 text-xs font-bold leading-6 text-slate-600">本摘要僅供親師討論，不是正式志願表或錄取保證。實際招生資格、時程、名額與選填規則，請以當年度招生委員會、學校與官方系統公告為準。</p></section>
        </div>
      </section>
    </div>
  </main>;
}

function Field({ label, value, onChange, placeholder = '可留白' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className="text-sm font-black">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 font-bold" /></label>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border-2 border-slate-900 bg-white p-3"><dt className="text-xs font-black text-slate-500">{label}</dt><dd className="mt-1 text-lg font-black">{value}</dd></div>; }
function Empty({ label, link, action }: { label: string; link: string; action: string }) { return <div className="mt-4 rounded-xl border-2 border-dashed border-slate-400 bg-white p-4 text-sm font-bold text-slate-600"><p>{label}</p><a href={withBasePath(link)} className="no-print mt-3 inline-flex rounded-lg border-2 border-slate-900 bg-white px-3 py-2 font-black text-slate-900">{action}</a></div>; }
