import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, CalendarDays, ChevronDown, CreditCard, Crown, EyeOff, HeartHandshake, HelpCircle, KeyRound, LockKeyhole, LogOut, Mail, MessageCircle, ReceiptText, Sparkles, UserRound } from "lucide-react";
import { callBackend } from "../lib/api";
import { startLineLogin } from "../lib/lineLogin";
import {
  clearLineSessionToken,
  consumeLineLoginCodeFromFragment,
  getMembershipStatus,
  type MembershipStatus,
} from "../lib/membership";
import { withBasePath } from "../lib/routes";
import PageBreadcrumb from "./PageBreadcrumb";
import './membership-plans-page.css';

const plans = [
  {
    id: "monthly",
    name: "30 天方案",
    price: 49,
    duration: "30 天",
    note: "從查成績到排志願，用 30 天專心比較，把這次選擇準備好。",
    comparison: "NT$49，體驗完整會員權益",
    accent: "sky",
    featured: false,
  },
  {
    id: "yearly",
    name: "365 天方案",
    price: 399,
    duration: "365 天",
    note: "從模擬考一路陪你到選填志願，持續追蹤成績，和家人慢慢討論。",
    comparison: "比購買 12 次 30 天方案省 NT$189",
    accent: "emerald",
    featured: true,
  },
] as const;
type PlanId = (typeof plans)[number]["id"];


const membershipFaqs = [
  {
    q: '30 天與 365 天方案有什麼差別？',
    a: '30 天方案 NT$49；365 天方案 NT$399。權益相同，差別是使用期間。購買 365 天方案比購買 12 次 30 天方案省 NT$189。兩種方案均為一次付款，到期不自動續扣。',
  },
  {
    q: '付款後何時生效？',
    a: '付款完成並收到系統確認後，會員資格即刻生效。以 LINE 帳號登入確認資格後，即可免輸入系統授權碼直接開始落點分析。若付款後資格未正常顯示，請來信客服確認。',
  },
  {
    q: '到期後會自動扣款嗎？',
    a: '不會。兩種方案均為一次性付款，期間結束後不會自動續費或扣款，無需手動取消。若要繼續使用，可再選擇方案購買。',
  },
  {
    q: '可以在多台裝置使用嗎？',
    a: '可以。會員資格與你的 LINE 帳號綁定，在任何裝置上使用 LINE 登入後，系統即可自動確認資格並關閉廣告，無需重複購買。',
  },
  {
    q: '會員期間可以跳過什麼步驟？',
    a: '有效會員以 LINE 登入確認資格後，回到首頁填妥成績即可直接開始落點分析，無需另行輸入系統授權碼。廣告也會在會員有效期間全程關閉。',
  },
  {
    q: '家長協作功能包含什麼？',
    a: '會員可在模擬志願序建立可協作連結，邀請家長留言、共同新增校科、調整志願順序、移除選項，並保留每次調整與確認版本的紀錄。一般分享連結仍是唯讀，不會讓他人改動你的清單。',
  },
  {
    q: '支援哪些付款方式？',
    a: '透過綠界科技（ECPay）收款，支援信用卡、Apple Pay、網路 ATM、ATM 虛擬帳號、超商條碼與超商代碼。實際可選方式以付款頁面當下顯示為準。',
  },
  {
    q: '可以申請退款嗎？',
    a: '付款完成後，若遇到技術異常或未能如期使用，請來信說明情況，我們會依退款與取消政策個別處理。詳細說明請參閱「退款與取消政策」頁面。',
  },
];

const paymentMethods = {
  card: ["信用卡", "Apple Pay"],
  other: ["網路 ATM", "ATM 虛擬帳號", "超商條碼", "超商代碼"],
};



function MembershipSupportLinks() {
  return <section className="plans-support" aria-labelledby="membership-support-title">
    <div><Mail size={24} aria-hidden="true" /><h2 id="membership-support-title">會員或付款需要協助？</h2><p>請提供訂單編號與問題描述，方便我們確認。</p><a href="mailto:tyctw.analyze@gmail.com">tyctw.analyze@gmail.com<ArrowRight size={16} aria-hidden="true" /></a></div>
    <nav aria-label="會員服務說明"><a href={withBasePath('/after-sales-service')}><HeartHandshake size={19} aria-hidden="true" />售後服務<ArrowRight size={16} aria-hidden="true" /></a><a href={withBasePath('/refund-cancellation-policy')}><ReceiptText size={19} aria-hidden="true" />退款與取消說明<ArrowRight size={16} aria-hidden="true" /></a></nav>
  </section>;
}

export default function MembershipPage() {
  const [membership, setMembership] = useState<MembershipStatus | null>(null);
  const [selected, setSelected] = useState<PlanId>("monthly");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [lineName, setLineName] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerNameError, setPayerNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [paymentWaitingExpired, setPaymentWaitingExpired] = useState(false);
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selected)!,
    [selected],
  );
  const activeDaysLeft = membership?.expiresAt
    ? Math.max(0, Math.ceil((new Date(membership.expiresAt).getTime() - Date.now()) / 86_400_000))
    : null;

  const refresh = async () => {
    const line = await callBackend<{ loggedIn: boolean; name?: string }>({
      action: "getLineLoginSession",
    });
    setLineName(line.loggedIn ? line.name || "LINE 會員" : "");
    setMembership(await getMembershipStatus());
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const hasLoginCode = hash.has('line_login_code');
        const consumed = await consumeLineLoginCodeFromFragment();
        if (hasLoginCode && !consumed) {
          if (!cancelled) setNotice("LINE 登入連結已失效或逾時，請重新點擊「LINE 登入」。");
        } else if (consumed) {
          if (!cancelled) setNotice("LINE 登入成功，現在可以查看會員資格。");
        }
        await refresh();
      } catch (error) {
        if (!cancelled) {
          setMembership({ active: false });
          setNotice("目前無法確認會員資格。你仍可查看方案；若已購買，請稍後重新登入或聯絡我們。");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // When the user returns from the ECPay payment page to /membership/success,
  // the server-to-server callback and the browser redirect race each other.
  // Poll until the membership turns active (or we exhaust retries) so the
  // user sees a "confirming payment…" state instead of a stale inactive view.
  const isSuccessPage = window.location.pathname.endsWith('/membership/success');
  useEffect(() => {
    if (!isSuccessPage) return;
    if (membership === null) return; // still loading initial check
    if (membership.active) return;  // already confirmed, no polling needed

    let attempts = 0;
    const MAX_ATTEMPTS = 8;
    const INTERVAL_MS = 2500;

    const id = setInterval(async () => {
      attempts += 1;
      try {
        const status = await getMembershipStatus();
        if (status.active) {
          setMembership(status);
          clearInterval(id);
        }
      } catch {
        // network hiccup — keep polling until exhausted
      }
      if (attempts >= MAX_ATTEMPTS) { clearInterval(id); setPaymentWaitingExpired(true); }
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [isSuccessPage, membership === null, membership?.active]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setSubmitting(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const loginWithLine = () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setNotice("目前登入服務暫時無法使用，請稍後再試或聯絡 tyctw.analyze@gmail.com。");
      return;
    }
    startLineLogin('/membership');
  };

  const logoutFromLine = async () => {
    try {
      await callBackend({ action: "revokeLineLoginSession" });
      clearLineSessionToken();
      setLineName("");
      setMembership({ active: false });
    } catch {
      setNotice("登出未完成，請確認網路連線後再試一次。");
    }
  };

  const checkout = async () => {
    setPayerNameError("");
    setEmailError("");
    const trimmedPayerName = payerName.trim().replace(/\s+/g, " ");
    const trimmedEmail = email.trim();
    if (!trimmedPayerName) {
      setPayerNameError("請填寫付款人姓名。");
      return;
    }
    if (!trimmedEmail) {
      setEmailError("請填寫聯絡信箱。");
      return;
    }
    if (!trimmedEmail.includes("@")) {
      setEmailError("請輸入正確的信箱格式。");
      return;
    }
    setSubmitting(true);
    setNotice("");
    try {
      const result = await callBackend<{
        actionUrl: string;
        fields: Record<string, string>;
      }>({
        action: "createMembershipPayment",
        plan: selected,
        payerName: trimmedPayerName,
        email: trimmedEmail || undefined,
      });
      const form = document.createElement("form");
      form.method = "post";
      form.action = result.actionUrl;
      Object.entries(result.fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();

      // Fallback: reset the button state after a short delay in case navigation
      // is cancelled, blocked, or the user returns via bfcache where pageshow might fail.
      setTimeout(() => {
        setSubmitting(false);
      }, 1000);
    } catch {
      setNotice("目前無法建立付款單，請稍後再試。");
      setSubmitting(false);
    }
  };

  const formatDate = (date?: string) => date
    ? new Intl.DateTimeFormat('zh-TW', { dateStyle: 'long', timeZone: 'Asia/Taipei' }).format(new Date(date))
    : '尚無日期資料';
  const benefits = [
    { icon: EyeOff, title: '把注意力留給選擇', text: '會員期間關閉 Google 廣告與 Offerwall，專心閱讀校科資訊。' },
    { icon: KeyRound, title: '想比較，就開始分析', text: '填好成績即可分析，省下反覆輸入系統授權碼的步驟。' },
    { icon: Sparkles, title: '多試幾種成績情境', text: '用一分改變分析探索成績變化，讓校科比較更有方向。' },
    { icon: MessageCircle, title: '讓全家討論更具體', text: '邀請家長共編志願、留言與查看版本，一起整理每次選擇。' },
  ];

  return <main id="main-content" className="plans-page" aria-labelledby="membership-title"><div className="plans-shell">
    <PageBreadcrumb title={isSuccessPage ? '付款確認' : '會員方案'} />
    <header className="plans-hero"><div><p className="plans-eyebrow"><Crown size={18} aria-hidden="true" />升學小助手會員</p><h1 id="membership-title">{isSuccessPage ? '確認你的會員資格' : membership?.active ? '會員方案' : <>會員方案<span>把心力，留給升學選擇。</span></>}</h1><p className="plans-lead">{membership?.active ? '會員資格已啟用，接著分析成績、整理志願，慢慢找到適合的選擇。' : 'NT$49 起，享有免廣告、免輸入分析授權碼與家長志願協作。從比較校科到整理志願，讓每次討論都有進展。'}</p></div><a className="plans-account-link" href={withBasePath('/membership/account')}><UserRound size={18} aria-hidden="true" />我的會員帳號<ArrowRight size={16} aria-hidden="true" /></a></header>
    {notice && <p className="plans-notice" role="status" aria-live="polite">{notice}</p>}
    {membership === null ? <section className="plans-feedback" role="status" aria-busy="true"><Crown size={28} aria-hidden="true" /><h2>正在確認會員資格</h2><p>正在讀取目前帳號的使用狀態，請稍候。</p></section>
    : isSuccessPage && !membership.active ? <section className="plans-feedback" aria-labelledby="payment-confirming-title"><span className="plans-feedback-icon"><CreditCard size={28} aria-hidden="true" /></span><p className="plans-eyebrow">付款狀態</p><h2 id="payment-confirming-title">{paymentWaitingExpired ? '尚未確認會員資格' : '正在確認付款結果'}</h2><p role="status" aria-live="polite">{paymentWaitingExpired ? '目前尚未收到資格啟用結果。如果已完成付款，請重新確認或提供訂單編號聯絡我們。請先確認原訂單狀態，再決定是否重新購買。' : '正在等待付款系統回傳與資格更新，確認後會顯示會員有效期限。'}</p><div className="plans-feedback-actions"><button type="button" className="plans-primary" onClick={() => void refresh().catch(() => setNotice('暫時無法確認資格，請稍後再試。'))}>重新確認資格</button><a className="plans-secondary" href={withBasePath('/membership/account')}>查看帳號與訂單</a></div></section>
    : membership.active ? <>
      <section className="plans-active"><div><span className="plans-active-badge"><BadgeCheck size={17} aria-hidden="true" />會員資格有效</span><h2>{lineName || 'LINE 會員'}，歡迎回來。</h2><p>會員使用期間不顯示 Google 廣告與 Offerwall。填妥成績後，即可直接開始分析。</p><div className="plans-active-actions"><a className="plans-primary" href={withBasePath('/')}>開始落點分析<ArrowRight size={17} aria-hidden="true" /></a><a className="plans-secondary" href={withBasePath('/mock-volunteer')}>整理模擬志願序</a></div></div><dl><div><dt>目前方案</dt><dd>{membership.plan === 'yearly' ? '365 天方案' : '30 天方案'}</dd></div><div><dt>會員有效至</dt><dd>{formatDate(membership.expiresAt)}{activeDaysLeft !== null && <small>剩餘 {activeDaysLeft} 天</small>}</dd></div><div><dt>啟用日期</dt><dd>{formatDate(membership.activatedAt)}</dd></div></dl></section>
      <div className="plans-active-footer"><a href={withBasePath('/membership/account')}>查看帳號與購買紀錄<ArrowRight size={16} aria-hidden="true" /></a><button type="button" onClick={() => void logoutFromLine()}><LogOut size={16} aria-hidden="true" />登出 LINE</button></div>
    </> : <>
      <section className="plans-intro-strip" aria-label="購買與使用重點">{[
        { icon: CreditCard, title: '一次付款', description: '選好方案，支付本次費用。' },
        { icon: CalendarDays, title: '到期不自動續扣', description: '不需取消訂閱，續用時再購買。' },
        { icon: UserRound, title: 'LINE 登入找回資格', description: '換裝置也能登入同一帳號使用。' },
      ].map(({ icon: Icon, title, description }) => <div className="plans-assurance" key={title}><span className="plans-assurance-icon"><Icon size={21} aria-hidden="true" /></span><div><h2>{title}</h2><p>{description}</p></div></div>)}</section>
      <form className="plans-purchase" onSubmit={(event) => { event.preventDefault(); if (lineName) void checkout(); }}>
        <section id="membership-plans" className="plans-selection" aria-labelledby="membership-plans-title"><div className="plans-section-heading"><span className="plans-step">01</span><div><h2 id="membership-plans-title">選一段適合你的規劃時間</h2><p>30 天先體驗，365 天持續規劃。兩種方案都享有完整會員權益。</p></div></div>
          <fieldset className="plans-options"><legend className="sr-only">選擇會員方案</legend>{plans.map(plan => <label key={plan.id} className="plans-option" data-selected={selected === plan.id}><div className="plans-option-top"><input type="radio" name="membership-plan" value={plan.id} checked={selected === plan.id} onChange={() => setSelected(plan.id)} disabled={submitting} /><span>{plan.name}</span><small>{plan.featured ? '長期使用更划算' : '輕鬆開始'}</small></div><p className="plans-price"><span>NT$</span>{plan.price}<small>／{plan.duration}</small></p><p className="plans-option-note">{plan.note}</p>{plan.featured && <p className="plans-daily-price">平均每天約 NT$1.1<small>以 NT$399 ÷ 365 天換算，實際一次付款 NT$399。</small></p>}<div className="plans-option-bottom">{plan.comparison}</div></label>)}</fieldset>
          <section className="plans-benefits" aria-labelledby="membership-benefits-title"><h3 id="membership-benefits-title">加入會員，讓規劃更順手</h3><div>{benefits.map(({icon: Icon,title,text}) => <article key={title}><Icon size={21} aria-hidden="true" /><div><h4>{title}</h4><p>{text}</p></div></article>)}</div></section>
        </section>
        <section className="plans-checkout" aria-labelledby="membership-checkout-title"><div className="plans-section-heading"><span className="plans-step">02</span><div><h2 id="membership-checkout-title">開始你的會員規劃</h2><p>一次付款，到期不自動續扣。</p></div></div>
          {lineName ? <div className="plans-login-status"><BadgeCheck size={23} aria-hidden="true" /><div><small>已登入 LINE</small><strong>{lineName}</strong></div><button type="button" onClick={() => void logoutFromLine()} disabled={submitting}>登出</button></div> : <div className="plans-login"><p>用 LINE 登入，讓這份會員資格跟著你。換裝置也能找回。</p><button type="button" onClick={loginWithLine}><img src={withBasePath('/brand/line/line-login.png')} width={40} height={40} alt="" aria-hidden="true" />使用 LINE 登入<ArrowRight size={17} aria-hidden="true" /></button></div>}
          {lineName && <div className="plans-payer"><h3>付款人資料</h3><p>用於訂單核對、付款確認與會員服務聯繫。</p><label htmlFor="membership-payer-name">付款人姓名</label><input id="membership-payer-name" type="text" autoComplete="name" maxLength={80} required value={payerName} onChange={event => {setPayerName(event.target.value);setPayerNameError('');}} placeholder="請輸入真實姓名" disabled={submitting} aria-invalid={Boolean(payerNameError)} aria-describedby={payerNameError ? 'membership-name-error' : undefined} />{payerNameError && <p className="plans-field-error" id="membership-name-error" role="alert">{payerNameError}</p>}<label htmlFor="membership-email">付款人電子信箱</label><input id="membership-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={event => {setEmail(event.target.value);setEmailError('');}} placeholder="your@email.com" disabled={submitting} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'membership-email-error' : undefined} />{emailError && <p className="plans-field-error" id="membership-email-error" role="alert">{emailError}</p>}</div>}
          <dl className="plans-order" aria-live="polite"><div><dt>已選方案</dt><dd>{selectedPlan.name}</dd></div><div><dt>續費方式</dt><dd>不自動續扣</dd></div><div className="plans-order-total"><dt>本次付款</dt><dd><small>NT$</small> {selectedPlan.price}</dd></div></dl>
          <button type="submit" className="plans-pay" disabled={submitting || !lineName}>{submitting ? '正在建立付款單…' : lineName ? `以 NT$${selectedPlan.price} 購買${selectedPlan.duration}方案` : '登入後即可購買'}<ArrowRight size={18} aria-hidden="true" /></button><p className="plans-payment-note"><LockKeyhole size={16} aria-hidden="true" />付款由綠界科技 ECPay 處理。實際可選方式以付款頁面為準。</p>
        </section>
      </form>
    </>}
    {membership !== null && !(isSuccessPage && !membership.active) && <section className="plans-faq" aria-labelledby="membership-faq-title"><div className="plans-section-heading"><HelpCircle size={25} aria-hidden="true" /><div><h2 id="membership-faq-title">購買與使用常見問題</h2><p>付款方式、資格確認與使用提醒。</p></div></div><div>{membershipFaqs.map(faq => <details key={faq.q}><summary>{faq.q}<ChevronDown size={18} aria-hidden="true" /></summary><p>{faq.a}</p>{faq.q === '支援哪些付款方式？' && <ul className="plans-payment-methods">{[...paymentMethods.card,...paymentMethods.other].map(method => <li key={method}>{method}</li>)}</ul>}</details>)}</div></section>}
    <MembershipSupportLinks />
  </div></main>;
}
