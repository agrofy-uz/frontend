import { useAuthStore } from '@/shared/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
