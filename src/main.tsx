import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import './index.css';
import './shared/i18n';
import { initializeLocale } from './shared/lib/language';

initializeLocale();
const savedPath = sessionStorage.getItem('path');

if (savedPath) {
  sessionStorage.removeItem('path');
  window.history.replaceState(null, '', savedPath);
}

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);
