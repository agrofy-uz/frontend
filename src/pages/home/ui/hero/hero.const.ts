export const HERO_STATS = [
  {
    target: 1000000, // 1M
    suffix: '+',
    label: 'Active Users',
  },
  {
    target: 100000, // 100K
    suffix: '+',
    label: 'Farms',
  },
  {
    target: 50,
    suffix: '+',
    label: 'Countries',
  },
] as const;

// Format number with K, M suffixes
export const formatNumber = (num: number, target: number): string => {
  if (target >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (target >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return Math.floor(num).toString();
};
