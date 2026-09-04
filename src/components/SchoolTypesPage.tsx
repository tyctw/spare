import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Compass,
  ExternalLink,
  GraduationCap,
  Layers,
  Target,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';

type Tone = 'emerald' | 'sky' | 'amber' | 'rose' | 'purple';

const schoolTypes: Array<{
  title: string;
  alias: string;
  years: string;
  tone: Tone;
  icon: React.ElementType;
  definition: string;
  learning: string;
  suited: string;
  nextStep: string;
  reminder: string;
}> = [
  {
    title: '普通型高級中等學校',
    alias: '普高／高中',
    years: '3 年制',
    tone: 'emerald',
    icon: BookOpen,
    definition: '依法以基本學科為主，著重強化通識能力。課程以國文、英文、數學、社會、自然等一般科目為核心，並有校訂必修與多元選修。',
    learning: '適合在學科基礎上加深加廣、透過選修探索領域；各校的班群、特色課程與選修差異很大，應逐校查看課程計畫。',
    suited: '喜歡或不排斥學科學習，想保留較多大學科系選擇，或尚在探索學術方向的學生。',
    nextStep: '畢業後可依資格與當年度簡章，透過繁星推薦、申請入學、分發入學、特殊選才等進入一般大學；也可報考科技校院或其他進路。',
    reminder: '不是每所「高中」的選修與班群都相同；不要只看校名，請比較課程地圖、加深加廣選修與通勤條件。',
  },
  {
    title: '技術型高級中等學校',
    alias: '技高／高職',
    years: '3 年制',
    tone: 'sky',
    icon: Compass,
    definition: '依法以專業及實習科目為主，培養專門技術與職業能力。依群、科規劃課程，包含一般科目、專業科目、實習及專題實作。',
    learning: '會較早進入特定專業領域，例如機械、電機與電子、商管、設計、餐旅、家政、外語、農業等；實際科別與實習設備依學校而異。',
    suited: '對某類職群已有初步興趣，喜歡實作、專題、操作或作品累積，也願意在三年內持續深化同一專業方向的學生。',
    nextStep: '可就業或依資格與當年度簡章，透過統測、技優保送／甄審、甄選入學、技職繁星等管道升讀科技校院；亦有其他大學進路。',
    reminder: '「有證照」不等於一定適合。先看該科課表、實習內容、專題、校外實習安排與畢業生進路，再決定。',
  },
  {
    title: '綜合型高級中等學校',
    alias: '綜高／綜中',
    years: '3 年制',
    tone: 'amber',
    icon: Target,
    definition: '依法提供基本學科、專業及實習課程，輔導學生選修適性課程。其精神是先探索、再依性向選擇學術或專門學程。',
    learning: '一般在前期安排共同與探索課程，後續依校內實際開設的學程選修。分流年級、可選學程及名額並非每校一致。',
    suited: '尚未確定要走學術或技職，但希望在高中階段保有試探與轉向空間，且願意主動了解學程規則的學生。',
    nextStep: '依所修學程、採計科目與當年度簡章，可規劃一般大學或科技校院的相關升學管道。',
    reminder: '務必確認「目標學程是否真的開設、何時分流、是否有人數門檻、能否選到想要的課」。校名有綜高不代表所有方向都能選。',
  },
  {
    title: '單科型高級中等學校',
    alias: '單科型高中',
    years: '3 年制',
    tone: 'rose',
    icon: GraduationCap,
    definition: '依法以特定學科領域為核心課程，讓學習性向明顯的學生持續發展潛能。常見發展方向可能與藝術、體育、科學或其他專長領域相關。',
    learning: '專長領域的課程與訓練比重較集中；入學、修課與成果要求須依個別學校或班別規定判斷。',
    suited: '已有明確興趣、能力或訓練目標，並能投入長期練習、作品、競賽或術科準備的學生。',
    nextStep: '可依專長及當年度招生規定，準備術科、作品集、競賽成果、學習歷程或相關升學考試，銜接大專校院。',
    reminder: '「單科型」是法定學校類型；一般高中裡的藝才班、體育班或特色班不必然等同於單科型高中，請以招生簡章與校方公告為準。',
  },
  {
    title: '五年制專科學校',
    alias: '五專',
    years: '5 年制',
    tone: 'purple',
    icon: Layers,
    definition: '五專招收國中畢業生，修業五年；畢業後取得副學士學位。它與前三類高中不同，屬專科教育體系，會較早、較長時間地培養專業能力。',
    learning: '課程結合一般教育、專業課程與實習；各校科可能安排證照、校外實習或專題。科別內容、實習時數與住宿條件應逐校確認。',
    suited: '對特定專業已有相當明確的興趣，希望在五年中循序累積專業與實務能力，且能接受較早選定領域的學生。',
    nextStep: '取得副學士後可就業，也可依資格與當年度規定報考二技、插班／轉學等進修管道。',
    reminder: '五專有完全免試、優先免試、聯合免試等招生方式；採計項目、時程與名額會變動，必須看當學年度簡章。',
  },
];

const comparisons = [
  ['修業與定位', '3 年，以基本學科與通識能力為主。', '3 年，以專業、實習與職業能力為主。', '3 年，結合學科與專業／實習，重點在適性選課。', '3 年，以特定領域為核心，發展明確專長。', '5 年，國中畢業後直接進入專科教育。'],
  ['學習重心', '學科加深加廣、校訂與多元選修。', '群科專業、實習、專題實作與技能養成。', '先探索，再依校內學程安排分流。', '專長領域課程、訓練與成果累積。', '一般教育加專業課程、實習與職能養成。'],
  ['較適合的狀況', '想保留大學科系探索空間，或偏好學科學習。', '已對某職群有興趣，喜歡實作或作品導向學習。', '尚未決定普高或技高，希望有探索期。', '興趣與能力已有明確方向，願長期投入。', '已大致確定專業方向，願意較早選定領域。'],
  ['畢業後常見規劃', '一般大學為主，也可規劃科技校院等進路。', '科技校院與就業為常見方向，也有其他進路。', '依修讀學程規劃一般大學或科技校院。', '依專長準備相關校系、術科或成果資料。', '取得副學士後就業，或續讀二技、插班／轉學等。'],
];

const toneClasses: Record<Tone, { card: string; text: string; border: string; dot: string }> = {
  emerald: { card: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  sky: { card: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-300', dot: 'bg-sky-500' },
  amber: { card: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500' },
  rose: { card: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300', dot: 'bg-rose-500' },
  purple: { card: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-500' },
};

function Detail({ label, text, tone }: { label: string; text: string; tone: Tone }) {
  const style = toneClasses[tone];
  return <div><div className={`mb-2 flex items-center gap-2 text-sm font-black ${style.text}`}><span className={`h-2 w-2 rounded-full ${style.dot}`} />{label}</div><p className="text-sm font-bold leading-7 text-slate-700">{text}</p></div>;
}

export default function SchoolTypesPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-sky-50"><div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:px-4"><ArrowLeft className="h-4 w-4" />返回首頁</a>
        <div className="py-8 sm:py-10"><div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:px-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-sky-100"><Building2 className="h-5 w-5 text-sky-700" /></div><div><p className="text-xs font-black uppercase tracking-widest text-slate-500">School Type Guide</p><p className="text-sm font-black text-slate-700">高中與五專進路比較</p></div></div>
          <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">學校類型解析</h1>
          <p className="mt-4 max-w-4xl text-[15px] font-bold leading-8 text-slate-700 sm:mt-5 sm:text-lg">國中畢業後可選擇普通型、技術型、綜合型、單科型高級中等學校，或五年制專科學校。它們沒有絕對高低，差別在課程重心、探索時間與後續規劃。請用興趣、學習方式與可接受的投入程度來選，而不是只看名稱或分數。</p>
        </div>
      </div></section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className={pageNavigationAsideClassName}><PageNavigation navClassName="w-full rounded-2xl border-4 border-slate-900 bg-white p-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-4" itemLayoutClassName="grid gap-2 lg:block lg:space-y-2" items={[{ id: 'overview', label: '五種學校類型', className: 'block text-left' }, { id: 'comparison', label: '快速比較', className: 'block text-left' }, { id: 'choose', label: '選校前檢查', className: 'block text-left' }, { id: 'sources', label: '官方資料與提醒', className: 'block text-left' }]} /></aside>
        <div className="min-w-0 space-y-6 sm:space-y-8">
          <section id="overview" className="scroll-mt-8"><div className="mb-4"><h2 className="text-2xl font-black sm:text-3xl">五種學校類型</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-600">以下以法定定位與常見課程規劃說明。實際開設科別、學程、選修、實習與招生名額，仍要回到各校課程計畫與當年度簡章確認。</p></div><div className="grid gap-5">{schoolTypes.map((type) => { const Icon = type.icon; const tone = toneClasses[type.tone]; return <article key={type.title} className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-7 sm:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><div className="flex flex-col gap-5 lg:flex-row"><div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 ${tone.card}`}><Icon className={`h-7 w-7 ${tone.text}`} /></div><div className="min-w-0 flex-1"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-xl font-black sm:text-2xl">{type.title}</h3><p className={`mt-1 text-sm font-black ${tone.text}`}>{type.alias}</p></div><span className={`w-fit rounded-lg border-2 ${tone.border} ${tone.card} px-3 py-1 text-xs font-black ${tone.text}`}>{type.years}</span></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Detail label="課程與定位" text={type.definition} tone={type.tone} /><Detail label="學習樣貌" text={type.learning} tone={type.tone} /><Detail label="適合的學生" text={type.suited} tone={type.tone} /><Detail label="畢業後的規劃" text={type.nextStep} tone={type.tone} /></div><p className="mt-5 rounded-xl border-2 border-amber-300 bg-amber-50 p-3 text-sm font-bold leading-7 text-slate-700"><span className="font-black text-amber-800">選擇提醒：</span>{type.reminder}</p></div></div></article>; })}</div></section>

          <section id="comparison" className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-8 sm:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><h2 className="text-2xl font-black sm:text-3xl">快速比較</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-600">這是規劃方向，不是招生資格或保證結果；每年採計方式與各校安排可能調整。</p><div className="mt-5 space-y-4 md:hidden">{comparisons.map(([topic, ...values]) => <article key={topic} className="rounded-xl border-2 border-slate-900 bg-slate-50 p-4"><h3 className="text-base font-black">{topic}</h3><div className="mt-3 space-y-3">{schoolTypes.map((type, index) => <div key={type.title} className="rounded-lg border border-slate-200 bg-white p-3"><p className={`text-xs font-black ${toneClasses[type.tone].text}`}>{type.alias}</p><p className="mt-1 text-sm font-bold leading-7 text-slate-700">{values[index]}</p></div>)}</div></article>)}</div><div className="mt-6 hidden overflow-x-auto md:block"><table className="w-full min-w-[1050px] border-collapse text-left"><thead><tr><th className="border-b-4 border-slate-900 px-3 py-3 text-sm font-black text-slate-500">比較項目</th>{schoolTypes.map((type) => <th key={type.title} className={`border-b-4 border-slate-900 px-3 py-3 text-sm font-black ${toneClasses[type.tone].text}`}>{type.alias}</th>)}</tr></thead><tbody>{comparisons.map(([topic, ...values]) => <tr key={topic} className="border-b border-slate-200 last:border-b-0"><td className="bg-slate-50 px-3 py-4 text-sm font-black text-slate-700">{topic}</td>{values.map((value, index) => <td key={`${topic}-${index}`} className="px-3 py-4 text-sm font-bold leading-7 text-slate-700">{value}</td>)}</tr>)}</tbody></table></div></section>

          <section id="choose" className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-amber-300 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-8 sm:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><h2 className="text-2xl font-black sm:text-3xl">選校前，先回答這四件事</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border-2 border-slate-900 bg-white p-5"><h3 className="text-lg font-black">1. 我喜歡怎麼學？</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-700">喜歡閱讀、解題與學科探究，不代表只能選普高；喜歡動手做也不代表只看技高。請直接看課表與實作比例，判斷自己能否持續投入。</p></div><div className="rounded-2xl border-2 border-slate-900 bg-white p-5"><h3 className="text-lg font-black">2. 我現在的方向有多明確？</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-700">方向尚不明確，可優先考慮探索空間與選修；若已有明確專長或職群興趣，則比較該校科的課程、設備、師資與成果機會。</p></div><div className="rounded-2xl border-2 border-slate-900 bg-white p-5"><h3 className="text-lg font-black">3. 三年或五年後，我想保留哪些選擇？</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-700">先寫下可能想走的校系與工作方向，再回推需要的學科、專業、術科或作品準備；不要把單一考試當成唯一選項。</p></div><div className="rounded-2xl border-2 border-slate-900 bg-white p-5"><h3 className="text-lg font-black">4. 現實條件能不能配合？</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-700">通勤時間、住宿、學費與助學、實習地點、家人支持及校園環境都會影響三到五年的學習品質，應一併比較。</p></div></div></section>

          <section className="rounded-2xl border-4 border-slate-900 bg-indigo-50 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-7"><h2 className="text-2xl font-black">想比較通勤與生活條件？</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">使用獨立比較單，填入兩所候選校科的通勤、費用、住宿與家人討論情況，也可直接列印給學生與家長使用。</p><a href={withBasePath('/life-feasibility')} className="mt-5 inline-flex w-full justify-center rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0_#0f172a] sm:w-auto">開啟生活條件比較單</a></section>

          <section id="sources" className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-8 sm:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><h2 className="text-2xl font-black sm:text-3xl">官方資料與重要提醒</h2><p className="mt-3 text-sm font-bold leading-7 text-slate-700">本頁依《高級中等教育法》第 5 條、十二年國教課綱及技專招生官方資訊整理。入學管道、會考採計、比序、名額、科別、修課與畢業規定均可能因年度、就學區與學校不同而變動。</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><a href="https://www.tntcsh.tn.edu.tw/ischool/publish_page/13/?cid=246" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border-2 border-slate-900 bg-slate-50 p-4 text-sm font-black hover:bg-sky-50">高級中等教育法：四類高中定義 <ExternalLink className="h-4 w-4" /></a><a href="https://www.techadmi.edu.tw/guide-page.php?gid=567" target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border-2 border-slate-900 bg-slate-50 p-4 text-sm font-black hover:bg-sky-50">技專校院招策會：五專多元入學 <ExternalLink className="h-4 w-4" /></a></div><div className="mt-5 rounded-xl border-2 border-rose-300 bg-rose-50 p-4 text-sm font-bold leading-7 text-slate-700"><span className="font-black text-rose-800">最後確認：</span>填志願前請下載當學年度、所屬招生區的正式簡章，並查閱目標學校的招生科別與課程計畫；本頁是協助比較的導覽，不取代官方公告。</div></section>
        </div>
      </section>
    </main>
  );
}
