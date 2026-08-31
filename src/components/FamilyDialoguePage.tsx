import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, HeartHandshake, Lightbulb, Printer, RotateCcw, ShieldCheck, Users } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type PriorityId = 'interest' | 'dailyLife' | 'curriculum' | 'future' | 'budget' | 'admission';
type Scores = Record<PriorityId, number>;
type Notes = { candidate: string; studentHope: string; parentHope: string; studentBoundary: string; parentBoundary: string };

const storageKey = 'tw-admission-family-dialogue-priorities';
const emptyScores: Scores = { interest: 0, dailyLife: 0, curriculum: 0, future: 0, budget: 0, admission: 0 };
const emptyNotes: Notes = { candidate: '', studentHope: '', parentHope: '', studentBoundary: '', parentBoundary: '' };
const priorities: Array<{ id: PriorityId; title: string; description: string; prompt: string }> = [
  { id: 'interest', title: '興趣與就讀意願', description: '是否真的願意學這個科別、接受日常課程與實作。', prompt: '如果最後錄取這個選項，學生是否願意投入三年學習？' },
  { id: 'dailyLife', title: '通勤與生活安排', description: '通勤時間、住宿需求、作息與家庭能否配合。', prompt: '每天往返、早起或住宿的安排，家庭能長期承受嗎？' },
  { id: 'curriculum', title: '課程與學習方式', description: '重視學科、實作、專題、證照或學校特色課程的程度。', prompt: '比起校名，我們是否已看過實際課程、設備與學習方式？' },
  { id: 'future', title: '升學與未來方向', description: '升讀大學、技專、就業或仍保留探索空間的需求。', prompt: '這個選擇是否保留了孩子想走的下一步，而不是只看眼前？' },
  { id: 'budget', title: '費用與家庭資源', description: '學雜費、交通、住宿、工具材料與家庭支持安排。', prompt: '除了學費，交通、住宿、工具與活動等花費是否一起評估？' },
  { id: 'admission', title: '錄取可能與志願風險', description: '依成績、序位、名額與規則安排衝刺、穩妥與保底。', prompt: '這個志願是想讀且有理由的選擇，還是只因分數看起來安全？' },
];

const scoreLabels = ['尚未決定', '不太優先', '有點重要', '重要', '非常重要'];

const roleGuidance = {
  學生: {
    eyebrow: '先填你真正想過的生活',
    intro: '這張卡不是考你「該選什麼」。請想像自己真的讀三年：你願不願意學、每天的生活撐不撐得住、未來是否還有你想走的方向。',
    focus: '請以「我自己會不會願意過這樣的三年」來評分。',
    priorityText: {
      interest: '我對這個科別的內容有沒有好奇心，也願不願意面對它日常的課程與實作。',
      dailyLife: '我能不能接受每天的通勤、作息、校園氛圍，以及和朋友相處的生活。',
      curriculum: '我比較適合讀書、動手做、做專題、考證照，還是希望有更多探索空間。',
      future: '這個選擇能不能接近我想嘗試的未來，並保留之後轉彎或升學的機會。',
      budget: '費用會不會讓我在學習、交通或活動上常常需要勉強自己。',
      admission: '我想填的志願是否兼顧想讀與可能錄取，而不是只為了「有學校念」。',
    } as Record<PriorityId, string>,
  },
  家長: {
    eyebrow: '先想怎樣支持，才走得長久',
    intro: '這張卡不是要替孩子選校，而是把家庭能提供的支持與在意的風險說清楚。請從孩子的適性、身心狀態與長期安排來評分。',
    focus: '請以「這件事對孩子走得穩、家庭撐得久有多重要」來評分。',
    priorityText: {
      interest: '孩子是否真心願意投入；有意願通常比勉強選一個看似安全的方向更能走得久。',
      dailyLife: '通勤、住宿、作息與照顧安排，會不會影響孩子的睡眠、情緒與持續學習。',
      curriculum: '課程型態、實作設備、師資與校風，是否符合孩子目前的能力與學習方式。',
      future: '升學、技能、就業與轉換跑道的可能性，是否符合孩子的發展步調。',
      budget: '學雜費之外的交通、住宿、工具材料與活動費，家庭能否穩定負擔。',
      admission: '志願是否有合理的衝刺、穩妥與保底配置，並以正式招生資訊為準。',
    } as Record<PriorityId, string>,
  },
} as const;

function loadScores() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
    if (!parsed || typeof parsed !== 'object') return { student: emptyScores, parent: emptyScores, notes: emptyNotes };
    return { student: { ...emptyScores, ...parsed.student }, parent: { ...emptyScores, ...parsed.parent }, notes: { ...emptyNotes, ...parsed.notes } };
  } catch {
    return { student: emptyScores, parent: emptyScores, notes: emptyNotes };
  }
}

type Participant = { scores: Scores; hope: string; boundary: string };
type FamilyDialogue = { candidate: string; student: Participant; parent?: Participant };

function encodeDialogue(dialogue: FamilyDialogue) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(dialogue)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeDialogue(encoded: string): FamilyDialogue | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(encoded.length / 4) * 4, '=');
    const parsed = JSON.parse(decodeURIComponent(escape(atob(base64))));
    if (!parsed || typeof parsed !== 'object' || !parsed.student?.scores) return null;
    return { candidate: String(parsed.candidate || '').slice(0, 240), student: parsed.student, parent: parsed.parent };
  } catch { return null; }
}

export default function FamilyDialoguePage() {
  const params = new URLSearchParams(window.location.search);
  const dialogue = decodeDialogue(params.get('dialogue') || '');
  return dialogue ? <SharedFamilyDialogue dialogue={dialogue} /> : <FamilyDialogueStarter />;
}

function FamilyDialogueStarter() {
  const [data, setData] = useState(loadScores);
  const [shareLink, setShareLink] = useState('');
  const studentComplete = priorities.every((priority) => data.student[priority.id] > 0);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  const setScore = (id: PriorityId, value: number) => {
    setShareLink('');
    setData((current) => ({ ...current, student: { ...current.student, [id]: value } }));
  };
  const setNote = (key: keyof Notes, value: string) => {
    setData((current) => ({ ...current, notes: { ...current.notes, [key]: value } }));
    setShareLink('');
  };
  const createShare = () => {
    if (!studentComplete) return;
    const dialogue: FamilyDialogue = { candidate: data.notes.candidate, student: { scores: data.student, hope: data.notes.studentHope, boundary: data.notes.studentBoundary } };
    setShareLink(`${window.location.origin}${withBasePath('/family-dialogue')}?dialogue=${encodeDialogue(dialogue)}`);
  };

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-rose-50"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"><a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><ArrowLeft className="h-4 w-4" />返回首頁</a><div className="py-10"><div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-rose-800"><HeartHandshake className="h-4 w-4" />升學家庭對話工具</div><h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">家長與學生的選擇差異卡</h1><p className="mt-4 max-w-3xl text-base font-bold leading-8 text-slate-700 sm:text-lg">分開填寫「各自最重視什麼」，再一起看共識和需要討論的地方。這不是替你們決定，而是讓對話有更清楚的起點。</p></div></div></section>

    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-black text-rose-700">使用方式</p><h2 className="mt-1 text-xl font-black">學生先填真實想法，再邀請家長填寫</h2></div><div className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-700 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800"><ShieldCheck className="h-4 w-4" />不需帳號、不會上傳資料</div></div><p className="mt-3 text-sm font-bold leading-7 text-slate-600">每一項選 1 到 4，分數越高表示此刻越重要。學生不必猜家長想聽什麼；家長也不必急著找標準答案。分開填，才看得見真正的共識與差異。</p><label className="mt-5 block rounded-xl border-2 border-slate-200 bg-slate-50 p-4"><span className="block text-sm font-black text-slate-900">這次要一起討論哪個候選校科？<span className="ml-1 font-bold text-slate-400">（可略過）</span></span><input value={data.notes.candidate} onChange={(event) => setNote('candidate', event.target.value)} placeholder="例如：○○高職資訊科、餐飲管理科，或志願表的第一選擇" className="mt-3 w-full rounded-xl border-2 border-slate-900 bg-white px-3 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-rose-200" /></label></div>

      <div className="mt-7"><PriorityForm person="學生" tone="sky" scores={data.student} onChange={setScore} hope={data.notes.studentHope} boundary={data.notes.studentBoundary} onHopeChange={(value) => setNote('studentHope', value)} onBoundaryChange={(value) => setNote('studentBoundary', value)} /></div>

      <section className="mt-7 rounded-2xl border-4 border-slate-900 bg-violet-50 p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><p className="text-sm font-black text-violet-700">分開填寫？用各自的手機完成</p><h2 className="mt-1 text-2xl font-black">建立給家長的填寫連結</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">學生先完成自己的卡片，再把連結傳給家長。家長填完後會產生「合併結果連結」傳回學生；全程不使用後端或帳號。</p><button onClick={createShare} disabled={!studentComplete} className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-violet-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] disabled:cursor-not-allowed disabled:opacity-40"><Users className="h-4 w-4" />{studentComplete ? '建立家長填寫連結' : '請先完成學生的 6 項選擇'}</button>{shareLink && <div className="mt-5"><ShareLink label="傳給家長的連結" url={shareLink} description="連結內包含學生填寫內容；請只傳給信任的家長。家長填完後會產生合併結果連結回傳給你。" /></div>}</section>

      <section className="mt-7 rounded-2xl border-4 border-slate-900 bg-sky-50 p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><div className="flex gap-3"><Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" /><div><h2 className="text-xl font-black">把結果用在志願表前，請再確認三件事</h2><ol className="mt-3 grid gap-2 text-sm font-bold leading-7 text-slate-700"><li>1. 學生先確認：每一個志願若錄取，自己是否願意實際就讀。</li><li>2. 家庭一起確認：通勤、費用、住宿與生活安排是否可持續。</li><li>3. 最後核對：成績、序位、名額、比序規則與正式招生簡章。</li></ol></div></div></section>
    </section>
  </main>;
}

function ShareLink({ label, url, description }: { label: string; url: string; description: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); } catch { window.prompt('請複製連結：', url); }
  };
  return <div className="rounded-2xl border-2 border-slate-900 bg-white p-4"><p className="font-black text-slate-900">{label}</p><p className="mt-1 text-sm font-bold leading-6 text-slate-600">{description}</p><div className="mt-3 flex flex-wrap gap-2"><button onClick={copy} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"><Copy className="h-4 w-4" />{copied ? '已複製' : '複製連結'}</button><a href={url} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-3 py-2 text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">在此裝置預覽下一步</a></div></div>;
}

function SharedFamilyDialogue({ dialogue }: { dialogue: FamilyDialogue }) {
  const [parent, setParent] = useState<Participant>({ scores: { ...emptyScores, ...(dialogue.parent?.scores || {}) }, hope: dialogue.parent?.hope || '', boundary: dialogue.parent?.boundary || '' });
  const [resultLink, setResultLink] = useState('');
  const parentComplete = priorities.every((priority) => parent.scores[priority.id] > 0);
  const hasResult = Boolean(dialogue.parent);
  const createResult = () => {
    if (!parentComplete) return;
    const combined: FamilyDialogue = { ...dialogue, parent };
    setResultLink(`${window.location.origin}${withBasePath('/family-dialogue')}?dialogue=${encodeDialogue(combined)}`);
  };
  return <main className="min-h-screen bg-slate-50 text-slate-900"><section className="border-b-4 border-slate-900 bg-violet-50"><div className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><p className="text-sm font-black text-violet-700">跨裝置家庭對話</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">{dialogue.candidate || '升學選擇'}：{hasResult ? '合併結果' : '家長填寫卡'}</h1><p className="mt-3 text-sm font-bold leading-7 text-slate-600">這份資料不會上傳或儲存到伺服器。{hasResult ? '請把這份結果當成討論清單，而不是替彼此下結論。' : '學生看不到你填寫的過程；完成後請把合併結果連結傳回學生。'}</p></div></section><section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{hasResult ? <RemoteSummary dialogue={dialogue} /> : <><PriorityForm person="家長" tone="amber" scores={parent.scores} onChange={(id, value) => setParent((current) => ({ ...current, scores: { ...current.scores, [id]: value } }))} hope={parent.hope} boundary={parent.boundary} onHopeChange={(value) => setParent((current) => ({ ...current, hope: value }))} onBoundaryChange={(value) => setParent((current) => ({ ...current, boundary: value }))} /><section className="mt-6 rounded-2xl border-4 border-slate-900 bg-violet-50 p-5"><p className="text-sm font-black text-violet-700">只剩最後一步</p><h2 className="mt-1 text-xl font-black">完成後，建立合併結果連結</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-600">此連結會包含學生與家長兩人的評分與留言。複製後傳回學生，雙方即可在各自裝置查看同一份結果。</p><button onClick={createResult} disabled={!parentComplete} className="mt-4 rounded-xl border-2 border-slate-900 bg-violet-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] disabled:cursor-not-allowed disabled:opacity-40">{parentComplete ? '建立合併結果連結' : '請先完成家長的 6 項選擇'}</button>{resultLink && <div className="mt-4"><ShareLink label="傳回學生的合併結果連結" url={resultLink} description="學生開啟後可看到完整比較、雙方想法與建議討論順序。" /></div>}</section></>}</section></main>;
}

function RemoteSummary({ dialogue }: { dialogue: FamilyDialogue }) {
  const studentScores = { ...emptyScores, ...(dialogue.student?.scores || {}) };
  const parentScores = { ...emptyScores, ...(dialogue.parent?.scores || {}) };
  const shared = priorities.filter((item) => studentScores[item.id] >= 3 && parentScores[item.id] >= 3 && Math.abs(studentScores[item.id] - parentScores[item.id]) <= 1);
  const differences = priorities.filter((item) => Math.abs(studentScores[item.id] - parentScores[item.id]) >= 2);
  const discussionItems = differences.length ? differences : priorities.filter((item) => Math.max(studentScores[item.id], parentScores[item.id]) >= 3 && !shared.includes(item)).slice(0, 3);
  const currentUrl = window.location.href;
  const [copied, setCopied] = useState(false);
  const copyResult = async () => {
    try { await navigator.clipboard.writeText(currentUrl); setCopied(true); } catch { window.prompt('請複製合併結果連結：', currentUrl); }
  };
  return <section className="mt-7 space-y-6"><section className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-black text-emerald-700">合併結果</p><h2 className="mt-1 text-2xl font-black">兩人都已完成，可以一起討論了</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-600">分數差異不是誰比較對，而是提醒你們：這件事需要先把理由說清楚。</p></div><div className="grid shrink-0 gap-2 print:hidden sm:flex sm:flex-wrap"><button onClick={copyResult} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black"><Copy className="h-4 w-4" />{copied ? '已複製' : '複製結果連結'}</button><button onClick={() => window.print()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-3 py-2 text-sm font-black text-white"><Printer className="h-4 w-4" />列印／存成 PDF</button></div></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4"><h3 className="font-black">共同重視</h3><p className="mt-2 text-sm font-bold leading-7">{shared.length ? shared.map((item) => item.title).join('、') : '尚未形成明確共識；先從彼此最在意的一項開始了解。'}</p></div><div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4"><h3 className="font-black">優先討論</h3><p className="mt-2 text-sm font-bold leading-7">{differences.length ? differences.map((item) => item.title).join('、') : '沒有明顯落差；可接著核對實際課程、通勤與招生條件。'}</p></div></div></section><section className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-6"><p className="text-sm font-black text-violet-700">完整比較</p><h2 className="mt-1 text-xl font-black">六項優先順序，一次看清楚</h2><div className="mt-4 overflow-hidden rounded-xl border-2 border-slate-900"><div className="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] bg-slate-900 px-3 py-2 text-xs font-black text-white sm:grid-cols-[1fr_4rem_4rem]"><span>面向</span><span className="text-center">學生</span><span className="text-center">家長</span></div>{priorities.map((item) => { const gap = Math.abs(studentScores[item.id] - parentScores[item.id]); return <div key={item.id} className={`grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] items-center border-t-2 border-slate-200 px-3 py-3 text-sm sm:grid-cols-[1fr_4rem_4rem] ${gap >= 2 ? 'bg-amber-50' : 'bg-white'}`}><div><p className="font-black">{item.title}</p>{gap >= 2 && <p className="mt-1 text-xs font-bold text-amber-800">差異 {gap} 級，建議先談原因</p>}</div><span className="text-center font-black">{studentScores[item.id]}</span><span className="text-center font-black">{parentScores[item.id]}</span></div>; })}</div></section><section className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border-4 border-slate-900 bg-sky-50 p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-5"><p className="text-sm font-black text-sky-700">學生想讓家長知道</p><p className="mt-3 whitespace-pre-wrap text-sm font-bold leading-7 text-slate-700">{dialogue.student.hope || '尚未留下文字。可以先從「我希望你先聽我說完」開始。'}</p><p className="mt-5 text-sm font-black text-slate-900">學生最擔心／不能接受</p><p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-slate-700">{dialogue.student.boundary || '尚未留下文字。'}</p></div><div className="rounded-2xl border-4 border-slate-900 bg-amber-50 p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-5"><p className="text-sm font-black text-amber-700">家長想讓學生知道</p><p className="mt-3 whitespace-pre-wrap text-sm font-bold leading-7 text-slate-700">{dialogue.parent?.hope || '尚未留下文字。可以先從「我在意的是你能不能走得長久」開始。'}</p><p className="mt-5 text-sm font-black text-slate-900">家長最擔心／不能接受</p><p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-slate-700">{dialogue.parent?.boundary || '尚未留下文字。'}</p></div></section><section className="rounded-2xl border-4 border-slate-900 bg-violet-50 p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-6"><p className="text-sm font-black text-violet-700">建議對話順序</p><h2 className="mt-1 text-xl font-black">一次只談一件事，先理解再決定</h2><ol className="mt-4 space-y-3">{(discussionItems.length ? discussionItems : priorities.slice(0, 1)).map((item, index) => { const studentHigher = studentScores[item.id] > parentScores[item.id]; const focus = studentScores[item.id] === parentScores[item.id] ? '雙方都重視，請一起確認這個選項是否真的做得到。' : studentHigher ? '先請學生說明：為什麼這件事對自己這麼重要？家長再說明可提供哪些支持或顧慮。' : '先請家長說明：擔心的是什麼具體情境？學生再回應自己能如何準備或調整。'; return <li key={item.id} className="rounded-xl border-2 border-violet-200 bg-white p-4"><p className="font-black">{index + 1}. {item.title}</p><p className="mt-1 text-sm font-bold leading-7 text-slate-700">{focus}</p></li>; })}</ol><p className="mt-5 rounded-xl border-2 border-violet-200 bg-white p-4 text-sm font-bold leading-7 text-slate-700">討論結尾可一起寫下：<span className="font-black">「我們下一步要查什麼資料、誰在何時完成？」</span>例如課程內容、通勤試走、費用估算或正式簡章。</p></section><a href={withBasePath('/family-dialogue')} className="print:hidden inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><RotateCcw className="h-4 w-4" />重新建立一份差異卡</a></section>;
}


function PriorityForm({ person, tone, scores, onChange, hope, boundary, onHopeChange, onBoundaryChange }: { person: '學生' | '家長'; tone: 'sky' | 'amber'; scores: Scores; onChange: (id: PriorityId, value: number) => void; hope: string; boundary: string; onHopeChange: (value: string) => void; onBoundaryChange: (value: string) => void }) {
  const palette = tone === 'sky' ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-amber-50 border-amber-300 text-amber-900';
  const guidance = roleGuidance[person];
  const completedCount = priorities.filter((priority) => scores[priority.id] > 0).length;
  return <section className="overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><header className={`border-b-4 border-slate-900 p-4 sm:p-5 ${palette}`}><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white"><Users className="h-5 w-5" /></div><div className="min-w-0"><p className="text-xs font-black">{guidance.eyebrow}</p><h2 className="text-2xl font-black">{person}的優先順序</h2></div><span className="ml-auto shrink-0 rounded-lg border-2 border-slate-900 bg-white px-2 py-1 text-xs font-black">{completedCount}/6</span></div><p className="mt-4 max-w-2xl text-sm font-bold leading-7 text-slate-700">{guidance.intro}</p><p className="mt-3 text-xs font-black text-slate-600">{guidance.focus}</p></header><div className="divide-y-2 divide-slate-100">{priorities.map((priority) => <div key={priority.id} className="p-4 sm:p-5"><h3 className="font-black text-slate-900">{priority.title}</h3><p className="mt-1 text-sm font-bold leading-6 text-slate-600">{guidance.priorityText[priority.id]}</p><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">{[1, 2, 3, 4].map((value) => <button key={value} onClick={() => onChange(priority.id, value)} aria-label={`${priority.title}：${scoreLabels[value]}`} aria-pressed={scores[priority.id] === value} className={`min-h-14 rounded-xl border-2 px-1 text-xs font-black transition-all ${scores[priority.id] === value ? 'border-slate-900 bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(244,63,94,1)]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900'}`}>{value}<span className="mt-0.5 block text-[10px] font-bold">{scoreLabels[value]}</span></button>)}</div></div>)}</div><div className={`border-t-4 border-slate-900 p-4 sm:p-5 ${palette}`}><p className="text-sm font-black">把真正想說的話留下來</p><label className="mt-3 block text-sm font-black text-slate-800">我希望對方先理解的是<textarea value={hope} onChange={(event) => onHopeChange(event.target.value)} placeholder={person === '學生' ? '例如：我不是只想選朋友多的學校，我真的想學這個方向，也願意了解它的課程。' : '例如：我在意通勤與費用，不是反對孩子，而是希望三年都能有足夠休息與資源。'} className="mt-2 min-h-24 w-full rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-bold leading-6 outline-none focus:ring-4 focus:ring-rose-200" /></label><label className="mt-4 block text-sm font-black text-slate-800">我目前最擔心／不能接受的是<textarea value={boundary} onChange={(event) => onBoundaryChange(event.target.value)} placeholder={person === '學生' ? '例如：完全不喜歡的科別，即使分數安全，也不想勉強讀三年。' : '例如：長期過度通勤、超出家庭負擔，或孩子明確不願意的科別。'} className="mt-2 min-h-24 w-full rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-bold leading-6 outline-none focus:ring-4 focus:ring-rose-200" /></label></div></section>;
}
