export const PLATFORMS_TITLE = 'Available Everywhere You Need It';

export const PLATFORMS_SUBTITLE =
  'Access Agrofy on any device, anywhere. Your farm data stays synchronized across all platforms.';

export const PLATFORMS = [
  {
    icon: 'web',
    badge: 'Available Now',
    title: 'Web Platform',
    description:
      'Full-featured dashboard accessible from any browser. No downloads required.',
  },
  {
    icon: 'android',
    badge: 'Google Play',
    title: 'Android App',
    description:
      'Native mobile experience optimized for field work. Offline mode included.',
  },
  {
    icon: 'ios',
    badge: 'App Store',
    title: 'iOS App',
    description: 'Seamless iPhone and iPad experience with all core features.',
  },
  {
    icon: 'api',
    badge: 'Developer Ready',
    title: 'API Integrations',
    description:
      'Connect Agrofy with your existing systems. RESTful API with full documentation.',
  },
] as const;
