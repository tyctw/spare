import React, { useMemo, useState } from 'react';
import { ArrowLeft, CircleDollarSign, CreditCard, FileText, Heart, Info, Mail } from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';

const suggestedAmounts = [50, 100, 300, 500];
const supportEmail = 'tyctw.analyze@gmail.com';

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amount = useMemo(() => {
    const value = Number(customAmount);
    return customAmount !== '' && Number.isFinite(value) ? value : selectedAmount;
  }, [customAmount, selectedAmount]);

  const selectAmount = (value: number) => { setSelectedAmount(value); setCustomAmount(''); setNotice(''); };
  const startEcpayCheckout = async () => {
    if (!Number.isInteger(amount) || amount < 1 || amount > 50_000) {
      setNotice('請輸入 NT$ 1～50,000 的整數支持金額。');
      return;
    }

    setIsSubmitting(true);
    setNotice('');
    try {
      const payment = await callBackend<{ actionUrl: string; fields: Record<string, string | number> }>({ action: 'createEcpaySupportPayment', amount });
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payment.actionUrl;
      Object.entries(payment.fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('ECPay checkout creation failed:', error);
      setNotice('目前無法建立綠界付款訂單，請稍後再試或來信聯絡我們。');
      setIsSubmitting(false);
    }
  };

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-rose-50"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a]"><ArrowLeft className="h-4 w-4" />回到首頁</a>
      <div className="py-12 sm:py-16"><div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_#0f172a]"><Heart className="h-4 w-4 fill-rose-500 text-rose-500" />SUPPORT OUR WORK</div><h1 className="mt-5 text-4xl font-black sm:text-6xl">小額支持，讓工具持續免費</h1><p className="mt-5 max-w-3xl text-base font-bold leading-8 text-slate-700">你的支持將用於資料更新、工具維護與使用體驗改善；不提供保證錄取或個別升學諮詢服務。</p></div>
    </div></section>
    <section className="mx-auto grid max-w-6xl gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
      <section className="rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[7px_7px_0_#0f172a] sm:p-8"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-rose-200"><CircleDollarSign className="h-6 w-6 text-rose-700" /></div><div><p className="text-xs font-black tracking-widest text-rose-700">SMALL SUPPORT, REAL IMPACT</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">選擇支持金額</h2><p className="mt-1 text-sm font-bold text-slate-600">付款後將前往綠界科技 ECPay 的安全付款頁面。</p></div></div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{suggestedAmounts.map((value) => <button key={value} type="button" onClick={() => selectAmount(value)} className={`rounded-2xl border-2 border-slate-900 px-3 py-4 text-lg font-black transition ${customAmount === '' && selectedAmount === value ? 'bg-amber-300 shadow-[3px_3px_0_#0f172a] -translate-y-0.5' : 'bg-white hover:bg-amber-50'}`}>NT$ {value}</button>)}</div>
        <label className="mt-5 block"><span className="text-sm font-black">自訂金額</span><div className="mt-2 flex items-center rounded-2xl border-2 border-slate-900 bg-slate-50 px-4"><span className="font-black text-slate-500">NT$</span><input type="number" min="1" max="50000" inputMode="numeric" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value); setNotice(''); }} placeholder="請輸入整數金額" className="w-full bg-transparent px-3 py-4 font-black outline-none" /></div></label>
        <button type="button" onClick={startEcpayCheckout} disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-rose-500 px-5 py-4 text-lg font-black text-white shadow-[5px_5px_0_#0f172a] transition hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60"><Heart className="h-5 w-5 fill-current" />{isSubmitting ? '正在前往綠界付款…' : `支持 NT$ ${Number.isFinite(amount) && amount > 0 ? amount.toLocaleString() : '--'}`}</button>
        {notice && <p role="status" className="mt-5 rounded-2xl border-2 border-amber-700 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900"><Info className="mr-2 inline h-4 w-4" />{notice}</p>}
      </section>
      <aside className="space-y-5"><section className="rounded-3xl border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[6px_6px_0_#f59e0b]"><CreditCard className="h-7 w-7 text-amber-300" /><h2 className="mt-3 text-xl font-black">信用卡與非信用卡付款</h2><p className="mt-2 text-sm font-bold leading-6 text-indigo-100">綠界付款頁會依你的裝置與商店已開通的服務，顯示信用卡、ATM、超商代碼／條碼等可用方式。</p></section><section className="rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[6px_6px_0_#0f172a]"><FileText className="h-7 w-7 text-indigo-700" /><h2 className="mt-3 text-xl font-black">付款前請閱讀</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><a href={withBasePath('/after-sales-service')} className="rounded-xl border-2 border-slate-900 px-3 py-3 text-center text-sm font-black">售後服務</a><a href={withBasePath('/refund-cancellation-policy')} className="rounded-xl border-2 border-slate-900 bg-amber-300 px-3 py-3 text-center text-sm font-black">退款與取消政策</a></div></section><section className="rounded-3xl border-4 border-slate-900 bg-amber-100 p-6 shadow-[6px_6px_0_#0f172a]"><Mail className="h-7 w-7 text-rose-700" /><h2 className="mt-3 text-xl font-black">需要協助？</h2><a href={`mailto:${supportEmail}?subject=%E9%97%9C%E6%96%BC%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81`} className="mt-4 inline-flex break-all text-sm font-black text-rose-700 underline">{supportEmail}</a></section></aside>
    </section>
  </main>;
}
