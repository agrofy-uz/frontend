import { useEffect, useState } from 'react';
import { Center, Loader } from '@mantine/core';
import { bootstrapAuthSession } from '@/shared/lib/authSession';
import { useAuthStore, useAuthStoreHydrated } from '@/shared/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const hydrated = useAuthStoreHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated || !accessToken) {
      setSessionReady(true);
      return;
    }

    let cancelled = false;

    bootstrapAuthSession().finally(() => {
      if (!cancelled) setSessionReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [hydrated, isAuthenticated, accessToken]);

  if (!hydrated || (isAuthenticated && accessToken && !sessionReady)) {
    return (
      <Center h="100dvh">
        <Loader size="sm" />
      </Center>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/" replace />;
  }

  if (!user?.id?.trim()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
