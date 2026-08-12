import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
  EyeOff,
  HeartHandshake,
  KeyRound,
  LockKeyhole,
  LogIn,
  Mail,
  MonitorSmartphone,
  ReceiptText,
  Sparkles,
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
    name: "月費會員",
    price: 49,
    duration: "30 天",
    note: "不到一杯飲料的價格，享有 30 天免廣告",
    comparison: "低門檻，先從一個月開始",
    accent: "sky",
    featured: true,
  },
  {
    id: "yearly",
    name: "年費會員",
    price: 399,
    duration: "365 天",
    note: "平均每天約 NT$1.1，享有 365 天免廣告",
    comparison: "比月費連續 12 期省 NT$189",
    accent: "indigo",
    featured: false,
  },
] as const;
type PlanId = (typeof plans)[number]["id"];

const benefits = [
  {
    icon: EyeOff,
    title: "專心不被打斷",
    text: "不載入廣告，查校、比對與規劃更專注。",
    tone: "bg-violet-100 text-violet-700",
  },
  {
    icon: MonitorSmartphone,
    title: "LINE 跨裝置確認",
    text: "登入你的 LINE，即可在不同裝置找回資格。",
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: KeyRound,
    title: "免輸入系統授權碼",
    text: "會員資格有效且登入 LINE 後，可直接開始落點分析。",
    tone: "bg-sky-100 text-sky-700",
  },
  {
    icon: LockKeyhole,
    title: "安全且不自動續扣",
    text: "期間方案一次付款，到期前不會自動收費。",
    tone: "bg-amber-100 text-amber-700",
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
                會員協助與交易保障
              </h2>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-600">
                需要協助時，我們在這裡。付款、資格確認或使用上的問題，都可以直接來信聯絡。
              </p>
            </div>
          </div>
          <a
            href="mailto:tyctw.analyze@gmail.com?subject=%E6%9C%83%E5%93%A1%E5%85%8D%E5%BB%A3%E5%91%8A%E5%8D%94%E5%8A%A9"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100 sm:w-auto"
          >
            <Mail className="h-4 w-4" />
            tyctw.analyze@gmail.com
          </a>
        </div>
        <div className="border-t border-indigo-100 bg-[#f7f9ff] p-6 sm:p-8 lg:border-l lg:border-t-0">
          <p className="text-xs font-black tracking-[0.14em] text-slate-500">
            MEMBERSHIP INFORMATION
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-800">
            售後與退款說明
          </h3>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
            查看付款異常、取消申請、退款方式與交易爭議的處理原則。
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <a
              href={withBasePath("/after-sales-service")}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:border-indigo-400 hover:text-indigo-700"
            >
              <span className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-indigo-600" />
                售後服務
              </span>
              <ArrowRight className="h-4 w-4 text-indigo-500 transition group-hover:translate-x-1" />
            </a>
            <a
              href={withBasePath("/refund-cancellation-policy")}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:border-indigo-400 hover:text-indigo-700"
            >
              <span className="flex items-center gap-2">
                <ReceiptText className="h-4 w-4 text-indigo-600" />
                退款與取消政策
              </span>
              <ArrowRight className="h-4 w-4 text-indigo-500 transition group-hover:translate-x-1" />
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
          <a href={withBasePath("/")} className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white/90 px-3 py-2 text-sm font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900"><ArrowRight className="h-4 w-4 rotate-180" />回到落點分析</a>
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
        <section className="mx-auto max-w-3xl">
          <a
            href={withBasePath("/")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white/90 px-3 py-2 text-sm font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            回到落點分析
          </a>
          <article className="relative mt-6 overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[8px_8px_0_#161b35]">
            <div aria-hidden="true" className="absolute -right-12 -top-14 h-40 w-40 rounded-full border-[18px] border-emerald-200/70" />
            <div className="relative border-b-2 border-slate-900 bg-emerald-100 px-6 py-4 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-emerald-700"><BadgeCheck className="h-4 w-4" />會員資格有效</span>
                <span className="text-xs font-black text-emerald-800">廣告已關閉</span>
              </div>
            </div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 bg-emerald-300 shadow-[3px_3px_0_#161b35]"><Crown className="h-7 w-7 fill-amber-300 text-slate-900" /></div>
                  <div>
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
                <a href={withBasePath("/membership/account")} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-5 py-3.5 font-black shadow-[3px_3px_0_#161b35] transition hover:-translate-y-0.5"><BadgeCheck className="h-4 w-4 text-emerald-600" />我的會員帳號</a>
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white/90 px-3 py-2 text-sm font-black text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900"
          >
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
                <Sparkles className="h-4 w-4 text-violet-600" />
                會員免廣告
              </span>
              <h1 id="membership-page-title" className="mt-4 max-w-xl text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl">
                把注意力，
                <br />
                <span className="text-violet-700">留給你的選擇。</span>
              </h1>
              <p className="mt-3 max-w-lg text-sm font-bold leading-6 text-slate-600">
                不到一杯飲料的價格，換來 30 天專心查校、比對與規劃。使用 LINE
                登入確認資格，可在不同裝置恢復。
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-white/85 px-3 py-2 text-xs font-black leading-5 text-sky-800">
                <KeyRound className="h-4 w-4 shrink-0" />有效會員登入 LINE 後，落點分析免輸入系統授權碼。
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-black text-slate-700">
                  NT$49 起
                </span>
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-black text-slate-700">
                  一次付款
                </span>
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-black text-slate-700">
                  不自動續扣
                </span>
              </div>
            </div>
          </section>
          <aside className="rounded-[2.5rem] border-2 border-slate-900 bg-white p-5 shadow-[9px_9px_0_#161b35] sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-slate-900 bg-emerald-300 text-sm font-black">
                1
              </span>
              <p className="text-xs font-black tracking-[.18em] text-slate-500">
                身分確認
              </p>
            </div>
            <h2 className="mt-3 text-xl font-black">先登入你的 LINE</h2>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
              會員資格會與 LINE
              帳號連結，登入後即可選擇方案並在其他裝置找回資格。
            </p>
            <div
              className={`mt-4 rounded-2xl border-2 p-3 ${lineName ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl border-2 border-slate-900 ${lineName ? "bg-emerald-300" : "bg-white"}`}
                >
                  {lineName ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <LogIn className="h-5 w-5 text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black">
                    {lineName ? `已登入・${lineName}` : "尚未登入 LINE"}
                  </p>
                  <p className="text-xs font-bold text-slate-500">
                    {lineName ? "可以繼續選擇方案" : "登入後即可啟用付款按鈕"}
                  </p>
                </div>
              </div>
            </div>
            {lineName ? (
              <>
                <a
                  href={withBasePath("/membership/account")}
                  className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-sm font-black text-violet-800 transition hover:border-violet-400 hover:bg-violet-100"
                >
                  <span className="flex items-center gap-2"><ReceiptText className="h-4 w-4" />查看訂單與購買紀錄</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={logoutFromLine}
                  className="mt-3 block w-full text-center text-sm font-black text-slate-500 underline underline-offset-4 transition hover:text-slate-900"
                >
                  登出 LINE
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={loginWithLine}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-[#06c755] px-5 py-3 font-black text-white shadow-[4px_4px_0_#161b35] transition hover:-translate-y-0.5 hover:bg-[#05b84e] active:translate-y-0 active:shadow-none"
              >
                <LogIn className="h-5 w-5" />
                使用 LINE 登入
              </button>
            )}
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
                  className={`relative overflow-hidden rounded-[2rem] border-2 p-4 text-left transition sm:p-5 ${active ? "border-slate-900 bg-white shadow-[7px_7px_0_#161b35] -translate-y-1" : "border-slate-300 bg-white/70 hover:border-slate-900 hover:bg-white"} ${plan.featured ? "ring-4 ring-amber-200" : ""}`}
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
        <section
          aria-labelledby="membership-details-title"
          className="mt-8 overflow-hidden rounded-[1.75rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#161b35]"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
              <BadgeCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black tracking-[.14em] text-indigo-600">
                MEMBERSHIP DETAILS
              </p>
              <h2
                id="membership-details-title"
                className="mt-1 text-xl font-black"
              >
                方案保障與付款方式
              </h2>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {benefits.map(({ icon: Icon, title, text, tone }) => (
                <article
                  key={title}
                  className="flex gap-2.5 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">{title}</h3>
                    <p className="mt-0.5 text-xs font-bold leading-5 text-slate-600">
                      {text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-4 grid gap-3 rounded-2xl border border-indigo-100 bg-[#f7f9ff] p-3 sm:p-4 lg:grid-cols-[minmax(12rem,.72fr)_1fr_1.25fr] lg:items-stretch">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-indigo-700">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[.14em] text-indigo-600">
                    ECPAY SECURE PAYMENT
                  </p>
                  <h3 className="mt-0.5 text-base font-black">
                    支援的付款方式
                  </h3>
                </div>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-700"><CreditCard className="h-3.5 w-3.5" /></div>
                  <p className="text-xs font-black text-slate-700">
                    信用卡付款
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.card.map((method) => (
                    <span
                      key={method}
                      className="flex min-h-10 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50/60 px-2 py-2 text-center text-xs font-black text-indigo-900"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="mb-2 text-xs font-black text-slate-700">
                  非信用卡付款
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.other.map((method) => (
                    <span
                      key={method}
                      className="flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-center text-xs font-black text-slate-700"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
              實際可選的付款方式，依綠界付款頁當下顯示為準。
            </p>
          </div>
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
        <MembershipSupportLinks />
      </section>
    </main>
  );
}
