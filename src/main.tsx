import { createRoot } from 'react-dom/client';

import App from './app';
import './index.css';
import './shared/i18n';
import { initializeLocale } from './shared/lib/language';

initializeLocale();

createRoot(document.getElementById('root')!).render(<App />);

