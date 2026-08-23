import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  BarChart4,
  BookOpenText,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Compass,
  Crown,
  ExternalLink,
  FileSearch,
  FileText,
  History,
  Heart,
  Info,
  Instagram,
  LifeBuoy,
  Lightbulb,
  Link as LinkIcon,
  ListOrdered,
  Map,
  MapPinned,
  Medal,
  Megaphone,
  MessageCircleQuestion,
  Milestone,
  MousePointerClick,
  Network,
  Scale,
  School,
  Search,
  SearchCheck,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  UserCircle,
  X
} from 'lucide-react';
import { withBasePath } from '../../lib/routes';

/** Official Threads brand mark (lucide does not ship brand icons). */
function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
    </svg>
  );
}

export type MenuAction =
  | { type: 'route'; href: string }
  | { type: 'modal'; id: string }
  | { type: 'external'; href: string };

export interface MenuItem {
  id: string;
  label: string;
  description: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  action: MenuAction;
}

export interface MenuCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  accent: string;
  items: MenuItem[];
}

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveModal: (modal: any) => void;
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'find',
    label: '我要查資料',
    description: '找學校、科別、群科與學校類型',
    icon: Compass,
    color: 'text-sky-600',
    bg: 'bg-sky-100',
    accent: 'border-sky-500',
    items: [
      { id: 'search', label: '搜尋學校與科別', description: '用校名、科別、群別快速查資料', keywords: '搜尋 學校 科別 群別 縣市 代碼', icon: FileSearch, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/search' } },
      { id: 'schoolTypes', label: '學校類型解析', description: '普通科、技高、綜高、五專差在哪', keywords: '學校 類型 普高 技高 綜高 五專 高中 高職', icon: Building2, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/school-types' } },
      { id: 'generalComprehensive', label: '普通科與綜合高中，怎麼選？', description: '比較普通科與綜高學程，找到適合的探索方向', keywords: '普通科 綜合高中 綜高 學程 高中 選擇', icon: School, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/general-comprehensive-high-school' } },
      { id: 'grade11Pathways', label: '高二班群怎麼選？', description: '了解自然、社會取向與 18 學群的規劃方式', keywords: '高二 班群 自然組 社會組 數學 A B 18 學群', icon: Milestone, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/grade-11-pathways' } },
      { id: 'vocational', label: '技職群科百科', description: '看 15 大職群、常見科別與未來進路', keywords: '技職 群科 百科 職群 科別 職涯 高職', icon: Briefcase, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/vocational-encyclopedia' } },
    ],
  },
  {
    id: 'choose',
    label: '我要選志願',
    description: '落點分析、志願排序與錄取資料',
    icon: Target,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    accent: 'border-amber-500',
    items: [
      { id: 'home', label: '落點分析', description: '輸入成績與條件，產生推薦清單', keywords: '首頁 落點 分析 會考 分數', icon: Calculator, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/' } },
      { id: 'mockVolunteer', label: '模擬志願序', description: '把校科加入清單，練習排序', keywords: '志願序 模擬 排序 選填', icon: ListOrdered, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/mock-volunteer' } },
      { id: 'strategy', label: '志願選填攻略', description: '看夢幻、落點、安全區如何搭配', keywords: '志願 選填 策略 建議 攻略', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/strategy' } },
      { id: 'historicalStats', label: '歷年錄取統計', description: '參考各校歷年分數與趨勢', keywords: '歷年 錄取 分數 統計', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/historical-stats' } },
      { id: 'gradeLevel', label: '積分換算說明', description: '查會考等級如何換成積分、積點', keywords: '積分 換算 等級 A B C', icon: Scale, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/grade-level' } },
      { id: 'scoringTaipei', label: '基北區計分規則', description: '基隆、臺北、新北的超額比序與會考換算', keywords: '基北 基隆 台北 臺北 新北 計分 規則 超額比序', icon: MapPinned, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/scoring-rules/taipei' } },
      { id: 'scoringTaoyuan', label: '桃連區計分規則', description: '桃園、連江的超額比序與會考換算', keywords: '桃連 桃園 連江 計分 規則 超額比序', icon: MapPinned, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/scoring-rules/taoyuan' } },
      { id: 'scoringCentral', label: '中投區計分規則', description: '臺中、南投的超額比序與會考換算', keywords: '中投 台中 臺中 南投 計分 規則 超額比序', icon: MapPinned, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/scoring-rules/central' } },
      { id: 'scoringChanghua', label: '彰化區計分規則', description: '彰化的超額比序與會考換算', keywords: '彰化 計分 規則 超額比序', icon: MapPinned, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/scoring-rules/changhua' } },
      { id: 'scoringChiayi', label: '嘉義區計分規則', description: '嘉義市、嘉義縣的超額比序與會考換算', keywords: '嘉義 嘉義市 嘉義縣 計分 規則 超額比序', icon: MapPinned, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/scoring-rules/chiayi' } },
      { id: 'scoringTainan', label: '臺南區計分規則', description: '臺南的超額比序與會考換算', keywords: '台南 臺南 計分 規則 超額比序', icon: MapPinned, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/scoring-rules/tainan' } },
      { id: 'scoringKaohsiung', label: '高雄區計分規則', description: '高雄的超額比序與會考換算', keywords: '高雄 計分 規則 超額比序', icon: MapPinned, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/scoring-rules/kaohsiung' } },
      { id: 'scoringHsinchu', label: '竹苗區計分規則', description: '新竹、苗栗的超額比序與會考換算', keywords: '竹苗 新竹 苗栗 計分 規則 超額比序', icon: MapPinned, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/scoring-rules/hsinchu' } },
      { id: 'fiveYearCollegeRules', label: '五專優先免試計分規則', description: '查看五專積分項目與同分比序參考', keywords: '五專 優先免試 聯合免試 積分 志願序 比序', icon: Medal, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/five-year-college-rules' } },
    ],
  },
  {
    id: 'plan',
    label: '我要規劃升學',
    description: '興趣探索、時程與官方相關資源',
    icon: Map,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    accent: 'border-indigo-500',
    items: [
      { id: 'holland', label: 'Holland 興趣測驗', description: '先了解自己的興趣類型與適合群科', keywords: 'holland 興趣 測驗 性向 群科', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/holland' } },
      { id: 'importantDates', label: '重要日程', description: '查看報名、選填、放榜等時間', keywords: '日期 日程 簡章 報名 放榜', icon: Map,
    color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/important-dates' } },
      { id: 'news', label: '最新消息', description: '查看資料更新與系統公告', keywords: '最新 消息 公告 116 資料 更新', icon: Megaphone, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/news' } },
      { id: 'scoreInquiry', label: '會考成績查詢', description: '前往成績查詢與相關官方資訊', keywords: '會考 成績 查詢 官方', icon: SearchCheck, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'modal', id: 'scoreInquiry' } },
    ],
  },
  {
    id: 'membership',
    label: '會員服務',
    description: '免廣告方案、LINE 資格與會員帳號',
    icon: Crown,
    color: 'text-violet-600',
    bg: 'bg-violet-100',
    accent: 'border-violet-500',
    items: [
      { id: 'membership', label: '會員免廣告', description: '查看方案並用 LINE 安全確認資格', keywords: '會員 免廣告 LINE 付款 月費 年費 方案', icon: Crown, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'route', href: '/membership' } },
      { id: 'membershipAccount', label: '我的會員帳號', description: '查看方案、到期日與登入狀態', keywords: '會員 帳號 到期 日 LINE 登入 資格', icon: UserCircle, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'route', href: '/membership/account' } },
    ],
  },
  {
    id: 'external',
    label: '外部連結',
    description: '前往相關平台與延伸升學資源',
    icon: LinkIcon,
    color: 'text-violet-600',
    bg: 'bg-violet-100',
    accent: 'border-violet-500',
    items: [
      { id: 'officialVolunteer', label: '志願選填平台', description: '開啟外部志願選填平台', keywords: '志願 選填 外部 平台 官方', icon: MousePointerClick, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'external', href: 'https://tyctw.github.io/volunteer/' } },
      { id: 'shared', label: '錄取分享', description: '開啟全國錄取結果分享平台', keywords: '共同 就學區 資料 外部 錄取 分享', icon: Share2, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'external', href: 'https://tyctw.github.io/shared/' } },
      { id: 'score', label: '序位分享', description: '開啟會考積分與序位分享平台', keywords: '會考 積分 積點 外部 序位 分享', icon: BarChart4, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'external', href: 'https://tyctw.github.io/score/' } },
    ],
  },
  {
    id: 'support',
    label: '使用協助',
    description: '操作說明、常見問題與意見回饋',
    icon: LifeBuoy,
    color: 'text-rose-600',
    bg: 'bg-rose-100',
    accent: 'border-rose-500',
    items: [
      { id: 'instructions', label: '使用說明', description: '第一次使用可從這裡看操作流程', keywords: '使用 說明 教學 操作', icon: BookOpenText, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'route', href: '/instructions' } },
      { id: 'faqGlossary', label: '常見問答', description: '快速看懂會考、比序與志願選填名詞', keywords: '常見問答 faq 名詞 百科 超額比序 序位 五專 技高', icon: MessageCircleQuestion, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'route', href: '/faq-glossary' } },
      { id: 'site-map', label: '網站地圖', description: '一次查看全部功能頁面', keywords: '網站 地圖 sitemap 頁面', icon: Network, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'route', href: '/site-map' } },
      { id: 'support', label: '小額支持', description: '支持我們持續維護免費升學工具', keywords: '支持 贊助 小額 捐款 金流', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'route', href: '/support' } },
      { id: 'rating', label: '評分與回饋', description: '留下使用感受或建議', keywords: '評分 回饋 意見', icon: Star, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'modal', id: 'rating' } },
      { id: 'reportError', label: '問題回報', description: '資料錯誤或系統問題從這裡回報', keywords: '錯誤 問題 回報 bug', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'route', href: '/report-error' } },
    ],
  },
  {
    id: 'about',
    label: '關於平台',
    description: '平台資訊、更新紀錄與使用規範',
    icon: Info,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    accent: 'border-emerald-500',
    items: [
      { id: 'advantages', label: '平台特色', description: '了解這個工具提供哪些輔助功能', keywords: '特色 優勢 功能 平台', icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/advantages' } },
      { id: 'changelog', label: '更新紀錄', description: '查看最近調整與版本變更', keywords: '更新 紀錄 changelog 版本', icon: History, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/changelog' } },
      { id: 'disclaimer', label: '免責聲明', description: '了解分析結果的使用限制', keywords: '提醒 免責 聲明 注意', icon: ShieldAlert, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/disclaimer' } },
      { id: 'privacy', label: '隱私權政策', description: '查看資料使用與隱私說明', keywords: '隱私 個資 政策 privacy', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/privacy' } },
      { id: 'terms', label: '服務條款', description: '查看平台使用規範', keywords: '條款 服務 規範 terms', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/terms' } },
    ],
  },
];

const isCompactNavigationViewport = () => typeof window !== 'undefined' && (
  window.innerWidth < 1024 || window.matchMedia('(hover: none), (pointer: coarse)').matches
);

export default function NavigationDrawer({ isOpen, onClose, setActiveModal }: NavigationDrawerProps) {
  const [expandedCategory, setExpandedCategory] = useState('choose');
  const [mobileCategory, setMobileCategory] = useState<MenuCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompactNavigation, setIsCompactNavigation] = useState(isCompactNavigationViewport);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuScrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const hasHistoryEntryRef = useRef(false);
  const isMobileCategoryOpenRef = useRef(false);

  // On touch devices, make the browser back gesture dismiss the drawer before
  // it leaves the current page. Closing by a UI control removes that temporary
  // history entry as well, so it does not consume an extra back press later.
  const closeDrawer = () => {
    if (hasHistoryEntryRef.current) {
      window.history.go(isMobileCategoryOpenRef.current ? -2 : -1);
      return;
    }
    onClose();
  };

  const openMobileCategory = (category: MenuCategory) => {
    setMobileCategory(category);
    isMobileCategoryOpenRef.current = true;
    window.history.pushState(
      { ...(window.history.state ?? {}), navigationDrawerOpen: true, navigationDrawerLevel: 'category' },
      '',
      window.location.href,
    );
  };

  const scrollMenuToTop = () => {
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollTop = 0;
    }
  };

  const returnToMainMenu = () => {
    scrollMenuToTop();
    if (isMobileCategoryOpenRef.current) {
      window.history.back();
      return;
    }
    setMobileCategory(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !isCompactNavigationViewport()) return;

    window.history.pushState(
      { ...(window.history.state ?? {}), navigationDrawerOpen: true, navigationDrawerLevel: 'root' },
      '',
      window.location.href,
    );
    hasHistoryEntryRef.current = true;

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { navigationDrawerOpen?: boolean; navigationDrawerLevel?: string } | null;
      if (state?.navigationDrawerOpen && state.navigationDrawerLevel === 'root') {
        isMobileCategoryOpenRef.current = false;
        setMobileCategory(null);
        requestAnimationFrame(scrollMenuToTop);
        return;
      }

      hasHistoryEntryRef.current = false;
      isMobileCategoryOpenRef.current = false;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  // The drawer is mounted only while it is open. Register this listener once
  // so rerenders do not replace the temporary history entry.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isOpen) setMobileCategory(null);
  }, [isOpen]);

  useEffect(() => {
    const updateNavigationMode = () => setIsCompactNavigation(isCompactNavigationViewport());
    updateNavigationMode();
    window.addEventListener('resize', updateNavigationMode);
    return () => window.removeEventListener('resize', updateNavigationMode);
  }, []);

  useEffect(() => {
    if (isOpen && !isCompactNavigation) closeDrawer();
  }, [isCompactNavigation, isOpen]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return menuCategories;

    return menuCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          `${category.label} ${item.label} ${item.keywords}`.toLowerCase().includes(normalizedSearch),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [normalizedSearch]);

  const runAction = (action: MenuAction) => {
    if (action.type === 'route') {
      window.location.href = withBasePath(action.href);
      return;
    }

    if (action.type === 'external') {
      window.open(action.href, '_blank', 'noreferrer');
      return;
    }

    setActiveModal(action.id);
    closeDrawer();
  };

  const handleDrawerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !drawerRef.current) return;

    const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])')) as HTMLElement[];
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // 桌機只使用頁首懸浮導覽；漢堡選單不在桌機渲染，避免兩套選單重疊。
  if (!isCompactNavigation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            onClick={closeDrawer}
            aria-hidden="true"
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            id="main-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="main-navigation-title"
            aria-describedby="main-navigation-description"
            ref={drawerRef}
            onKeyDown={handleDrawerKeyDown}
            className={isCompactNavigation
              ? 'fixed inset-0 z-[110] flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-900'
              : `fixed left-1/2 top-3 z-[110] flex max-h-[calc(100vh-1.5rem)] ${mobileCategory ? 'w-[min(94vw,760px)]' : 'w-[min(94vw,960px)]'} -translate-x-1/2 flex-col overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-slate-50 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:top-5 sm:max-h-[calc(100vh-2.5rem)]`}
          >
            <div className={isCompactNavigation ? 'flex shrink-0 items-center gap-3 bg-slate-900 px-3 py-4' : 'flex shrink-0 justify-end px-4 pt-4 pb-0'}>
              <h2 id="main-navigation-title" className="sr-only">主選單</h2>
              {isCompactNavigation && (
                <div className="flex min-w-0 flex-1 items-center justify-between rounded-[1.8rem] bg-white px-5 py-3 text-slate-900">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-600 text-sm font-black text-white">會</span>
                    <span className="truncate text-base font-black">會考落點分析</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new Event('open-site-search'));
                      closeDrawer();
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:bg-slate-100"
                    aria-label="搜尋全站功能"
                  >
                    <Search className="h-6 w-6" />
                  </button>
                </div>
              )}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                className={isCompactNavigation
                  ? 'flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.6rem] border-2 border-blue-700 bg-blue-600 text-white transition hover:bg-blue-500 active:scale-95'
                  : 'flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-slate-900 transition hover:bg-slate-100 active:scale-95'}
                aria-label="關閉主選單"
              >
                <X className={isCompactNavigation ? 'h-8 w-8' : 'h-6 w-6'} />
              </button>
              <p id="main-navigation-description" className="sr-only">可使用搜尋、分類與常用捷徑找到網站功能；按 Escape 可關閉選單。</p>
            </div>

            <div ref={menuScrollRef} className={isCompactNavigation
              ? 'custom-scrollbar flex-1 space-y-3 overflow-y-auto rounded-t-[2rem] bg-white p-4'
              : 'custom-scrollbar flex-1 space-y-4 overflow-y-auto p-6'}>
              {mobileCategory ? (
                <section>
                  <div className="sticky top-[-1rem] z-10 -mx-4 -mt-4 mb-5 flex items-center gap-3 rounded-t-[2rem] bg-white px-5 py-3 shadow-[0_3px_8px_rgba(15,23,42,0.06)]">
                    <button type="button" onClick={returnToMainMenu} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-slate-900 transition hover:bg-slate-300" aria-label="返回主選單">
                      <ChevronRight className="h-6 w-6 rotate-180" />
                    </button>
                    <div>
                      <p className="text-xs font-black text-slate-500">{mobileCategory.description}</p>
                      <h3 className="text-2xl font-black text-slate-900">{mobileCategory.label}</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {mobileCategory.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button key={item.id} type="button" onClick={() => runAction(item.action)} className="group flex w-full items-stretch justify-between overflow-hidden rounded-[1.8rem] bg-slate-100 text-left outline-none transition-colors hover:bg-slate-200">
                          <div className="flex min-w-0 items-center">
                            <div className={`flex w-16 shrink-0 items-center justify-center self-stretch transition-colors group-hover:brightness-95 ${item.bg} ${item.color}`}>
                              <ItemIcon className="h-6 w-6" />
                            </div>
                            <span className="min-w-0 py-4 pl-4 pr-3">
                               <span className="block text-lg font-black text-slate-900">{item.label}</span>
                               <span className="mt-1 block text-sm font-bold leading-snug text-slate-600">{item.description}</span>
                            </span>
                          </div>
                          <div className="flex items-center pr-4">
                             <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:translate-x-1" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : filteredCategories.length === 0 ? (
                <div className="rounded-2xl border-4 border-dashed border-slate-300 bg-white p-8 text-center">
                  <Search className="mx-auto h-10 w-10 text-slate-300" />
                  <div className="mt-3 text-lg font-black text-slate-900">找不到符合的功能</div>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="mt-4 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-700"
                  >
                    清除搜尋
                  </button>
                </div>
              ) : (
                filteredCategories.map((category) => {
                  const isMobileViewport = isCompactNavigation;
                  const isExpanded = Boolean(normalizedSearch) || (!isMobileViewport && expandedCategory === category.id);
                  const CategoryIcon = category.icon;

                  return (
                    <div
                      key={category.id}
                      className={isMobileViewport
                        ? 'overflow-hidden rounded-[1.8rem] border-0 bg-slate-100 shadow-none'
                        : `overflow-hidden rounded-2xl border-4 border-slate-900 ${category.bg} shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (isCompactNavigation) {
                            openMobileCategory(category);
                            return;
                          }
                          setExpandedCategory((current) => (current === category.id ? '' : category.id));
                        }}
                        aria-expanded={isExpanded}
                        aria-controls={`nav-category-${category.id}`}
                        className={isMobileViewport
                          ? 'group flex min-h-[104px] w-full items-stretch justify-between overflow-hidden rounded-[1.8rem] bg-slate-100 text-left outline-none transition-colors hover:bg-slate-200'
                          : `flex min-h-0 w-full items-center justify-between border-l-8 p-4 ${category.bg} ${category.accent} outline-none transition-colors hover:bg-opacity-80`}
                      >
                        <div className={`flex min-w-0 items-center ${isMobileViewport ? 'flex-1 py-4 pl-7 pr-3' : 'gap-3'}`}>
                          <div className={`${isMobileViewport ? 'hidden' : 'flex'} h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]`}>
                            <CategoryIcon className={`h-5 w-5 ${category.color}`} />
                          </div>
                          <span className="min-w-0 text-left">
                            <span className={`block font-black text-slate-900 ${isMobileViewport ? 'text-xl' : 'truncate text-lg'}`}>{category.label}</span>
                            <span className={`mt-1 block font-bold text-slate-500 ${isMobileViewport ? 'line-clamp-1 text-sm' : 'truncate text-xs'}`}>{category.description}</span>
                          </span>
                        </div>
                        <div className={`${isMobileViewport ? 'hidden' : 'flex'} shrink-0 items-center gap-2`}>
                          <span className="rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-[11px] font-black text-slate-500">{category.items.length}</span>
                          <ChevronDown className={`h-5 w-5 text-slate-900 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        <div className={`${isMobileViewport ? 'flex' : 'hidden'} w-24 shrink-0 items-center justify-center transition-colors group-hover:brightness-95 ${category.bg} ${category.color}`}>
                          <CategoryIcon className="h-10 w-10 transition-transform group-hover:scale-110" />
                        </div>
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            id={`nav-category-${category.id}`}
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t-4 border-slate-900 bg-white/70"
                          >
                            <div className="flex flex-col gap-2 p-3">
                              {category.items.map((item) => {
                                const ItemIcon = item.icon;
                                const isExternal = item.action.type === 'external';

                                return (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => runAction(item.action)}
                                    aria-label={isExternal ? `${item.label}，新分頁開啟` : item.label}
                                    className="group flex w-full items-stretch justify-between overflow-hidden rounded-xl border-2 border-transparent text-left outline-none transition-all hover:border-slate-900 hover:bg-slate-50 active:scale-[0.98]"
                                  >
                                    <div className="flex min-w-0 items-center">
                                      <div className={`flex w-14 shrink-0 items-center justify-center self-stretch transition-colors group-hover:brightness-95 ${item.bg} ${item.color}`}>
                                        <ItemIcon className="h-5 w-5" />
                                      </div>
                                      <span className="min-w-0 py-3.5 pl-3 pr-2">
                                        <span className="block break-words font-black leading-tight text-slate-900">{item.label}</span>
                                        <span className="mt-0.5 block text-[13px] font-bold leading-snug text-slate-500">{item.description}</span>
                                      </span>
                                    </div>
                                    <div className="flex items-center pr-3">
                                      {isExternal ? (
                                        <ArrowRight className="h-4 w-4 shrink-0 -rotate-45 text-slate-400 transition-transform group-hover:rotate-0 group-hover:text-slate-900" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-slate-900" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}

              <div className="grid grid-cols-2 gap-3">
                <a href="https://www.instagram.com/exam.tw/" target="_blank" rel="noreferrer" className="group flex items-stretch overflow-hidden rounded-[1.8rem] bg-slate-100 outline-none transition hover:bg-slate-200">
                  <div className="flex w-14 shrink-0 items-center justify-center bg-pink-100 text-pink-600 transition-colors group-hover:brightness-95">
                    <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 items-center justify-center py-3.5 pr-3">
                    <span className="text-[15px] font-black text-slate-700">Instagram</span>
                  </div>
                </a>
                <a href="https://www.threads.com/@exam.tw" target="_blank" rel="noreferrer" className="group flex items-stretch overflow-hidden rounded-[1.8rem] bg-slate-100 outline-none transition hover:bg-slate-200">
                  <div className="flex w-14 shrink-0 items-center justify-center bg-slate-200 text-slate-700 transition-colors group-hover:brightness-95">
                    <ThreadsIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 items-center justify-center py-3.5 pr-3">
                    <span className="text-[15px] font-black text-slate-700">Threads</span>
                  </div>
                </a>
              </div>

            </div>

            <div className="shrink-0 border-t-2 border-slate-900 bg-slate-900 p-1.5"><a href={withBasePath('/support')} className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-slate-900 bg-rose-400 px-4 py-1.5 text-xs font-black text-slate-900 shadow-[2px_2px_0_#fbbf24] transition hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[3px_3px_0_#fbbf24] active:translate-y-0 active:shadow-none"><Heart className="h-3.5 w-3.5 fill-current" />前往小額支持<ArrowRight className="h-3.5 w-3.5" /></a></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
