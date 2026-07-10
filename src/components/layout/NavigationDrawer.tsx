import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Building2,
  ChartBar,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Database,
  History,
  Info,
  Instagram,
  Link as LinkIcon,
  List,
  Map,
  Menu,
  Search,
  Shield,
  Sparkles,
  Star,
  Target,
  X,
  AtSign,
} from 'lucide-react';
import { withBasePath } from '../../lib/routes';

type MenuAction =
  | { type: 'route'; href: string }
  | { type: 'modal'; id: string }
  | { type: 'external'; href: string };

interface MenuItem {
  id: string;
  label: string;
  keywords: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  action: MenuAction;
}

interface MenuCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  items: MenuItem[];
}

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveModal: (modal: any) => void;
}

const menuCategories: MenuCategory[] = [
  {
    id: 'common',
    label: '常用功能',
    icon: Compass,
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    items: [
      { id: 'search', label: '搜尋學校與科別', keywords: '搜尋 學校 科別 群別 縣市 代碼', icon: Search, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/search' } },
      { id: 'mockVolunteer', label: '模擬志願序', keywords: '志願序 模擬 排序 選填', icon: Target, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/mock-volunteer' } },
      { id: 'holland', label: 'Holland 興趣測驗', keywords: 'holland 興趣 測驗 性向 群科', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-100', action: { type: 'route', href: '/holland' } },
      { id: 'vocational', label: '技職群科百科', keywords: '技職 群科 百科 職群 科別 職涯', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/vocational-encyclopedia' } },
      { id: 'schoolTypes', label: '學校類型介紹', keywords: '學校 類型 普高 技高 綜高 五專', icon: Building2, color: 'text-sky-600', bg: 'bg-sky-100', action: { type: 'route', href: '/school-types' } },
    ],
  },
  {
    id: 'admission',
    label: '升學策略',
    icon: Target,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    items: [
      { id: 'home', label: '回到落點分析', keywords: '首頁 落點 分析 會考 分數', icon: ChartBar, color: 'text-orange-600', bg: 'bg-orange-100', action: { type: 'route', href: '/' } },
      { id: 'scoreInquiry', label: '會考成績查詢', keywords: '會考 成績 查詢 官方', icon: Search, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100', action: { type: 'modal', id: 'scoreInquiry' } },
      { id: 'gradeLevel', label: '積分換算說明', keywords: '積分 換算 等級 A B C', icon: Award, color: 'text-rose-600', bg: 'bg-rose-100', action: { type: 'route', href: '/grade-level' } },
      { id: 'historicalStats', label: '歷年錄取統計', keywords: '歷年 錄取 分數 統計', icon: ChartBar, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/historical-stats' } },
      { id: 'importantDates', label: '重要日程', keywords: '日期 日程 簡章 報名 放榜', icon: Map, color: 'text-purple-600', bg: 'bg-purple-100', action: { type: 'route', href: '/important-dates' } },
      { id: 'strategy', label: '志願選填策略', keywords: '志願 選填 策略 建議', icon: Target, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'modal', id: 'strategy' } },
      { id: 'disclaimer', label: '使用提醒與免責聲明', keywords: '提醒 免責 聲明 注意', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-100', action: { type: 'modal', id: 'disclaimer' } },
    ],
  },
  {
    id: 'guide',
    label: '系統導覽',
    icon: Sparkles,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    items: [
      { id: 'instructions', label: '使用說明', keywords: '使用 說明 教學 操作', icon: Info, color: 'text-blue-600', bg: 'bg-blue-100', action: { type: 'route', href: '/instructions' } },
      { id: 'advantages', label: '平台特色', keywords: '特色 優勢 功能 平台', icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'route', href: '/advantages' } },
      { id: 'site-map', label: '網站地圖', keywords: '網站 地圖 sitemap 頁面', icon: Map, color: 'text-amber-600', bg: 'bg-amber-100', action: { type: 'route', href: '/site-map' } },
      { id: 'rating', label: '評分與回饋', keywords: '評分 回饋 意見', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100', action: { type: 'modal', id: 'rating' } },
      { id: 'changelog', label: '更新紀錄', keywords: '更新 紀錄 changelog 版本', icon: History, color: 'text-slate-500', bg: 'bg-slate-100', action: { type: 'route', href: '/changelog' } },
      { id: 'privacy', label: '隱私權政策', keywords: '隱私 個資 政策 privacy', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'route', href: '/privacy' } },
      { id: 'terms', label: '服務條款', keywords: '條款 服務 規範 terms', icon: Shield, color: 'text-slate-600', bg: 'bg-slate-100', action: { type: 'route', href: '/terms' } },
      { id: 'reportError', label: '問題回報', keywords: '錯誤 問題 回報 bug', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100', action: { type: 'modal', id: 'reportError' } },
    ],
  },
  {
    id: 'external',
    label: '外部資源',
    icon: LinkIcon,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    items: [
      { id: 'officialVolunteer', label: '志願選填相關平台', keywords: '志願 選填 外部 平台', icon: ChartBar, color: 'text-orange-600', bg: 'bg-orange-100', action: { type: 'external', href: 'https://tyctw.github.io/volunteer/' } },
      { id: 'shared', label: '共同就學區資料', keywords: '共同 就學區 資料 外部', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-100', action: { type: 'external', href: 'https://tyctw.github.io/shared/' } },
      { id: 'score', label: '會考積分資料', keywords: '會考 積分 資料 外部', icon: List, color: 'text-emerald-600', bg: 'bg-emerald-100', action: { type: 'external', href: 'https://tyctw.github.io/score/' } },
    ],
  },
];

export default function NavigationDrawer({ isOpen, onClose, setActiveModal }: NavigationDrawerProps) {
  const [expandedCategory, setExpandedCategory] = useState('common');
  const [searchTerm, setSearchTerm] = useState('');

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
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[110] flex h-full w-[380px] max-w-full flex-col overflow-hidden border-l-4 border-slate-900 bg-slate-50 shadow-[-8px_0px_0px_0px_rgba(15,23,42,0.1)]"
          >
            <div className="shrink-0 border-b-4 border-slate-900 bg-amber-400 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Menu className="h-6 w-6 text-slate-900" />
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">主選單</h2>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border-4 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-slate-100 active:translate-y-1 active:shadow-none"
                  aria-label="關閉主選單"
                >
                  <X className="h-6 w-6 text-slate-900" />
                </button>
              </div>
              <label className="relative mt-4 block">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="搜尋功能、頁面或關鍵字..."
                  className="h-12 w-full rounded-xl border-4 border-slate-900 bg-white pl-11 pr-12 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-sky-50"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border-2 border-slate-900 bg-slate-100 transition hover:bg-white"
                    aria-label="清除搜尋"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
            </div>

            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-6">
              {filteredCategories.length === 0 ? (
                <div className="rounded-2xl border-4 border-dashed border-slate-300 bg-white p-8 text-center">
                  <Search className="mx-auto h-10 w-10 text-slate-300" />
                  <div className="mt-3 text-lg font-black text-slate-900">找不到符合的功能</div>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-700"
                  >
                    清除搜尋
                  </button>
                </div>
              ) : (
                filteredCategories.map((category) => {
                  const isExpanded = Boolean(normalizedSearch) || expandedCategory === category.id;
                  const CategoryIcon = category.icon;

                  return (
                    <div key={category.id} className="overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                      <button
                        onClick={() => setExpandedCategory((current) => (current === category.id ? '' : category.id))}
                        className={`flex w-full items-center justify-between p-4 ${category.bg} outline-none transition-colors hover:bg-opacity-80`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-xl border-2 border-slate-900 bg-white p-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                            <CategoryIcon className={`h-5 w-5 ${category.color}`} />
                          </div>
                          <span className="truncate text-lg font-black text-slate-900">{category.label}</span>
                        </div>
                        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-900 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t-4 border-slate-900 bg-white"
                          >
                            <div className="flex flex-col gap-2 p-3">
                              {category.items.map((item) => {
                                const ItemIcon = item.icon;
                                const isExternal = item.action.type === 'external';

                                return (
                                  <button
                                    key={item.id}
                                    onClick={() => runAction(item.action)}
                                    className="group flex w-full items-center justify-between rounded-xl border-2 border-transparent px-4 py-3.5 text-left transition-all hover:border-slate-900 hover:bg-slate-50 active:scale-95"
                                  >
                                    <div className="flex min-w-0 items-center gap-3">
                                      <div className={`rounded-lg border-2 border-slate-900 p-1.5 ${item.bg}`}>
                                        <ItemIcon className={`h-5 w-5 ${item.color}`} />
                                      </div>
                                      <span className="break-words font-bold text-slate-900">{item.label}</span>
                                    </div>
                                    {isExternal ? (
                                      <ArrowRight className="h-4 w-4 shrink-0 -rotate-45 text-slate-400 transition-transform group-hover:rotate-0 group-hover:text-slate-900" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-slate-900" />
                                    )}
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

              <div className="flex justify-center gap-4 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <a href="https://www.instagram.com/115.rcpet/" target="_blank" rel="noreferrer" className="group flex items-center gap-2 outline-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-pink-50 text-pink-600 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all group-hover:scale-110 group-hover:bg-pink-100 group-hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:scale-95">
                    <Instagram className="h-5 w-5 transition-transform group-hover:rotate-0" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Instagram</span>
                </a>
                <div className="mx-2 h-10 w-0.5 rounded-full bg-slate-200" />
                <a href="https://www.threads.com/@115.rcpet" target="_blank" rel="noreferrer" className="group flex items-center gap-2 outline-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-50 text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all group-hover:scale-110 group-hover:bg-slate-100 group-hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:scale-95">
                    <AtSign className="h-5 w-5 transition-transform group-hover:rotate-0" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Threads</span>
                </a>
              </div>
            </div>

            <div className="border-t-4 border-slate-900 bg-slate-900 p-4 text-center">
              <p className="flex items-center justify-center gap-1 text-xs font-bold text-slate-400">
                <Check className="h-3 w-3 text-emerald-400" />
                主選單已支援搜尋與快速導覽
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
