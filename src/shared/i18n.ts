import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from '../../locales/en.json';
import ruTranslations from '../../locales/ru.json';
import uzTranslations from '../../locales/uz.json';
import uzcTranslations from '../../locales/uzc.json';

i18n.use(initReactI18next).init({
  lng: 'uz',
  fallbackLng: 'uz',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    uz: {
      translation: uzTranslations,
    },
    uzc: {
      translation: uzcTranslations,
    },
    ru: {
      translation: ruTranslations,
    },
    en: {
      translation: enTranslations,
    },
  },
});

export default i18n;

