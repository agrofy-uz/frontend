import { Center, Loader } from '@mantine/core';
import { useAuthStore, useAuthStoreHydrated } from '@/shared/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const hydrated = useAuthStoreHydrated();
  const { isAuthenticated, user } = useAuthStore();

  if (!hydrated) {
    return (
      <Center h="100dvh">
        <Loader size="sm" />
      </Center>
    );
  }

  if (!isAuthenticated || !user?.id?.trim()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
