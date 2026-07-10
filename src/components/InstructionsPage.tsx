import React from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  Download,
  FileText,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';

const quickSteps = [
  {
    title: '輸入邀請碼',
    desc: '先輸入系統提供的邀請碼，完成驗證後即可開始使用落點分析功能。',
    icon: KeyRound,
    tone: 'bg-sky-50 text-sky-700 border-sky-300',
  },
  {
    title: '選擇身分與條件',
    desc: '依序選擇學生、家長或教師身分，再設定地區、學校公私立、學校類型與技職群別。',
    icon: MapPin,
    tone: 'bg-rose-50 text-rose-700 border-rose-300',
  },
  {
    title: '填入會考成績',
    desc: '輸入五科等級、標示與作文級分，系統會依目前條件進行篩選與排序。',
    icon: Calculator,
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  },
  {
    title: '檢視與比較結果',
    desc: '查看推薦學校、分數區間與補充資訊，必要時加入比較清單或匯出資料留存。',
    icon: Award,
    tone: 'bg-violet-50 text-violet-700 border-violet-300',
  },
];

const scoreNotes = [
  '五科請填入 A++、A+、A、B++、B+、B 或 C。',
  '作文請填入 0 到 6 級分。',
  '若不確定等級換算方式，可從首頁開啟「等級說明」查看。',
  '資料送出前請再次確認地區與學校類型，這兩項會明顯影響結果範圍。',
];

const resultTips = [
  {
    title: '推薦結果不是錄取保證',
    desc: '系統提供的是落點輔助判讀，正式招生名額、簡章規則與分發結果仍以官方公告為準。',
  },
  {
    title: '先用篩選縮小範圍',
    desc: '可用學校名稱、行政區、學校類型或公私立條件縮小清單，避免一次比較過多學校。',
  },
  {
    title: '善用比較與歷年資料',
    desc: '把重點學校加入比較後，再搭配歷年分數、交通位置與科別方向一起判斷。',
  },
];

export default function InstructionsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-blue-50">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>

          <div className="grid gap-8 py-8 sm:py-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex max-w-full items-center gap-3 rounded-lg border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:px-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-blue-100">
                  <BookOpen className="h-6 w-6 text-blue-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase text-slate-500">User Guide</p>
                  <p className="text-sm font-black text-slate-700">會考落點分析系統</p>
                </div>
              </div>
              <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">使用說明</h1>
              <p className="mt-4 max-w-3xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">
                這個頁面整理完整操作流程，從邀請碼、條件設定、成績輸入到結果判讀，讓第一次使用也能照著步驟完成分析。
              </p>
            </div>

            <div className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-700" />
                <h2 className="text-lg font-black">使用前提醒</h2>
              </div>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-600">
                請準備會考五科等級、作文級分，以及想查詢的就學區。若資料尚未確定，可以先用保守估計試算，再回來調整。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <nav className="rounded-lg border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500">
              <FileText className="h-4 w-4" />
              頁面導覽
            </div>
            <div className="grid gap-2">
              <a className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100" href="#flow">操作流程</a>
              <a className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100" href="#scores">成績填寫</a>
              <a className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100" href="#results">結果判讀</a>
              <a className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-100" href="#actions">後續操作</a>
            </div>
          </nav>
        </aside>

        <div className="min-w-0 space-y-8">
          <section id="flow" className="scroll-mt-8">
            <div className="mb-5">
              <h2 className="text-2xl font-black sm:text-3xl">操作流程</h2>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                依照四個步驟完成基本分析；每一步都會影響後續結果，建議由上而下填寫。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {quickSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 ${step.tone}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-slate-500">STEP {index + 1}</div>
                        <h3 className="mt-1 text-xl font-black">{step.title}</h3>
                        <p className="mt-2 text-sm font-bold leading-7 text-slate-600">{step.desc}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="scores" className="scroll-mt-8 rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">成績填寫</h2>
                <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                  成績欄位建議一次填完，系統才能給出較完整的排序與比較結果。
                </p>
              </div>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-emerald-50">
                <Calculator className="h-7 w-7 text-emerald-700" />
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {scoreNotes.map((note) => (
                <div key={note} className="flex gap-3 rounded-lg border-2 border-slate-200 bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm font-bold leading-7 text-slate-700">{note}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="results" className="scroll-mt-8">
            <div className="mb-5 flex items-center gap-3">
              <Search className="h-7 w-7 text-blue-700" />
              <h2 className="text-2xl font-black sm:text-3xl">結果判讀</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {resultTips.map((tip) => (
                <article key={tip.title} className="rounded-lg border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  <h3 className="text-lg font-black">{tip.title}</h3>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-600">{tip.desc}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="actions" className="scroll-mt-8 rounded-lg border-4 border-slate-900 bg-amber-300 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-center">
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">後續操作</h2>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-800 sm:text-base">
                  分析完成後，可以匯出 TXT、Excel 或 JSON，也可以列印結果給家長、導師或輔導老師討論。若發現資料疑問，請用首頁的錯誤回報功能提供線索。
                </p>
              </div>
              <a
                href={withBasePath('/')}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-900 bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              >
                開始使用
                <Download className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
