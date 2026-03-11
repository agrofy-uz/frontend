export const STATS_DATA = [
  {
    target: 1000000, // 1M
    suffix: '+',
    key: 'activeUsers',
  },
  {
    target: 100000, // 100K
    suffix: '+',
    key: 'connectedFarms',
  },
  {
    target: 50,
    suffix: '+',
    key: 'countries',
  },
] as const;

export const BENEFITS_DATA = [
  {
    value: '+30%',
    key: 'productivity',
  },
  {
    value: '-25%',
    key: 'costReduction',
  },
] as const;

export const PARTNERS_DATA = [
  'AgriTech Corp',
  'FarmFirst',
  'Global Seeds',
  'CropGuard',
  'AquaSmart',
  'HarvestPro',
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
