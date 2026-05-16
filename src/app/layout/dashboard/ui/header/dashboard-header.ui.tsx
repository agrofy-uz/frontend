import { Box, Flex, Text, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { HiLightningBolt } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import { SearchInput } from '@/pages/dashboard/pages/services/ui/search-input/search-input.ui';
import { MarketSearchInput } from '@/pages/dashboard/pages/market/ui/search-input/search-input.ui';
import { useAuthStore } from '@/shared/store/authStore';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import styles from './dashboard-header.module.css';

const isServicesRoute = (pathname: string) =>
  pathname === '/dashboard/services' ||
  pathname.startsWith('/dashboard/services/');

const isMarketRoute = (pathname: string) =>
  pathname === '/dashboard/market' || pathname.startsWith('/dashboard/market/');

const DashboardHeader = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const openPricingModal = usePricingModalStore((s) => s.open);
  const showServicesSearch = isServicesRoute(location.pathname);
  const showMarketSearch = isMarketRoute(location.pathname);
  const isMobile = useMediaQuery('(max-width: 1000px)');
  const showPremiumCta = !user?.premium;

  const getPageName = () => {
    const pathname = location.pathname;
    if (pathname === '/dashboard' || pathname === '/dashboard') {
      return 'Boshqaruv paneli';
    }
    if (pathname === '/dashboard/ai') return 'AI yordamchi';
    if (pathname === '/dashboard/services') return 'Xizmatlar';
    if (pathname === '/dashboard/market') return 'Mahsulotlar';
    if (pathname === '/dashboard/reports') return 'Hisobotlar';
    if (pathname === '/dashboard/my-ads') return "Mening e'lonlarim";
    if (pathname === '/dashboard/profile') return 'Profil';
    return 'Boshqaruv paneli';
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      gap="md"
      wrap="nowrap"
      w="100%"
      style={{ minWidth: 0 }}
    >
      <Box miw={0} style={{ flex: '1 1 auto' }}>
        <Text
          fw={700}
          fz={isMobile ? 'md' : 'lg'}
          className="textPrimary"
          lineClamp={1}
        >
          {getPageName()}
        </Text>
      </Box>

      {showServicesSearch && !isMobile && (
        <Box
          miw={0}
          style={{
            flex: '1 1 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 'min(100%, 28rem)',
          }}
        >
          <SearchInput />
        </Box>
      )}

      {showMarketSearch && !isMobile && (
        <Box
          miw={0}
          style={{
            flex: '1 1 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 'min(100%, 28rem)',
          }}
        >
          <MarketSearchInput />
        </Box>
      )}

      {showPremiumCta && (
        <UnstyledButton
          type="button"
          className={styles.premiumCta}
          onClick={openPricingModal}
          aria-label={t('header.getPremium')}
          style={{ flexShrink: 0 }}
        >
          <HiLightningBolt size={14} aria-hidden />
          <span className={styles.premiumCtaLabel}>
            {t('header.getPremium')}
          </span>
        </UnstyledButton>
      )}
    </Flex>
  );
};

export default DashboardHeader;
