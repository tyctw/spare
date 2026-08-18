import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, CircleDollarSign, CreditCard, FileText, Heart, Info, Mail, HeartHandshake, ReceiptText } from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';

const suggestedAmounts = [50, 100, 300, 500];
const supportEmail = 'tyctw.analyze@gmail.com';
const cardPaymentMethods = ['信用卡', 'Apple Pay'];
const nonCardPaymentMethods = ['網路 ATM', 'ATM 虛擬帳號', '超商條碼', '超商代碼'];
const supportPaymentStorageKey = 'spare.support.payment';

type SupportPaymentTracking = {
  merchantTradeNo: string;
  statusLookupToken: string;
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

      if (!tracking.merchantTradeNo
        || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tracking.statusLookupToken || '')
        || Date.now() - tracking.createdAt > 24 * 60 * 60 * 1000) {
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
            statusLookupToken: tracking.statusLookupToken,
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
      const payment = await callBackend<{
        actionUrl: string;
        fields: Record<string, string | number>;
        statusLookupToken: string;
      }>(
        { action: 'createEcpaySupportPayment', amount },
        { timeoutMs: 12_000 },
      );
      const merchantTradeNo = String(payment.fields.MerchantTradeNo || '');
      if (merchantTradeNo && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payment.statusLookupToken || '')) {
        const tracking: SupportPaymentTracking = {
          merchantTradeNo,
          statusLookupToken: payment.statusLookupToken,
          createdAt: Date.now(),
        };
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
    <main className="min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      <section className="relative overflow-hidden border-b-4 border-slate-900 bg-[#eef3ff] text-slate-900">
        <div aria-hidden="true" className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-indigo-200/70 blur-3xl" />
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-96 w-96 rounded-full bg-sky-200/65 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pb-24 lg:px-8">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:border-indigo-700 hover:text-indigo-700 active:translate-y-0 active:shadow-none"><ArrowLeft className="h-4 w-4" />回到首頁</a>
          <div className="mt-16 grid items-end gap-10 lg:grid-cols-[1fr_20rem]">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-black tracking-[0.16em] text-indigo-700"><Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />SUPPORT THE NEXT STEP</p>
              <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">讓每個重要選擇，<br /><span className="text-indigo-600">都有可靠的方向。</span></h1>
              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-600 sm:text-lg">你的支持，會成為更即時的資料校對、更好用的選校工具，以及持續免費開放服務的力量。</p>
            </div>
            <div className="hidden rounded-[2rem] border-2 border-slate-900 bg-white/80 p-5 shadow-sm backdrop-blur-sm lg:block">
              <Heart className="h-12 w-12 fill-rose-500 text-rose-500" />
              <p className="mt-8 text-sm font-bold text-indigo-700">Small support,<br />lasting impact.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto -mt-10 max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,.88fr)] lg:gap-8">
          <section className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[7px_7px_0_#0f172a] sm:p-8 lg:p-10">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-black tracking-[0.16em] text-indigo-600">ONE-TIME SUPPORT</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">選擇支持金額</h2><p className="mt-2 text-sm font-medium text-slate-500">單次付款，沒有自動續扣；付款將安全前往綠界。</p></div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><CircleDollarSign className="h-6 w-6" /></div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {suggestedAmounts.map((value) => <button key={value} type="button" onClick={() => selectAmount(value)} aria-pressed={customAmount === '' && selectedAmount === value} className={`rounded-2xl border-2 bg-white px-3 py-4 text-lg font-black transition ${customAmount === '' && selectedAmount === value ? 'border-indigo-600 text-indigo-700 shadow-[0_0_0_3px_rgba(79,70,229,0.12)]' : 'border-slate-200 text-slate-800 hover:border-indigo-300'}`}>NT$ {value}</button>)}
            </div>
            <label className="mt-5 block"><span className="text-sm font-black text-slate-700">或輸入自訂金額</span><div className="mt-2 flex items-center rounded-2xl border-2 border-slate-200 bg-white px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"><span className="font-black text-slate-400">NT$</span><input type="number" min="10" max="50000" inputMode="numeric" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value); setNotice(''); }} placeholder="最低 10 元" className="w-full bg-transparent px-3 py-4 font-black outline-none" /></div></label>
            <button type="button" onClick={startEcpayCheckout} disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-rose-500 px-5 py-4 text-lg font-black text-white shadow-[5px_5px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-[7px_7px_0_#0f172a] active:translate-y-0 active:shadow-none disabled:cursor-wait disabled:opacity-60"><Heart className="h-5 w-5 fill-white text-white" />{isSubmitting ? '正在前往綠界付款…' : `支持 NT$ ${Number.isFinite(amount) && amount > 0 ? amount.toLocaleString() : '--'}`}</button>
            {notice && <p role="status" className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900"><Info className="mr-2 inline h-4 w-4" />{notice}</p>}
            <div className="mt-7 border-t border-slate-100 pt-5 text-xs font-medium leading-6 text-slate-500"><p className="font-black text-slate-700">付款金額限制</p><p className="mt-1">最低 10 元；超商代碼限 34–6,000 元；網路 ATM 與 ATM 虛擬帳號限 16–49,999 元；信用卡限 6–199,999 元。實際選項仍依綠界付款頁顯示為準。</p></div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[6px_6px_0_#0f172a] sm:p-8">
              <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><CreditCard className="h-5 w-5" /></div><div><p className="text-xs font-black tracking-[0.15em] text-indigo-600">ECPAY SECURE PAYMENT</p><h2 className="mt-1 text-xl font-black">支援的付款方式</h2></div></div>
              <div className="mt-6"><p className="mb-2 text-xs font-black text-slate-500">信用卡付款</p><div className="grid grid-cols-2 gap-2.5">{cardPaymentMethods.map((method) => <span key={method} className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-black text-slate-800">{method}</span>)}</div></div>
              <div className="mt-5"><p className="mb-2 text-xs font-black text-slate-500">非信用卡付款</p><div className="grid grid-cols-2 gap-2.5">{nonCardPaymentMethods.map((method) => <span key={method} className="flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-black text-slate-800">{method}</span>)}</div></div>
              <p className="mt-5 text-xs font-medium leading-5 text-slate-500">實際可選的方式依綠界付款頁與已開通服務顯示。</p>
            </section>
            <section className="rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[6px_6px_0_#0f172a] sm:p-8"><p className="text-xs font-black tracking-[0.15em] text-indigo-600">YOUR SUPPORT MATTERS</p><h2 className="mt-2 text-xl font-black">每一筆支持都會用在這裡</h2><ul className="mt-5 space-y-3 text-sm font-medium leading-6 text-slate-600"><li className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />校對與更新升學資訊、學校與科系資料。</li><li className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />改善落點分析、志願排序與搜尋工具。</li><li className="flex gap-2"><Check className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />維持核心功能免費，讓更多學生能使用。</li></ul></section>
          </aside>
        </div>

        <section className="mt-8 overflow-hidden rounded-[1.75rem] border-4 border-slate-900 bg-white shadow-[6px_6px_0_#0f172a]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.8fr)]">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700"><Mail className="h-6 w-6" /></div>
                <div><p className="text-xs font-black tracking-[0.14em] text-indigo-600">SUPPORT DESK</p><h2 className="mt-1 text-xl font-black">需要協助嗎？</h2><p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-600">付款、退款或支持相關問題，請來信聯絡；我們會協助確認交易狀況與後續處理方式。</p></div>
              </div>
              <a href={`mailto:${supportEmail}?subject=%E9%97%9C%E6%96%BC%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81`} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100 sm:w-auto"><Mail className="h-4 w-4" />{supportEmail}</a>
            </div>
            <div className="border-t border-indigo-100 bg-[#f7f9ff] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-xs font-black tracking-[0.14em] text-slate-500">PAYMENT INFORMATION</p>
              <h2 className="mt-1 text-lg font-black text-slate-800">付款前請閱讀</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">了解售後與退款規則，讓每一筆支持更安心。</p>
              <div className="mt-5 grid gap-2 sm:gap-3 grid-cols-2">
                <a href={withBasePath('/after-sales-service')} className="group flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1.5 sm:gap-3 rounded-xl border border-slate-200 bg-white p-2.5 sm:px-4 sm:py-3.5 text-center transition hover:border-indigo-400 hover:text-indigo-700 hover:shadow-sm">
                  <span className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                    <HeartHandshake className="h-5 w-5 sm:h-4 sm:w-4 shrink-0 text-indigo-500 transition group-hover:text-indigo-600" />
                    <span className="text-xs sm:text-sm font-black text-slate-800 transition group-hover:text-indigo-700">售後服務</span>
                  </span>
                  <span aria-hidden="true" className="hidden sm:block text-indigo-500 transition group-hover:translate-x-1">→</span>
                </a>
                <a href={withBasePath('/refund-cancellation-policy')} className="group flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1.5 sm:gap-3 rounded-xl border border-slate-200 bg-white p-2.5 sm:px-4 sm:py-3.5 text-center transition hover:border-indigo-400 hover:text-indigo-700 hover:shadow-sm">
                  <span className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                    <ReceiptText className="h-5 w-5 sm:h-4 sm:w-4 shrink-0 text-indigo-500 transition group-hover:text-indigo-600" />
                    <span className="text-xs sm:text-sm font-black text-slate-800 transition group-hover:text-indigo-700 leading-tight">退款與取消</span>
                  </span>
                  <span aria-hidden="true" className="hidden sm:block text-indigo-500 transition group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
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
