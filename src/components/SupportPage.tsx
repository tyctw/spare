import React, { useMemo, useState } from 'react';
import { ArrowLeft, Check, CircleDollarSign, Heart, Info, Mail, Sparkles } from 'lucide-react';
import { withBasePath } from '../lib/routes';

const suggestedAmounts = [50, 100, 300, 500];

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [notice, setNotice] = useState('');
  const amount = useMemo(() => {
    const parsed = Number(customAmount);
    return customAmount !== '' && Number.isFinite(parsed) ? parsed : selectedAmount;
  }, [customAmount, selectedAmount]);
  const selectAmount = (value: number) => { setSelectedAmount(value); setCustomAmount(''); setNotice(''); };
  const handleSupport = () => {
    if (!Number.isInteger(amount) || amount < 1) { setNotice('請輸入至少 NT$ 1 的支持金額。'); return; }
    setNotice(`已記下您想支持 NT$ ${amount.toLocaleString()}；金流服務開通後，將可在此直接完成付款。`);
  };

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="overflow-hidden border-b-4 border-slate-900 bg-rose-50"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"><ArrowLeft className="h-4 w-4" /> 回到首頁</a>
      <div className="relative py-12 sm:py-16"><div className="pointer-events-none absolute -right-8 top-2 h-40 w-40 rounded-full border-4 border-slate-900 bg-amber-300 opacity-80 sm:right-16" /><div className="pointer-events-none absolute right-20 top-28 h-16 w-16 rounded-2xl border-4 border-slate-900 bg-sky-200 rotate-12" /><div className="relative max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><Heart className="h-4 w-4 fill-rose-500 text-rose-500" /> SUPPORT OUR WORK</div><h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">一起讓選校資訊<br />更容易被找到</h1><p className="mt-5 max-w-2xl text-base font-bold leading-8 text-slate-700 sm:text-lg">每一筆小額支持，都會幫助我們持續整理資料、優化工具與維護免費服務，讓學生與家長在重要的選擇前多一份安心。</p></div></div>
    </div></section>
    <section className="mx-auto grid max-w-6xl gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
      <section className="rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[7px_7px_0px_0px_rgba(15,23,42,1)] sm:p-8"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-rose-200 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"><CircleDollarSign className="h-6 w-6 text-rose-700" /></div><div><p className="text-xs font-black tracking-widest text-rose-700">SMALL SUPPORT, BIG IMPACT</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">選擇支持金額</h2></div></div><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{suggestedAmounts.map((value) => <button key={value} type="button" onClick={() => selectAmount(value)} className={`rounded-2xl border-2 border-slate-900 px-3 py-4 text-lg font-black transition ${customAmount === '' && selectedAmount === value ? 'bg-amber-300 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] -translate-y-0.5' : 'bg-white hover:bg-amber-50'}`}>NT$ {value}</button>)}</div><label className="mt-5 block"><span className="text-sm font-black">自訂金額</span><div className="mt-2 flex items-center rounded-2xl border-2 border-slate-900 bg-slate-50 px-4 focus-within:ring-4 focus-within:ring-amber-300/40"><span className="font-black text-slate-500">NT$</span><input type="number" min="1" inputMode="numeric" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value); setNotice(''); }} placeholder="輸入金額" className="w-full bg-transparent px-3 py-4 font-black outline-none" /></div></label><button type="button" onClick={handleSupport} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-rose-500 px-5 py-4 text-lg font-black text-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-rose-600 active:translate-y-0 active:shadow-none"><Heart className="h-5 w-5 fill-current" /> 支持 NT$ {Number.isFinite(amount) && amount > 0 ? amount.toLocaleString() : '—'}</button>{notice && <p role="status" className="mt-5 rounded-2xl border-2 border-emerald-700 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-900"><Check className="mr-2 inline h-4 w-4" />{notice}</p>}<div className="mt-5 flex items-start gap-2 rounded-2xl border-2 border-sky-200 bg-sky-50 p-4 text-sm font-bold leading-6 text-slate-700"><Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" /><p>目前尚未串接金流，本頁不會收集付款資料或進行扣款。完成金流串接後，這個按鈕將引導您進入安全付款流程。</p></div></section>
      <aside className="space-y-5"><section className="rounded-3xl border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[7px_7px_0px_0px_rgba(245,158,11,1)] sm:p-7"><Sparkles className="h-8 w-8 text-amber-300" /><h2 className="mt-4 text-2xl font-black">您的支持會用在哪裡？</h2><ul className="mt-5 space-y-3 text-sm font-bold leading-6 text-indigo-100"><li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-amber-300" />維護與更新升學相關資訊</li><li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-amber-300" />持續改善選校分析工具與操作體驗</li><li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-amber-300" />讓核心服務持續免費開放使用</li></ul></section><section className="rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"><h2 className="text-xl font-black">想先和我們聊聊？</h2><p className="mt-2 text-sm font-bold leading-6 text-slate-600">若您有合作、贊助或金流串接建議，歡迎直接聯絡我們。</p><a href="mailto:tyctw.analyze@gmail.com?subject=%E9%97%9C%E6%96%BC%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81" className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"><Mail className="h-4 w-4" /> 聯絡我們</a></section></aside>
    </section>

    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8" aria-label="售後與退款政策">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8">
          <p className="text-xs font-black tracking-widest text-indigo-700">CUSTOMER SERVICE</p>
          <h2 className="mt-2 text-2xl font-black">售後服務</h2>
          <div className="mt-5 space-y-4 text-sm font-bold leading-7 text-slate-700">
            <p>小額支持為一次性的自願支持，不包含實體商品、數位內容、訂閱或其他持續性服務。付款完成後，您仍可就交易、金額或付款異常向我們提出協助。</p>
            <p>請以付款時使用的電子郵件寄至 <a className="text-indigo-700 underline underline-offset-4" href="mailto:tyctw.analyze@gmail.com?subject=%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81%E5%94%AE%E5%BE%8C%E6%9C%8D%E5%8B%99">tyctw.analyze@gmail.com</a>，並提供付款日期、金額、付款方式與訂單／交易編號；請勿以電子郵件提供完整卡號、驗證碼或網銀密碼。</p>
            <p>付款功能啟用後，將使用 PAYUNi 統一金流處理付款。PAYUNi 為金流服務提供者，不是本頁支持方案的提供者；交易爭議、退款與售後申請仍請先聯絡我們處理。</p>
          </div>
        </article>
        <article className="rounded-3xl border-4 border-slate-900 bg-amber-50 p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-8">
          <p className="text-xs font-black tracking-widest text-amber-700">REFUND & CANCELLATION</p>
          <h2 className="mt-2 text-2xl font-black">退款與取消政策</h2>
          <ol className="mt-5 space-y-4 text-sm font-bold leading-7 text-slate-700">
            <li><span className="font-black text-slate-900">1. 付款前取消：</span>尚未完成付款或付款失敗者，不會成立支持交易，無須辦理退款。</li>
            <li><span className="font-black text-slate-900">2. 付款後退款：</span>若有重複扣款、未授權付款、金額輸入錯誤或其他合理退款事由，請於付款完成後 7 日內提出申請。我們會核對交易資料後以原付款方式辦理退款；實際入帳時間依付款方式、發卡／金融機構及 PAYUNi 的作業流程而定。</li>
            <li><span className="font-black text-slate-900">3. 不適用情況：</span>因本支持不提供商品、數位內容或訂閱權益，並無換貨、補發或續約事項；單純改變支持意願的申請，將依個案及已發生的金流作業狀態處理。</li>
            <li><span className="font-black text-slate-900">4. 爭議交易：</span>如認為交易未經本人授權，請先聯絡發卡／付款機構並同步通知我們。PAYUNi 得依其爭議處理流程暫停或保留爭議交易款項，並依適當證明與處理結果辦理。</li>
          </ol>
          <p className="mt-5 border-t-2 border-dashed border-amber-300 pt-4 text-xs font-bold leading-6 text-slate-600">付款功能啟用前，本頁不收集付款資料且不會扣款。PAYUNi 的付款方式與交易處理以其當時公開規範為準。</p>
          <a className="mt-4 inline-flex text-sm font-black text-indigo-700 underline underline-offset-4" href="https://www.payuni.com.tw/terms" target="_blank" rel="noreferrer">查看 PAYUNi 統一金流服務條款</a>
        </article>
      </div>
    </section>
  </main>;
}
