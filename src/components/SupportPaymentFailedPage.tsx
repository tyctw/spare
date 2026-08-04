import { ArrowLeft, CircleAlert, Heart, Mail, RefreshCcw, ShieldCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';

const supportEmail = 'tyctw.analyze@gmail.com';

export default function SupportPaymentFailedPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      <section className="relative overflow-hidden border-b-4 border-slate-900 bg-[#eef3ff]">
        <div aria-hidden="true" className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-rose-200/70 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-indigo-200/70 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8"><a href={withBasePath('/')} className="inline-flex items-center gap-3 rounded-2xl border-4 border-slate-900 bg-white px-5 py-3 text-base font-black text-slate-800 shadow-[5px_5px_0_#0f172a] transition hover:-translate-y-0.5 hover:text-indigo-700 active:translate-y-0 active:shadow-none"><ArrowLeft className="h-5 w-5" />回到首頁</a></div>
      </section>

      <section className="relative mx-auto -mt-2 max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-[2rem] border-4 border-slate-900 bg-white p-6 text-center shadow-[8px_8px_0_#0f172a] sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border-4 border-slate-900 bg-rose-100 text-rose-600"><CircleAlert className="h-10 w-10" /></div>
          <p className="mt-7 text-xs font-black tracking-[0.16em] text-rose-600">PAYMENT NOT COMPLETED</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">這筆付款尚未完成</h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-8 text-slate-600">別擔心，這不代表已經扣款。你可以返回小額支持頁重新操作；若銀行已通知扣款，請先保留交易畫面並與我們聯絡。</p>

          <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
            <a href={withBasePath('/support')} className="inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-rose-500 px-5 py-4 text-base font-black text-white shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-rose-600 active:translate-y-0 active:shadow-none"><RefreshCcw className="h-5 w-5" />重新支持</a>
            <a href={`mailto:${supportEmail}?subject=%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81%E4%BB%98%E6%AC%BE%E5%95%8F%E9%A1%8C`} className="inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-5 py-4 text-base font-black text-slate-800 shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:text-indigo-700 active:translate-y-0 active:shadow-none"><Mail className="h-5 w-5" />聯絡客服</a>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <section className="rounded-[1.5rem] border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><ShieldCheck className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-black">先確認交易狀態</h2><p className="mt-2 text-sm font-medium leading-6 text-slate-600">請勿在付款結果未明確前重複操作。若有銀行通知或付款畫面，請先保留作為查詢資料。</p></section>
          <section className="rounded-[1.5rem] border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700"><Heart className="h-5 w-5 fill-rose-700" /></div><h2 className="mt-4 text-lg font-black">需要協助時</h2><p className="mt-2 text-sm font-medium leading-6 text-slate-600">來信時請提供付款日期、金額、付款方式與綠界交易編號或訂單編號；請勿提供完整卡號或安全碼。</p></section>
        </div>
      </section>
    </main>
  );
}
