import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IUser {
  id: string;
  phone_number: string;
  telegram_id: number;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  created_at: string | null;
  is_active: boolean | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: IUser, accessToken: string, refreshToken: string) => void;
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
      login: (user: IUser, accessToken: string, refreshToken: string) => {
        set({
          isAuthenticated: true,
          user,
          accessToken,
          refreshToken,
        });
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
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
