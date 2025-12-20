import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { Outlet } from 'react-router-dom';

import { Footer } from './footer';
import { Header } from './header';

const Layout = () => {
  return (
    <>
      <Notifications position="top-right" zIndex={1000} autoClose={3000} />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
