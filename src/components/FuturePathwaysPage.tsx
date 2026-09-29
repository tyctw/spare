import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Building2, CheckCircle2, ChevronDown, GraduationCap, Route, Sparkles } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageBreadcrumb from './PageBreadcrumb';
import './future-pathways-page.css';

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

const routeNotes = [
  { title: '繁星推薦／科技繁星', body: '以校內推薦與在校成績等條件為核心；是否有推薦名額、校內排序與適用資格，都要向學校確認。' },
  { title: '申請入學／四技申請', body: '通常先依學測成績等條件篩選，再依校系規定辦理第二階段。備審內容、面試或術科不是每個校系都相同。' },
  { title: '分發入學', body: '一般大學分發採分科測驗等當年度規定；四技二專聯合登記分發則以統測與招生群類等規定辦理，兩者不能混為一談。' },
  { title: '四技二專甄選入學', body: '一般組須符合資格並取得統測成績，再依招生流程進行篩選、備審或指定項目；可填群類與校系依簡章限制。' },
  { title: '技優與特殊選才', body: '技優是技專校院的特定招生管道，依競賽、證照或其他資格審查；特殊選才則多為各校系自辦，兩者資格、審查與時程都不同。' },
  { title: '就業、二技、插班與轉學', body: '畢業後可就業再進修；五專畢業取得副學士後可依資格申請二技或插班。轉學、抵免與專業證照均由各校或主管機關另訂。' },
];

export default function FuturePathwaysPage() {
  const [selectedId, setSelectedId] = useState<PathwayId>('general');
  const [goal, setGoal] = useState<GoalId>('higherEducation');
  const selected = useMemo(() => pathways.find((item) => item.id === selectedId)!, [selectedId]);
  const hasMatchingStep = selected.steps.some((step) => step.kind === goal);
  const highlightedKind = hasMatchingStep ? goal : 'base';

  return <main className="future-page"><div className="future-shell">
    <PageBreadcrumb title="未來路線探索" parent={{ label: '學校類型解析', href: '/school-types' }} />
    <header className="future-hero"><div><span className="future-eyebrow"><Route size={17} aria-hidden="true" />升學與職涯路線</span><h1>三年或五年後，<br /><em>我可以怎麼走？</em></h1><p>選一種學制，再選你關心的目標。看看畢業後的常見方向，以及現在能先確認的事情。</p><a href="#future-choose" className="future-primary">開始探索路線 <ArrowRight size={17} aria-hidden="true" /></a></div><div className="future-hero-guide"><span>這頁怎麼用</span><ol><li><b>01</b>選擇學校類型</li><li><b>02</b>選擇關心方向</li><li><b>03</b>查看路徑和準備清單</li></ol><p>每條路都可能繼續升學或就業，實際資格請以當年度簡章為準。</p></div></header>

    <section className="future-section" id="future-choose"><div className="future-heading"><span>01 / 選擇起點</span><h2>你現在或想讀哪一種學制？</h2><p>先選最接近自己的類型，下方內容就會更新。</p></div><div className="future-path-options" role="group" aria-label="選擇學校類型">{pathways.map((pathway) => <button type="button" key={pathway.id} data-tone={pathway.id} aria-pressed={selectedId === pathway.id} onClick={() => setSelectedId(pathway.id)}><span className="future-option-top"><Building2 size={21} aria-hidden="true" /><small>{pathway.duration}</small></span><strong>{pathway.label}</strong><span>{pathway.description}</span></button>)}</div></section>

    <section className="future-section"><div className="future-heading"><span>02 / 選擇重點</span><h2>你現在最想了解哪個方向？</h2><p>選擇後，路徑中相關的步驟會特別標示。</p></div><div className="future-goals" role="group" aria-label="選擇關心方向">{(Object.entries(goalLabels) as [GoalId, typeof goalLabels[GoalId]][]).map(([id, item]) => { const Icon = item.icon; return <button type="button" key={id} aria-pressed={goal === id} onClick={() => setGoal(id)}><Icon size={22} aria-hidden="true" /><strong>{item.title}</strong><span>{item.detail}</span></button>; })}</div></section>

    <section className="future-section future-result" aria-labelledby="future-result-heading" aria-live="polite"><div className="future-result-head"><div><span>03 / 你的路線</span><h2 id="future-result-heading">從{selected.shortLabel}出發，可以怎麼走？</h2><p>{selected.description}</p></div><span className="future-duration">{selected.duration}學習路徑</span></div><div className="future-selection"><span>目前選擇</span><strong>{selected.label}</strong><ArrowRight size={16} aria-hidden="true" /><strong>{goalLabels[goal].title}</strong></div>{!hasMatchingStep && <p className="future-fallback">這個學制沒有單獨標示的「{goalLabels[goal].title}」步驟；先從共同基礎準備，再向學校詢問相關課程與管道。</p>}<ol className="future-timeline">{selected.steps.map((step, index) => <li key={step.title} data-highlighted={step.kind === highlightedKind}><span className="future-step-number">{String(index + 1).padStart(2, '0')}</span><div><span className="future-step-label">{step.kind === highlightedKind ? '這次先看' : '其他可能方向'}</span><h3>{step.title}</h3><p>{step.detail}</p></div></li>)}</ol></section>

    <section className="future-section future-check"><div className="future-heading"><span>04 / 行動清單</span><h2>現在先確認這三件事</h2><p>把學校實際課程與招生條件查清楚，再安排自己的下一步。</p></div><div className="future-check-grid">{selected.checkpoints.map((item, index) => <article key={item}><CheckCircle2 size={20} aria-hidden="true" /><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></article>)}</div></section>

    <section className="future-section future-glossary"><div className="future-heading"><span>招生名詞</span><h2>看到不熟悉的管道，先查白話說明</h2><p>各管道的資格與時程不同，找到感興趣的校系後再核對最新簡章。</p></div><div className="future-glossary-grid">{routeNotes.map((note) => <details key={note.title}><summary>{note.title}<ChevronDown size={17} aria-hidden="true" /></summary><p>{note.body}</p></details>)}</div></section>
    <div className="future-end"><div><Sparkles size={26} aria-hidden="true" /><strong>還在比較不同學制嗎？</strong><p>回到學校類型解析，先了解課程和學習方式的差異。</p></div><a href={withBasePath('/school-types')}>比較學校類型 <ArrowRight size={17} aria-hidden="true" /></a></div>
  </div></main>;
}
