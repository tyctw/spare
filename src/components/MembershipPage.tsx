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
  BadgeCheck,
  Shield,
  LogOut,
} from "lucide-react";
import { callBackend } from "../lib/api";
import {
  clearLineSessionToken,
  consumeLineLoginCodeFromFragment,
  getMembershipStatus,
  type MembershipStatus,
} from "../lib/membership";
import { withBasePath } from "../lib/routes";

const plans = [
  {
    id: "monthly",
    name: "月費體驗方案",
    price: 49,
    duration: "30 天",
    note: "不到一杯飲料的價格，立即享有 30 天純淨無廣告",
    comparison: "🔥 新手推薦！銅板價立即關閉所有廣告",
    accent: "sky",
    featured: true,
  },
  {
    id: "yearly",
    name: "年費超值方案",
    price: 399,
    duration: "365 天",
    note: "平均每天只要 1.1 元，全年專注規劃，免去一切打擾",
    comparison: "🚀 最受歡迎！比月費激省 NT$189",
    accent: "indigo",
    featured: false,
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
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(16rem,.7fr)]">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-black tracking-[0.14em] text-indigo-600">
                MEMBERSHIP SUPPORT
              </p>
              <h2
                id="membership-support-title"
                className="mt-1 text-xl sm:text-2xl font-black"
              >
                會員協助與交易保障
              </h2>
              <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-slate-600">
                需要協助時，我們在這裡。付款、資格確認或使用上的問題，都可以直接來信聯絡。
              </p>
            </div>
          </div>
          <a
            href="mailto:tyctw.analyze@gmail.com?subject=%E6%9C%83%E5%93%A1%E5%85%8D%E5%BB%A3%E5%91%8A%E5%8D%94%E5%8A%A9"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-indigo-50 px-4 py-3.5 text-sm font-black text-indigo-700 transition hover:border-slate-900 hover:bg-indigo-100 sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            tyctw.analyze@gmail.com
          </a>
        </div>
        <div className="border-t-2 border-slate-900 bg-[#f7f9ff] p-5 sm:p-8 md:border-l-2 md:border-t-0">
          <p className="text-[10px] sm:text-xs font-black tracking-[0.14em] text-slate-500">
            MEMBERSHIP INFORMATION
          </p>
          <h3 className="mt-1 text-lg sm:text-xl font-black text-slate-800">
            售後與退款說明
          </h3>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
            查看付款異常、取消申請、退款方式與交易爭議的處理原則。
          </p>
          <div className="mt-5 grid gap-2 sm:gap-3 grid-cols-2">
            <a
              href={withBasePath("/after-sales-service")}
              className="group flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1.5 sm:gap-3 rounded-xl border-2 border-slate-200 bg-white p-2.5 sm:px-4 sm:py-3.5 text-center transition hover:border-slate-900 hover:shadow-[3px_3px_0_#0f172a]"
            >
              <span className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                <HeartHandshake className="h-5 w-5 sm:h-4 sm:w-4 shrink-0 text-indigo-600" />
                <span className="text-xs sm:text-sm font-black text-slate-800">售後服務</span>
              </span>
              <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
            </a>
            <a
              href={withBasePath("/refund-cancellation-policy")}
              className="group flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1.5 sm:gap-3 rounded-xl border-2 border-slate-200 bg-white p-2.5 sm:px-4 sm:py-3.5 text-center transition hover:border-slate-900 hover:shadow-[3px_3px_0_#0f172a]"
            >
              <span className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
                <ReceiptText className="h-5 w-5 sm:h-4 sm:w-4 shrink-0 text-indigo-600" />
                <span className="text-xs sm:text-sm font-black text-slate-800 leading-tight">退款與取消</span>
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
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selected)!,
    [selected],
  );

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
        if (await consumeLineLoginCodeFromFragment())
          setNotice("LINE 登入成功，現在可以查看會員資格。");
        await refresh();
      } catch {
        if (!cancelled) {
          setMembership({ active: false });
          setNotice("LINE 登入已逾時，請再試一次。");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").replace(
      /\/$/,
      "",
    );
    if (!supabaseUrl) {
      setNotice("尚未設定 LINE Login 服務。");
      return;
    }
    window.location.assign(
      `${supabaseUrl}/functions/v1/line-login?returnTo=/membership`,
    );
  };

  const logoutFromLine = async () => {
    clearLineSessionToken();
    setLineName("");
    setMembership({ active: false });
    await callBackend({ action: "revokeLineLoginSession" }).catch(() => undefined);
  };

  const checkout = async () => {
    setSubmitting(true);
    setNotice("");
    try {
      const result = await callBackend<{
        actionUrl: string;
        fields: Record<string, string>;
      }>({
        action: "createMembershipPayment",
        plan: selected,
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
      <main id="main-content" aria-busy="true" aria-labelledby="membership-check-title" className="min-h-screen overflow-hidden bg-[#f5f6ff] px-4 py-7 text-slate-900 sm:px-6 sm:py-12">
        <div aria-hidden="true" className="fixed -left-24 top-20 h-64 w-64 rounded-full bg-violet-200/60 blur-3xl" />
        <div aria-hidden="true" className="fixed -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
        <section className="relative mx-auto max-w-lg">
          <a href={withBasePath("/")} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#161b35] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"><ArrowRight className="h-4 w-4 rotate-180" />回到落點分析</a>
          <article className="relative mt-6 overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[7px_7px_0_#161b35]">
            <div aria-hidden="true" className="absolute -right-10 -top-12 h-36 w-36 rounded-full border-[15px] border-violet-100" />
            <div className="relative border-b-2 border-slate-900 bg-violet-100 px-6 py-5 sm:px-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 text-[11px] font-black tracking-[.14em] text-violet-700"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />SECURE MEMBER CHECK</span>
              <div className="mt-4 flex items-center gap-4"><div aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 bg-white text-violet-700 shadow-[2px_2px_0_#161b35]"><Crown className="h-6 w-6 fill-amber-300" /></div><div><h1 id="membership-check-title" className="text-2xl font-black tracking-tight sm:text-3xl">正在確認會員資格</h1><p className="mt-1 text-sm font-bold text-slate-600">請稍候，我們正在安全確認你的 LINE 身分。</p></div></div>
            </div>
            <div className="relative space-y-3 p-5 sm:p-6">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-500 text-xs font-black text-white">1</span><div className="min-w-0 flex-1"><p className="text-sm font-black">確認 LINE 安全工作階段</p><p className="text-xs font-bold text-emerald-700">已啟動安全驗證</p></div><Check className="h-5 w-5 text-emerald-600" /></div>
              <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3"><span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-600 text-xs font-black text-white">2</span><div className="min-w-0 flex-1"><p className="text-sm font-black">查詢免廣告資格</p><p className="text-xs font-bold text-indigo-700">正在確認方案與有效期限</p></div><span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" /></div>
              <p className="px-1 pt-1 text-center text-xs font-bold leading-5 text-slate-500">登入憑證不會儲存在網址或瀏覽器儲存空間。</p>
            </div>
          </article>
        </section>
      </main>
    );

  if (membership.active)
    return (
      <main id="main-content" aria-labelledby="member-active-title" className="min-h-screen bg-[#f5f6ff] px-4 py-7 text-slate-900 sm:px-6 sm:py-12">
        <section className="mx-auto max-w-5xl">
          <a
            href={withBasePath("/")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#161b35] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            回到落點分析
          </a>
          <article className="relative mt-6 overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#161b35] sm:shadow-[8px_8px_0_#161b35]">
            <div aria-hidden="true" className="absolute -right-12 -top-14 h-40 w-40 rounded-full border-[18px] border-emerald-200/70" />
            <div className="relative border-b-2 border-slate-900 bg-emerald-100 px-5 py-4 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-emerald-700"><BadgeCheck className="h-4 w-4" />會員資格有效</span>
                <span className="text-xs font-black text-emerald-800">廣告已關閉</span>
              </div>
            </div>
            <div className="relative p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 bg-emerald-300 shadow-[3px_3px_0_#161b35]"><Crown className="h-7 w-7 fill-amber-300 text-slate-900" /></div>
                <div>
                  <h1 id="member-active-title" className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">現在享有純淨閱讀</h1>
                  <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600 sm:text-base">在會員資格有效期間，查校、比對與規劃頁面都不會載入 Google 廣告或 Offerwall。</p>
                </div>
              </div>
              <div className="mt-6 grid gap-0 sm:gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5 text-slate-700 sm:grid-cols-3 divide-y divide-emerald-200/50 sm:divide-y-0">
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start py-3 sm:py-0 first:pt-0 last:pb-0">
                  <p className="text-[11px] font-black tracking-[.12em] text-slate-500">LINE 會員帳號</p>
                  <p className="mt-0 sm:mt-1 font-black truncate max-w-[150px] sm:max-w-full" title={lineName}>{lineName || '已完成 LINE 驗證'}</p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start py-3 sm:py-0 first:pt-0 last:pb-0">
                  <p className="text-[11px] font-black tracking-[.12em] text-slate-500">目前方案</p>
                  <p className="mt-0 sm:mt-1 font-black">{membership.plan === 'yearly' ? '年費會員' : '月費會員'}</p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start py-3 sm:py-0 first:pt-0 last:pb-0">
                  <p className="text-[11px] font-black tracking-[.12em] text-slate-500">免廣告有效期限</p>
                  <p className="mt-0 sm:mt-1 inline-flex items-center gap-1.5 font-black text-emerald-800"><CalendarDays className="h-4 w-4 hidden sm:block" />{new Intl.DateTimeFormat("zh-TW", { dateStyle: "long" }).format(new Date(membership.expiresAt!))}</p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-3 rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-3.5 text-sm font-bold leading-6 text-sky-900">
                <KeyRound className="mt-0.5 h-5 w-5 shrink-0" />
                會員資格有效期間，回到首頁填妥成績後即可直接開始落點分析，無需再輸入系統授權碼。
              </div>
              <div className="mt-10 flex flex-col items-center justify-center border-t-2 border-slate-100 pt-8 pb-4">
                <div className="grid w-full gap-4 sm:max-w-2xl sm:grid-cols-2">
                  <a href={withBasePath("/")} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-indigo-600 px-6 py-4 sm:px-8 sm:py-5 text-base sm:text-lg font-black text-white shadow-[4px_4px_0_#161b35] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#161b35] active:translate-y-0 active:shadow-none">
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                    開始使用落點分析
                  </a>
                  <a href={withBasePath("/membership/account")} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 py-4 sm:px-8 sm:py-5 text-base sm:text-lg font-black text-slate-900 shadow-[4px_4px_0_#161b35] transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#161b35] active:translate-y-0 active:shadow-none">
                    <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                    我的會員帳號
                  </a>
                </div>
              </div>
              <div className="mt-6 border-t-2 border-slate-100 pt-5 text-center">
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
      <div
        aria-hidden="true"
        className="fixed -left-40 top-24 h-96 w-96 rounded-full bg-sky-200/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="fixed -right-36 top-0 h-[32rem] w-[32rem] rounded-full bg-amber-200/60 blur-3xl"
      />
      <section className="relative mx-auto max-w-6xl">
        <nav aria-label="會員頁面導覽" className="flex items-center justify-between">
          <a
            href={withBasePath("/")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#161b35] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            回到落點分析
          </a>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-amber-300 px-4 py-2 text-sm font-black text-slate-900 shadow-[3px_3px_0_#161b35]">
            <Crown className="h-4 w-4 fill-amber-100 text-slate-900" />
            會員中心
          </span>
        </nav>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.12fr_.88fr]">
          <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-900 bg-violet-100 p-5 text-slate-900 shadow-[6px_6px_0_#161b35] sm:p-6">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[14px] border-violet-300/70"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 right-16 h-16 w-16 rounded-t-full bg-amber-300/60"
            />
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
                    <p className="text-sm font-black">無限次數落點分析</p>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-600">綁定 LINE 帳號，免輸入授權碼即可無限次數暢測。</p>
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
          <aside className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0_#161b35] sm:p-8">
            <div aria-hidden="true" className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl pointer-events-none" />
            <div aria-hidden="true" className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-amber-100/50 blur-2xl pointer-events-none" />
            
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-900 bg-emerald-400 text-sm font-black shadow-[2px_2px_0_#161b35]">
                  1
                </span>
                <p className="text-xs font-black tracking-[.2em] text-emerald-600">
                  身分確認
                </p>
              </div>
              <h2 className="mt-4 text-2xl font-black">先登入你的 LINE</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
                會員資格會與 LINE 帳號連結，登入後即可選擇方案並在其他裝置找回資格。
              </p>

              <div
                className={`relative mt-6 overflow-hidden rounded-2xl border-2 p-4 transition-colors ${lineName ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
              >
                {lineName && (
                  <div aria-hidden="true" className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-200/40 blur-xl pointer-events-none" />
                )}
                <div className="relative flex items-center gap-4">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0_#161b35] ${lineName ? "bg-emerald-400 text-slate-900" : "bg-white text-slate-400"}`}
                  >
                    {lineName ? (
                      <Check className="h-6 w-6" strokeWidth={3} />
                    ) : (
                      <LogIn className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900">
                      {lineName ? `已登入・${lineName}` : "尚未登入 LINE"}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <span className={!lineName ? "text-slate-600" : ""}>
                        {lineName ? "可以繼續選擇方案" : "登入後即可啟用付款按鈕"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8">
              {lineName ? (
                <div className="space-y-3">
                  <a
                    href={withBasePath("/membership/account")}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-black text-slate-700 transition hover:border-slate-900 hover:shadow-[4px_4px_0_#161b35]"
                  >
                    <span className="flex items-center gap-2.5">
                      <ReceiptText className="h-5 w-5 text-indigo-500" />
                      查看訂單與購買紀錄
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
                  </a>
                  <button
                    type="button"
                    onClick={logoutFromLine}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-transparent px-4 py-3 text-sm font-black text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <LogOut className="h-4 w-4" />
                    登出 LINE
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={loginWithLine}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-slate-900 bg-[#06c755] px-6 py-4 text-base font-black text-white shadow-[4px_4px_0_#161b35] transition-all hover:-translate-y-1 hover:bg-[#05b84e] hover:shadow-[6px_6px_0_#161b35] active:translate-y-0 active:shadow-none"
                >
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                    <div className="relative h-full w-8 bg-white/20" />
                  </div>
                  <LogIn className="h-5 w-5" />
                  使用 LINE 登入
                </button>
              )}
            </div>
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
              const active = plan.id === selected;
              return (
                <button
                  type="button"
                  key={plan.id}
                  onClick={() => setSelected(plan.id)}
                  role="radio"
                  aria-checked={active}
                  aria-label={`${plan.name}，NT$ ${plan.price}，${plan.duration}${active ? '，目前已選擇' : ''}`}
                  className={`relative overflow-hidden rounded-[2rem] border-2 p-4 text-left transition sm:p-5 ${active ? "border-slate-900 bg-white shadow-[7px_7px_0_#161b35] -translate-y-1 ring-4 ring-amber-200" : "border-slate-300 bg-white/70 hover:border-slate-900 hover:bg-white"}`}
                >
                  {plan.featured && (
                    <span className="absolute right-5 top-0 rounded-b-xl border-x-2 border-b-2 border-slate-900 bg-amber-300 px-3 py-1.5 text-xs font-black">
                      最推薦・低門檻
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-slate-900 ${plan.accent === "indigo" ? "bg-indigo-600 text-white" : "bg-sky-300 text-slate-900"}`}
                    >
                      <Crown className="h-5 w-5" />
                    </div>
                    {active && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border-2 border-slate-900 bg-emerald-300 px-2 py-1 text-xs font-black ${plan.featured ? "absolute right-4 top-11" : ""}`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        已選擇
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-black">{plan.name}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {plan.note}
                  </p>
                  <p
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black ${plan.featured ? "bg-amber-100 text-amber-800" : "bg-indigo-50 text-indigo-700"}`}
                  >
                    {plan.comparison}
                  </p>
                  <p className="mt-3 text-3xl font-black">
                    NT$ {plan.price}
                    <span className="ml-2 text-base text-slate-500">
                      ／{plan.duration}
                    </span>
                  </p>
                </button>
              );
            })}
          </div>
        </section>
        <section
          aria-labelledby="membership-checkout-title"
          className="mt-8 rounded-[2rem] border-2 border-slate-900 bg-violet-100 p-5 text-slate-900 shadow-[7px_7px_0_#161b35] sm:flex sm:items-center sm:justify-between sm:p-7"
        >
          <div>
            <p className="text-xs font-black tracking-[.18em] text-violet-700">
              準備好了嗎？
            </p>
            <h2 id="membership-checkout-title" className="mt-2 text-2xl font-black">
              {lineName
                ? `以 NT$ ${selectedPlan.price} 啟動 ${selectedPlan.name}`
                : "登入 LINE 後，即可開始你的免廣告方案"}
            </h2>
          </div>
          <button
            type="button"
            onClick={checkout}
            disabled={submitting || !lineName}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-indigo-600 px-6 py-4 text-base font-black text-white shadow-[4px_4px_0_#161b35] transition hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0 sm:w-auto"
          >
            {submitting
              ? "正在建立付款單…"
              : lineName
                ? "前往安全付款"
                : "請先登入 LINE"}
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>

        {notice && (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-900"
          >
            {notice}
          </p>
        )}
        <section aria-labelledby="membership-faq-title" className="mt-8 overflow-hidden rounded-[1.75rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#161b35]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black tracking-[.14em] text-amber-600">FAQ</p>
              <h2 id="membership-faq-title" className="mt-0.5 text-xl font-black">常見問題</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-100 px-5 sm:px-6">
            {membershipFaqs.map((faq) => (
              <details key={faq.q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 font-black [&::-webkit-details-marker]:hidden">
                  <span className="text-sm leading-6">{faq.q}</span>
                  <span className="shrink-0 text-xl leading-none text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <div className="pb-4">
                  <p className="text-sm font-bold leading-7 text-slate-600">{faq.a}</p>
                  {faq.q === '支援哪些付款方式？' && (
                    <div className="mt-4 grid gap-3 rounded-2xl border border-indigo-100 bg-[#f7f9ff] p-3 sm:p-4 md:grid-cols-[1fr_1.25fr]">
                      <div className="rounded-xl border border-indigo-100 bg-white p-3 shadow-sm">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
                            <CreditCard className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-xs font-black text-slate-700">信用卡付款</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {paymentMethods.card.map((method) => (
                            <span key={method} className="flex min-h-10 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50/60 px-2 py-2 text-center text-xs font-black text-indigo-900">{method}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-xs font-black text-slate-700">非信用卡付款</p>
                        <div className="grid grid-cols-2 gap-2">
                          {paymentMethods.other.map((method) => (
                            <span key={method} className="flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center text-xs font-black text-slate-700">{method}</span>
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
    </main>
  );
}
