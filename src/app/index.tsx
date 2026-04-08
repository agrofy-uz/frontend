import { useEffect } from 'react';
import { getAuthMe } from '@/shared/api';
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
        updateUser({
          id: String(me.id),
          phone_number: me.phoneNumber || '',
          telegram_id: me.telegramUserId || 0,
          first_name: me.firstName || null,
          last_name: me.lastName || null,
          username: me.telegramUsername || null,
          created_at: me.createdAt || null,
          is_active: true,
          photo_url:
            typeof me.imageUrl === 'string' && me.imageUrl.trim()
              ? me.imageUrl.trim()
              : null,
          premium: Boolean(me.premium),
          premium_expires_at: me.premiumExpiresAt ?? null,
          premium_plan_tier: me.premiumPlanTier ?? null,
          premium_plan_tier_label_uz: me.premiumPlanTierLabelUz ?? null,
          premium_plan_months: me.premiumPlanMonths ?? null,
        });
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
