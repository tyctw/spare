import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getCurrentRoutePath, withBasePath } from './lib/routes.ts';
import { applyPageSeo } from './lib/seo.ts';

// Route-level splitting keeps the initial screen light while retaining the same
// URL-based navigation model. Each page is fetched only when it is visited.
const App = lazy(() => import('./App.tsx'));
const AdvantagesPage = lazy(() => import('./components/AdvantagesPage.tsx'));
const ChangelogPage = lazy(() => import('./components/ChangelogPage.tsx'));
const FaqGlossaryPage = lazy(() => import('./components/FaqGlossaryPage.tsx'));
const HollandPage = lazy(() => import('./components/HollandPage.tsx'));
const GradeLevelPage = lazy(() => import('./components/GradeLevelPage.tsx'));
const HistoricalStatsPage = lazy(() => import('./components/HistoricalStatsPage.tsx'));
const ImportantDatesPage = lazy(() => import('./components/ImportantDatesPage.tsx'));
const InstructionsPage = lazy(() => import('./components/InstructionsPage.tsx'));
const LegalPage = lazy(() => import('./components/LegalPage.tsx'));
const MockVolunteerPage = lazy(() => import('./components/MockVolunteerPage.tsx'));
const SearchPage = lazy(() => import('./components/SearchPage.tsx'));
const ResultsPage = lazy(() => import('./components/ResultsPage.tsx'));
const SiteMapPage = lazy(() => import('./components/SiteMapPage.tsx'));
const SchoolTypesPage = lazy(() => import('./components/SchoolTypesPage.tsx'));
const StrategyPage = lazy(() => import('./components/StrategyPage.tsx'));
const VocationalEncyclopediaPage = lazy(() => import('./components/VocationalEncyclopediaPage.tsx'));


function PageLoading() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 text-slate-900"
      role="status"
      aria-live="polite"
      aria-label="頁面載入中"
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-amber-300/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-sky-300/45 blur-3xl" />

      <section className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <div className="relative overflow-hidden border-b-4 border-slate-900 bg-indigo-500 px-6 pb-5 pt-6 text-white">
          <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full border-4 border-slate-900 bg-amber-300" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-slate-900 bg-white text-xl font-black text-indigo-600 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">115</div>
            <div>
              <p className="text-xs font-black tracking-[0.18em] text-indigo-100">ADMISSION COMPASS</p>
              <h1 className="mt-0.5 text-xl font-black tracking-tight">正在準備你的頁面</h1>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-900">資料與工具載入中</p>
              <p className="mt-1 text-xs font-bold text-slate-500">馬上就好，請稍候一下。</p>
            </div>
            <div className="flex items-end gap-1.5 pb-1" aria-hidden="true">
              <span className="h-3 w-3 animate-bounce rounded-sm border-2 border-slate-900 bg-amber-300" />
              <span className="h-5 w-3 animate-bounce rounded-sm border-2 border-slate-900 bg-sky-300 [animation-delay:150ms]" />
              <span className="h-7 w-3 animate-bounce rounded-sm border-2 border-slate-900 bg-rose-300 [animation-delay:300ms]" />
            </div>
          </div>

          <div className="mt-6 h-4 overflow-hidden rounded-full border-2 border-slate-900 bg-slate-100 p-0.5" aria-hidden="true">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-300" />
          </div>
        </div>
      </section>
    </main>
  );
}

const path = getCurrentRoutePath();
const redirectedRoute = new URLSearchParams(window.location.search).get('route');

if (redirectedRoute) {
  window.history.replaceState(null, '', withBasePath(path));
}

applyPageSeo(path);

const page =
  path === '/privacy' ? <LegalPage kind="privacy" /> :
  path === '/terms' ? <LegalPage kind="terms" /> :
  path === '/advantages' ? <AdvantagesPage /> :
  path === '/changelog' ? <ChangelogPage /> :
  path === '/faq-glossary' ? <FaqGlossaryPage /> :
  path === '/grade-level' ? <GradeLevelPage /> :
  path === '/historical-stats' ? <HistoricalStatsPage /> :
  path === '/important-dates' ? <ImportantDatesPage /> :
  path === '/mock-volunteer' ? <MockVolunteerPage /> :
  path === '/search' ? <SearchPage /> :
  path === '/results' ? <ResultsPage /> :
  path === '/site-map' ? <SiteMapPage /> :
  path === '/instructions' ? <InstructionsPage /> :
  path === '/holland' ? <HollandPage /> :
  path === '/school-types' ? <SchoolTypesPage /> :
  path === '/strategy' ? <StrategyPage /> :
  path === '/vocational-encyclopedia' ? <VocationalEncyclopediaPage /> :
  <App />;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<PageLoading />}>
      {page}
    </Suspense>
  </StrictMode>,
);
