import { useEffect } from 'react';
import axios from 'axios';
import { getAuthMe, mapAuthMeToUser } from '@/shared/api';
import { useAuthStore } from '@/shared/store/authStore';
import Providers from './providers';
import AppRoutes from './routers';

function shouldLogoutAfterMeFailure(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  return status === 401 || status === 403;
}

function AuthBootstrap() {
  const { isAuthenticated, accessToken, updateUser, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    let cancelled = false;

    const syncMe = async () => {
      try {
        const me = await getAuthMe();
        if (cancelled) return;
        updateUser(mapAuthMeToUser(me));
      } catch (err) {
        if (!cancelled && shouldLogoutAfterMeFailure(err)) {
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
