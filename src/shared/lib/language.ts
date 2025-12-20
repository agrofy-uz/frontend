import { localStorageHelper } from './localStorage';

import i18n from '@/shared/i18n';

type TLocale = 'uz' | 'ru' | 'en';

export function changeLocale(locale: TLocale) {
  i18n.changeLanguage(locale);
  localStorageHelper.set('language', locale);
}

export function getCurrentLocale(): string {
  const currLang = localStorageHelper.get('language') as string;
  return currLang || 'uz';
}

export function initializeLocale() {
  const savedLocale = localStorageHelper.get<TLocale>('language');
  if (savedLocale) {
    i18n.changeLanguage(savedLocale);
  }
}

