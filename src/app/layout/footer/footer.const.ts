export const FOOTER_LOGO = 'Agrofy';

export const FOOTER_TAGLINE =
  'The complete AI ecosystem for modern agriculture. Empowering farmers worldwide.';

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
    title: 'Product',
    links: [
      { label: 'AI Chat', href: '#' },
      { label: 'Smart Irrigation', href: '#' },
      { label: 'Crop Monitoring', href: '#' },
      { label: 'Marketplace', href: '#' },
      { label: 'Export', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Partners', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'API Docs', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Webinars', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
] as const;

export const FOOTER_COPYRIGHT = `© ${new Date().getFullYear()} Agrofy. All rights reserved.`;

export const FOOTER_LANGUAGE_CURRENCY = 'English USD';
