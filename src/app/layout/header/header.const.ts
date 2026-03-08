export const LANGUAGES = [
  { value: 'uz', label: "O'zbek", icon: '🇺🇿' },
  { value: 'eng', label: 'English', icon: '🇺🇸' },
  { value: 'ru', label: 'Русский', icon: '🇷🇺' },
  { value: 'kril', label: 'Ўзбекча', icon: '🇺🇿' },
];

export type LanguageValue = 'uz' | 'eng' | 'ru' | 'kril';

export const getLanguageLabel = (value: string) => {
  return LANGUAGES.find((lang) => lang.value === value)?.label || "O'zbek";
};

export const getLanguageIcon = (value: string) => {
  return LANGUAGES.find((lang) => lang.value === value)?.icon || '🇺🇿';
};
