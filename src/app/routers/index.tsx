import { Route, Routes } from 'react-router-dom';
import Layout from '../layout';
import PrivateRoute from './privateRoute';
import { Home } from '@/pages/home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* Yangi sahifalar shu yerda qo'shishingiz mumkin */}
      </Route>
      {/* Private route misoli */}
      <Route element={<PrivateRoute />}>
        {/* Private sahifalar shu yerda */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
