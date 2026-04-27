import { Route, Routes } from 'react-router-dom';
import Layout from '../layout';
import { DashboardLayout } from '../layout/dashboard';
import PrivateRoute from './privateRoute';
import { Home } from '@/pages/home';
import { Dashboard } from '@/pages/dashboard';
import { AiAssistant } from '@/pages/dashboard/pages/ai-assistant';
// import { Fields } from '@/pages/dashboard/pages/fields';
// import { Reports } from '@/pages/dashboard/pages/reports';
import { Settings } from '@/pages/dashboard/pages/settings';
import { Profile } from '@/pages/dashboard/pages/profile';
import { Pricing } from '@/pages/dashboard/pages/pricing';
import { Services } from '@/pages/dashboard/pages/services';
import { Market } from '@/pages/dashboard/pages/market';
import { MyAds } from '@/pages/dashboard/pages/my-ads';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/ai" element={<AiAssistant />} />
          <Route path="/dashboard/services" element={<Services />} />
          <Route path="/dashboard/market" element={<Market />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/pricing" element={<Pricing />} />
          <Route path="/dashboard/my-ads" element={<MyAds />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
