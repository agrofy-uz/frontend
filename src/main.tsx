import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import './index.css';
import './shared/i18n';
import { initializeLocale } from './shared/lib/language';

const redirect = sessionStorage.getItem('redirect');

if (redirect && location.pathname === '/agrofy/') {
  sessionStorage.removeItem('redirect');

  setTimeout(() => {
    window.history.replaceState(null, '', redirect);
  }, 0);
}

initializeLocale();

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <BrowserRouter basename="/agrofy">
      <App />
    </BrowserRouter>
  </HelmetProvider>
);
