import React from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  Download,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { withBasePath } from "../lib/routes";
import PageNavigation, { pageNavigationAsideClassName } from "./PageNavigation";

const steps = [
  {
    title: "輸入或掃描邀請碼",
    icon: KeyRound,
    tone: "bg-amber-50 text-amber-700 border-amber-300",
    desc: "首頁最上方先輸入主辦單位提供的邀請碼；也可以使用 QR Code 掃描功能。邀請碼用於啟用分析，請勿把含個人資料的截圖公開分享。",
  },
  {
    title: "設定分析條件",
    icon: SlidersHorizontal,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-300",
    desc: "選擇使用身分、學校公私立偏好與學校類型。若選擇職業類科，還可以再設定想優先查看的職群；不確定時可先選不拘，再用結果篩選。",
  },
  {
    title: "選擇就學區",
    icon: MapPin,
    tone: "bg-rose-50 text-rose-700 border-rose-300",
    desc: "依你的報名資格選擇適用就學區。不同區域的比序與計分方式可能不同；點選頁面上的計分說明，可先閱讀本站整理的規則摘要。",
  },
  {
    title: "填入會考成績",
    icon: Calculator,
    tone: "bg-sky-50 text-sky-700 border-sky-300",
    desc: "依成績通知單填入國文、英文、數學、自然、社會的等級與標示，並選擇寫作測驗級分。不要自行把 A、B、C 換算成百分制或總分。",
  },
  {
    title: "送出前確認資料",
    icon: CheckCircle2,
    tone: "bg-teal-50 text-teal-700 border-teal-300",
    desc: "再次核對邀請碼、就學區、學校偏好、五科等級與寫作級分。尤其就學區與成績一旦填錯，分析結果就沒有參考價值。",
  },
  {
    title: "開始分析並檢視結果",
    icon: Award,
    tone: "bg-violet-50 text-violet-700 border-violet-300",
    desc: "確認無誤後按「開始落點分析」。系統會產生獨立結果頁，提供條件摘要、推薦校科與分析說明；這是規劃輔助，不是錄取保證。",
  },
];

const scoreNotes = [
  "五科請依成績通知單的等級與標示選取，例如 A++、A+、A、B++、B+、B、C；實際下拉選項以首頁顯示為準。",
  "寫作測驗請填 0 至 6 級分。是否採計、採計方式及同分比序，會因就學區與年度而不同。",
  "若還沒有正式成績，可先用預估成績做情境比較；結果應視為方向參考，正式選填前請重新以成績通知單核對。",
  "本站顯示的區域計分摘要與換算結果方便初步比較；最終仍以當學年度、所屬就學區的招生簡章與公告為準。",
];

const resultTips = [
  {
    title: "先看條件摘要",
    desc: "先確認就學區、學校類型、公私立偏好、職群與各科成績是否正確。條件錯了，後面的推薦都不應直接採用。",
  },
  {
    title: "再看推薦校科與區間",
    desc: "依落點區間比較校科，並使用搜尋與篩選縮小範圍。歷年資料只能看趨勢，招生名額、報名人數與比序改變都會影響結果。",
  },
  {
    title: "加入比較，不要只看一間",
    desc: "結果頁可將有興趣的校科加入比較清單，最多 4 所。一起比對類型、地區、群科、分數與歷年資料，較容易看出取捨。",
  },
];

const planningTips = [
  { title: '查看校科內容', desc: '點進校科前，先看它屬於哪一種學制、群科或學程；再回到學校公告確認實際課程、特色課程與招生名額。' },
  { title: '比較候選校科', desc: '把有興趣的校科加入比較清單，從學制、科別、地點、歷年資料與個人需求一起看，不要只依單一分數做決定。' },
  { title: '建立模擬志願序', desc: '將想填的校科加入「模擬志願序」，依想讀程度、落點參考與生活條件排列；先求排序符合意願，再檢查風險配置。' },
  { title: '分享或列印討論', desc: '可分享唯讀清單給家長、老師檢視，或列印目前排序與空白討論表。分享頁的副本可自行修改，不會更動原清單。' },
];

const finalChecks = [
  '以成績通知單再次核對五科等級、標示與寫作測驗級分，並確認選擇的是正確就學區。',
  '逐一確認志願的學校、科別或學程、招生名額與報名資格；名稱相近的校科尤其要核對代碼。',
  '依當年度招生簡章確認超額比序、志願選填時間、繳件或報到規定；本工具與歷年資料不能取代官方系統。',
  '和家人討論通勤、住宿、學費、課程方向與就讀意願；志願序應由最想就讀且符合資格的選項開始排列。',
];

export default function InstructionsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-blue-50">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <a
            href={withBasePath("/")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>
          <div className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:px-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    User Guide
                  </p>
                  <p className="text-sm font-black text-slate-700">
                    從輸入條件到閱讀結果
                  </p>
                </div>
              </div>
              <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">
                使用說明
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">
                用這份流程完成一次落點分析，並正確解讀結果。填志願前，請務必回到當年度招生簡章確認資格、採計項目、比序、名額與時程。
              </p>
            </div>
            <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
                <h2 className="text-lg font-black">使用前先知道</h2>
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                本工具協助整理可能方向與校科選項，不會保證錄取，也不取代學校輔導老師、招生單位或正式公告。
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className={pageNavigationAsideClassName}>
          <PageNavigation
            items={[
              { id: "flow", label: "分析流程" },
              { id: "scores", label: "成績怎麼填" },
              { id: "results", label: "結果怎麼看" },
              { id: "planning", label: "建立志願清單" },
              { id: "actions", label: "正式選填前確認" },
            ]}
          />
        </aside>
        <div className="min-w-0 space-y-8">
          <section id="flow" className="scroll-mt-8">
            <div className="mb-5">
              <h2 className="text-2xl font-black sm:text-3xl">六步完成分析</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                資料輸入越完整，越方便做初步比較；但每一項條件都請以自己實際的報名與成績資料為準。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.title}
                    className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 ${step.tone}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-500">
                          STEP {index + 1}
                        </p>
                        <h3 className="mt-1 text-xl font-black">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
          <section
            id="scores"
            className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-7"
          >
            <div className="flex gap-4">
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">
                  成績怎麼填才不會誤判
                </h2>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                  系統不是要你輸入原始答對題數，而是選擇成績通知單上的等級、標示與寫作級分。
                </p>
              </div>
              <Calculator className="ml-auto h-8 w-8 shrink-0 text-emerald-700" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {scoreNotes.map((note) => (
                <div
                  key={note}
                  className="flex gap-3 rounded-xl border-2 border-slate-200 bg-slate-50 p-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm font-bold leading-7 text-slate-700">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <section id="results" className="scroll-mt-8">
            <div className="mb-5 flex items-center gap-3">
              <Search className="h-7 w-7 text-blue-700" />
              <h2 className="text-2xl font-black sm:text-3xl">結果怎麼看</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {resultTips.map((tip) => (
                <article
                  key={tip.title}
                  className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
                >
                  <h3 className="text-lg font-black">{tip.title}</h3>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                    {tip.desc}
                  </p>
                </article>
              ))}
            </div>
          </section>
          <section id="planning" className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-indigo-50 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-7">
            <div className="flex items-center gap-3"><Target className="h-7 w-7 text-indigo-700" /><div><h2 className="text-2xl font-black sm:text-3xl">從結果到志願清單</h2><p className="mt-1 text-sm font-bold leading-7 text-slate-600">分析完成後，依序探索、比較、排序與討論，能讓志願清單更貼近自己的選擇。</p></div></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">{planningTips.map((tip, index) => <article key={tip.title} className="rounded-2xl border-2 border-slate-900 bg-white p-4"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-700 text-xs font-black text-white">{index + 1}</span><h3 className="mt-3 text-lg font-black">{tip.title}</h3><p className="mt-2 text-sm font-bold leading-7 text-slate-600">{tip.desc}</p></article>)}</div>
          </section>
          <section
            id="actions"
            className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-amber-300 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-7"
          >
            <div>
              <h2 className="text-2xl font-black sm:text-3xl">正式選填前最後確認</h2>
              <ul className="mt-3 space-y-2 text-sm font-bold leading-7 text-slate-800">{finalChecks.map((check) => <li key={check} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0" />{check}</li>)}</ul>
            </div>
            <div className="mt-5 border-t-2 border-amber-500 pt-4">
              <p className="flex items-start gap-2 text-sm font-bold leading-7 text-slate-800">
                <Download className="mt-1 h-4 w-4 shrink-0" />
                若要保留結果，建議匯出後再核對一次輸入的就學區與成績；不要將含邀請碼或其他個人資訊的檔案傳給不信任的對象。
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <a href={withBasePath("/")} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-5 py-3.5 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:w-auto">
                開始落點分析 <Target className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
