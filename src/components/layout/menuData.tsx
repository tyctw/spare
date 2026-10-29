import type { ComponentType } from 'react';
import {
  AlertCircle,
  BarChart4,
  BookOpenText,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  CalendarDays,
  Compass,
  Crown,
  FileSearch,
  FileText,
  Heart,
  History,
  Info,
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
  SearchCheck,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  UserCircle,
} from 'lucide-react';

/** Official Threads brand mark (lucide does not ship brand icons). */
export function ThreadsIcon({ className }: { className?: string }) {
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
  icon: ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  action: MenuAction;
}

export interface MenuCategory {
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  accent: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'choose',
    label: '成績與志願',
    description: '查成績、看落點、規劃志願序',
    icon: Target,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
    accent: 'border-amber-500',
    items: [
      { id: 'scoreInquiry', label: '會考成績查詢', description: '了解官方成績查詢入口與後續步驟', keywords: '會考 成績 查詢 官方 落點', icon: SearchCheck, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/score-inquiry' } },
      { id: 'home', label: '落點分析', description: '輸入成績與條件，產生推薦清單', keywords: '首頁 落點 分析 會考 分數', icon: Calculator, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/' } },
      { id: 'scoreRecords', label: '我的成績紀錄', description: '登入後保存模擬考與正式會考成績', keywords: '登入 帳號 成績 紀錄 模擬考 會考 保存', icon: History, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/score-records' } },
      { id: 'historicalStats', label: '歷年會考統計', description: '查看歷年等級組合與成績分布', keywords: '歷年 會考 等級 分布 統計', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/historical-stats' } },
      { id: 'mockVolunteer', label: '模擬志願序', description: '把校科加入清單，練習排序', keywords: '志願序 模擬 排序 選填', icon: ListOrdered, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/mock-volunteer' } },
      { id: 'strategy', label: '志願選填攻略', description: '看夢幻、落點、安全區如何搭配', keywords: '志願 選填 策略 建議 攻略', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/strategy' } },
    ],
  },
  {
    id: 'find',
    label: '學校與科別',
    description: '搜尋學校、比較類型與探索技職群科',
    icon: Compass,
    color: 'text-sky-600',
    bg: 'bg-sky-100',
    accent: 'border-sky-500',
    items: [
      { id: 'search', label: '搜尋學校與科別', description: '用校名、科別、群別快速查資料', keywords: '搜尋 學校 科別 群別 縣市 代碼', icon: FileSearch, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/search' } },
      { id: 'schoolTypes', label: '學校類型解析', description: '普通科、技高、綜高、五專差在哪', keywords: '學校 類型 普高 技高 綜高 五專 高中 高職', icon: Building2, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/school-types' } },
      { id: 'generalComprehensive', label: '普通科與綜合高中，怎麼選？', description: '比較普通科與綜高學程，找到適合的探索方向', keywords: '普通科 綜合高中 綜高 學程 高中 選擇', icon: School, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/general-comprehensive-high-school' } },
      { id: 'vocational', label: '技職群科百科', description: '看 15 大職群、常見科別與未來進路', keywords: '技職 群科 百科 職群 科別 職涯 高職', icon: Briefcase, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/vocational-encyclopedia' } },
      { id: 'departments', label: '科別探索圖鑑', description: '依類別與群別逐一認識 87 個科別', keywords: '科別 科系 高職 技高 機械 設計 餐飲 藝術', icon: BookOpenText, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/departments' } },
      { id: 'vocationalCompare', label: '職群比較', description: '把感興趣的職群放在一起看', keywords: '職群 比較 技職 選擇', icon: Scale, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/vocational-compare' } },
    ],
  },
  {
    id: 'scoring',
    label: '計分與比序',
    description: '各就學區計分、積分換算與五專比序',
    icon: Calculator,
    color: 'text-teal-600',
    bg: 'bg-teal-100',
    accent: 'border-teal-500',
    items: [
      { id: 'gradeLevel', label: '積分換算說明', description: '查會考等級如何換成積分、積點', keywords: '積分 換算 等級 A B C', icon: Scale, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/grade-level' } },
      { id: 'scoringTaipei', label: '基北區計分規則', description: '基隆、臺北、新北的超額比序與會考換算', keywords: '基北 基隆 台北 臺北 新北 計分 規則 超額比序', icon: MapPinned, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/scoring-rules/taipei' } },
      { id: 'scoringTaoyuan', label: '桃連區計分規則', description: '桃園、連江的超額比序與會考換算', keywords: '桃連 桃園 連江 計分 規則 超額比序', icon: MapPinned, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/scoring-rules/taoyuan' } },
      { id: 'scoringCentral', label: '中投區計分規則', description: '臺中、南投的超額比序與會考換算', keywords: '中投 台中 臺中 南投 計分 規則 超額比序', icon: MapPinned, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/scoring-rules/central' } },
      { id: 'scoringChanghua', label: '彰化區計分規則', description: '彰化的超額比序與會考換算', keywords: '彰化 計分 規則 超額比序', icon: MapPinned, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/scoring-rules/changhua' } },
      { id: 'scoringChiayi', label: '嘉義區計分規則', description: '嘉義市、嘉義縣的超額比序與會考換算', keywords: '嘉義 嘉義市 嘉義縣 計分 規則 超額比序', icon: MapPinned, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/scoring-rules/chiayi' } },
      { id: 'scoringTainan', label: '臺南區計分規則', description: '臺南的超額比序與會考換算', keywords: '台南 臺南 計分 規則 超額比序', icon: MapPinned, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/scoring-rules/tainan' } },
      { id: 'scoringKaohsiung', label: '高雄區計分規則', description: '高雄的超額比序與會考換算', keywords: '高雄 計分 規則 超額比序', icon: MapPinned, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/scoring-rules/kaohsiung' } },
      { id: 'scoringHsinchu', label: '竹苗區計分規則', description: '新竹、苗栗的超額比序與會考換算', keywords: '竹苗 新竹 苗栗 計分 規則 超額比序', icon: MapPinned, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/scoring-rules/hsinchu' } },
      { id: 'fiveYearCollegeRules', label: '五專優先免試計分規則', description: '查看五專積分項目與同分比序參考', keywords: '五專 優先免試 聯合免試 積分 志願序 比序', icon: Medal, color: 'text-teal-600', bg: 'bg-teal-100', action: { type: 'route', href: '/five-year-college-rules' } },
    ],
  },
  {
    id: 'plan',
    label: '升學規劃',
    description: '興趣探索、升學路徑與重要時程',
    icon: Map,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    accent: 'border-indigo-500',
    items: [
      { id: 'holland', label: 'Holland 興趣測驗', description: '先了解自己的興趣類型與適合群科', keywords: 'holland 興趣 測驗 性向 群科', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/holland' } },
      { id: 'lifeFeasibility', label: '生活條件比較單', description: '整理通勤、費用與生活需求', keywords: '生活 條件 比較 通勤 費用 選校', icon: Map, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/life-feasibility' } },
      { id: 'grade11Pathways', label: '高二班群怎麼選？', description: '了解自然、社會取向與 18 學群的規劃方式', keywords: '高二 班群 自然組 社會組 數學 A B 18 學群', icon: Milestone, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/grade-11-pathways' } },
      { id: 'futurePathways', label: '高中職三年後的下一步地圖', description: '查看普高、技高、綜高、五專的升學與就業銜接', keywords: '普高 技高 綜高 五專 升學 技優 特殊選才 就業 二技 插班', icon: Network, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/future-pathways' } },
      { id: 'importantDates', label: '重要日程', description: '查看報名、選填、放榜等時間', keywords: '日期 日程 簡章 報名 放榜', icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/important-dates' } },
      { id: 'news', label: '最新消息', description: '查看資料更新與系統公告', keywords: '最新 消息 公告 116 資料 更新', icon: Megaphone, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/news' } },
    ],
  },
  {
    id: 'membership',
    label: '會員與資料',
    description: '免廣告方案、LINE 資格與會員帳號',
    icon: Crown,
    color: 'text-violet-600',
    bg: 'bg-violet-100',
    accent: 'border-violet-500',
    items: [
      { id: 'membership', label: '會員免廣告', description: '查看方案並用 LINE 安全確認資格', keywords: '會員 免廣告 LINE 付款 月費 年費 方案', icon: Crown, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'route', href: '/membership' } },
      { id: 'privacyCenter', label: '個資與分享管理中心', description: '查看分享期限、撤銷連結與管理資料', keywords: '個資 隱私 分享 期限 撤銷 刪除 資料', icon: ShieldCheck, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'route', href: '/privacy-center' } },
      { id: 'membershipAccount', label: '我的會員帳號', description: '查看方案、到期日與登入狀態', keywords: '會員 帳號 到期 日 LINE 登入 資格', icon: UserCircle, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'route', href: '/membership/account' } },
    ],
  },
  {
    id: 'external',
    label: '延伸工具',
    description: '前往相關平台與延伸升學資源',
    icon: LinkIcon,
    color: 'text-violet-600',
    bg: 'bg-violet-100',
    accent: 'border-violet-500',
    items: [
      { id: 'officialLine', label: '加入官方 LINE', description: '加入好友，查看升學資訊與功能入口', keywords: 'line 賴 官方 好友 日程 提醒', icon: MessageCircleQuestion, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'external', href: 'https://line.me/R/ti/p/@166zozmd' } },
      { id: 'officialVolunteer', label: '序位查詢平台', description: '開啟外部序位查詢平台', keywords: '序位 查詢 外部 平台 志願', icon: MousePointerClick, color: 'text-violet-600', bg: 'bg-violet-100', action: { type: 'external', href: 'https://tyctw.github.io/volunteer/' } },
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
      { id: 'rating', label: '評分與回饋', description: '留下使用感受或建議', keywords: '評分 回饋 意見', icon: Star, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'modal', id: 'rating' } },
      { id: 'reportError', label: '問題回報', description: '資料錯誤或系統問題從這裡回報', keywords: '錯誤 問題 回報 bug', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'route', href: '/report-error' } },
    ],
  },
  {
    id: 'about',
    label: '平台資訊',
    description: '平台資訊、更新紀錄與使用規範',
    icon: Info,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    accent: 'border-emerald-500',
    items: [
      { id: 'advantages', label: '平台特色', description: '了解這個工具提供哪些輔助功能', keywords: '特色 優勢 功能 平台', icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/advantages' } },
      { id: 'changelog', label: '更新紀錄', description: '查看最近調整與版本變更', keywords: '更新 紀錄 changelog 版本', icon: History, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/changelog' } },
      { id: 'support', label: '小額支持', description: '支持我們持續維護免費升學工具', keywords: '支持 贊助 小額 捐款 金流', icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/support' } },
      { id: 'disclaimer', label: '免責聲明', description: '了解分析結果的使用限制', keywords: '提醒 免責 聲明 注意', icon: ShieldAlert, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/disclaimer' } },
      { id: 'privacy', label: '隱私權政策', description: '查看資料使用與隱私說明', keywords: '隱私 個資 政策 privacy', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/privacy' } },
      { id: 'terms', label: '服務條款', description: '查看平台使用規範', keywords: '條款 服務 規範 terms', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/terms' } },
    ],
  },
];

