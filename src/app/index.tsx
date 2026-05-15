import { useEffect } from 'react';
import { bootstrapAuthSession } from '@/shared/lib/authSession';
import { useAuthStore, useAuthStoreHydrated } from '@/shared/store/authStore';
import Providers from './providers';
import AppRoutes from './routers';

function AuthBootstrap() {
  const hydrated = useAuthStoreHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!hydrated || !isAuthenticated || !accessToken) return;
    void bootstrapAuthSession();
  }, [hydrated, isAuthenticated, accessToken]);

  return null;
}

const App = () => {
  return (
    <Providers>
      <AuthBootstrap />
      <AppRoutes />
    </Providers>
  );
};

export default App;
