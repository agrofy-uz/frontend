import { Route, Routes } from 'react-router-dom';
import Layout from '../layout';
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
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
