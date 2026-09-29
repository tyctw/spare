import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, CheckCircle2, ClipboardList,
  Clock3, Coins, MessageCircle, Printer, RotateCcw, ShieldCheck,
  Users, X,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { buildLifeDiscussionHtml } from '../lib/lifeDiscussionPrint';
import PageBreadcrumb from './PageBreadcrumb';
import './life-feasibility-page.css';

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

type ResultTone = 'empty' | 'clear' | 'review' | 'high';

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
  const hasDetails = Boolean(candidate.commute || candidate.transfers || candidate.cost || candidate.stay !== 'home' || candidate.lateReturn || candidate.familySupport);
  const tone: ResultTone = !hasDetails ? 'empty' : issues === 0 ? 'clear' : issues <= 2 ? 'review' : 'high';
  const label = { empty: '待填條件', clear: '目前無警訊', review: '有待確認', high: '負擔偏高' }[tone];
  return { issues, warnings, label, tone };
}

export default function LifeFeasibilityPage() {
  const [student, setStudent] = useState({ name: '', className: '', date: new Date().toISOString().slice(0, 10) });
  const [budget, setBudget] = useState(2000);
  const [candidates, setCandidates] = useState([blankCandidate(), blankCandidate()]);
  const [decision, setDecision] = useState('');
  const [discussion, setDiscussion] = useState('');
  const [printPreview, setPrintPreview] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const printFrameRef = useRef<HTMLIFrameElement>(null);
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

  const previewDiscussionSheet = () => {
    setPreviewReady(false);
    setPrintPreview(buildLifeDiscussionHtml({ student, budget, candidates, results, decision, discussion }));
  };

  useEffect(() => {
    if (!printPreview) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPrintPreview(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [printPreview]);

  return (
    <main id="main-content" className="life-page">
      <div className="life-shell">
        <PageBreadcrumb title="生活條件比較單" parent={{ label: '學校類型解析', href: '/school-types' }} />

        <header className="life-hero">
          <div className="life-hero-copy">
            <span className="life-kicker"><ClipboardList size={17} aria-hidden="true" />選校實用工具</span>
            <h1>生活條件<br /><em>比較單</em></h1>
            <p>把兩個想去的校科放在一起，看看通勤、費用與每天的生活安排。先找出需要確認的事，再和家人或老師討論。</p>
            <a href="#life-basics" className="life-hero-link">開始比較 <ArrowDown size={18} aria-hidden="true" /></a>
          </div>
          <div className="life-hero-guide" aria-label="比較流程">
            <span>三步完成比較</span>
            <ol>
              <li><strong>01</strong><div><b>設定預算</b><small>先寫下每月可負擔範圍</small></div></li>
              <li><strong>02</strong><div><b>比較兩個選項</b><small>看通勤、費用與照顧安排</small></div></li>
              <li><strong>03</strong><div><b>留下討論結論</b><small>預覽並列印討論單</small></div></li>
            </ol>
          </div>
        </header>

        <div className="life-toolbar">
          <p><ShieldCheck size={18} aria-hidden="true" />填寫內容只在目前頁面顯示，重新整理後會清除。</p>
          <div>
            <button type="button" className="life-reset" onClick={reset}><RotateCcw size={17} aria-hidden="true" />清除重填</button>
            <button type="button" className="life-print" onClick={previewDiscussionSheet}><Printer size={18} aria-hidden="true" />預覽討論單</button>
          </div>
        </div>

        <section id="life-basics" className="life-panel life-basics" aria-labelledby="life-basics-title">
          <SectionHeading number="01" title="先設定比較基準" description="姓名與班級可留白。預算用來提醒每月費用是否超出可負擔範圍。" id="life-basics-title" />
          <div className="life-basics-grid">
            <TextField label="學生姓名" value={student.name} onChange={(value) => setStudent({ ...student, name: value })} placeholder="可留白" />
            <TextField label="班級／座號" value={student.className} onChange={(value) => setStudent({ ...student, className: value })} placeholder="可留白" />
            <label className="life-field"><span>填寫日期</span><input type="date" value={student.date} onChange={(event) => setStudent({ ...student, date: event.target.value })} /></label>
            <div className="life-budget"><Coins size={20} aria-hidden="true" /><NumberField label="每月交通／住宿預算" value={budget} onChange={setBudget} suffix="元" /></div>
          </div>
        </section>

        <section id="life-compare" className="life-compare" aria-labelledby="life-compare-title">
          <SectionHeading number="02" title="把兩個選項放在一起看" description="資料不必一次填完；先填確定的，再把不知道的事記下來。" id="life-compare-title" />
          <div className="life-cards">
            {candidates.map((candidate, index) => <CandidateCard key={index} index={index} candidate={candidate} result={results[index]} onChange={(patch) => update(index, patch)} />)}
          </div>
        </section>

        <section id="life-decision" className="life-panel life-decision" aria-labelledby="life-decision-title">
          <SectionHeading number="03" title="帶著問題一起討論" description="先選目前想保留的方向，再記下需要查證的事；這還不是正式志願序。" id="life-decision-title" />
          <div className="life-decision-grid">
            <div>
              <p className="life-field-title">目前優先保留</p>
              <div className="life-decision-options">
                <Decision value="candidate-0" current={decision} onChange={setDecision} label={candidates[0].name || '候選校科 A'} />
                <Decision value="candidate-1" current={decision} onChange={setDecision} label={candidates[1].name || '候選校科 B'} />
                <Decision value="more" current={decision} onChange={setDecision} label="還要再找其他選項" />
              </div>
            </div>
            <label className="life-field life-discussion-field"><span>和家人／老師討論後，我的結論</span><textarea value={discussion} onChange={(event) => setDiscussion(event.target.value)} placeholder="例如：先確認末班車與宿舍名額，再決定是否保留。" /></label>
          </div>
          <div className="life-decision-footer">
            <p><MessageCircle size={18} aria-hidden="true" />完成後可預覽討論單，帶著清楚的問題和家人、老師討論。</p>
            <button type="button" className="life-print" onClick={previewDiscussionSheet}><Printer size={18} aria-hidden="true" />預覽並列印</button>
          </div>
        </section>

        <aside className="life-note"><CheckCircle2 size={20} aria-hidden="true" /><p><strong>這份表怎麼判斷？</strong>單程超過 60 分鐘、轉乘超過 2 次、費用超出預算，或住宿／晚歸尚未有家人支持，都會列為待確認事項。本表協助討論，不代表即時交通資訊或錄取建議。</p></aside>
        <section className="life-next"><div><span>下一步</span><h2>選項有方向了，再整理志願順序。</h2><p>把想保留的校科放進模擬志願序，繼續比較與排序。</p></div><a href={withBasePath('/mock-volunteer')}>前往模擬志願序 <ArrowRight size={18} aria-hidden="true" /></a></section>
      </div>

      {printPreview && <div className="life-preview-backdrop" onClick={() => setPrintPreview(null)}>
        <section role="dialog" aria-modal="true" aria-labelledby="life-print-preview-title" className="life-preview" onClick={(event) => event.stopPropagation()}>
          <div className="life-preview-header"><div><h2 id="life-print-preview-title">討論單預覽</h2><p>請先確認內容；列印時只會輸出討論單。</p></div><div><button type="button" disabled={!previewReady} onClick={() => printFrameRef.current?.contentWindow?.print()} className="life-print"><Printer size={18} aria-hidden="true" />列印／另存 PDF</button><button type="button" className="life-preview-close" onClick={() => setPrintPreview(null)} aria-label="關閉討論單預覽"><X size={20} aria-hidden="true" /></button></div></div>
          <iframe ref={printFrameRef} title="生活條件討論單列印預覽" srcDoc={printPreview} onLoad={() => setPreviewReady(true)} />
        </section>
      </div>}
    </main>
  );
}

function SectionHeading({ number, title, description, id }: { number: string; title: string; description: string; id: string }) {
  return <div className="life-section-heading"><span>{number}</span><div><h2 id={id}>{title}</h2><p>{description}</p></div></div>;
}

function CandidateCard({ index, candidate, result, onChange }: { index: number; candidate: Candidate; result: ReturnType<typeof score>; onChange: (patch: Partial<Candidate>) => void }) {
  const letter = index === 0 ? 'A' : 'B';
  return <article className={`life-card life-card-${letter.toLowerCase()}`} aria-label={`選項 ${letter}`}>
    <header className="life-card-header"><span className="life-card-letter">{letter}</span><div><small>候選選項 {letter}</small><h3>{candidate.name || '還沒填寫校科名稱'}</h3></div><span className={`life-status life-status-${result.tone}`}>{result.label}</span></header>
    <div className="life-card-body">
      <TextField label="學校／科別" value={candidate.name} onChange={(value) => onChange({ name: value })} placeholder="例如：○○高中普通科" />
      <div className="life-card-group"><h4><Clock3 size={17} aria-hidden="true" />通勤與費用</h4><div className="life-metrics"><NumberField label="單程時間" value={candidate.commute} onChange={(value) => onChange({ commute: value })} suffix="分鐘" /><NumberField label="轉乘次數" value={candidate.transfers} onChange={(value) => onChange({ transfers: value })} suffix="次" /><NumberField label="每月費用" value={candidate.cost} onChange={(value) => onChange({ cost: value })} suffix="元" /></div></div>
      <div className="life-card-group"><h4><Users size={17} aria-hidden="true" />生活安排</h4><label className="life-field"><span>平日住在哪裡？</span><select value={candidate.stay} onChange={(event) => onChange({ stay: event.target.value as Candidate['stay'] })}><option value="home">每天回家</option><option value="dorm">住宿／租屋</option><option value="undecided">尚未決定</option></select></label><div className="life-checks"><Check checked={candidate.lateReturn} onChange={(value) => onChange({ lateReturn: value })} label="可能晚自習或晚回家" /><Check checked={candidate.familySupport} onChange={(value) => onChange({ familySupport: value })} label="已和家人討論安排" /></div></div>
      <div className={`life-alert life-alert-${result.tone}`}><strong>{result.tone === 'empty' ? '先填寫條件' : result.warnings.length ? `需要確認 ${result.issues} 件事` : '目前沒有明顯負擔'}</strong>{result.warnings.length ? <ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : <p>{result.tone === 'empty' ? '輸入通勤與費用後，這裡會整理提醒。' : '仍可把不確定的細節記在下面，討論時再確認。'}</p>}</div>
      <label className="life-field"><span>還要確認什麼？</span><textarea value={candidate.notes} onChange={(event) => onChange({ notes: event.target.value })} placeholder="例如：末班車、宿舍名額、實習日的返家方式" /></label>
    </div>
  </article>;
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="life-field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function NumberField({ label, value, onChange, suffix }: { label: string; value: number; onChange: (value: number) => void; suffix: string }) {
  return <label className="life-field"><span>{label}</span><span className="life-number"><input type="number" min="0" value={value || ''} onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))} /><small>{suffix}</small></span></label>;
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <label className="life-check"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>;
}

function Decision({ value, current, onChange, label }: { value: string; current: string; onChange: (value: string) => void; label: string }) {
  return <label className={`life-decision-option${current === value ? ' is-selected' : ''}`}><input type="radio" name="life-decision" value={value} checked={current === value} onChange={() => onChange(value)} /><span>{label}</span></label>;
}
