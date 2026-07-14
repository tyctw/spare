import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getCurrentRoutePath, withBasePath } from './lib/routes.ts';
import App from './App.tsx';

const AdvantagesPage = lazy(() => import('./components/AdvantagesPage.tsx'));
const ChangelogPage = lazy(() => import('./components/ChangelogPage.tsx'));
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
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4 text-slate-900"
      role="status"
      aria-live="polite"
      aria-label="頁面載入中"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      <p className="text-lg font-bold">頁面載入中…</p>
    </main>
  );
}

const path = getCurrentRoutePath();
const redirectedRoute = new URLSearchParams(window.location.search).get('route');

if (redirectedRoute) {
  window.history.replaceState(null, '', withBasePath(path));
}

const page =
  path === '/privacy' ? <LegalPage kind="privacy" /> :
  path === '/terms' ? <LegalPage kind="terms" /> :
  path === '/advantages' ? <AdvantagesPage /> :
  path === '/changelog' ? <ChangelogPage /> :
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
