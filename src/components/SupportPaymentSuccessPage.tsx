import { ArrowLeft, Check, Heart, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { withBasePath } from '../lib/routes';

const supportEmail = 'tyctw.analyze@gmail.com';

export default function SupportPaymentSuccessPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      <section className="relative overflow-hidden border-b-4 border-slate-900 bg-[#eef3ff]">
        <div aria-hidden="true" className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-rose-200/70 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-indigo-200/70 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8"><a href={withBasePath('/')} className="inline-flex items-center gap-3 rounded-2xl border-4 border-slate-900 bg-white px-5 py-3 text-base font-black text-slate-800 shadow-[5px_5px_0_#0f172a] transition hover:-translate-y-0.5 hover:text-indigo-700 active:translate-y-0 active:shadow-none"><ArrowLeft className="h-5 w-5" />回到首頁</a></div>
      </section>

      <section className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="rounded-[2rem] border-4 border-slate-900 bg-white p-6 text-center shadow-[8px_8px_0_#0f172a] sm:p-10">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border-4 border-slate-900 bg-rose-500 text-white"><Heart className="h-10 w-10 fill-white" /><Sparkles aria-hidden="true" className="absolute -right-5 -top-4 h-7 w-7 text-amber-400" /></div>
          <p className="mt-7 text-xs font-black tracking-[0.16em] text-rose-600">PAYMENT COMPLETED</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">感謝你的支持！</h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-8 text-slate-600">你的心意，會成為我們持續校對升學資訊、優化工具與維持核心功能免費的力量。</p>
          <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2"><a href={withBasePath('/')} className="inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-rose-500 px-5 py-4 text-base font-black text-white shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-rose-600 active:translate-y-0 active:shadow-none"><Heart className="h-5 w-5 fill-white" />繼續使用工具</a><a href={withBasePath('/support')} className="inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-5 py-4 text-base font-black text-slate-800 shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:text-indigo-700 active:translate-y-0 active:shadow-none"><Check className="h-5 w-5" />返回支持頁</a></div>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2"><section className="rounded-[1.5rem] border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><ShieldCheck className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-black">付款紀錄</h2><p className="mt-2 text-sm font-medium leading-6 text-slate-600">付款結果與實際入帳時間，請以綠界與付款機構的通知及紀錄為準。</p></section><section className="rounded-[1.5rem] border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700"><Mail className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-black">需要協助嗎？</h2><p className="mt-2 text-sm font-medium leading-6 text-slate-600">如有付款、退款或交易問題，歡迎來信聯絡我們。</p><a href={`mailto:${supportEmail}?subject=%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81%E4%BB%98%E6%AC%BE%E5%95%8F%E9%A1%8C`} className="mt-3 inline-flex text-sm font-black text-indigo-700 underline underline-offset-4">{supportEmail}</a></section></div>
      </section>
    </main>
  );
}
