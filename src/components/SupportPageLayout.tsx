import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CreditCard,
  Database,
  Heart,
  HeartHandshake,
  Info,
  Mail,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import './support-page.css';

const suggestedAmounts = [50, 100, 300, 500];
const supportEmail = 'tyctw.analyze@gmail.com';
const cardPaymentMethods = ['信用卡', 'Apple Pay'];
const nonCardPaymentMethods = ['網路 ATM', 'ATM 虛擬帳號', '超商條碼', '超商代碼'];

type Props = {
  selectedAmount: number;
  customAmount: string;
  amount: number;
  notice: string;
  isSubmitting: boolean;
  thankYouAmount: number | null;
  onSelectAmount: (value: number) => void;
  onCustomAmountChange: (value: string) => void;
  onCheckout: () => void;
  onCloseThanks: () => void;
};

export default function SupportPageLayout({
  selectedAmount,
  customAmount,
  amount,
  notice,
  isSubmitting,
  thankYouAmount,
  onSelectAmount,
  onCustomAmountChange,
  onCheckout,
  onCloseThanks,
}: Props) {
  const amountIsValid = Number.isInteger(amount) && amount >= 10 && amount <= 50_000;
  return <main className="support-page">
    <section className="support-hero">
      <div className="support-container">
        <a href={withBasePath('/')} className="support-back"><ArrowLeft size={17} />回到首頁</a>
        <div className="support-hero-grid">
          <div className="support-hero-copy">
            <span className="support-eyebrow"><Heart size={16} /> 小額支持</span>
            <h1>讓升學路上的每一步，<span>都有更清楚的資訊。</span></h1>
            <p>你的支持，幫助我們持續校對升學資料、改善分析工具，讓更多學生能安心探索適合自己的方向。</p>
            <a href="#support-checkout" className="support-hero-link">選擇支持金額 <ArrowRight size={18} /></a>
          </div>
          <div className="support-hero-note" aria-label="支持方式摘要">
            <span className="support-hero-note-icon"><Sparkles size={25} /></span>
            <strong>一份心意，持續帶來幫助</strong>
            <p>從 NT$ 10 起，自由選擇支持金額。每筆都是單次付款，不會自動續扣。</p>
            <div><Check size={17} /> 資料校對與更新</div>
            <div><Check size={17} /> 讓升學工具持續改善</div>
          </div>
        </div>
      </div>
    </section>

    <div className="support-container support-main">
      <div className="support-workspace">
        <section id="support-checkout" className="support-checkout" aria-labelledby="support-checkout-title">
          <div className="support-section-heading"><span className="support-step">01</span><div><span className="support-kicker">單次支持</span><h2 id="support-checkout-title">選擇你想支持的金額</h2><p>可使用建議金額，也可以自行輸入。付款前會先顯示確認金額。</p></div></div>
          <div className="support-amount-grid" role="group" aria-label="建議支持金額">
            {suggestedAmounts.map((value) => <button key={value} type="button" onClick={() => onSelectAmount(value)} aria-pressed={customAmount === '' && selectedAmount === value}><small>NT$</small><strong>{value}</strong></button>)}
          </div>
          <label htmlFor="support-custom-amount" className="support-custom-label">或輸入自訂金額</label>
          <div className="support-custom-field"><span>NT$</span><input id="support-custom-amount" type="number" min="10" max="50000" step="1" inputMode="numeric" value={customAmount} onChange={(event) => onCustomAmountChange(event.target.value)} placeholder="輸入 10 至 50,000 元" aria-describedby="support-custom-hint" /></div>
          <p id="support-custom-hint" className="support-field-hint">自訂金額須為 NT$ 10–50,000 的整數。</p>
          <div className="support-order-summary"><div><span>本次支持金額</span><strong>{amountIsValid ? `NT$ ${amount.toLocaleString()}` : '請確認金額'}</strong></div><span>單次付款 · 不自動續扣</span></div>
          <button type="button" onClick={onCheckout} disabled={isSubmitting} className="support-pay-button"><Heart size={20} fill="currentColor" />{isSubmitting ? '正在前往綠界付款…' : `前往安全付款${amountIsValid ? ` · NT$ ${amount.toLocaleString()}` : ''}`}<ArrowRight size={18} /></button>
          {notice && <p role="status" className="support-notice"><Info size={18} aria-hidden="true" />{notice}</p>}
          <p className="support-checkout-assurance"><ShieldCheck size={17} /> 點擊後將前往綠界付款頁，實際付款方式與金額請於付款前再次確認。</p>
        </section>

        <aside className="support-details" aria-label="付款資訊">
          <section className="support-side-card">
            <div className="support-side-heading"><span><CreditCard size={22} /></span><div><small>付款資訊</small><h2>可選擇的付款方式</h2></div></div>
            <p>依綠界付款頁實際開放的方式選擇。</p>
            <div className="support-method-group"><strong>卡片及行動支付</strong><div>{cardPaymentMethods.map((method) => <span key={method}>{method}</span>)}</div></div>
            <div className="support-method-group"><strong>其他付款方式</strong><div>{nonCardPaymentMethods.map((method) => <span key={method}>{method}</span>)}</div></div>
          </section>
          <section className="support-side-card support-limits">
            <div className="support-side-heading"><span><BadgeCheck size={22} /></span><div><small>付款前確認</small><h2>金額與方式限制</h2></div></div>
            <p>本站可輸入 NT$ 10–50,000。各付款方式另有金額限制：</p>
            <dl><div><dt>超商代碼</dt><dd>NT$ 34–6,000</dd></div><div><dt>網路 ATM／ATM 虛擬帳號</dt><dd>NT$ 16–49,999</dd></div><div><dt>信用卡</dt><dd>NT$ 6–199,999</dd></div></dl>
            <small>實際可用方式與限額，以綠界付款頁顯示為準。</small>
          </section>
        </aside>
      </div>

      <section className="support-impact" aria-labelledby="support-impact-title">
        <div className="support-impact-head"><span className="support-eyebrow"><HeartHandshake size={16} /> 你的支持如何發揮作用</span><h2 id="support-impact-title">一起把升學資訊做得更好</h2><p>我們會持續投入以下工作，讓學生與家長在重要時刻更容易找到需要的資訊。</p></div>
        <div className="support-impact-grid"><article><span><Database size={25} /></span><small>01 / 資料</small><h3>持續校對升學資料</h3><p>整理學校、科別與重要日程，讓資訊更容易查找與比對。</p></article><article><span><Wrench size={25} /></span><small>02 / 工具</small><h3>改善分析與選填工具</h3><p>優化落點分析、校科搜尋和志願規劃的使用體驗。</p></article><article><span><BookOpenCheck size={25} /></span><small>03 / 開放</small><h3>維持核心工具可使用</h3><p>讓更多學生能接觸升學資訊，探索適合自己的選擇。</p></article></div>
      </section>

      <section className="support-help" aria-labelledby="support-help-title">
        <div><span className="support-eyebrow"><Mail size={16} /> 需要協助？</span><h2 id="support-help-title">付款問題，我們可以協助你確認</h2><p>若有付款、退款或小額支持相關疑問，請來信說明情況。</p><a href={`mailto:${supportEmail}?subject=%E9%97%9C%E6%96%BC%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81`} className="support-email"><Mail size={17} />{supportEmail}</a></div>
        <div className="support-policy-links"><strong>付款前可先閱讀</strong><a href={withBasePath('/after-sales-service')}><HeartHandshake size={19} />售後服務<ArrowRight size={17} /></a><a href={withBasePath('/refund-cancellation-policy')}><ReceiptText size={19} />退款與取消<ArrowRight size={17} /></a></div>
      </section>
    </div>

    {thankYouAmount !== null && <div role="dialog" aria-modal="true" aria-labelledby="support-thanks-title" className="support-thanks-overlay"><div className="support-thanks-dialog"><span className="support-thanks-icon"><Heart size={36} fill="currentColor" /></span><span className="support-eyebrow">感謝你的心意</span><h2 id="support-thanks-title">支持已完成</h2><p>已收到 NT$ {thankYouAmount.toLocaleString()} 的支持。謝謝你陪我們持續改善升學資訊與工具。</p><button type="button" onClick={onCloseThanks}>繼續使用工具 <ArrowRight size={17} /></button></div></div>}
  </main>;
}
