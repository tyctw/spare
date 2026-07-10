import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Compass,
  FileText,
  GraduationCap,
  Layers,
  Target,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';

const schoolTypes = [
  {
    title: '普通型高中',
    years: '3 年',
    tone: 'emerald',
    icon: BookOpen,
    focus: '以國文、英文、數學、社會、自然等一般學科為主，保留較完整的學術探索空間，適合想先累積基礎能力再決定大學科系的學生。',
    suited: '適合對升大學、跨領域探索、學科研究或未來想走醫學、法政、商管、理工、人文社會等路線仍在觀望的學生。',
    path: '畢業後多以大學學測、分科測驗或特殊選才等管道銜接大學，也可以轉向技職體系或其他升學路徑。',
  },
  {
    title: '技術型高中',
    years: '3 年',
    tone: 'sky',
    icon: Compass,
    focus: '結合專業群科與實作課程，例如電機、商管、餐旅、設計、農業、家政、外語等，讓學生在高中階段就建立專業技能。',
    suited: '適合已經對某個職群有興趣、喜歡動手做、想用作品或技能累積競爭力，並希望升學時能銜接科技大學或四技二專的學生。',
    path: '畢業後可參加統測升科技大學、四技二專，也能用技優、甄選入學、繁星等管道升學，或先就業再進修。',
  },
  {
    title: '綜合型高中',
    years: '3 年',
    tone: 'amber',
    icon: Target,
    focus: '前期保留普通科與職業試探，後期依興趣選擇學術學程或專門學程，兼顧探索與分流。',
    suited: '適合還不確定要走普通高中或技術型高中，但想在高中階段多試一點不同課程，再逐步確認方向的學生。',
    path: '可依修課與學程安排銜接一般大學或科技大學，重點在於及早確認學程要求與升學考科。',
  },
  {
    title: '單科型高中',
    years: '3 年',
    tone: 'rose',
    icon: GraduationCap,
    focus: '聚焦特定領域培育，例如藝術、科學、體育或其他專門領域，課程比一般高中更集中在專長發展。',
    suited: '適合已展現明確專長、願意投入高強度訓練，並能接受課程重心較集中安排的學生。',
    path: '升學通常會搭配術科、競賽成果、作品集、特殊選才或相關科系甄試，需要提早準備學習歷程與專長證明。',
  },
  {
    title: '五專',
    years: '5 年',
    tone: 'purple',
    icon: Layers,
    focus: '以國中畢業後銜接五年一貫的專業培養為主，課程兼具基礎學科、專業課程與實習。',
    suited: '適合很早就確定專業方向，例如護理、餐旅、設計、工程、商管等，並希望用較長時間累積技術能力的學生。',
    path: '畢業後取得副學士，可就業，也可透過二技、插大或其他管道繼續升學。',
  },
];

const comparisons = [
  {
    topic: '課程重心',
    general: '普通型高中重視一般學科與升大學準備，課程彈性較適合延後分流。',
    vocational: '技術型高中重視專業群科與實作，會更早接觸職群能力與證照準備。',
  },
  {
    topic: '適合學生',
    general: '適合還在探索科系，或希望用學科成績銜接一般大學的學生。',
    vocational: '適合已經對職群有興趣，喜歡作品、實作、技能表現的學生。',
  },
  {
    topic: '升學考試',
    general: '多以學測、分科測驗、繁星推薦、申請入學等一般大學管道為主。',
    vocational: '多以統測、技優甄審、甄選入學、技職繁星等技專校院管道為主。',
  },
  {
    topic: '準備方式',
    general: '重點在學科穩定度、閱讀理解、探究能力與學習歷程整理。',
    vocational: '重點在專業科目、實作成果、證照、競賽、專題與學習歷程作品。',
  },
];

const toneClasses: Record<string, { card: string; text: string; border: string; dot: string }> = {
  emerald: { card: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500' },
  sky: { card: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-300', dot: 'bg-sky-500' },
  amber: { card: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500' },
  rose: { card: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300', dot: 'bg-rose-500' },
  purple: { card: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-500' },
};

export default function SchoolTypesPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-sky-50">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:px-4 sm:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回主頁
          </a>

          <div className="py-8 sm:py-10">
            <div className="mb-5 inline-flex max-w-full items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:px-4 sm:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-sky-100 sm:h-11 sm:w-11">
                <Building2 className="h-5 w-5 text-sky-700 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-slate-500">School Type Guide</p>
                <p className="text-sm font-black text-slate-700">高中職與五專路線解析</p>
              </div>
            </div>
            <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">學校類型解析</h1>
            <p className="mt-4 max-w-4xl text-[15px] font-bold leading-8 text-slate-700 sm:mt-5 sm:text-lg">
              選學校類型不是只看分數，而是在判斷自己需要哪一種學習環境。這裡把普通型高中、技術型高中、綜合型高中、單科型高中與五專重新整理成獨立頁面，讓你能快速比較課程重心、適合對象與後續升學路線。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <nav className="w-full rounded-2xl border-4 border-slate-900 bg-white p-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-4 sm:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-500 sm:mb-3">
              <FileText className="h-4 w-4" />
              頁面導覽
            </div>
            <div className="grid grid-cols-2 gap-2 lg:block lg:space-y-2">
              <a href="#overview" className="rounded-xl bg-slate-50 px-3 py-2 text-center text-sm font-black text-slate-700 hover:bg-slate-100 lg:block lg:text-left">類型總覽</a>
              <a href="#comparison" className="rounded-xl bg-slate-50 px-3 py-2 text-center text-sm font-black leading-5 text-slate-700 hover:bg-slate-100 lg:block lg:text-left">普通高中 vs 技術型高中</a>
              <a href="#choose" className="col-span-2 rounded-xl bg-slate-50 px-3 py-2 text-center text-sm font-black text-slate-700 hover:bg-slate-100 lg:col-span-1 lg:block lg:text-left">怎麼選比較穩</a>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 space-y-6 sm:space-y-8">
          <section id="overview" className="scroll-mt-8">
            <div className="mb-4">
              <h2 className="text-2xl font-black sm:text-3xl">類型總覽</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                先用同一套欄位看每種學校的差異，再回頭對照自己的興趣、學習習慣與升學目標。
              </p>
            </div>
            <div className="grid gap-5">
              {schoolTypes.map((type) => {
                const Icon = type.icon;
                const tone = toneClasses[type.tone];
                return (
                  <article key={type.title} className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-7 sm:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                      <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 ${tone.card}`}>
                        <Icon className={`h-7 w-7 ${tone.text}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-xl font-black text-slate-900 sm:text-2xl">{type.title}</h3>
                          <span className={`w-fit rounded-lg border-2 ${tone.border} ${tone.card} px-3 py-1 text-xs font-black ${tone.text}`}>{type.years}</span>
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                          <div>
                            <div className={`mb-2 flex items-center gap-2 text-sm font-black ${tone.text}`}>
                              <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                              課程重心
                            </div>
                            <p className="text-sm font-bold leading-7 text-slate-700">{type.focus}</p>
                          </div>
                          <div>
                            <div className={`mb-2 flex items-center gap-2 text-sm font-black ${tone.text}`}>
                              <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                              適合對象
                            </div>
                            <p className="text-sm font-bold leading-7 text-slate-700">{type.suited}</p>
                          </div>
                          <div>
                            <div className={`mb-2 flex items-center gap-2 text-sm font-black ${tone.text}`}>
                              <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                              升學路線
                            </div>
                            <p className="text-sm font-bold leading-7 text-slate-700">{type.path}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="comparison" className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-8 sm:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-2xl font-black sm:text-3xl">普通型高中 vs 技術型高中</h2>
            <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
              這兩種路線最常被拿來比較，差異不在誰比較好，而是學習節奏與成果呈現方式不同。
            </p>
            <div className="mt-5 grid gap-3 md:hidden">
              {comparisons.map((item) => (
                <article key={item.topic} className="rounded-xl border-2 border-slate-900 bg-slate-50 p-4">
                  <h3 className="text-base font-black text-slate-900">{item.topic}</h3>
                  <div className="mt-3 space-y-3">
                    <div className="rounded-lg border border-emerald-200 bg-white p-3">
                      <p className="text-xs font-black text-emerald-700">普通型高中</p>
                      <p className="mt-1 text-sm font-bold leading-7 text-slate-700">{item.general}</p>
                    </div>
                    <div className="rounded-lg border border-sky-200 bg-white p-3">
                      <p className="text-xs font-black text-sky-700">技術型高中</p>
                      <p className="mt-1 text-sm font-bold leading-7 text-slate-700">{item.vocational}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-6 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="border-b-4 border-slate-900 px-4 py-3 text-sm font-black text-slate-500">比較項目</th>
                    <th className="border-b-4 border-slate-900 px-4 py-3 text-sm font-black text-emerald-700">普通型高中</th>
                    <th className="border-b-4 border-slate-900 px-4 py-3 text-sm font-black text-sky-700">技術型高中</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((item) => (
                    <tr key={item.topic} className="border-b border-slate-200 last:border-b-0">
                      <td className="bg-slate-50 px-4 py-4 text-sm font-black text-slate-700">{item.topic}</td>
                      <td className="px-4 py-4 text-sm font-bold leading-7 text-slate-700">{item.general}</td>
                      <td className="px-4 py-4 text-sm font-bold leading-7 text-slate-700">{item.vocational}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="choose" className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-amber-300 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:p-8 sm:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-2xl font-black sm:text-3xl">怎麼選比較穩？</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border-2 border-slate-900 bg-white p-5">
                <h3 className="text-lg font-black">看興趣是否明確</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-700">
                  如果還想探索多個科系，普通型高中或綜合型高中會比較有彈性。如果已經喜歡特定職群，技術型高中或五專能更早累積專業作品。
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-900 bg-white p-5">
                <h3 className="text-lg font-black">看學習方式</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-700">
                  喜歡閱讀、解題、探究與考科準備，可以偏向普通型高中。喜歡實作、專題、證照與作品呈現，可以優先研究技術型高中或五專。
                </p>
              </div>
              <div className="rounded-2xl border-2 border-slate-900 bg-white p-5">
                <h3 className="text-lg font-black">看升學管道</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-700">
                  不同學校類型會對應不同考試與招生制度。選校前先確認未來想走學測、分科、統測、技優、特殊選才或作品甄試，會比較不容易走冤枉路。
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
