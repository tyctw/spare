import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Printer, RotateCcw } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type Candidate = {
  name: string;
  commute: number;
  transfers: number;
  cost: number;
  stay: 'home' | 'dorm' | 'undecided';
  lateReturn: boolean;
  familySupport: boolean;
  notes: string;
};

const blankCandidate = (): Candidate => ({
  name: '', commute: 0, transfers: 0, cost: 0, stay: 'home', lateReturn: false, familySupport: false, notes: '',
});

function score(candidate: Candidate, budget: number) {
  const warnings = [
    candidate.commute > 60 ? '單程超過 60 分鐘' : '',
    candidate.transfers > 2 ? '需要轉乘超過 2 次' : '',
    budget > 0 && candidate.cost > budget ? '每月費用超出設定預算' : '',
    candidate.stay !== 'home' && !candidate.familySupport ? '住宿安排尚未和家人確認' : '',
    candidate.lateReturn && !candidate.familySupport ? '晚歸安排尚未和家人確認' : '',
  ].filter(Boolean);
  const issues = warnings.length;

  return {
    issues,
    warnings,
    label: issues === 0 ? '條件可接受' : issues <= 2 ? '有待確認' : '負擔偏高',
    tone: issues === 0 ? 'bg-emerald-100 text-emerald-800' : issues <= 2 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800',
  };
}

export default function LifeFeasibilityPage() {
  const [student, setStudent] = useState({ name: '', className: '', date: new Date().toISOString().slice(0, 10) });
  const [budget, setBudget] = useState(2000);
  const [candidates, setCandidates] = useState([blankCandidate(), blankCandidate()]);
  const [decision, setDecision] = useState('');
  const [discussion, setDiscussion] = useState('');
  const results = useMemo(() => candidates.map((candidate) => score(candidate, budget)), [budget, candidates]);

  const update = (index: number, patch: Partial<Candidate>) => {
    setCandidates((current) => current.map((candidate, candidateIndex) => candidateIndex === index ? { ...candidate, ...patch } : candidate));
  };

  const reset = () => {
    setStudent({ name: '', className: '', date: new Date().toISOString().slice(0, 10) });
    setBudget(2000);
    setCandidates([blankCandidate(), blankCandidate()]);
    setDecision('');
    setDiscussion('');
  };

  return (
    <main className="life-print-sheet min-h-screen bg-slate-100 text-slate-900 print:bg-white">
      <style>{`
        @page { size: A4; margin: 11mm; }
        .print-only { display: none; }
        @media print {
          .no-print, .screen-only { display: none !important; }
          .print-only { display: block !important; }
          body { background: #fff !important; }
          input, select, textarea { border-color: #0f172a !important; background: #fff !important; color: #0f172a !important; }
          .print-card { box-shadow: none !important; break-inside: avoid; }
          .print-header { border-width: 2px !important; }
          .life-print-sheet { background: #fff !important; }
          .life-print-header { padding: 5mm 6mm !important; }
          .life-print-header h1 { font-size: 24px !important; line-height: 1.1 !important; }
          .life-print-header p { line-height: 1.45 !important; }
          .life-print-basics, .life-print-candidate, .life-print-decision { padding: 4mm !important; }
          .life-print-comparison { margin-top: 5mm !important; }
          .life-print-candidates { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 4mm !important; }
          .life-print-candidate textarea { min-height: 14mm !important; }
          .life-print-decision { break-before: page; margin-top: 0 !important; }
          .life-print-note { margin-top: 5mm !important; padding: 3mm 4mm !important; }
          .life-print-sheet input, .life-print-sheet select, .life-print-sheet textarea { font-size: 11px !important; padding: 2mm !important; }
          .life-print-sheet label { font-size: 11px !important; }
        }
      `}</style>

      <section className="no-print border-b-2 border-slate-900 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <a href={withBasePath('/school-types')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black transition hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" />
            回學校類型解析
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <section className="print-card overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#0f172a]">
          <header className="print-header life-print-header border-b-2 border-slate-900 bg-indigo-50 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-black tracking-[.16em] text-indigo-700">STUDENT DECISION WORKSHEET</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">生活條件比較單</h1>
                <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-slate-700">不只看錄取機會，也看看每天能不能穩定上學。填完後，帶著這張表和家長、導師或輔導老師一起討論。</p>
              </div>
              <div className="no-print flex w-full gap-2 sm:w-auto">
                <button type="button" onClick={reset} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-black sm:flex-none"><RotateCcw className="h-4 w-4" />清除</button>
                <button type="button" onClick={() => window.print()} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-3 py-2.5 text-sm font-black text-white shadow-[2px_2px_0_#0f172a] sm:flex-none"><Printer className="h-4 w-4" />列印討論單</button>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <ol className="screen-only grid gap-3 md:grid-cols-3">
              <Step number="1" title="填寫條件" description="先填兩個候選校科" tone="sky" />
              <Step number="2" title="看生活負擔" description="找出需要確認的事" tone="amber" />
              <Step number="3" title="一起討論" description="決定下一步要查什麼" tone="emerald" />
            </ol>

            <section className="life-print-basics mt-6 rounded-2xl border-2 border-slate-900 bg-slate-50 p-4 sm:p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div><h2 className="text-lg font-black">先填基本資料</h2><p className="mt-1 text-sm font-bold text-slate-600">資料只留在這台裝置；不想填姓名也可以直接開始。</p></div>
                <p className="text-sm font-black text-indigo-700">預算會用來提醒費用是否超標</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <TextField label="學生姓名" value={student.name} onChange={(value) => setStudent({ ...student, name: value })} placeholder="可留白" />
                <TextField label="班級／座號" value={student.className} onChange={(value) => setStudent({ ...student, className: value })} placeholder="可留白" />
                <label className="text-sm font-black text-slate-700">填寫日期<input type="date" value={student.date} onChange={(event) => setStudent({ ...student, date: event.target.value })} className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 font-bold" /></label>
                <NumberField label="每月交通／住宿預算（元）" value={budget} onChange={setBudget} />
              </div>
            </section>

            <section className="life-print-comparison mt-6" aria-labelledby="candidate-comparison-title">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="text-xs font-black tracking-[.16em] text-indigo-700">STEP 1 · STEP 2</p><h2 id="candidate-comparison-title" className="mt-1 text-2xl font-black">把兩個選項放在一起看</h2></div>
                <p className="text-sm font-bold text-slate-600">不用急著選；先把生活條件填完整。</p>
              </div>
              <div className="life-print-candidates mt-4 grid gap-5 lg:grid-cols-2">
                {candidates.map((candidate, index) => <CandidateCard key={index} index={index} candidate={candidate} result={results[index]} onChange={(patch) => update(index, patch)} />)}
              </div>
            </section>

            <section className="print-card life-print-decision mt-6 rounded-2xl border-2 border-slate-900 bg-emerald-50 p-4 sm:p-5" aria-labelledby="life-decision-title">
              <p className="text-xs font-black tracking-[.16em] text-emerald-800">STEP 3 · DISCUSS</p>
              <h2 id="life-decision-title" className="mt-1 text-2xl font-black">討論後，先保留哪個選項？</h2>
              <p className="mt-1 text-sm font-bold text-slate-600">這不是最後志願序，只是幫你決定下一步優先查什麼。</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <Decision value="candidate-0" current={decision} onChange={setDecision} label={candidates[0].name || '候選學校／科別 1'} />
                <Decision value="candidate-1" current={decision} onChange={setDecision} label={candidates[1].name || '候選學校／科別 2'} />
                <Decision value="more" current={decision} onChange={setDecision} label="還要再找其他選項" />
              </div>
              <label className="mt-4 block text-sm font-black text-slate-700">和家人／老師討論後，我的結論<textarea value={discussion} onChange={(event) => setDiscussion(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-bold leading-6" placeholder="例如：先確認末班車與宿舍名額，再決定是否保留。" /></label>
            </section>

            <p className="life-print-note mt-5 rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold leading-6 text-slate-600">判斷參考：單程超過 60 分鐘、轉乘超過 2 次、費用超出預算，或住宿／晚歸尚未有家人支持，都會列為需要處理的條件。本表協助討論，不是即時交通資訊或錄取建議。</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({ number, title, description, tone }: { number: string; title: string; description: string; tone: 'sky' | 'amber' | 'emerald' }) {
  const styles = { sky: 'border-sky-300 bg-sky-50 text-sky-800', amber: 'border-amber-300 bg-amber-50 text-amber-900', emerald: 'border-emerald-300 bg-emerald-50 text-emerald-800' };
  return <li className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${styles[tone]}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-slate-900 bg-white text-sm font-black text-slate-900">{number}</span><span><strong className="block text-sm font-black">{title}</strong><span className="mt-0.5 block text-xs font-bold">{description}</span></span></li>;
}

function CandidateCard({ index, candidate, result, onChange }: { index: number; candidate: Candidate; result: ReturnType<typeof score>; onChange: (patch: Partial<Candidate>) => void }) {
  const isFirst = index === 0;
  const color = isFirst ? 'bg-sky-50' : 'bg-amber-50';
  const label = isFirst ? '選項 A' : '選項 B';

  return <article className={`print-card life-print-candidate rounded-2xl border-2 border-slate-900 p-4 sm:p-5 ${color}`}>
    <div className="flex items-center justify-between gap-3"><span className="rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black">{label}</span><span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black ${result.tone}`}>{result.label}</span></div>
    <div className="mt-3"><TextField label={`候選學校／科別 ${index + 1}`} value={candidate.name} onChange={(value) => onChange({ name: value })} placeholder="例如：○○高中普通科" /></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-3"><NumberField label="單程約幾分鐘" value={candidate.commute} onChange={(value) => onChange({ commute: value })} /><NumberField label="轉乘幾次" value={candidate.transfers} onChange={(value) => onChange({ transfers: value })} /><NumberField label="每月約花多少元" value={candidate.cost} onChange={(value) => onChange({ cost: value })} /></div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-black">平日生活安排<select value={candidate.stay} onChange={(event) => onChange({ stay: event.target.value as Candidate['stay'] })} className="mt-2 w-full bg-transparent font-bold outline-none"><option value="home">每天回家</option><option value="dorm">住宿／租屋</option><option value="undecided">尚未決定</option></select></label><div className="grid gap-2"><Check checked={candidate.lateReturn} onChange={(value) => onChange({ lateReturn: value })} label="可能晚自習或晚回家" /><Check checked={candidate.familySupport} onChange={(value) => onChange({ familySupport: value })} label="已和家人討論安排" /></div></div>
    <div className="mt-4 rounded-xl border-2 border-slate-900 bg-white p-3"><p className="text-sm font-black">需要先處理的條件</p>{result.warnings.length ? <ul className="mt-2 space-y-1 text-sm font-bold text-slate-700">{result.warnings.map((warning) => <li key={warning}>• {warning}</li>)}</ul> : <p className="mt-2 text-sm font-bold text-emerald-700">目前沒有明顯生活負擔警訊。</p>}</div>
    <label className="mt-4 block text-sm font-black text-slate-700">還要確認什麼？<textarea value={candidate.notes} onChange={(event) => onChange({ notes: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-bold" placeholder="例如：末班車、宿舍名額、實習日的返家方式" /></label>
    <p className="mt-4 flex gap-2 rounded-xl bg-white/80 p-3 text-sm font-bold leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-indigo-700" />{result.issues === 0 ? '生活條件目前可接受。' : result.issues <= 2 ? '先把上面的問題確認好，再決定是否放進志願。' : '長期負擔較高，建議保留其他選項。'}</p>
  </article>;
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block min-w-0 text-sm font-black text-slate-700">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-base font-bold" /></label>;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label className="block text-sm font-black text-slate-700">{label}<input type="number" min="0" value={value || ''} onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))} className="mt-1 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-base font-bold" /></label>;
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <label className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-black"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 shrink-0 accent-indigo-600" />{label}</label>;
}

function Decision({ value, current, onChange, label }: { value: string; current: string; onChange: (value: string) => void; label: string }) {
  return <label className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 border-slate-900 p-3 text-sm font-black ${current === value ? 'bg-emerald-500 text-slate-900' : 'bg-white'}`}><input type="radio" name="life-decision" value={value} checked={current === value} onChange={() => onChange(value)} />{label}</label>;
}
