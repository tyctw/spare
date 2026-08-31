import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Check, Lightbulb, Sparkles } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type Major = {
  name: string;
  group: string;
  entryTrack: string;
  icon: string;
  summary: string;
  courses: string[];
  practice: string;
  fit: string;
  misconception: string;
};

type Matchup = {
  id: string;
  label: string;
  question: string;
  left: Major;
  right: Major;
  decision: { left: string; right: string };
  choiceQuestions: Array<{ prompt: string; left: string; right: string }>;
};

const matchups: Matchup[] = [
  {
    id: 'information-electronics', label: '資訊科 vs 電子科', question: '都喜歡電腦，到底該選資訊還是電子？',
    left: { name: '資訊科', group: '電機與電子群', entryTrack: '統測對應：電機與電子群資電類', icon: '💻', summary: '重點在程式、軟體、網路與資料處理，讓電腦系統能被設計、管理與應用。', courses: ['程式設計與演算法', '網路與資料庫', '軟體專題與資訊應用'], practice: '寫程式、做網站或 App、組網路、完成軟體專題。', fit: '喜歡用邏輯拆解問題，能長時間除錯，也享受把想法寫成程式。', misconception: '不是只會打電腦遊戲；大量時間會用在程式邏輯、測試與反覆修正。' },
    right: { name: '電子科', group: '電機與電子群', entryTrack: '統測對應：電機與電子群資電類', icon: '🔌', summary: '重點在電路、電子元件、控制與量測，理解硬體設備如何接收、處理與輸出訊號。', courses: ['基本電學與電子學', '電路實驗與量測', '微控制器與電子專題'], practice: '接電路、焊接、量測訊號、製作感測或控制裝置。', fit: '對拆解設備、電路原理與實體實驗好奇，也願意細心依規範操作。', misconception: '不是只修電器；需要理解公式、讀電路圖並處理精密的實作細節。' },
    decision: { left: '更期待做程式、軟體與網路作品 → 優先了解資訊科。', right: '更想親手做電路、感測器與硬體控制 → 優先了解電子科。' },
    choiceQuestions: [
      { prompt: '完成作品時，你更期待哪一種成就感？', left: '功能跑起來、程式解掉錯誤', right: '電路接通、裝置真的有反應' },
      { prompt: '遇到問題時，你比較願意先做什麼？', left: '看程式邏輯與資料，慢慢除錯', right: '量測電壓、訊號或檢查接線' },
      { prompt: '你想花更多時間練習的是？', left: '寫程式、做軟體或網站', right: '電路、元件與硬體控制' },
    ],
  },
  {
    id: 'food-hospitality', label: '食品科 vs 餐飲管理科', question: '喜歡做食物，是偏食品還是餐飲管理？',
    left: { name: '食品科', group: '食品群', entryTrack: '統測對應：食品群', icon: '🧪', summary: '從原料、加工、衛生、保存與檢驗，認識食物如何安全、穩定地被製造。', courses: ['食品化學與微生物', '加工與品質管理', '衛生安全與檢驗'], practice: '食品加工、烘焙基礎、實驗檢驗、品質與衛生紀錄。', fit: '喜歡研究食物原理、重視精準流程，也能接受化學與實驗記錄。', misconception: '不只學烘焙；食品安全、化學、微生物與品管是重要核心。' },
    right: { name: '餐飲管理科', group: '餐旅群', entryTrack: '統測對應：餐旅群', icon: '🍳', summary: '從烹調、烘焙、飲調到服務流程，練習在現場完成料理與顧客體驗。', courses: ['中西餐烹調或烘焙', '飲料調製與餐飲服務', '成本、衛生與現場管理'], practice: '備料、烹調、出餐、服務演練與團隊合作。', fit: '喜歡動手料理、現場節奏與和人互動，也能在忙碌中維持細節。', misconception: '不只是吃喝玩樂；衛生、服儀、服務與時間管理都會被要求。' },
    decision: { left: '更在意食品背後的科學、安全與製程 → 優先了解食品科。', right: '更享受料理、出餐與服務現場 → 優先了解餐飲管理科。' },
    choiceQuestions: [
      { prompt: '你對食物最好奇的部分是？', left: '保存、成分、加工與安全', right: '料理、風味與顧客體驗' },
      { prompt: '實作課裡，你更能投入哪一種任務？', left: '檢驗、記錄數據、調整製程', right: '備料、烹調、出餐與服務' },
      { prompt: '你比較能接受哪一種學習挑戰？', left: '食品化學與衛生規範', right: '忙碌的現場節奏與團隊合作' },
    ],
  },
  {
    id: 'commercial-data', label: '商業經營科 vs 資料處理科', question: '都在商管群，差別不只是會不會用電腦。',
    left: { name: '商業經營科', group: '商業與管理群', entryTrack: '統測對應：商業與管理群', icon: '📈', summary: '從會計、經濟、行銷到門市與商業管理，理解一門生意如何運作。', courses: ['會計與經濟', '行銷與商業管理', '門市或電商基礎'], practice: '商品企劃、行銷提案、帳務練習與商業個案分析。', fit: '對市場、商品、溝通或規劃有興趣，也不排斥數字與報表。', misconception: '不只是學做生意；會計與帳務等細節性內容通常占很大部分。' },
    right: { name: '資料處理科', group: '商業與管理群', entryTrack: '統測對應：商業與管理群', icon: '🗂️', summary: '結合商業管理與資訊應用，著重資料整理、程式、資料庫與數位工具。', courses: ['程式設計與資料庫', '商業資訊與文書處理', '數位工具與專題'], practice: '資料整理、資料庫設計、程式或商業資訊專題。', fit: '喜歡電腦操作、整理資料與邏輯思考，也能耐心處理格式與細節。', misconception: '不是只學打字或 Office；不少學校會有程式、資料庫與資訊應用。' },
    decision: { left: '更想理解行銷、會計與經營決策 → 優先了解商業經營科。', right: '更想用資訊工具解決商業與資料問題 → 優先了解資料處理科。' },
    choiceQuestions: [
      { prompt: '你想看懂一間店或品牌怎麼運作，最想先研究？', left: '商品、顧客、行銷與帳務', right: '資料、系統與數位工具' },
      { prompt: '做專題時，你比較想負責？', left: '企劃、行銷提案或經營分析', right: '資料庫、程式或數位流程' },
      { prompt: '你願意花時間練習的是？', left: '會計、報表與商業判斷', right: '資料整理、邏輯與電腦操作' },
    ],
  },
  {
    id: 'early-childhood-beauty', label: '幼兒保育科 vs 美容科', question: '都屬家政群，但每天面對的專業完全不同。',
    left: { name: '幼兒保育科', group: '家政群', entryTrack: '統測對應：家政群幼保類', icon: '🧸', summary: '認識幼兒發展、照護、安全與活動設計，培養與孩子及家庭溝通的基礎。', courses: ['幼兒發展與保育', '活動設計與教具製作', '健康、安全與溝通'], practice: '設計活動、觀察紀錄、教具製作與情境演練。', fit: '喜歡陪伴孩子、有耐心與責任感，也願意學習發展與安全知識。', misconception: '喜歡小孩不等於適合；照護、規劃、安全與溝通都需要專業訓練。' },
    right: { name: '美容科', group: '家政群', entryTrack: '統測對應：家政群生活應用類', icon: '💇', summary: '學習美容、美髮、造型、衛生與顧客服務，將美感轉化為實務技術。', courses: ['美容、美髮與造型', '皮膚衛生與安全', '服務溝通與作品呈現'], practice: '造型操作、練習作品、衛生流程與服務演練。', fit: '喜歡美感與手作，能長時間練習技術，也願意面對客人與回饋。', misconception: '不只是打扮；需要熟練技術、衛生觀念與穩定的服務態度。' },
    decision: { left: '更想理解孩子、設計活動與照護支持 → 優先了解幼兒保育科。', right: '更想練習造型技術與美感作品 → 優先了解美容科。' },
    choiceQuestions: [
      { prompt: '你希望自己的專業作品更接近？', left: '一套能讓孩子參與的活動設計', right: '一個完成度高的造型或作品' },
      { prompt: '面對人時，你更在意？', left: '理解發展需求、陪伴與安全', right: '溝通需求、提供技術與美感建議' },
      { prompt: '你願意長期磨練哪種能力？', left: '觀察、照護、活動規劃與溝通', right: '手部技術、衛生流程與作品呈現' },
    ],
  },
  {
    id: 'advertising-interior', label: '廣告設計科 vs 室內空間設計科', question: '都愛設計，但一個做視覺、一個做空間。',
    left: { name: '廣告設計科', group: '設計群', entryTrack: '統測對應：設計群', icon: '🖼️', summary: '以平面、影像、品牌與視覺傳達為主，讓訊息能被看見、理解與記住。', courses: ['色彩、構成與繪畫', '平面與數位設計', '攝影、影像與作品集'], practice: '海報、品牌識別、插畫、影像與數位作品製作。', fit: '喜歡畫面、字體、故事與數位創作，能接受作品反覆修改。', misconception: '不是只有美感；要學設計方法、軟體操作與清楚表達設計想法。' },
    right: { name: '室內空間設計科', group: '設計群', entryTrack: '統測對應：設計群', icon: '🏠', summary: '結合空間規劃、製圖、材料與模型，思考人如何在空間中生活與使用。', courses: ['空間設計與工程圖學', '模型製作與電腦繪圖', '材料、結構與施工概念'], practice: '畫平面圖、做模型、規劃動線與完成空間提案。', fit: '有空間感，喜歡模型、建築或規劃，也能處理尺寸與技術細節。', misconception: '不只是布置房間；製圖、尺寸、材料與施工概念都很重要。' },
    decision: { left: '更在意畫面、品牌、影像與視覺故事 → 優先了解廣告設計科。', right: '更在意空間、模型、動線與建築感 → 優先了解室內空間設計科。' },
    choiceQuestions: [
      { prompt: '你最想完成的設計成果是？', left: '能傳達品牌與故事的視覺作品', right: '能讓人好好使用的空間提案' },
      { prompt: '你更常注意生活中的？', left: '海報、字體、影像與畫面風格', right: '房間配置、動線、尺寸與建築' },
      { prompt: '你願意花更多時間練習？', left: '繪畫、影像、排版與數位設計', right: '製圖、模型、材料與空間規劃' },
    ],
  },
];

export default function MajorComparisonPage() {
  const [selectedId, setSelectedId] = useState(matchups[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, 'left' | 'right'>>({});
  const selected = matchups.find((item) => item.id === selectedId) || matchups[0];
  const leftVotes = Object.values(quizAnswers).filter((value) => value === 'left').length;
  const rightVotes = Object.values(quizAnswers).filter((value) => value === 'right').length;
  const quizComplete = Object.keys(quizAnswers).length === selected.choiceQuestions.length;

  const chooseMatchup = (id: string) => {
    setSelectedId(id);
    setQuizAnswers({});
  };

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-sky-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><ArrowLeft className="h-4 w-4" />返回首頁</a>
        <div className="py-10"><div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-sky-800"><Sparkles className="h-4 w-4" />科別探索工具</div><h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">相似科別 PK</h1><p className="mt-4 max-w-3xl text-base font-bold leading-8 text-slate-700 sm:text-lg">科名相近，不代表每天學的內容一樣。從課程、實作與適合特質，找出更值得深入了解的方向。</p></div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><p className="text-sm font-black text-sky-700">先選一組你正在猶豫的科別</p><div className="mt-4 flex gap-3 overflow-x-auto pb-2">{matchups.map((item) => <button key={item.id} onClick={() => chooseMatchup(item.id)} className={`shrink-0 rounded-xl border-2 px-4 py-3 text-left text-sm font-black transition-all ${selected.id === item.id ? 'border-slate-900 bg-sky-500 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-900 hover:bg-sky-50'}`}>{item.label}</button>)}</div></div>

      <section className="mt-8"><div className="rounded-2xl border-4 border-slate-900 bg-amber-200 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><p className="text-sm font-black text-amber-900">本組問題</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">{selected.question}</h2></div>
        <DirectComparison selected={selected} />
        <QuickChoice selected={selected} answers={quizAnswers} leftVotes={leftVotes} rightVotes={rightVotes} complete={quizComplete} onChoose={(index, value) => setQuizAnswers((current) => ({ ...current, [index]: value }))} />
        <div className="mt-7 grid gap-6 lg:grid-cols-2"><MajorCard major={selected.left} tone="sky" /><MajorCard major={selected.right} tone="violet" /></div>
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-2"><DecisionCard title={`比較偏向 ${selected.left.name} 的你`} text={selected.decision.left} tone="sky" /><DecisionCard title={`比較偏向 ${selected.right.name} 的你`} text={selected.decision.right} tone="violet" /></section>
      <section className="mt-7 rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><div className="flex items-start gap-3"><Lightbulb className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" /><div><h2 className="text-xl font-black">最後別只看科名</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-600">此頁整理群科課程重點，不是各校保證開設的必修清單；同一科在不同學校的課程、設備與特色專題仍可能不同。升學分類為統測群（類）別參考，實際招生、採計與校系名額以當學年度官方簡章為準。</p><div className="mt-4 flex flex-wrap gap-3"><a href={withBasePath('/vocational-encyclopedia')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><BookOpen className="h-4 w-4" />查看職群科系百科</a><a href={withBasePath('/family-dialogue')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-rose-500 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">和家長一起整理差異</a><a href="https://www.techadmi.edu.tw/page.php?gid=967&pid=1014" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">查看官方統測說明</a></div></div></div></section>
    </section>
  </main>;
}

function MajorCard({ major, tone }: { major: Major; tone: 'sky' | 'violet' }) {
  const palette = tone === 'sky' ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-violet-50 border-violet-300 text-violet-800';
  return <article className="overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><header className={`border-b-4 border-slate-900 p-6 ${palette}`}><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white text-3xl">{major.icon}</div><div><p className="text-xs font-black">{major.group}</p><h2 className="mt-1 text-3xl font-black text-slate-900">{major.name}</h2></div></div><p className="mt-3 inline-flex rounded-full border border-slate-900/20 bg-white/70 px-3 py-1 text-xs font-black text-slate-700">{major.entryTrack}</p><p className="mt-4 text-sm font-bold leading-7 text-slate-700">{major.summary}</p></header><div className="space-y-5 p-6"><Info title="常見課程重點" items={major.courses} /><Info title="可能的實作" items={[major.practice]} /><Info title="你可能會喜歡，如果你…" items={[major.fit]} /><div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4"><p className="text-sm font-black text-amber-900">常見誤解</p><p className="mt-2 text-sm font-bold leading-7 text-slate-700">{major.misconception}</p></div></div></article>;
}

function DirectComparison({ selected }: { selected: Matchup }) {
  const rows = [
    { label: '真正的核心', left: selected.left.summary, right: selected.right.summary },
    { label: '常見課程重點', left: selected.left.courses.join('、'), right: selected.right.courses.join('、') },
    { label: '會做出的成果', left: selected.left.practice, right: selected.right.practice },
    { label: '你要能接受的挑戰', left: selected.left.fit, right: selected.right.fit },
    { label: '升學分類參考', left: selected.left.entryTrack.replace('統測對應：', ''), right: selected.right.entryTrack.replace('統測對應：', '') },
  ];

  return <section className="mt-6 overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><div className="grid border-b-4 border-slate-900 bg-slate-900 text-white sm:grid-cols-[1fr_180px_1fr]"><div className="p-4 text-center text-lg font-black">{selected.left.icon} {selected.left.name}</div><div className="hidden border-x-2 border-white/30 p-4 text-center text-xs font-black sm:block">直接比較</div><div className="p-4 text-center text-lg font-black">{selected.right.icon} {selected.right.name}</div></div><div>{rows.map((row) => <div key={row.label} className="grid border-b-2 border-slate-200 last:border-0 sm:grid-cols-[1fr_180px_1fr]"><div className="p-4 text-sm font-bold leading-7 text-slate-700 sm:text-right">{row.left}</div><div className="border-y-2 border-slate-200 bg-slate-50 p-3 text-center text-xs font-black text-slate-900 sm:border-x-2 sm:border-y-0">{row.label}</div><div className="p-4 text-sm font-bold leading-7 text-slate-700">{row.right}</div></div>)}</div></section>;
}

function QuickChoice({ selected, answers, leftVotes, rightVotes, complete, onChoose }: { selected: Matchup; answers: Record<number, 'left' | 'right'>; leftVotes: number; rightVotes: number; complete: boolean; onChoose: (index: number, value: 'left' | 'right') => void }) {
  const result = leftVotes === rightVotes ? '兩邊各有吸引你的地方，先把這兩科都列為候選，再看目標學校的實際課表與設備。' : leftVotes > rightVotes ? `你的回答目前更偏向 ${selected.left.name}。這不是定論，而是提醒你優先看它的課程與學校。` : `你的回答目前更偏向 ${selected.right.name}。這不是定論，而是提醒你優先看它的課程與學校。`;
  return <section className="mt-7 rounded-2xl border-4 border-slate-900 bg-gradient-to-br from-rose-50 to-amber-50 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-6"><div><p className="text-sm font-black text-rose-700">一分鐘選科判斷</p><h2 className="mt-1 text-2xl font-black">不要問「哪個比較好」，先選你更願意面對的日常。</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-600">每題只能選一邊；這不是性向測驗，只是把你的猶豫變成具體問題。</p></div><div className="mt-5 space-y-4">{selected.choiceQuestions.map((question, index) => <article key={question.prompt} className="rounded-2xl border-2 border-slate-900 bg-white p-4"><p className="font-black leading-7 text-slate-900">{index + 1}. {question.prompt}</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button onClick={() => onChoose(index, 'left')} aria-pressed={answers[index] === 'left'} className={`rounded-xl border-2 p-3 text-left text-sm font-black transition-all ${answers[index] === 'left' ? 'border-slate-900 bg-sky-500 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]' : 'border-slate-200 bg-sky-50 text-slate-800 hover:border-slate-900'}`}>{selected.left.icon} {question.left}</button><button onClick={() => onChoose(index, 'right')} aria-pressed={answers[index] === 'right'} className={`rounded-xl border-2 p-3 text-left text-sm font-black transition-all ${answers[index] === 'right' ? 'border-slate-900 bg-violet-500 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]' : 'border-slate-200 bg-violet-50 text-slate-800 hover:border-slate-900'}`}>{selected.right.icon} {question.right}</button></div></article>)}</div>{complete && <div className="mt-5 rounded-2xl border-4 border-slate-900 bg-emerald-300 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><p className="text-sm font-black text-emerald-950">你的目前傾向</p><p className="mt-1 text-lg font-black leading-8">{result}</p><p className="mt-2 text-xs font-bold text-emerald-950">作答：{selected.left.name} {leftVotes} 題／{selected.right.name} {rightVotes} 題</p></div>}</section>;
}

function Info({ title, items }: { title: string; items: string[] }) {
  return <div><h3 className="text-sm font-black text-slate-900">{title}</h3><ul className="mt-2 space-y-2">{items.map((item) => <li key={item} className="flex gap-2 text-sm font-bold leading-6 text-slate-600"><Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}</ul></div>;
}

function DecisionCard({ title, text, tone }: { title: string; text: string; tone: 'sky' | 'violet' }) {
  const palette = tone === 'sky' ? 'border-sky-500 bg-sky-50 text-sky-950' : 'border-violet-500 bg-violet-50 text-violet-950';
  return <div className={`rounded-2xl border-4 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${palette}`}><p className="text-sm font-black">{title}</p><p className="mt-2 text-lg font-black leading-8">{text}</p></div>;
}
