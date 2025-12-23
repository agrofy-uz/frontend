export const STATS_DATA = [
  {
    target: 1000000, // 1M
    suffix: '+',
    label: 'Active Users',
  },
  {
    target: 100000, // 100K
    suffix: '+',
    label: 'Connected Farms',
  },
  {
    target: 50,
    suffix: '+',
    label: 'Countries',
  },
] as const;

export const BENEFITS_DATA = [
  {
    value: '+30%',
    label: 'Average Productivity Increase',
  },
  {
    value: '-25%',
    label: 'Cost Reduction',
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
