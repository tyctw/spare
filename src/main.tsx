import VocationalComparePage from './components/VocationalComparePage';
import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Lightbulb } from 'lucide-react';
import './index.css';
import './page-loading.css';
import { getCurrentRoutePath, withBasePath } from './lib/routes.ts';
import { applyPageSeo } from './lib/seo.ts';
import RelatedReading from './components/RelatedReading.tsx';
import Footer from './components/layout/Footer.tsx';
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
const FuturePathwaysPage = lazy(() => import('./components/FuturePathwaysPage.tsx'));
const LifeFeasibilityPage = lazy(() => import('./components/LifeFeasibilityPage.tsx'));
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
const ScoreChangePage = lazy(() => import('./components/ScoreChangePage.tsx'));
const ScoreRecordsPage = lazy(() => import('./components/ScoreRecordsPage.tsx'));
const ComparisonPage = lazy(() => import('./components/ComparisonPage.tsx'));
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
const PrivacyCenterPage = lazy(() => import('./components/PrivacyCenterPage.tsx'));
const VocationalEncyclopediaPage = lazy(() => import('./components/VocationalEncyclopediaPage.tsx'));
const RegionScoringRulesPage = lazy(() => import('./components/RegionScoringRulesPage.tsx'));
const AreaPage = lazy(() => import('./components/AreaPage.tsx'));

function PageLoading() {
  return (
    <div className="page-loading" role="status" aria-live="polite" aria-label="正在準備頁面">
      <section className="page-loading-content">
        <p className="page-loading-kicker">116 學年度會考落點分析</p>
        <h1>正在準備頁面</h1>
        <p className="page-loading-description">正在載入升學資訊，馬上為你開啟內容。</p>
        <div className="page-loading-progress" aria-hidden="true"><span /></div>
        <div className="page-loading-tip">
          <Lightbulb size={18} aria-hidden="true" />
          <p><strong>選填志願小提醒</strong><span>先把志願分成挑戰、適中與安全三個層級。</span></p>
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
if (redirectedRoute) {
  // GitHub Pages redirects deep links through ?route=… . Keep any other
  // query values (notably the collaboration key on shared volunteer lists)
  // when restoring the clean route, otherwise an editable share degrades to
  // read-only immediately after the page loads.
  const query = new URLSearchParams(window.location.search);
  query.delete('route');
  const remainingQuery = query.toString();
  window.history.replaceState(null, '', `${withBasePath(path)}${remainingQuery ? `?${remainingQuery}` : ''}${window.location.hash}`);
}
applyPageSeo(path);

const page =
  path === '/privacy' ? <LegalPage kind="privacy" /> :
  path === '/terms' ? <LegalPage kind="terms" /> :
  path === '/advantages' ? <AdvantagesPage /> :
  path === '/changelog' ? <ChangelogPage /> :
  path === '/guide/find' ? <CategoryOverviewPage categoryId="find" /> :
  path === '/guide/choose' ? <CategoryOverviewPage categoryId="choose" /> :
  path === '/guide/scoring' ? <CategoryOverviewPage categoryId="scoring" /> :
  path === '/guide/plan' ? <CategoryOverviewPage categoryId="plan" /> :
  path === '/guide/member' ? <CategoryOverviewPage categoryId="member" /> :
  path === '/guide/help' ? <CategoryOverviewPage categoryId="help" /> :
  path === '/disclaimer' ? <DisclaimerPage /> :
  path === '/faq-glossary' ? <FaqGlossaryPage /> :
  path === '/five-year-college-rules' ? <FiveYearCollegeRulesPage /> :
  path === '/grade-level' ? <GradeLevelPage /> :
  path === '/grade-11-pathways' ? <Grade11PathwaysPage /> :
  path === '/future-pathways' ? <FuturePathwaysPage /> :
  path === '/life-feasibility' ? <LifeFeasibilityPage /> :
  path === '/general-comprehensive-high-school' ? <GeneralComprehensiveHighSchoolPage /> :
  path === '/historical-stats' ? <HistoricalStatsPage /> :
  path === '/important-dates' ? <ImportantDatesPage /> :
  path === '/mock-volunteer' ? <MockVolunteerPage /> :
  path === '/search' ? <SearchPage /> :
  path === '/results' ? <ResultsPage /> :
  path === '/score-change' ? <ScoreChangePage /> :
  path === '/score-records' ? <ScoreRecordsPage /> :
  path === '/compare' ? <ComparisonPage /> :
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
  path === '/privacy-center' ? <PrivacyCenterPage /> :
  path === '/membership' || path === '/membership/success' ? <MembershipPage /> :
  path === '/after-sales-service' ? <SupportPolicyPage kind="after-sales" /> :
  path === '/refund-cancellation-policy' ? <SupportPolicyPage kind="refund-cancellation" /> :
  path === '/vocational-compare' ? <VocationalComparePage /> :
  path === '/vocational-encyclopedia' ? <VocationalEncyclopediaPage /> :
  scoringRulesRegionId ? <RegionScoringRulesPage regionId={scoringRulesRegionId} /> :
  areaSlug ? <AreaPage slug={areaSlug} /> :
  <App />;

const informationalPaths = new Set(['/advantages', '/disclaimer', '/faq-glossary', '/five-year-college-rules', '/grade-level', '/grade-11-pathways', '/future-pathways', '/life-feasibility', '/general-comprehensive-high-school', '/historical-stats', '/important-dates', '/instructions', '/holland', '/school-types', '/strategy', '/vocational-encyclopedia']);
const showRelatedReading = informationalPaths.has(path) || Boolean(newsArticleId) || path.startsWith('/scoring-rules/') || path.startsWith('/area/');
const pagesWithoutSharedFooter = new Set(['/', '/results', '/compare', '/holland', '/support/success', '/support/failed']);
const showSharedFooter = !pagesWithoutSharedFooter.has(path) && !sharedReportToken;

createRoot(document.getElementById('root')!).render(
  <StrictMode><AccessibilityEnhancements /><AppErrorBoundary><Suspense fallback={<PageLoading />}>{page}{showRelatedReading && <RelatedReading path={path} />}{showSharedFooter && <Footer />}</Suspense></AppErrorBoundary></StrictMode>,
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
