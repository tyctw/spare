import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { getCurrentRoutePath, withBasePath } from './lib/routes.ts';
import { applyPageSeo } from './lib/seo.ts';
import RelatedReading from './components/RelatedReading.tsx';
import AppErrorBoundary from './components/AppErrorBoundary.tsx';
import AccessibilityEnhancements from './components/AccessibilityEnhancements.tsx';
import { initializeAdvertising } from './lib/membership.ts';

const App = lazy(() => import('./App.tsx'));
const AdvantagesPage = lazy(() => import('./components/AdvantagesPage.tsx'));
const ChangelogPage = lazy(() => import('./components/ChangelogPage.tsx'));
const CategoryOverviewPage = lazy(() => import('./components/CategoryOverviewPage.tsx'));
const DisclaimerPage = lazy(() => import('./components/DisclaimerPage.tsx'));
const FaqGlossaryPage = lazy(() => import('./components/FaqGlossaryPage.tsx'));
const FiveYearCollegeRulesPage = lazy(() => import('./components/FiveYearCollegeRulesPage.tsx'));
const HollandPage = lazy(() => import('./components/HollandPage.tsx'));
const GradeLevelPage = lazy(() => import('./components/GradeLevelPage.tsx'));
const Grade11PathwaysPage = lazy(() => import('./components/Grade11PathwaysPage.tsx'));
const GeneralComprehensiveHighSchoolPage = lazy(() => import('./components/GeneralComprehensiveHighSchoolPage.tsx'));
const HistoricalStatsPage = lazy(() => import('./components/HistoricalStatsPage.tsx'));
const ImportantDatesPage = lazy(() => import('./components/ImportantDatesPage.tsx'));
const InstructionsPage = lazy(() => import('./components/InstructionsPage.tsx'));
const LegalPage = lazy(() => import('./components/LegalPage.tsx'));
const LatestNewsPage = lazy(() => import('./components/LatestNewsPage.tsx'));
const NewsArticlePage = lazy(() => import('./components/NewsArticlePage.tsx'));
const MockVolunteerPage = lazy(() => import('./components/MockVolunteerPage.tsx'));
const SearchPage = lazy(() => import('./components/SearchPage.tsx'));
const ResultsPage = lazy(() => import('./components/ResultsPage.tsx'));
const ReportErrorPage = lazy(() => import('./components/ReportErrorPage.tsx'));
const SharedReportPage = lazy(() => import('./components/SharedReportPage.tsx'));
const SiteMapPage = lazy(() => import('./components/SiteMapPage.tsx'));
const SchoolTypesPage = lazy(() => import('./components/SchoolTypesPage.tsx'));
const StrategyPage = lazy(() => import('./components/StrategyPage.tsx'));
const SupportPage = lazy(() => import('./components/SupportPage.tsx'));
const SupportPaymentFailedPage = lazy(() => import('./components/SupportPaymentFailedPage.tsx'));
const SupportPaymentSuccessPage = lazy(() => import('./components/SupportPaymentSuccessPage.tsx'));
const SupportPolicyPage = lazy(() => import('./components/SupportPolicyPage.tsx'));
const MembershipPage = lazy(() => import('./components/MembershipPage.tsx'));
const MembershipAccountPage = lazy(() => import('./components/MembershipAccountPage.tsx'));
const VocationalEncyclopediaPage = lazy(() => import('./components/VocationalEncyclopediaPage.tsx'));
const RegionScoringRulesPage = lazy(() => import('./components/RegionScoringRulesPage.tsx'));
const AreaPage = lazy(() => import('./components/AreaPage.tsx'));

function PageLoading() {
  return (
    <div className="fixed inset-0 z-[100] grid min-h-[100dvh] place-items-center overflow-hidden bg-slate-50 px-5 text-slate-900" role="status" aria-live="polite" aria-label="正在準備頁面">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-amber-300/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-sky-300/45 blur-3xl" />
      <section className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
        <div className="relative overflow-hidden border-b-4 border-slate-900 bg-indigo-500 px-6 py-6 text-white">
          <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full border-4 border-slate-900 bg-amber-300" />
          <p className="relative text-xs font-black tracking-[0.18em] text-indigo-100">ADMISSION COMPASS</p>
          <h1 className="relative mt-1 text-xl font-black tracking-tight">正在準備頁面</h1>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-black">資料整理中</p><p className="mt-1 text-xs font-bold text-slate-500">請稍候，馬上為你開啟內容。</p></div>
            <div className="flex items-end gap-1.5" aria-hidden="true"><span className="h-3 w-3 animate-bounce rounded-sm border-2 border-slate-900 bg-amber-300" /><span className="h-5 w-3 animate-bounce rounded-sm border-2 border-slate-900 bg-sky-300 [animation-delay:150ms]" /><span className="h-7 w-3 animate-bounce rounded-sm border-2 border-slate-900 bg-rose-300 [animation-delay:300ms]" /></div>
          </div>
          <div className="mt-6 h-4 overflow-hidden rounded-full border-2 border-slate-900 bg-slate-100 p-0.5" aria-hidden="true"><div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-300" /></div>
        </div>
      </section>
    </div>
  );
}

const rawPath = getCurrentRoutePath();
const isAcademicGroupRoute = rawPath === '/vocational-encyclopedia' && new URLSearchParams(window.location.search).get('group') === '學術群';
const path = isAcademicGroupRoute ? '/general-comprehensive-high-school' : rawPath;
if (isAcademicGroupRoute) window.history.replaceState(null, '', withBasePath('/general-comprehensive-high-school'));
const sharedReportToken = path.match(/^\/shared\/([0-9a-f-]+)$/i)?.[1];
const scoringRulesRegionId = path.match(/^\/scoring-rules\/([a-z-]+)$/)?.[1];
const areaSlug = path.match(/^\/area\/([a-z-]+)$/)?.[1];
const newsArticleId = path.match(/^\/news\/(\d+)$/)?.[1];
const redirectedRoute = new URLSearchParams(window.location.search).get('route');
if (redirectedRoute) window.history.replaceState(null, '', withBasePath(path));
applyPageSeo(path);

const page =
  path === '/privacy' ? <LegalPage kind="privacy" /> :
  path === '/terms' ? <LegalPage kind="terms" /> :
  path === '/advantages' ? <AdvantagesPage /> :
  path === '/changelog' ? <ChangelogPage /> :
  path === '/guide/find' ? <CategoryOverviewPage categoryId="find" /> :
  path === '/guide/choose' ? <CategoryOverviewPage categoryId="choose" /> :
  path === '/guide/plan' ? <CategoryOverviewPage categoryId="plan" /> :
  path === '/guide/member' ? <CategoryOverviewPage categoryId="member" /> :
  path === '/guide/help' ? <CategoryOverviewPage categoryId="help" /> :
  path === '/disclaimer' ? <DisclaimerPage /> :
  path === '/faq-glossary' ? <FaqGlossaryPage /> :
  path === '/five-year-college-rules' ? <FiveYearCollegeRulesPage /> :
  path === '/grade-level' ? <GradeLevelPage /> :
  path === '/grade-11-pathways' ? <Grade11PathwaysPage /> :
  path === '/general-comprehensive-high-school' ? <GeneralComprehensiveHighSchoolPage /> :
  path === '/historical-stats' ? <HistoricalStatsPage /> :
  path === '/important-dates' ? <ImportantDatesPage /> :
  path === '/mock-volunteer' ? <MockVolunteerPage /> :
  path === '/search' ? <SearchPage /> :
  path === '/results' ? <ResultsPage /> :
  path === '/report-error' ? <ReportErrorPage /> :
  sharedReportToken ? <SharedReportPage token={sharedReportToken} /> :
  path === '/site-map' ? <SiteMapPage /> :
  path === '/instructions' ? <InstructionsPage /> :
  path === '/news' ? <LatestNewsPage /> :
  newsArticleId ? <NewsArticlePage articleId={newsArticleId} /> :
  path === '/holland' ? <HollandPage /> :
  path === '/school-types' ? <SchoolTypesPage /> :
  path === '/strategy' ? <StrategyPage /> :
  path === '/support' ? <SupportPage /> :
  path === '/support/failed' ? <SupportPaymentFailedPage /> :
  path === '/support/success' ? <SupportPaymentSuccessPage /> :
  path === '/membership/account' ? <MembershipAccountPage /> :
  path === '/membership' || path === '/membership/success' ? <MembershipPage /> :
  path === '/after-sales-service' ? <SupportPolicyPage kind="after-sales" /> :
  path === '/refund-cancellation-policy' ? <SupportPolicyPage kind="refund-cancellation" /> :
  path === '/vocational-encyclopedia' ? <VocationalEncyclopediaPage /> :
  scoringRulesRegionId ? <RegionScoringRulesPage regionId={scoringRulesRegionId} /> :
  areaSlug ? <AreaPage slug={areaSlug} /> :
  <App />;

const informationalPaths = new Set(['/advantages', '/disclaimer', '/faq-glossary', '/five-year-college-rules', '/grade-level', '/grade-11-pathways', '/general-comprehensive-high-school', '/historical-stats', '/important-dates', '/instructions', '/holland', '/school-types', '/strategy', '/vocational-encyclopedia']);
const showRelatedReading = informationalPaths.has(path) || path.startsWith('/scoring-rules/') || path.startsWith('/area/');

createRoot(document.getElementById('root')!).render(
  <StrictMode><AccessibilityEnhancements /><AppErrorBoundary><Suspense fallback={<PageLoading />}>{page}{showRelatedReading && <RelatedReading path={path} />}</Suspense></AppErrorBoundary></StrictMode>,
);

// The homepage is the heaviest first view, so advertising waits for interaction
// or a short fallback there. Other pages can begin their normal ad check now.
let advertisingStarted = false;
const startAdvertising = () => {
  if (advertisingStarted) return;
  advertisingStarted = true;
  window.dispatchEvent(new Event('admission-third-party-ready'));
  void initializeAdvertising();
};
const startAdvertisingAfterInteraction = () => {
  startAdvertising();
  window.removeEventListener('pointerdown', startAdvertisingAfterInteraction);
  window.removeEventListener('keydown', startAdvertisingAfterInteraction);
  window.removeEventListener('touchstart', startAdvertisingAfterInteraction);
};
if (path === '/') {
  window.addEventListener('pointerdown', startAdvertisingAfterInteraction, { once: true, passive: true });
  window.addEventListener('keydown', startAdvertisingAfterInteraction, { once: true });
  window.addEventListener('touchstart', startAdvertisingAfterInteraction, { once: true, passive: true });
  window.setTimeout(startAdvertising, 5_000);
} else {
  startAdvertising();
}
