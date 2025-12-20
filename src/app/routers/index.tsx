import { Route, Routes } from 'react-router-dom';
import Layout from '../layout';
import PrivateRoute from './privateRoute';
import { ProfileLayout } from '@/app/layout/profileLayout';
import { Home } from '@/pages/home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route element={<PrivateRoute />}>
          <Route element={<ProfileLayout />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
