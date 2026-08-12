import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  FileCheck2,
  Layers,
  Link as LinkIcon,
  ListChecks,
  MapPinned,
  Route,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';

const reminders = [
  {
    title: '先看序位，再看分數',
    desc: '個別序位能反映同考區、同分數附近的競爭位置，比只看單一年錄取分數更適合做風險判斷。',
  },
  {
    title: '志願序積分優先保住',
    desc: '各就學區對志願序與同校同群的計分方式不同，主力志願應盡量落在不扣分或少扣分的範圍。',
  },
  {
    title: '只填願意就讀的學校',
    desc: '保守志願不是隨便填，而是要兼顧通勤、校風、學習壓力、科別興趣與家庭可接受度。',
  },
  {
    title: '用多版草稿比較',
    desc: '先建立夢幻版、穩健版與保守版，再和導師、輔導老師或家長討論，不要只靠一次排序決定。',
  },
];

const tiers = [
  {
    label: '前段志願序',
    title: '夢幻區',
    desc: '放真正想挑戰、略高於目前落點的校科。落榜也不應影響同群組或前段主力志願的積分。',
    tone: 'border-rose-300 bg-rose-50 text-rose-700',
  },
  {
    label: '中段志願序',
    title: '實際區',
    desc: '放和序位、歷年錄取狀況、招生名額較接近的校科，通常是最需要細排順序的主戰場。',
    tone: 'border-sky-300 bg-sky-50 text-sky-700',
  },
  {
    label: '後段志願序',
    title: '保守區',
    desc: '放錄取機率較高、自己也願意就讀的校科。不要把不想去的選項當成安全墊。',
    tone: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  },
];

const workflow = [
  '確認會考等級、標示、作文級分與就學區身分。',
  '查個人序位區間，搭配歷年錄取分數與招生名額判斷風險。',
  '依興趣、通勤、校風、升學或技職方向先刪掉不適合的選項。',
  '在不扣志願序積分的範圍內安排夢幻、實際、保守三段。',
  '最後檢查是否填入足夠保守志願，並以正式簡章規定為準。',
];

const pitfalls = [
  '只看去年最低錄取分數，忽略招生名額、考題難度與當年度學生分布。',
  '把所有熱門校科放在前面，卻沒有留下足夠的實際區與保守區。',
  '不知道同校多科、同群連續填寫在自己考區如何計分。',
  '為了填滿志願而加入完全不想就讀、通勤負擔過重或方向不合的校科。',
];

export default function StrategyPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>

          <div className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-3 rounded-lg border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:px-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-100">
                  <Target className="h-6 w-6 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase text-slate-500">Volunteer Strategy</p>
                  <p className="text-sm font-black text-slate-700">序位、志願序與風險配置</p>
                </div>
              </div>
              <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">志願選填攻略</h1>
              <p className="mt-4 max-w-4xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">
                把志願表當成一份風險配置：先守住志願序積分，再依序位、興趣、通勤與校科適配，排出夢幻、實際、保守三段。
              </p>
            </div>

            <div className="rounded-lg border-4 border-slate-900 bg-slate-900 p-5 text-white shadow-[5px_5px_0px_0px_rgba(251,191,36,1)]">
              <ShieldCheck className="h-8 w-8 text-amber-300" />
              <h2 className="mt-4 text-2xl font-black">最高原則</h2>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-200">
                確保「志願序積分」不被不必要扣分。不同就學區規則不同，請搭配正式簡章與招生委員會公告確認。
              </p>
              <a
                href={withBasePath('/mock-volunteer')}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border-2 border-white bg-amber-300 px-4 py-2 text-sm font-black text-slate-900 transition-all hover:bg-amber-200"
              >
                開啟模擬志願序
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className={pageNavigationAsideClassName}>
          <PageNavigation
            items={[
              { id: 'reminders', label: '選填原則' },
              { id: 'ranking', label: '個別序位' },
              { id: 'tiers', label: '三段配置' },
              { id: 'workflow', label: '填表流程' },
              { id: 'pitfalls', label: '常見誤區' },
            ]}
          />
        </aside>

        <div className="min-w-0 space-y-8">
          <section id="reminders" className="scroll-mt-8">
            <div className="mb-5">
              <h2 className="text-2xl font-black sm:text-3xl">選填四大原則</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                先把判斷順序固定下來，後面比較學校時才不會被單一分數或熱門程度帶著走。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {reminders.map((item, index) => (
                <article key={item.title} className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className="mb-4 inline-flex rounded-lg border-2 border-slate-900 bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                    原則 {index + 1}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-600">{item.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="ranking" className="scroll-mt-8 rounded-lg border-4 border-slate-900 bg-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-sky-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-7 w-7 text-sky-700" />
                    <h2 className="text-2xl font-black sm:text-3xl">什麼是個別序位？</h2>
                  </div>
                  <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-slate-700">
                    個別序位是在自己考區內，扣除已錄取報到的學生後，再依本區超額比序順序排列得到的序位區間。它適合用來判斷「同分或相近分數」時的相對風險。
                  </p>
                </div>
                <a
                  href="https://tyctw.github.io/score/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black text-sky-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                >
                  <LinkIcon className="h-4 w-4" />
                  序位分享
                </a>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-3">
              <div className="rounded-lg border-2 border-slate-900 bg-slate-50 p-4">
                <Compass className="h-6 w-6 text-indigo-700" />
                <h3 className="mt-3 text-lg font-black">用來看位置</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-600">同考區的競爭位置比單純總分更有參考價值。</p>
              </div>
              <div className="rounded-lg border-2 border-slate-900 bg-slate-50 p-4">
                <MapPinned className="h-6 w-6 text-emerald-700" />
                <h3 className="mt-3 text-lg font-black">搭配區域規則</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-600">不同就學區比序項目不同，序位解讀也要回到該區規則。</p>
              </div>
              <div className="rounded-lg border-2 border-slate-900 bg-slate-50 p-4">
                <AlertCircle className="h-6 w-6 text-rose-700" />
                <h3 className="mt-3 text-lg font-black">不是錄取保證</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-600">仍會受到招生名額、志願分布與當年度選填行為影響。</p>
              </div>
            </div>
          </section>

          <section id="tiers" className="scroll-mt-8">
            <div className="mb-5">
              <div className="flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-emerald-700" />
                <h2 className="text-2xl font-black sm:text-3xl">志願區間策略</h2>
              </div>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                在不被扣志願序積分的群組範圍內，將志願依序分成三段，讓前面能挑戰、中段能落點、後段能保底。
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {tiers.map((tier) => (
                <article key={tier.title} className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <div className={`mb-4 inline-flex rounded-lg border-2 px-3 py-1 text-xs font-black ${tier.tone}`}>{tier.label}</div>
                  <h3 className="text-2xl font-black text-slate-900">{tier.title}</h3>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-600">{tier.desc}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 rounded-lg border-4 border-slate-900 bg-emerald-50 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-start gap-3">
                <Layers className="mt-1 h-6 w-6 shrink-0 text-emerald-700" />
                <p className="text-sm font-bold leading-7 text-slate-700">
                  技術型高中或普通型高中附設職業類科，若同校多類科連續填寫，部分考區會視為同一志願或同群計分。這對不扣分配置很重要，務必依所在考區簡章確認。
                </p>
              </div>
            </div>
          </section>

          <section id="workflow" className="scroll-mt-8 rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-7">
            <div className="flex items-center gap-3">
              <Route className="h-7 w-7 text-amber-700" />
              <h2 className="text-2xl font-black sm:text-3xl">填表流程</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {workflow.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-lg border-2 border-slate-900 bg-slate-50 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-300 text-sm font-black">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm font-bold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="pitfalls" className="scroll-mt-8 rounded-lg border-4 border-slate-900 bg-rose-50 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-7">
            <div className="flex items-center gap-3">
              <FileCheck2 className="h-7 w-7 text-rose-700" />
              <h2 className="text-2xl font-black sm:text-3xl">填送前檢查</h2>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {pitfalls.map((item) => (
                <div key={item} className="flex gap-3 rounded-lg border-2 border-slate-900 bg-white p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />
                  <p className="text-sm font-bold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
