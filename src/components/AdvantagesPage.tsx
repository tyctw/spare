import React from 'react';
import {
  ArrowLeft,
  BarChart3,
  Calculator,
  CheckCircle2,
  Database,
  FileSearch,
  HeartHandshake,
  Map,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';

const principles = [
  {
    title: '降低計算錯誤',
    desc: '各就學區的比序、積分、加權與換算方式不完全相同，人工試算容易漏看規則或輸入錯誤。我們希望透過工具化整理，減少重複計算與判斷失誤。',
    icon: Calculator,
    tone: 'emerald',
  },
  {
    title: '補足資訊落差',
    desc: '網路上常見資料多集中在前幾志願與明星學校，中後段學校、高中職與不同群科的錄取資訊相對不足。我們希望讓更多學校資料被納入參考。',
    icon: Database,
    tone: 'sky',
  },
  {
    title: '維持免費使用',
    desc: '升學規劃是許多家庭共同面對的問題。我們希望盡可能把基礎查詢與分析功能免費開放，降低取得資訊的成本。',
    icon: HeartHandshake,
    tone: 'rose',
  },
];

const problems = [
  '各區計分方式不同，學生與家長自行換算時可能發生錯誤。',
  '落點資訊常被簡化成少數熱門學校，難以看見更多適合自己的選項。',
  '高中職、群科、歷年錄取狀況與中後段學校資料分散，查找成本高。',
  '升學決策常伴隨壓力，我們希望把資料整理成更容易理解的參考。',
];

const features = [
  {
    title: '多區規則整理',
    desc: '依不同就學區整理計分、比序與輸入欄位，降低使用者自行對照規則的負擔。',
    icon: Map,
  },
  {
    title: '志願方向參考',
    desc: '協助整理可能落點、學校類型、群科方向與志願討論素材，讓選擇不只看單一分數。',
    icon: Target,
  },
  {
    title: '資料與結果匯出',
    desc: '提供分析結果整理與匯出，方便學生、家長與老師後續討論與保存。',
    icon: FileSearch,
  },
  {
    title: '清楚的輔助定位',
    desc: '落點分析是輔助工具，不取代正式簡章、招生公告、輔導老師或專業升學諮詢。',
    icon: ShieldCheck,
  },
];

const toneClasses: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  sky: 'bg-sky-50 text-sky-700 border-sky-300',
  rose: 'bg-rose-50 text-rose-700 border-rose-300',
};

export default function AdvantagesPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>

          <div className="py-8 sm:py-10">
            <div className="mb-5 inline-flex max-w-full items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:px-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-100 sm:h-11 sm:w-11">
                <Sparkles className="h-5 w-5 text-indigo-700 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-slate-500">About TW Admission Helper</p>
                <p className="text-sm font-black text-slate-700">系統優點與關於我們</p>
              </div>
            </div>
            <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">讓升學資訊更容易取得</h1>
            <p className="mt-4 max-w-4xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">
              也讓每一位學生都能更安心地做選擇。TW升學落點分析希望以免費、易用、清楚的方式，協助學生與家長整理會考成績、各區計分規則、學校錄取資訊與志願評估方向。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border-2 border-slate-900 bg-amber-100 p-3">
                <HeartHandshake className="h-6 w-6 text-amber-700" />
              </div>
              <h2 className="text-2xl font-black sm:text-3xl">我們的理念</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm font-bold leading-8 text-slate-700 sm:text-base">
              <p>
                我們相信升學資訊不應該只服務少數人，也不應該因為資料分散、規則複雜或查詢門檻高，而讓學生與家長在重要選擇前感到無助。
              </p>
              <p>
                因此，本服務的核心目標是免費提供大家可使用的升學輔助工具。不論是前段、中段、後段學校，或是高中、高職、五專等不同升學路徑，都應該有被整理、被看見、被比較的機會。
              </p>
            </div>
          </section>

          <aside className="rounded-2xl border-4 border-slate-900 bg-slate-900 p-5 text-white shadow-[5px_5px_0px_0px_rgba(99,102,241,1)] sm:p-6">
            <BarChart3 className="h-8 w-8 text-indigo-200" />
            <h2 className="mt-4 text-2xl font-black">我們如何看待落點分析</h2>
            <p className="mt-4 text-sm font-bold leading-7 text-slate-200">
              落點分析不是保證錄取，也不能取代正式簡章、招生單位公告、學校輔導老師或專業升學諮詢。它是一種輔助工具，幫助使用者快速整理可能方向、發現更多選項，並在填寫志願前更有依據地討論。
            </p>
          </aside>
        </div>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <div className={`mb-4 inline-flex rounded-xl border-2 p-3 ${toneClasses[item.tone]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-700">{item.desc}</p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border-2 border-slate-900 bg-rose-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-rose-700" />
            </div>
            <h2 className="text-2xl font-black sm:text-3xl">我們正在解決的問題</h2>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {problems.map((problem) => (
              <div key={problem} className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-700">
                {problem}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-black sm:text-3xl">系統優點</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl border-2 border-slate-900 bg-indigo-100 p-3">
                      <Icon className="h-6 w-6 text-indigo-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{feature.title}</h3>
                      <p className="mt-2 text-sm font-bold leading-7 text-slate-700">{feature.desc}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border-4 border-slate-900 bg-amber-300 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8">
          <h2 className="text-2xl font-black sm:text-3xl">持續優化</h2>
          <p className="mt-4 max-w-4xl text-sm font-bold leading-8 text-slate-800 sm:text-base">
            我們會持續優化資料整理、計算邏輯與使用體驗，也歡迎使用者回報錯誤、提供補充資料或提出改善建議。
          </p>
        </section>
      </section>
    </main>
  );
}
