import { Box, Flex, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { BsLayoutSidebar } from 'react-icons/bs';
import { Sidebar } from './ui/sidebar';
import { DashboardHeader } from './ui/header';
import styles from './dashboard-layout.module.css';

const DashboardLayout = () => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <Flex
      h="100vh"
      className={styles.dashboardLayout}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      {/* Sidebar - chapda to'liq balandlikka */}
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

      {/* O'ng qism - Header va Content */}
      <Flex
        direction="column"
        className={styles.contentWrapper}
        style={{
          flex: 1,
          overflow: 'hidden',
          marginLeft: desktopOpened ? 280 : 80,
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
            onClick={toggleDesktop}
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
            overflow: 'auto',
            padding: '1rem',
          }}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
