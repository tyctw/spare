import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import ChangelogPage from './components/ChangelogPage.tsx';
import HollandPage from './components/HollandPage.tsx';
import LegalPage from './components/LegalPage.tsx';
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
  path === '/changelog' ? <ChangelogPage /> :
  path === '/holland' ? <HollandPage /> :
  path === '/school-types' ? <SchoolTypesPage /> :
  path === '/vocational-encyclopedia' ? <VocationalEncyclopediaPage /> :
  <App />;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page}
  </StrictMode>,
);
