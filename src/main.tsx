import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import './index.css';
import './shared/i18n';
import { initializeLocale } from './shared/lib/language';

const redirect = sessionStorage.getItem('redirect');

if (redirect && location.pathname === '/') {
  sessionStorage.removeItem('redirect');

  requestAnimationFrame(() => {
    window.history.replaceState(null, '', redirect);
  });
}

initializeLocale();

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);
