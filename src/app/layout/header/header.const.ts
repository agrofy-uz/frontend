export const LANGUAGES = [
  { value: 'uz', label: "O'zbek", icon: '🇺🇿' },
  { value: 'en', label: 'English', icon: '🇺🇸' },
  { value: 'ru', label: 'Русский', icon: '🇷🇺' },
  { value: 'uzc', label: 'Ўзбекча', icon: '🇺🇿' },
];

export type LanguageValue = 'uz' | 'en' | 'ru' | 'uzc';

export const getLanguageLabel = (value: string) => {
  return LANGUAGES.find((lang) => lang.value === value)?.label || "O'zbek";
};

export const getLanguageIcon = (value: string) => {
  return LANGUAGES.find((lang) => lang.value === value)?.icon || '🇺🇿';
};
