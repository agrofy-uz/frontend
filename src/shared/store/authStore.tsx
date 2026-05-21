import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { resetSessionBootstrap } from '@/shared/lib/authSession';

export interface IUser {
  id: string;
  phone_number: string;
  telegram_id: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  created_at: string | null;
  is_active: boolean | null;
  /** Login / verify javobidagi `photoUrl` */
  photo_url?: string | null;
  premium?: boolean;
  premium_expires_at?: string | null;
  premium_plan_tier?: string | null;
  premium_plan_tier_label_uz?: string | null;
  premium_plan_months?: number | null;
  /** `aiChatLimited` — shu vaqtgacha AI chat yuborish bloklangan (ISO) */
  ai_chat_limited_until?: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessExpiresAt: string | null;
  refreshExpiresAt: string | null;
  forcedLogoutAt: string | null;
  login: (
    user: IUser,
    accessToken: string,
    refreshToken: string,
    meta?: {
      accessExpiresAt?: string | null;
      refreshExpiresAt?: string | null;
      forcedLogoutAt?: string | null;
    }
  ) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      accessExpiresAt: null,
      refreshExpiresAt: null,
      forcedLogoutAt: null,
      login: (user: IUser, accessToken: string, refreshToken: string, meta) => {
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
          accessExpiresAt: meta?.accessExpiresAt ?? null,
          refreshExpiresAt: meta?.refreshExpiresAt ?? null,
          forcedLogoutAt: meta?.forcedLogoutAt ?? null,
        });
      },
      logout: () => {
        resetSessionBootstrap();
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          accessExpiresAt: null,
          refreshExpiresAt: null,
          forcedLogoutAt: null,
        });
      },
      updateUser: (user: IUser) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

/** `persist` localStorage'dan qayta yuklanguncha auth `null` — API chaqiruvlardan oldin kutish kerak */
export function useAuthStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return undefined;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  return hydrated;
}
