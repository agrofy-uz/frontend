import { Route, Routes } from 'react-router-dom';
import Layout from '../layout';
import { DashboardLayout } from '../layout/dashboard';
import PrivateRoute from './privateRoute';
import { Home } from '@/pages/home';
import { Dashboard } from '@/pages/dashboard';
import { AiAssistant } from '@/pages/dashboard/pages/ai-assistant';
import { Fields } from '@/pages/dashboard/pages/fields';
import { Reports } from '@/pages/dashboard/pages/reports';
import { Settings } from '@/pages/dashboard/pages/settings';
import { Profile } from '@/pages/dashboard/pages/profile';
import { Pricing } from '@/pages/dashboard/pages/pricing';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
      {/* Private route misoli */}
      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/home" element={<Dashboard />} />
          <Route path="/dashboard/ai" element={<AiAssistant />} />
          <Route path="/dashboard/fields" element={<Fields />} />
          <Route path="/dashboard/reports" element={<Reports />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/pricing" element={<Pricing />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
