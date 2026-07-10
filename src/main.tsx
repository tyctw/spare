import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import LegalPage from './components/LegalPage.tsx';
import './index.css';

const path = window.location.pathname.replace(/\/$/, '');
const page =
  path === '/spare/privacy' ? <LegalPage kind="privacy" /> :
  path === '/spare/terms' ? <LegalPage kind="terms" /> :
  <App />;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page}
  </StrictMode>,
);
