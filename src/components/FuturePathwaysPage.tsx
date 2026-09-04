import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, CheckCircle2, GraduationCap, Route, Sparkles } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type PathwayId = 'general' | 'vocational' | 'comprehensive' | 'fiveYear';
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
  { id: 'general', label: '普通型高中', shortLabel: '普高', duration: '3 年', tone: 'bg-sky-500', description: '以學科學習與探索為主，適合還想保留較多選擇的人。', steps: [
    { title: '先把基礎學科學好', detail: '依興趣選課、做作品或參與活動，慢慢找出想讀的方向。', kind: 'base' },
    { title: '繼續讀大學', detail: '多數人會準備學測或分科測驗；有特殊能力也可查看校系規定。', kind: 'higherEducation' },
    { title: '也能選科大', detail: '想讀實作取向的科系，可查看以學測招生或校系自辦的方式。', kind: 'higherEducation' },
    { title: '先工作，再決定要不要進修', detail: '可以先累積經驗；有些工作需要另外取得證照或受訓資格。', kind: 'work' },
  ], checkpoints: ['目標校系需要哪些科目或資料', '本校實際開哪些課、能不能跨班選修', '各招生管道的最新時程'] },
  { id: 'comprehensive', label: '綜合型高中', shortLabel: '綜高', duration: '3 年', tone: 'bg-orange-500', description: '先探索，再依興趣選學科或專業方向；不同學校可選的課程不一樣。', steps: [
    { title: '高一先探索，高二再選方向', detail: '先看學校開什麼課，再選偏學科、偏專業，或兩邊都保留。', kind: 'base' },
    { title: '偏學科：往大學準備', detail: '可把重點放在學測、分科測驗與想讀科系需要的課。', kind: 'higherEducation' },
    { title: '偏專業：往科大或就業準備', detail: '可把重點放在專業課、統測、作品或技能成果。', kind: 'higherEducation' },
    { title: '想轉方向，也先查校規', detail: '跨修、轉學、插班與學分抵免都不是自動發生，要看各校規定。', kind: 'work' },
  ], checkpoints: ['學校實際開哪些學程與選修', '你修的課是否符合目標校系需求', '選統測時可報哪一類'] },
  { id: 'vocational', label: '技術型高中', shortLabel: '技高', duration: '3 年', tone: 'bg-emerald-500', description: '一邊學一般科目，一邊投入專業課程與實作，適合已有職群興趣的人。', steps: [
    { title: '把一項專業學扎實', detail: '從課程、實作與專題，累積你真的會做的事。', kind: 'base' },
    { title: '繼續讀科大或大學', detail: '常見會準備統測，再依成績、作品與校系規定申請；也有其他招生方式。', kind: 'higherEducation' },
    { title: '整理作品、證照或比賽成果', detail: '這些成果有時能幫助升學或求職，但不是每個人都必須取得。', kind: 'skills' },
    { title: '就業後再進修也可以', detail: '可先工作或實習了解職場；部分職業會要求特定證照。', kind: 'work' },
  ], checkpoints: ['該科到底學什麼、會不會實習', '統測能選哪些校系', '證照是否真的適合自己'] },
  { id: 'fiveYear', label: '五年制專科學校', shortLabel: '五專', duration: '5 年', tone: 'bg-violet-500', description: '五年持續學同一個專業；畢業後拿副學士學位，再選就業或接著讀。', steps: [
    { title: '五年持續累積專業', detail: '從基礎到專題與實作，逐步學深一個領域。', kind: 'base' },
    { title: '畢業後拿到副學士學位', detail: '這是往二技、插班或找工作時的重要學歷。', kind: 'higherEducation' },
    { title: '想繼續讀，可以接二技或插班', detail: '各校的名額、考試與可抵免學分不同，要逐校確認。', kind: 'higherEducation' },
    { title: '也能先就業', detail: '先累積工作經驗，再決定要不要完成學士學位。', kind: 'work' },
  ], checkpoints: ['五年課程與畢業條件', '二技或插班的最新資格', '是否能接受住宿或跨縣市生活'] },
];

const goalLabels: Record<GoalId, { title: string; detail: string; icon: typeof GraduationCap }> = {
  higherEducation: { title: '我想繼續升學', detail: '先看需要準備哪一種考試或資料。', icon: GraduationCap },
  skills: { title: '我想把技能學好', detail: '從課程、作品與實作，留下看得見的成果。', icon: BadgeCheck },
  work: { title: '我想先了解工作', detail: '先確認工作內容、實習安排與是否需證照。', icon: BriefcaseBusiness },
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
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-violet-800"><Route className="h-4 w-4" />下一步地圖</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">三年或五年後，我可以怎麼走？</h1>
          <p className="mt-4 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">先選你現在（或想讀）的學校類型，再點一個最在意的方向。你會看到最常見的下一步，以及現在該先準備什麼。</p>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <section aria-labelledby="starting-point" className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_#0f172a] sm:p-7">
        <p className="text-xs font-black tracking-[.16em] text-slate-500">第一步</p><h2 id="starting-point" className="mt-1 text-2xl font-black">你現在（或想讀）哪一種？</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{pathways.map((pathway) => <button type="button" key={pathway.id} onClick={() => setSelectedId(pathway.id)} aria-pressed={selectedId === pathway.id} className={`rounded-2xl border-3 border-slate-900 p-5 text-left transition hover:-translate-y-0.5 ${selectedId === pathway.id ? `${pathway.tone} text-white shadow-[4px_4px_0_#0f172a]` : 'bg-slate-50 hover:bg-white'}`}><div className="flex items-start justify-between gap-3"><Building2 className="h-6 w-6" /><span className={`rounded-full border-2 border-slate-900 px-2 py-1 text-xs font-black ${selectedId === pathway.id ? 'bg-white text-slate-900' : 'bg-amber-200'}`}>{pathway.duration}</span></div><h3 className="mt-6 text-xl font-black">{pathway.label}</h3><p className={`mt-2 text-sm font-bold leading-6 ${selectedId === pathway.id ? 'text-white/90' : 'text-slate-600'}`}>{pathway.description}</p></button>)}</div>
      </section>

      <section className="rounded-[2rem] border-4 border-slate-900 bg-violet-50 p-5 text-slate-900 shadow-[6px_6px_0_#7c3aed] sm:p-7">
        <p className="text-xs font-black tracking-[.16em] text-violet-700">第二步</p><h2 className="mt-1 text-2xl font-black">你現在最想知道什麼？</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">{(Object.entries(goalLabels) as [GoalId, typeof goalLabels[GoalId]][]).map(([id, item]) => { const Icon = item.icon; return <button type="button" key={id} onClick={() => setGoal(id)} aria-pressed={goal === id} className={`rounded-2xl border-2 border-slate-900 p-4 text-left transition ${goal === id ? 'bg-violet-600 text-white shadow-[3px_3px_0_#0f172a]' : 'bg-white text-slate-900 hover:-translate-y-0.5 hover:bg-violet-100'}`}><Icon className="h-6 w-6" /><h3 className="mt-3 font-black">{item.title}</h3><p className={`mt-1 text-sm font-bold leading-6 ${goal === id ? 'text-violet-100' : 'text-slate-600'}`}>{item.detail}</p></button>})}</div>
      </section>

      <section aria-live="polite" className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_#0f172a] sm:p-7">
        <div><p className="text-xs font-black tracking-[.16em] text-violet-700">你的專屬下一步</p><h2 className="mt-1 text-3xl font-black">先從這條路看起</h2><div className="mt-4 grid max-w-2xl grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"><div className="rounded-xl border-2 border-slate-900 bg-sky-100 px-4 py-3"><p className="text-xs font-black text-slate-500">你選的學制</p><p className="mt-0.5 text-lg font-black">{selected.label}</p></div><ArrowRight className="mx-auto h-6 w-6 shrink-0 rotate-90 text-slate-500 sm:rotate-0" aria-hidden="true" /><div className="rounded-xl border-2 border-slate-900 bg-amber-100 px-4 py-3"><p className="text-xs font-black text-slate-500">你現在關心</p><p className="mt-0.5 flex items-center gap-2 text-lg font-black"><GoalIcon className="h-5 w-5" />{goalLabels[goal].title.replace('我想', '')}</p></div></div><p className="mt-4 text-sm font-bold text-slate-600">有紫色「先看這個」標籤的卡片，就是本次重點。</p></div>
        <ol className="mt-7 grid gap-4 lg:grid-cols-4">{selected.steps.map((step, index) => { const isHighlighted = step.kind === goal || (step.kind === 'base' && goal !== 'work'); return <li key={step.title} className={`relative rounded-2xl border-3 border-slate-900 p-5 ${isHighlighted ? 'bg-violet-50 shadow-[5px_5px_0_#7c3aed]' : 'bg-slate-50 opacity-75'}`}><div className="flex items-center justify-between gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-sm font-black">{index + 1}</span><span className={`rounded-full px-2.5 py-1 text-xs font-black ${isHighlighted ? 'bg-violet-700 text-white' : 'bg-slate-200 text-slate-600'}`}>{isHighlighted ? '← 先看這個' : '其他可能路徑'}</span></div>{index < selected.steps.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full border-2 border-slate-900 bg-amber-300 p-1 lg:block" />}<h3 className="mt-5 text-lg font-black">{step.title}</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-600">{step.detail}</p></li>})}</ol>
      </section>

      <section className="rounded-[2rem] border-4 border-slate-900 bg-emerald-50 p-5 shadow-[5px_5px_0_#0f172a] sm:p-7"><div className="flex gap-3"><Sparkles className="h-7 w-7 shrink-0 text-emerald-700" /><div><h2 className="text-2xl font-black">現在先做這 3 件事</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">做完再決定，不用急著選定一條路。</p></div></div><ul className="mt-5 space-y-3">{selected.checkpoints.map((item) => <li key={item} className="flex gap-2 rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-bold leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />{item}</li>)}</ul></section>

      <details className="group rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0_#0f172a] sm:p-7">
        <summary className="cursor-pointer list-none text-2xl font-black">看不懂招生名詞？點這裡看白話解釋 <span className="ml-2 inline-block text-violet-700 transition group-open:rotate-90">→</span></summary>
        <p className="mt-4 max-w-4xl text-sm font-bold leading-7 text-slate-600">現在不必背完。等你找到想讀的校系，再回來看對應的說明與當年度簡章即可。</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <RouteNote title="繁星推薦／科技繁星" body="以校內推薦與在校成績等條件為核心；是否有推薦名額、校內排序與適用資格，都要向學校確認。" tone="bg-sky-50" />
          <RouteNote title="申請入學／四技申請" body="通常先依學測成績等條件篩選，再依校系規定辦理第二階段。備審內容、面試或術科不是每個校系都相同。" tone="bg-violet-50" />
          <RouteNote title="分發入學" body="一般大學分發採分科測驗等當年度規定；四技二專聯合登記分發則以統測與招生群類等規定辦理，兩者不能混為一談。" tone="bg-amber-50" />
          <RouteNote title="四技二專甄選入學" body="一般組須符合資格並取得統測成績，再依招生流程進行篩選、備審或指定項目；可填群類與校系依簡章限制。" tone="bg-emerald-50" />
          <RouteNote title="技優與特殊選才" body="技優是技專校院的特定招生管道，依競賽、證照或其他資格審查；特殊選才則多為各校系自辦，兩者資格、審查與時程都不同。" tone="bg-rose-50" />
          <RouteNote title="就業、二技、插班與轉學" body="畢業後可就業再進修；五專畢業取得副學士後可依資格申請二技或插班。轉學、抵免與專業證照均由各校或主管機關另訂。" tone="bg-slate-100" />
        </div>
      </details>

    </div>
  </main>;
}

function RouteNote({ title, body, tone }: { title: string; body: string; tone: string }) {
  return <article className={`rounded-2xl border-2 border-slate-900 p-4 ${tone}`}><h3 className="text-base font-black">{title}</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-700">{body}</p></article>;
}
