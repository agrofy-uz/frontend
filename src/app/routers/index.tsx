import { Route, Routes } from 'react-router-dom';
import Layout from '../layout';
import { DashboardLayout } from '../layout/dashboard';
import PrivateRoute from './privateRoute';
import { Home } from '@/pages/home';
import { Dashboard } from '@/pages/dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
      {/* Private route misoli */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
