import { useEffect, useState } from 'react';

import { localStorageHelper } from '@/shared/lib/localStorage';

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // LocalStorage dan history ni yuklash
  useEffect(() => {
    const saved = localStorageHelper.get<string[]>('searchHistory');
    if (saved) {
      setSearchHistory(saved);
    }
  }, []);

  // History ga qo'shish funksiyasi
  const addToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const newHistory = [
      searchTerm,
      ...searchHistory.filter((item) => item !== searchTerm),
    ].slice(0, 5); // Faqat oxirgi 5 ta

    setSearchHistory(newHistory);
    localStorageHelper.set('searchHistory', newHistory);
  };

  // History dan bir itemni o'chirish
  const removeFromHistory = (index: number) => {
    const newHistory = searchHistory.filter((_, i) => i !== index);
    setSearchHistory(newHistory);
    localStorageHelper.set('searchHistory', newHistory);
  };

  // Barcha historyni tozalash
  const clearHistory = () => {
    setSearchHistory([]);
    localStorageHelper.remove('searchHistory');
  };

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
};
