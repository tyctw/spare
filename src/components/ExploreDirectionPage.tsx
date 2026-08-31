import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, Compass, ExternalLink, HeartHandshake, Home, Lightbulb, MapPin, RotateCcw, School, Sparkles } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type OptionId = 'people' | 'ideas' | 'technology' | 'creative' | 'handsOn' | 'theory' | 'practice' | 'mixed' | 'specialize' | 'nearby' | 'wider' | 'relocate' | 'budget' | 'routine' | 'explore' | 'workExperience';
type TrackId = 'general' | 'vocational' | 'fiveYear' | 'comprehensive';

type Option = { id: OptionId; title: string; detail: string; weights: Partial<Record<TrackId, number>> };
type Question = { id: string; eyebrow: string; title: string; description: string; multiple?: boolean; options: Option[] };

const questions: Question[] = [
  { id: 'interest', eyebrow: '01 · 興趣線索', title: '哪些事情讓你願意持續投入？', description: '不用選「最厲害」的，只選你想多花時間理解或練習的方向；可選 1～2 項。', multiple: true, options: [
    { id: 'people', title: '理解人與社會', detail: '喜歡語言、故事、溝通、照顧或社會議題。', weights: { general: 2, comprehensive: 2, fiveYear: 1 } },
    { id: 'ideas', title: '研究問題與知識', detail: '喜歡閱讀、推理、科學現象或抽象問題。', weights: { general: 3, comprehensive: 2 } },
    { id: 'technology', title: '科技與系統', detail: '想了解程式、工程、設備、數據或怎麼把東西做得更好。', weights: { vocational: 3, fiveYear: 3, general: 1, comprehensive: 1 } },
    { id: 'creative', title: '設計與創作', detail: '喜歡視覺、影音、表演、企劃或把想法變成作品。', weights: { vocational: 2, fiveYear: 2, comprehensive: 2, general: 1 } },
    { id: 'handsOn', title: '動手解決問題', detail: '喜歡操作、實驗、料理、照護、製作或維修。', weights: { vocational: 3, fiveYear: 3, comprehensive: 1 } },
  ] },
  { id: 'learning', eyebrow: '02 · 學習方式', title: '你希望接下來三到五年怎麼學？', description: '這不是能力高低，而是你比較能保持投入的學習節奏。', options: [
    { id: 'theory', title: '先廣泛探索學科', detail: '希望多保留時間理解不同領域，較晚再縮小方向。', weights: { general: 3, comprehensive: 2 } },
    { id: 'practice', title: '透過做中學', detail: '希望課程有較多實作、實驗、專題或技能練習。', weights: { vocational: 3, fiveYear: 2, comprehensive: 1 } },
    { id: 'mixed', title: '學科與實作都想保留', detail: '現在還不想過早二選一，希望有轉彎與試探空間。', weights: { comprehensive: 3, general: 2, vocational: 1 } },
    { id: 'specialize', title: '想早一點深入專業', detail: '已有明確科別方向，願意用較長時間累積同一領域。', weights: { fiveYear: 3, vocational: 2 } },
  ] },
  { id: 'place', eyebrow: '03 · 地點與生活', title: '就學地點可以怎麼安排？', description: '距離不是次要條件；通勤時間、交通班次與住宿支持都會影響每天的學習品質。', options: [
    { id: 'nearby', title: '以可負擔通勤為優先', detail: '希望每天能回家，或需把交通時間壓低。', weights: { general: 2, vocational: 2, comprehensive: 2, fiveYear: 1 } },
    { id: 'wider', title: '可接受較大通勤範圍', detail: '願意為校系特色多看幾個縣市或交通選項。', weights: { general: 1, vocational: 2, fiveYear: 2, comprehensive: 1 } },
    { id: 'relocate', title: '可評估住宿或跨縣市', detail: '家庭能一起評估住宿費、安全與假日返家安排。', weights: { fiveYear: 3, vocational: 1, general: 1, comprehensive: 1 } },
  ] },
  { id: 'family', eyebrow: '04 · 家庭條件', title: '家人希望先一起確認什麼？', description: '這些是做決定的真實條件，不是壓力測驗。選出目前最需要被照顧的一件事。', options: [
    { id: 'budget', title: '學費、交通與住宿預算', detail: '先把固定支出、補習／材料費與可能的住宿費列清楚。', weights: { general: 1, vocational: 1, comprehensive: 1, fiveYear: 1 } },
    { id: 'routine', title: '穩定作息與照顧安排', detail: '希望兼顧接送、家庭照顧、健康或每日生活節奏。', weights: { general: 2, vocational: 2, comprehensive: 2, fiveYear: 1 } },
    { id: 'explore', title: '先保留轉彎空間', detail: '現階段不急著決定職業，希望有更多探索時間。', weights: { general: 3, comprehensive: 3, vocational: 1 } },
    { id: 'workExperience', title: '盡早了解實務世界', detail: '希望在安全且有輔導的安排下，累積專題、實作或職場認識。', weights: { vocational: 3, fiveYear: 2, comprehensive: 1 } },
  ] },
];

const tracks: Record<TrackId, { title: string; summary: string; goodFor: string; verify: string[]; href: string; tone: string }> = {
  general: { title: '普通型高中', summary: '基本學科與選修探索為主，適合希望保留較廣學科探索、再依校系要求規劃升學的學生。', goodFor: '還想多探索領域，或希望先以學科學習建立方向。', verify: ['學校高二、高三實際開課與跨班選修', '目標校系的最新採計科目與審查重點', '通勤、課後學習與家庭作息是否可長期維持'], href: '/general-comprehensive-high-school', tone: 'bg-sky-100 text-sky-800' },
  vocational: { title: '技術型高中', summary: '專業及實習科目為主，並包含一般科目；可以從群科、專題與實作逐步建立技能方向。', goodFor: '想透過實作、專題或專業課程探索領域，但仍保有後續升學選項。', verify: ['科別實際課程、設備、專題與實習安排', '是否有你在意的證照輔導；確認報考資格而非只看宣傳', '四技二專招生群類、統測選採科目與進路'], href: '/vocational-encyclopedia', tone: 'bg-emerald-100 text-emerald-800' },
  fiveYear: { title: '五年制專科學校', summary: '國中畢業後進入五年一貫的專科課程，結合一般與專業學習；畢業取得副學士學位。', goodFor: '已有較明確專業興趣，願意較早投入同一領域並評估跨縣市或住宿等生活安排。', verify: ['五年課程、畢業條件、實習與專題規定', '校系所在位置、宿舍、交通、費用與返家安排', '畢業後二技、插班與就業的實際選項'], href: '/future-pathways', tone: 'bg-violet-100 text-violet-800' },
  comprehensive: { title: '綜合高中／可探索的學程', summary: '同時提供基本、專業與實習課程，透過校內學程與選修安排，讓學生在了解自己後再縮小方向。', goodFor: '想同時接觸學科與實作，或目前希望保留較多試探與轉換的可能。', verify: ['校內有哪些學術／專門學程及選填時間', '能否跨學程選修、轉換與補修', '各學程實際課表，而非只看校名或學程名稱'], href: '/school-types', tone: 'bg-amber-100 text-amber-800' },
};

export default function ExploreDirectionPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OptionId[]>([]);
  const isFinished = step === questions.length;
  const current = questions[step];
  const selectedForCurrent = current ? answers.filter((id) => current.options.some((option) => option.id === id)) : [];
  const canContinue = Boolean(selectedForCurrent.length);
  const rankings = useMemo(() => {
    const score: Record<TrackId, number> = { general: 0, vocational: 0, fiveYear: 0, comprehensive: 0 };
    answers.forEach((answer) => questions.flatMap((question) => question.options).find((option) => option.id === answer)?.weights && Object.entries(questions.flatMap((question) => question.options).find((option) => option.id === answer)!.weights).forEach(([track, value]) => { score[track as TrackId] += value ?? 0; }));
    return (Object.keys(tracks) as TrackId[]).sort((a, b) => score[b] - score[a]);
  }, [answers]);

  const choose = (option: Option) => {
    const exists = answers.includes(option.id);
    if (current.multiple) {
      if (exists) setAnswers((items) => items.filter((item) => item !== option.id));
      else if (selectedForCurrent.length < 2) setAnswers((items) => [...items, option.id]);
      return;
    }
    setAnswers((items) => [...items.filter((item) => !current.options.some((candidate) => candidate.id === item)), option.id]);
  };
  const reset = () => { setAnswers([]); setStep(0); };

  return <main className="min-h-screen overflow-x-clip bg-[#fffaf0] text-slate-900">
    <section className="border-b-4 border-slate-900 bg-gradient-to-br from-amber-100 via-white to-sky-100"><div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8"><a href={withBasePath('/school-types')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0_#0f172a]"><ArrowLeft className="h-4 w-4" />回學校類型解析</a><div className="py-8 sm:py-12"><div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-amber-800"><Compass className="h-4 w-4" />START WITHOUT A SCORE</div><h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">我不知道選什麼</h1><p className="mt-4 max-w-3xl text-base font-bold leading-8 text-slate-700 sm:text-lg">先不用輸入成績，也不用立刻決定職業。花幾分鐘整理興趣、學習方式、地點與家庭條件，找出值得進一步比較的學制與校科。</p></div></div></section>
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">{!isFinished ? <section className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[7px_7px_0_#0f172a] sm:p-8"><div className="flex items-center justify-between gap-4"><p className="text-xs font-black tracking-[.16em] text-slate-500">STEP {step + 1} / {questions.length}</p><div className="h-3 w-36 overflow-hidden rounded-full border-2 border-slate-900 bg-slate-100"><div className="h-full bg-amber-300 transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div></div><p className="mt-6 text-xs font-black tracking-[.16em] text-amber-700">{current.eyebrow}</p><h2 className="mt-2 text-3xl font-black">{current.title}</h2><p className="mt-3 text-sm font-bold leading-7 text-slate-600">{current.description}</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{current.options.map((option) => { const isSelected = answers.includes(option.id); return <button type="button" key={option.id} onClick={() => choose(option)} aria-pressed={isSelected} className={`rounded-2xl border-3 border-slate-900 p-5 text-left transition ${isSelected ? 'bg-slate-900 text-white shadow-[4px_4px_0_#fbbf24]' : 'bg-slate-50 hover:-translate-y-0.5 hover:bg-amber-50'}`}><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-current text-xs ${isSelected ? 'bg-amber-300 text-slate-900' : ''}`}>{isSelected ? '✓' : ''}</span><h3 className="mt-4 text-lg font-black">{option.title}</h3><p className={`mt-2 text-sm font-bold leading-6 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>{option.detail}</p></button>})}</div>{current.multiple && <p className="mt-3 text-xs font-bold text-slate-500">已選 {selectedForCurrent.length}／2 項</p>}<div className="mt-8 flex items-center justify-between gap-3 border-t-2 border-slate-200 pt-5"><button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-40">上一步</button><button type="button" onClick={() => setStep((value) => value + 1)} disabled={!canContinue} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#0f172a] disabled:cursor-not-allowed disabled:opacity-40">{step === questions.length - 1 ? '看我的探索方向' : '下一步'}<ArrowRight className="h-4 w-4" /></button></div></section> : <Results rankings={rankings} reset={reset} />}</div>
  </main>;
}

function Results({ rankings, reset }: { rankings: TrackId[]; reset: () => void }) {
  const recommended = rankings.slice(0, 2);
  return <div className="space-y-6"><section className="rounded-[2rem] border-4 border-slate-900 bg-slate-900 p-6 text-white shadow-[7px_7px_0_#0f172a] sm:p-8"><div className="flex gap-3"><Sparkles className="h-8 w-8 shrink-0 text-amber-300" /><div><p className="text-xs font-black tracking-[.16em] text-amber-200">YOUR EXPLORATION START</p><h2 className="mt-2 text-3xl font-black">先從這兩條路深入比較</h2><p className="mt-3 text-sm font-bold leading-7 text-slate-200">結果反映你剛剛選的偏好，不代表適合度排名，更不會取代成績、入學資格、家庭討論或學校實際課程。</p></div></div></section><div className="grid gap-5 md:grid-cols-2">{recommended.map((id, index) => { const track = tracks[id]; return <article key={id} className="rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a]"><p className="text-xs font-black tracking-[.16em] text-slate-500">{index === 0 ? '優先探索' : '一起比較'}</p><span className={`mt-4 inline-flex rounded-full border-2 border-slate-900 px-3 py-1 text-sm font-black ${track.tone}`}>{track.title}</span><p className="mt-4 text-sm font-bold leading-7 text-slate-600">{track.summary}</p><div className="mt-5 rounded-xl border-2 border-slate-900 bg-slate-50 p-4"><h3 className="font-black">為什麼值得看？</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{track.goodFor}</p></div><a href={withBasePath(track.href)} className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#0f172a]">查看相關內容 <ArrowRight className="h-4 w-4" /></a></article>})}</div><section className="rounded-[2rem] border-4 border-slate-900 bg-emerald-50 p-6 shadow-[5px_5px_0_#0f172a]"><div className="flex gap-3"><CircleHelp className="h-7 w-7 shrink-0 text-emerald-700" /><div><h2 className="text-2xl font-black">接著請用真實資料做決定</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">每一條路都至少找 2 所實際學校，帶著以下問題和家人、導師或輔導老師討論。</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{[...new Set(recommended.flatMap((id) => tracks[id].verify))].slice(0, 6).map((item) => <div key={item} className="flex gap-2 rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-bold leading-6"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />{item}</div>)}</div></section><section className="grid gap-5 md:grid-cols-2"><div className="rounded-[2rem] border-4 border-slate-900 bg-amber-50 p-6 shadow-[5px_5px_0_#0f172a]"><Home className="h-7 w-7 text-amber-700" /><h2 className="mt-4 text-xl font-black">和家人先說清楚</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">「我不是已經決定要讀哪裡；我想先比較這兩條路的課程、通勤與費用，再一起選值得填的學校。」</p></div><div className="rounded-[2rem] border-4 border-slate-900 bg-sky-50 p-6 shadow-[5px_5px_0_#0f172a]"><MapPin className="h-7 w-7 text-sky-700" /><h2 className="mt-4 text-xl font-black">最後才套入落點</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">方向縮小後，再用落點分析、歷年資料與當年度簡章檢查你所在就學區的實際選項。</p><a href={withBasePath('/')} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-sky-800">開始落點分析 <ArrowRight className="h-4 w-4" /></a></div></section><section className="rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a]"><h2 className="text-xl font-black">官方資料入口</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><OfficialLink href="https://www.techadmi.edu.tw/" label="技專校院招生與五專資訊" /><OfficialLink href="https://edu.law.moe.gov.tw/LawContent.aspx?KeyWord=&id=GL001143" label="教育部：高中類型與課程法規" /></div><p className="mt-4 text-xs font-bold leading-6 text-slate-500">本頁最後檢核：2026 年 8 月。各校課程、招生方式、名額、實習、住宿與費用，請以當年度官方簡章及學校公告為準。</p></section><button type="button" onClick={reset} className="mx-auto flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black shadow-[3px_3px_0_#0f172a]"><RotateCcw className="h-4 w-4" />重新整理我的方向</button></div>;
}

function OfficialLink({ href, label }: { href: string; label: string }) { return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center justify-between gap-3 rounded-xl border-2 border-slate-900 bg-slate-50 px-4 py-3 text-sm font-black hover:bg-sky-50">{label}<ExternalLink className="h-4 w-4 text-sky-700" /></a>; }
