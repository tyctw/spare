import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight, BadgeCheck, CalendarDays, Check, ChevronDown, CreditCard, Crown, EyeOff, HeartHandshake, HelpCircle, KeyRound, LockKeyhole, LogOut, Mail, MessageCircle, Plus, ReceiptText, Sparkles, UserRound, X } from "lucide-react";
import { callBackend } from "../lib/api";
import { startLineLogin } from "../lib/lineLogin";
import {
  clearLineSessionToken,
  consumeLineLoginCodeFromFragment,
  getMembershipStatus,
  type MembershipStatus,
  membershipPlanNames,
} from "../lib/membership";
import { withBasePath } from "../lib/routes";
import './membership-plans-page.css';

const plans = [
  {
    id: "monthly",
    name: "30 天方案",
    price: 49,
    duration: "30 天",
    comparison: "完整權益，先用 30 天體驗",
    tag: "短期體驗",
    audience: "短期選校，輕鬆開始。",
    daily: "平均每天約 NT$1.63",
    value: "30 天享有完整會員權益",
    detail: "適合短期使用，或先體驗會員功能。",
    featured: false,
  },
  {
    id: "quarterly",
    name: "90 天方案",
    price: 129,
    duration: "90 天",
    comparison: "比購買 3 次 30 天方案省 NT$18",
    tag: "選填季推薦",
    audience: "從會考到選填，一次準備。",
    daily: "平均每天約 NT$1.43",
    value: "從會考準備到志願選填",
    detail: "90 天完整權益，一次付款 NT$129。",
    featured: true,
  },
  {
    id: "yearly",
    name: "365 天方案",
    price: 399,
    duration: "365 天",
    comparison: "比購買 12 次 30 天方案省 NT$189",
    tag: "長期規劃更划算",
    audience: "提早探索，慢慢找到方向。",
    daily: "平均每天約 NT$1.09",
    value: "平均每天約 NT$1.1",
    detail: "NT$399 ÷ 365 天換算；一次付款 NT$399。",
    featured: false,
  },
] as const;
type PlanId = (typeof plans)[number]["id"];


const membershipFaqs = [
  {
    q: '30 天、90 天與 365 天方案有什麼差別？',
    a: '30 天方案 NT$49；90 天方案 NT$129；365 天方案 NT$399。三種方案權益相同，差別是使用期間。90 天方案比購買 3 次 30 天方案省 NT$18；365 天方案比購買 12 次 30 天方案省 NT$189。均為一次付款，到期不自動續扣。',
  },
  {
    q: '付款後何時生效？',
    a: '付款完成並收到系統確認後，會員資格即刻生效。以 LINE 帳號登入確認資格後，即可免輸入系統授權碼直接開始落點分析。若付款後資格未正常顯示，請來信客服確認。',
  },
  {
    q: '到期後會自動扣款嗎？',
    a: '不會。三種方案均為一次性付款，期間結束後不會自動續費或扣款，無需手動取消。若要繼續使用，可再選擇方案購買。',
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



function MembershipFeaturePreview({ kind }: { kind: string }) {
  return <div className={`plans-feature-preview plans-feature-preview--${kind}`} aria-hidden="true">
    {kind === 'focus' && <><div className="feature-browser"><span className="feature-browser-dots">•••</span><div className="feature-reading-line feature-reading-line--title" /><div className="feature-reading-line" /><div className="feature-reading-line" /><div className="feature-reading-line feature-reading-line--short" /><div className="feature-reading-tag"><EyeOff size={13} />免廣告閱讀</div></div></>}
    {kind === 'analysis' && <div className="feature-analysis"><div className="feature-grade-row">{['國文', '英文', '數學'].map(subject => <span key={subject}><small>{subject}</small><strong>A</strong></span>)}</div><span className="feature-start">開始落點分析<ArrowRight size={13} /></span><small className="feature-caption">填好成績，直接開始</small></div>}
    {kind === 'scenario' && <div className="feature-scenario"><div className="feature-scenario-title">試試不同成績情境<Sparkles size={13} /></div><div className="feature-scenario-row"><span>原本成績</span><i /><small>比較</small></div><div className="feature-scenario-row feature-scenario-row--next"><span>調整之後</span><i /><small>探索</small></div><span className="feature-caption">多試一分，多了解一點</span></div>}
    {kind === 'collaboration' && <div className="feature-chat"><div className="feature-chat-row"><span className="feature-avatar">我</span><span>這個科別，我想再了解。</span></div><div className="feature-chat-row"><span className="feature-avatar feature-avatar--parent">家</span><span>好，一起看看課程！</span></div><div className="feature-chat-status"><span />一起整理志願中</div></div>}
    {kind === 'history' && <div className="feature-history"><div><span className="feature-history-dot" /><span>第一次整理</span><small>已儲存</small></div><div><span className="feature-history-dot" /><span>與家人討論後</span><small>已儲存</small></div><div className="feature-history-current"><span className="feature-history-dot" /><span>目前確認版本</span><Check size={13} /></div></div>}
    {kind === 'devices' && <div className="feature-devices"><div className="feature-laptop"><span>會員資格</span><BadgeCheck size={25} /><small>已確認</small></div><span className="feature-device-connection">······</span><div className="feature-phone"><BadgeCheck size={22} /><small>已確認</small></div><span className="feature-devices-caption">同一個 LINE 帳號，接著使用。</span></div>}
  </div>;
}

const PLAN_TAP_SLOP = 12;

function stickyTopOffset() {
  let offset = 0;
  document.querySelectorAll<HTMLElement>('.plans-topbar, .app-header-root, header').forEach((node) => {
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility === 'hidden') return;
    if (style.position !== 'sticky' && style.position !== 'fixed') return;
    const top = Number.parseFloat(style.top);
    const pinnedTop = Number.isFinite(top) ? Math.max(0, top) : 0;
    offset = Math.max(offset, pinnedTop + node.offsetHeight);
  });
  return offset + 12;
}

function scrollToMembershipCheckout() {
  const target = document.getElementById('membership-checkout');
  if (!target) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = window.scrollY + target.getBoundingClientRect().top - stickyTopOffset();
  window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'instant' : 'smooth' });
}

function MembershipSupportLinks() {
  return <section className="plans-support" aria-labelledby="membership-support-title">
    <div><p className="plans-section-kicker">需要一點協助？</p><h2 id="membership-support-title">我們在這裡。</h2><p>會員資格或付款有疑問，請附上訂單編號來信。</p><a href="mailto:tyctw.analyze@gmail.com"><Mail size={16} aria-hidden="true" />tyctw.analyze@gmail.com<ArrowRight size={16} aria-hidden="true" /></a></div>
    <nav aria-label="會員服務說明"><a href={withBasePath('/after-sales-service')}><HeartHandshake size={19} aria-hidden="true" />售後服務<ArrowRight size={16} aria-hidden="true" /></a><a href={withBasePath('/refund-cancellation-policy')}><ReceiptText size={19} aria-hidden="true" />退款與取消說明<ArrowRight size={16} aria-hidden="true" /></a></nav>
  </section>;
}

export default function MembershipPage() {
  const [membership, setMembership] = useState<MembershipStatus | null>(null);
  const [selected, setSelected] = useState<PlanId>("monthly");
  const carouselRef = useRef<HTMLFieldSetElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const planPointer = useRef({ x: 0, y: 0, tracking: false, moved: false, scrollLeft: 0 });
  const checkoutScrollFrame = useRef(0);
  const featureCarouselRef = useRef<HTMLDivElement>(null);
  const [featurePage, setFeaturePage] = useState(0);
  const featureStops = (container: HTMLDivElement) => {
    const cards = Array.from(container.querySelectorAll<HTMLElement>('.plans-feature-card'));
    const max = Math.max(0, container.scrollWidth - container.clientWidth);
    return cards.filter((_, index) => index % 2 === 0).map(card => Math.min(max, Math.max(0, card.offsetLeft - cards[0].offsetLeft)));
  };
  const showFeaturePage = (index: number) => {
    const container = featureCarouselRef.current;
    if (!container) return;
    const stops = featureStops(container);
    if (index < 0 || index >= stops.length) return;
    container.scrollTo({ left: stops[index], behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };

  const showPlan = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>('.plans-option'));
    const card = cards[index];
    if (!card) return;
    carousel.scrollTo({
      left: card.offsetLeft - cards[0].offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [toastTop, setToastTop] = useState(76);
  const toastRef = useRef<HTMLDivElement>(null);
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
  const holderName = lineName || "LINE 會員";
  const activePlan = membership?.plan ? plans.find((plan) => plan.id === membership.plan) : undefined;
  const activePlanName = activePlan?.name ?? (membership?.plan ? membershipPlanNames[membership.plan] : "—");
  const daysRemaining = activeDaysLeft !== null && Number.isFinite(activeDaysLeft) ? activeDaysLeft : null;
  const passProgress = (() => {
    if (!membership?.activatedAt || !membership.expiresAt || daysRemaining === null) return null;
    const start = new Date(membership.activatedAt).getTime();
    const end = new Date(membership.expiresAt).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
    const now = Date.now();
    const spanDays = Math.max(1, Math.round((end - start) / 86_400_000));
    const usedDays = Math.min(spanDays, Math.max(0, Math.floor((Math.min(now, end) - start) / 86_400_000)));
    const ratio = Math.min(1, Math.max(0, (now - start) / (end - start)));
    return { usedDays, ratio };
  })();
  const payerReady = Boolean(lineName && payerName.trim() && email.trim() && email.includes("@") && !payerNameError && !emailError);

  useEffect(() => {
    const placeToast = () => {
      const bar = document.querySelector(".plans-topbar");
      if (!(bar instanceof HTMLElement)) return;
      const top = Number.parseFloat(getComputedStyle(bar).top);
      const pinnedTop = Number.isFinite(top) ? Math.max(0, top) : 0;
      setToastTop(pinnedTop + bar.offsetHeight + 12);
    };
    placeToast();
    window.addEventListener("resize", placeToast);
    return () => window.removeEventListener("resize", placeToast);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const node = toastRef.current;
    let remaining = 3000;
    let started = Date.now();
    let paused = false;
    let hovering = false;
    let focused = false;
    let timer = window.setTimeout(() => setNotice(""), remaining);
    const sync = () => {
      const shouldPause = hovering || focused;
      if (shouldPause && !paused) {
        paused = true;
        window.clearTimeout(timer);
        remaining -= Date.now() - started;
      } else if (!shouldPause && paused) {
        paused = false;
        started = Date.now();
        timer = window.setTimeout(() => setNotice(""), Math.max(0, remaining));
      }
    };
    const onEnter = () => { hovering = true; sync(); };
    const onLeave = () => { hovering = false; sync(); };
    const onFocusIn = () => { focused = true; sync(); };
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && node?.contains(next)) return;
      focused = false;
      sync();
    };
    node?.addEventListener("pointerenter", onEnter);
    node?.addEventListener("pointerleave", onLeave);
    node?.addEventListener("focusin", onFocusIn);
    node?.addEventListener("focusout", onFocusOut);
    return () => {
      window.clearTimeout(timer);
      node?.removeEventListener("pointerenter", onEnter);
      node?.removeEventListener("pointerleave", onLeave);
      node?.removeEventListener("focusin", onFocusIn);
      node?.removeEventListener("focusout", onFocusOut);
    };
  }, [notice]);

  const carouselScrolled = () => {
    const carousel = carouselRef.current;
    return Boolean(carousel && Math.abs(carousel.scrollLeft - planPointer.current.scrollLeft) > 4);
  };

  const revealCheckout = () => {
    if (planPointer.current.moved || carouselScrolled()) return;
    cancelAnimationFrame(checkoutScrollFrame.current);
    checkoutScrollFrame.current = requestAnimationFrame(() => {
      if (planPointer.current.moved || carouselScrolled()) return;
      scrollToMembershipCheckout();
    });
  };

  const trackPlanPointer = (event: ReactPointerEvent<HTMLFieldSetElement>) => {
    if (event.type === 'pointerdown') {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      planPointer.current.tracking = true;
      planPointer.current.moved = false;
      planPointer.current.scrollLeft = carouselRef.current?.scrollLeft ?? 0;
      planPointer.current.x = event.clientX;
      planPointer.current.y = event.clientY;
      return;
    }
    if (!planPointer.current.tracking) return;
    if (event.type === 'pointermove') {
      if (event.pointerType === 'mouse' && event.buttons === 0) return;
      const dx = event.clientX - planPointer.current.x;
      const dy = event.clientY - planPointer.current.y;
      if (Math.hypot(dx, dy) > PLAN_TAP_SLOP) planPointer.current.moved = true;
      return;
    }
    planPointer.current.tracking = false;
  };

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
    const carousel = carouselRef.current;
    if (!carousel) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let x = 0, y = 0;
    let axis: 'x' | 'y' | null = null;
    let tracking = false;
    const settle = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { delete carousel.dataset.verticalScroll; }, 180);
    };
    const advance = (delta: number) => {
      const max = carousel.scrollWidth - carousel.clientWidth;
      const position = Math.max(0, Math.min(max, carousel.scrollLeft));
      if (max <= 1 || !delta || (delta > 0 && position >= max - 1) || (delta < 0 && position <= 1)) return false;
      carousel.dataset.verticalScroll = 'true';
      carousel.scrollLeft = Math.max(0, Math.min(max, position + delta));
      return true;
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || !event.cancelable) return;
      const unit = event.deltaMode === 1 ? 20 : event.deltaMode === 2 ? carousel.clientWidth : 1;
      if (advance(event.deltaY * unit)) { planPointer.current.moved = true; event.preventDefault(); settle(); }
    };
    const start = (event: TouchEvent) => {
      tracking = event.touches.length === 1;
      axis = null;
      if (!tracking) return;
      x = event.touches[0].clientX; y = event.touches[0].clientY;
      planPointer.current.x = x;
      planPointer.current.y = y;
      planPointer.current.scrollLeft = carousel.scrollLeft;
      planPointer.current.moved = false;
      planPointer.current.tracking = true;
      clearTimeout(timer);
    };
    const move = (event: TouchEvent) => {
      if (!tracking || event.touches.length !== 1) return;
      const nx = event.touches[0].clientX, ny = event.touches[0].clientY;
      if (Math.hypot(nx - planPointer.current.x, ny - planPointer.current.y) > PLAN_TAP_SLOP) planPointer.current.moved = true;
      if (!event.cancelable) return;
      const dx = x - nx, dy = y - ny;
      if (!axis && Math.max(Math.abs(dx), Math.abs(dy)) < 5) return;
      if (!axis) axis = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x';
      if (axis === 'y' && advance(dy)) event.preventDefault();
      x = nx; y = ny;
    };
    const end = () => { tracking = false; settle(); };
    carousel.addEventListener('wheel', wheel, { passive: false });
    carousel.addEventListener('touchstart', start, { passive: true });
    carousel.addEventListener('touchmove', move, { passive: false });
    carousel.addEventListener('touchend', end);
    carousel.addEventListener('touchcancel', end);
    return () => {
      clearTimeout(timer); delete carousel.dataset.verticalScroll;
      carousel.removeEventListener('wheel', wheel);
      carousel.removeEventListener('touchstart', start);
      carousel.removeEventListener('touchmove', move);
      carousel.removeEventListener('touchend', end);
      carousel.removeEventListener('touchcancel', end);
    };
  }, [isSuccessPage, membership === null, membership?.active]);



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
    { kind: 'focus', title: '免廣告，專心看校科', text: '會員期間關閉廣告，從查資料到比較校科，把注意力留給真正重要的資訊。' },
    { kind: 'analysis', title: '填好成績，就能分析', text: '免輸入分析授權碼，登入確認會員資格後，填妥成績即可開始落點分析。' },
    { kind: 'scenario', title: '多試幾種成績情境', text: '使用一分改變分析，比較成績變動後的校科選項，讓每次探索更有方向。' },
    { kind: 'collaboration', title: '與家人，一起排志願', text: '邀請家長共同新增校科、調整順序與留言，讓討論直接發生在同一份清單。' },
    { kind: 'history', title: '每次調整，都有紀錄', text: '查看志願調整紀錄與確認版本，回顧每次討論，清楚知道清單怎麼變成現在的樣子。' },
    { kind: 'devices', title: '換個裝置，資格還在', text: '會員資格綁定 LINE 帳號。在其他裝置登入同一帳號，即可確認資格並繼續使用。' },
  ];

  const noticeTone = notice.includes("成功") ? "success" : "error";
  return <main id="main-content" className="plans-page" aria-labelledby="membership-title">{notice && <div className="plans-toast-anchor" style={{ top: toastTop }}><div ref={toastRef} className="plans-toast" role="status" aria-live="polite" data-tone={noticeTone}><p>{noticeTone === "error" && <span className="sr-only">需要處理：</span>}{notice}</p><button type="button" onClick={() => setNotice("")} aria-label="關閉通知"><X size={18} aria-hidden="true" /></button></div></div>}<div className="plans-shell">
    <nav className="plans-topbar" aria-label="會員頁導覽"><a className="plans-brand" href={withBasePath('/')}><span>會考</span>落點分析<i aria-hidden="true" /></a><span className="plans-topbar-current">會員方案</span><a className="plans-topbar-account" href={withBasePath('/membership/account')}><UserRound size={16} aria-hidden="true" />會員帳號</a></nav>
    <header className="plans-hero"><div className="plans-hero-copy"><h1 id="membership-title">{isSuccessPage ? '付款確認' : '會員方案'}</h1><p className="plans-lead">選一段適合你的準備時間。</p><div className="plans-payment-mode" aria-label="方案付款方式"><span>一次付款</span><span>到期不續扣</span></div></div></header>
    {membership === null ? <section className="plans-feedback" role="status" aria-busy="true"><Crown size={28} aria-hidden="true" /><h2>正在確認會員資格</h2><p>正在讀取目前帳號的使用狀態，請稍候。</p></section>
    : isSuccessPage && !membership.active ? <section className="plans-feedback" aria-labelledby="payment-confirming-title"><span className="plans-feedback-icon"><CreditCard size={28} aria-hidden="true" /></span><p className="plans-eyebrow">付款狀態</p><h2 id="payment-confirming-title">{paymentWaitingExpired ? '尚未確認會員資格' : '正在確認付款結果'}</h2><p role="status" aria-live="polite">{paymentWaitingExpired ? '目前尚未收到資格啟用結果。如果已完成付款，請重新確認或提供訂單編號聯絡我們。請先確認原訂單狀態，再決定是否重新購買。' : '正在等待付款系統回傳與資格更新，確認後會顯示會員有效期限。'}</p><div className="plans-feedback-actions"><button type="button" className="plans-primary" onClick={() => void refresh().catch(() => setNotice('暫時無法確認資格，請稍後再試。'))}>重新確認資格</button><a className="plans-secondary" href={withBasePath('/membership/account')}>查看帳號與訂單</a></div></section>
    : membership.active ? <section className="plans-pass" aria-labelledby="membership-pass-title">
      <div className="plans-pass-main">
        <div className="plans-pass-topline">
          <p className="plans-pass-kicker">會員通行票</p>
          <span className="plans-active-badge"><BadgeCheck size={17} aria-hidden="true" />會員資格有效</span>
        </div>
        <div className="plans-pass-hero">
          <h2 id="membership-pass-title"><span className="sr-only">目前方案</span>{activePlanName}</h2>
          {daysRemaining !== null && <p className="plans-pass-days"><span>剩餘</span><strong>{daysRemaining} <span className="plans-pass-days-unit">天</span></strong></p>}
        </div>
        {passProgress && daysRemaining !== null && <div className="plans-pass-progress"><div className="plans-pass-progress-track" aria-hidden="true"><span style={{ width: `${Math.round(passProgress.ratio * 100)}%` }} /></div><p>已使用 {passProgress.usedDays} 天 · 剩餘 {daysRemaining} 天</p></div>}
        <div className="plans-pass-holder">
          <span>持有人</span>
          <strong>{holderName}</strong>
        </div>
        <dl className="plans-pass-facts">
          <div><dt>會員有效至</dt><dd>{formatDate(membership.expiresAt)}</dd></div>
          <div><dt>啟用日期</dt><dd>{formatDate(membership.activatedAt || undefined)}</dd></div>
        </dl>
        <p className="plans-pass-renew">一次付款，不自動續扣</p>
        <p className="plans-pass-lead">{holderName}，歡迎回來。會員使用期間不顯示 Google 廣告與 Offerwall。填妥成績後，即可直接開始分析。</p>
        <div className="plans-pass-actions">
          <a className="plans-primary" href={withBasePath('/')}>開始落點分析<ArrowRight size={17} aria-hidden="true" /></a>
          <a className="plans-secondary" href={withBasePath('/mock-volunteer')}>整理模擬志願序</a>
        </div>
      </div>
      <div className="plans-pass-seam" aria-hidden="true">
        <span className="plans-pass-notch plans-pass-notch-start" />
        <span className="plans-pass-perforation" />
        <span className="plans-pass-notch plans-pass-notch-end" />
      </div>
      <div className="plans-active-footer">
        <a href={withBasePath('/membership/account')}>查看帳號與購買紀錄<ArrowRight size={16} aria-hidden="true" /></a>
        <button type="button" onClick={() => void logoutFromLine()}><LogOut size={16} aria-hidden="true" />登出 LINE</button>
      </div>
    </section> : <>
      <form className="plans-purchase" onSubmit={(event) => { event.preventDefault(); if (lineName) void checkout(); }}>
        <section id="membership-plans" className="plans-selection" aria-labelledby="membership-plans-title"><h2 id="membership-plans-title" className="sr-only">選擇會員方案</h2>
          <fieldset ref={carouselRef} className="plans-options" onPointerDown={trackPlanPointer} onPointerMove={trackPlanPointer} onPointerUp={trackPlanPointer} onPointerCancel={trackPlanPointer} onKeyDown={() => { planPointer.current.moved = false; planPointer.current.scrollLeft = carouselRef.current?.scrollLeft ?? 0; }} onScroll={(event) => {
            const carousel = event.currentTarget;
            const cards = Array.from(carousel.querySelectorAll<HTMLElement>('.plans-option'));
            if (!cards.length) return;
            const start = cards[0].offsetLeft;
            const nearest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - start - carousel.scrollLeft) < Math.abs(cards[best].offsetLeft - start - carousel.scrollLeft) ? index : best, 0);
            setCarouselIndex(nearest);
          }}><legend className="sr-only">選擇會員方案</legend>{plans.map(plan => {
            const isSelected = selected === plan.id;
            return <article key={plan.id} className="plans-option" data-selected={isSelected} data-featured={plan.featured} onClick={() => { if (submitting) return; setSelected(plan.id); revealCheckout(); }}>
              {plan.featured && <span className="plans-option-tag">選填季推薦</span>}<input className="plans-radio" id={`plan-${plan.id}`} type="radio" name="membership-plan" value={plan.id} aria-label={plan.name} checked={isSelected} onKeyDown={() => { planPointer.current.moved = false; planPointer.current.scrollLeft = carouselRef.current?.scrollLeft ?? 0; }} onChange={() => { setSelected(plan.id); revealCheckout(); }} disabled={submitting} />
              <h3 className="sr-only">{plan.name}</h3>
              <p className="plans-option-audience">{plan.audience}</p>
              <p className="plans-price"><span>NT$</span>{plan.price}<small>／{plan.duration}</small></p>
              <p className="plans-card-saving">{plan.comparison}</p><p className="plans-price-caption">一次收 NT${plan.price}，效期 {plan.duration}</p><p className="plans-full-access">{plan.daily} · 完整會員權益</p>
              <ul className="plans-option-features"><li>免廣告閱讀校科資訊</li><li>免輸入分析授權碼</li><li>一分改變分析，探索更多可能</li><li>家長共同編輯志願與留言</li><li>志願調整紀錄與版本確認</li><li>LINE 登入，跨裝置確認資格</li></ul>
              <a href="#membership-checkout" onClick={(event) => { if (submitting) { event.preventDefault(); return; } if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); setSelected(plan.id); }} className="plans-card-cta" aria-disabled={submitting || undefined}>{`選擇 ${plan.duration}`}</a>
              <span className="plans-selected-note">{isSelected ? '已選擇' : ''}</span>
            </article>;
          })}</fieldset>
          <nav className="plans-carousel-nav" aria-label="切換會員方案">
            <button type="button" aria-label="上一個方案" onClick={() => showPlan(carouselIndex - 1)} disabled={carouselIndex === 0}><ArrowRight className="plans-carousel-back" size={17} aria-hidden="true" /></button>
            <div>{plans.map((plan, index) => <button type="button" key={plan.id} aria-label={`查看${plan.name}`} aria-current={carouselIndex === index ? 'true' : undefined} onClick={() => showPlan(index)}><span /></button>)}</div>
            <button type="button" aria-label="下一個方案" onClick={() => showPlan(carouselIndex + 1)} disabled={carouselIndex === plans.length - 1}><ArrowRight size={17} aria-hidden="true" /></button>
          </nav>
      <p className="plans-pricing-note">三種方案，完整權益相同。<br />一次付款，到期不自動續扣；續用時再購買。</p>

        </section>
        <section className="plans-benefits plans-feature-gallery" aria-labelledby="membership-benefits-title"><header className="plans-feature-heading"><h2 id="membership-benefits-title">每個方案，都包含。</h2><p>從看成績到排志願，讓升學準備更順手。</p></header><div ref={featureCarouselRef} className="plans-feature-grid" onScroll={event => {
          const container = event.currentTarget;
          const stops = featureStops(container);
          if (stops.length) setFeaturePage(stops.reduce((best, stop, index) => Math.abs(stop - container.scrollLeft) < Math.abs(stops[best] - container.scrollLeft) ? index : best, 0));
        }}>{benefits.map(({kind,title,text}) => <article className="plans-feature-card" key={kind}><MembershipFeaturePreview kind={kind} /><h3>{title}</h3><p>{text}</p></article>)}</div><nav className="plans-carousel-nav plans-feature-nav" aria-label="切換功能介紹"><button type="button" aria-label="上一組功能" onClick={() => showFeaturePage(featurePage - 1)} disabled={featurePage === 0}><ArrowRight className="plans-carousel-back" size={17} aria-hidden="true" /></button><div>{[0, 1, 2].map(index => <button key={index} type="button" aria-label={`第 ${index + 1} 組功能`} aria-current={featurePage === index ? 'true' : undefined} onClick={() => showFeaturePage(index)}><span /></button>)}</div><button type="button" aria-label="下一組功能" onClick={() => showFeaturePage(featurePage + 1)} disabled={featurePage === 2}><ArrowRight size={17} aria-hidden="true" /></button></nav></section>
        <section id="membership-checkout" className="plans-checkout" aria-labelledby="membership-checkout-title">
          <header className="plans-checkout-heading"><p className="plans-section-kicker">開始使用</p><h2 id="membership-checkout-title">選好了，就開始準備。</h2><p className="plans-checkout-intro">登入 LINE，讓會員資格跟著你的帳號。確認訂單後，再前往付款。</p></header>
          <ol className="plans-checkout-steps">
            <li data-complete={lineName ? "true" : "false"}>
              <div className="plans-step-head"><span className="plans-step-index" aria-hidden="true">{lineName ? <Check size={16} /> : "1"}</span><div><p>步驟 1</p><h3>LINE 登入</h3></div>{lineName && <span className="plans-step-done">已完成</span>}</div>
              {lineName ? <div className="plans-login-status"><BadgeCheck size={23} aria-hidden="true" /><div><small>已登入 LINE</small><strong>{lineName}</strong></div><button type="button" onClick={() => void logoutFromLine()} disabled={submitting}>登出</button></div> : <div className="plans-login"><p>用 LINE 登入，讓這份會員資格跟著你。換裝置也能找回。</p><button type="button" onClick={loginWithLine}><picture className="contents"><source srcSet={withBasePath('/brand/line/line-login.webp')} type="image/webp" /><source srcSet={withBasePath('/brand/line/line-login.avif')} type="image/avif" /><img src={withBasePath('/brand/line/line-login.png')} width={40} height={40} alt="" aria-hidden="true" decoding="async" /></picture>使用 LINE 登入<ArrowRight size={17} aria-hidden="true" /></button></div>}
            </li>
            <li data-complete={payerReady ? "true" : "false"}>
              <div className="plans-step-head"><span className="plans-step-index" aria-hidden="true">{payerReady ? <Check size={16} /> : "2"}</span><div><p>步驟 2</p><h3>付款人資料</h3></div>{payerReady && <span className="plans-step-done">已完成</span>}</div>
              {lineName ? <div className="plans-payer"><p>用於訂單核對、付款確認與會員服務聯繫。</p><label htmlFor="membership-payer-name">付款人姓名</label><input id="membership-payer-name" type="text" autoComplete="name" maxLength={80} required value={payerName} onChange={event => {setPayerName(event.target.value);setPayerNameError('');}} placeholder="請輸入真實姓名" disabled={submitting} aria-invalid={Boolean(payerNameError)} aria-describedby={payerNameError ? 'membership-name-error' : undefined} />{payerNameError && <p className="plans-field-error" id="membership-name-error" role="alert">{payerNameError}</p>}<label htmlFor="membership-email">付款人電子信箱</label><input id="membership-email" type="email" inputMode="email" autoComplete="email" required value={email} onChange={event => {setEmail(event.target.value);setEmailError('');}} placeholder="your@email.com" disabled={submitting} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'membership-email-error' : undefined} />{emailError && <p className="plans-field-error" id="membership-email-error" role="alert">{emailError}</p>}</div> : <p className="plans-step-wait">請先使用 LINE 登入，再填寫付款人資料。</p>}
            </li>
            <li>
              <div className="plans-step-head"><span className="plans-step-index" aria-hidden="true">3</span><div><p>步驟 3</p><h3>確認付款</h3></div></div>
              <div className="plans-checkout-summary"><p className="plans-summary-label">你的會員方案</p><dl className="plans-order" aria-live="polite"><div><dt>已選方案</dt><dd>{selectedPlan.name}</dd></div><div><dt>使用期間</dt><dd>{selectedPlan.duration}</dd></div><div><dt>續費方式</dt><dd>不自動續扣</dd></div><div className="plans-order-total"><dt>本次付款</dt><dd><small>NT$</small> {selectedPlan.price}</dd></div></dl>
              <button type="submit" className="plans-pay" disabled={submitting || !lineName}>{submitting ? '正在建立付款單…' : lineName ? `以 NT$${selectedPlan.price} 購買${selectedPlan.duration}方案` : '登入後即可購買'}<ArrowRight size={18} aria-hidden="true" /></button><p className="plans-payment-note"><LockKeyhole size={16} aria-hidden="true" />付款由綠界科技 ECPay 處理。實際可選方式以付款頁面為準。</p></div>
            </li>
          </ol>
        </section>



      </form>
    </>}
    {membership !== null && !(isSuccessPage && !membership.active) && <section className="plans-faq" aria-labelledby="membership-faq-title"><header className="plans-lower-heading"><p className="plans-section-kicker">先了解，再決定</p><h2 id="membership-faq-title">購買與使用常見問題。</h2><p>關於付款、會員資格與使用方式，你可能想知道這些。</p></header><div className="plans-faq-list">{membershipFaqs.map((faq, index) => <details key={faq.q}><summary><span className="plans-faq-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="plans-faq-question">{faq.q}</span><span className="plans-faq-toggle"><Plus size={17} strokeWidth={1.5} aria-hidden="true" /></span></summary><div className="plans-faq-answer"><p>{faq.a}</p>{faq.q === '支援哪些付款方式？' && <ul className="plans-payment-methods">{[...paymentMethods.card,...paymentMethods.other].map(method => <li key={method}>{method}</li>)}</ul>}</div></details>)}</div></section>}

    <MembershipSupportLinks />
  </div></main>;
}
