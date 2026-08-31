import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, CheckCircle2, ExternalLink, GraduationCap, Route, Sparkles, Wrench } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type PathwayId = 'general' | 'vocational' | 'fiveYear';
type GoalId = 'higherEducation' | 'skills' | 'work';

type Pathway = {
  id: PathwayId;
  label: string;
  shortLabel: string;
  duration: string;
  description: string;
  tone: string;
  steps: { title: string; detail: string; kind: GoalId | 'base' }[];
  checkpoints: string[];
};

const pathways: Pathway[] = [
  {
    id: 'general', label: '普通型高中', shortLabel: '普高', duration: '3 年', tone: 'bg-sky-500',
    description: '以一般學科與選修探索為主；高二、高三的班群與課程安排由各校規劃，不會單靠班群名稱決定後續升學資格。',
    steps: [
      { title: '高中學習與探索', detail: '核對校內課程地圖、加深加廣選修與目標校系採計科目；累積學習歷程的課程成果與多元表現。', kind: 'base' },
      { title: '大學升學', detail: '常見管道包含繁星推薦、申請入學、分發入學與特殊選才；各管道資格、採計科目與審查方式以當年度簡章為準。', kind: 'higherEducation' },
      { title: '技專校院升學', detail: '可依資格與招生簡章，評估四技申請入學、特殊選才或技優等管道；並非所有管道都適用每位普通科學生。', kind: 'higherEducation' },
      { title: '工作與再進修', detail: '高中畢業後可就業或先累積工作經驗，再依個人資格規劃進修；若目標職業有法定資格，仍須另符合考試或訓練要求。', kind: 'work' },
    ],
    checkpoints: ['目標校系最新採計科目與審查資料', '本校實際開課、跨班選修與補修規則', '繁星校內推薦與各招生管道的時程'],
  },
  {
    id: 'vocational', label: '技術型高中', shortLabel: '技高', duration: '3 年', tone: 'bg-emerald-500',
    description: '以專業及實習科目為主，並包含一般科目；群科、校內設備、實習安排與證照輔導會因學校與科別而不同。',
    steps: [
      { title: '專業課程、實作與專題', detail: '透過專業科目、實習或專題建立基礎。校外實習、建教合作或產學專班不是每一校、每一科的必經安排，需向學校確認。', kind: 'base' },
      { title: '四技二專升學', detail: '常見管道包含甄選入學、聯合登記分發、科技繁星、技優、特殊選才等；部分管道採統測與學習歷程，資格和名額以簡章為準。', kind: 'higherEducation' },
      { title: '證照與競賽成果', detail: '可依科別與個人規劃準備技術士技能檢定、競賽或校內外專題成果。證照不是畢業必然取得，也不等於所有校系或職務都要求。', kind: 'skills' },
      { title: '就業、實習與再進修', detail: '畢業後可就業，或先透過合法、具輔導機制的實習了解職場；進入特定職業前，須另確認法規、執照與雇主要求。', kind: 'work' },
    ],
    checkpoints: ['該科實際課程、實習場所與安全／保險安排', '招生群類與目標校系的統測選採科目', '欲報考證照的資格、報名期與是否和科別相符'],
  },
  {
    id: 'fiveYear', label: '五年制專科學校', shortLabel: '五專', duration: '5 年', tone: 'bg-violet-500',
    description: '前段包含共同基礎與專業學習，後段深化專業；完成規定並畢業後取得副學士學位，和三年制高中後直接升四技的節奏不同。',
    steps: [
      { title: '五年專科養成', detail: '依科別修習基礎、專業、實作與專題。實習、證照輔導、海外交流或產學合作的內容與資格，應以各校系課程與公告確認。', kind: 'base' },
      { title: '副學士畢業', detail: '完成學校規定並畢業後取得副學士學位；這是繼續報考二技、插班或求職時的重要學歷節點。', kind: 'higherEducation' },
      { title: '二技、插班與其他升學', detail: '可依當年度資格與簡章報考二技，或評估大學／四技插班等方式；各校系的年級、名額、考科與抵免規定不同。', kind: 'higherEducation' },
      { title: '就業與專業深化', detail: '可選擇就業、累積實務經驗，或繼續完成學士學位。涉及專門職業時，仍須依主管機關與考試規定辦理。', kind: 'work' },
    ],
    checkpoints: ['畢業條件、專題與校外實習規定', '二技／插班的報名資格與可採認學分', '校系是否提供銜接學制、實習或證照資源'],
  },
];

const goalLabels: Record<GoalId, { title: string; detail: string; icon: typeof GraduationCap }> = {
  higherEducation: { title: '我想繼續升學', detail: '優先核對招生簡章、採計科目、資格與時程。', icon: GraduationCap },
  skills: { title: '我想累積技能', detail: '從課程、專題、證照與競賽找可驗證的成果。', icon: BadgeCheck },
  work: { title: '我想接觸職場', detail: '先確認實習保障、職務要求與是否需要法定資格。', icon: BriefcaseBusiness },
};

export default function FuturePathwaysPage() {
  const [selectedId, setSelectedId] = useState<PathwayId>('general');
  const [goal, setGoal] = useState<GoalId>('higherEducation');
  const selected = useMemo(() => pathways.find((item) => item.id === selectedId)!, [selectedId]);
  const GoalIcon = goalLabels[goal].icon;

  return <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-gradient-to-br from-violet-100 via-white to-emerald-100">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <a href={withBasePath('/school-types')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0_#0f172a] hover:bg-slate-50"><ArrowLeft className="h-4 w-4" />回學校類型解析</a>
        <div className="py-8 sm:py-12">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-violet-800"><Route className="h-4 w-4" />PATHWAY SIMULATOR</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">未來路徑模擬</h1>
          <p className="mt-4 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">選擇普高、技高或五專，先看常見的下一步，再把「想升學、想累積技能、想接觸職場」轉成可核對的行動。這是路徑地圖，不是保證錄取或職涯預測。</p>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <section aria-labelledby="starting-point" className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_#0f172a] sm:p-7">
        <p className="text-xs font-black tracking-[.16em] text-slate-500">STEP 1</p><h2 id="starting-point" className="mt-1 text-2xl font-black">從哪一種學制開始？</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">{pathways.map((pathway) => <button type="button" key={pathway.id} onClick={() => setSelectedId(pathway.id)} aria-pressed={selectedId === pathway.id} className={`rounded-2xl border-3 border-slate-900 p-5 text-left transition hover:-translate-y-0.5 ${selectedId === pathway.id ? `${pathway.tone} text-white shadow-[4px_4px_0_#0f172a]` : 'bg-slate-50 hover:bg-white'}`}><div className="flex items-start justify-between gap-3"><Building2 className="h-6 w-6" /><span className={`rounded-full border-2 border-slate-900 px-2 py-1 text-xs font-black ${selectedId === pathway.id ? 'bg-white text-slate-900' : 'bg-amber-200'}`}>{pathway.duration}</span></div><h3 className="mt-6 text-xl font-black">{pathway.label}</h3><p className={`mt-2 text-sm font-bold leading-6 ${selectedId === pathway.id ? 'text-white/90' : 'text-slate-600'}`}>{pathway.description}</p></button>)}</div>
      </section>

      <section className="rounded-[2rem] border-4 border-slate-900 bg-slate-900 p-5 text-white shadow-[6px_6px_0_#7c3aed] sm:p-7">
        <p className="text-xs font-black tracking-[.16em] text-violet-200">STEP 2</p><h2 className="mt-1 text-2xl font-black">現在最想先看哪一件事？</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">{(Object.entries(goalLabels) as [GoalId, typeof goalLabels[GoalId]][]).map(([id, item]) => { const Icon = item.icon; return <button type="button" key={id} onClick={() => setGoal(id)} aria-pressed={goal === id} className={`rounded-2xl border-2 p-4 text-left transition ${goal === id ? 'border-amber-300 bg-amber-300 text-slate-950' : 'border-white/40 bg-white/10 text-white hover:bg-white/20'}`}><Icon className="h-6 w-6" /><h3 className="mt-3 font-black">{item.title}</h3><p className={`mt-1 text-sm font-bold leading-6 ${goal === id ? 'text-slate-700' : 'text-slate-200'}`}>{item.detail}</p></button>})}</div>
      </section>

      <section aria-live="polite" className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_#0f172a] sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black tracking-[.16em] text-violet-700">YOUR MAP · {selected.shortLabel}</p><h2 className="mt-1 text-3xl font-black">{selected.label}的常見路徑</h2></div><div className="inline-flex items-center gap-2 self-start rounded-xl border-2 border-slate-900 bg-amber-100 px-3 py-2 text-sm font-black"><GoalIcon className="h-4 w-4" />焦點：{goalLabels[goal].title.replace('我想', '')}</div></div>
        <ol className="mt-7 grid gap-4 lg:grid-cols-4">{selected.steps.map((step, index) => { const isHighlighted = step.kind === goal || (step.kind === 'base' && goal !== 'work'); return <li key={step.title} className={`relative rounded-2xl border-3 border-slate-900 p-5 ${isHighlighted ? 'bg-violet-50 shadow-[4px_4px_0_#7c3aed]' : 'bg-slate-50 opacity-80'}`}><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-sm font-black">{index + 1}</span>{index < selected.steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-amber-300 p-1 lg:block" />}<h3 className="mt-5 text-lg font-black">{step.title}</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-600">{step.detail}</p></li>})}</ol>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[2rem] border-4 border-slate-900 bg-emerald-50 p-5 shadow-[5px_5px_0_#0f172a] sm:p-7"><div className="flex gap-3"><Sparkles className="h-7 w-7 shrink-0 text-emerald-700" /><div><h2 className="text-2xl font-black">下一步，請這樣核對</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">地圖只負責讓你看見選項；真正做決定前，先從這三件事開始。</p></div></div><ul className="mt-5 space-y-3">{selected.checkpoints.map((item) => <li key={item} className="flex gap-2 rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-bold leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />{item}</li>)}</ul></div>
        <aside className="rounded-[2rem] border-4 border-slate-900 bg-amber-50 p-5 shadow-[5px_5px_0_#0f172a] sm:p-7"><Wrench className="h-7 w-7 text-amber-700" /><h2 className="mt-4 text-2xl font-black">證照與實習，不要想成固定關卡</h2><p className="mt-3 text-sm font-bold leading-7 text-slate-700">是否有考照輔導、校外實習、建教合作或產學專班，會隨校系、科別與年度不同。證照報考資格、實習條件與職業執照要求，也各自不同。</p><p className="mt-4 rounded-xl border-2 border-amber-300 bg-white p-3 text-sm font-black leading-6 text-amber-950">先問校方「有什麼」，再向主辦單位確認「我是否符合資格」。</p></aside>
      </section>

      <section className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0_#0f172a] sm:p-7"><p className="text-xs font-black tracking-[.16em] text-slate-500">OFFICIAL CHECK</p><h2 className="mt-1 text-2xl font-black">送出志願或報名之前，回到官方資料確認</h2><div className="mt-5 grid gap-3 md:grid-cols-3"><OfficialLink title="大學多元入學" detail="查繁星、申請、分發與校系分則。" href="https://www.cac.edu.tw/" /><OfficialLink title="技專校院招生" detail="查四技二專、二技、五專與各類招生管道。" href="https://www.techadmi.edu.tw/" /><OfficialLink title="教育部法規" detail="查實習課程、產學合作與相關法規。" href="https://edu.law.moe.gov.tw/" /></div><p className="mt-5 text-xs font-bold leading-6 text-slate-500">本頁最後檢核：2026 年 8 月。招生名額、資格、考科、課程、實習與證照規定可能調整，均以當年度簡章、校方公告及主管機關資料為準。</p></section>
    </div>
  </main>;
}

function OfficialLink({ title, detail, href }: { title: string; detail: string; href: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="group rounded-2xl border-2 border-slate-900 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-sky-50"><ExternalLink className="h-5 w-5 text-sky-700" /><h3 className="mt-3 font-black">{title}</h3><p className="mt-1 text-sm font-bold leading-6 text-slate-600">{detail}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-sky-700">前往官方網站 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></a>;
}
