import { Box, Flex, ActionIcon, Drawer } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BsLayoutSidebar } from 'react-icons/bs';
import { SettingsModal } from '@/pages/dashboard/pages/settings';
import { PricingModal } from '@/pages/dashboard/pages/pricing';
import { useSettingsModalStore } from '@/shared/store/settingsModalStore';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import { Sidebar } from './ui/sidebar';
import { DashboardHeader } from './ui/header';
import { MobileDashboardDrawerContext } from './mobile-dashboard-drawer.context';
import styles from './dashboard-layout.module.css';
import { Helmet } from 'react-helmet-async';
const DashboardLayout = () => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [mobileOpened, { open: openMobile, close: closeMobile }] =
    useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 48em)');
  const settingsModalOpened = useSettingsModalStore((s) => s.opened);
  const closeSettingsModal = useSettingsModalStore((s) => s.close);
  const pricingModalOpened = usePricingModalStore((s) => s.opened);
  const closePricingModal = usePricingModalStore((s) => s.close);

  const handleSidebarToggle = () => {
    if (isMobile) {
      openMobile();
      return;
    }

    toggleDesktop();
  };

  /** Mobil sidebar Drawer ochiq bo‘lsa — overlay scroll/touchni pricing ustida ushlab qoladi */
  useEffect(() => {
    if (pricingModalOpened) {
      closeMobile();
    }
  }, [pricingModalOpened, closeMobile]);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <MobileDashboardDrawerContext.Provider
        value={{
          closeMobileDrawer: closeMobile,
          isMobile: Boolean(isMobile),
        }}
      >
        <Flex
          h="100vh"
          className={styles.dashboardLayout}
          style={{ overflow: 'hidden', position: 'relative' }}
        >
          {!isMobile && (
            <Box
              className={styles.sidebar}
              style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: desktopOpened ? 280 : 80,
                height: '100vh',
                transition: 'width 0.2s ease',
                borderRight: '0.5px solid var(--dashboard-border)',
                zIndex: 100,
              }}
            >
              <Sidebar collapsed={!desktopOpened} />
            </Box>
          )}

          <Drawer
            opened={mobileOpened}
            onClose={closeMobile}
            withCloseButton={false}
            position="left"
            size={280}
            padding={0}
            classNames={{
              content: styles.mobileDrawerContent,
              body: styles.mobileDrawerBody,
            }}
            overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
          >
            <Box className={styles.sidebar} h="100%">
              <Sidebar collapsed={false} />
            </Box>
          </Drawer>

          {/* O'ng qism - Header va Content */}
          <Flex
            direction="column"
            className={styles.contentWrapper}
            style={{
              flex: 1,
              overflow: 'hidden',
              marginLeft: isMobile ? 0 : desktopOpened ? 280 : 80,
              transition: 'margin-left 0.2s ease',
            }}
          >
            {/* Header */}
            <Box
              className={styles.header}
              style={{
                height: 60,
                borderBottom: '0.5px solid var(--dashboard-border)',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '10px',
                paddingRight: '20px',
              }}
            >
              <ActionIcon
                variant="subtle"
                size="lg"
                mr="md"
                onClick={handleSidebarToggle}
              >
                <BsLayoutSidebar size={21} className="textPrimary" />
              </ActionIcon>
              <Box style={{ flex: 1 }}>
                <DashboardHeader />
              </Box>
            </Box>

            {/* Content */}
            <Box
              className={styles.content}
              style={{
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
                padding: '1rem',
              }}
            >
              <Outlet />
            </Box>
          </Flex>
        </Flex>
      </MobileDashboardDrawerContext.Provider>
      <SettingsModal opened={settingsModalOpened} onClose={closeSettingsModal} />
      <PricingModal opened={pricingModalOpened} onClose={closePricingModal} />
    </>
  );
};

export default DashboardLayout;
