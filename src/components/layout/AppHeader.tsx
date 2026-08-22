import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Share2, Menu, Compass, Target, CalendarDays, CircleHelp, ArrowRight, X, Instagram } from 'lucide-react';
import { withBasePath } from '../../lib/routes';
import { menuCategories, type MenuCategory, type MenuItem } from './NavigationDrawer';
import { categoryOverviewPaths } from '../../lib/categoryOverview';

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
    </svg>
  );
}

interface AppHeaderProps {
  isScrolled: boolean;
  onShareClick: () => void;
  onMenuClick: () => void;
  setActiveModal: (modal: string) => void;
}

export default function AppHeader({ isScrolled, onShareClick, onMenuClick, setActiveModal }: AppHeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const getCompactNavigation = () => typeof window !== 'undefined' && (
    window.innerWidth < 1024 || window.matchMedia('(hover: none), (pointer: coarse)').matches
  );
  const [isCompactNavigation, setIsCompactNavigation] = useState(getCompactNavigation);
  const closeMenuTimer = useRef<number | null>(null);
  const globalSearchInputRef = useRef<HTMLInputElement>(null);
  const globalSearchDialogRef = useRef<HTMLDivElement>(null);
  const keepMenuOpen = () => {
    if (closeMenuTimer.current !== null) {
      window.clearTimeout(closeMenuTimer.current);
      closeMenuTimer.current = null;
    }
  };
  const closeMenuWithDelay = () => {
    keepMenuOpen();
    closeMenuTimer.current = window.setTimeout(() => setActiveMenu(null), 220);
  };
  const closeGlobalSearch = () => {
    setIsGlobalSearchOpen(false);
    setGlobalSearchTerm('');
  };
  const handleGlobalSearchKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeGlobalSearch();
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

  useEffect(() => () => keepMenuOpen(), []);
  useEffect(() => {
    if (isGlobalSearchOpen) globalSearchInputRef.current?.focus();
  }, [isGlobalSearchOpen]);
  useEffect(() => {
    const openSiteSearch = () => setIsGlobalSearchOpen(true);
    window.addEventListener('open-site-search', openSiteSearch);
    return () => window.removeEventListener('open-site-search', openSiteSearch);
  }, []);
  useEffect(() => {
    const updateNavigationMode = () => setIsCompactNavigation(getCompactNavigation());
    updateNavigationMode();
    window.addEventListener('resize', updateNavigationMode);
    return () => window.removeEventListener('resize', updateNavigationMode);
  }, []);
  const findCategory = (id: string) => menuCategories.find((category) => category.id === id)!;
  const navigationLinks: Array<{ id: keyof typeof categoryOverviewPaths; label: string; icon: typeof Compass; title: string; description: string; categories: MenuCategory[] }> = [
    { id: 'find', label: '我要查資料', icon: Compass, title: '我要查資料', description: '快速找到適合的學校、科別與升學方向', categories: [findCategory('find')] },
    { id: 'choose', label: '我要選志願', icon: Target, title: '我要選志願', description: '依據成績與目標，安排你的志願順序', categories: [findCategory('choose')] },
    { id: 'plan', label: '我要規劃升學', icon: CalendarDays, title: '我要規劃升學', description: '從興趣探索到重要時程，一次準備好', categories: [findCategory('plan')] },
    { id: 'member', label: '會員與資源', icon: CircleHelp, title: '會員與升學資源', description: '管理會員資格，前往相關的升學工具與平台', categories: [findCategory('membership'), findCategory('external')] },
    { id: 'help', label: '使用協助', icon: CircleHelp, title: '使用協助與平台資訊', description: '取得操作支援，也能查看平台規範與最新狀態', categories: [findCategory('support'), findCategory('about')] },
  ];
  const selectedMenu = navigationLinks.find((menu) => menu.id === activeMenu);
  const selectedItems = selectedMenu?.categories.flatMap((category) => category.items.map((item) => ({ ...item, categoryLabel: category.label }))) ?? [];
  const currentMonth = new Date().getMonth() + 1;
  const seasonalRecommendation = currentMonth <= 3
    ? { label: '準備期', ids: ['home', 'search', 'importantDates', 'instructions'] }
    : currentMonth <= 5
      ? { label: '考前準備', ids: ['importantDates', 'instructions', 'holland', 'schoolTypes'] }
      : currentMonth <= 7
        ? { label: '成績與選填', ids: ['scoreInquiry', 'home', 'mockVolunteer', 'strategy'] }
        : currentMonth <= 8
          ? { label: '放榜與報到', ids: ['importantDates', 'schoolTypes', 'vocational', 'holland'] }
          : { label: '探索規劃', ids: ['holland', 'vocational', 'schoolTypes', 'search'] };
  const shortcutItems = seasonalRecommendation.ids
    .map((id) => menuCategories.flatMap((category) => category.items).find((item) => item.id === id))
    .filter(Boolean) as MenuItem[];
  const runAction = (item: MenuItem) => {
    if (item.action.type === 'route') window.location.href = withBasePath(item.action.href);
    else if (item.action.type === 'external') window.open(item.action.href, '_blank', 'noreferrer');
    else setActiveModal(item.action.id);
  };
  const globalSearchResults = useMemo(() => {
    const keyword = globalSearchTerm.trim().toLowerCase();
    if (!keyword) return [];
    return menuCategories.flatMap((category) => category.items.map((item) => ({ ...item, categoryLabel: category.label })))
      .filter((item) => `${item.categoryLabel} ${item.label} ${item.description} ${item.keywords}`.toLowerCase().includes(keyword));
  }, [globalSearchTerm]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-[90] pointer-events-none transition-all duration-300 ${isScrolled ? 'p-2' : 'p-0'}`}>
      <div className="mx-auto w-full max-w-none pointer-events-auto">
        <header onMouseEnter={keepMenuOpen} onMouseLeave={closeMenuWithDelay} className={`relative bg-white/95 backdrop-blur-md flex items-center justify-between gap-2 transition-all duration-300 ${isScrolled ? 'rounded-[1.65rem] border-2 border-slate-900 p-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'rounded-none border-x-0 border-t-0 border-b-2 border-slate-900 p-2 sm:p-3 shadow-[0_2px_0px_0px_rgba(15,23,42,1)]'}`}>
          <a href={withBasePath('/')} aria-label="回到會考落點分析首頁" className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className={`bg-indigo-600 border-slate-900 flex items-center justify-center text-white font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all ${isScrolled ? 'w-10 h-10 rounded-xl border-2 text-xl' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-3 text-xl sm:text-2xl'}`}>
              會
            </div>
            <div className="flex flex-col">
              <h1 className={`font-black text-slate-900 tracking-tight leading-none transition-all ${isScrolled ? 'text-base min-[450px]:text-lg' : 'text-base min-[450px]:text-lg sm:text-xl'}`}>會考落點分析</h1>
              <span className={`mt-1 hidden font-bold text-slate-500 transition-all min-[450px]:block ${isScrolled ? 'h-0 overflow-hidden text-[10px] opacity-0' : 'h-auto text-[10px] opacity-100'}`}>升學選擇的好幫手</span>
            </div>
          </a>

          <nav aria-label="主要導覽" className={`${isCompactNavigation ? 'hidden' : 'flex'} items-center gap-1 rounded-2xl bg-slate-100/80 p-1.5`}>
            {navigationLinks.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                onMouseEnter={() => { keepMenuOpen(); setActiveMenu(id); }}
                onFocus={() => { keepMenuOpen(); setActiveMenu(id); }}
                onClick={() => { window.location.href = withBasePath(categoryOverviewPaths[id]); }}
                aria-haspopup="true"
                aria-expanded={activeMenu === id}
                aria-controls="desktop-mega-menu"
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${activeMenu === id ? 'bg-amber-200/80 text-slate-900 shadow-sm' : ''}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          {!isCompactNavigation && selectedMenu && (
            <section
              id="desktop-mega-menu"
              onMouseEnter={keepMenuOpen}
              onMouseLeave={closeMenuWithDelay}
              aria-label={`${selectedMenu.title}次選單`}
              className="absolute left-0 right-0 z-20 top-[calc(100%+16px)] hidden overflow-visible rounded-[2rem] border-2 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] lg:block"
            >
              <div className="grid grid-cols-[2fr_0.9fr] gap-5">
                <div className="order-2 rounded-[1.5rem] bg-indigo-50 p-5">
                  <p className="text-sm font-black text-indigo-700">猜你可能在找</p>
                  <div className="mt-3 space-y-2">
                    {shortcutItems.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <button key={item.id} type="button" onClick={() => runAction(item)} className="group flex w-full items-center justify-between rounded-xl bg-white/80 px-3 py-2.5 text-left text-sm font-black text-slate-800 transition hover:bg-white hover:shadow-sm">
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.bg} ${item.color}`}><ItemIcon className="h-4 w-4" /></span>
                            <span className="truncate">{item.label}</span>
                          </span>
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-amber-300 group-hover:text-slate-900">
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </button>
                      );
                    })}
                    <div className="mt-3 grid w-full grid-cols-2 gap-2">
                      <a href="https://www.instagram.com/exam.tw/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-lg bg-white/70 px-2 py-2 text-xs font-black text-slate-600 transition hover:bg-white hover:text-pink-600" aria-label="前往 Instagram，新分頁開啟"><Instagram className="h-4 w-4" />Instagram</a>
                      <a href="https://www.threads.com/@exam.tw" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-lg bg-white/70 px-2 py-2 text-xs font-black text-slate-600 transition hover:bg-white hover:text-slate-900" aria-label="前往 Threads，新分頁開啟"><ThreadsIcon className="h-4 w-4" />Threads</a>
                    </div>
                    <a href={withBasePath('/support')} className="group mt-3 flex items-center justify-between rounded-xl border-2 border-rose-200 bg-rose-400 px-3 py-3 text-left text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      <span>
                        <span className="block text-sm font-black">支持免費升學工具</span>
                        <span className="mt-0.5 block text-[11px] font-bold text-rose-950/70">讓免費升學工具持續陪你前進</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
                <div className="order-1">
                  <p className="mb-3 px-1 text-sm font-black text-slate-500">探索更多</p>
                  <div className="-m-1 grid max-h-[calc(100vh-12rem)] grid-cols-2 gap-3 overflow-y-auto p-1 pr-2">
                    {selectedItems.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      return (
                        <button key={item.id} type="button" onClick={() => runAction(item)} className={`group relative z-0 flex items-stretch overflow-hidden rounded-[1.35rem] border-2 border-slate-100 text-left transition hover:z-10 hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${itemIndex === 0 ? 'bg-amber-50' : 'bg-slate-50'}`}>
                          <span className={`flex w-14 shrink-0 items-center justify-center transition-colors group-hover:brightness-95 ${item.bg} ${item.color}`}>
                            <ItemIcon className="h-6 w-6" />
                          </span>
                          <span className="flex min-w-0 flex-1 items-center gap-3 p-4 pl-3">
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="text-[10px] font-black text-slate-500">{item.categoryLabel}</span>
                              <span className="mt-0.5 block text-[15px] font-black leading-snug text-slate-900">{item.label}</span>
                              <span className="mt-1 block text-xs font-bold leading-snug text-slate-500">{item.description}</span>
                            </span>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-hover:bg-amber-300 group-hover:text-slate-900">
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

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsGlobalSearchOpen(true)}
              aria-label="搜尋全站功能"
              aria-expanded={isGlobalSearchOpen}
              className={`flex items-center justify-center gap-2 bg-amber-400 text-slate-900 border-slate-900 font-black transition hover:bg-amber-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'w-10 h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'w-10 h-10 sm:w-auto sm:h-12 sm:px-4 rounded-xl sm:rounded-2xl border-2 sm:border-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'}`}
            >
              <Search className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />
            </button>
            <button
              type="button"
              onClick={onShareClick}
              aria-label="開啟分享選單"
              className={`bg-emerald-200 flex items-center justify-center border-slate-900 transition hover:bg-emerald-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'w-10 h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'}`}
            >
              <Share2 className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
            </button>
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="開啟全站選單"
              className={`bg-sky-200 ${isCompactNavigation ? 'flex' : 'hidden'} items-center justify-center border-slate-900 transition hover:bg-sky-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'w-10 h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 sm:border-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'}`}
            >
              <Menu className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
            </button>
          </div>

          {isGlobalSearchOpen && createPortal(
            <div onClick={closeGlobalSearch} onKeyDown={handleGlobalSearchKeyDown} className="fixed inset-0 z-[150] bg-slate-950/65 p-2 backdrop-blur-md sm:p-4" role="dialog" aria-modal="true" aria-label="搜尋全站功能" aria-describedby="global-search-help" ref={globalSearchDialogRef}>
              <div onClick={(event) => event.stopPropagation()} className="mx-auto w-full max-w-none rounded-[1.65rem] bg-white p-2 sm:p-3">
                <p id="global-search-help" className="sr-only">輸入關鍵字搜尋全站功能。按 Escape 可關閉搜尋視窗。</p>
                <div className="flex items-center gap-3 lg:gap-6">
                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-indigo-600 text-2xl font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] lg:flex lg:h-10 lg:w-10 lg:text-xl">會</div>
                  <div className="flex min-w-0 flex-1 items-center gap-3 rounded-[2rem] bg-slate-100 px-5 py-4 sm:px-7 lg:mx-auto lg:max-w-5xl lg:py-3 focus-within:ring-2 focus-within:ring-sky-600 focus-within:ring-offset-2">
                    <Search className="h-6 w-6 shrink-0 text-slate-600" />
                    <input
                      ref={globalSearchInputRef}
                      value={globalSearchTerm}
                      onChange={(event) => setGlobalSearchTerm(event.target.value)}
                      placeholder="搜尋全站功能"
                      className="min-w-0 flex-1 bg-transparent text-lg font-bold text-slate-900 outline-none placeholder:text-slate-500 sm:text-xl"
                      aria-describedby="global-search-help"
                    />
                    <button type="button" onClick={closeGlobalSearch} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 lg:h-9 lg:w-9" aria-label="關閉搜尋">
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
                              <button key={item.id} type="button" onClick={() => { setIsGlobalSearchOpen(false); setGlobalSearchTerm(''); runAction(item); }} className="group flex min-h-[118px] items-center gap-4 rounded-[1.4rem] border-2 border-slate-200 bg-white p-4 text-left shadow-[2px_2px_0_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-[4px_4px_0_#0f172a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2">
                                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 ${item.bg} ${item.color}`}><ItemIcon className="h-6 w-6" /></span>
                                <span className="min-w-0 flex-1"><span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">{item.categoryLabel}</span><span className="mt-1.5 block font-black leading-tight text-slate-900">{item.label}</span><span className="mt-1 block line-clamp-2 text-xs font-bold leading-5 text-slate-500">{item.description}</span></span>
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all group-hover:bg-amber-300 group-hover:text-slate-900"><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
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
          )}
        </header>
      </div>
    </div>
  );
}
