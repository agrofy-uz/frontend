import { useEffect } from 'react';
import { getAuthMe, mapAuthMeToUser } from '@/shared/api';
import { useAuthStore } from '@/shared/store/authStore';
import Providers from './providers';
import AppRoutes from './routers';

function AuthBootstrap() {
  const { isAuthenticated, accessToken, updateUser, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    let cancelled = false;

    const syncMe = async () => {
      try {
        const me = await getAuthMe(accessToken);
        if (cancelled) return;
        updateUser(mapAuthMeToUser(me));
      } catch {
        if (!cancelled) {
          logout();
        }
      }
    };

    void syncMe();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, accessToken, updateUser, logout]);

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
