import { useEffect, useMemo, useState } from 'react';
import { callBackend } from '../lib/api';
import SupportPageLayout from './SupportPageLayout';

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
    return customAmount !== '' ? value : selectedAmount;
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

      let tracking: SupportPaymentTracking & { statusLookupToken?: unknown };
      try {
        tracking = JSON.parse(stored) as SupportPaymentTracking;
      } catch {
        window.sessionStorage.removeItem(supportPaymentStorageKey);
        return;
      }

      // Older versions kept a bearer-like lookup token here. Clear that
      // legacy shape rather than retaining a JavaScript-readable credential.
      if (tracking.statusLookupToken !== undefined
        || !/^[A-Za-z0-9]{8,32}$/.test(tracking.merchantTradeNo || '')
        || !Number.isFinite(tracking.createdAt)
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
      }>(
        { action: 'createEcpaySupportPayment', amount },
        { timeoutMs: 12_000 },
      );
      const merchantTradeNo = String(payment.fields.MerchantTradeNo || '');
      if (/^[A-Za-z0-9]{8,32}$/.test(merchantTradeNo)) {
        const tracking: SupportPaymentTracking = {
          merchantTradeNo,
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
    <SupportPageLayout
      selectedAmount={selectedAmount}
      customAmount={customAmount}
      amount={amount}
      notice={notice}
      isSubmitting={isSubmitting}
      thankYouAmount={thankYouAmount}
      onSelectAmount={selectAmount}
      onCustomAmountChange={(value) => { setCustomAmount(value); setNotice(''); }}
      onCheckout={startEcpayCheckout}
      onCloseThanks={() => setThankYouAmount(null)}
    />
  );
}