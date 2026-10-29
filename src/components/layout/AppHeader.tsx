import { memo, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MutableRefObject } from 'react';
import { createPortal } from 'react-dom';
import { Search, Share2, Menu, Compass, Calculator, Target, CalendarDays, CircleHelp, ArrowRight, X, Instagram, Megaphone, Heart } from 'lucide-react';
import { withBasePath } from '../../lib/routes';
import { getScheduleAnnouncement } from '../../lib/scheduleAnnouncement';
import { menuCategories, ThreadsIcon, type MenuCategory, type MenuItem } from './menuData';
import { categoryOverviewPaths, type CategoryOverviewId } from '../../lib/categoryOverview';
import NavigationDrawer from './NavigationDrawer';
import './site-search.css';

type HeaderModalId = 'rating';
type LabeledMenuItem = MenuItem & { categoryLabel: string };
type MenuHoverHandlers = { keep: () => void; scheduleClose: () => void; open: () => void };

interface AppHeaderProps {
  onShareClick: () => void;
  setActiveModal: (modal: HeaderModalId) => void;
}

const categoryById = (id: string) => {
  const category = menuCategories.find((item) => item.id === id);
  if (!category) throw new Error(`Missing menu category: ${id}`);
  return category;
};

const navigationLinks: Array<{
  id: CategoryOverviewId;
  label: string;
  icon: typeof Compass;
  iconColor: string;
  title: string;
  description: string;
  categories: MenuCategory[];
}> = [
  { id: 'choose', label: '成績與志願', icon: Target, iconColor: categoryById('choose').color, title: '成績與志願', description: '查成績、使用落點分析，再安排志願順序', categories: [categoryById('choose')] },
  { id: 'find', label: '學校與科別', icon: Compass, iconColor: categoryById('find').color, title: '學校與科別', description: '搜尋學校、了解學制並比較技職群科', categories: [categoryById('find')] },
  { id: 'scoring', label: '計分與比序', icon: Calculator, iconColor: categoryById('scoring').color, title: '計分與比序', description: '查會考積分換算、各就學區與五專規則', categories: [categoryById('scoring')] },
  { id: 'plan', label: '升學規劃', icon: CalendarDays, iconColor: categoryById('plan').color, title: '升學規劃', description: '探索興趣、比較生活條件並掌握重要時程', categories: [categoryById('plan')] },
  { id: 'member', label: '會員與資源', icon: CircleHelp, iconColor: categoryById('membership').color, title: '會員與延伸資源', description: '管理會員資料，前往延伸工具與平台', categories: [categoryById('membership'), categoryById('external')] },
  { id: 'help', label: '說明與支援', icon: CircleHelp, iconColor: categoryById('support').color, title: '說明與平台資訊', description: '取得操作協助、回報問題與查看平台規範', categories: [categoryById('support'), categoryById('about')] },
];

const labeledItemsByMenu = new Map<CategoryOverviewId, LabeledMenuItem[]>(
  navigationLinks.map((link) => [
    link.id,
    link.categories.flatMap((category) => category.items.map((item) => ({ ...item, categoryLabel: category.label }))),
  ]),
);

const itemById = new Map(menuCategories.flatMap((category) => category.items.map((item) => [item.id, item] as const)));

function shortcutIdsForMonth(month: number) {
  if (month <= 3) return ['home', 'search', 'importantDates', 'instructions'];
  if (month <= 5) return ['importantDates', 'instructions', 'holland', 'schoolTypes'];
  if (month <= 7) return ['scoreInquiry', 'home', 'mockVolunteer', 'strategy'];
  if (month <= 8) return ['importantDates', 'schoolTypes', 'vocational', 'holland'];
  return ['holland', 'vocational', 'schoolTypes', 'search'];
}

const shortcutItems = shortcutIdsForMonth(new Date().getMonth() + 1)
  .map((id) => itemById.get(id))
  .filter((item): item is MenuItem => Boolean(item));

const searchableItems = menuCategories.flatMap((category) => category.items.map((item) => ({
  ...item,
  categoryLabel: category.label,
  searchText: `${category.label} ${item.label} ${item.description} ${item.keywords}`.toLowerCase(),
})));

function runMenuAction(item: MenuItem, setActiveModal: (modal: HeaderModalId) => void) {
  if (item.action.type === 'route') window.location.href = withBasePath(item.action.href);
  else if (item.action.type === 'external') window.open(item.action.href, '_blank', 'noreferrer');
  else setActiveModal(item.action.id as HeaderModalId);
}

function useIsScrolled() {
  // Read the restored scroll position on the first render so the fixed header
  // does not resize just after the page has painted.
  const [isScrolled, setIsScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > 50);
  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 50;
      setIsScrolled((current) => (current === nextIsScrolled ? current : nextIsScrolled));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return isScrolled;
}

function useCompactNavigation() {
  const [isCompactNavigation, setIsCompactNavigation] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  useEffect(() => {
    const updateNavigationMode = () => setIsCompactNavigation(window.innerWidth < 1024);
    updateNavigationMode();
    window.addEventListener('resize', updateNavigationMode);
    return () => window.removeEventListener('resize', updateNavigationMode);
  }, []);
  return isCompactNavigation;
}

const AnnouncementBar = memo(function AnnouncementBar({ isScrolled }: { isScrolled: boolean }) {
  const [announcement, setAnnouncement] = useState(() => getScheduleAnnouncement());
  useEffect(() => {
    const refresh = () => {
      const next = getScheduleAnnouncement();
      setAnnouncement((current) => (current.status === next.status && current.message === next.message ? current : next));
    };
    const interval = window.setInterval(refresh, 30_000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return (
    <div
      aria-hidden={isScrolled}
      className={`app-header-announcement overflow-hidden bg-amber-300 text-slate-900 ${isScrolled ? 'max-h-0 opacity-0' : 'border-b-2 border-slate-900 opacity-100'}`}
    >
      <a
        href={withBasePath('/membership')}
        aria-label={`公告：${announcement.status}，${announcement.message}。查看會員方案：每月 NT$49，免廣告、免授權碼，解鎖完整功能`}
        tabIndex={isScrolled ? -1 : 0}
        className="flex min-h-10 flex-col items-center justify-center px-3 py-1 text-center text-xs font-black transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-inset lg:flex-row lg:gap-3"
      >
        <span className="flex w-full min-w-0 items-center justify-center gap-2 lg:w-auto lg:min-w-0">
          <Megaphone className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="shrink-0 rounded-md bg-white/80 px-2 py-1">{announcement.status}</span><span className="min-w-0 truncate leading-5">{announcement.message}</span>
        </span>
        <span className="flex min-h-6 max-w-full items-center justify-center gap-1 whitespace-normal break-words text-[10px] leading-5 text-purple-950 sm:text-xs lg:shrink-0 lg:border-l lg:border-slate-900/30 lg:pl-3">
          <span>會員 NT$49／月：免廣告、免授權碼，解鎖完整功能</span>
          <ArrowRight className="h-3 w-3 shrink-0" aria-hidden="true" />
        </span>
      </a>
    </div>
  );
});

const DesktopNav = memo(function DesktopNav({
  isCompact,
  setActiveModal,
  menuHoverRef,
}: {
  isCompact: boolean;
  setActiveModal: (modal: HeaderModalId) => void;
  menuHoverRef: MutableRefObject<MenuHoverHandlers>;
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const closeMenuTimer = useRef<number | null>(null);
  const keepMenuOpen = useCallback(() => {
    if (closeMenuTimer.current !== null) {
      window.clearTimeout(closeMenuTimer.current);
      closeMenuTimer.current = null;
    }
  }, []);
  const closeMenuWithDelay = useCallback(() => {
    keepMenuOpen();
    closeMenuTimer.current = window.setTimeout(() => setActiveMenu(null), 220);
  }, [keepMenuOpen]);
  menuHoverRef.current.keep = keepMenuOpen;
  menuHoverRef.current.scheduleClose = closeMenuWithDelay;
  useEffect(() => () => keepMenuOpen(), [keepMenuOpen]);
  useEffect(() => {
    if (isCompact) setActiveMenu(null);
  }, [isCompact]);

  const selectedMenu = navigationLinks.find((menu) => menu.id === activeMenu);
  const selectedItems = selectedMenu ? labeledItemsByMenu.get(selectedMenu.id) ?? [] : [];

  return (
    <>
      <nav aria-label="主要導覽" className={`${isCompact ? 'hidden' : 'flex'} shrink-0 items-center gap-0.5 rounded-2xl border border-slate-200 bg-slate-50 p-1 xl:gap-1`}>
        {navigationLinks.map(({ id, label, icon: Icon, iconColor }) => (
          <button
            type="button"
            key={id}
            onMouseEnter={() => { keepMenuOpen(); setActiveMenu(id); }}
            onFocus={() => { keepMenuOpen(); setActiveMenu(id); }}
            onClick={() => { window.location.href = withBasePath(categoryOverviewPaths[id]); }}
            aria-haspopup="true"
            aria-expanded={activeMenu === id}
            aria-controls="desktop-mega-menu"
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl border-2 px-2 py-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 xl:px-3 ${activeMenu === id ? 'border-indigo-500 bg-indigo-200 text-indigo-950 shadow-[0_2px_0_0_#818cf8] hover:bg-indigo-300 hover:text-indigo-950' : 'border-transparent text-slate-700 hover:bg-indigo-100 hover:text-indigo-800'}`}
          >
            <Icon className={`hidden h-4 w-4 shrink-0 xl:block ${activeMenu === id ? 'text-indigo-800' : iconColor}`} />
            {label}
          </button>
        ))}
      </nav>

      {!isCompact && selectedMenu && (
        <section
          id="desktop-mega-menu"
          onMouseEnter={keepMenuOpen}
          onMouseLeave={closeMenuWithDelay}
          aria-label={`${selectedMenu.title}次選單`}
          className="absolute left-0 right-0 z-20 top-[calc(100%+8px)] hidden overflow-visible rounded-[2rem] border-2 border-indigo-100 bg-white p-5 shadow-[0_18px_40px_-18px_rgba(49,46,129,0.38)] lg:block"
        >
          <div className="grid grid-cols-[2fr_0.9fr] gap-5">
            <div className="order-2 rounded-[2rem] bg-indigo-50/70 p-4">
              <p className="px-2 text-sm font-black text-slate-700">猜你可能在找</p>
              <div className="mt-3 divide-y-4 divide-slate-100 overflow-hidden rounded-[1.7rem] bg-white/75">
                {shortcutItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button key={item.id} type="button" onClick={() => runMenuAction(item, setActiveModal)} className="group flex w-full items-center justify-between bg-transparent px-4 py-4 text-left text-sm font-black text-slate-800 transition hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.color}`}><ItemIcon className="h-4 w-4" /></span>
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-slate-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  );
                })}
                <div className="grid grid-cols-2 divide-x-2 divide-slate-100 bg-slate-50/70">
                  <a href="https://www.instagram.com/exam.tw/" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-2 px-4 py-3 text-xs font-black text-slate-600 transition hover:bg-indigo-100 hover:text-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600" aria-label="前往 Instagram，新分頁開啟"><span className="flex min-w-0 items-center gap-2"><Instagram className="h-4 w-4 shrink-0" />Instagram</span><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-slate-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white"><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span></a>
                  <a href="https://www.threads.com/@exam.tw" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-2 px-4 py-3 text-xs font-black text-slate-600 transition hover:bg-indigo-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600" aria-label="前往 Threads，新分頁開啟"><span className="flex min-w-0 items-center gap-2"><ThreadsIcon className="h-4 w-4 shrink-0" />Threads</span><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-slate-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white"><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span></a>
                </div>
                <a href={withBasePath('/support')} className="group flex items-center justify-between gap-3 bg-indigo-100 px-4 py-4 text-left text-slate-900 transition hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">
                  <span className="flex min-w-0 items-start gap-2.5"><Heart className="mt-0.5 h-5 w-5 shrink-0 fill-rose-500 text-rose-600 transition-transform group-hover:scale-110" aria-hidden="true" /><span className="min-w-0"><span className="block text-sm font-black">小額支持，升學資訊持續免費</span><span className="mt-0.5 block text-[11px] font-bold text-rose-950/70">陪更多學生安心找到方向</span></span></span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-indigo-700 transition-colors group-hover:bg-indigo-600 group-hover:text-white"><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                </a>
              </div>
            </div>
            <div className="order-1">
              <p className="mb-3 px-1 text-sm font-black text-indigo-700">{selectedMenu.label}</p>
              <div className="-m-1 grid max-h-[calc(100vh-12rem)] grid-cols-2 gap-3 overflow-y-auto p-1 pr-2">
                {selectedItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <button key={item.id} type="button" onClick={() => runMenuAction(item, setActiveModal)} className="group relative z-0 flex items-stretch overflow-hidden rounded-[1.35rem] border-2 border-slate-100 bg-slate-50 text-left transition hover:z-10 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-[0_8px_20px_-12px_rgba(79,70,229,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">
                      <span className={`flex w-14 shrink-0 items-center justify-center transition-colors group-hover:brightness-95 ${item.bg} ${item.color}`}>
                        <ItemIcon className="h-6 w-6" />
                      </span>
                      <span className="flex min-w-0 flex-1 items-center gap-3 p-4 pl-3">
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="text-[10px] font-black text-slate-500">{item.categoryLabel}</span>
                          <span className="mt-0.5 block text-[15px] font-black leading-snug text-slate-900">{item.label}</span>
                          <span className="mt-1 block text-xs font-bold leading-snug text-slate-500">{item.description}</span>
                        </span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
});

const SearchDialog = memo(function SearchDialog({
  onClose,
  setActiveModal,
}: {
  onClose: () => void;
  setActiveModal: (modal: HeaderModalId) => void;
}) {
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const globalSearchInputRef = useRef<HTMLInputElement>(null);
  const globalSearchDialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    globalSearchInputRef.current?.focus();
  }, []);
  const globalSearchResults = useMemo(() => {
    const keyword = globalSearchTerm.trim().toLowerCase();
    if (!keyword) return [];
    return searchableItems.filter((item) => item.searchText.includes(keyword));
  }, [globalSearchTerm]);
  const handleGlobalSearchKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !globalSearchDialogRef.current) return;

    const focusable = Array.from(globalSearchDialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])'));
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

  return createPortal(
    <div onClick={onClose} onKeyDown={handleGlobalSearchKeyDown} className="site-search-overlay fixed inset-0 z-[150] p-2 sm:p-4" role="dialog" aria-modal="true" aria-label="搜尋全站功能" aria-describedby="global-search-help" ref={globalSearchDialogRef}>
      <div onClick={(event) => event.stopPropagation()} className="mx-auto w-full max-w-none rounded-[1.65rem] bg-white p-2 sm:p-3">
        <p id="global-search-help" className="sr-only">輸入關鍵字搜尋全站功能。按 Escape 可關閉搜尋視窗。</p>
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-indigo-600 text-2xl font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] lg:flex lg:h-10 lg:w-10 lg:text-xl">會</div>
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[2rem] bg-slate-100 px-5 py-4 sm:px-7 lg:mx-auto lg:max-w-5xl lg:py-3 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2">
            <Search className="h-6 w-6 shrink-0 text-slate-600" />
            <input
              ref={globalSearchInputRef}
              value={globalSearchTerm}
              onChange={(event) => setGlobalSearchTerm(event.target.value)}
              placeholder="搜尋全站功能"
              className="min-w-0 flex-1 bg-transparent text-lg font-bold text-slate-900 outline-none placeholder:text-slate-500 sm:text-xl"
              aria-describedby="global-search-help"
            />
            <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-indigo-100 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 lg:h-9 lg:w-9" aria-label="關閉搜尋">
              <X className="h-7 w-7" />
            </button>
          </div>
        </div>
        {globalSearchTerm && (
          <div className="mx-auto mt-4 max-h-[75vh] w-full overflow-y-auto rounded-[2rem] bg-slate-50 p-3 shadow-[0_12px_35px_rgba(15,23,42,0.18)] sm:p-4" aria-live="polite" aria-atomic="true">
            {globalSearchResults.length ? (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3 px-2">
                  <div><p className="text-[11px] font-black tracking-[0.14em] text-indigo-600">SEARCH RESULTS</p><h2 className="mt-0.5 text-base font-black text-slate-900 sm:text-lg">找到符合的功能</h2></div>
                  <span className="rounded-full border-2 border-slate-900 bg-amber-300 px-3 py-1 text-xs font-black text-slate-900">{globalSearchResults.length} 項結果</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {globalSearchResults.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button key={item.id} type="button" onClick={() => { onClose(); runMenuAction(item, setActiveModal); }} className="group flex min-h-[118px] items-center gap-4 rounded-[1.4rem] border-2 border-slate-200 bg-white p-4 text-left shadow-sm transition-[background-color,border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/70 hover:shadow-[0_10px_24px_-14px_rgba(79,70,229,0.65)] focus-visible:border-indigo-500 focus-visible:bg-indigo-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 ${item.bg} ${item.color}`}><ItemIcon className="h-6 w-6" /></span>
                        <span className="min-w-0 flex-1"><span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">{item.categoryLabel}</span><span className="mt-1.5 block font-black leading-tight text-slate-900">{item.label}</span><span className="mt-1 block line-clamp-2 text-xs font-bold leading-5 text-slate-500">{item.description}</span></span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-focus-visible:bg-indigo-600 group-focus-visible:text-white"><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5" /></span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-5 py-10 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-400"><Search className="h-6 w-6" /></span><p className="mt-4 font-black text-slate-800">找不到相符的功能</p><p className="mt-1 text-sm font-bold text-slate-500">試試學校、科別、志願或計分規則等關鍵字。</p></div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
});

function GlobalSearchButton({ isScrolled, setActiveModal }: { isScrolled: boolean; setActiveModal: (modal: HeaderModalId) => void }) {
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const close = useCallback(() => setIsGlobalSearchOpen(false), []);
  useEffect(() => {
    const openSiteSearch = () => setIsGlobalSearchOpen(true);
    window.addEventListener('open-site-search', openSiteSearch);
    return () => window.removeEventListener('open-site-search', openSiteSearch);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsGlobalSearchOpen(true)}
        aria-label="搜尋全站功能"
        aria-expanded={isGlobalSearchOpen}
        className={`flex items-center justify-center bg-amber-400 text-slate-900 border-slate-900 font-black transition hover:bg-amber-300 active:translate-y-1 ${isScrolled ? 'w-10 h-10 rounded-xl border-2' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-3'}`}
      >
        <Search className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
      </button>
      {isGlobalSearchOpen && <SearchDialog onClose={close} setActiveModal={setActiveModal} />}
    </>
  );
}

const MobileMenuHost = memo(function MobileMenuHost({
  menuRef,
  setActiveModal,
}: {
  menuRef: MutableRefObject<MenuHoverHandlers>;
  setActiveModal: (modal: HeaderModalId) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);
  menuRef.current.open = open;
  if (!isOpen) return null;
  return <NavigationDrawer isOpen onClose={close} setActiveModal={setActiveModal} />;
});

function AppHeader({ onShareClick, setActiveModal }: AppHeaderProps) {
  const isScrolled = useIsScrolled();
  const isCompactNavigation = useCompactNavigation();
  const menuRef = useRef<MenuHoverHandlers>({
    keep() {},
    scheduleClose() {},
    open() {},
  });

  return (
    <div className={`app-header-root fixed top-0 left-0 right-0 z-[90] pointer-events-none transition-[padding] duration-150 ease-out ${isScrolled ? 'p-2' : 'p-0'}`}>
      <div className="mx-auto w-full max-w-none pointer-events-auto">
        <AnnouncementBar isScrolled={isScrolled} />
        <header onMouseEnter={() => menuRef.current.keep()} onMouseLeave={() => menuRef.current.scheduleClose()} className={`app-header-shell relative bg-white/95 flex items-center justify-between gap-2 transition-[border-radius,padding,box-shadow] duration-150 ease-out ${isScrolled ? 'rounded-[1.65rem] border-2 border-slate-900 p-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'rounded-none border-x-0 border-t-0 border-b-2 border-slate-900 p-2 sm:p-3 shadow-[0_2px_0px_0px_rgba(15,23,42,1)]'}`}>
          <a href={withBasePath('/')} aria-label="回到會考落點分析首頁" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className={`bg-indigo-600 border-slate-900 flex items-center justify-center text-white font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all ${isScrolled ? 'w-10 h-10 rounded-xl border-2 text-xl' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-3 text-xl sm:text-2xl'}`}>
              會
            </div>
            <div className="flex flex-col">
              <span className={`font-black text-slate-900 tracking-tight leading-none transition-all ${isScrolled ? 'text-base min-[450px]:text-lg' : 'text-base min-[450px]:text-lg sm:text-xl'}`}>會考落點分析</span>
              <span className={`mt-1 hidden font-bold text-slate-500 transition-all min-[450px]:block ${isScrolled ? 'h-0 overflow-hidden text-[10px] opacity-0' : 'h-auto text-[10px] opacity-100'}`}>升學選擇的好幫手</span>
            </div>
          </a>

          <DesktopNav isCompact={isCompactNavigation} setActiveModal={setActiveModal} menuHoverRef={menuRef} />

          <div className="flex shrink-0 items-center gap-2">
            <GlobalSearchButton isScrolled={isScrolled} setActiveModal={setActiveModal} />
            <button
              type="button"
              onClick={onShareClick}
              aria-label="開啟分享選單"
              className={`bg-emerald-200 flex items-center justify-center border-slate-900 transition hover:bg-emerald-300 active:translate-y-1 ${isScrolled ? 'w-10 h-10 rounded-xl border-2' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-3'}`}
            >
              <Share2 className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
            </button>
            <button
              type="button"
              onClick={() => menuRef.current.open()}
              aria-label="開啟全站選單"
              className={`bg-sky-200 ${isCompactNavigation ? 'flex' : 'hidden'} items-center justify-center border-slate-900 transition hover:bg-sky-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'w-10 h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'}`}
            >
              <Menu className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
            </button>
          </div>
        </header>
        <MobileMenuHost menuRef={menuRef} setActiveModal={setActiveModal} />
      </div>
    </div>
  );
}

export default memo(AppHeader);
