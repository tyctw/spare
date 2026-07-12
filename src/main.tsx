import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import AdvantagesPage from './components/AdvantagesPage.tsx';
import ChangelogPage from './components/ChangelogPage.tsx';
import HollandPage from './components/HollandPage.tsx';
import GradeLevelPage from './components/GradeLevelPage.tsx';
import HistoricalStatsPage from './components/HistoricalStatsPage.tsx';
import ImportantDatesPage from './components/ImportantDatesPage.tsx';
import InstructionsPage from './components/InstructionsPage.tsx';
import LegalPage from './components/LegalPage.tsx';
import MockVolunteerPage from './components/MockVolunteerPage.tsx';
import SearchPage from './components/SearchPage.tsx';
import ResultsPage from './components/ResultsPage.tsx';
import SiteMapPage from './components/SiteMapPage.tsx';
import SchoolTypesPage from './components/SchoolTypesPage.tsx';
import VocationalEncyclopediaPage from './components/VocationalEncyclopediaPage.tsx';
import './index.css';
import { getCurrentRoutePath, withBasePath } from './lib/routes.ts';

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
  path === '/vocational-encyclopedia' ? <VocationalEncyclopediaPage /> :
  <App />;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page}
  </StrictMode>,
);
