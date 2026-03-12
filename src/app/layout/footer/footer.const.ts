export const FOOTER_SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    url: '#',
  },
  {
    name: 'Twitter',
    icon: 'twitter',
    url: '#',
  },
  {
    name: 'YouTube',
    icon: 'youtube',
    url: '#',
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    url: '#',
  },
] as const;

export const FOOTER_NAV_COLUMNS = [
  {
    key: 'product',
    links: [
      { key: 'aiChat', href: '#' },
      { key: 'smartIrrigation', href: '#' },
      { key: 'cropMonitoring', href: '#' },
      { key: 'marketplace', href: '#' },
      { key: 'export', href: '#' },
    ],
  },
  {
    key: 'company',
    links: [
      { key: 'aboutUs', href: '#' },
      { key: 'careers', href: '#' },
      { key: 'press', href: '#' },
      { key: 'partners', href: '#' },
      { key: 'contact', href: '#' },
    ],
  },
  {
    key: 'resources',
    links: [
      { key: 'blog', href: '#' },
      { key: 'helpCenter', href: '#' },
      { key: 'apiDocs', href: '#' },
      { key: 'community', href: '#' },
      { key: 'webinars', href: '#' },
    ],
  },
  {
    key: 'legal',
    links: [
      { key: 'privacyPolicy', href: '#' },
      { key: 'termsOfService', href: '#' },
      { key: 'cookiePolicy', href: '#' },
      { key: 'security', href: '#' },
    ],
  },
] as const;
