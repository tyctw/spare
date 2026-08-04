import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, CircleDollarSign, CreditCard, FileText, Heart, Info, Mail } from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';

const suggestedAmounts = [50, 100, 300, 500];
const supportEmail = 'tyctw.analyze@gmail.com';
const paymentMethods = ['信用卡', 'Apple Pay', '網路 ATM', 'ATM 虛擬帳號', '超商條碼', '超商代碼'];
const supportPaymentStorageKey = 'spare.support.payment';

type SupportPaymentTracking = {
  merchantTradeNo: string;
  createdAt: number;
};

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thankYouAmount, setThankYouAmount] = useState<number | null>(() => (
    new URLSearchParams(window.location.search).get('preview') === 'thanks' ? 100 : null
  ));
  const amount = useMemo(() => {
    const value = Number(customAmount);
    return customAmount !== '' && Number.isFinite(value) ? value : selectedAmount;
  }, [customAmount, selectedAmount]);

  // 從綠界付款頁按返回時，瀏覽器可能會從快取還原此頁，保留送出中的狀態。
  useEffect(() => {
    let cancelled = false;
    let checking = false;

    const checkPaymentStatus = async () => {
      setIsSubmitting(false);
      if (checking) return;

      const stored = window.sessionStorage.getItem(supportPaymentStorageKey);
      if (!stored) return;

      let tracking: SupportPaymentTracking;
      try {
        tracking = JSON.parse(stored) as SupportPaymentTracking;
      } catch {
        window.sessionStorage.removeItem(supportPaymentStorageKey);
        return;
      }

      if (!tracking.merchantTradeNo || Date.now() - tracking.createdAt > 24 * 60 * 60 * 1000) {
        window.sessionStorage.removeItem(supportPaymentStorageKey);
        return;
      }

      checking = true;
      try {
        // 綠界通知可能比使用者回到頁面晚一小段時間，因此短暫重試。
        for (let attempt = 0; attempt < 3 && !cancelled; attempt += 1) {
          const payment = await callBackend<{ status: string; amount?: number }>({
            action: 'getEcpaySupportPaymentStatus',
            merchantTradeNo: tracking.merchantTradeNo,
          }, { timeoutMs: 8_000 });

          if (payment.status === 'paid') {
            window.sessionStorage.removeItem(supportPaymentStorageKey);
            setThankYouAmount(Number(payment.amount) || null);
            return;
          }
          if (payment.status === 'failed') {
            window.sessionStorage.removeItem(supportPaymentStorageKey);
            setNotice('這筆付款尚未完成；若已付款，請稍候再重新整理頁面確認。');
            return;
          }
          if (attempt < 2) await new Promise((resolve) => window.setTimeout(resolve, 1500));
        }
      } catch (error) {
        console.warn('Unable to check ECPay payment status:', error);
      } finally {
        checking = false;
      }
    };

    void checkPaymentStatus();
    window.addEventListener('pageshow', checkPaymentStatus);
    return () => {
      cancelled = true;
      window.removeEventListener('pageshow', checkPaymentStatus);
    };
  }, []);

  const selectAmount = (value: number) => {
    setSelectedAmount(value);
    setCustomAmount('');
    setNotice('');
  };

  const startEcpayCheckout = async () => {
    if (!Number.isInteger(amount) || amount < 10 || amount > 50_000) {
      setNotice('自訂金額請輸入 NT$ 10 至 50,000 的整數。');
      return;
    }

    setIsSubmitting(true);
    setNotice('');
    try {
      const payment = await callBackend<{ actionUrl: string; fields: Record<string, string | number> }>(
        { action: 'createEcpaySupportPayment', amount },
        { timeoutMs: 12_000 },
      );
      const merchantTradeNo = String(payment.fields.MerchantTradeNo || '');
      if (merchantTradeNo) {
        const tracking: SupportPaymentTracking = { merchantTradeNo, createdAt: Date.now() };
        window.sessionStorage.setItem(supportPaymentStorageKey, JSON.stringify(tracking));
      }
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
      const message = error instanceof Error ? error.message : '未知錯誤';
      setNotice(`暫時無法建立付款，請確認設定後再試。${message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="overflow-hidden border-b-4 border-slate-900 bg-rose-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a]">
            <ArrowLeft className="h-4 w-4" />回到首頁
          </a>
          <div className="py-12 sm:py-16 lg:grid lg:min-h-[34rem] lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-16 lg:py-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black shadow-[3px_3px_0_#0f172a]">
                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />SUPPORT OUR WORK
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">讓每一次選擇，<br />都有更可靠的方向</h1>
              <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">升學選擇不該被繁雜資訊困住。您的支持，會化為更即時的資料校對、更好用的工具，以及持續免費開放的服務，讓每位學生都能更安心地規劃下一步。</p>
            </div>
            <div aria-hidden="true" className="relative mx-auto mt-10 hidden h-60 w-60 lg:block lg:mt-0">
              <div className="absolute inset-1 rotate-[-9deg] rounded-[3rem] border-[6px] border-slate-900 bg-amber-300 shadow-[10px_10px_0_#0f172a]" />
              <div className="absolute inset-8 rotate-[-9deg] rounded-[1.75rem] border-4 border-slate-900 bg-[#fffaf1]" />
              <Heart className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-[-9deg] fill-rose-600 text-rose-600" strokeWidth={2.4} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(23rem,.9fr)] lg:items-start lg:gap-10 lg:px-8 lg:py-14">
        <section className="rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[7px_7px_0_#0f172a] sm:p-8 lg:p-9">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-rose-200"><CircleDollarSign className="h-6 w-6 text-rose-700" /></div>
            <div>
              <p className="text-xs font-black tracking-widest text-rose-700">SMALL SUPPORT, REAL IMPACT</p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">選擇支持金額</h2>
              <p className="mt-1 text-sm font-bold text-slate-600">付款後將前往綠界科技 ECPay 的安全付款頁面。</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-9 lg:gap-4">
            {suggestedAmounts.map((value) => <button key={value} type="button" onClick={() => selectAmount(value)} className={`rounded-2xl border-2 border-slate-900 px-3 py-4 text-lg font-black transition ${customAmount === '' && selectedAmount === value ? 'bg-amber-300 shadow-[3px_3px_0_#0f172a] -translate-y-0.5' : 'bg-white hover:bg-amber-50'}`}>NT$ {value}</button>)}
          </div>

          <label className="mt-5 block lg:mt-7">
            <span className="text-sm font-black">自訂金額</span>
            <div className="mt-2 flex items-center rounded-2xl border-2 border-slate-900 bg-slate-50 px-4">
              <span className="font-black text-slate-500">NT$</span>
              <input type="number" min="10" max="50000" inputMode="numeric" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value); setNotice(''); }} placeholder="最低 NT$ 10" className="w-full bg-transparent px-3 py-4 font-black outline-none" />
            </div>
          </label>

          <button type="button" onClick={startEcpayCheckout} disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-rose-500 px-5 py-4 text-lg font-black text-white shadow-[5px_5px_0_#0f172a] transition hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60">
            <Heart className="h-5 w-5 fill-current" />{isSubmitting ? '正在前往綠界付款…' : `支持 NT$ ${Number.isFinite(amount) && amount > 0 ? amount.toLocaleString() : '--'}`}
          </button>
          <div className="mt-6 rounded-2xl border-2 border-slate-300 bg-slate-50 p-4 text-xs font-bold leading-6 text-slate-600">
            <p className="font-black text-slate-800">付款方式金額限制</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>贊助金額最低為 10 元。</li>
              <li>贊助金額超過 6,000 元或小於 34 元，無法使用超商代碼付款。</li>
              <li>贊助金額超過 49,999 元或小於 16 元，無法使用網路 ATM 付款。</li>
              <li>贊助金額超過 49,999 元或小於 16 元，無法使用 ATM 櫃員機付款。</li>
              <li>贊助金額超過 199,999 元或小於 6 元，無法使用信用卡付款。</li>
            </ul>
          </div>
          {notice && <p role="status" className="mt-5 rounded-2xl border-2 border-amber-700 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900"><Info className="mr-2 inline h-4 w-4" />{notice}</p>}
        </section>

        <aside className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[6px_6px_0_#f59e0b] lg:col-span-2 lg:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-rose-200"><Heart className="h-6 w-6 fill-rose-600 text-rose-600" /></div>
              <div><p className="text-xs font-black tracking-widest text-amber-300">YOUR SUPPORT MATTERS</p><h2 className="mt-1 text-xl font-black sm:text-2xl">贊助我們會做什麼？</h2></div>
            </div>
            <ul className="mt-7 grid gap-3 text-sm font-bold leading-6 text-indigo-100 lg:grid-cols-3 lg:gap-4">
              <li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-amber-300" />持續校對、更新升學資訊與校科資料。</li>
              <li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-amber-300" />改善落點分析、志願排序與搜尋工具。</li>
              <li className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-amber-300" />維持核心功能免費，讓更多學生都能使用。</li>
            </ul>
          </section>

          <section className="overflow-hidden rounded-3xl border-4 border-slate-900 bg-white shadow-[6px_6px_0_#0f172a] lg:col-span-2">
            <div className="relative overflow-hidden bg-slate-900 px-6 py-6 text-white sm:px-7">
              <div aria-hidden="true" className="absolute -right-8 -top-12 h-32 w-32 rounded-full border-[18px] border-indigo-400/40" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300 text-slate-900 shadow-[3px_3px_0_#fff]">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div><p className="text-xs font-black tracking-[0.18em] text-amber-300">ECPAY SECURE PAYMENT</p><h2 className="mt-1 text-xl font-black">信用卡與非信用卡付款</h2></div>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {paymentMethods.map((method, index) => <span key={method} className={`flex min-h-11 items-center justify-center rounded-xl border-2 border-slate-900 px-3 py-2 text-center text-sm font-black shadow-[2px_2px_0_#0f172a] ${index === 0 ? 'bg-amber-300' : index === paymentMethods.length - 1 ? 'bg-rose-100' : 'bg-slate-50'}`}>{method}</span>)}
              </div>
              <p className="mt-5 border-l-4 border-indigo-500 pl-3 text-xs font-bold leading-5 text-slate-600">實際可選付款方式將依綠界付款頁與商店已開通服務顯示。</p>
            </div>
          </section>

          <section className="rounded-3xl border-4 border-slate-900 bg-amber-100 p-6 shadow-[6px_6px_0_#0f172a] sm:p-7 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white text-rose-700"><Mail className="h-5 w-5" /></div>
              <h2 className="text-xl font-black">小額支持聯繫方式</h2>
            </div>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">付款、退款或支持方案相關問題，請來信聯絡，我們會協助處理。</p>
            <a href={`mailto:${supportEmail}?subject=%E9%97%9C%E6%96%BC%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81`} className="mt-5 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black text-rose-700 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-rose-50"><Mail className="h-4 w-4 shrink-0" />{supportEmail}</a>
          </section>

        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
        <div>
          <section className="rounded-3xl border-4 border-slate-900 bg-indigo-600 p-5 text-white shadow-[6px_6px_0_#0f172a] sm:p-6">
            <div className="lg:flex lg:items-center lg:justify-between lg:gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white text-indigo-700"><FileText className="h-5 w-5" /></div>
                <div><h2 className="text-xl font-black">付款前請閱讀</h2><p className="mt-1 text-sm font-bold leading-6 text-indigo-100">了解售後服務與退款規則，讓每一筆支持都更安心。</p></div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:w-[25rem] lg:shrink-0">
              <a href={withBasePath('/after-sales-service')} className="rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-center text-sm font-black text-slate-900 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-slate-50">售後服務</a>
              <a href={withBasePath('/refund-cancellation-policy')} className="rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3 text-center text-sm font-black text-slate-900 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-amber-200">退款與取消政策</a>
              </div>
            </div>
          </section>
        </div>
      </section>

      {thankYouAmount !== null && <div role="dialog" aria-modal="true" aria-labelledby="support-thanks-title" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-rose-50 p-8 text-center shadow-[9px_9px_0_#0f172a]">
          <div aria-hidden="true" className="absolute left-8 top-8 h-4 w-4 animate-ping rounded-full bg-amber-300" />
          <div aria-hidden="true" className="absolute right-10 top-16 h-3 w-3 animate-pulse rounded-full bg-indigo-500" />
          <div aria-hidden="true" className="absolute bottom-14 left-10 h-3 w-3 animate-pulse rounded-full bg-rose-400" />
          <div className="mx-auto flex h-24 w-24 animate-[bounce_1.2s_ease-in-out_2] items-center justify-center rounded-[2rem] border-4 border-slate-900 bg-amber-300 shadow-[5px_5px_0_#0f172a]"><Heart className="h-12 w-12 fill-rose-600 text-rose-600" /></div>
          <p className="mt-7 text-xs font-black tracking-[0.2em] text-rose-700">THANK YOU</p>
          <h2 id="support-thanks-title" className="mt-2 text-3xl font-black">感謝你的支持！</h2>
          <p className="mt-4 font-bold leading-7 text-slate-700">已收到 NT$ {thankYouAmount.toLocaleString()} 的支持。你的心意，會成為我們持續更新與優化工具的力量。</p>
          <button type="button" onClick={() => setThankYouAmount(null)} className="mt-7 w-full rounded-2xl border-[3px] border-slate-900 bg-rose-500 px-5 py-3 font-black text-white shadow-[4px_4px_0_#0f172a] transition hover:bg-rose-600">繼續使用工具</button>
        </div>
      </div>}
    </main>
  );
}
