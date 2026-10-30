import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Instagram,
  Search,
  X,
} from 'lucide-react';
import { withBasePath } from '../../lib/routes';
import { menuCategories, ThreadsIcon, type MenuAction, type MenuCategory } from './menuData';
import './navigation-drawer.css';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveModal: (modal: any) => void;
}

const DRAWER_EXIT_MS = 160;

const isCompactNavigationViewport = () => typeof window !== 'undefined' && (
  window.innerWidth < 1024 || window.matchMedia('(hover: none), (pointer: coarse)').matches
);

function NavigationDrawer({ isOpen, onClose, setActiveModal }: NavigationDrawerProps) {
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
  const isClosingRef = useRef(false);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const scrollRestorationChangedRef = useRef(false);
  const previousScrollRestorationRef = useRef<ScrollRestoration>('auto');
  const [isClosing, setIsClosing] = useState(false);

  // Page scroll restoration is switched to "manual" for the lifetime of the
  // drawer. Returning to the page entry via history.go() then never makes the
  // browser re-apply (and, with `scroll-behavior: smooth`, animate) a saved
  // scroll position. It is switched back once the traversal has finished.
  const restoreScrollRestoration = (traversalDone = false) => {
    if (!scrollRestorationChangedRef.current) return;
    scrollRestorationChangedRef.current = false;
    if (traversalDone) {
      if ('scrollRestoration' in window.history) window.history.scrollRestoration = previousScrollRestorationRef.current;
      return;
    }
    const restore = () => {
      window.removeEventListener('popstate', restore);
      window.clearTimeout(restoreTimer);
      if ('scrollRestoration' in window.history) window.history.scrollRestoration = previousScrollRestorationRef.current;
    };
    const restoreTimer = window.setTimeout(restore, 1000);
    window.addEventListener('popstate', restore);
  };

  // On touch devices, make the browser back gesture dismiss the drawer before
  // it leaves the current page. Closing by a UI control removes that temporary
  // history entry as well, so it does not consume an extra back press later.
  // The exit is a short compositor-only fade (opacity/transform); the heavy
  // work (unmounting the menu, history traversal) runs after it, hidden.
  const finishClose = () => {
    const historySteps = hasHistoryEntryRef.current
      ? (isMobileCategoryOpenRef.current ? -2 : -1) : 0;
    hasHistoryEntryRef.current = false;
    isMobileCategoryOpenRef.current = false;
    // A UI close must not depend on asynchronous (and sometimes throttled)
    // history traversal delivering popstate on a mobile browser.
    onClose();
    restoreScrollRestoration();
    if (historySteps) window.history.go(historySteps);
  };

  const closeDrawer = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose();
      return;
    }
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(finishClose, DRAWER_EXIT_MS);
  };

  const openMobileCategory = (category: MenuCategory) => {
    if (isClosingRef.current || isMobileCategoryOpenRef.current) return;
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
      // The exit animation delays this cleanup, so another surface (e.g. the
      // search dialog opened from the menu) may already own focus; only
      // restore it when focus was lost with the removed drawer.
      const active = document.activeElement;
      if (!active || active === document.body) triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !isCompactNavigationViewport()) return;

    // StrictMode replays effects; do not add a second entry for this instance.
    if (!hasHistoryEntryRef.current && 'scrollRestoration' in window.history && !scrollRestorationChangedRef.current) {
      previousScrollRestorationRef.current = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      scrollRestorationChangedRef.current = true;
    }
    if (!hasHistoryEntryRef.current) window.history.pushState(
      { ...(window.history.state ?? {}), navigationDrawerOpen: true, navigationDrawerLevel: 'root' },
      '',
      window.location.href,
    );
    hasHistoryEntryRef.current = true;

    const handlePopState = (event: PopStateEvent) => {
      if (isClosingRef.current) return;
      const state = event.state as { navigationDrawerOpen?: boolean; navigationDrawerLevel?: string } | null;
      if (state?.navigationDrawerOpen && state.navigationDrawerLevel === 'root') {
        isMobileCategoryOpenRef.current = false;
        setMobileCategory(null);
        requestAnimationFrame(scrollMenuToTop);
        return;
      }

      hasHistoryEntryRef.current = false;
      isMobileCategoryOpenRef.current = false;
      restoreScrollRestoration(true);
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

  // Keep the page behind the drawer still without touching layout. Toggling
  // `overflow` on <html> forces a full-page relayout/repaint on open and close
  // and is ignored by some iOS Safari versions, so block scroll gestures that
  // would chain out of the menu list instead.
  useEffect(() => {
    const panel = drawerRef.current;
    if (!panel) return;
    let startY = 0;
    const canScroll = (target: EventTarget | null, dy: number) => {
      const list = menuScrollRef.current;
      if (!list || !(target instanceof Node) || !list.contains(target)) return false;
      if (list.scrollHeight <= list.clientHeight) return false;
      const atTop = list.scrollTop <= 0;
      const atBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 1;
      return !((dy > 0 && atTop) || (dy < 0 && atBottom));
    };
    const onTouchStart = (event: TouchEvent) => { startY = event.touches[0]?.clientY ?? 0; };
    const onTouchMove = (event: TouchEvent) => {
      const dy = (event.touches[0]?.clientY ?? 0) - startY;
      if (!canScroll(event.target, dy)) event.preventDefault();
    };
    const onWheel = (event: WheelEvent) => {
      if (!canScroll(event.target, -event.deltaY)) event.preventDefault();
    };
    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    panel.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('wheel', onWheel);
    };
  }, [isCompactNavigation]);

  useEffect(() => () => {
    window.clearTimeout(closeTimerRef.current);
    // Unmounted without closeDrawer (e.g. via the popstate path or the host).
    restoreScrollRestoration();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      restoreScrollRestoration();
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

  if (!isOpen) return null;

  return createPortal(
    <>
          <div
            onClick={closeDrawer}
            aria-hidden="true"
            className={`navigation-drawer-overlay${isClosing ? ' is-closing' : ''} fixed inset-0 z-[100] bg-slate-900/40`}
          />
          <div
            id="main-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="main-navigation-title"
            aria-describedby="main-navigation-description"
            ref={drawerRef}
            onKeyDown={handleDrawerKeyDown}
            className={isCompactNavigation
              ? `navigation-drawer-panel${isClosing ? ' is-closing' : ''} fixed inset-0 z-[110] flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-900`
              : `navigation-drawer-panel fixed left-1/2 top-3 z-[110] flex max-h-[calc(100vh-1.5rem)] ${mobileCategory ? 'w-[min(94vw,760px)]' : 'w-[min(94vw,960px)]'} -translate-x-1/2 flex-col overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-slate-50 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:top-5 sm:max-h-[calc(100vh-2.5rem)]`}
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
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:bg-indigo-100 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                  ? 'flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.6rem] border-2 border-blue-700 bg-blue-600 text-white transition hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95'
                  : 'flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-slate-900 transition hover:bg-slate-100 active:scale-95'}
                aria-label="關閉主選單"
              >
                <X className={isCompactNavigation ? 'h-8 w-8' : 'h-6 w-6'} />
              </button>
              <p id="main-navigation-description" className="sr-only">可使用搜尋、分類與常用捷徑找到網站功能；按 Escape 可關閉選單。</p>
            </div>

            <div ref={menuScrollRef} className={isCompactNavigation
              ? 'custom-scrollbar flex-1 space-y-3 overflow-y-auto overscroll-contain rounded-t-[2rem] bg-white p-4'
              : 'custom-scrollbar flex-1 space-y-4 overflow-y-auto p-6'}>
              {mobileCategory ? (
                <section>
                  <div className="sticky top-[-1rem] z-10 -mx-4 -mt-4 mb-5 flex items-center gap-3 rounded-t-[2rem] bg-white px-5 py-3 shadow-[0_3px_8px_rgba(15,23,42,0.06)]">
                    <button type="button" onClick={returnToMainMenu} className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-slate-900 transition hover:bg-indigo-100 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" aria-label="返回主選單">
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
                        <button key={item.id} type="button" onClick={() => runAction(item.action)} className="group flex w-full items-stretch justify-between overflow-hidden rounded-[1.8rem] border-2 border-transparent bg-slate-100 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50 focus-visible:border-indigo-600 focus-visible:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-100">
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
                             <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-indigo-600 group-focus-visible:translate-x-1 group-focus-visible:text-indigo-600" />
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
                    className="mt-4 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                          ? 'group flex min-h-[104px] w-full items-stretch justify-between overflow-hidden rounded-[1.8rem] bg-slate-100 text-left transition-colors hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600 active:bg-indigo-100'
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
                      {isExpanded && (
                          <div
                            id={`nav-category-${category.id}`}
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
                          </div>
                        )}
                    </div>
                  );
                })
              )}

              <div className="grid grid-cols-2 gap-3">
                <a href="https://www.instagram.com/exam.tw/" target="_blank" rel="noreferrer" className="group flex items-stretch overflow-hidden rounded-[1.8rem] bg-slate-100 transition hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600">
                  <div className="flex w-14 shrink-0 items-center justify-center bg-pink-100 text-pink-600 transition-colors group-hover:brightness-95">
                    <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 items-center justify-center py-3.5 pr-3">
                    <span className="text-[15px] font-black text-slate-700">Instagram</span>
                  </div>
                </a>
                <a href="https://www.threads.com/@exam.tw" target="_blank" rel="noreferrer" className="group flex items-stretch overflow-hidden rounded-[1.8rem] bg-slate-100 transition hover:bg-indigo-50 focus-visible:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600">
                  <div className="flex w-14 shrink-0 items-center justify-center bg-slate-200 text-slate-700 transition-colors group-hover:brightness-95">
                    <ThreadsIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex flex-1 items-center justify-center py-3.5 pr-3">
                    <span className="text-[15px] font-black text-slate-700">Threads</span>
                  </div>
                </a>
              </div>

            </div>

          </div>
    </>,
    document.body,
  );
}

export default memo(NavigationDrawer);
