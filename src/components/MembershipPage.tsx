import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
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
  MonitorSmartphone,
  ReceiptText,
  Sparkles,
  X,
} from "lucide-react";
import { callBackend } from "../lib/api";
import {
  getLineLoginUrl,
  getStoredLineName,
  logoutLine,
} from "../lib/lineAuth";
import { useMembership } from "../lib/membershipContext";
import { withBasePath } from "../lib/utils";

const plans = [
  {
    id: "monthly",
    name: "月費會員",
    price: 49,
    duration: "30天",
    note: "適合短期衝刺查校的同學",
    comparison: "NT$ 49 / 月",
    featured: false,
    accent: "sky",
  },
  {
    id: "yearly",
    name: "年費會員",
    price: 399,
    duration: "365天",
    note: "適合想要長期查詢的同學",
    comparison: "平均只要 NT$ 33 / 月，省下 NT$ 189",
    featured: true,
    accent: "indigo",
  },
] as const;
type PlanId = (typeof plans)[number]["id"];

const membershipFaqs = [
  {
    q: '月費與年費有什麼差別？',
    a: '月費方案 NT$49，有效期 30 天；年費方案 NT$399，有效期 365 天。年費等同每天約 NT$1.1，比連續購買 12 個月月費省下 NT$189。兩種方案均為一次付款，到期不自動續扣。',
  },
  {
    q: '付款後何時生效？',
    a: '付款完成並收到系統確認後，會員資格即刻生效。以 LINE 帳號登入確認資格後，即可免輸入系統授權碼直接開始落點分析。若付款後資格未正常顯示，請來信客服確認。',
  },
  {
    q: '到期後會自動扣款嗎？',
    a: '不會。月費與年費均為一次性付款，期間結束後不會自動續費或扣款，無需手動取消。若要繼續使用，到期後再重新購買即可。',
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
      className="mt-8 overflow-hidden rounded-[1.75rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#0f172a]"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,.8fr)]">
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black tracking-[0.14em] text-indigo-600">
                MEMBERSHIP SUPPORT
              </p>
              <h2
                id="membership-support-title"
                className="mt-1 text-xl font-black"
              >
                客服與支援
              </h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                遇到付款問題、資格未開通，或是需要申請退款？請透過 Email
                與我們聯繫，我們將盡快為您處理。
              </p>
              <a
                href="mailto:support@tyctw.github.io"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700 transition hover:bg-indigo-100"
              >
                聯絡客服團隊
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <h3 className="text-sm font-black">實用連結</h3>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={withBasePath("/terms/refund")}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-600"
              >
                <HeartHandshake className="h-4 w-4" />
                退款與取消政策
              </a>
            </li>
            <li>
              <a
                href={withBasePath("/terms/privacy")}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-600"
              >
                <HeartHandshake className="h-4 w-4" />
                隱私權政策
              </a>
            </li>
            <li>
              <a
                href={withBasePath("/terms/service")}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-600"
              >
                <HeartHandshake className="h-4 w-4" />
                服務條款
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function MembershipPage() {
  const [selected, setSelected] = useState<PlanId>("monthly");
  const [lineName, setLineName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const { membership, checkMembershipStatus } = useMembership();

  useEffect(() => {
    document.title = "會員中心｜會考落點分析";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "無廣告的專注體驗，一次付款，免輸入系統授權碼。"
      );
    }
  }, []);

  useEffect(() => {
    setLineName(getStoredLineName());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorMsg = params.get("error");
    if (errorMsg) {
      setNotice(decodeURIComponent(errorMsg));
    }
  }, []);

  useEffect(() => {
    // 解決 Safari 或 BFCache 造成返回上一頁時，狀態仍卡在 submitting 的問題
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setSubmitting(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((p) => p.id === selected)!,
    [selected]
  );

  const loginWithLine = () => {
    window.location.href = getLineLoginUrl("/membership");
  };

  const logoutFromLine = () => {
    logoutLine();
    setLineName(null);
    checkMembershipStatus(); // refresh context
  };

  const checkout = async () => {
    if (!lineName) {
      setNotice("請先使用 LINE 登入，以便為您綁定會員資格。");
      return;
    }
    try {
      setSubmitting(true);
      setNotice(null);
      const res = await callBackend("checkout", { plan: selected });
      if (res.formHtml) {
        const formContainer = document.createElement("div");
        formContainer.style.display = "none";
        formContainer.innerHTML = res.formHtml;
        document.body.appendChild(formContainer);
        const form = formContainer.querySelector("form");
        if (form) {
          form.submit();
        } else {
          setNotice("無法啟動付款程序，請稍後再試或聯繫客服。");
          setSubmitting(false);
        }
      } else {
        setNotice(res.error || "建立訂單失敗。");
        setSubmitting(false);
      }
    } catch (err: any) {
      console.error(err);
      setNotice(err.message || "系統錯誤，請稍後再試。");
      setSubmitting(false);
    }
  };

  if (membership === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6ff]">
        <div className="flex flex-col items-center gap-4 text-indigo-700">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-black tracking-widest">
            正在確認會員狀態...
          </p>
        </div>
      </main>
    );
  }

  if (membership.active)
    return (
      <main id="main-content" aria-labelledby="membership-active-title" className="min-h-screen overflow-hidden bg-[#f5f6ff] px-4 py-5 text-slate-900 sm:px-6 sm:py-10">
        <div aria-hidden="true" className="fixed -left-40 top-24 h-96 w-96 rounded-full bg-emerald-200/60 blur-3xl" />
        <div aria-hidden="true" className="fixed -right-36 top-0 h-[32rem] w-[32rem] rounded-full bg-indigo-200/60 blur-3xl" />
        <section className="relative mx-auto max-w-6xl">
          <nav aria-label="會員頁面導覽" className="flex items-center justify-between">
            <a href={withBasePath("/")} className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white/90 px-3 py-2 text-sm font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900">
              <ArrowRight className="h-4 w-4 rotate-180" />
              回到落點分析
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-900 bg-emerald-100 px-3 py-2 text-xs font-black text-emerald-800">
              <Crown className="h-4 w-4 fill-emerald-400 text-emerald-600" />
              有效會員
            </span>
          </nav>
          <article className="mt-6 overflow-hidden rounded-[2.5rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#161b35]">
            <div className="border-b border-slate-100 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-[.18em] text-emerald-600">STATUS</p>
                    <h1 id="member-active-title" className="text-3xl font-black tracking-tight sm:text-4xl">現在享有純淨閱讀</h1>
                    <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600">在會員資格有效期間，查校、比對與規劃頁面都不會載入 Google 廣告或 Offerwall。</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-slate-700 sm:grid-cols-3">
                <div><p className="text-[11px] font-black tracking-[.12em] text-slate-500">LINE 會員帳號</p><p className="mt-1 font-black">{lineName || '已完成 LINE 驗證'}</p></div>
                <div><p className="text-[11px] font-black tracking-[.12em] text-slate-500">目前方案</p><p className="mt-1 font-black">{membership.plan === 'yearly' ? '年費會員' : '月費會員'}</p></div>
                <div><p className="text-[11px] font-black tracking-[.12em] text-slate-500">免廣告有效期限</p><p className="mt-1 inline-flex items-center gap-1.5 font-black text-emerald-800"><CalendarDays className="h-4 w-4" />{new Intl.DateTimeFormat("zh-TW", { dateStyle: "long" }).format(new Date(membership.expiresAt!))}</p></div>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-bold leading-6 text-sky-900">
                <KeyRound className="mt-0.5 h-4 w-4 shrink-0" />
                會員資格有效期間，回到首頁填妥成績後即可直接開始落點分析，無需再輸入系統授權碼。
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a href={withBasePath("/")} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-5 py-3.5 font-black text-white shadow-[3px_3px_0_#161b35] transition hover:-translate-y-0.5"><Sparkles className="h-4 w-4" />開始使用落點分析</a>
                <a href={withBasePath("/membership/account")} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-5 py-3.5 font-black shadow-[3px_3px_0_#161b35] transition hover:-translate-y-0.5"><Crown className="h-4 w-4 text-emerald-600" />我的會員帳號</a>
              </div>
              <div className="mt-5 border-t border-slate-200 pt-4 text-center">
                <button type="button" onClick={logoutFromLine} className="text-sm font-black text-slate-500 underline decoration-slate-300 decoration-2 underline-offset-4 transition hover:text-slate-900">登出 LINE</button>
              </div>
            </div>
          </article>
          <MembershipSupportLinks />
        </section>
      </main>
    );

  return (
    <main id="main-content" aria-labelledby="membership-page-title" className="min-h-screen overflow-hidden bg-[#f5f6ff] px-4 py-5 text-slate-900 sm:px-6 sm:py-10">
      <div aria-hidden="true" className="fixed -left-40 top-24 h-96 w-96 rounded-full bg-sky-200/60 blur-3xl" />
      <div aria-hidden="true" className="fixed -right-36 top-0 h-[32rem] w-[32rem] rounded-full bg-amber-200/60 blur-3xl" />
      <section className="relative mx-auto max-w-6xl">
        <nav aria-label="會員頁面導覽" className="flex items-center justify-between">
          <a href={withBasePath("/")} className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white/90 px-3 py-2 text-sm font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900">
            <ArrowRight className="h-4 w-4 rotate-180" />
            回到落點分析
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-2 text-xs font-black text-indigo-700">
            <Crown className="h-4 w-4 fill-amber-300 text-amber-500" />
            會員中心
          </span>
        </nav>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.12fr_.88fr]">
          <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-900 bg-violet-100 p-5 text-slate-900 shadow-[6px_6px_0_#161b35] sm:p-6">
            <div aria-hidden="true" className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[14px] border-violet-300/70" />
            <div aria-hidden="true" className="absolute bottom-0 right-16 h-16 w-16 rounded-t-full bg-amber-300/60" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/85 px-3 py-1.5 text-xs font-black tracking-[.16em] text-violet-700">
                <Crown className="h-4 w-4 fill-amber-300 text-amber-500" />
                會員專屬優點
              </span>
              <h1 id="membership-page-title" className="mt-4 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                升級會員，<span className="text-violet-700">差在這裡</span>
              </h1>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <li className="flex items-start gap-3 rounded-2xl border border-violet-200 bg-white/80 p-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                    <EyeOff className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-black">完全無廣告</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-600">全程不被廣告打斷，專注在志願選擇上。</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-violet-200 bg-white/80 p-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-black">免輸入系統授權碼</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-600">登入 LINE 後直接開始落點分析，不必每次手動輸入。</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-violet-200 bg-white/80 p-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <MonitorSmartphone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-black">跨裝置找回資格</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-600">資格綁定 LINE，手機、電腦、平板都能直接確認。</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-2xl border border-violet-200 bg-white/80 p-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <LockKeyhole className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-black">一次付款不自動續扣</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-600">NT$49 起，方案到期後不扣款，無需手動取消。</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <aside className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-2 border-slate-900 bg-white p-6 shadow-[9px_9px_0_#161b35] sm:p-7">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#06c755]/10 text-sm font-black text-[#06c755]">
                    1
                  </span>
                  <p className="text-xs font-black tracking-[.18em] text-slate-500">STEP ONE</p>
                </div>
                {lineName && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black tracking-wide text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    已連線
                  </span>
                )}
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-900">先登入你的 LINE</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                會員資格將與 LINE 帳號綁定。登入後即可解鎖方案，並在任何裝置上找回你的會員狀態。
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t-2 border-dashed border-slate-100">
              {lineName ? (
                <div>
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-[#06c755]/20 bg-[#06c755]/5 p-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#06c755] text-white shadow-sm">
                      <Check className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-slate-900">{lineName}</p>
                      <p className="mt-0.5 text-xs font-bold text-slate-500">可繼續往下選擇方案</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    <a href={withBasePath("/membership/account")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200">
                      <ReceiptText className="h-4 w-4 text-slate-500" />
                      查看訂單紀錄
                    </a>
                    <button type="button" onClick={logoutFromLine} className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-slate-400 transition hover:bg-slate-50 hover:text-slate-600">
                      登出帳號
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 hidden flex items-center justify-center gap-2 rounded-2xl bg-slate-50 py-3 text-sm font-bold text-slate-400">
                    <div className="h-2 w-2 rounded-full bg-slate-300"></div>
                    等待登入中...
                  </div>
                  <button type="button" onClick={loginWithLine} className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-[#06c755] px-5 py-4 font-black text-white transition hover:-translate-y-1 hover:bg-[#05b84e] hover:shadow-lg hover:shadow-[#06c755]/30 active:translate-y-0 active:shadow-none">
                    <div className="absolute inset-0 rounded-2xl border-2 border-black/10"></div>
                    <LogIn className="h-5 w-5 transition-transform group-hover:scale-110" />
                    使用 LINE 登入
                  </button>
                </div>
              )}
            </div>

            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-[#06c755]/5 blur-3xl pointer-events-none"></div>
          </aside>
        </div>

        <section className="mt-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-900 bg-amber-300 text-sm font-black">
                  2
                </span>
                <p className="text-xs font-black tracking-[.18em] text-indigo-600">
                  選擇方案
                </p>
              </div>
              <h2 className="mt-2 text-2xl font-black">選擇適合你的專注時光</h2>
            </div>
          </div>
          <div role="radiogroup" aria-label="選擇會員方案" className="mt-4 grid gap-4 md:grid-cols-2">
            {plans.map((plan) => {
              const isSelected = selected === plan.id;
              return (
                <label
                  key={plan.id}
                  className={`relative cursor-pointer overflow-hidden rounded-[2rem] border-2 transition-all duration-300 ${isSelected ? 'border-slate-900 bg-white shadow-[6px_6px_0_#161b35]' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'} ${!lineName && 'opacity-60 cursor-not-allowed grayscale'}`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={isSelected}
                    onChange={(e) => lineName && setSelected(e.target.value as PlanId)}
                    disabled={!lineName}
                    className="sr-only"
                    aria-describedby={`plan-${plan.id}-desc`}
                  />
                  {plan.featured && (
                    <div className="absolute right-0 top-0 rounded-bl-2xl rounded-tr-[1.8rem] border-b-2 border-l-2 border-slate-900 bg-amber-300 px-3 py-1.5 text-[11px] font-black tracking-widest text-slate-900">
                      最划算推薦
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-slate-900 transition-colors ${isSelected ? 'bg-indigo-500' : 'bg-white'}`}>
                        {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                      <h3 className="text-xl font-black">{plan.name}</h3>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-black">NT$ {plan.price}</span>
                      <span className="text-sm font-bold text-slate-500">/ {plan.duration}</span>
                    </div>
                    <p id={`plan-${plan.id}-desc`} className="mt-2 text-sm font-bold leading-relaxed text-slate-600">
                      {plan.note}
                    </p>
                    <div className="mt-4 inline-block rounded-xl bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-500">
                      {plan.comparison}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          {notice && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              {notice}
            </div>
          )}
          <div className="mt-8 text-center">
            <button
              onClick={checkout}
              disabled={submitting || !lineName}
              className={`group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-slate-900 px-8 py-4 font-black shadow-[4px_4px_0_#161b35] transition-all sm:w-auto ${
                submitting || !lineName
                  ? "bg-slate-100 text-slate-400"
                  : "bg-amber-300 text-slate-900 hover:-translate-y-0.5 hover:bg-amber-400 active:translate-y-0 active:shadow-none"
              }`}
            >
              {submitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-slate-600"></div>
                  處理中...
                </>
              ) : (
                <>
                  前往結帳 <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            <p className="mt-3 text-[11px] font-bold text-slate-500">
              點擊即表示同意會員服務條款與退款政策
            </p>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="mt-16">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <HelpCircle className="h-5 w-5" />
            </div>
            <h2 id="faq-title" className="text-xl font-black">常見問題</h2>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {membershipFaqs.map((faq, index) => (
              <details key={index} className="group rounded-2xl border-2 border-slate-200 bg-white p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-black text-slate-800 outline-none">
                  {faq.q}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-open:rotate-45 group-open:bg-violet-100 group-open:text-violet-600">
                    <X className="h-3.5 w-3.5 rotate-45" />
                  </span>
                </summary>
                <div className="mt-3 text-sm font-bold leading-relaxed text-slate-600">
                  {faq.a}
                  {faq.q === '支援哪些付款方式？' && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                          <CreditCard className="h-4 w-4" />
                          信用卡 / 行動支付
                        </div>
                        <p className="mt-1 text-[11px] font-bold text-slate-500">{paymentMethods.card.join('、')}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                          <ReceiptText className="h-4 w-4" />
                          其他免綁卡方式
                        </div>
                        <p className="mt-1 text-[11px] font-bold text-slate-500">{paymentMethods.other.join('、')}</p>
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
    </main>
  );
}

