import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  Crown,
  EyeOff,
  HeartHandshake,
  HelpCircle,
  KeyRound,
  LockKeyhole,
  LogIn,
  Mail,
  MessageCircle,
  ReceiptText,
  Sparkles,
  X,
  BadgeCheck,
  Shield,
  LogOut,
} from "lucide-react";
import { callBackend } from "../lib/api";
import { startLineLogin } from "../lib/lineLogin";
import {
  clearLineSessionToken,
  consumeLineLoginCodeFromFragment,
  getMembershipStatus,
  type MembershipStatus,
} from "../lib/membership";
import { withBasePath } from "../lib/routes";
import './membership.css';

const plans = [
  {
    id: "monthly",
    name: "30 天方案",
    price: 49,
    duration: "30 天",
    note: "適合考前衝刺或先體驗完整會員功能。",
    comparison: "短期使用",
    accent: "sky",
    featured: false,
  },
  {
    id: "yearly",
    name: "365 天方案",
    price: 399,
    duration: "365 天",
    note: "適合長期追蹤成績、比較校科與整理志願。",
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
  return (
    <section
      aria-labelledby="membership-support-title"
      className="member-support mt-8 overflow-hidden rounded-[1.75rem] bg-white"
    >
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(16rem,.7fr)]">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="member-support-eyebrow">
                會員協助
              </p>
              <h2
                id="membership-support-title"
                className="mt-1 text-xl sm:text-2xl font-bold"
              >
                會員協助與交易保障
              </h2>
              <p className="mt-2 max-w-xl text-sm font-normal leading-6 text-slate-600">
                需要協助時，我們在這裡。付款、資格確認或使用上的問題，都可以直接來信聯絡。
              </p>
            </div>
          </div>
          <a
            href="mailto:tyctw.analyze@gmail.com?subject=%E6%9C%83%E5%93%A1%E5%85%8D%E5%BB%A3%E5%91%8A%E5%8D%94%E5%8A%A9"
            className="member-support-email mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            tyctw.analyze@gmail.com
          </a>
        </div>
        <div className="member-support-policy border-t p-5 sm:p-8 md:border-l md:border-t-0">
          <p className="member-support-eyebrow">
            交易保障
          </p>
          <h3 className="mt-1 text-lg sm:text-xl font-bold text-slate-800">
            售後與退款說明
          </h3>
          <p className="mt-2 text-sm font-normal leading-6 text-slate-600">
            查看付款異常、取消申請、退款方式與交易爭議的處理原則。
          </p>
          <div className="mt-5 grid gap-2 sm:gap-3 grid-cols-2">
            <a
              href={withBasePath("/after-sales-service")}
              className="group flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1.5 sm:gap-3 rounded-xl border border-slate-200 bg-white p-2.5 sm:px-4 sm:py-3.5 text-center transition hover:border-stone-200 hover:shadow-[5px_5px_0_#161b35]"
            >
              <span className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                <HeartHandshake className="h-5 w-5 sm:h-4 sm:w-4 shrink-0 text-emerald-600" />
                <span className="text-xs sm:text-sm font-bold text-slate-800">售後服務</span>
              </span>
              <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
            </a>
            <a
              href={withBasePath("/refund-cancellation-policy")}
              className="group flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1.5 sm:gap-3 rounded-xl border border-slate-200 bg-white p-2.5 sm:px-4 sm:py-3.5 text-center transition hover:border-stone-200 hover:shadow-[5px_5px_0_#161b35]"
            >
              <span className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                <ReceiptText className="h-5 w-5 sm:h-4 sm:w-4 shrink-0 text-emerald-600" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">退款與取消</span>
              </span>
              <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
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
  const [showPlanComparison, setShowPlanComparison] = useState(false);
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
    if (line.loggedIn) setLineName(line.name || "LINE 會員");
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
          setNotice(error instanceof Error ? error.message : "LINE 登入已逾時，請再試一次。");
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
      if (attempts >= MAX_ATTEMPTS) clearInterval(id);
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
      setNotice("尚未設定 LINE Login 服務。");
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

  if (membership === null)
    return (
      <main id="main-content" aria-labelledby="membership-check-title" className="membership-page member-check-page min-h-screen px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-6xl">
          <a href={withBasePath("/")} className="member-check-back"><ArrowRight aria-hidden="true" className="h-4 w-4 rotate-180" />回到落點分析</a>
          <header className="member-check-header">
            <span className="member-check-header-icon"><Crown aria-hidden="true" className="h-6 w-6" /></span>
            <div><p>MEMBERSHIP</p><h1 id="membership-check-title">會員方案與資格</h1><span>查看會員方案、權益與目前的使用狀態。</span></div>
          </header>
          <section role="status" aria-live="polite" aria-busy="true" className="member-check-status">正在確認會員資格…</section>
        </div>
      </main>
    );

  if (isSuccessPage && membership !== null && !membership.active)
    return (
      <main id="main-content" aria-busy="true" aria-labelledby="payment-confirming-title" className="membership-page min-h-screen overflow-hidden bg-[#f7f8f5] px-4 py-7 text-slate-900 sm:px-6 sm:py-12">
        <div aria-hidden="true" className="fixed -left-24 top-20 h-64 w-64 rounded-full bg-emerald-200/60 blur-3xl" />
        <div aria-hidden="true" className="fixed -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
        <section className="relative mx-auto max-w-lg">
          <a href={withBasePath("/")} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#161b35] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"><ArrowRight className="h-4 w-4 rotate-180" />回到落點分析</a>
          <article className="relative mt-6 overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[3px_3px_0_#161b35]">
            <div aria-hidden="true" className="absolute -right-10 -top-12 h-36 w-36 rounded-full border-[15px] border-emerald-100" />
            <div className="relative border-b-2 border-slate-900 bg-emerald-100 px-6 py-5 sm:px-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-bold tracking-[.14em] text-emerald-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />PAYMENT CONFIRMING</span>
              <div className="mt-4 flex items-center gap-4">
                <div aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 bg-white text-emerald-700 shadow-[3px_3px_0_#161b35]"><Crown className="h-6 w-6 fill-amber-300" /></div>
                <div><h1 id="payment-confirming-title" className="text-2xl font-bold tracking-tight sm:text-3xl">付款確認中</h1><p className="mt-1 text-sm font-bold text-slate-600">正在等待付款系統回傳結果，請稍候⋯</p></div>
              </div>
            </div>
            <div role="status" aria-live="polite" className="relative space-y-3 p-5 sm:p-6">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-white">1</span><div className="min-w-0 flex-1"><p className="text-sm font-bold">付款已送出</p><p className="text-xs font-bold text-emerald-700">我們已收到付款指示</p></div><Check className="h-5 w-5 text-emerald-600" /></div>
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"><span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-400 text-xs font-bold text-white">2</span><div className="min-w-0 flex-1"><p className="text-sm font-bold">等待付款機構確認</p><p className="text-xs font-bold text-amber-700">正在與綠界確認交易結果</p></div><span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border border-amber-200 border-t-amber-500" /></div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 opacity-50"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-300 text-xs font-bold text-white">3</span><div className="min-w-0 flex-1"><p className="text-sm font-bold">啟用免廣告會員資格</p><p className="text-xs font-bold text-slate-500">確認後立即生效</p></div></div>
              <p className="px-1 pt-1 text-center text-xs font-medium leading-5 text-slate-500">若付款已完成但此頁超過 30 秒仍未更新，請重新整理或來信客服確認。</p>
            </div>
          </article>
        </section>
      </main>
    );

  if (membership.active)
    return (
      <main id="main-content" aria-labelledby="member-active-title" className="membership-page member-active-page min-h-screen px-4 py-6 text-slate-900 sm:px-6 sm:py-12">
        <section className="mx-auto max-w-6xl">
          <nav aria-label="會員頁面導覽" className="member-active-nav">
            <a href={withBasePath("/")}>
              <ArrowRight aria-hidden="true" className="h-4 w-4 rotate-180" />回到落點分析
            </a>
            <span><Crown aria-hidden="true" className="h-4 w-4" />會員中心</span>
          </nav>
          <div className="member-active-layout">
            <header className="member-active-hero">
              <span className="member-active-status"><BadgeCheck aria-hidden="true" className="h-4 w-4" />會員資格有效</span>
              <p className="member-active-greeting">{lineName || 'LINE 會員'}，歡迎回來</p>
              <h1 id="member-active-title">專心規劃，<br />接下來的每一步。</h1>
              <p className="member-active-description">會員權益已啟用。現在可以直接分析成績、整理志願，使用期間不顯示網站的 Google 廣告與 Offerwall。</p>
              <div className="member-active-actions">
                <a href={withBasePath("/")} className="member-active-primary"><Sparkles aria-hidden="true" className="h-5 w-5" />開始落點分析<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
                <a href={withBasePath("/score-records")} className="member-active-secondary">查看成績紀錄<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
              </div>
              <p className="member-active-hint"><KeyRound aria-hidden="true" className="h-4 w-4" />填好成績後即可開始，不需再輸入系統授權碼。</p>
            </header>
            <section aria-labelledby="member-details-title" className="member-active-card">
              <div className="member-active-card-heading"><span><Crown aria-hidden="true" className="h-5 w-5" /></span><div><p>目前會員資格</p><h2 id="member-details-title">{membership.plan === 'yearly' ? '年費會員' : '月費會員'}</h2></div></div>
              <dl className="member-active-card-details">
                <div><dt>LINE 會員帳號</dt><dd>{lineName || '已完成 LINE 驗證'}</dd></div>
                <div className="member-active-expiry"><dt>免廣告有效期限</dt><dd>{new Intl.DateTimeFormat('zh-TW', { dateStyle: 'long' }).format(new Date(membership.expiresAt!))}{activeDaysLeft !== null && <span>剩餘 {activeDaysLeft} 天</span>}</dd></div>
                <div><dt>會員啟用日期</dt><dd>{membership.activatedAt ? new Intl.DateTimeFormat('zh-TW', { dateStyle: 'long' }).format(new Date(membership.activatedAt)) : '尚無日期資料'}</dd></div>
              </dl>
              <a href={withBasePath("/membership/account")} className="member-active-account-link">查看會員帳號與購買紀錄<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
            </section>
          </div>
          <section aria-labelledby="member-benefits-active-title" className="member-active-benefits">
            <div><p>會員使用中</p><h2 id="member-benefits-active-title">你現在可以安心使用</h2></div>
            <ul>
              <li><EyeOff aria-hidden="true" className="h-5 w-5" /><span><strong>免廣告干擾</strong><small>Google 廣告與 Offerwall 不顯示</small></span></li>
              <li><KeyRound aria-hidden="true" className="h-5 w-5" /><span><strong>直接開始分析</strong><small>不需重複輸入系統授權碼</small></span></li>
              <li><MessageCircle aria-hidden="true" className="h-5 w-5" /><span><strong>一起整理志願</strong><small>邀請家人協作、留言與查看版本</small></span></li>
            </ul>
          </section>
          <div className="member-active-logout">
            <button type="button" onClick={logoutFromLine}><LogOut aria-hidden="true" className="h-4 w-4" />登出 LINE</button>
          </div>
          <MembershipSupportLinks />
        </section>
      </main>
    );

  return (
    <main id="main-content" aria-labelledby="member-benefits-title" className="membership-page membership-purchase-page min-h-screen overflow-hidden px-4 py-5 text-slate-900 sm:px-6 sm:py-10">
      <section className="relative mx-auto max-w-6xl">
        <nav aria-label="會員頁面導覽" className="flex items-center justify-between">
          <a
            href={withBasePath("/")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-bold shadow-[3px_3px_0_#161b35] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            回到落點分析
          </a>
          <a href={withBasePath('/membership/account')} aria-label="已購買？查看我的資格" className="member-account-shortcut inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold">
            <BadgeCheck className="h-4 w-4" />
            <span className="sm:hidden">查詢資格</span>
            <span className="hidden sm:inline">已購買？查看我的資格</span>
          </a>
        </nav>
        <section className="member-intro" aria-labelledby="member-benefits-title">
          <div className="member-intro-copy">
            <span className="member-intro-kicker"><Crown className="h-4 w-4" /> 升學小助手會員</span>
            <h1 id="member-benefits-title">少一點打擾，<br /><span>專心規劃下一步。</span></h1>
            <p>從成績分析到志願討論，常用工具都能順暢使用。選擇 30 天或 365 天方案，一次付款，到期不自動續扣。</p>
          </div>
          <div className="member-intro-summary" aria-label="會員方案重點">
            <span>方案一覽</span>
            <strong>NT$49 <small>起</small></strong>
            <p>30 天與 365 天可選</p>
            <a href="#membership-plans" className="member-summary-button">查看方案與價格 <ArrowRight className="h-4 w-4" /></a>
            <div><Check className="h-4 w-4" /> 免廣告與 Offerwall</div>
            <div><Check className="h-4 w-4" /> 免輸入分析授權碼</div>
            <div><Check className="h-4 w-4" /> LINE 登入可找回資格</div>
          </div>
        </section>
        <section className="member-benefits" aria-labelledby="member-benefits-heading">
          <div className="member-section-heading"><div><p className="member-eyebrow">會員權益</p><h2 id="member-benefits-heading">規劃需要的功能，集中在這裡</h2></div></div>
          <div className="member-benefit-grid">
            {[
              { icon: EyeOff, title: '專心閱讀', text: '會員期間不載入網站的 Google 廣告與 Offerwall。', label: '免廣告' },
              { icon: KeyRound, title: '直接開始分析', text: '填好成績後，不必再輸入系統授權碼。', label: '落點分析' },
              { icon: Sparkles, title: '比較成績變化', text: '反覆調整成績，查看一分改變分析。', label: '成績探索' },
              { icon: MessageCircle, title: '一起整理志願', text: '邀請家人協作、留言與查看調整版本。', label: '志願協作' },
            ].map(({ icon: Icon, title, text, label }, index) => <article className="member-benefit" key={title}><div className="member-benefit-top"><Icon className="h-5 w-5" strokeWidth={1.5} /><span>0{index + 1}</span></div><p className="member-benefit-label">{label}</p><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>
        <div id="membership-plans" className="member-purchase-grid">
          <div className="min-w-0">
        <section aria-labelledby="membership-plans-title" className="member-plan-section member-purchase-panel">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="member-step-number">
                  1
                </span>
                <p className="member-step-label">
                  選擇方案
                </p>
              </div>
              <h2 id="membership-plans-title" className="mt-2 text-2xl font-bold">選擇使用期間</h2>
              <p className="mt-2 text-sm text-slate-600">兩種方案享有相同權益，差別只有使用天數與價格。</p>
              <button type="button" onClick={() => setShowPlanComparison(true)} className="member-comparison-link" aria-haspopup="dialog">比較會員權益 <ArrowRight aria-hidden="true" className="h-4 w-4" /></button>
            </div>
          </div>
          <div role="radiogroup" aria-label="選擇會員方案" className="mt-4 grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => {
              const active = plan.id === selected;
              return (
                <button
                  type="button"
                  key={plan.id}
                  onClick={() => setSelected(plan.id)}
                  role="radio"
                  aria-checked={active}
                  aria-label={`${plan.name}，NT$ ${plan.price}，${plan.duration}${active ? '，目前已選擇' : ''}`}
                  className={`member-plan relative overflow-hidden rounded-3xl border p-6 text-left transition sm:p-6 ${active ? "bg-white" : "bg-white/70 hover:bg-white"}`}
                >
                  {plan.featured && (
                    <span className="member-plan-ribbon absolute right-5 top-0 rounded-b-xl px-3 py-1.5 text-xs font-bold">
                      長期規劃更省
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <div
                      className={`member-plan-icon grid h-10 w-10 place-items-center rounded-xl ${plan.featured ? "bg-[#6f54a3] text-white" : "bg-[#eee8fa] text-[#51407d]"}`}
                    >
                      <Crown className="h-5 w-5" />
                    </div>
                    {active && (
                      <span
                        className={`member-plan-picked inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${plan.featured ? "absolute right-4 top-11" : ""}`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        已選擇
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {plan.note}
                  </p>
                  <p
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${plan.featured ? "bg-[#ffe1cf] text-[#873a2e]" : "bg-[#eee8fa] text-[#51407d]"}`}
                  >
                    {plan.comparison}
                  </p>
                  <p className="member-plan-price mt-5 text-4xl font-bold tracking-tight tabular-nums">
                    <span className="mr-1.5 text-sm font-medium text-slate-500">NT$</span>{plan.price}
                    <span className="ml-2 text-sm font-medium text-slate-500">
                      ／{plan.duration}
                    </span>
                  </p>
                  <div className="member-plan-perks mt-5 flex items-center gap-2 border-t pt-4 text-xs font-medium"><Check className="h-4 w-4" />全部會員權益<span className="text-stone-300">／</span>到期不自動續扣</div>
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="membership-email-title"
          className="member-payer-panel member-purchase-panel mt-6 p-5 sm:p-7"
        >
          <div className="flex items-center gap-3">
            <span className="member-step-number">
              2
            </span>
            <p className="member-step-label">
              付款人資料（必填）
            </p>
          </div>
          <h2 id="membership-email-title" className="mt-3 text-xl font-bold">填寫付款資料</h2>
          <p className="mt-1 text-sm font-normal leading-6 text-slate-500">
            付款人姓名用於訂單核對；付款確認與到期提醒將寄送至此信箱。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="membership-payer-name" className="text-sm font-bold text-slate-700">付款人姓名</label>
              <input
                id="membership-payer-name"
                type="text"
                autoComplete="name"
                maxLength={80}
                placeholder="請輸入真實姓名"
                value={payerName}
                onChange={(e) => { setPayerName(e.target.value); setPayerNameError(""); }}
                className={`member-payer-input mt-1 w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition ${payerNameError ? "border-red-400 bg-red-50" : ""}`}
              />
              {payerNameError && <p role="alert" className="mt-2 text-xs font-bold text-red-600">{payerNameError}</p>}
            </div>
            <div>
            <label htmlFor="membership-email" className="text-sm font-bold text-slate-700">付款人電子信箱</label>
            <input
              id="membership-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
              className={`member-payer-input mt-1 w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition ${emailError ? "border-red-400 bg-red-50" : ""}`}
            />
            {emailError && (
              <p role="alert" className="mt-2 text-xs font-bold text-red-600">{emailError}</p>
            )}
            </div>
          </div>
        </section>


          </div>
          <aside className="member-order member-checkout-panel" aria-labelledby="membership-checkout-title">
            <div className="member-order-heading"><LockKeyhole className="h-5 w-5" /><span>最後一步 · 確認與付款</span></div>
            <h2 id="membership-checkout-title">確認本次購買</h2>
            <p className="member-order-intro">先確認 LINE 帳號及付款資料。資格會綁定這個 LINE 帳號，換裝置登入即可查詢。</p>
            <div className="member-login-status"><span className="member-login-icon">{lineName ? <BadgeCheck className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}</span><div className="min-w-0"><p className="break-words font-semibold">{lineName || '登入 LINE 以繼續'}</p><p className="mt-1 text-xs text-slate-500">{lineName ? '身分已確認' : '安全連結你的會員資格'}</p></div></div>
            {lineName ? <div className="mt-3 flex items-center justify-between gap-3 text-xs"><a href={withBasePath('/membership/account')} className="font-semibold text-[#5b4784] underline underline-offset-4">我的帳號與訂單</a><button type="button" onClick={logoutFromLine} className="rounded-lg px-3 py-2 text-slate-500 hover:bg-stone-100">登出 LINE</button></div> : <button type="button" onClick={loginWithLine} className="member-line-button"><img src={withBasePath('/brand/line/line-login.png')} width={44} height={44} alt="" aria-hidden="true" /><span>使用 LINE 登入</span></button>}
            <dl className="member-order-details" aria-live="polite"><div><dt>已選方案</dt><dd>{selectedPlan.name}</dd></div><div><dt>使用期限</dt><dd>{selectedPlan.duration}</dd></div><div><dt>續費方式</dt><dd>不自動續扣</dd></div><div className="member-order-total"><dt>本次付款</dt><dd><span>NT$</span> {selectedPlan.price}</dd></div></dl>
            <button type="button" onClick={checkout} disabled={submitting || !lineName} className="member-pay-button">{submitting ? '正在建立付款單…' : lineName ? '前往安全付款' : '請先登入 LINE'}<ArrowRight className="h-4 w-4" /></button>
            <p className="member-payment-note"><Shield className="h-4 w-4 shrink-0" />由綠界科技 ECPay 處理付款；實際付款方式以結帳頁為準</p>
          </aside>
        </div>

        {notice && (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-900"
          >
            {notice}
          </p>
        )}
        <section aria-labelledby="membership-faq-title" className="member-faq relative mt-10 overflow-hidden rounded-[2rem] bg-white p-5 sm:p-8">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#f6edff]" />
          <div className="relative border-b pb-6">
            <div className="flex items-start gap-4">
              <div className="member-faq-icon"><HelpCircle className="h-6 w-6" /></div>
              <div><p className="member-step-label">購買前常見問題</p><h2 id="membership-faq-title" className="mt-1 text-2xl font-bold sm:text-3xl">常見問題</h2><p className="mt-2 text-sm font-normal leading-6 text-slate-600">付款、會員資格與使用方式，一次整理給你。</p></div>
            </div>
          </div>
          <div className="relative mt-5 grid gap-3">
            {membershipFaqs.map((faq, index) => (
              <details key={faq.q} className="group rounded-2xl border px-4 transition sm:px-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 font-bold [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 items-center gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white text-[11px] font-bold text-emerald-700 shadow-[3px_3px_0_#161b35]">{String(index + 1).padStart(2, '0')}</span><span className="text-sm leading-6 text-slate-800">{faq.q}</span></span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-lg leading-none text-slate-500 transition group-open:rotate-45 group-open:border-emerald-300 group-open:text-emerald-700">+</span>
                </summary>
                <div className="border-t border-emerald-100 pb-4 pt-3">
                  <p className="text-sm font-normal leading-7 text-slate-600">{faq.a}</p>
                  {faq.q === '支援哪些付款方式？' && (
                    <div className="mt-4 grid gap-3 rounded-2xl border border-[#e9dfed] bg-white p-3 sm:p-4 md:grid-cols-[1fr_1.25fr]">
                      <div className="rounded-xl border border-[#e9dfed] bg-white p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#eee7fa] text-[#6e55a1]">
                            <CreditCard className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-xs font-bold text-slate-700">信用卡付款</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {paymentMethods.card.map((method) => (
                            <span key={method} className="flex min-h-10 items-center justify-center rounded-lg border border-[#e9dfed] bg-[#faf7ff] px-2 py-2 text-center text-xs font-bold text-[#51407d]">{method}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-[#e9dfed] bg-white p-3">
                        <p className="mb-2 text-xs font-bold text-slate-700">非信用卡付款</p>
                        <div className="grid grid-cols-2 gap-2">
                          {paymentMethods.other.map((method) => (
                            <span key={method} className="flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center text-xs font-bold text-slate-700">{method}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
        <MembershipSupportLinks />
      </section>
      {showPlanComparison && <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowPlanComparison(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="plan-comparison-title" className="member-comparison-dialog max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="member-step-label">會員權益比較</p><h2 id="plan-comparison-title" className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">把時間留給選擇，<span className="text-[#ad4231]">不要留給限制</span></h2><p className="mt-2 text-sm font-normal leading-6 text-slate-600">會員可以更自在地反覆分析、調整志願，還能邀請家人一起討論到確認。</p></div><button type="button" aria-label="關閉會員比較" onClick={() => setShowPlanComparison(false)} className="rounded-xl border border-[#e7ddeb] p-2 hover:bg-[#f8f4ff]"><X className="h-5 w-5" /></button></div>
          <div className="mt-6 grid gap-3 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-bold text-slate-700">非會員</h3><p className="mt-1 text-xs font-bold text-slate-500">可以試用，但每次規劃都會遇到限制</p></div><span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600">基本使用</span></div><ul className="mt-5 space-y-3 text-sm font-bold text-slate-600">{['可查看公開升學資訊與基本探索功能','分析前需依提示輸入使用授權','沒有免廣告體驗，分析途中可能被打斷','無法使用家長共編與版本還原','一般分享有期限，較適合短暫參考'].map(item => <li key={item} className="flex gap-2"><X className="h-4 w-4 shrink-0 text-slate-400" />{item}</li>)}</ul><p className="mt-5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium leading-5 text-slate-500">只想先看看資料，可以從這裡開始。</p></div><div className="member-comparison-premium relative overflow-hidden rounded-2xl p-4 sm:p-5"><span className="absolute right-3 top-3 rounded-full bg-[#ffe0d3] px-2 py-1 text-[10px] font-bold text-[#873a2e]">最適合實際選志願</span><h3 className="text-lg font-bold">會員</h3><p className="mt-1 text-xs font-bold text-[#5b4784]">把反覆比較、全家討論一次打通</p><ul className="mt-5 space-y-3 text-sm font-bold text-[#332d50]">{['全程免廣告，專心完成分析','免輸入授權碼，直接開始落點分析','無限次數落點分析與一分改變分析','家長協作志願表、留言與版本還原','分享連結與期限管理更完整','一次付款，到期不自動續扣'].map(item => <li key={item} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-[#c74731]" />{item}</li>)}</ul><p className="mt-5 rounded-xl border border-[#e9d7e6] bg-white px-3 py-2 text-xs font-medium leading-5 text-[#5b4784]">整理志願、和家人討論時，就能完整使用這些功能。</p></div></div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowPlanComparison(false)} className="rounded-xl border border-[#e7ddeb] px-4 py-3 text-sm font-bold">先看看</button><button type="button" onClick={() => { setShowPlanComparison(false); document.getElementById('membership-plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="member-comparison-cta inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold">查看方案並升級 <ArrowRight className="h-4 w-4" /></button></div>
        </section>
      </div>}
    </main>
  );
}
